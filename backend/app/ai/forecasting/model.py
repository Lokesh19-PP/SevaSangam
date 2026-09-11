"""Demand forecasting model module.

Provides a ``DemandForecaster`` class wrapping a Scikit-learn model
(defaults to Ridge regression) with fit/predict semantics.

Also includes a simpler ``MovingAverageForecaster`` as a lightweight
fallback when insufficient data exists for regression training.

Both forecasters share the same interface so the predictor layer
can swap them transparently.
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import List, Optional

import numpy as np
from sklearn.linear_model import Ridge


# ---------------------------------------------------------------------------
# Abstract interface (duck-typed — no ABC to keep it simple)
# ---------------------------------------------------------------------------
# Both forecasters expose:
#   fit(X: np.ndarray, y: np.ndarray) -> self
#   predict(X: np.ndarray) -> np.ndarray
#   is_fitted: bool


# ---------------------------------------------------------------------------
# Ridge Regression Forecaster
# ---------------------------------------------------------------------------

class DemandForecaster:
    """Scikit-learn-based demand forecaster using Ridge regression.

    Features expected (from ``preprocessing.time_series_to_features``):
        [day_ordinal, day_of_week, month, is_weekend]

    Target:
        booking_count (float).
    """

    def __init__(self, alpha: float = 1.0) -> None:
        self._model = Ridge(alpha=alpha)
        self.is_fitted: bool = False

    def fit(self, X: np.ndarray, y: np.ndarray) -> "DemandForecaster":
        """Train the model on historical feature/count data.

        Args:
            X: Feature matrix (n_samples, 4).
            y: Target booking counts (n_samples,).

        Returns:
            self (for chaining).
        """
        if X.shape[0] == 0:
            self.is_fitted = False
            return self

        self._model.fit(X, y)
        self.is_fitted = True
        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Predict demand for the given feature rows.

        Returns:
            Array of predicted booking counts (≥ 0), same length as X.

        Raises:
            RuntimeError: If the model hasn't been fitted yet.
        """
        if not self.is_fitted:
            raise RuntimeError(
                "DemandForecaster has not been fitted. Call fit() first."
            )
        predictions = self._model.predict(X)
        return np.maximum(predictions, 0).round(1)

    def predict_date_range(
        self, start_date: date, end_date: date
    ) -> List[dict]:
        """Convenience: predict daily demand for a date range.

        Returns:
            List of dicts with ``date`` and ``predicted_count``.
        """
        rows = []
        current = start_date
        while current <= end_date:
            features = np.array([[
                current.toordinal(),
                current.weekday(),
                current.month,
                1 if current.weekday() >= 5 else 0,
            ]], dtype=np.float64)
            count = float(self.predict(features)[0])
            rows.append({"date": current, "predicted_count": count})
            current += timedelta(days=1)
        return rows


# ---------------------------------------------------------------------------
# Moving Average Forecaster (lightweight fallback)
# ---------------------------------------------------------------------------

class MovingAverageForecaster:
    """Simple moving-average forecaster.

    Uses the mean of the last ``window_size`` observations as the prediction
    for all future time steps. Useful when there's too little data for
    regression.
    """

    def __init__(self, window_size: int = 7) -> None:
        self.window_size = window_size
        self._avg: float = 0.0
        self.is_fitted: bool = False

    def fit(self, X: np.ndarray, y: np.ndarray) -> "MovingAverageForecaster":
        """Fit by computing the moving average of the last ``window_size`` counts.

        Args:
            X: Ignored (kept for interface compatibility).
            y: Target booking counts.

        Returns:
            self.
        """
        if y.shape[0] == 0:
            self.is_fitted = False
            return self

        tail = y[-self.window_size:] if len(y) >= self.window_size else y
        self._avg = float(np.mean(tail))
        self.is_fitted = True
        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Return the moving average for every input row.

        Raises:
            RuntimeError: If not fitted.
        """
        if not self.is_fitted:
            raise RuntimeError(
                "MovingAverageForecaster has not been fitted. Call fit() first."
            )
        return np.full(X.shape[0], max(self._avg, 0))

    def predict_date_range(
        self, start_date: date, end_date: date
    ) -> List[dict]:
        """Predict constant demand for a date range."""
        rows = []
        current = start_date
        while current <= end_date:
            rows.append({"date": current, "predicted_count": round(self._avg, 1)})
            current += timedelta(days=1)
        return rows


# ---------------------------------------------------------------------------
# Factory
# ---------------------------------------------------------------------------

MIN_SAMPLES_FOR_REGRESSION = 14  # Need at least 2 weeks of data for Ridge


def create_forecaster(
    X: np.ndarray,
    y: np.ndarray,
    prefer_regression: bool = True,
) -> DemandForecaster | MovingAverageForecaster:
    """Create and fit the most appropriate forecaster given available data.

    Chooses Ridge regression if enough samples exist, otherwise falls
    back to moving average.

    Args:
        X: Feature matrix.
        y: Target vector.
        prefer_regression: If False, always use moving average.

    Returns:
        A fitted forecaster instance.
    """
    if prefer_regression and X.shape[0] >= MIN_SAMPLES_FOR_REGRESSION:
        return DemandForecaster().fit(X, y)
    return MovingAverageForecaster().fit(X, y)
