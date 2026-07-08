from fastapi import APIRouter

from app.models.engine import MoveRequest, EvaluateRequest
from app.services.stockfish_service import stockfish_service

from app.models.engine import (
    MoveRequest,
    EvaluateRequest,
    AnalyzeMoveRequest,
)

router = APIRouter()


@router.post("/move")
def move(data: MoveRequest):
    return stockfish_service.best_move(
        data.fen,
        data.settings,
    )


@router.post("/evaluate")
def evaluate(data: EvaluateRequest):
    return stockfish_service.evaluate(
        data.fen,
        data.settings,
    )

@router.post("/analyze-move")
def analyze_move(data: AnalyzeMoveRequest):
    return stockfish_service.analyze_move(
        data.fen_before,
        data.fen_after,
        data.settings,
    )
