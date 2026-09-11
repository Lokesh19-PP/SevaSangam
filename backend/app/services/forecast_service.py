"""Forecast service — bridges booking_repository with the AI forecasting engine.

Fetches historical booking data from the database and passes it through
``ai.forecasting.predict_demand`` to produce demand predictions.

This is the single entry-point the admin dashboard route should call —
it never imports ai.forecasting directly.
"""

from __future__ import annotations

from datetime import date
from typing import Any, Dict, List, Optional, Sequence, Tuple

from sqlalchemy.orm import Session

from app.ai.forecasting.predictor import (
    predict_demand,
    predict_demand_all_categories,
)
from app.core.exceptions import BadRequestException, NotFoundException
from app.repositories import booking_repository, service_repository


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def forecast_category_demand(
    db: Session,
    category_id: int,
    location: Optional[Tuple[float, float]] = None,
    date_range: Optional[Tuple[date, date]] = None,
    use_mock_if_empty: bool = True,
) -> Dict[str, Any]:
    """Forecast demand for a single service category.

    Pipeline:
        1. Validate the category exists.
        2. Fetch all historical bookings for this category from the DB.
        3. Pass them to the AI forecasting engine.
        4. Return structured predictions.

    Args:
        db: Database session.
        category_id: Service category to forecast.
        location: ``(lat, lon)`` to scope geographically. None = all locations.
        date_range: ``(start_date, end_date)`` prediction window.
            Defaults to the next 7 days.
        use_mock_if_empty: If True, generate synthetic data when no real
            bookings exist (for demo/development).

    Returns:
        Prediction result dict from ``ai.forecasting.predict_demand``.

    Raises:
        NotFoundException: Category does not exist.
        BadRequestException: Invalid date range.
    """
    # Validate category
    category = service_repository.get_category_by_id(db, category_id)
    if not category:
        raise NotFoundException(f"Service category {category_id} not found.")

    # Validate date range if provided
    if date_range:
        start, end = date_range
        if start > end:
            raise BadRequestException(
                f"Invalid date range: start ({start}) is after end ({end})."
            )

    # Fetch historical bookings from DB
    bookings = _fetch_historical_bookings(db, category_id=category_id)

    return predict_demand(
        service_category_id=category_id,
        location=location,
        date_range=date_range,
        bookings=bookings if bookings else None,
        use_mock_if_empty=use_mock_if_empty,
    )


def forecast_all_categories(
    db: Session,
    category_ids: Optional[List[int]] = None,
    location: Optional[Tuple[float, float]] = None,
    date_range: Optional[Tuple[date, date]] = None,
    use_mock_if_empty: bool = True,
) -> List[Dict[str, Any]]:
    """Forecast demand across multiple service categories.

    Ideal for the admin analytics dashboard showing demand heatmaps.

    Args:
        db: Database session.
        category_ids: Categories to forecast. Defaults to all active categories.
        location: Geographic scope.
        date_range: Prediction window.
        use_mock_if_empty: Use synthetic data for development.

    Returns:
        List of prediction result dicts, one per category.
    """
    # Default to all active categories from the database
    if category_ids is None:
        categories = service_repository.list_categories(db, active_only=True)
        category_ids = [c.id for c in categories]

    if not category_ids:
        return []

    # Validate date range
    if date_range:
        start, end = date_range
        if start > end:
            raise BadRequestException(
                f"Invalid date range: start ({start}) is after end ({end})."
            )

    # Fetch all historical bookings once (shared across categories)
    bookings = _fetch_historical_bookings(db)

    return predict_demand_all_categories(
        category_ids=category_ids,
        location=location,
        date_range=date_range,
        bookings=bookings if bookings else None,
        use_mock_if_empty=use_mock_if_empty,
    )


def get_demand_summary(
    db: Session,
    category_id: int,
    location: Optional[Tuple[float, float]] = None,
    days_ahead: int = 7,
    use_mock_if_empty: bool = True,
) -> Dict[str, Any]:
    """Get a simplified demand summary for quick display.

    Returns:
        Dict with ``category_id``, ``avg_daily_demand``, ``peak_day``,
        ``peak_demand``, ``trend`` ("rising", "stable", or "falling").
    """
    today = date.today()
    date_range = (today, today)  # just today for baseline

    forecast = forecast_category_demand(
        db,
        category_id=category_id,
        location=location,
        date_range=(
            today,
            date(today.year, today.month, today.day).__class__(
                today.year, today.month, today.day
            ),
        ),
        use_mock_if_empty=use_mock_if_empty,
    )

    # Now get the future forecast
    from datetime import timedelta
    future_start = today + timedelta(days=1)
    future_end = today + timedelta(days=days_ahead)

    future = forecast_category_demand(
        db,
        category_id=category_id,
        location=location,
        date_range=(future_start, future_end),
        use_mock_if_empty=use_mock_if_empty,
    )

    # Determine trend from current vs future average
    current_avg = forecast["summary"]["avg_daily"]
    future_avg = future["summary"]["avg_daily"]

    if future_avg > current_avg * 1.15:
        trend = "rising"
    elif future_avg < current_avg * 0.85:
        trend = "falling"
    else:
        trend = "stable"

    return {
        "category_id": category_id,
        "current_daily_demand": current_avg,
        "predicted_avg_daily": future_avg,
        "peak_day": future["summary"]["peak_day"],
        "peak_demand": future["summary"]["peak_count"],
        "trend": trend,
        "days_forecasted": days_ahead,
    }


# ---------------------------------------------------------------------------
# Internal Helpers
# ---------------------------------------------------------------------------

def _fetch_historical_bookings(
    db: Session,
    category_id: Optional[int] = None,
) -> List[Any]:
    """Fetch historical bookings from the database for forecasting input.

    Retrieves a generous window of past bookings to feed the model.
    """
    return booking_repository.list_all_bookings(
        db,
        skip=0,
        limit=5000,  # generous historical window
        category_id=category_id,
    )
