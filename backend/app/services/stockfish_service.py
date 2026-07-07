import time

from stockfish import Stockfish

from app.core.config import settings


class StockfishService:

    def __init__(self):

        self.engine = Stockfish(
            path=settings.STOCKFISH_PATH
        )

        self.engine.set_skill_level(10)


    def best_move(self, fen: str):

        start_time = time.time()

        self.engine.set_fen_position(fen)

        move = self.engine.get_best_move()

        evaluation = self.engine.get_evaluation()

        elapsed = time.time() - start_time

        return {
            "move": move,

            "evaluation": evaluation,

            "stats": {
                "time": round(elapsed, 3),
                "skill_level": 10,
            }
        }


stockfish_service = StockfishService()
