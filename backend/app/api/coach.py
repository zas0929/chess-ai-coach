from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, get_current_user
from app.core.config import settings
from app.db.session import get_db
from app.models.coach import (
    CoachChatRequest,
    CoachChatResponse,
    CoachExplainRequest,
    CoachExplainResponse,
)
from app.services.coach.coach_service import coach_service
from app.services.usage_service import (
    UsageLimitExceeded,
    usage_service,
)

router = APIRouter()


@router.post("/explain", response_model=CoachExplainResponse)
def explain(
    data: CoachExplainRequest,
    db: Optional[Session] = Depends(get_db),
    user: Optional[CurrentUser] = Depends(get_current_user),
):
    try:
        usage_service.ensure_can_use_ai(db, user)
    except UsageLimitExceeded as error:
        raise HTTPException(
            status_code=402,
            detail="Free AI coach limit exceeded",
        ) from error

    response = coach_service.explain(data)
    response.quota = usage_service.track_ai_call(
        db,
        user,
        endpoint="coach.explain",
        model=settings.openai_model,
        usage=response.usage,
    )

    return response


@router.post("/chat", response_model=CoachChatResponse)
def chat(
    data: CoachChatRequest,
    db: Optional[Session] = Depends(get_db),
    user: Optional[CurrentUser] = Depends(get_current_user),
):
    try:
        usage_service.ensure_can_use_ai(db, user)
    except UsageLimitExceeded as error:
        raise HTTPException(
            status_code=402,
            detail="Free AI coach limit exceeded",
        ) from error

    response = coach_service.chat(data)
    response.quota = usage_service.track_ai_call(
        db,
        user,
        endpoint="coach.chat",
        model=settings.openai_model,
        usage=response.usage,
    )

    return response
