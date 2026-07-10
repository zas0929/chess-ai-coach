from app.core.config import settings
from app.services.coach.openai_coach import OpenAICoach
from app.services.coach.rule_based import RuleBasedCoach


class CoachService:

    def __init__(self):
        if settings.openai_api_key:
            print("✅ AI Coach: OpenAI")
            self.coach = OpenAICoach()
        else:
            print("⚠️ AI Coach: Rule Based")
            self.coach = RuleBasedCoach()

    def explain(self, request):
        return self.coach.explain(request)

    def chat(self, request):
        return self.coach.chat(request)


coach_service = CoachService()
