"""Worker ranking model for smart job dispatch.

Orchestrates ``scoring.calculate_suitability_score`` across a candidate
pool and returns workers ranked by suitability, with scores and
sub-score breakdowns attached.

Design contract:
    ``rank_workers(workers, criteria)`` is the single entry-point used by
    the booking/dispatch service. The internal implementation can be swapped
    from rule-based scoring to a trained Scikit-learn model without changing
    the function signature or return shape.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Sequence, Tuple

import numpy as np

from app.ai.matching.scoring import (
    DEFAULT_WEIGHTS,
    _distance_score,
    _rating_score,
    _skill_score,
    _workload_score,
    calculate_suitability_score,
)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def rank_workers(
    workers: Sequence[Any],
    criteria: Dict[str, Any],
    top_n: Optional[int] = None,
) -> List[Dict[str, Any]]:
    """Score and rank a pool of candidate workers for a service request.

    Args:
        workers: Iterable of Worker ORM instances or dicts.
        criteria: Matching criteria dict with keys:
            - ``customer_location`` (tuple[float, float]): Required.
                (latitude, longitude) of the service address.
            - ``required_skill_id`` (int | None): Optional specific skill.
            - ``weights`` (dict | None): Optional custom scoring weights.
            - ``is_emergency`` (bool): If True, prioritizes proximity and
                availability over fairness balance.
        top_n: Return only the top N workers. None returns all, sorted.

    Returns:
        List of dicts, each containing:
            - ``worker``: The original worker object/dict.
            - ``suitability_score``: Composite score (0–1).
            - ``breakdown``: Dict of individual sub-scores for transparency.
            - ``rank``: 1-indexed rank position.

        Sorted descending by ``suitability_score``.
    """
    customer_location: Tuple[float, float] = criteria.get(
        "customer_location", (None, None)
    )
    required_skill_id: Optional[int] = criteria.get("required_skill_id")
    is_emergency: bool = criteria.get("is_emergency", False)

    # Adjust weights for emergency bookings: prioritize proximity + availability
    weights = criteria.get("weights")
    if weights is None and is_emergency:
        weights = {
            "skill": 0.15,
            "distance": 0.40,
            "rating": 0.15,
            "workload": 0.30,
        }

    scored: List[Dict[str, Any]] = []

    for worker in workers:
        score = calculate_suitability_score(
            worker=worker,
            customer_location=customer_location,
            required_skill_id=required_skill_id,
            weights=weights,
        )

        # Build per-factor breakdown for admin transparency / debugging
        breakdown = {
            "skill": round(_skill_score(worker, required_skill_id), 4),
            "distance": round(
                _distance_score(worker, customer_location), 4
            ),
            "rating": round(_rating_score(worker), 4),
            "workload": round(_workload_score(worker), 4),
        }

        scored.append({
            "worker": worker,
            "suitability_score": score,
            "breakdown": breakdown,
        })

    # Sort descending by score; ties broken by lower workload then higher rating
    scored.sort(
        key=lambda x: (
            x["suitability_score"],
            x["breakdown"]["workload"],
            x["breakdown"]["rating"],
        ),
        reverse=True,
    )

    # Assign rank
    for idx, entry in enumerate(scored, start=1):
        entry["rank"] = idx

    if top_n is not None and top_n > 0:
        return scored[:top_n]

    return scored


# ---------------------------------------------------------------------------
# Convenience: Best Match
# ---------------------------------------------------------------------------

def find_best_match(
    workers: Sequence[Any],
    criteria: Dict[str, Any],
    min_score: float = 0.1,
) -> Optional[Dict[str, Any]]:
    """Find the single best-matching worker above a minimum score threshold.

    Args:
        workers: Pool of candidate workers.
        criteria: Same criteria dict as ``rank_workers``.
        min_score: Minimum suitability score to be considered a valid match.

    Returns:
        The top-ranked worker dict, or None if no worker meets ``min_score``.
    """
    ranked = rank_workers(workers, criteria, top_n=1)
    if ranked and ranked[0]["suitability_score"] >= min_score:
        return ranked[0]
    return None
