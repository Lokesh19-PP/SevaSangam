"""SevaSangam Backend Application Entrypoint."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import api_router
from app.core.config import settings

# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json" if settings.DEBUG else None,
)

# Configure CORS middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "SevaSangam backend is running",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health",
    }


@app.get(settings.API_V1_STR)
async def api_root():
    """API root endpoint confirming backend status."""
    return {
        "message": "SevaSangam backend is running",
        "status": "healthy",
        "version": settings.VERSION,
    }


# Include modular API routes under /api
app.include_router(api_router, prefix=settings.API_V1_STR)
