"""Health check API router."""

from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    """Health check endpoint confirming backend status."""
    return {
        "status": "healthy",
        "message": "SevaSangam backend is running",
        "environment": settings.ENVIRONMENT,
        "version": settings.VERSION,
    }
