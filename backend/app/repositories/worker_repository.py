"""Data access repository for Workers, Skills, and Certifications."""

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.constants import WorkerStatus
from app.models.certification import Certification
from app.models.skill import WorkerSkill
from app.models.worker import Worker


def get_worker_by_id(db: Session, worker_id: int, eager_load: bool = False) -> Optional[Worker]:
    """Retrieve worker by ID, optionally eager-loading relationships."""
    if eager_load:
        stmt = (
            select(Worker)
            .options(
                selectinload(Worker.skills),
                selectinload(Worker.certifications),
                selectinload(Worker.cooperative),
                selectinload(Worker.user),
            )
            .where(Worker.id == worker_id)
        )
        return db.scalars(stmt).first()
    return db.get(Worker, worker_id)


def get_worker_by_user_id(db: Session, user_id: int) -> Optional[Worker]:
    """Retrieve worker by linked user ID."""
    stmt = select(Worker).where(Worker.user_id == user_id)
    return db.scalars(stmt).first()


def list_workers(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    cooperative_id: Optional[int] = None,
    status: Optional[WorkerStatus] = None,
) -> List[Worker]:
    """List workers filtered by cooperative or verification status."""
    stmt = select(Worker)
    if cooperative_id is not None:
        stmt = stmt.where(Worker.cooperative_id == cooperative_id)
    if status is not None:
        stmt = stmt.where(Worker.status == status)
    stmt = stmt.offset(skip).limit(limit)
    return list(db.scalars(stmt).all())


def list_available_workers(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    cooperative_id: Optional[int] = None,
) -> List[Worker]:
    """List currently available, verified workers."""
    stmt = select(Worker).where(
        Worker.is_available.is_(True),
        Worker.status == WorkerStatus.VERIFIED,
    )
    if cooperative_id is not None:
        stmt = stmt.where(Worker.cooperative_id == cooperative_id)
    # Order by active jobs ascending for fair distribution
    stmt = stmt.order_by(Worker.current_active_jobs.asc()).offset(skip).limit(limit)
    return list(db.scalars(stmt).all())


def create_worker(db: Session, worker_data: dict) -> Worker:
    """Register a new worker profile."""
    worker = Worker(**worker_data)
    db.add(worker)
    db.commit()
    db.refresh(worker)
    return worker


def update_worker(db: Session, worker_id: int, update_data: dict) -> Optional[Worker]:
    """Update general worker attributes."""
    worker = db.get(Worker, worker_id)
    if not worker:
        return None
    for key, value in update_data.items():
        if hasattr(worker, key) and value is not None:
            setattr(worker, key, value)
    db.commit()
    db.refresh(worker)
    return worker


def update_worker_availability(db: Session, worker_id: int, is_available: bool) -> Optional[Worker]:
    """Toggle worker availability status."""
    worker = db.get(Worker, worker_id)
    if not worker:
        return None
    worker.is_available = is_available
    db.commit()
    db.refresh(worker)
    return worker


def update_worker_workload(
    db: Session, worker_id: int, active_jobs_delta: int, completed_jobs_delta: int = 0
) -> Optional[Worker]:
    """Adjust active or completed job counts for fair distribution tracking."""
    worker = db.get(Worker, worker_id)
    if not worker:
        return None
    worker.current_active_jobs = max(0, worker.current_active_jobs + active_jobs_delta)
    if completed_jobs_delta > 0:
        worker.total_completed_jobs += completed_jobs_delta
    db.commit()
    db.refresh(worker)
    return worker


# ---------------------------------------------------------------------------
# Worker Skills & Certifications Queries
# ---------------------------------------------------------------------------

def add_worker_skill(
    db: Session,
    worker_id: int,
    skill_id: int,
    proficiency_level: str = "intermediate",
    is_verified: bool = False,
) -> WorkerSkill:
    """Attach a skill to a worker profile."""
    worker_skill = WorkerSkill(
        worker_id=worker_id,
        skill_id=skill_id,
        proficiency_level=proficiency_level,
        is_verified=is_verified,
    )
    db.add(worker_skill)
    db.commit()
    db.refresh(worker_skill)
    return worker_skill


def get_worker_skills(db: Session, worker_id: int) -> List[WorkerSkill]:
    """Retrieve all skills registered for a worker."""
    stmt = select(WorkerSkill).where(WorkerSkill.worker_id == worker_id)
    return list(db.scalars(stmt).all())


def add_certification(db: Session, cert_data: dict) -> Certification:
    """Add a new trade certification record."""
    cert = Certification(**cert_data)
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert


def get_certifications_by_worker(db: Session, worker_id: int) -> List[Certification]:
    """Retrieve all certifications belonging to a worker."""
    stmt = select(Certification).where(Certification.worker_id == worker_id)
    return list(db.scalars(stmt).all())


def update_certification_status(
    db: Session,
    cert_id: int,
    verification_status: str,
    ocr_verified: Optional[bool] = None,
) -> Optional[Certification]:
    """Update certification verification status and OCR results."""
    cert = db.get(Certification, cert_id)
    if not cert:
        return None
    cert.verification_status = verification_status
    if ocr_verified is not None:
        cert.ocr_verified = ocr_verified
    db.commit()
    db.refresh(cert)
    return cert
