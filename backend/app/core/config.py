"""Core application configuration settings."""

from typing import List
from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables or .env file."""

    # Base Application Settings
    PROJECT_NAME: str = "SevaSangam"
    VERSION: str = "0.1.0"
    DESCRIPTION: str = "Cooperative-owned digital service marketplace backend"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api"

    # Database Settings (PostgreSQL + PostGIS)
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/sevasangam"

    # Security & Authentication Placeholders
    AUTH_SECRET: str = "mock-secret-key-change-in-production"
    AUTH_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day in minutes

    # Twilio / Communications Integration Placeholders
    TWILIO_ACCOUNT_SID: str = "AC_mock_twilio_account_sid"
    TWILIO_AUTH_TOKEN: str = "mock_twilio_auth_token"
    TWILIO_PHONE_NUMBER: str = "+1234567890"

    # CORS Settings
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


# Global settings singleton
settings = Settings()
