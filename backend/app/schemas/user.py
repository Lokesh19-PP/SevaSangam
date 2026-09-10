"""User, Customer, and Cooperative schemas."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.core.constants import SupportedLanguage, UserRole


# ---------------------------------------------------------------------------
# User Schemas
# ---------------------------------------------------------------------------

class UserBase(BaseModel):
    """Base user attributes."""

    phone: str = Field(..., max_length=20)
    full_name: str = Field(..., max_length=100)
    email: str | None = Field(None, max_length=255)
    role: UserRole = UserRole.CUSTOMER
    preferred_language: str = SupportedLanguage.ENGLISH.value
    is_active: bool = True


class UserCreate(UserBase):
    """User creation schema."""

    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    """User update schema with optional fields."""

    full_name: str | None = Field(None, max_length=100)
    email: str | None = None
    phone: str | None = Field(None, max_length=20)
    preferred_language: str | None = None
    is_active: bool | None = None


class UserResponse(UserBase):
    """Serialized user response."""

    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Customer Schemas
# ---------------------------------------------------------------------------

class CustomerBase(BaseModel):
    """Base customer profile data."""

    address: str | None = Field(None, max_length=255)
    city: str | None = Field(None, max_length=100)
    pincode: str | None = Field(None, max_length=10)
    latitude: float | None = None
    longitude: float | None = None


class CustomerCreate(CustomerBase):
    """Customer profile creation schema."""

    user_id: int


class CustomerUpdate(CustomerBase):
    """Customer profile update schema."""

    pass


class CustomerResponse(CustomerBase):
    """Serialized customer profile."""

    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    user: UserResponse | None = None

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Cooperative Schemas
# ---------------------------------------------------------------------------

class CooperativeBase(BaseModel):
    """Base labour cooperative society schema."""

    name: str = Field(..., max_length=200)
    registration_number: str = Field(..., max_length=100)
    contact_person: str | None = Field(None, max_length=100)
    phone: str | None = Field(None, max_length=20)
    email: str | None = None
    address: str | None = Field(None, max_length=255)
    city: str = Field(..., max_length=100)
    state: str = Field(..., max_length=100)
    pincode: str | None = Field(None, max_length=10)
    is_active: bool = True


class CooperativeCreate(CooperativeBase):
    """Cooperative creation schema."""

    welfare_fund_balance: float = 0.0


class CooperativeUpdate(BaseModel):
    """Cooperative update schema."""

    name: str | None = None
    contact_person: str | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    pincode: str | None = None
    welfare_fund_balance: float | None = None
    is_active: bool | None = None


class CooperativeResponse(CooperativeBase):
    """Serialized cooperative response."""

    id: int
    welfare_fund_balance: float
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
