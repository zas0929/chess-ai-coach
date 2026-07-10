from dataclasses import dataclass
import logging
from typing import Optional

import jwt
from jwt import PyJWKClient
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings


security = HTTPBearer(auto_error=False)
logger = logging.getLogger(__name__)
jwks_clients: dict[str, PyJWKClient] = {}


@dataclass
class CurrentUser:
    id: str
    email: Optional[str] = None


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> Optional[CurrentUser]:
    if not credentials:
        if settings.auth_required:
            raise HTTPException(
                status_code=401,
                detail="Authentication required",
            )

        return None

    token = credentials.credentials

    try:
        header = jwt.get_unverified_header(token)
    except jwt.PyJWTError:
        header = {}

    try:
        alg = header.get("alg")

        if alg == "HS256":
            if not settings.supabase_jwt_secret:
                if settings.auth_required:
                    raise HTTPException(
                        status_code=500,
                        detail="SUPABASE_JWT_SECRET is not configured",
                    )

                return CurrentUser(id="dev-user")

            payload = jwt.decode(
                token,
                settings.supabase_jwt_secret,
                algorithms=["HS256"],
                options={"verify_aud": False},
            )
        elif alg in {"ES256", "RS256"}:
            payload = _decode_jwks_token(token)
        else:
            raise jwt.InvalidAlgorithmError(
                f"Unsupported JWT algorithm: {alg}",
            )
    except jwt.PyJWTError as error:
        logger.warning(
            "JWT validation failed: alg=%s kid=%s error=%s",
            header.get("alg"),
            header.get("kid"),
            error.__class__.__name__,
        )
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token",
        ) from error

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token",
        )

    return CurrentUser(
        id=user_id,
        email=payload.get("email"),
    )


def _decode_jwks_token(token: str) -> dict:
    try:
        unverified_payload = jwt.decode(
            token,
            options={
                "verify_signature": False,
                "verify_aud": False,
            },
        )
    except jwt.PyJWTError as error:
        raise jwt.InvalidTokenError("Cannot read JWT payload") from error

    issuer = unverified_payload.get("iss")

    if not issuer:
        raise jwt.InvalidIssuerError("JWT issuer is missing")

    if not settings.supabase_url:
        raise jwt.InvalidIssuerError(
            "SUPABASE_URL is required for JWKS auth",
        )

    expected_issuer = f"{settings.supabase_url.rstrip('/')}/auth/v1"

    if issuer.rstrip("/") != expected_issuer:
        raise jwt.InvalidIssuerError("JWT issuer does not match Supabase URL")

    jwks_url = f"{issuer.rstrip('/')}/.well-known/jwks.json"
    jwks_client = jwks_clients.get(jwks_url)

    if not jwks_client:
        jwks_client = PyJWKClient(jwks_url)
        jwks_clients[jwks_url] = jwks_client

    signing_key = jwks_client.get_signing_key_from_jwt(token)

    return jwt.decode(
        token,
        signing_key.key,
        algorithms=["ES256", "RS256"],
        options={"verify_aud": False},
        issuer=issuer,
    )
