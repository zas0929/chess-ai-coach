from typing import Optional

from pydantic import BaseModel


class EngineSettings(BaseModel):
    skill_level: int = 10
    move_time: int = 500
    depth: int = 12


class MoveRequest(BaseModel):
    fen: str
    settings: Optional[EngineSettings] = None
