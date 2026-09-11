"""Suitability scoring engine for smart worker-to-customer matching.

Combines four weighted factors into a single 0–1 numeric score:
    1. **Skill match**   — does the worker possess the required skill?
    2. **Distance**      — Haversine proximity (lower km → higher score).
    3. **Rating**        — customer satisfaction history (1–5 → 0–1).
    4. **Workload**      — current active jobs (lower → higher score = fairness).

Weights are configurable per call; defaults tuned for cooperative fairness.

Design contract:
    This module exposes a single ``calculate_suitability_score`` function
    with a stable signature. A trained Scikit-learn model can later replace
    the body of this function without changing any callers.
"""

from __future__ import annotations

import math
from typing import Any, Dict, Optional, Sequence, Tuple

import numpy as np

from app.core.constants import DEFAULT_SEARCH_RADIUS_KM

# ---------------------------------------------------------------------------
# Type aliases (kept loose so both ORM objects and dicts work)
# ---------------------------------------------------------------------------

WorkerLike = Any  # Worker ORM instance or dict with matching keys


# ---------------------------------------------------------------------------
# Default scoring weights — sum should equal 1.0
# ---------------------------------------------------------------------------

DEFAULT_WEIGHTS: Dict[str, float] = {
    "skill": 0.30,
    "distance": 0.25,
    "rating": 0.25,
    "workload": 0.20,
}

# Maximum distance (km) at which distance_score reaches 0.
# Workers beyond this radius still get scored but with distance_score = 0.
MAX_SCORING_RADIUS_KM: float = DEFAULT_SEARCH_RADIUS_KM  # 15 km from constants

# Earth's mean radius in kilometres (for Haversine).
EARTH_RADIUS_KM: float = 6371.0


# ---------------------------------------------------------------------------
# Haversine Distance
# ---------------------------------------------------------------------------

def haversine_distance(
    lat1: float, lon1: float, lat2: float, lon2: float
) -> float:
    """Calculate the great-circle distance between two points on Earth.

    Args:
        lat1, lon1: Coordinates of point A (degrees).
        lat2, lon2: Coordinates of point B (degrees).

    Returns:
        Distance in kilometres.
    """
    rlat1, rlon1, rlat2, rlon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = rlat2 - rlat1
    dlon = rlon2 - rlon1
    a = math.sin(dlat / 2) ** 2 + math.cos(rlat1) * math.cos(rlat2) * math.sin(dlon / 2) ** 2
    return EARTH_RADIUS_KM * 2 * math.asin(math.sqrt(a))


# ---------------------------------------------------------------------------
# Individual Sub-scores (each returns 0.0 – 1.0)
# ---------------------------------------------------------------------------

def _skill_score(
    worker: WorkerLike,
    required_skill_id: Optional[int],
) -> float:
    """Score how well the worker's skill set matches the request.

    Returns:
        1.0 if the worker has the required skill (or no skill filter given),
        0.0 otherwise.
    """
    if required_skill_id is None:
        # No skill requirement — every worker is equally suitable on this axis
        return 1.0

    # Support both ORM Worker (has .skills list of WorkerSkill) and dict
    if hasattr(worker, "skills"):
        worker_skill_ids = [ws.skill_id for ws in (worker.skills or [])]
    elif isinstance(worker, dict):
        worker_skill_ids = worker.get("skill_ids", [])
    else:
        return 0.0

    return 1.0 if required_skill_id in worker_skill_ids else 0.0


def _distance_score(
    worker: WorkerLike,
    customer_location: Tuple[float, float],
    max_radius_km: float = MAX_SCORING_RADIUS_KM,
) -> float:
    """Score based on proximity to the customer.

    Uses inverse linear decay: score = 1 − (distance / max_radius), clamped to [0, 1].
    If worker coordinates are missing, returns a neutral 0.5.
    """
    w_lat = _attr(worker, "latitude")
    w_lon = _attr(worker, "longitude")
    cust_lat, cust_lon = customer_location

    # Missing coordinates → neutral score
    if w_lat is None or w_lon is None or cust_lat is None or cust_lon is None:
        return 0.5

    distance_km = haversine_distance(w_lat, w_lon, cust_lat, cust_lon)

    if max_radius_km <= 0:
        return 1.0 if distance_km == 0 else 0.0

    return float(np.clip(1.0 - (distance_km / max_radius_km), 0.0, 1.0))


def _rating_score(worker: WorkerLike) -> float:
    """Normalize worker's average rating (1–5) to 0–1."""
    rating = _attr(worker, "average_rating")
    if rating is None:
        return 1.0  # new workers get benefit of the doubt (default 5.0 → 1.0)
    return float(np.clip(rating / 5.0, 0.0, 1.0))


def _workload_score(worker: WorkerLike) -> float:
    """Score inversely proportional to current active jobs (fairness).

    Formula: 1 / (1 + active_jobs).  Zero active jobs → 1.0 (ideal).
    """
    active_jobs = _attr(worker, "current_active_jobs")
    if active_jobs is None:
        active_jobs = 0
    return 1.0 / (1.0 + float(active_jobs))


# ---------------------------------------------------------------------------
# Main Scoring Function
# ---------------------------------------------------------------------------

def calculate_suitability_score(
    worker: WorkerLike,
    customer_location: Tuple[float, float],
    required_skill_id: Optional[int] = None,
    weights: Optional[Dict[str, float]] = None,
) -> float:
    """Calculate a composite suitability score for matching a worker to a request.

    Combines four sub-scores via a weighted linear combination.

    Args:
        worker: Worker ORM instance or dict with keys:
            ``latitude``, ``longitude``, ``average_rating``,
            ``current_active_jobs``, ``skills`` (list) or ``skill_ids`` (list[int]).
        customer_location: ``(latitude, longitude)`` of the service address.
        required_skill_id: Specific skill ID the job requires (None = any).
        weights: Optional custom weight dict overriding ``DEFAULT_WEIGHTS``.
            Keys: ``skill``, ``distance``, ``rating``, ``workload``.

    Returns:
        A float in [0.0, 1.0] — higher is better.
    """
    w = {**DEFAULT_WEIGHTS, **(weights or {})}

    # Normalize weights so they always sum to 1.0
    total_weight = sum(w.values())
    if total_weight > 0:
        w = {k: v / total_weight for k, v in w.items()}

    s_skill = _skill_score(worker, required_skill_id)
    s_dist = _distance_score(worker, customer_location)
    s_rate = _rating_score(worker)
    s_load = _workload_score(worker)

    score = (
        w.get("skill", 0) * s_skill
        + w.get("distance", 0) * s_dist
        + w.get("rating", 0) * s_rate
        + w.get("workload", 0) * s_load
    )

    return round(float(np.clip(score, 0.0, 1.0)), 4)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _attr(obj: Any, key: str) -> Any:
    """Retrieve attribute by name from an ORM object or dict."""
    if isinstance(obj, dict):
        return obj.get(key)
    return getattr(obj, key, None)
