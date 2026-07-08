import time

from stockfish import Stockfish

from app.core.config import settings

class StockfishService:

    def __init__(self):
        self.engine = Stockfish(
            path=settings.STOCKFISH_PATH
        )

        self.engine.set_skill_level(10)

    def best_move(self, fen: str, engine_settings=None):
        start_time = time.time()

        skill_level = 10
        move_time = 500
        depth = 12

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

        skill_level = 10
        depth = 12

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

stockfish_service = StockfishService()
