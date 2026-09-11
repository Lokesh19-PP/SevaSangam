"""Authentication and authorization business logic service.

Handles user registration, login, JWT token generation and verification,
and password hashing. Creates role-specific profiles (Customer/Worker)
on registration. No direct DB access — delegates to repositories.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.constants import UserRole
from app.core.exceptions import (
    BadRequestException,
    ConflictException,
    UnauthorizedException,
)
from app.models.user import User
from app.repositories import user_repository, worker_repository
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse

# ---------------------------------------------------------------------------
# Password Hashing
# ---------------------------------------------------------------------------

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """Hash a plain-text password with bcrypt."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compare a plain-text password against its bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


# ---------------------------------------------------------------------------
# JWT Token Management
# ---------------------------------------------------------------------------

def create_access_token(
    user_id: int,
    role: UserRole,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Generate a signed JWT access token.

    Args:
        user_id: The authenticated user's ID embedded as ``sub``.
        role: User role embedded as a custom claim.
        expires_delta: Optional override for token lifetime.

    Returns:
        Encoded JWT string.
    """
    expire = datetime.now(timezone.utc) + (
        expires_delta
        if expires_delta
        else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload = {
        "sub": str(user_id),
        "role": role.value,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.AUTH_SECRET, algorithm=settings.AUTH_ALGORITHM)


def verify_access_token(token: str) -> dict:
    """Decode and validate a JWT access token.

    Returns:
        The decoded payload dict with ``sub`` and ``role`` claims.

    Raises:
        UnauthorizedException: If the token is invalid, expired, or malformed.
    """
    try:
        payload = jwt.decode(
            token,
            settings.AUTH_SECRET,
            algorithms=[settings.AUTH_ALGORITHM],
        )
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise UnauthorizedException("Token payload missing user identifier.")
        return payload
    except JWTError:
        raise UnauthorizedException("Invalid or expired authentication token.")


# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------

def register_user(db: Session, data: RegisterRequest) -> TokenResponse:
    """Register a new user and create the role-specific profile.

    Business rules:
    - Phone must be unique (enforced at DB level too).
    - Email, if provided, must be unique.
    - A Customer profile is auto-created for ``customer`` role.
    - A Worker profile (status=PENDING) is auto-created for ``worker`` role.
    - Admin accounts cannot be self-registered.

    Returns:
        TokenResponse containing a fresh JWT and user metadata.

    Raises:
        ConflictException: Duplicate phone or email.
        BadRequestException: Attempted admin self-registration.
    """
    # Guard: disallow admin self-registration
    if data.role == UserRole.ADMIN:
        raise BadRequestException("Admin accounts cannot be self-registered.")

    # Uniqueness checks
    if user_repository.get_user_by_phone(db, data.phone):
        raise ConflictException("A user with this phone number already exists.")
    if data.email and user_repository.get_user_by_email(db, data.email):
        raise ConflictException("A user with this email already exists.")

    # Create user record
    user = user_repository.create_user(db, {
        "phone": data.phone,
        "full_name": data.full_name,
        "email": data.email,
        "role": data.role,
        "preferred_language": data.preferred_language.value,
        "hashed_password": hash_password(data.password),
    })

    # Create role-specific profile
    if data.role == UserRole.CUSTOMER:
        user_repository.create_customer(db, {"user_id": user.id})
    elif data.role == UserRole.WORKER:
        worker_repository.create_worker(db, {"user_id": user.id})

    # Issue token
    access_token = create_access_token(user.id, user.role)

    return TokenResponse(
        access_token=access_token,
        user_id=user.id,
        role=user.role,
        full_name=user.full_name,
        preferred_language=user.preferred_language,
    )


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------

def login_user(db: Session, data: LoginRequest) -> TokenResponse:
    """Authenticate a user by phone + password and return a JWT.

    Raises:
        UnauthorizedException: Invalid credentials or inactive account.
    """
    user = user_repository.get_user_by_phone(db, data.phone)

    if not user or not user.hashed_password:
        raise UnauthorizedException("Invalid phone number or password.")

    if not verify_password(data.password, user.hashed_password):
        raise UnauthorizedException("Invalid phone number or password.")

    if not user.is_active:
        raise UnauthorizedException("This account has been deactivated.")

    access_token = create_access_token(user.id, user.role)

    return TokenResponse(
        access_token=access_token,
        user_id=user.id,
        role=user.role,
        full_name=user.full_name,
        preferred_language=user.preferred_language,
    )


# ---------------------------------------------------------------------------
# Current User Resolution
# ---------------------------------------------------------------------------

def get_current_user(db: Session, token: str) -> User:
    """Resolve the authenticated user from a JWT token.

    Returns:
        The User ORM instance.

    Raises:
        UnauthorizedException: Token invalid or user not found / inactive.
    """
    payload = verify_access_token(token)
    user_id = int(payload["sub"])
    user = user_repository.get_user_by_id(db, user_id)

    if not user:
        raise UnauthorizedException("User account not found.")
    if not user.is_active:
        raise UnauthorizedException("This account has been deactivated.")

    return user
