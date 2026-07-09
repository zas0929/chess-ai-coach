from app.models.coach import (
    CoachExplainRequest,
    CoachExplainResponse,
)
from app.services.coach.base import BaseCoach


class RuleBasedCoach(BaseCoach):

    def explain(
        self,
        request: CoachExplainRequest,
    ) -> CoachExplainResponse:
        best_move_text = (
            f" The engine preferred {request.best_move}."
            if request.best_move
            else ""
        )

        previous = (
            "unknown"
            if request.previous_value is None
            else round(request.previous_value, 2)
        )

        explanation = (
            f"Move {request.move} was classified as "
            f"{request.classification or 'analyzed'}. "
            f"The evaluation changed from {previous} "
            f"to {round(request.value, 2)} "
            f"({round(request.eval_change, 2)})."
            f"{best_move_text}"
        )

        return CoachExplainResponse(
            explanation=explanation,
        )
