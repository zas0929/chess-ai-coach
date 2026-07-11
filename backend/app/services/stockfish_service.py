import time

from stockfish import Stockfish

from app.core.config import settings
from app.models.engine import (
    DEFAULT_DEPTH,
    DEFAULT_MOVE_TIME,
    DEFAULT_SKILL_LEVEL,
)

class StockfishService:

    def __init__(self):
        self.engine = Stockfish(
            path=settings.stockfish_path
        )

        self.engine.set_skill_level(DEFAULT_SKILL_LEVEL)

    def best_move(self, fen: str, engine_settings=None):
        start_time = time.time()

        skill_level = DEFAULT_SKILL_LEVEL
        move_time = DEFAULT_MOVE_TIME
        depth = DEFAULT_DEPTH

        if engine_settings:
            skill_level = engine_settings.skill_level
            move_time = engine_settings.move_time
            depth = engine_settings.depth

        self.engine.set_skill_level(skill_level)
        self.engine.set_depth(depth)
        self.engine.set_fen_position(fen)

        move = self.engine.get_best_move_time(move_time)
        evaluation = self.engine.get_evaluation()

        elapsed = time.time() - start_time

        return {
            "move": move,
            "evaluation": evaluation,
            "stats": {
                "time": round(elapsed, 3),
                "skill_level": skill_level,
                "depth": depth,
                "move_time": move_time,
            }
        }

    def evaluate(self, fen: str, engine_settings=None):
        start_time = time.time()

        skill_level = DEFAULT_SKILL_LEVEL
        depth = DEFAULT_DEPTH

        if engine_settings:
            skill_level = engine_settings.skill_level
            depth = engine_settings.depth

        self.engine.set_skill_level(skill_level)
        self.engine.set_depth(depth)
        self.engine.set_fen_position(fen)

        evaluation = self.engine.get_evaluation()

        elapsed = time.time() - start_time

        best_move = self.engine.get_best_move()

        return {
            "evaluation": evaluation,
            "best_move": best_move,
            "stats": {
                "time": round(elapsed, 3),
                "skill_level": skill_level,
                "depth": depth,
            }
        }

    def analyze_move(self, fen_before: str, fen_after: str, engine_settings=None):
        start_time = time.time()

        skill_level = DEFAULT_SKILL_LEVEL
        depth = DEFAULT_DEPTH

        if engine_settings:
            skill_level = engine_settings.skill_level
            depth = engine_settings.depth

        self.engine.set_skill_level(skill_level)
        self.engine.set_depth(depth)

        self.engine.set_fen_position(fen_before)
        best_move = self.engine.get_best_move()

        self.engine.set_fen_position(fen_after)
        evaluation = self.engine.get_evaluation()

        elapsed = time.time() - start_time

        return {
            "evaluation": evaluation,
            "best_move": best_move,
            "stats": {
                "time": round(elapsed, 3),
                "skill_level": skill_level,
                "depth": depth,
            }
        }

stockfish_service = StockfishService()
