"""Data access repository for Cooperative Admin Analytics and Reporting."""

from typing import Any, Dict, List, Optional
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.constants import BookingStatus, WorkerStatus
from app.models.booking import Booking
from app.models.cooperative import Cooperative
from app.models.service_category import ServiceCategory
from app.models.user import User
from app.models.worker import Worker


def get_system_overview_stats(db: Session) -> Dict[str, int]:
    """Return high-level counts across users, workers, bookings, and cooperatives."""
    total_users = db.scalar(select(func.count(User.id))) or 0
    total_workers = db.scalar(select(func.count(Worker.id))) or 0
    verified_workers = (
        db.scalar(
            select(func.count(Worker.id)).where(Worker.status == WorkerStatus.VERIFIED)
        )
        or 0
    )
    total_bookings = db.scalar(select(func.count(Booking.id))) or 0
    total_cooperatives = db.scalar(select(func.count(Cooperative.id))) or 0

    return {
        "total_users": total_users,
        "total_workers": total_workers,
        "verified_workers": verified_workers,
        "total_bookings": total_bookings,
        "total_cooperatives": total_cooperatives,
    }


def get_worker_distribution_metrics(
    db: Session, cooperative_id: Optional[int] = None
) -> Dict[str, Any]:
    """Calculate fair workload distribution indicators for cooperative administrator."""
    stmt = select(Worker)
    if cooperative_id is not None:
        stmt = stmt.where(Worker.cooperative_id == cooperative_id)

    workers = list(db.scalars(stmt).all())
    if not workers:
        return {
            "total_workers": 0,
            "active_workers": 0,
            "idle_workers": 0,
            "avg_active_jobs": 0.0,
            "max_active_jobs": 0,
            "fairness_index": 1.0,
        }

    total_count = len(workers)
    active_workers = sum(1 for w in workers if w.current_active_jobs > 0)
    idle_workers = total_count - active_workers
    total_active_jobs = sum(w.current_active_jobs for w in workers)
    avg_active_jobs = total_active_jobs / total_count
    max_active_jobs = max(w.current_active_jobs for w in workers)

    # Simplified Jain's Fairness Index on workload
    if total_active_jobs == 0:
        fairness_index = 1.0
    else:
        sum_sq = sum(w.current_active_jobs**2 for w in workers)
        fairness_index = (
            round((total_active_jobs**2) / (total_count * sum_sq), 2)
            if sum_sq > 0
            else 1.0
        )

    return {
        "total_workers": total_count,
        "active_workers": active_workers,
        "idle_workers": idle_workers,
        "avg_active_jobs": round(avg_active_jobs, 2),
        "max_active_jobs": max_active_jobs,
        "fairness_index": fairness_index,
    }


def get_cooperative_welfare_summary(
    db: Session, cooperative_id: int
) -> Optional[Dict[str, Any]]:
    """Return welfare fund status and insurance statistics for a cooperative."""
    coop = db.get(Cooperative, cooperative_id)
    if not coop:
        return None

    insured_count = (
        db.scalar(
            select(func.count(Worker.id)).where(
                Worker.cooperative_id == cooperative_id,
                Worker.insurance_policy_number.is_not(None),
            )
        )
        or 0
    )
    total_workers = (
        db.scalar(
            select(func.count(Worker.id)).where(Worker.cooperative_id == cooperative_id)
        )
        or 0
    )

    return {
        "cooperative_id": coop.id,
        "cooperative_name": coop.name,
        "welfare_fund_balance": coop.welfare_fund_balance,
        "total_workers": total_workers,
        "insured_workers": insured_count,
        "insurance_coverage_percentage": (
            round((insured_count / total_workers) * 100, 1) if total_workers > 0 else 0.0
        ),
    }


def get_booking_stats_by_status(db: Session) -> Dict[str, int]:
    """Group booking counts by status (pending, assigned, completed, etc.)."""
    stmt = select(Booking.status, func.count(Booking.id)).group_by(Booking.status)
    results = db.execute(stmt).all()
    return {str(status.value if hasattr(status, "value") else status): count for status, count in results}


def get_category_demand_counts(db: Session) -> List[Dict[str, Any]]:
    """Return historical demand distribution per service category for AI forecasting."""
    stmt = (
        select(
            ServiceCategory.id,
            ServiceCategory.code,
            ServiceCategory.name,
            func.count(Booking.id).label("booking_count"),
        )
        .outerjoin(Booking, Booking.category_id == ServiceCategory.id)
        .group_by(ServiceCategory.id, ServiceCategory.code, ServiceCategory.name)
        .order_by(func.count(Booking.id).desc())
    )
    results = db.execute(stmt).all()
    return [
        {
            "category_id": r[0],
            "category_code": r[1],
            "category_name": r[2],
            "booking_count": r[3],
        }
        for r in results
    ]
