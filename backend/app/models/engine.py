from typing import Optional

from pydantic import BaseModel

DEFAULT_SKILL_LEVEL = 6
DEFAULT_MOVE_TIME = 400
DEFAULT_DEPTH = 8


class EngineSettings(BaseModel):
    skill_level: int = DEFAULT_SKILL_LEVEL
    move_time: int = DEFAULT_MOVE_TIME
    depth: int = DEFAULT_DEPTH


class MoveRequest(BaseModel):
    fen: str
    settings: Optional[EngineSettings] = None


class EvaluateRequest(BaseModel):
    fen: str
    settings: Optional[EngineSettings] = None

class AnalyzeMoveRequest(BaseModel):
    fen_before: str
    fen_after: str
    settings: Optional[EngineSettings] = None
