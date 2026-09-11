"""Booking API routes — create, list, status transitions, cancel.

Endpoints:
    POST   /bookings              — Create a new booking
    GET    /bookings              — List bookings (admin: all, or filtered)
    GET    /bookings/upcoming     — List upcoming non-completed bookings
    GET    /bookings/history      — List completed/cancelled bookings
    GET    /bookings/{id}         — Get booking details
    GET    /bookings/user/{uid}   — List bookings for a specific customer
    PATCH  /bookings/{id}/status  — Update booking status (lifecycle transition)
    POST   /bookings/{id}/cancel  — Cancel a booking
    POST   /bookings/{id}/assign  — Assign a worker to a pending booking
"""

from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.constants import BookingStatus
from app.database.session import get_db
from app.models.user import User
from app.schemas.booking import (
    BookingCreate,
    BookingDetailResponse,
    BookingResponse,
    BookingStatusUpdate,
)
from app.services import booking_service

router = APIRouter(prefix="/bookings", tags=["Bookings"])


# ---------------------------------------------------------------------------
# Create Booking
# ---------------------------------------------------------------------------

@router.post("", response_model=BookingResponse, status_code=201)
def create_booking(
    data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new service booking.

    If ``worker_id`` is supplied, the worker is pre-assigned (status=ASSIGNED).
    Otherwise status starts as PENDING for dispatch.
    """
    booking_data = data.model_dump()
    # Ensure the customer_id is the authenticated user's customer profile
    # (The service layer validates the customer exists)
    return booking_service.create_booking(db, booking_data)


# ---------------------------------------------------------------------------
# Listing
# ---------------------------------------------------------------------------

@router.get("", response_model=List[BookingResponse])
def list_bookings(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[BookingStatus] = None,
    category_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List bookings — admin sees all, others see their own."""
    from app.core.constants import UserRole
    if current_user.role == UserRole.ADMIN:
        return booking_service.list_all_bookings(
            db, skip=skip, limit=limit, status=status, category_id=category_id,
        )
    elif current_user.role == UserRole.WORKER:
        from app.services import worker_service
        worker = worker_service.get_worker_by_user(db, current_user.id)
        return booking_service.list_worker_bookings(db, worker.id, skip=skip, limit=limit)
    else:
        # Customer — find their customer profile
        from app.repositories import user_repository
        customer = user_repository.get_customer_by_user_id(db, current_user.id)
        if customer:
            return booking_service.list_customer_bookings(db, customer.id, skip=skip, limit=limit)
        return []


@router.get("/upcoming", response_model=List[BookingResponse])
def get_upcoming_bookings(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List upcoming (non-completed, non-cancelled) bookings for the current user."""
    from app.core.constants import UserRole
    from app.repositories import user_repository

    if current_user.role == UserRole.WORKER:
        from app.services import worker_service
        worker = worker_service.get_worker_by_user(db, current_user.id)
        all_bookings = booking_service.list_worker_bookings(db, worker.id, skip=skip, limit=limit)
    elif current_user.role == UserRole.CUSTOMER:
        customer = user_repository.get_customer_by_user_id(db, current_user.id)
        all_bookings = booking_service.list_customer_bookings(
            db, customer.id if customer else 0, skip=skip, limit=limit,
        )
    else:
        all_bookings = booking_service.list_all_bookings(db, skip=skip, limit=limit)

    # Filter to non-terminal statuses
    return [
        b for b in all_bookings
        if b.status not in (BookingStatus.COMPLETED, BookingStatus.CANCELLED)
    ]


@router.get("/history", response_model=List[BookingResponse])
def get_booking_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List completed/cancelled booking history for the current user."""
    from app.core.constants import UserRole
    from app.repositories import user_repository

    if current_user.role == UserRole.WORKER:
        from app.services import worker_service
        worker = worker_service.get_worker_by_user(db, current_user.id)
        all_bookings = booking_service.list_worker_bookings(db, worker.id, skip=skip, limit=limit)
    elif current_user.role == UserRole.CUSTOMER:
        customer = user_repository.get_customer_by_user_id(db, current_user.id)
        all_bookings = booking_service.list_customer_bookings(
            db, customer.id if customer else 0, skip=skip, limit=limit,
        )
    else:
        all_bookings = booking_service.list_all_bookings(db, skip=skip, limit=limit)

    # Filter to terminal statuses only
    return [
        b for b in all_bookings
        if b.status in (BookingStatus.COMPLETED, BookingStatus.CANCELLED)
    ]


@router.get("/user/{user_id}", response_model=List[BookingResponse])
def get_bookings_by_user(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    """List bookings for a specific customer by user_id."""
    from app.repositories import user_repository
    customer = user_repository.get_customer_by_user_id(db, user_id)
    if customer:
        return booking_service.list_customer_bookings(db, customer.id, skip=skip, limit=limit)
    return []


# ---------------------------------------------------------------------------
# Single Booking
# ---------------------------------------------------------------------------

@router.get("/{booking_id}", response_model=BookingDetailResponse)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    """Get detailed booking information including customer, worker, category, rating."""
    return booking_service.get_booking_detail(db, booking_id)


# ---------------------------------------------------------------------------
# Status Transitions
# ---------------------------------------------------------------------------

@router.patch("/{booking_id}/status", response_model=BookingResponse)
def update_status(
    booking_id: int,
    data: BookingStatusUpdate,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    """Transition a booking through its lifecycle (PENDING → ASSIGNED → IN_PROGRESS → COMPLETED)."""
    return booking_service.update_booking_status(db, booking_id, data.status)


@router.post("/{booking_id}/cancel", response_model=BookingResponse)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    """Cancel a booking. Only non-completed bookings can be cancelled."""
    return booking_service.cancel_booking(db, booking_id)


@router.post("/{booking_id}/assign", response_model=BookingResponse)
def assign_worker(
    booking_id: int,
    worker_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    """Assign a worker to a pending booking."""
    return booking_service.assign_worker(db, booking_id, worker_id)
