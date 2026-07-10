from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.config import settings
from app.db.models import (
    AIUsage,
    BillingSubscription,
    UserProfile,
)
from app.models.coach import AIUsageInfo, QuotaInfo


class UsageLimitExceeded(Exception):
    pass


class UsageService:
    def get_quota(
        self,
        db: Optional[Session],
        user: Optional[CurrentUser],
    ) -> QuotaInfo:
        if not db or not user:
            return QuotaInfo(
                used=0,
                limit=settings.free_ai_requests,
                remaining=settings.free_ai_requests,
                enforced=False,
            )

        if self._has_active_subscription(db, user.id):
            used = self._count_user_requests(db, user.id)

            return QuotaInfo(
                used=used,
                limit=settings.free_ai_requests,
                remaining=settings.free_ai_requests,
                enforced=False,
            )

        used = self._count_user_requests(db, user.id)

        return QuotaInfo(
            used=used,
            limit=settings.free_ai_requests,
            remaining=max(settings.free_ai_requests - used, 0),
            enforced=True,
        )

    def ensure_can_use_ai(
        self,
        db: Optional[Session],
        user: Optional[CurrentUser],
    ) -> None:
        quota = self.get_quota(db, user)

        if quota.enforced and quota.remaining <= 0:
            raise UsageLimitExceeded()

    def track_ai_call(
        self,
        db: Optional[Session],
        user: Optional[CurrentUser],
        endpoint: str,
        model: str,
        usage: Optional[AIUsageInfo],
    ) -> QuotaInfo:
        if not db or not user:
            return self.get_quota(db, user)

        self._ensure_profile(db, user)

        db.add(
            AIUsage(
                user_id=user.id,
                endpoint=endpoint,
                model=model,
                input_tokens=usage.input_tokens if usage else 0,
                output_tokens=usage.output_tokens if usage else 0,
                total_tokens=usage.total_tokens if usage else 0,
            ),
        )
        db.commit()

        return self.get_quota(db, user)

    def _count_user_requests(
        self,
        db: Session,
        user_id: str,
    ) -> int:
        return (
            db.query(func.count(AIUsage.id))
            .filter(AIUsage.user_id == user_id)
            .scalar()
            or 0
        )

    def _ensure_profile(
        self,
        db: Session,
        user: CurrentUser,
    ) -> None:
        existing = db.get(UserProfile, user.id)

        if existing:
            if user.email and existing.email != user.email:
                existing.email = user.email
            return

        db.add(
            UserProfile(
                id=user.id,
                email=user.email,
            ),
        )

    def _has_active_subscription(
        self,
        db: Session,
        user_id: str,
    ) -> bool:
        subscription = db.get(BillingSubscription, user_id)

        return bool(
            subscription and
            subscription.status in {"active", "trialing"},
        )


usage_service = UsageService()
