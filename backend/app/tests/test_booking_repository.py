"""Unit tests for booking_repository with in-memory SQLite database."""

from app.core.constants import BookingStatus, PaymentStatus, UserRole, WorkerStatus
from app.repositories import booking_repository, service_repository, user_repository, worker_repository


def _setup_booking_prerequisites(db_session):
    """Helper to create test customer, category, and worker."""
    c_user = user_repository.create_user(db_session, {
        "phone": "+919876543220",
        "full_name": "Test Customer",
        "role": UserRole.CUSTOMER,
    })
    customer = user_repository.create_customer(db_session, {
        "user_id": c_user.id,
        "address": "Baner Road, Pune",
        "city": "Pune",
    })

    w_user = user_repository.create_user(db_session, {
        "phone": "+919876543221",
        "full_name": "Test Worker",
        "role": UserRole.WORKER,
    })
    worker = worker_repository.create_worker(db_session, {
        "user_id": w_user.id,
        "status": WorkerStatus.VERIFIED,
    })

    category = service_repository.create_category(db_session, {
        "code": "carpentry",
        "name": "Carpentry",
        "base_rate": 300.0,
    })

    return customer, worker, category


def test_create_and_get_booking(db_session):
    """Test creating a booking and fetching by ID or reference."""
    customer, _, category = _setup_booking_prerequisites(db_session)

    booking = booking_repository.create_booking(db_session, {
        "booking_reference": "BK-TEST-001",
        "customer_id": customer.id,
        "category_id": category.id,
        "service_address": "Flat 12, Baner, Pune",
        "total_amount": 450.0,
        "is_emergency": False,
    })

    assert booking.id is not None
    assert booking.booking_reference == "BK-TEST-001"
    assert booking.status == BookingStatus.PENDING

    retrieved = booking_repository.get_booking_by_id(db_session, booking.id)
    assert retrieved is not None
    assert retrieved.booking_reference == "BK-TEST-001"

    by_ref = booking_repository.get_booking_by_reference(db_session, "BK-TEST-001")
    assert by_ref is not None
    assert by_ref.id == booking.id


def test_assign_worker_and_lifecycle_milestones(db_session):
    """Test worker assignment and status transitions with automatic timestamp recording."""
    customer, worker, category = _setup_booking_prerequisites(db_session)

    booking = booking_repository.create_booking(db_session, {
        "booking_reference": "BK-TEST-002",
        "customer_id": customer.id,
        "category_id": category.id,
        "service_address": "Sector 4, Pune",
        "status": BookingStatus.PENDING,
    })

    # Assign worker
    assigned = booking_repository.assign_worker_to_booking(db_session, booking.id, worker.id)
    assert assigned.worker_id == worker.id
    assert assigned.status == BookingStatus.ASSIGNED

    # Start work -> started_at milestone recorded
    in_progress = booking_repository.update_booking_status(
        db_session, booking.id, BookingStatus.IN_PROGRESS
    )
    assert in_progress.status == BookingStatus.IN_PROGRESS
    assert in_progress.started_at is not None

    # Complete work & mark paid -> completed_at milestone recorded
    completed = booking_repository.update_booking_status(
        db_session, booking.id, BookingStatus.COMPLETED, payment_status=PaymentStatus.PAID
    )
    assert completed.status == BookingStatus.COMPLETED
    assert completed.completed_at is not None
    assert completed.payment_status == PaymentStatus.PAID


def test_emergency_bookings(db_session):
    """Test listing urgent emergency on-demand bookings."""
    customer, _, category = _setup_booking_prerequisites(db_session)

    # Standard booking
    booking_repository.create_booking(db_session, {
        "booking_reference": "BK-STD-001",
        "customer_id": customer.id,
        "category_id": category.id,
        "service_address": "Address 1",
        "is_emergency": False,
    })

    # Emergency booking
    booking_repository.create_booking(db_session, {
        "booking_reference": "BK-EMG-001",
        "customer_id": customer.id,
        "category_id": category.id,
        "service_address": "Address 2",
        "is_emergency": True,
        "status": BookingStatus.PENDING,
    })

    emergencies = booking_repository.list_emergency_bookings(db_session, pending_only=True)
    assert len(emergencies) == 1
    assert emergencies[0].booking_reference == "BK-EMG-001"


def test_list_bookings_by_customer_and_worker(db_session):
    """Test listing customer and worker specific booking history."""
    customer, worker, category = _setup_booking_prerequisites(db_session)

    b1 = booking_repository.create_booking(db_session, {
        "booking_reference": "BK-HIST-001",
        "customer_id": customer.id,
        "worker_id": worker.id,
        "category_id": category.id,
        "service_address": "History Address",
    })

    cust_bookings = booking_repository.list_bookings_by_customer(db_session, customer.id)
    assert len(cust_bookings) == 1
    assert cust_bookings[0].id == b1.id

    worker_bookings = booking_repository.list_bookings_by_worker(db_session, worker.id)
    assert len(worker_bookings) == 1
    assert worker_bookings[0].id == b1.id
