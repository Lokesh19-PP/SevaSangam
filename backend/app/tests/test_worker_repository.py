"""Unit tests for worker_repository with in-memory SQLite database."""

from app.core.constants import UserRole, WorkerStatus
from app.repositories import service_repository, user_repository, worker_repository


def test_create_and_get_worker(db_session):
    """Test creating a worker and retrieving by ID or user ID."""
    user = user_repository.create_user(db_session, {
        "phone": "+919876543211",
        "full_name": "Arjun Kumar",
        "role": UserRole.WORKER,
    })

    worker = worker_repository.create_worker(db_session, {
        "user_id": user.id,
        "daily_wage_rate": 650.0,
        "experience_years": 3,
        "status": WorkerStatus.VERIFIED,
    })

    assert worker.id is not None
    assert worker.user_id == user.id
    assert worker.daily_wage_rate == 650.0

    retrieved = worker_repository.get_worker_by_id(db_session, worker.id)
    assert retrieved is not None
    assert retrieved.id == worker.id

    by_user = worker_repository.get_worker_by_user_id(db_session, user.id)
    assert by_user is not None
    assert by_user.id == worker.id


def test_list_available_workers(db_session):
    """Test filtering workers by verified and availability status."""
    u1 = user_repository.create_user(db_session, {
        "phone": "+919876543212",
        "full_name": "Worker One",
        "role": UserRole.WORKER,
    })
    u2 = user_repository.create_user(db_session, {
        "phone": "+919876543213",
        "full_name": "Worker Two",
        "role": UserRole.WORKER,
    })

    # Worker 1: verified & available
    worker_repository.create_worker(db_session, {
        "user_id": u1.id,
        "status": WorkerStatus.VERIFIED,
        "is_available": True,
        "current_active_jobs": 0,
    })

    # Worker 2: pending (not yet verified)
    worker_repository.create_worker(db_session, {
        "user_id": u2.id,
        "status": WorkerStatus.PENDING,
        "is_available": True,
    })

    available = worker_repository.list_available_workers(db_session)
    assert len(available) == 1
    assert available[0].user_id == u1.id


def test_worker_skills_and_certifications(db_session):
    """Test assigning skills and certifications to a worker."""
    user = user_repository.create_user(db_session, {
        "phone": "+919876543214",
        "full_name": "Worker Three",
        "role": UserRole.WORKER,
    })
    worker = worker_repository.create_worker(db_session, {
        "user_id": user.id,
        "status": WorkerStatus.VERIFIED,
    })

    cat = service_repository.create_category(db_session, {
        "code": "plumbing",
        "name": "Plumbing",
    })
    skill = service_repository.create_skill(db_session, {
        "category_id": cat.id,
        "name": "Pipe Fitting",
    })

    ws = worker_repository.add_worker_skill(
        db_session, worker.id, skill.id, proficiency_level="expert", is_verified=True
    )
    assert ws.skill_id == skill.id
    assert ws.proficiency_level == "expert"

    skills = worker_repository.get_worker_skills(db_session, worker.id)
    assert len(skills) == 1

    cert = worker_repository.add_certification(db_session, {
        "worker_id": worker.id,
        "title": "National Trade Certificate (NTC) Plumber",
        "certificate_number": "NTC-88219",
    })
    assert cert.id is not None
    assert cert.verification_status == "pending"

    updated_cert = worker_repository.update_certification_status(
        db_session, cert.id, verification_status="verified", ocr_verified=True
    )
    assert updated_cert.verification_status == "verified"
    assert updated_cert.ocr_verified is True


def test_update_worker_workload(db_session):
    """Test tracking workload for fair job distribution."""
    user = user_repository.create_user(db_session, {
        "phone": "+919876543215",
        "full_name": "Worker Four",
        "role": UserRole.WORKER,
    })
    worker = worker_repository.create_worker(db_session, {
        "user_id": user.id,
        "status": WorkerStatus.VERIFIED,
        "current_active_jobs": 0,
        "total_completed_jobs": 0,
    })

    # Add active job
    worker_repository.update_worker_workload(db_session, worker.id, active_jobs_delta=1)
    assert worker.current_active_jobs == 1

    # Complete job (decrement active, increment completed)
    worker_repository.update_worker_workload(
        db_session, worker.id, active_jobs_delta=-1, completed_jobs_delta=1
    )
    assert worker.current_active_jobs == 0
    assert worker.total_completed_jobs == 1
