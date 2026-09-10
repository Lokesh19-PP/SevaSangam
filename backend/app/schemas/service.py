"""ServiceCategory and Skill schemas."""

from datetime import datetime
from typing import List
from pydantic import BaseModel, ConfigDict, Field


# ---------------------------------------------------------------------------
# Skill Schemas
# ---------------------------------------------------------------------------

class SkillBase(BaseModel):
    """Base skill attribute schema."""

    category_id: int
    name: str = Field(..., max_length=100)
    description: str | None = None


class SkillCreate(SkillBase):
    """Skill creation schema."""

    pass


class SkillResponse(SkillBase):
    """Serialized skill schema."""

    id: int

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Service Category Schemas
# ---------------------------------------------------------------------------

class ServiceCategoryBase(BaseModel):
    """Base service category schema."""

    code: str = Field(..., max_length=50)
    name: str = Field(..., max_length=100)
    description: str | None = None
    base_rate: float = 0.0
    icon: str | None = None
    is_active: bool = True


class ServiceCategoryCreate(ServiceCategoryBase):
    """Service category creation schema."""

    pass


class ServiceCategoryUpdate(BaseModel):
    """Service category update schema."""

    name: str | None = None
    description: str | None = None
    base_rate: float | None = None
    icon: str | None = None
    is_active: bool | None = None


class ServiceCategoryResponse(ServiceCategoryBase):
    """Serialized service category response."""

    id: int
    created_at: datetime
    skills: List[SkillResponse] = []

    model_config = ConfigDict(from_attributes=True)
