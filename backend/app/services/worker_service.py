"""Worker profile and lifecycle business logic service.

Manages worker registration, profile updates, availability toggling,
skill/certification management, and admin verification workflows.
No direct DB access — delegates to repositories.
"""

from typing import List, Optional

from sqlalchemy.orm import Session

from app.core.constants import WorkerStatus
from app.core.exceptions import (
    BadRequestException,
    ForbiddenException,
    NotFoundException,
)
from app.models.certification import Certification
from app.models.skill import WorkerSkill
from app.models.worker import Worker
from app.repositories import service_repository, worker_repository


# ---------------------------------------------------------------------------
# Worker Profile CRUD
# ---------------------------------------------------------------------------

def get_worker_profile(db: Session, worker_id: int, detailed: bool = False) -> Worker:
    """Retrieve a worker profile by ID.

    Args:
        worker_id: Primary key of the worker.
        detailed: If True, eager-loads skills, certifications, cooperative, user.

    Raises:
        NotFoundException: Worker does not exist.
    """
    worker = worker_repository.get_worker_by_id(db, worker_id, eager_load=detailed)
    if not worker:
        raise NotFoundException(f"Worker with id {worker_id} not found.")
    return worker


def get_worker_by_user(db: Session, user_id: int) -> Worker:
    """Retrieve the worker profile linked to a user account.

    Raises:
        NotFoundException: No worker profile linked to this user.
    """
    worker = worker_repository.get_worker_by_user_id(db, user_id)
    if not worker:
        raise NotFoundException(f"No worker profile found for user {user_id}.")
    return worker


def register_worker(db: Session, worker_data: dict) -> Worker:
    """Create a new worker profile.

    The worker starts in PENDING status until admin verification.

    Args:
        worker_data: Dict matching Worker model columns (must include ``user_id``).

    Returns:
        The newly created Worker.
    """
    # Prevent duplicate worker profiles for the same user
    existing = worker_repository.get_worker_by_user_id(db, worker_data["user_id"])
    if existing:
        raise BadRequestException("This user already has a worker profile.")

    worker_data.setdefault("status", WorkerStatus.PENDING)
    return worker_repository.create_worker(db, worker_data)


def update_worker_profile(db: Session, worker_id: int, update_data: dict) -> Worker:
    """Update non-sensitive worker profile fields (wage, location, experience, insurance).

    Raises:
        NotFoundException: Worker does not exist.
    """
    # Strip fields that should be changed through dedicated workflows
    protected_fields = {"status", "current_active_jobs", "total_completed_jobs",
                        "average_rating", "total_ratings"}
    safe_data = {k: v for k, v in update_data.items() if k not in protected_fields}

    worker = worker_repository.update_worker(db, worker_id, safe_data)
    if not worker:
        raise NotFoundException(f"Worker with id {worker_id} not found.")
    return worker


# ---------------------------------------------------------------------------
# Availability
# ---------------------------------------------------------------------------

def set_availability(db: Session, worker_id: int, is_available: bool) -> Worker:
    """Toggle a worker's availability flag.

    Only verified workers can mark themselves available.

    Raises:
        NotFoundException: Worker does not exist.
        ForbiddenException: Worker is not verified.
    """
    worker = worker_repository.get_worker_by_id(db, worker_id)
    if not worker:
        raise NotFoundException(f"Worker with id {worker_id} not found.")

    if is_available and worker.status != WorkerStatus.VERIFIED:
        raise ForbiddenException(
            "Only verified workers can mark themselves as available."
        )

    updated = worker_repository.update_worker_availability(db, worker_id, is_available)
    if not updated:
        raise NotFoundException(f"Worker with id {worker_id} not found.")
    return updated


# ---------------------------------------------------------------------------
# Skills Management
# ---------------------------------------------------------------------------

def add_skill_to_worker(
    db: Session,
    worker_id: int,
    skill_id: int,
    proficiency_level: str = "intermediate",
) -> WorkerSkill:
    """Attach a trade skill to a worker's profile.

    Validates that both the worker and the skill exist.

    Raises:
        NotFoundException: Worker or skill does not exist.
        BadRequestException: Worker already has this skill.
    """
    worker = worker_repository.get_worker_by_id(db, worker_id)
    if not worker:
        raise NotFoundException(f"Worker with id {worker_id} not found.")

    skill = service_repository.get_skill_by_id(db, skill_id)
    if not skill:
        raise NotFoundException(f"Skill with id {skill_id} not found.")

    # Check for duplicate skill assignment
    existing_skills = worker_repository.get_worker_skills(db, worker_id)
    if any(ws.skill_id == skill_id for ws in existing_skills):
        raise BadRequestException(
            f"Worker {worker_id} already has skill {skill_id} assigned."
        )

    return worker_repository.add_worker_skill(
        db, worker_id, skill_id, proficiency_level
    )


def get_worker_skills(db: Session, worker_id: int) -> List[WorkerSkill]:
    """List all skills registered for a worker.

    Raises:
        NotFoundException: Worker does not exist.
    """
    worker = worker_repository.get_worker_by_id(db, worker_id)
    if not worker:
        raise NotFoundException(f"Worker with id {worker_id} not found.")
    return worker_repository.get_worker_skills(db, worker_id)


# ---------------------------------------------------------------------------
# Certification Management
# ---------------------------------------------------------------------------

def add_certification(db: Session, cert_data: dict) -> Certification:
    """Upload a new trade certification for a worker.

    Certification starts as ``pending`` verification.

    Raises:
        NotFoundException: Worker does not exist.
    """
    worker = worker_repository.get_worker_by_id(db, cert_data.get("worker_id", -1))
    if not worker:
        raise NotFoundException(
            f"Worker with id {cert_data.get('worker_id')} not found."
        )

    cert_data.setdefault("verification_status", "pending")
    cert_data.setdefault("ocr_verified", False)
    return worker_repository.add_certification(db, cert_data)


def get_worker_certifications(db: Session, worker_id: int) -> List[Certification]:
    """Retrieve all certifications belonging to a worker.

    Raises:
        NotFoundException: Worker does not exist.
    """
    worker = worker_repository.get_worker_by_id(db, worker_id)
    if not worker:
        raise NotFoundException(f"Worker with id {worker_id} not found.")
    return worker_repository.get_certifications_by_worker(db, worker_id)


# ---------------------------------------------------------------------------
# Admin: Verification Workflow
# ---------------------------------------------------------------------------

_VALID_VERIFICATION_TRANSITIONS = {
    WorkerStatus.PENDING: {WorkerStatus.VERIFIED, WorkerStatus.REJECTED},
    WorkerStatus.REJECTED: {WorkerStatus.PENDING},  # allow re-review
    WorkerStatus.VERIFIED: {WorkerStatus.SUSPENDED},
    WorkerStatus.SUSPENDED: {WorkerStatus.VERIFIED},  # reinstatement
}


def verify_worker(
    db: Session, worker_id: int, new_status: WorkerStatus
) -> Worker:
    """Admin action: change a worker's verification status.

    Enforces allowed status transitions to prevent invalid lifecycle jumps.

    Raises:
        NotFoundException: Worker does not exist.
        BadRequestException: Invalid status transition.
    """
    worker = worker_repository.get_worker_by_id(db, worker_id)
    if not worker:
        raise NotFoundException(f"Worker with id {worker_id} not found.")

    allowed = _VALID_VERIFICATION_TRANSITIONS.get(worker.status, set())
    if new_status not in allowed:
        raise BadRequestException(
            f"Cannot transition worker status from '{worker.status.value}' "
            f"to '{new_status.value}'. "
            f"Allowed transitions: {[s.value for s in allowed]}."
        )

    # If suspending or rejecting, also mark unavailable
    if new_status in (WorkerStatus.SUSPENDED, WorkerStatus.REJECTED):
        worker_repository.update_worker_availability(db, worker_id, False)

    updated = worker_repository.update_worker(db, worker_id, {"status": new_status})
    if not updated:
        raise NotFoundException(f"Worker with id {worker_id} not found.")
    return updated


def update_certification_status(
    db: Session,
    cert_id: int,
    verification_status: str,
    ocr_verified: Optional[bool] = None,
) -> Certification:
    """Admin/OCR action: update a certification's verification state.

    Args:
        cert_id: Certification record ID.
        verification_status: One of ``pending``, ``verified``, ``rejected``.
        ocr_verified: Whether OCR processing confirmed authenticity.

    Raises:
        NotFoundException: Certification does not exist.
        BadRequestException: Invalid verification_status value.
    """
    valid_statuses = {"pending", "verified", "rejected"}
    if verification_status not in valid_statuses:
        raise BadRequestException(
            f"Invalid verification_status '{verification_status}'. "
            f"Must be one of: {valid_statuses}."
        )

    cert = worker_repository.update_certification_status(
        db, cert_id, verification_status, ocr_verified
    )
    if not cert:
        raise NotFoundException(f"Certification with id {cert_id} not found.")
    return cert


# ---------------------------------------------------------------------------
# Listing / Search
# ---------------------------------------------------------------------------

def list_workers(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    cooperative_id: Optional[int] = None,
    status: Optional[WorkerStatus] = None,
) -> List[Worker]:
    """List workers with optional cooperative and status filters."""
    return worker_repository.list_workers(
        db, skip=skip, limit=limit, cooperative_id=cooperative_id, status=status
    )


def list_available_workers(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    cooperative_id: Optional[int] = None,
) -> List[Worker]:
    """List verified, available workers ordered by fewest active jobs (fairness)."""
    return worker_repository.list_available_workers(
        db, skip=skip, limit=limit, cooperative_id=cooperative_id
    )
