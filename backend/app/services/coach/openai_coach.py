import json

from openai import OpenAI

from app.core.config import settings
from app.models.coach import (
    CoachChatRequest,
    CoachChatResponse,
    CoachExplainRequest,
    CoachExplainResponse,
)
from app.services.coach.base import BaseCoach
from app.services.coach.prompt import CHAT_PROMPT, SYSTEM_PROMPT


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
        user_prompt = {
            "task": (
                "Explain this chess move. Return JSON with keys "
                "title, explanation, tip, theme. Do not invent the "
                "classification; use the provided classification."
            ),
            "context": request.model_dump(),
        }

        response = self.client.responses.create(
            model=self.model,
            input=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": json.dumps(user_prompt),
                },
            ],
        )

        try:
            payload = json.loads(response.output_text)
            return CoachExplainResponse(**payload)
        except (json.JSONDecodeError, TypeError, ValueError):
            return CoachExplainResponse(
                title=request.classification or "Move explained",
                explanation=response.output_text,
                tip="Compare your move with the engine recommendation and look for the changed threat.",
                theme=request.opening or "Move quality",
            )

    def chat(
        self,
        request: CoachChatRequest,
    ) -> CoachChatResponse:
        context_prompt = {
            "task": "Answer the user's chess coaching question.",
            "context": request.context.model_dump(),
        }

        response = self.client.responses.create(
            model=self.model,
            input=[
                {
                    "role": "system",
                    "content": CHAT_PROMPT,
                },
                {
                    "role": "user",
                    "content": json.dumps(context_prompt),
                },
                *[
                    {
                        "role": message.role,
                        "content": message.content,
                    }
                    for message in request.messages
                ],
            ],
        )

        return CoachChatResponse(
            answer=response.output_text,
        )
