"""AI matching, forecasting, and machine learning models package.

Subpackages:
    matching    — Smart worker-to-customer scoring and ranking.
    forecasting — Service demand prediction by category and location.
"""

from app.ai import forecasting, matching

__all__ = ["matching", "forecasting"]
