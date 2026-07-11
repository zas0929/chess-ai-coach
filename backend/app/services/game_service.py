from datetime import datetime
from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.db.models import AIUsage, PlayerGame, UserProfile
from app.models.game import (
    ActiveGameResponse,
    GameSnapshot,
    PlayerStatsResponse,
)


class GameService:
    def get_active_game(
        self,
        db: Optional[Session],
        user: CurrentUser,
    ) -> Optional[ActiveGameResponse]:
        if not db:
            return None

        game = (
            db.query(PlayerGame)
            .filter(
                PlayerGame.user_id == user.id,
                PlayerGame.status == "active",
            )
            .order_by(PlayerGame.updated_at.desc())
            .first()
        )

        return self._to_response(game) if game else None

    def save_active_game(
        self,
        db: Optional[Session],
        user: CurrentUser,
        snapshot: GameSnapshot,
    ) -> ActiveGameResponse:
        if not db:
            raise RuntimeError("DATABASE_URL is not configured")

        self._ensure_profile(db, user)

        active_game = (
            db.query(PlayerGame)
            .filter(
                PlayerGame.user_id == user.id,
                PlayerGame.status == "active",
            )
            .order_by(PlayerGame.updated_at.desc())
            .first()
        )

        is_completed = snapshot.game_status in {
            "checkmate",
            "draw",
            "stalemate",
        }

        if not active_game:
            active_game = PlayerGame(
                user_id=user.id,
                fen=snapshot.fen,
            )
            db.add(active_game)

        active_game.player_color = snapshot.player_color
        active_game.fen = snapshot.fen
        active_game.moves = snapshot.moves
        active_game.evaluation = snapshot.evaluation
        active_game.evaluation_history = snapshot.evaluation_history
        active_game.last_move = snapshot.last_move
        active_game.game_status = snapshot.game_status
        active_game.winner = snapshot.winner
        active_game.settings = snapshot.settings.model_dump()
        active_game.status = "completed" if is_completed else "active"
        active_game.updated_at = datetime.utcnow()

        if is_completed and not active_game.completed_at:
            active_game.completed_at = datetime.utcnow()

        db.commit()
        db.refresh(active_game)

        return self._to_response(active_game)

    def start_new_game(
        self,
        db: Optional[Session],
        user: CurrentUser,
        snapshot: GameSnapshot,
    ) -> ActiveGameResponse:
        if not db:
            raise RuntimeError("DATABASE_URL is not configured")

        self._ensure_profile(db, user)

        (
            db.query(PlayerGame)
            .filter(
                PlayerGame.user_id == user.id,
                PlayerGame.status == "active",
            )
            .update(
                {
                    "status": "completed",
                    "completed_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                },
            )
        )

        game = PlayerGame(
            user_id=user.id,
            player_color=snapshot.player_color,
            fen=snapshot.fen,
            moves=snapshot.moves,
            evaluation=snapshot.evaluation,
            evaluation_history=snapshot.evaluation_history,
            last_move=snapshot.last_move,
            game_status=snapshot.game_status,
            winner=snapshot.winner,
            settings=snapshot.settings.model_dump(),
        )

        db.add(game)
        db.commit()
        db.refresh(game)

        return self._to_response(game)

    def get_stats(
        self,
        db: Optional[Session],
        user: CurrentUser,
    ) -> PlayerStatsResponse:
        if not db:
            return PlayerStatsResponse(
                games_played=0,
                active_games=0,
                completed_games=0,
                wins=0,
                losses=0,
                draws=0,
                ai_requests=0,
                total_tokens=0,
                level=1,
            )

        games_played = (
            db.query(func.count(PlayerGame.id))
            .filter(PlayerGame.user_id == user.id)
            .scalar()
            or 0
        )
        active_games = (
            db.query(func.count(PlayerGame.id))
            .filter(
                PlayerGame.user_id == user.id,
                PlayerGame.status == "active",
            )
            .scalar()
            or 0
        )
        completed_games = max(games_played - active_games, 0)
        wins = (
            db.query(func.count(PlayerGame.id))
            .filter(
                PlayerGame.user_id == user.id,
                PlayerGame.status == "completed",
                PlayerGame.winner == PlayerGame.player_color,
            )
            .scalar()
            or 0
        )
        losses = (
            db.query(func.count(PlayerGame.id))
            .filter(
                PlayerGame.user_id == user.id,
                PlayerGame.status == "completed",
                PlayerGame.winner.isnot(None),
                PlayerGame.winner != PlayerGame.player_color,
            )
            .scalar()
            or 0
        )
        draws = (
            db.query(func.count(PlayerGame.id))
            .filter(
                PlayerGame.user_id == user.id,
                PlayerGame.status == "completed",
                PlayerGame.winner.is_(None),
            )
            .scalar()
            or 0
        )
        ai_requests = (
            db.query(func.count(AIUsage.id))
            .filter(AIUsage.user_id == user.id)
            .scalar()
            or 0
        )
        total_tokens = (
            db.query(func.coalesce(func.sum(AIUsage.total_tokens), 0))
            .filter(AIUsage.user_id == user.id)
            .scalar()
            or 0
        )

        return PlayerStatsResponse(
            games_played=games_played,
            active_games=active_games,
            completed_games=completed_games,
            wins=wins,
            losses=losses,
            draws=draws,
            ai_requests=ai_requests,
            total_tokens=total_tokens,
            level=max(1, completed_games // 3 + ai_requests // 10 + 1),
        )

    def _ensure_profile(
        self,
        db: Session,
        user: CurrentUser,
    ) -> None:
        existing = db.get(UserProfile, user.id)

        if existing:
            if user.email and existing.email != user.email:
                existing.email = user.email
            return

        db.add(
            UserProfile(
                id=user.id,
                email=user.email,
            ),
        )

    def _to_response(self, game: PlayerGame) -> ActiveGameResponse:
        return ActiveGameResponse(
            id=game.id,
            status=game.status,
            updated_at=game.updated_at,
            fen=game.fen,
            moves=game.moves or [],
            player_color=game.player_color,
            evaluation=game.evaluation,
            evaluation_history=game.evaluation_history or [],
            last_move=game.last_move,
            game_status=game.game_status,
            winner=game.winner,
            settings=game.settings or {
                "skill_level": 6,
                "move_time": 1000,
                "depth": 8,
            },
        )


game_service = GameService()
