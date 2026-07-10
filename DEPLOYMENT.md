# Deployment Notes

## Recommended MVP Stack

- Frontend: Vercel, root directory `frontend`.
- Backend: Render Docker web service from `backend/Dockerfile`.
- Auth and database: Supabase Auth + Supabase Postgres.
- Payments: Stripe Checkout + Stripe Customer Portal.

## Frontend Env

Set these in Vercel:

```bash
NEXT_PUBLIC_API_URL=https://<render-api-url>
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

## Backend Env

Set these in Render:

```bash
STOCKFISH_PATH=/usr/games/stockfish
FRONTEND_ORIGIN=https://<vercel-app-url>

OPENAI_API_KEY=<openai-key>
OPENAI_MODEL=gpt-5.5

DATABASE_URL=<supabase-postgres-connection-string>
SUPABASE_JWT_SECRET=<supabase-jwt-secret>
AUTH_REQUIRED=true
FREE_AI_REQUESTS=3

STRIPE_SECRET_KEY=<stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>
STRIPE_PRICE_ID=<stripe-subscription-price-id>
BILLING_SUCCESS_URL=https://<vercel-app-url>
BILLING_CANCEL_URL=https://<vercel-app-url>
```

## Stripe Webhook

Create a Stripe webhook endpoint:

```text
https://<render-api-url>/billing/webhook
```

Subscribe to:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Current MVP Limits

- Free quota is enforced per authenticated user when `DATABASE_URL` and Supabase auth are configured.
- Active or trialing Stripe subscriptions bypass the free quota.
- AI responses include `usage` and `quota` metadata so the UI can show token usage and remaining free calls.

## Local Development

Without Supabase env vars, the frontend skips the login screen.
Without `DATABASE_URL`, the backend skips quota persistence and keeps local behavior lightweight.
