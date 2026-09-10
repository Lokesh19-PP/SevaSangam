"""User SQLAlchemy model."""

from datetime import datetime
from sqlalchemy import Boolean, DateTime, Enum, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import SupportedLanguage, UserRole
from app.database.base import Base


class User(Base):
    """Core user model for authentication and identity."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str | None] = mapped_column(String(255), unique=True, index=True, nullable=True)
    phone: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str | None] = mapped_column(String(255), nullable=True)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role_enum", values_callable=lambda x: [e.value for e in x]),
        default=UserRole.CUSTOMER,
        nullable=False,
    )
    preferred_language: Mapped[str] = mapped_column(
        String(10), default=SupportedLanguage.ENGLISH.value, nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    customer: Mapped["Customer"] = relationship(
        "Customer", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    worker: Mapped["Worker"] = relationship(
        "Worker", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
