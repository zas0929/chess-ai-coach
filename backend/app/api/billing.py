from typing import Optional

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, get_current_user
from app.core.config import settings
from app.db.models import BillingSubscription
from app.db.session import get_db
from app.models.billing import (
    BillingPortalResponse,
    CheckoutSessionResponse,
)

router = APIRouter()


def _require_billing_config() -> None:
    if not settings.stripe_secret_key:
        raise HTTPException(
            status_code=500,
            detail="STRIPE_SECRET_KEY is not configured",
        )

    stripe.api_key = settings.stripe_secret_key


@router.post("/checkout", response_model=CheckoutSessionResponse)
def create_checkout_session(
    db: Optional[Session] = Depends(get_db),
    user: Optional[CurrentUser] = Depends(get_current_user),
):
    _require_billing_config()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
        )

    if not settings.stripe_price_id:
        raise HTTPException(
            status_code=500,
            detail="STRIPE_PRICE_ID is not configured",
        )

    session = stripe.checkout.Session.create(
        mode="subscription",
        customer_email=user.email,
        client_reference_id=user.id,
        line_items=[
            {
                "price": settings.stripe_price_id,
                "quantity": 1,
            },
        ],
        success_url=settings.billing_success_url,
        cancel_url=settings.billing_cancel_url,
        metadata={
            "user_id": user.id,
        },
    )

    return CheckoutSessionResponse(url=session.url)


@router.post("/portal", response_model=BillingPortalResponse)
def create_billing_portal_session(
    db: Optional[Session] = Depends(get_db),
    user: Optional[CurrentUser] = Depends(get_current_user),
):
    _require_billing_config()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
        )

    if not db:
        raise HTTPException(
            status_code=500,
            detail="DATABASE_URL is not configured",
        )

    subscription = db.get(BillingSubscription, user.id)

    if not subscription or not subscription.stripe_customer_id:
        raise HTTPException(
            status_code=404,
            detail="Stripe customer not found",
        )

    portal = stripe.billing_portal.Session.create(
        customer=subscription.stripe_customer_id,
        return_url=settings.frontend_origin,
    )

    return BillingPortalResponse(url=portal.url)


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Optional[Session] = Depends(get_db),
):
    _require_billing_config()

    if not settings.stripe_webhook_secret:
        raise HTTPException(
            status_code=500,
            detail="STRIPE_WEBHOOK_SECRET is not configured",
        )

    if not db:
        raise HTTPException(
            status_code=500,
            detail="DATABASE_URL is not configured",
        )

    payload = await request.body()
    signature = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload,
            signature,
            settings.stripe_webhook_secret,
        )
    except (ValueError, stripe.SignatureVerificationError) as error:
        raise HTTPException(
            status_code=400,
            detail="Invalid Stripe webhook",
        ) from error

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = (
            session.get("client_reference_id")
            or session.get("metadata", {}).get("user_id")
        )

        if user_id:
            subscription = (
                db.get(BillingSubscription, user_id)
                or BillingSubscription(user_id=user_id)
            )
            subscription.stripe_customer_id = session.get("customer")
            subscription.stripe_subscription_id = session.get(
                "subscription",
            )
            subscription.status = "active"
            db.merge(subscription)
            db.commit()

    if event["type"] in {
        "customer.subscription.deleted",
        "customer.subscription.updated",
    }:
        stripe_subscription = event["data"]["object"]
        subscription = (
            db.query(BillingSubscription)
            .filter(
                BillingSubscription.stripe_subscription_id
                == stripe_subscription.get("id"),
            )
            .first()
        )

        if subscription:
            subscription.status = stripe_subscription.get(
                "status",
                "unknown",
            )
            db.commit()

    return {"received": True}
