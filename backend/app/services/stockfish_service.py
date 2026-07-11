import time
import subprocess

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

    def insight(self, fen: str, engine_settings=None, multipv: int = 3):
        start_time = time.time()

        skill_level = DEFAULT_SKILL_LEVEL
        depth = DEFAULT_DEPTH

        if engine_settings:
            skill_level = engine_settings.skill_level
            depth = engine_settings.depth

        multipv = max(1, min(multipv, 5))

        lines = self._get_multipv_lines(
            fen=fen,
            skill_level=skill_level,
            depth=depth,
            multipv=multipv,
        )

        elapsed = time.time() - start_time
        top_moves = [
            {
                "move": line["pv"][0],
                "evaluation": line["evaluation"],
                "line": line["pv"],
            }
            for line in lines
            if line["pv"]
        ]

        return {
            "fen": fen,
            "evaluation": (
                top_moves[0]["evaluation"]
                if top_moves
                else {"type": "cp", "value": 0}
            ),
            "best_move": top_moves[0]["move"] if top_moves else None,
            "top_moves": top_moves,
            "stats": {
                "time": round(elapsed, 3),
                "skill_level": skill_level,
                "depth": depth,
                "multipv": multipv,
            },
        }

    def _get_multipv_lines(
        self,
        fen: str,
        skill_level: int,
        depth: int,
        multipv: int,
    ):
        process = subprocess.Popen(
            [settings.stockfish_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,
        )

        assert process.stdin is not None
        assert process.stdout is not None

        latest_by_multipv = {}

        def send(command: str) -> None:
            process.stdin.write(f"{command}\n")
            process.stdin.flush()

        try:
            send("uci")
            self._read_until(process, "uciok")
            send(f"setoption name Skill Level value {skill_level}")
            send(f"setoption name MultiPV value {multipv}")
            send("isready")
            self._read_until(process, "readyok")
            send(f"position fen {fen}")
            send(f"go depth {depth}")

            for raw_line in process.stdout:
                line = raw_line.strip()

                if line.startswith("bestmove"):
                    break

                parsed = self._parse_multipv_info(line)

                if parsed:
                    latest_by_multipv[parsed["multipv"]] = parsed
        finally:
            send("quit")
            process.wait(timeout=2)

        return [
            latest_by_multipv[key]
            for key in sorted(latest_by_multipv)
        ]

    def _read_until(self, process, marker: str) -> None:
        assert process.stdout is not None

        for raw_line in process.stdout:
            if marker in raw_line:
                return

    def _parse_multipv_info(self, line: str):
        if " multipv " not in line or " pv " not in line:
            return None

        tokens = line.split()

        try:
            multipv = int(tokens[tokens.index("multipv") + 1])
            score_index = tokens.index("score")
            score_type = tokens[score_index + 1]
            score_value = int(tokens[score_index + 2])
            pv_index = tokens.index("pv")
            pv = tokens[pv_index + 1:]
        except (ValueError, IndexError):
            return None

        return {
            "multipv": multipv,
            "evaluation": {
                "type": "mate" if score_type == "mate" else "cp",
                "value": score_value,
            },
            "pv": pv,
        }

stockfish_service = StockfishService()
