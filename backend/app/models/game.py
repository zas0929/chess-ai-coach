from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


class LastMove(BaseModel):
    from_square: str = Field(alias="from")
    to: str

    model_config = {
        "populate_by_name": True,
    }


class GameSettings(BaseModel):
    skill_level: int
    move_time: int
    depth: int


class GameSnapshot(BaseModel):
    fen: str
    moves: list[str] = Field(default_factory=list)
    player_color: Literal["white", "black"]
    evaluation: float = 0
    evaluation_history: list[dict] = Field(default_factory=list)
    last_move: Optional[dict] = None
    game_status: Literal[
        "playing",
        "check",
        "checkmate",
        "draw",
        "stalemate",
    ] = "playing"
    winner: Optional[Literal["white", "black"]] = None
    settings: GameSettings


class ActiveGameResponse(GameSnapshot):
    id: str
    status: Literal["active", "completed"]
    updated_at: datetime


class PlayerStatsResponse(BaseModel):
    games_played: int
    active_games: int
    completed_games: int
    wins: int
    losses: int
    draws: int
    ai_requests: int
    total_tokens: int
    level: int
