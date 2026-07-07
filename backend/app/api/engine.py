from fastapi import APIRouter

from app.models.engine import MoveRequest
from app.services.stockfish_service import stockfish_service

router = APIRouter()


@router.post("/move")
def move(data: MoveRequest):
    return stockfish_service.best_move(
        data.fen,
        data.settings,
    )
