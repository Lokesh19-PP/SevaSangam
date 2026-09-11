"""Demand forecasting data preprocessing module.

Transforms raw booking records into a time-series structure grouped by
service category, location, and date — ready for model training and
prediction.

Also provides a mock historical data generator for development/demo
when no real booking data exists yet.
"""

from __future__ import annotations

from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Sequence, Tuple

import numpy as np


# ---------------------------------------------------------------------------
# Type aliases
# ---------------------------------------------------------------------------

BookingLike = Any  # Booking ORM instance or dict with matching keys

# A single time-series row: {date, category_id, location_key, booking_count}
TimeSeriesRow = Dict[str, Any]


# ---------------------------------------------------------------------------
# Location Bucketing
# ---------------------------------------------------------------------------

# Grid cell size in degrees (~1.1 km at equator) for location grouping.
LOCATION_GRID_SIZE: float = 0.01


def _location_key(lat: Optional[float], lon: Optional[float]) -> str:
    """Bucket lat/lon into a grid cell string key.

    Returns ``"unknown"`` when coordinates are missing.
    """
    if lat is None or lon is None:
        return "unknown"
    grid_lat = round(lat / LOCATION_GRID_SIZE) * LOCATION_GRID_SIZE
    grid_lon = round(lon / LOCATION_GRID_SIZE) * LOCATION_GRID_SIZE
    return f"{grid_lat:.2f},{grid_lon:.2f}"


# ---------------------------------------------------------------------------
# Attribute Extraction Helper
# ---------------------------------------------------------------------------

def _attr(obj: Any, key: str, default: Any = None) -> Any:
    """Get attribute from ORM object or dict."""
    if isinstance(obj, dict):
        return obj.get(key, default)
    return getattr(obj, key, default)


# ---------------------------------------------------------------------------
# Core Preprocessing
# ---------------------------------------------------------------------------

def bookings_to_time_series(
    bookings: Sequence[BookingLike],
    granularity: str = "day",
) -> List[TimeSeriesRow]:
    """Transform a list of booking records into an aggregated time-series.

    Groups bookings by ``(category_id, location_key, date_bucket)`` and counts
    the number of bookings in each group.

    Args:
        bookings: Iterable of Booking ORM instances or dicts with keys:
            ``category_id``, ``service_latitude``, ``service_longitude``,
            ``created_at`` (or ``scheduled_at``).
        granularity: Time bucketing — ``"day"`` (default), ``"week"``, or ``"month"``.

    Returns:
        List of dicts, each with:
            ``date``, ``category_id``, ``location_key``, ``booking_count``.
        Sorted by ``(category_id, location_key, date)``.
    """
    counts: Dict[Tuple[int, str, date], int] = defaultdict(int)

    for booking in bookings:
        cat_id = _attr(booking, "category_id")
        if cat_id is None:
            continue

        # Prefer scheduled_at, fall back to created_at
        ts = _attr(booking, "scheduled_at") or _attr(booking, "created_at")
        if ts is None:
            continue

        # Normalize to date
        if isinstance(ts, datetime):
            d = ts.date()
        elif isinstance(ts, date):
            d = ts
        else:
            continue

        d = _bucket_date(d, granularity)

        lat = _attr(booking, "service_latitude")
        lon = _attr(booking, "service_longitude")
        loc = _location_key(lat, lon)

        counts[(cat_id, loc, d)] += 1

    # Build sorted output
    rows: List[TimeSeriesRow] = [
        {
            "date": d,
            "category_id": cat_id,
            "location_key": loc,
            "booking_count": count,
        }
        for (cat_id, loc, d), count in counts.items()
    ]
    rows.sort(key=lambda r: (r["category_id"], r["location_key"], r["date"]))
    return rows


def _bucket_date(d: date, granularity: str) -> date:
    """Round a date down to the start of its bucket."""
    if granularity == "week":
        return d - timedelta(days=d.weekday())  # Monday
    elif granularity == "month":
        return d.replace(day=1)
    return d  # "day" — no change


# ---------------------------------------------------------------------------
# Feature Matrix Builder (for sklearn)
# ---------------------------------------------------------------------------

def time_series_to_features(
    rows: List[TimeSeriesRow],
    category_id: Optional[int] = None,
    location_key: Optional[str] = None,
) -> Tuple[np.ndarray, np.ndarray]:
    """Convert time-series rows into a feature matrix (X) and target vector (y).

    Filters by category/location if provided. Features are:
        [day_ordinal, day_of_week, month, is_weekend]

    Args:
        rows: Output of ``bookings_to_time_series``.
        category_id: Filter to a single category.
        location_key: Filter to a single location bucket.

    Returns:
        (X, y) where X is (n_samples, 4) features and y is (n_samples,) counts.
    """
    filtered = rows
    if category_id is not None:
        filtered = [r for r in filtered if r["category_id"] == category_id]
    if location_key is not None:
        filtered = [r for r in filtered if r["location_key"] == location_key]

    if not filtered:
        return np.empty((0, 4)), np.empty((0,))

    X_list = []
    y_list = []
    for r in filtered:
        d = r["date"]
        X_list.append([
            d.toordinal(),          # absolute day number
            d.weekday(),            # 0=Mon … 6=Sun
            d.month,                # 1–12
            1 if d.weekday() >= 5 else 0,  # is_weekend
        ])
        y_list.append(r["booking_count"])

    return np.array(X_list, dtype=np.float64), np.array(y_list, dtype=np.float64)


# ---------------------------------------------------------------------------
# Mock / Dummy Historical Data Generator
# ---------------------------------------------------------------------------

# Default service category IDs mirroring the ServiceCategory enum order.
MOCK_CATEGORY_IDS = list(range(1, 10))  # 1..9

# Default mock location grid centers (approximate Indian cities)
MOCK_LOCATIONS = [
    (19.08, 72.88),   # Mumbai
    (18.52, 73.86),   # Pune
    (28.61, 77.21),   # Delhi
]


def generate_mock_bookings(
    days: int = 90,
    end_date: Optional[date] = None,
    categories: Optional[List[int]] = None,
    locations: Optional[List[Tuple[float, float]]] = None,
    seed: int = 42,
) -> List[Dict[str, Any]]:
    """Generate synthetic past booking records for development/demo.

    Creates realistic-looking demand patterns with:
    - Category-specific base demand rates.
    - Weekend uplift for household services.
    - Light random noise.

    Args:
        days: Number of historical days to generate.
        end_date: Last date in the range (defaults to today).
        categories: Category IDs to generate for (default: 1–9).
        locations: (lat, lon) tuples for mock locations.
        seed: Random seed for reproducibility.

    Returns:
        List of mock booking dicts compatible with ``bookings_to_time_series``.
    """
    rng = np.random.default_rng(seed)

    if end_date is None:
        end_date = date.today()
    if categories is None:
        categories = MOCK_CATEGORY_IDS
    if locations is None:
        locations = MOCK_LOCATIONS

    # Base daily demand per category (electrician/plumber are higher demand)
    base_demand = {
        1: 8, 2: 7, 3: 5, 4: 6, 5: 3,
        6: 4, 7: 3, 8: 5, 9: 4,
    }

    bookings: List[Dict[str, Any]] = []

    for day_offset in range(days):
        d = end_date - timedelta(days=days - 1 - day_offset)
        is_weekend = d.weekday() >= 5

        for cat_id in categories:
            demand = base_demand.get(cat_id, 4)

            # Weekend uplift for domestic/household categories
            if is_weekend and cat_id in (4, 7, 8):  # domestic_help, gardener, cleaner
                demand = int(demand * 1.5)

            # Add noise
            count = max(0, int(demand + rng.normal(0, demand * 0.3)))

            for loc_lat, loc_lon in locations:
                loc_count = max(0, int(count / len(locations) + rng.normal(0, 1)))
                for _ in range(loc_count):
                    hour = int(rng.integers(7, 20))
                    minute = int(rng.integers(0, 60))
                    bookings.append({
                        "category_id": cat_id,
                        "service_latitude": float(loc_lat + rng.normal(0, 0.02)),
                        "service_longitude": float(loc_lon + rng.normal(0, 0.02)),
                        "created_at": datetime(
                            d.year, d.month, d.day, hour, minute,
                            tzinfo=timezone.utc,
                        ),
                        "scheduled_at": datetime(
                            d.year, d.month, d.day, hour, minute,
                            tzinfo=timezone.utc,
                        ) + timedelta(hours=int(rng.integers(1, 48))),
                    })

    return bookings
