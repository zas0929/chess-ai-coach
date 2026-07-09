from abc import ABC, abstractmethod

from app.models.coach import (
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
