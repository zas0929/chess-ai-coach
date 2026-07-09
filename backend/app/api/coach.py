from fastapi import APIRouter

from app.models.coach import (
    CoachExplainRequest,
    CoachExplainResponse,
)
from app.services.coach.coach_service import coach_service

router = APIRouter()


@router.post("/explain", response_model=CoachExplainResponse)
def explain(data: CoachExplainRequest):
    return coach_service.explain(data)
