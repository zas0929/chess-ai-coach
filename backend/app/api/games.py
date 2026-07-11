from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, get_current_user
from app.db.session import get_db
from app.models.game import (
    ActiveGameResponse,
    GameSnapshot,
    PlayerStatsResponse,
)
from app.services.game_service import game_service

router = APIRouter()


def _require_user(user: Optional[CurrentUser]) -> CurrentUser:
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
        )

    return user


def _require_db(db: Optional[Session]) -> Session:
    if not db:
        raise HTTPException(
            status_code=500,
            detail="DATABASE_URL is not configured",
        )

    return db


@router.get("/active", response_model=Optional[ActiveGameResponse])
def get_active_game(
    db: Optional[Session] = Depends(get_db),
    user: Optional[CurrentUser] = Depends(get_current_user),
):
    return game_service.get_active_game(
        db,
        _require_user(user),
    )


@router.put("/active", response_model=ActiveGameResponse)
def save_active_game(
    snapshot: GameSnapshot,
    db: Optional[Session] = Depends(get_db),
    user: Optional[CurrentUser] = Depends(get_current_user),
):
    try:
        return game_service.save_active_game(
            _require_db(db),
            _require_user(user),
            snapshot,
        )
    except RuntimeError as error:
        raise HTTPException(status_code=500, detail=str(error)) from error


@router.post("/new", response_model=ActiveGameResponse)
def start_new_game(
    snapshot: GameSnapshot,
    db: Optional[Session] = Depends(get_db),
    user: Optional[CurrentUser] = Depends(get_current_user),
):
    try:
        return game_service.start_new_game(
            _require_db(db),
            _require_user(user),
            snapshot,
        )
    except RuntimeError as error:
        raise HTTPException(status_code=500, detail=str(error)) from error


@router.get("/stats", response_model=PlayerStatsResponse)
def get_player_stats(
    db: Optional[Session] = Depends(get_db),
    user: Optional[CurrentUser] = Depends(get_current_user),
):
    return game_service.get_stats(
        db,
        _require_user(user),
    )
