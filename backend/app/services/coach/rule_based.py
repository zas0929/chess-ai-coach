from app.models.coach import (
    CoachChatRequest,
    CoachChatResponse,
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
            if request.evaluation_before is None
            else round(request.evaluation_before, 2)
        )

        title = request.classification or "Analyzed move"
        opening_text = (
            f" in the {request.opening}"
            if request.opening
            else ""
        )
        explanation = (
            f"On move {request.move_number}{opening_text}, "
            f"{request.side} played {request.move}. "
            f"Stockfish classified it as {request.classification or 'analyzed'}. "
            f"The evaluation changed from {previous} "
            f"to {round(request.evaluation_after, 2)} "
            f"({round(request.evaluation_change, 2)})."
            f"{best_move_text}"
        )

        return CoachExplainResponse(
            title=title,
            explanation=explanation,
            tip="Compare the move you chose with the engine's preferred continuation and ask what threat changed.",
            theme=request.opening or "Move quality",
        )

    def chat(
        self,
        request: CoachChatRequest,
    ) -> CoachChatResponse:
        latest_question = (
            request.messages[-1].content
            if request.messages
            else "Why?"
        )
        context = request.context
        best_move_text = (
            f" The engine preferred {context.best_move}."
            if context.best_move
            else ""
        )

        return CoachChatResponse(
            answer=(
                f"You asked: {latest_question} "
                f"The key point is that {context.move} was classified as "
                f"{context.classification or 'analyzed'} after the evaluation moved "
                f"from {context.evaluation_before} to {context.evaluation_after}."
                f"{best_move_text}"
            ),
        )
