from typing import Optional

from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    stockfish_path: str

    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-5.5"

    database_url: Optional[str] = None

    supabase_jwt_secret: Optional[str] = None
    auth_required: bool = False

    free_ai_requests: int = 3

    frontend_origin: str = "http://localhost:3000"
    frontend_origins: Optional[str] = None

    @computed_field
    @property
    def cors_origins(self) -> list[str]:
        raw_origins = self.frontend_origins or self.frontend_origin

        origins = [
            origin.strip().rstrip("/")
            for origin in raw_origins.split(",")
            if origin.strip()
        ]

        local_origins = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]

        return list(dict.fromkeys([*origins, *local_origins]))

    stripe_secret_key: Optional[str] = None
    stripe_webhook_secret: Optional[str] = None
    stripe_price_id: Optional[str] = None
    billing_success_url: str = "http://localhost:3000"
    billing_cancel_url: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
