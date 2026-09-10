"""Rating SQLAlchemy model."""

from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import DateTime, Float, ForeignKey, Integer, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.booking import Booking
    from app.models.customer import Customer
    from app.models.worker import Worker


class Rating(Base):
    """Customer rating and review for a completed booking."""

    __tablename__ = "ratings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    booking_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("bookings.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    customer_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True
    )
    worker_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("workers.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # Score (e.g. 1.0 - 5.0) and optional textual review
    score: Mapped[float] = mapped_column(Float, nullable=False)
    review: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    booking: Mapped["Booking"] = relationship("Booking", back_populates="rating")
    customer: Mapped["Customer"] = relationship("Customer", back_populates="ratings")
    worker: Mapped["Worker"] = relationship("Worker", back_populates="ratings")
