from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "TRIVARNA"

    SUPABASE_URL: str
    SUPABASE_KEY: str

    OPENAI_API_KEY: Optional[str] = None
    GROQ_API_KEY:str = "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"

    DEBUG: bool = True

    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM: str = "Trivarna <noreply@trivarna.com>"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()