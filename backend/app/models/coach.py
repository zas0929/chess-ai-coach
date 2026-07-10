from typing import Literal, Optional

from pydantic import BaseModel, Field


class CoachContext(BaseModel):
    fen_before: str
    fen_after: str
    move: str
    move_number: int
    side: Literal["white", "black"]
    player: Literal["white", "black"]
    engine: Literal["white", "black"]
    classification: Optional[str] = None
    evaluation_before: Optional[float] = None
    evaluation_after: float
    evaluation_change: float
    best_move: Optional[str] = None
    opening: Optional[str] = None
    history: list[str] = Field(default_factory=list)


class CoachExplainRequest(CoachContext):
    pass


class AIUsageInfo(BaseModel):
    input_tokens: int = 0
    output_tokens: int = 0
    total_tokens: int = 0


class QuotaInfo(BaseModel):
    used: int
    limit: int
    remaining: int
    enforced: bool


class CoachExplainResponse(BaseModel):
    title: str
    explanation: str
    tip: str
    theme: str
    usage: Optional[AIUsageInfo] = None
    quota: Optional[QuotaInfo] = None


class CoachChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class CoachChatRequest(BaseModel):
    context: CoachContext
    messages: list[CoachChatMessage]


class CoachChatResponse(BaseModel):
    answer: str
    usage: Optional[AIUsageInfo] = None
    quota: Optional[QuotaInfo] = None
