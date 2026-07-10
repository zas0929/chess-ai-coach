from dataclasses import dataclass
from typing import Optional

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings


security = HTTPBearer(auto_error=False)


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

    if not settings.supabase_jwt_secret:
        if settings.auth_required:
            raise HTTPException(
                status_code=500,
                detail="SUPABASE_JWT_SECRET is not configured",
            )

        return CurrentUser(id="dev-user")

    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
    except jwt.PyJWTError as error:
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
