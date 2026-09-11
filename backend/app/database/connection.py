"""Database engine and connection management with automatic SQLite fallback."""

import logging
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine

from app.core.config import settings

logger = logging.getLogger(__name__)


def create_db_engine(database_url: str = settings.DATABASE_URL) -> Engine:
    """Create and configure a SQLAlchemy database engine.
    
    If PostgreSQL is configured but unreachable (e.g. during local dev without Docker),
    automatically falls back to local SQLite so the application works out-of-the-box.
    """
    connect_args = {}
    engine_kwargs = {
        "echo": False,
    }

    # Handle SQLite connection args
    if database_url.startswith("sqlite"):
        connect_args["check_same_thread"] = False
        engine_kwargs["connect_args"] = connect_args
        return create_engine(database_url, **engine_kwargs)

    # PostgreSQL / PostGIS configuration
    try:
        pg_kwargs = {
            **engine_kwargs,
            "pool_pre_ping": True,
            "pool_size": 5,
            "max_overflow": 10,
            "connect_args": {"connect_timeout": 2},
        }
        pg_engine = create_engine(database_url, **pg_kwargs)
        # Test connection
        with pg_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Connected to PostgreSQL database successfully.")
        return pg_engine
    except Exception as exc:
        logger.warning(
            "PostgreSQL database not reachable (%s). Falling back to local SQLite (sqlite:///./sevasangam.db) for zero-setup execution.",
            exc,
        )
        sqlite_url = "sqlite:///./sevasangam.db"
        return create_engine(
            sqlite_url,
            connect_args={"check_same_thread": False},
            echo=False,
        )


# Global engine instance configured with auto-fallback
engine = create_db_engine()


def get_engine() -> Engine:
    """Return the active database engine."""
    return engine
