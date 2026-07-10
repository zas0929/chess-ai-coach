from fastapi import APIRouter

from app.models.coach import (
    CoachChatRequest,
    CoachChatResponse,
    CoachExplainRequest,
    CoachExplainResponse,
)
from app.services.coach.coach_service import coach_service

router = APIRouter()


@router.post("/explain", response_model=CoachExplainResponse)
def explain(data: CoachExplainRequest):
    return coach_service.explain(data)


@router.post("/chat", response_model=CoachChatResponse)
def chat(data: CoachChatRequest):
    return coach_service.chat(data)
