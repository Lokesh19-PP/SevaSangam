"""Data access repository for Ratings and Reviews."""

from typing import List, Optional
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.rating import Rating
from app.models.worker import Worker


def create_rating(db: Session, rating_data: dict) -> Rating:
    """Insert a new rating and update the worker's average rating stats."""
    rating = Rating(**rating_data)
    db.add(rating)
    db.flush()

    # Recalculate and update the worker's aggregated rating
    worker = db.get(Worker, rating.worker_id)
    if worker:
        avg_score, total_count = db.execute(
            select(func.avg(Rating.score), func.count(Rating.id)).where(
                Rating.worker_id == rating.worker_id
            )
        ).first() or (5.0, 0)

        worker.average_rating = round(float(avg_score or 5.0), 2)
        worker.total_ratings = int(total_count or 0)

    db.commit()
    db.refresh(rating)
    return rating


def get_rating_by_id(db: Session, rating_id: int) -> Optional[Rating]:
    """Retrieve rating by ID."""
    return db.get(Rating, rating_id)


def get_rating_by_booking_id(db: Session, booking_id: int) -> Optional[Rating]:
    """Retrieve the rating submitted for a specific booking."""
    stmt = select(Rating).where(Rating.booking_id == booking_id)
    return db.scalars(stmt).first()


def list_ratings_by_worker(
    db: Session, worker_id: int, skip: int = 0, limit: int = 20
) -> List[Rating]:
    """List all ratings and reviews for a worker."""
    stmt = (
        select(Rating)
        .where(Rating.worker_id == worker_id)
        .order_by(Rating.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(db.scalars(stmt).all())


def get_worker_average_rating(db: Session, worker_id: int) -> float:
    """Get the calculated average rating score for a worker."""
    stmt = select(func.avg(Rating.score)).where(Rating.worker_id == worker_id)
    result = db.scalar(stmt)
    return round(float(result), 2) if result is not None else 5.0
