from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "TRIVARNA"

    SUPABASE_URL: str
    SUPABASE_KEY: str

    OPENAI_API_KEY: Optional[str] = None

    DEBUG: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()