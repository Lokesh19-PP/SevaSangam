"""Worker, Skills, and Certifications schemas."""

from datetime import date, datetime
from typing import List
from pydantic import BaseModel, ConfigDict, Field

from app.core.constants import WorkerStatus
from app.schemas.user import CooperativeResponse, UserResponse


# ---------------------------------------------------------------------------
# Skill Association Schemas
# ---------------------------------------------------------------------------

class WorkerSkillBase(BaseModel):
    """Worker skill association data."""

    skill_id: int
    proficiency_level: str = "intermediate"
    is_verified: bool = False


class WorkerSkillCreate(BaseModel):
    """Assign skill to worker."""

    skill_id: int
    proficiency_level: str = "intermediate"


class WorkerSkillResponse(WorkerSkillBase):
    """Serialized worker skill."""

    id: int
    worker_id: int
    skill_name: str | None = None

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Certification Schemas
# ---------------------------------------------------------------------------

class CertificationBase(BaseModel):
    """Trade certification data."""

    title: str = Field(..., max_length=200)
    issuing_organization: str | None = Field(None, max_length=200)
    certificate_number: str | None = Field(None, max_length=100)
    issue_date: date | None = None
    expiry_date: date | None = None
    document_url: str | None = Field(None, max_length=500)


class CertificationCreate(CertificationBase):
    """Upload new certificate."""

    worker_id: int


class CertificationUpdate(BaseModel):
    """Update certificate verification status."""

    ocr_verified: bool | None = None
    verification_status: str | None = None


class CertificationResponse(CertificationBase):
    """Serialized certificate response."""

    id: int
    worker_id: int
    ocr_verified: bool
    verification_status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Worker Schemas
# ---------------------------------------------------------------------------

class WorkerBase(BaseModel):
    """Base worker profile."""

    cooperative_id: int | None = None
    daily_wage_rate: float | None = None
    experience_years: int = 0
    latitude: float | None = None
    longitude: float | None = None
    is_available: bool = True
    insurance_policy_number: str | None = None
    insurance_expiry_date: date | None = None


class WorkerCreate(WorkerBase):
    """Worker registration schema."""

    user_id: int
    status: WorkerStatus = WorkerStatus.PENDING


class WorkerUpdate(BaseModel):
    """Worker profile update schema."""

    cooperative_id: int | None = None
    daily_wage_rate: float | None = None
    experience_years: int | None = None
    latitude: float | None = None
    longitude: float | None = None
    is_available: bool | None = None
    status: WorkerStatus | None = None
    insurance_policy_number: str | None = None
    insurance_expiry_date: date | None = None


class WorkerAvailabilityUpdate(BaseModel):
    """Toggle worker availability."""

    is_available: bool


class WorkerResponse(WorkerBase):
    """Serialized worker response."""

    id: int
    user_id: int
    status: WorkerStatus
    current_active_jobs: int
    total_completed_jobs: int
    average_rating: float
    total_ratings: int
    created_at: datetime
    updated_at: datetime
    user: UserResponse | None = None

    model_config = ConfigDict(from_attributes=True)


class WorkerDetailResponse(WorkerResponse):
    """Comprehensive worker details including skills, certifications, and cooperative."""

    cooperative: CooperativeResponse | None = None
    skills: List[WorkerSkillResponse] = []
    certifications: List[CertificationResponse] = []

    model_config = ConfigDict(from_attributes=True)
