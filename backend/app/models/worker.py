"""Worker SQLAlchemy model."""

from datetime import date, datetime
from typing import TYPE_CHECKING, List
from sqlalchemy import Boolean, Date, DateTime, Enum, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import WorkerStatus
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.booking import Booking
    from app.models.certification import Certification
    from app.models.cooperative import Cooperative
    from app.models.rating import Rating
    from app.models.skill import WorkerSkill
    from app.models.user import User


class Worker(Base):
    """Cooperative member worker entity."""

    __tablename__ = "workers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    cooperative_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("cooperatives.id", ondelete="SET NULL"), nullable=True, index=True
    )
    status: Mapped[WorkerStatus] = mapped_column(
        Enum(WorkerStatus, name="worker_status_enum", values_callable=lambda x: [e.value for e in x]),
        default=WorkerStatus.PENDING,
        nullable=False,
    )
    daily_wage_rate: Mapped[float | None] = mapped_column(Float, nullable=True)
    experience_years: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Geo coordinates (placeholder floats for PostGIS geometry in later phase)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)

    # Availability and fair workload balancing metrics
    is_available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    current_active_jobs: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_completed_jobs: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Aggregated performance ratings
    average_rating: Mapped[float] = mapped_column(Float, default=5.0, nullable=False)
    total_ratings: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Welfare & Insurance Coverage Details
    insurance_policy_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    insurance_expiry_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="worker")
    cooperative: Mapped["Cooperative | None"] = relationship("Cooperative", back_populates="workers")
    skills: Mapped[List["WorkerSkill"]] = relationship(
        "WorkerSkill", back_populates="worker", cascade="all, delete-orphan"
    )
    certifications: Mapped[List["Certification"]] = relationship(
        "Certification", back_populates="worker", cascade="all, delete-orphan"
    )
    bookings: Mapped[List["Booking"]] = relationship("Booking", back_populates="worker")
    ratings: Mapped[List["Rating"]] = relationship("Rating", back_populates="worker")
