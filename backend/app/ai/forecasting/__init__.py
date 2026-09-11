"""AI demand forecasting package.

Provides time-series preprocessing, model training, and prediction
functions for anticipating service demand by category and location.

Public API:
    predict_demand(service_category_id, location, date_range)
    predict_demand_all_categories(category_ids, location, date_range)
"""

from app.ai.forecasting.predictor import (
    predict_demand,
    predict_demand_all_categories,
)

__all__ = [
    "predict_demand",
    "predict_demand_all_categories",
]
