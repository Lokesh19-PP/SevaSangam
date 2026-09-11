"""Worker ranking model for smart job dispatch.

Orchestrates ``scoring.calculate_suitability_score`` across a candidate
pool and returns workers ranked by suitability, with scores and
sub-score breakdowns attached.

    ╔══════════════════════════════════════════════════════════════════╗
    ║  FAIRNESS SAFEGUARD — SevaSangam Core Differentiator           ║
    ║                                                                ║
    ║  Unlike private gig platforms (Urban Company, etc.) that route ║
    ║  most work to a handful of top-rated workers, SevaSangam is a  ║
    ║  cooperative model where FAIR DISTRIBUTION matters.            ║
    ║                                                                ║
    ║  After initial scoring, this module checks whether the top-    ║
    ║  ranked worker has accumulated significantly more jobs than    ║
    ║  peers with similar skill/rating. If so, underutilized workers ║
    ║  receive a fairness BOOST to their scores, rebalancing the     ║
    ║  ranking before the final result is returned.                  ║
    ║                                                                ║
    ║  This ensures work is spread equitably across all cooperative  ║
    ║  members, supporting their livelihoods and welfare — the       ║
    ║  entire point of a labour cooperative society.                 ║
    ╚══════════════════════════════════════════════════════════════════╝

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
    _attr,
    _distance_score,
    _rating_score,
    _skill_score,
    _workload_score,
    calculate_suitability_score,
)


# ---------------------------------------------------------------------------
# Fairness Configuration
# ---------------------------------------------------------------------------

# A worker is considered "over-utilized" if their completed job count exceeds
# the pool's mean completed jobs by more than this factor × the standard deviation.
# Example: if mean=20, std=5, threshold=1.5 → over-utilized above 20 + 1.5*5 = 27.5
FAIRNESS_OVERUTILIZATION_THRESHOLD: float = 1.5

# Maximum score boost applied to underutilized workers.
# Kept moderate (0.10 = up to 10 percentage points) so it nudges rankings
# without completely overriding skill/distance/rating signals.
FAIRNESS_MAX_BOOST: float = 0.10

# Minimum number of workers in the pool for fairness rebalancing to activate.
# With fewer than 3 workers, there's not enough data for meaningful comparison.
FAIRNESS_MIN_POOL_SIZE: int = 3

# Rating similarity band: two workers are "peers" if their ratings differ
# by less than this amount (on a 1–5 scale).
FAIRNESS_RATING_SIMILARITY_BAND: float = 0.5


# ---------------------------------------------------------------------------
# Fairness Rebalancing Logic
# ---------------------------------------------------------------------------

def _apply_fairness_rebalancing(
    scored: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """Apply the cooperative fairness safeguard to scored worker results.

    HOW IT WORKS (step by step):
    ──────────────────────────────────────────────────────────────
    1. Collect ``total_completed_jobs`` from every worker in the pool.

    2. Compute the pool's mean and standard deviation of completed jobs.

    3. Identify the "over-utilization threshold":
         threshold = mean + FAIRNESS_OVERUTILIZATION_THRESHOLD × std_dev
       Workers above this have received significantly more work than peers.

    4. For each worker:
       a. If they are OVER the threshold → they are "over-utilized".
          Their score is NOT penalized (they earned it fairly through
          skill/proximity), but they receive NO boost.

       b. If they are UNDER or AT the threshold → they are "underutilized".
          They receive a BOOST proportional to how underutilized they are:
              boost = FAIRNESS_MAX_BOOST × (1 − jobs / threshold)
          This means a worker with 0 completed jobs gets the full boost,
          while one just below the threshold gets almost none.

       c. The boost is ONLY applied if the worker has a similar rating
          to the top-ranked worker (within FAIRNESS_RATING_SIMILARITY_BAND).
          This prevents boosting genuinely low-quality workers just because
          they haven't been assigned work.

    5. Mark each worker's breakdown with ``fairness_boost`` and
       ``fairness_adjusted`` for admin dashboard transparency.

    WHY THIS MATTERS:
    ──────────────────────────────────────────────────────────────
    Private gig platforms optimize purely for customer satisfaction,
    which creates a "winner takes all" dynamic where top-rated workers
    get 80% of bookings. In a cooperative, every member deserves fair
    access to work. This safeguard gently redistributes opportunity
    WITHOUT sacrificing service quality (the rating similarity check
    ensures only qualified workers get boosted).

    Args:
        scored: List of worker score dicts (output of initial scoring phase).

    Returns:
        The same list, with ``suitability_score`` adjusted where applicable.
        Each entry's ``breakdown`` dict gets additional keys:
            - ``fairness_boost``: The boost amount applied (0.0 if none).
            - ``fairness_adjusted``: Boolean indicating if rebalancing occurred.
    """
    # Guard: not enough workers for meaningful comparison
    if len(scored) < FAIRNESS_MIN_POOL_SIZE:
        for entry in scored:
            entry["breakdown"]["fairness_boost"] = 0.0
            entry["breakdown"]["fairness_adjusted"] = False
        return scored

    # Step 1: Collect completed job counts
    completed_jobs = np.array([
        _attr(entry["worker"], "total_completed_jobs") or 0
        for entry in scored
    ], dtype=np.float64)

    # Step 2: Pool statistics
    mean_jobs = float(np.mean(completed_jobs))
    std_jobs = float(np.std(completed_jobs))

    # If all workers have identical job counts, no rebalancing needed
    if std_jobs < 0.5:
        for entry in scored:
            entry["breakdown"]["fairness_boost"] = 0.0
            entry["breakdown"]["fairness_adjusted"] = False
        return scored

    # Step 3: Over-utilization threshold
    overutil_threshold = mean_jobs + FAIRNESS_OVERUTILIZATION_THRESHOLD * std_jobs

    # Top-ranked worker's rating (for similarity comparison)
    top_rating = scored[0]["breakdown"].get("rating", 1.0) * 5.0  # denormalize

    # Step 4: Apply boosts
    any_adjusted = False
    for i, entry in enumerate(scored):
        worker = entry["worker"]
        worker_jobs = float(_attr(worker, "total_completed_jobs") or 0)
        worker_rating = (_attr(worker, "average_rating") or 5.0)

        # Default: no boost
        entry["breakdown"]["fairness_boost"] = 0.0
        entry["breakdown"]["fairness_adjusted"] = False

        # Skip if worker is over the utilization threshold
        if worker_jobs > overutil_threshold:
            continue

        # Only boost workers whose rating is within the similarity band
        # of the top-ranked worker's rating. This prevents boosting
        # genuinely poor-performing workers.
        if abs(worker_rating - top_rating) > FAIRNESS_RATING_SIMILARITY_BAND:
            continue

        # Calculate proportional boost:
        # - Worker with 0 jobs → full boost (FAIRNESS_MAX_BOOST)
        # - Worker at threshold → zero boost
        if overutil_threshold > 0:
            utilization_ratio = worker_jobs / overutil_threshold
        else:
            utilization_ratio = 0.0

        boost = FAIRNESS_MAX_BOOST * (1.0 - utilization_ratio)
        boost = max(0.0, min(boost, FAIRNESS_MAX_BOOST))  # clamp

        if boost > 0.001:  # only apply meaningful boosts
            entry["suitability_score"] = round(
                min(1.0, entry["suitability_score"] + boost), 4
            )
            entry["breakdown"]["fairness_boost"] = round(boost, 4)
            entry["breakdown"]["fairness_adjusted"] = True
            any_adjusted = True

    return scored


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def rank_workers(
    workers: Sequence[Any],
    criteria: Dict[str, Any],
    top_n: Optional[int] = None,
) -> List[Dict[str, Any]]:
    """Score and rank a pool of candidate workers for a service request.

    Pipeline:
        1. Score each worker on skill, distance, rating, and workload.
        2. Apply the cooperative fairness safeguard to rebalance scores.
        3. Re-sort by adjusted scores and assign final ranks.

    Args:
        workers: Iterable of Worker ORM instances or dicts.
        criteria: Matching criteria dict with keys:
            - ``customer_location`` (tuple[float, float]): Required.
                (latitude, longitude) of the service address.
            - ``required_skill_id`` (int | None): Optional specific skill.
            - ``weights`` (dict | None): Optional custom scoring weights.
            - ``is_emergency`` (bool): If True, prioritizes proximity and
                availability over fairness balance.
            - ``skip_fairness`` (bool): If True, skips the fairness safeguard
                (useful for emergency dispatch where speed > fairness).
        top_n: Return only the top N workers. None returns all, sorted.

    Returns:
        List of dicts, each containing:
            - ``worker``: The original worker object/dict.
            - ``suitability_score``: Composite score (0–1), possibly adjusted.
            - ``breakdown``: Dict of individual sub-scores + fairness info.
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

    # ── Phase 1: Initial Scoring ──────────────────────────────────────────
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

    # Initial sort (needed before fairness check so "top-ranked" is meaningful)
    scored.sort(
        key=lambda x: (
            x["suitability_score"],
            x["breakdown"]["workload"],
            x["breakdown"]["rating"],
        ),
        reverse=True,
    )

    # ── Phase 2: Fairness Safeguard ───────────────────────────────────────
    #
    # This is the CORE DIFFERENTIATOR of SevaSangam.
    #
    # Private gig platforms skip this step entirely — they just return the
    # top-scored worker every time, creating a "rich get richer" effect.
    #
    # SevaSangam's cooperative model applies a fairness rebalancing pass
    # that gently boosts underutilized workers who are similarly qualified,
    # ensuring equitable work distribution across all cooperative members.
    #
    # The safeguard is skipped only when:
    #   - The caller explicitly sets skip_fairness=True, OR
    #   - It's an emergency booking (speed > fairness in emergencies)
    skip_fairness = criteria.get("skip_fairness", False)
    if not skip_fairness and not is_emergency:
        scored = _apply_fairness_rebalancing(scored)

    # ── Phase 3: Final Sort & Rank ────────────────────────────────────────
    # Re-sort after fairness adjustments may have changed scores
    scored.sort(
        key=lambda x: (
            x["suitability_score"],
            x["breakdown"]["workload"],
            x["breakdown"]["rating"],
        ),
        reverse=True,
    )

    # Assign final rank
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
