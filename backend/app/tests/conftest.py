"""Pytest configuration and shared fixtures using in-memory SQLite."""

from collections.abc import Generator
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.base import Base
# Ensure all models are imported so that Base.metadata has all table definitions
import app.models  # noqa: F401


@pytest.fixture(scope="function")
def db_session() -> Generator[Session, None, None]:
    """Provide a clean in-memory SQLite database session for each test."""
    test_engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(test_engine)

    TestingSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=test_engine,
    )
    session = TestingSessionLocal()

    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(test_engine)
        test_engine.dispose()
