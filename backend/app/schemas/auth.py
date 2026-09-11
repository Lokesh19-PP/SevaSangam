"""Authentication request and response schemas."""

from pydantic import BaseModel, ConfigDict, Field
from app.core.constants import SupportedLanguage, UserRole


class LoginRequest(BaseModel):
    """Credentials for user login (accepts email or phone)."""

    phone: str | None = Field(None, description="Registered phone number", examples=["+919876543210"])
    email: str | None = Field(None, description="Registered email address", examples=["customer@sevasangam.org"])
    password: str = Field(..., min_length=4, description="User password")


class RegisterRequest(BaseModel):
    """User registration payload."""

    phone: str = Field(..., description="Valid mobile phone number", examples=["+919876543210"])
    full_name: str = Field(..., min_length=2, max_length=100, examples=["Ramesh Kumar"])
    role: UserRole = Field(default=UserRole.CUSTOMER, description="Role within SevaSangam")
    email: str | None = Field(None, max_length=255, description="Optional email address")
    password: str = Field(..., min_length=6, description="Password")
    preferred_language: SupportedLanguage = Field(
        default=SupportedLanguage.ENGLISH, description="Preferred UI language"
    )


class TokenResponse(BaseModel):
    """JWT / session token response."""

    access_token: str
    token_type: str = "bearer"
    expires_in: int = 86400
    user_id: int
    role: UserRole
    full_name: str
    preferred_language: str

    model_config = ConfigDict(from_attributes=True)
