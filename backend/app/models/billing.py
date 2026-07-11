from pydantic import BaseModel


class CheckoutSessionResponse(BaseModel):
    url: str


class BillingPortalResponse(BaseModel):
    url: str


class BillingStatusResponse(BaseModel):
    plan: str
    status: str
    is_pro: bool
    stripe_customer_id: str | None = None
    stripe_subscription_id: str | None = None
