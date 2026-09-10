"""Booking SQLAlchemy model."""

from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import BookingStatus, PaymentStatus
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.customer import Customer
    from app.models.rating import Rating
    from app.models.service_category import ServiceCategory
    from app.models.worker import Worker


class Booking(Base):
    """Service appointment and dispatch booking entity."""

    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    booking_reference: Mapped[str] = mapped_column(
        String(50), unique=True, index=True, nullable=False
    )
    customer_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True
    )
    worker_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("workers.id", ondelete="SET NULL"), nullable=True, index=True
    )
    category_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("service_categories.id", ondelete="RESTRICT"), nullable=False, index=True
    )

    # Booking & Payment Status
    status: Mapped[BookingStatus] = mapped_column(
        Enum(BookingStatus, name="booking_status_enum", values_callable=lambda x: [e.value for e in x]),
        default=BookingStatus.PENDING,
        nullable=False,
    )
    payment_status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus, name="payment_status_enum", values_callable=lambda x: [e.value for e in x]),
        default=PaymentStatus.PENDING,
        nullable=False,
    )

    # Urgency & Details
    is_emergency: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    service_address: Mapped[str] = mapped_column(String(255), nullable=False)
    service_latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    service_longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    total_amount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    # Schedule milestones
    scheduled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    customer: Mapped["Customer"] = relationship("Customer", back_populates="bookings")
    worker: Mapped["Worker | None"] = relationship("Worker", back_populates="bookings")
    category: Mapped["ServiceCategory"] = relationship("ServiceCategory", back_populates="bookings")
    rating: Mapped["Rating | None"] = relationship(
        "Rating", back_populates="booking", uselist=False, cascade="all, delete-orphan"
    )
