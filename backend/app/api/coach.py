from fastapi import APIRouter

from app.models.coach import (
    CoachExplainRequest,
    CoachExplainResponse,
)

router = APIRouter()


@router.post("/explain", response_model=CoachExplainResponse)
def explain(data: CoachExplainRequest):
    best_move_text = (
        f" The engine preferred {data.best_move}."
        if data.best_move
        else ""
    )

    previous = (
        "unknown"
        if data.previous_value is None
        else round(data.previous_value, 2)
    )

    explanation = (
        f"Move {data.move} was classified as "
        f"{data.classification or 'analyzed'}. "
        f"The evaluation changed from {previous} "
        f"to {round(data.value, 2)} "
        f"({round(data.eval_change, 2)})."
        f"{best_move_text}"
    )

    return CoachExplainResponse(
        explanation=explanation,
    )
