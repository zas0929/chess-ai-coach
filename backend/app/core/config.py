from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    STOCKFISH_PATH: str

    class Config:
        env_file = ".env"

settings = Settings()
