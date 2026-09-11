"""AI Worker Matching API routes.

Endpoints:
    POST /matching/workers         — Find best workers for a booking request
    GET  /matching/recommendations — Get worker recommendations for a service
"""

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.services import matching_service

router = APIRouter(prefix="/matching", tags=["AI Matching"])


# ---------------------------------------------------------------------------
# Request / Response Schemas (route-specific)
# ---------------------------------------------------------------------------

class MatchingRequest(BaseModel):
    """Request body for worker matching."""

    category_id: int = Field(..., description="Service category ID")
    service_latitude: Optional[float] = Field(None, description="Customer latitude")
    service_longitude: Optional[float] = Field(None, description="Customer longitude")
    required_skill_id: Optional[int] = None
    is_emergency: bool = False
    cooperative_id: Optional[int] = None
    top_n: int = Field(5, ge=1, le=20)


class MatchedWorkerResponse(BaseModel):
    """A single ranked worker result."""

    rank: int
    suitability_score: float
    worker_id: int
    worker_name: str
    average_rating: float
    current_active_jobs: int
    total_completed_jobs: int
    is_available: bool
    breakdown: Dict[str, Any] = {}


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/workers", response_model=List[MatchedWorkerResponse])
def find_matched_workers(
    data: MatchingRequest,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    """Find and rank the best available workers for a booking request.

    Uses the AI matching engine with fairness safeguards to score
    workers based on skill, distance, rating, and workload balance.
    """
    booking_request = data.model_dump()
    ranked = matching_service.find_best_workers(
        db, booking_request, top_n=data.top_n,
    )

    # Transform AI engine output to API response shape
    results = []
    for entry in ranked:
        worker = entry.get("worker")
        # Support both ORM objects and dicts
        if hasattr(worker, "id"):
            worker_id = worker.id
            worker_name = worker.user.full_name if hasattr(worker, "user") and worker.user else f"Worker {worker.id}"
            avg_rating = worker.average_rating
            active_jobs = worker.current_active_jobs
            completed_jobs = worker.total_completed_jobs
            available = worker.is_available
        elif isinstance(worker, dict):
            worker_id = worker.get("id", 0)
            worker_name = worker.get("name", f"Worker {worker_id}")
            avg_rating = worker.get("average_rating", 0.0)
            active_jobs = worker.get("current_active_jobs", 0)
            completed_jobs = worker.get("total_completed_jobs", 0)
            available = worker.get("is_available", True)
        else:
            continue

        results.append(MatchedWorkerResponse(
            rank=entry.get("rank", 0),
            suitability_score=entry.get("suitability_score", 0.0),
            worker_id=worker_id,
            worker_name=worker_name,
            average_rating=avg_rating,
            current_active_jobs=active_jobs,
            total_completed_jobs=completed_jobs,
            is_available=available,
            breakdown=entry.get("breakdown", {}),
        ))

    return results


@router.get("/recommendations", response_model=List[MatchedWorkerResponse])
def get_recommendations(
    serviceId: int = Query(..., alias="serviceId"),
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    """Get worker recommendations for a service category (convenience endpoint).

    Query-param based alternative to POST /matching/workers for simpler
    frontend integrations.
    """
    booking_request = {
        "category_id": serviceId,
        "service_latitude": lat,
        "service_longitude": lon,
        "is_emergency": False,
    }

    ranked = matching_service.find_best_workers(db, booking_request, top_n=5)

    results = []
    for entry in ranked:
        worker = entry.get("worker")
        if hasattr(worker, "id"):
            results.append(MatchedWorkerResponse(
                rank=entry.get("rank", 0),
                suitability_score=entry.get("suitability_score", 0.0),
                worker_id=worker.id,
                worker_name=worker.user.full_name if hasattr(worker, "user") and worker.user else f"Worker {worker.id}",
                average_rating=worker.average_rating,
                current_active_jobs=worker.current_active_jobs,
                total_completed_jobs=worker.total_completed_jobs,
                is_available=worker.is_available,
                breakdown=entry.get("breakdown", {}),
            ))

    return results
