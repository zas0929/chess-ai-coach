from openai import OpenAI

from app.core.config import settings
from app.models.coach import (
    CoachExplainRequest,
    CoachExplainResponse,
)
from app.services.coach.base import BaseCoach
from app.services.coach.prompt import SYSTEM_PROMPT


class OpenAICoach(BaseCoach):

    def __init__(self):
        self.client = OpenAI(
            api_key=settings.openai_api_key,
        )
        self.model = settings.openai_model

    def explain(
        self,
        request: CoachExplainRequest,
    ) -> CoachExplainResponse:
        user_prompt = f"""
Move: {request.move}
Best move: {request.best_move or "unknown"}
Classification: {request.classification or "unknown"}

Evaluation before: {request.previous_value}
Evaluation after: {request.value}
Evaluation change: {request.eval_change}

FEN after move:
{request.fen}
"""

        response = self.client.responses.create(
            model=self.model,
            input=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
        )

        return CoachExplainResponse(
            explanation=response.output_text,
        )
