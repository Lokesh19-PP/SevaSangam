"""Public demand prediction API for SevaSangam.

Exposes ``predict_demand(service_category, location, date_range)`` —
the single function consumed by the services layer and admin dashboard.

Internally wires together preprocessing → model training → prediction.
Falls back to mock historical data when no real bookings are available.
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any, Dict, List, Optional, Sequence, Tuple

import numpy as np

from app.ai.forecasting.model import create_forecaster
from app.ai.forecasting.preprocessing import (
    _location_key,
    bookings_to_time_series,
    generate_mock_bookings,
    time_series_to_features,
)


# ---------------------------------------------------------------------------
# Main Public API
# ---------------------------------------------------------------------------

def predict_demand(
    service_category_id: int,
    location: Optional[Tuple[float, float]] = None,
    date_range: Optional[Tuple[date, date]] = None,
    bookings: Optional[Sequence[Any]] = None,
    use_mock_if_empty: bool = True,
) -> Dict[str, Any]:
    """Predict future booking demand for a service category and location.

    End-to-end pipeline:
        1. Collect historical bookings (real or mock).
        2. Preprocess into time-series.
        3. Build feature matrix for the target category/location.
        4. Fit a forecaster (Ridge regression or moving average).
        5. Predict demand for each day in ``date_range``.

    Args:
        service_category_id: The category to forecast (e.g. 1 = Electrician).
        location: ``(latitude, longitude)`` to scope the forecast. If None,
            forecasts across all locations for this category.
        date_range: ``(start_date, end_date)`` for the prediction window.
            Defaults to the next 7 days if not provided.
        bookings: Optional pre-fetched booking records. When None and
            ``use_mock_if_empty`` is True, synthetic data is generated.
        use_mock_if_empty: Generate mock historical data when ``bookings``
            is None or empty. Set False in production to return empty results.

    Returns:
        Dict with:
            - ``category_id``: The requested category.
            - ``location``: The location filter used (or ``"all"``).
            - ``model_type``: ``"ridge"`` or ``"moving_average"``.
            - ``predictions``: List of ``{date, predicted_count}`` dicts.
            - ``summary``: Aggregate stats (total, avg, peak day).
    """
    # Default date range: next 7 days
    if date_range is None:
        start = date.today() + timedelta(days=1)
        end = start + timedelta(days=6)
    else:
        start, end = date_range

    # Resolve historical bookings
    if not bookings:
        if use_mock_if_empty:
            bookings = generate_mock_bookings(days=90)
        else:
            return _empty_result(service_category_id, location, start, end)

    # Preprocess
    time_series = bookings_to_time_series(bookings, granularity="day")

    # Determine location filter
    loc_key = _location_key(location[0], location[1]) if location else None

    # Build features
    X, y = time_series_to_features(
        time_series,
        category_id=service_category_id,
        location_key=loc_key,
    )

    # Fit model
    forecaster = create_forecaster(X, y)

    # Predict
    predictions = forecaster.predict_date_range(start, end)

    # Serialize dates to ISO strings for JSON compatibility
    for p in predictions:
        p["date"] = p["date"].isoformat()
        p["predicted_count"] = round(p["predicted_count"], 1)

    # Summary statistics
    counts = [p["predicted_count"] for p in predictions]
    peak_idx = int(np.argmax(counts)) if counts else 0
    summary = {
        "total_predicted": round(sum(counts), 1),
        "avg_daily": round(np.mean(counts), 1) if counts else 0.0,
        "peak_day": predictions[peak_idx]["date"] if predictions else None,
        "peak_count": counts[peak_idx] if counts else 0.0,
    }

    return {
        "category_id": service_category_id,
        "location": f"{location[0]:.4f},{location[1]:.4f}" if location else "all",
        "model_type": type(forecaster).__name__,
        "date_range": {"start": start.isoformat(), "end": end.isoformat()},
        "predictions": predictions,
        "summary": summary,
    }


# ---------------------------------------------------------------------------
# Multi-Category Forecast
# ---------------------------------------------------------------------------

def predict_demand_all_categories(
    category_ids: Optional[List[int]] = None,
    location: Optional[Tuple[float, float]] = None,
    date_range: Optional[Tuple[date, date]] = None,
    bookings: Optional[Sequence[Any]] = None,
    use_mock_if_empty: bool = True,
) -> List[Dict[str, Any]]:
    """Run demand forecasting for multiple service categories at once.

    Useful for the admin analytics dashboard.

    Args:
        category_ids: List of category IDs to forecast. Defaults to 1–9.
        Others: Same as ``predict_demand``.

    Returns:
        List of prediction result dicts, one per category.
    """
    if category_ids is None:
        category_ids = list(range(1, 10))

    # Share the same bookings data across categories to avoid re-generating
    if not bookings and use_mock_if_empty:
        bookings = generate_mock_bookings(days=90)

    results = []
    for cat_id in category_ids:
        result = predict_demand(
            service_category_id=cat_id,
            location=location,
            date_range=date_range,
            bookings=bookings,
            use_mock_if_empty=False,  # already resolved above
        )
        results.append(result)

    return results


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _empty_result(
    category_id: int,
    location: Optional[Tuple[float, float]],
    start: date,
    end: date,
) -> Dict[str, Any]:
    """Return a zero-filled forecast when no data is available."""
    predictions = []
    current = start
    while current <= end:
        predictions.append({
            "date": current.isoformat(),
            "predicted_count": 0.0,
        })
        current += timedelta(days=1)

    return {
        "category_id": category_id,
        "location": f"{location[0]:.4f},{location[1]:.4f}" if location else "all",
        "model_type": "none",
        "date_range": {"start": start.isoformat(), "end": end.isoformat()},
        "predictions": predictions,
        "summary": {
            "total_predicted": 0.0,
            "avg_daily": 0.0,
            "peak_day": None,
            "peak_count": 0.0,
        },
    }
