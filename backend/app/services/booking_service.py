"""Booking lifecycle business logic service.

Handles booking creation, worker assignment, status transitions
(Pending → Assigned → In Progress → Completed / Cancelled),
and double-booking prevention. Updates worker workload counters
to support the cooperative fair-distribution model.
No direct DB access — delegates to repositories.
"""

import uuid
from datetime import datetime, timedelta, timezone
from typing import List, Optional

from sqlalchemy.orm import Session

from app.core.constants import BookingStatus, PaymentStatus, WorkerStatus
from app.core.exceptions import (
    BadRequestException,
    ForbiddenException,
    NotFoundException,
)
from app.models.booking import Booking
from app.repositories import (
    booking_repository,
    service_repository,
    user_repository,
    worker_repository,
)


# ---------------------------------------------------------------------------
# Booking Reference Generator
# ---------------------------------------------------------------------------

def _generate_booking_reference() -> str:
    """Generate a unique booking reference code (e.g. ``SS-A1B2C3D4``)."""
    short_id = uuid.uuid4().hex[:8].upper()
    return f"SS-{short_id}"


# ---------------------------------------------------------------------------
# Status Transition Rules
# ---------------------------------------------------------------------------

_VALID_STATUS_TRANSITIONS = {
    BookingStatus.PENDING: {BookingStatus.ASSIGNED, BookingStatus.CANCELLED},
    BookingStatus.ASSIGNED: {
        BookingStatus.IN_PROGRESS,
        BookingStatus.CANCELLED,
    },
    BookingStatus.IN_PROGRESS: {BookingStatus.COMPLETED, BookingStatus.CANCELLED},
    BookingStatus.COMPLETED: set(),  # terminal state
    BookingStatus.CANCELLED: set(),  # terminal state
}


def _validate_status_transition(
    current: BookingStatus, requested: BookingStatus
) -> None:
    """Enforce allowed booking lifecycle transitions.

    Raises:
        BadRequestException: If the transition is not permitted.
    """
    allowed = _VALID_STATUS_TRANSITIONS.get(current, set())
    if requested not in allowed:
        raise BadRequestException(
            f"Cannot transition booking from '{current.value}' to "
            f"'{requested.value}'. "
            f"Allowed transitions: {[s.value for s in allowed]}."
        )


# ---------------------------------------------------------------------------
# Double-Booking Prevention
# ---------------------------------------------------------------------------

# Default time window assumed for a service appointment (in hours).
# Used to detect overlapping bookings when no explicit end-time exists.
DEFAULT_SERVICE_DURATION_HOURS = 2


def _check_worker_time_conflict(
    db: Session,
    worker_id: int,
    scheduled_at: Optional[datetime],
    exclude_booking_id: Optional[int] = None,
) -> None:
    """Reject assignment if the worker already has a booking in the same time slot.

    A conflict exists when an existing non-cancelled, non-completed booking's
    scheduled_at falls within ± ``DEFAULT_SERVICE_DURATION_HOURS`` of the
    requested time.

    Args:
        db: Database session.
        worker_id: The worker being assigned.
        scheduled_at: The proposed appointment time (may be None for ASAP bookings).
        exclude_booking_id: A booking ID to skip (for re-assignment scenarios).

    Raises:
        BadRequestException: If a time-slot conflict is detected.
    """
    if scheduled_at is None:
        # ASAP / emergency bookings — no time-based conflict check.
        return

    # Fetch the worker's active (non-terminal) bookings
    worker_bookings = booking_repository.list_bookings_by_worker(
        db, worker_id, skip=0, limit=100
    )

    buffer = timedelta(hours=DEFAULT_SERVICE_DURATION_HOURS)

    for existing in worker_bookings:
        # Skip terminal states and the booking being re-assigned
        if existing.status in (BookingStatus.COMPLETED, BookingStatus.CANCELLED):
            continue
        if exclude_booking_id and existing.id == exclude_booking_id:
            continue

        if existing.scheduled_at is None:
            continue

        # Time windows overlap if they are within ± buffer of each other
        if abs((existing.scheduled_at - scheduled_at).total_seconds()) < buffer.total_seconds():
            raise BadRequestException(
                f"Worker {worker_id} already has booking "
                f"'{existing.booking_reference}' scheduled near "
                f"{existing.scheduled_at.isoformat()}. "
                f"Cannot double-book within a {DEFAULT_SERVICE_DURATION_HOURS}-hour window."
            )


# ---------------------------------------------------------------------------
# Create Booking
# ---------------------------------------------------------------------------

def create_booking(db: Session, booking_data: dict) -> Booking:
    """Create a new service booking.

    Business rules:
    - Customer must exist.
    - Service category must exist and be active.
    - If a worker_id is supplied, the worker must be verified, available,
      and free in the requested time slot.
    - A unique booking reference is auto-generated.

    Returns:
        The created Booking record.

    Raises:
        NotFoundException: Customer or category does not exist.
        BadRequestException: Category inactive, worker unavailable, or time conflict.
    """
    # Validate customer
    customer = user_repository.get_customer_by_id(db, booking_data["customer_id"])
    if not customer:
        raise NotFoundException(
            f"Customer with id {booking_data['customer_id']} not found."
        )

    # Validate service category
    category = service_repository.get_category_by_id(db, booking_data["category_id"])
    if not category:
        raise NotFoundException(
            f"Service category with id {booking_data['category_id']} not found."
        )
    if not category.is_active:
        raise BadRequestException(
            f"Service category '{category.name}' is currently inactive."
        )

    # Set default total_amount from category base_rate if not provided
    if booking_data.get("total_amount", 0) == 0 and category.base_rate > 0:
        booking_data["total_amount"] = category.base_rate

    # Pre-assign worker if specified
    worker_id = booking_data.get("worker_id")
    if worker_id:
        _validate_worker_for_assignment(db, worker_id, booking_data.get("scheduled_at"))
        booking_data["status"] = BookingStatus.ASSIGNED
    else:
        booking_data["status"] = BookingStatus.PENDING

    # Generate unique reference
    booking_data["booking_reference"] = _generate_booking_reference()
    booking_data.setdefault("payment_status", PaymentStatus.PENDING)

    booking = booking_repository.create_booking(db, booking_data)

    # Update worker workload if assigned at creation
    if worker_id:
        worker_repository.update_worker_workload(db, worker_id, active_jobs_delta=1)

    return booking


# ---------------------------------------------------------------------------
# Retrieve Booking
# ---------------------------------------------------------------------------

def get_booking(db: Session, booking_id: int) -> Booking:
    """Retrieve a booking by ID (summary).

    Raises:
        NotFoundException: Booking does not exist.
    """
    booking = booking_repository.get_booking_by_id(db, booking_id)
    if not booking:
        raise NotFoundException(f"Booking with id {booking_id} not found.")
    return booking


def get_booking_detail(db: Session, booking_id: int) -> Booking:
    """Retrieve a booking with all related entities eagerly loaded.

    Raises:
        NotFoundException: Booking does not exist.
    """
    booking = booking_repository.get_booking_by_id(db, booking_id, eager_load=True)
    if not booking:
        raise NotFoundException(f"Booking with id {booking_id} not found.")
    return booking


def get_booking_by_reference(db: Session, reference: str) -> Booking:
    """Retrieve a booking by its unique reference code.

    Raises:
        NotFoundException: Booking does not exist.
    """
    booking = booking_repository.get_booking_by_reference(db, reference)
    if not booking:
        raise NotFoundException(f"Booking with reference '{reference}' not found.")
    return booking


# ---------------------------------------------------------------------------
# Assign Worker
# ---------------------------------------------------------------------------

def _validate_worker_for_assignment(
    db: Session,
    worker_id: int,
    scheduled_at: Optional[datetime],
    exclude_booking_id: Optional[int] = None,
) -> None:
    """Common validation before assigning a worker to a booking.

    Raises:
        NotFoundException: Worker does not exist.
        ForbiddenException: Worker is not verified.
        BadRequestException: Worker unavailable or time conflict.
    """
    worker = worker_repository.get_worker_by_id(db, worker_id)
    if not worker:
        raise NotFoundException(f"Worker with id {worker_id} not found.")
    if worker.status != WorkerStatus.VERIFIED:
        raise ForbiddenException(
            f"Worker {worker_id} is not verified (status: {worker.status.value})."
        )
    if not worker.is_available:
        raise BadRequestException(
            f"Worker {worker_id} is currently marked as unavailable."
        )
    _check_worker_time_conflict(db, worker_id, scheduled_at, exclude_booking_id)


def assign_worker(db: Session, booking_id: int, worker_id: int) -> Booking:
    """Assign a worker to an existing pending booking.

    Business rules:
    - Booking must be in PENDING status.
    - Worker must be verified, available, and free at the scheduled time.
    - Worker's active_jobs counter is incremented.

    Raises:
        NotFoundException: Booking or worker not found.
        BadRequestException: Booking not in PENDING state, or time conflict.
    """
    booking = get_booking(db, booking_id)

    if booking.status != BookingStatus.PENDING:
        raise BadRequestException(
            f"Can only assign workers to PENDING bookings. "
            f"Current status: {booking.status.value}."
        )

    _validate_worker_for_assignment(db, worker_id, booking.scheduled_at, booking_id)

    updated = booking_repository.assign_worker_to_booking(db, booking_id, worker_id)
    if not updated:
        raise NotFoundException(f"Booking with id {booking_id} not found.")

    # Track workload
    worker_repository.update_worker_workload(db, worker_id, active_jobs_delta=1)

    return updated


# ---------------------------------------------------------------------------
# Status Transitions
# ---------------------------------------------------------------------------

def update_booking_status(
    db: Session,
    booking_id: int,
    new_status: BookingStatus,
    payment_status: Optional[PaymentStatus] = None,
) -> Booking:
    """Transition a booking through its lifecycle.

    Validates the transition is allowed, then delegates to the repository.
    On completion or cancellation, adjusts the assigned worker's workload.

    Raises:
        NotFoundException: Booking not found.
        BadRequestException: Invalid status transition or missing worker for start.
    """
    booking = get_booking(db, booking_id)

    _validate_status_transition(booking.status, new_status)

    # A booking cannot start without an assigned worker
    if new_status == BookingStatus.IN_PROGRESS and booking.worker_id is None:
        raise BadRequestException(
            "Cannot start a booking that has no assigned worker."
        )

    updated = booking_repository.update_booking_status(
        db, booking_id, new_status, payment_status
    )
    if not updated:
        raise NotFoundException(f"Booking with id {booking_id} not found.")

    # Adjust worker workload on terminal transitions
    if booking.worker_id:
        if new_status == BookingStatus.COMPLETED:
            worker_repository.update_worker_workload(
                db, booking.worker_id,
                active_jobs_delta=-1,
                completed_jobs_delta=1,
            )
        elif new_status == BookingStatus.CANCELLED:
            worker_repository.update_worker_workload(
                db, booking.worker_id, active_jobs_delta=-1
            )

    return updated


def start_booking(db: Session, booking_id: int) -> Booking:
    """Convenience: transition a booking to IN_PROGRESS."""
    return update_booking_status(db, booking_id, BookingStatus.IN_PROGRESS)


def complete_booking(
    db: Session,
    booking_id: int,
    payment_status: Optional[PaymentStatus] = None,
) -> Booking:
    """Convenience: transition a booking to COMPLETED, optionally setting payment."""
    return update_booking_status(
        db, booking_id, BookingStatus.COMPLETED, payment_status
    )


def cancel_booking(db: Session, booking_id: int) -> Booking:
    """Cancel a booking, releasing the worker's slot.

    Only non-completed bookings can be cancelled.
    """
    return update_booking_status(db, booking_id, BookingStatus.CANCELLED)


# ---------------------------------------------------------------------------
# Listing
# ---------------------------------------------------------------------------

def list_customer_bookings(
    db: Session, customer_id: int, skip: int = 0, limit: int = 20
) -> List[Booking]:
    """List bookings placed by a specific customer."""
    return booking_repository.list_bookings_by_customer(
        db, customer_id, skip=skip, limit=limit
    )


def list_worker_bookings(
    db: Session, worker_id: int, skip: int = 0, limit: int = 20
) -> List[Booking]:
    """List bookings assigned to a specific worker."""
    return booking_repository.list_bookings_by_worker(
        db, worker_id, skip=skip, limit=limit
    )


def list_emergency_bookings(
    db: Session, pending_only: bool = True, skip: int = 0, limit: int = 20
) -> List[Booking]:
    """List emergency/on-demand bookings."""
    return booking_repository.list_emergency_bookings(
        db, pending_only=pending_only, skip=skip, limit=limit
    )


def list_all_bookings(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    status: Optional[BookingStatus] = None,
    category_id: Optional[int] = None,
) -> List[Booking]:
    """Admin: list all bookings with optional filters."""
    return booking_repository.list_all_bookings(
        db, skip=skip, limit=limit, status=status, category_id=category_id
    )
