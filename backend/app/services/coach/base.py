from abc import ABC, abstractmethod

from app.models.coach import (
    CoachChatRequest,
    CoachChatResponse,
    CoachExplainRequest,
    CoachExplainResponse,
)


class BaseCoach(ABC):

    @abstractmethod
    def explain(
        self,
        request: CoachExplainRequest,
    ) -> CoachExplainResponse:
        pass

    @abstractmethod
    def chat(
        self,
        request: CoachChatRequest,
    ) -> CoachChatResponse:
        pass
