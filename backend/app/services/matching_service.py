"""Matching service — bridges worker_repository with the AI matching engine.

Fetches candidate workers from the database, feeds them through
``ai.matching.rank_workers`` / ``find_best_match``, and returns
ranked results ready for booking assignment or API responses.

This is the single entry-point the booking route (or booking_service)
should call — it never imports ai.matching directly.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy.orm import Session

from app.ai.matching.model import find_best_match, rank_workers
from app.core.constants import WorkerStatus
from app.core.exceptions import BadRequestException, NotFoundException
from app.repositories import service_repository, worker_repository


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def find_best_workers(
    db: Session,
    booking_request: Dict[str, Any],
    top_n: Optional[int] = 5,
) -> List[Dict[str, Any]]:
    """Find and rank the best available workers for a booking request.

    End-to-end pipeline:
        1. Resolve the service category and required skills.
        2. Fetch verified, available workers from the repository.
        3. Optionally filter by cooperative.
        4. Score and rank via the AI matching engine.
        5. Return the top N results with scores and breakdowns.

    Args:
        db: Database session.
        booking_request: Dict describing what the customer needs:
            - ``category_id`` (int): Required. Service category.
            - ``service_latitude`` (float | None): Customer location lat.
            - ``service_longitude`` (float | None): Customer location lon.
            - ``required_skill_id`` (int | None): Specific skill needed.
            - ``is_emergency`` (bool): Adjusts scoring weights.
            - ``cooperative_id`` (int | None): Limit to a specific coop.
            - ``weights`` (dict | None): Custom scoring weight overrides.
        top_n: Max number of workers to return. None = return all ranked.

    Returns:
        List of ranked worker dicts from ``ai.matching.rank_workers``,
        each containing ``worker``, ``suitability_score``, ``breakdown``, ``rank``.

    Raises:
        NotFoundException: Service category not found.
        BadRequestException: No available workers found.
    """
    category_id = booking_request.get("category_id")
    if category_id is None:
        raise BadRequestException("booking_request must include 'category_id'.")

    # Validate category exists
    category = service_repository.get_category_by_id(db, category_id)
    if not category:
        raise NotFoundException(f"Service category {category_id} not found.")

    # Build customer location tuple
    customer_location: Tuple[Optional[float], Optional[float]] = (
        booking_request.get("service_latitude"),
        booking_request.get("service_longitude"),
    )

    # Fetch candidate pool: verified + available workers
    cooperative_id = booking_request.get("cooperative_id")
    candidates = worker_repository.list_available_workers(
        db,
        skip=0,
        limit=100,  # generous pool for ranking
        cooperative_id=cooperative_id,
    )

    if not candidates:
        raise BadRequestException(
            "No available workers found for the requested service. "
            "Try broadening the search or checking back later."
        )

    # Eager-load skills for each candidate so the scoring engine can check them
    detailed_candidates = []
    for w in candidates:
        detailed = worker_repository.get_worker_by_id(db, w.id, eager_load=True)
        if detailed:
            detailed_candidates.append(detailed)

    if not detailed_candidates:
        raise BadRequestException("No available workers found after loading details.")

    # Build criteria for the AI engine
    criteria: Dict[str, Any] = {
        "customer_location": customer_location,
        "required_skill_id": booking_request.get("required_skill_id"),
        "is_emergency": booking_request.get("is_emergency", False),
    }
    if booking_request.get("weights"):
        criteria["weights"] = booking_request["weights"]

    # Rank
    ranked = rank_workers(detailed_candidates, criteria, top_n=top_n)

    return ranked


def find_single_best_worker(
    db: Session,
    booking_request: Dict[str, Any],
    min_score: float = 0.1,
) -> Optional[Dict[str, Any]]:
    """Find the single best-matching worker for a booking, or None.

    A convenience wrapper around ``find_best_workers`` that returns
    only the top result if it meets the minimum score threshold.

    Args:
        db: Database session.
        booking_request: Same as ``find_best_workers``.
        min_score: Minimum suitability score to accept.

    Returns:
        Top-ranked worker dict, or None if no match meets the threshold.
    """
    try:
        ranked = find_best_workers(db, booking_request, top_n=1)
    except BadRequestException:
        return None

    if ranked and ranked[0]["suitability_score"] >= min_score:
        return ranked[0]
    return None


def auto_assign_worker(
    db: Session,
    booking_request: Dict[str, Any],
    min_score: float = 0.1,
) -> Optional[int]:
    """Auto-select and return the best worker's ID for immediate assignment.

    Intended for use by ``booking_service.create_booking`` when no
    ``worker_id`` is supplied and auto-dispatch is enabled.

    Returns:
        The best worker's ID, or None if no suitable match found.
    """
    result = find_single_best_worker(db, booking_request, min_score)
    if result and result.get("worker"):
        worker = result["worker"]
        # Support both ORM and dict
        if hasattr(worker, "id"):
            return worker.id
        if isinstance(worker, dict):
            return worker.get("id")
    return None
