"""Rating API routes — submit & retrieve ratings.

Endpoints:
    POST  /ratings             — Submit a rating for a completed booking
    GET   /ratings/{id}        — Get a single rating
    GET   /ratings/booking/{id} — Get the rating for a specific booking
    GET   /ratings/worker/{id} — List all ratings for a worker
"""

from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_customer, get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.booking import RatingCreate, RatingResponse
from app.services import rating_service

router = APIRouter(prefix="/ratings", tags=["Ratings"])


# ---------------------------------------------------------------------------
# Submit Rating
# ---------------------------------------------------------------------------

@router.post("", response_model=RatingResponse, status_code=201)
def submit_rating(
    data: RatingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer),
):
    """Submit a rating for a completed booking.

    Only the customer who placed the booking can rate it.
    Each booking can only be rated once.
    """
    from app.repositories import user_repository
    customer = user_repository.get_customer_by_user_id(db, current_user.id)
    customer_id = customer.id if customer else 0

    return rating_service.submit_rating(
        db,
        customer_id=customer_id,
        booking_id=data.booking_id,
        worker_id=data.worker_id,
        score=data.score,
        review=data.review,
    )


# ---------------------------------------------------------------------------
# Retrieval
# ---------------------------------------------------------------------------

@router.get("/{rating_id}", response_model=RatingResponse)
def get_rating(
    rating_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    """Get a rating by its ID."""
    return rating_service.get_rating(db, rating_id)


@router.get("/booking/{booking_id}", response_model=RatingResponse)
def get_booking_rating(
    booking_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    """Get the rating submitted for a specific booking."""
    return rating_service.get_booking_rating(db, booking_id)


@router.get("/worker/{worker_id}", response_model=List[RatingResponse])
def list_worker_ratings(
    worker_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all ratings and reviews for a worker (public)."""
    return rating_service.list_worker_ratings(
        db, worker_id, skip=skip, limit=limit,
    )
