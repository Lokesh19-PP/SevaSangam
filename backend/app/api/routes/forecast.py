"""AI Demand Forecasting API routes.

Endpoints:
    GET  /forecast/demand       — Forecast demand for a single service category
    GET  /forecast/workforce    — Forecast demand across all categories
    GET  /forecast/peak-periods — Get demand summary with peak/trend info
"""

from datetime import date
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.services import forecast_service

router = APIRouter(prefix="/forecast", tags=["AI Forecasting"])


# ---------------------------------------------------------------------------
# Single-Category Forecast
# ---------------------------------------------------------------------------

@router.get("/demand")
def get_demand_forecast(
    category_id: int = Query(..., description="Service category ID to forecast"),
    lat: Optional[float] = Query(None, description="Location latitude"),
    lon: Optional[float] = Query(None, description="Location longitude"),
    start_date: Optional[date] = Query(None, description="Forecast start date"),
    end_date: Optional[date] = Query(None, description="Forecast end date"),
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    """Forecast demand for a single service category.

    Uses the AI forecasting engine (Ridge regression / moving average)
    trained on historical booking data. Falls back to synthetic mock
    data when no real bookings exist.
    """
    location = (lat, lon) if lat is not None and lon is not None else None
    date_range = (start_date, end_date) if start_date and end_date else None

    return forecast_service.forecast_category_demand(
        db,
        category_id=category_id,
        location=location,
        date_range=date_range,
        use_mock_if_empty=True,
    )


# ---------------------------------------------------------------------------
# Multi-Category / Workforce Forecast
# ---------------------------------------------------------------------------

@router.get("/workforce")
def get_workforce_forecast(
    lat: Optional[float] = Query(None, description="Location latitude"),
    lon: Optional[float] = Query(None, description="Location longitude"),
    start_date: Optional[date] = Query(None, description="Forecast start date"),
    end_date: Optional[date] = Query(None, description="Forecast end date"),
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    """Forecast demand across all active service categories.

    Ideal for admin analytics dashboards and cooperative workforce planning.
    """
    location = (lat, lon) if lat is not None and lon is not None else None
    date_range = (start_date, end_date) if start_date and end_date else None

    return forecast_service.forecast_all_categories(
        db,
        location=location,
        date_range=date_range,
        use_mock_if_empty=True,
    )


# ---------------------------------------------------------------------------
# Peak Periods / Demand Summary
# ---------------------------------------------------------------------------

@router.get("/peak-periods")
def get_peak_periods(
    category_id: int = Query(..., description="Service category ID"),
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    days_ahead: int = Query(7, ge=1, le=30, description="Number of days to forecast"),
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    """Get a simplified demand summary with trend and peak day info.

    Returns average daily demand, peak day, peak count, and trend
    (rising / stable / falling) for the requested category.
    """
    location = (lat, lon) if lat is not None and lon is not None else None

    return forecast_service.get_demand_summary(
        db,
        category_id=category_id,
        location=location,
        days_ahead=days_ahead,
        use_mock_if_empty=True,
    )
