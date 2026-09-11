"""FastAPI dependency injection — authentication & database session.

Centralised dependencies used by all route handlers to resolve
the authenticated user, enforce role-based access control, and
provide a database session per request.
"""

from fastapi import Depends, Header
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.constants import UserRole
from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.database.session import get_db
from app.models.user import User
from app.services import auth_service

# ---------------------------------------------------------------------------
# Bearer Token Extraction
# ---------------------------------------------------------------------------

_bearer_scheme = HTTPBearer(auto_error=False)


def _extract_token(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
    authorization: str | None = Header(None),
) -> str:
    """Extract the JWT token from the Authorization header.

    Supports both ``HTTPBearer`` automatic extraction and a manual
    ``Authorization: Bearer <token>`` fallback.

    Raises:
        UnauthorizedException: If no token is present.
    """
    if credentials and credentials.credentials:
        return credentials.credentials

    # Fallback: manually parse the Authorization header
    if authorization and authorization.lower().startswith("bearer "):
        return authorization.split(" ", 1)[1]

    raise UnauthorizedException("Authentication token is required.")


# ---------------------------------------------------------------------------
# Current User Resolution
# ---------------------------------------------------------------------------

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(_extract_token),
) -> User:
    """FastAPI dependency: resolve the authenticated user from JWT.

    Returns the full User ORM object.
    """
    return auth_service.get_current_user(db, token)


# ---------------------------------------------------------------------------
# Role-Based Guards
# ---------------------------------------------------------------------------

def get_current_customer(
    current_user: User = Depends(get_current_user),
) -> User:
    """Require the authenticated user to have the CUSTOMER role."""
    if current_user.role != UserRole.CUSTOMER:
        raise ForbiddenException("This endpoint is restricted to customers.")
    return current_user


def get_current_worker(
    current_user: User = Depends(get_current_user),
) -> User:
    """Require the authenticated user to have the WORKER role."""
    if current_user.role != UserRole.WORKER:
        raise ForbiddenException("This endpoint is restricted to workers.")
    return current_user


def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """Require the authenticated user to have the ADMIN role."""
    if current_user.role != UserRole.ADMIN:
        raise ForbiddenException("This endpoint is restricted to administrators.")
    return current_user
