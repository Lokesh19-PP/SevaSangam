"""Skill and WorkerSkill association SQLAlchemy models."""

from typing import TYPE_CHECKING, List
from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.service_category import ServiceCategory
    from app.models.worker import Worker


class Skill(Base):
    """Specific trade skill under a service category (e.g. Wiring, Pipe Fitting)."""

    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    category_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("service_categories.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    category: Mapped["ServiceCategory"] = relationship("ServiceCategory", back_populates="skills")
    worker_skills: Mapped[List["WorkerSkill"]] = relationship(
        "WorkerSkill", back_populates="skill", cascade="all, delete-orphan"
    )


class WorkerSkill(Base):
    """Association model linking a worker to their verified skills and proficiency."""

    __tablename__ = "worker_skills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    worker_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("workers.id", ondelete="CASCADE"), nullable=False
    )
    skill_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False
    )
    proficiency_level: Mapped[str] = mapped_column(
        String(50), default="intermediate", nullable=False
    )
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    worker: Mapped["Worker"] = relationship("Worker", back_populates="skills")
    skill: Mapped["Skill"] = relationship("Skill", back_populates="worker_skills")
