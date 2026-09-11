"""Rating and review business logic service.

Enforces rules around when a booking can be rated (must be completed,
must be owned by the requesting customer, no duplicate ratings).
Delegates all persistence to rating_repository.
"""

from typing import List

from sqlalchemy.orm import Session

from app.core.constants import BookingStatus
from app.core.exceptions import (
    BadRequestException,
    ForbiddenException,
    NotFoundException,
)
from app.models.rating import Rating
from app.repositories import booking_repository, rating_repository, worker_repository


# ---------------------------------------------------------------------------
# Submit Rating
# ---------------------------------------------------------------------------

def submit_rating(
    db: Session,
    customer_id: int,
    booking_id: int,
    worker_id: int,
    score: float,
    review: str | None = None,
) -> Rating:
    """Submit a rating for a completed booking.

    Business rules:
    - The booking must exist and be in COMPLETED status.
    - The booking must belong to the requesting customer.
    - The booking's assigned worker must match ``worker_id``.
    - A booking may only be rated once (no duplicate ratings).
    - Score must be between 1.0 and 5.0 (enforced at schema level too).

    Args:
        db: Database session.
        customer_id: ID of the customer submitting the rating.
        booking_id: Booking being rated.
        worker_id: Worker being rated (cross-checked against booking).
        score: Rating score (1.0–5.0).
        review: Optional free-text review.

    Returns:
        The created Rating record (worker aggregate stats updated by repository).

    Raises:
        NotFoundException: Booking not found.
        BadRequestException: Booking not completed or already rated.
        ForbiddenException: Customer doesn't own the booking or worker mismatch.
    """
    # 1. Validate booking exists
    booking = booking_repository.get_booking_by_id(db, booking_id)
    if not booking:
        raise NotFoundException(f"Booking with id {booking_id} not found.")

    # 2. Must be completed
    if booking.status != BookingStatus.COMPLETED:
        raise BadRequestException(
            f"Can only rate completed bookings. "
            f"Current status: {booking.status.value}."
        )

    # 3. Customer must own the booking
    if booking.customer_id != customer_id:
        raise ForbiddenException(
            "You can only rate bookings that belong to you."
        )

    # 4. Worker must match the booking's assigned worker
    if booking.worker_id != worker_id:
        raise BadRequestException(
            f"Worker {worker_id} is not the assigned worker for this booking. "
            f"Expected worker_id: {booking.worker_id}."
        )

    # 5. No duplicate ratings
    existing_rating = rating_repository.get_rating_by_booking_id(db, booking_id)
    if existing_rating:
        raise BadRequestException(
            f"Booking {booking_id} has already been rated."
        )

    # 6. Score bounds (defense in depth — schema validates too)
    if not (1.0 <= score <= 5.0):
        raise BadRequestException("Rating score must be between 1.0 and 5.0.")

    # Create rating — repository also recalculates worker aggregate stats
    return rating_repository.create_rating(db, {
        "booking_id": booking_id,
        "customer_id": customer_id,
        "worker_id": worker_id,
        "score": score,
        "review": review,
    })


# ---------------------------------------------------------------------------
# Retrieval
# ---------------------------------------------------------------------------

def get_rating(db: Session, rating_id: int) -> Rating:
    """Retrieve a rating by its ID.

    Raises:
        NotFoundException: Rating does not exist.
    """
    rating = rating_repository.get_rating_by_id(db, rating_id)
    if not rating:
        raise NotFoundException(f"Rating with id {rating_id} not found.")
    return rating


def get_booking_rating(db: Session, booking_id: int) -> Rating:
    """Retrieve the rating submitted for a specific booking.

    Raises:
        NotFoundException: No rating found for this booking.
    """
    rating = rating_repository.get_rating_by_booking_id(db, booking_id)
    if not rating:
        raise NotFoundException(
            f"No rating found for booking {booking_id}."
        )
    return rating


def list_worker_ratings(
    db: Session, worker_id: int, skip: int = 0, limit: int = 20
) -> List[Rating]:
    """List all ratings and reviews for a worker.

    Raises:
        NotFoundException: Worker does not exist.
    """
    worker = worker_repository.get_worker_by_id(db, worker_id)
    if not worker:
        raise NotFoundException(f"Worker with id {worker_id} not found.")
    return rating_repository.list_ratings_by_worker(
        db, worker_id, skip=skip, limit=limit
    )


def get_worker_average_rating(db: Session, worker_id: int) -> float:
    """Get the calculated average rating score for a worker.

    Returns 5.0 (default) if the worker has no ratings yet.

    Raises:
        NotFoundException: Worker does not exist.
    """
    worker = worker_repository.get_worker_by_id(db, worker_id)
    if not worker:
        raise NotFoundException(f"Worker with id {worker_id} not found.")
    return rating_repository.get_worker_average_rating(db, worker_id)
