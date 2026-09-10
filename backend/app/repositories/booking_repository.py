"""Data access repository for Service Bookings."""

from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.constants import BookingStatus, PaymentStatus
from app.models.booking import Booking


def get_booking_by_id(db: Session, booking_id: int, eager_load: bool = False) -> Optional[Booking]:
    """Retrieve booking by ID, optionally eager-loading relationships."""
    if eager_load:
        stmt = (
            select(Booking)
            .options(
                selectinload(Booking.customer),
                selectinload(Booking.worker),
                selectinload(Booking.category),
                selectinload(Booking.rating),
            )
            .where(Booking.id == booking_id)
        )
        return db.scalars(stmt).first()
    return db.get(Booking, booking_id)


def get_booking_by_reference(db: Session, reference: str) -> Optional[Booking]:
    """Retrieve booking by its unique reference code."""
    stmt = select(Booking).where(Booking.booking_reference == reference)
    return db.scalars(stmt).first()


def create_booking(db: Session, booking_data: dict) -> Booking:
    """Insert a new service booking."""
    booking = Booking(**booking_data)
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def update_booking(db: Session, booking_id: int, update_data: dict) -> Optional[Booking]:
    """Update booking details."""
    booking = db.get(Booking, booking_id)
    if not booking:
        return None
    for key, value in update_data.items():
        if hasattr(booking, key) and value is not None:
            setattr(booking, key, value)
    db.commit()
    db.refresh(booking)
    return booking


def update_booking_status(
    db: Session,
    booking_id: int,
    status: BookingStatus,
    payment_status: Optional[PaymentStatus] = None,
) -> Optional[Booking]:
    """Update the lifecycle state of a booking and record milestone timestamps."""
    booking = db.get(Booking, booking_id)
    if not booking:
        return None
    booking.status = status
    now = datetime.now(timezone.utc)
    if status == BookingStatus.IN_PROGRESS and not booking.started_at:
        booking.started_at = now
    elif status == BookingStatus.COMPLETED and not booking.completed_at:
        booking.completed_at = now

    if payment_status is not None:
        booking.payment_status = payment_status

    db.commit()
    db.refresh(booking)
    return booking


def assign_worker_to_booking(
    db: Session, booking_id: int, worker_id: int
) -> Optional[Booking]:
    """Assign a matched worker to an existing booking."""
    booking = db.get(Booking, booking_id)
    if not booking:
        return None
    booking.worker_id = worker_id
    booking.status = BookingStatus.ASSIGNED
    db.commit()
    db.refresh(booking)
    return booking


def list_bookings_by_customer(
    db: Session, customer_id: int, skip: int = 0, limit: int = 20
) -> List[Booking]:
    """List bookings placed by a specific customer."""
    stmt = (
        select(Booking)
        .where(Booking.customer_id == customer_id)
        .order_by(Booking.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(db.scalars(stmt).all())


def list_bookings_by_worker(
    db: Session, worker_id: int, skip: int = 0, limit: int = 20
) -> List[Booking]:
    """List bookings assigned to a specific worker."""
    stmt = (
        select(Booking)
        .where(Booking.worker_id == worker_id)
        .order_by(Booking.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(db.scalars(stmt).all())


def list_emergency_bookings(
    db: Session, pending_only: bool = True, skip: int = 0, limit: int = 20
) -> List[Booking]:
    """List urgent emergency on-demand bookings."""
    stmt = select(Booking).where(Booking.is_emergency.is_(True))
    if pending_only:
        stmt = stmt.where(Booking.status == BookingStatus.PENDING)
    stmt = stmt.order_by(Booking.created_at.asc()).offset(skip).limit(limit)
    return list(db.scalars(stmt).all())


def list_all_bookings(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    status: Optional[BookingStatus] = None,
    category_id: Optional[int] = None,
) -> List[Booking]:
    """List all bookings with optional status and category filters for cooperative admin."""
    stmt = select(Booking)
    if status is not None:
        stmt = stmt.where(Booking.status == status)
    if category_id is not None:
        stmt = stmt.where(Booking.category_id == category_id)
    stmt = stmt.order_by(Booking.created_at.desc()).offset(skip).limit(limit)
    return list(db.scalars(stmt).all())
