from typing import Optional

from pydantic import BaseModel


class CoachExplainRequest(BaseModel):
    fen: str
    move: str
    best_move: Optional[str] = None
    classification: Optional[str] = None
    previous_value: Optional[float] = None
    value: float
    eval_change: float


class CoachExplainResponse(BaseModel):
    explanation: str
