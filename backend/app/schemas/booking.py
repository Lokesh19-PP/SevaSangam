"""Booking and Rating schemas."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.core.constants import BookingStatus, PaymentStatus
from app.schemas.service import ServiceCategoryResponse
from app.schemas.user import CustomerResponse
from app.schemas.worker import WorkerResponse


# ---------------------------------------------------------------------------
# Rating Schemas
# ---------------------------------------------------------------------------

class RatingBase(BaseModel):
    """Base rating attributes."""

    score: float = Field(..., ge=1.0, le=5.0, description="Rating score between 1 and 5")
    review: str | None = Field(None, max_length=1000)


class RatingCreate(RatingBase):
    """Submit rating for a booking."""

    booking_id: int
    worker_id: int


class RatingResponse(RatingBase):
    """Serialized rating schema."""

    id: int
    booking_id: int
    customer_id: int
    worker_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Booking Schemas
# ---------------------------------------------------------------------------

class BookingBase(BaseModel):
    """Base booking attributes."""

    category_id: int
    service_address: str = Field(..., max_length=255)
    service_latitude: float | None = None
    service_longitude: float | None = None
    description: str | None = None
    is_emergency: bool = False
    scheduled_at: datetime | None = None


class BookingCreate(BookingBase):
    """Create service booking."""

    customer_id: int
    worker_id: int | None = None  # Optional initially; can be matched by AI / dispatch
    total_amount: float = 0.0


class BookingUpdate(BaseModel):
    """General booking update."""

    worker_id: int | None = None
    status: BookingStatus | None = None
    payment_status: PaymentStatus | None = None
    total_amount: float | None = None
    scheduled_at: datetime | None = None
    started_at: datetime | None = None
    completed_at: datetime | None = None


class BookingStatusUpdate(BaseModel):
    """Update booking lifecycle status."""

    status: BookingStatus


class BookingResponse(BookingBase):
    """Serialized booking summary."""

    id: int
    booking_reference: str
    customer_id: int
    worker_id: int | None
    status: BookingStatus
    payment_status: PaymentStatus
    total_amount: float
    started_at: datetime | None
    completed_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BookingDetailResponse(BookingResponse):
    """Comprehensive booking details with customer, worker, and rating data."""

    customer: CustomerResponse | None = None
    worker: WorkerResponse | None = None
    category: ServiceCategoryResponse | None = None
    rating: RatingResponse | None = None

    model_config = ConfigDict(from_attributes=True)
