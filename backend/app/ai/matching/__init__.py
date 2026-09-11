"""AI-based smart worker matching package.

Provides scoring and ranking functions for matching cooperative workers
to customer service requests. Balances skill fit, proximity, rating,
and current workload to ensure fair job distribution.

Designed for drop-in replacement: swap ``scoring.calculate_suitability_score``
with a trained Scikit-learn model later without changing any call signatures.
"""

from app.ai.matching.model import rank_workers
from app.ai.matching.scoring import calculate_suitability_score

__all__ = [
    "calculate_suitability_score",
    "rank_workers",
]
