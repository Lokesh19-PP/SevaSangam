"""Custom application exceptions."""

from typing import Any, Dict, Optional
from fastapi import HTTPException, status


class AppException(HTTPException):
    """Base application exception extending FastAPI HTTPException."""

    def __init__(
        self,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail: str = "An unexpected error occurred.",
        headers: Optional[Dict[str, str]] = None,
        extra: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(status_code=status_code, detail=detail, headers=headers)
        self.extra = extra or {}


class NotFoundException(AppException):
    """Raised when a requested resource cannot be found."""

    def __init__(
        self,
        detail: str = "Resource not found.",
        headers: Optional[Dict[str, str]] = None,
    ):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
            headers=headers,
        )


class UnauthorizedException(AppException):
    """Raised when authentication credentials are invalid or missing."""

    def __init__(
        self,
        detail: str = "Authentication credentials were not provided or are invalid.",
        headers: Optional[Dict[str, str]] = None,
    ):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers=headers or {"WWW-Authenticate": "Bearer"},
        )


class ForbiddenException(AppException):
    """Raised when user lacks permission for the operation."""

    def __init__(
        self,
        detail: str = "You do not have permission to perform this action.",
        headers: Optional[Dict[str, str]] = None,
    ):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            headers=headers,
        )


class BadRequestException(AppException):
    """Raised when request payload or parameters are invalid."""

    def __init__(
        self,
        detail: str = "Bad request.",
        headers: Optional[Dict[str, str]] = None,
    ):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            headers=headers,
        )


class ConflictException(AppException):
    """Raised when a resource state conflict occurs (e.g. unique constraint violation)."""

    def __init__(
        self,
        detail: str = "Resource conflict.",
        headers: Optional[Dict[str, str]] = None,
    ):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail,
            headers=headers,
        )
