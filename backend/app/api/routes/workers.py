"""Worker API routes — profiles, skills, availability, verification.

Endpoints:
    GET    /workers              — List workers (filterable)
    GET    /workers/nearby       — List available workers nearby (stub)
    GET    /workers/{id}         — Get worker profile
    GET    /workers/{id}/stats   — Get worker statistics
    PUT    /workers/profile      — Update own worker profile
    PUT    /workers/availability — Toggle own availability
    PUT    /workers/skills       — Add a skill to own profile
    GET    /workers/{id}/skills  — List worker skills
    POST   /workers/certificates — Upload a certification
    GET    /workers/{id}/certificates — List worker certifications
    PATCH  /workers/{id}/verify  — Admin: change worker verification status
"""

from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_current_user, get_current_worker
from app.core.constants import WorkerStatus
from app.database.session import get_db
from app.models.user import User
from app.schemas.worker import (
    CertificationCreate,
    CertificationResponse,
    WorkerAvailabilityUpdate,
    WorkerDetailResponse,
    WorkerResponse,
    WorkerSkillCreate,
    WorkerSkillResponse,
    WorkerUpdate,
)
from app.services import worker_service

router = APIRouter(prefix="/workers", tags=["Workers"])


# ---------------------------------------------------------------------------
# List / Search
# ---------------------------------------------------------------------------

@router.get("", response_model=List[WorkerResponse])
def list_workers(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    cooperative_id: Optional[int] = None,
    status: Optional[WorkerStatus] = None,
    db: Session = Depends(get_db),
):
    """List workers with optional cooperative and status filters."""
    return worker_service.list_workers(
        db, skip=skip, limit=limit,
        cooperative_id=cooperative_id, status=status,
    )


@router.get("/nearby", response_model=List[WorkerResponse])
def get_nearby_workers(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    cooperative_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    """List verified, available workers — ordered by fewest active jobs (fairness).

    A full geo-spatial query will replace this once PostGIS is live.
    """
    return worker_service.list_available_workers(
        db, skip=skip, limit=limit, cooperative_id=cooperative_id,
    )


# ---------------------------------------------------------------------------
# Individual Profile
# ---------------------------------------------------------------------------

@router.get("/{worker_id}", response_model=WorkerDetailResponse)
def get_worker(worker_id: int, db: Session = Depends(get_db)):
    """Get detailed worker profile including skills, certifications, cooperative."""
    return worker_service.get_worker_profile(db, worker_id, detailed=True)


@router.get("/{worker_id}/stats")
def get_worker_stats(worker_id: int, db: Session = Depends(get_db)):
    """Get worker statistics (active jobs, completed jobs, rating)."""
    worker = worker_service.get_worker_profile(db, worker_id)
    return {
        "worker_id": worker.id,
        "current_active_jobs": worker.current_active_jobs,
        "total_completed_jobs": worker.total_completed_jobs,
        "average_rating": worker.average_rating,
        "total_ratings": worker.total_ratings,
        "is_available": worker.is_available,
        "status": worker.status.value,
    }


# ---------------------------------------------------------------------------
# Self-Service Profile Updates (authenticated worker)
# ---------------------------------------------------------------------------

@router.put("/profile", response_model=WorkerResponse)
def update_own_profile(
    data: WorkerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_worker),
):
    """Update the authenticated worker's profile (wage, location, experience, insurance)."""
    worker = worker_service.get_worker_by_user(db, current_user.id)
    return worker_service.update_worker_profile(
        db, worker.id, data.model_dump(exclude_unset=True),
    )


@router.put("/availability", response_model=WorkerResponse)
def update_availability(
    data: WorkerAvailabilityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_worker),
):
    """Toggle the authenticated worker's availability."""
    worker = worker_service.get_worker_by_user(db, current_user.id)
    return worker_service.set_availability(db, worker.id, data.is_available)


# ---------------------------------------------------------------------------
# Skills
# ---------------------------------------------------------------------------

@router.put("/skills", response_model=WorkerSkillResponse)
def add_skill(
    data: WorkerSkillCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_worker),
):
    """Add a skill to the authenticated worker's profile."""
    worker = worker_service.get_worker_by_user(db, current_user.id)
    return worker_service.add_skill_to_worker(
        db, worker.id, data.skill_id, data.proficiency_level,
    )


@router.get("/{worker_id}/skills", response_model=List[WorkerSkillResponse])
def get_skills(worker_id: int, db: Session = Depends(get_db)):
    """List all skills for a worker."""
    return worker_service.get_worker_skills(db, worker_id)


# ---------------------------------------------------------------------------
# Certifications
# ---------------------------------------------------------------------------

@router.post("/certificates", response_model=CertificationResponse, status_code=201)
def upload_certificate(
    data: CertificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_worker),
):
    """Upload a new trade certification (starts as pending verification)."""
    worker = worker_service.get_worker_by_user(db, current_user.id)
    cert_data = data.model_dump()
    cert_data["worker_id"] = worker.id
    return worker_service.add_certification(db, cert_data)


@router.get("/{worker_id}/certificates", response_model=List[CertificationResponse])
def get_certificates(worker_id: int, db: Session = Depends(get_db)):
    """List all certifications for a worker."""
    return worker_service.get_worker_certifications(db, worker_id)


# ---------------------------------------------------------------------------
# Admin: Verification
# ---------------------------------------------------------------------------

@router.patch("/{worker_id}/verify", response_model=WorkerResponse)
def verify_worker(
    worker_id: int,
    new_status: WorkerStatus,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    """Admin: change a worker's verification status (pending → verified/rejected etc.)."""
    return worker_service.verify_worker(db, worker_id, new_status)
