"""Authentication API routes — register, login, current user.

Endpoints:
    POST /auth/register  — Create a new user account
    POST /auth/login     — Authenticate and receive JWT
    GET  /auth/me        — Get current user profile
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserResponse
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------

@router.post("/register", response_model=TokenResponse, status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new SevaSangam user account.

    Creates a User record and role-specific profile (Customer / Worker).
    Returns a JWT token immediately so the user is logged-in on registration.
    """
    return auth_service.register_user(db, data)


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate via phone + password and receive a JWT access token."""
    return auth_service.login_user(db, data)


# ---------------------------------------------------------------------------
# Current User
# ---------------------------------------------------------------------------

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Return the profile of the currently authenticated user."""
    return current_user
