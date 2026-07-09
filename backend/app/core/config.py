from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    stockfish_path: str

    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-5.5"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
