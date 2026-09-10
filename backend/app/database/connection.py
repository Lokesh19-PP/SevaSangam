"""Database engine and connection management."""

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from app.core.config import settings


def create_db_engine(database_url: str = settings.DATABASE_URL) -> Engine:
    """Create and configure a SQLAlchemy database engine."""
    connect_args = {}
    engine_kwargs = {
        "echo": settings.DEBUG,
    }

    # Handle SQLite connection args (for in-memory testing or fallback)
    if database_url.startswith("sqlite"):
        connect_args["check_same_thread"] = False
        engine_kwargs["connect_args"] = connect_args
    else:
        # PostgreSQL / PostGIS configuration
        engine_kwargs.update({
            "pool_pre_ping": True,
            "pool_size": 10,
            "max_overflow": 20,
        })

    return create_engine(database_url, **engine_kwargs)


# Global engine instance configured with placeholder DATABASE_URL
engine = create_db_engine()


def get_engine() -> Engine:
    """Return the active database engine."""
    return engine
