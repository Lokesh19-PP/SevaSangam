"""Domain constants and system enums for SevaSangam."""

from enum import Enum


class UserRole(str, Enum):
    """User roles for role-based access control (RBAC)."""

    CUSTOMER = "customer"
    WORKER = "worker"
    ADMIN = "admin"


class WorkerStatus(str, Enum):
    """Worker verification status lifecycle."""

    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"
    SUSPENDED = "suspended"


class BookingStatus(str, Enum):
    """Lifecycle status of a cooperative service booking."""

    PENDING = "pending"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class PaymentStatus(str, Enum):
    """Payment transaction states."""

    PENDING = "pending"
    PAID = "paid"
    CASH = "cash"
    REFUNDED = "refunded"


class ServiceCategory(str, Enum):
    """Supported cooperative labor service categories."""

    ELECTRICIAN = "electrician"
    PLUMBER = "plumber"
    CARPENTER = "carpenter"
    DOMESTIC_HELP = "domestic_help"
    CAREGIVER = "caregiver"
    DRIVER = "driver"
    GARDENER = "gardener"
    CLEANER = "cleaner"
    TECHNICIAN = "technician"


class SupportedLanguage(str, Enum):
    """Supported languages for multilingual UI and notifications."""

    ENGLISH = "en"
    HINDI = "hi"
    MARATHI = "mr"


# Pagination & Search Defaults
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100
DEFAULT_SEARCH_RADIUS_KM = 15.0
