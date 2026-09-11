"""API route handlers and router registration."""

from fastapi import APIRouter
from app.api.routes.auth import router as auth_router
from app.api.routes.bookings import router as bookings_router
from app.api.routes.forecast import router as forecast_router
from app.api.routes.health import router as health_router
from app.api.routes.matching import router as matching_router
from app.api.routes.ratings import router as ratings_router
from app.api.routes.workers import router as workers_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(workers_router)
api_router.include_router(bookings_router)
api_router.include_router(ratings_router)
api_router.include_router(matching_router)
api_router.include_router(forecast_router)
