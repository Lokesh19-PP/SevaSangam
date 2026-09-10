"""Data access repository for Users, Customers, and Cooperatives."""

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.cooperative import Cooperative
from app.models.customer import Customer
from app.models.user import User


# ---------------------------------------------------------------------------
# User Queries
# ---------------------------------------------------------------------------

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """Retrieve a user by primary key ID."""
    return db.get(User, user_id)


def get_user_by_phone(db: Session, phone: str) -> Optional[User]:
    """Retrieve a user by unique phone number."""
    statement = select(User).where(User.phone == phone)
    return db.scalars(statement).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Retrieve a user by email address."""
    statement = select(User).where(User.email == email)
    return db.scalars(statement).first()


def create_user(db: Session, user_data: dict) -> User:
    """Insert a new user record."""
    user = User(**user_data)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user_id: int, update_data: dict) -> Optional[User]:
    """Update fields on an existing user."""
    user = db.get(User, user_id)
    if not user:
        return None
    for key, value in update_data.items():
        if hasattr(user, key) and value is not None:
            setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user


def list_users(
    db: Session, skip: int = 0, limit: int = 20, role: Optional[str] = None
) -> List[User]:
    """List users with optional pagination and role filter."""
    stmt = select(User)
    if role:
        stmt = stmt.where(User.role == role)
    stmt = stmt.offset(skip).limit(limit)
    return list(db.scalars(stmt).all())


# ---------------------------------------------------------------------------
# Customer Queries
# ---------------------------------------------------------------------------

def get_customer_by_id(db: Session, customer_id: int) -> Optional[Customer]:
    """Retrieve customer profile by ID."""
    return db.get(Customer, customer_id)


def get_customer_by_user_id(db: Session, user_id: int) -> Optional[Customer]:
    """Retrieve customer profile linked to a user account."""
    stmt = select(Customer).where(Customer.user_id == user_id)
    return db.scalars(stmt).first()


def create_customer(db: Session, customer_data: dict) -> Customer:
    """Insert a new customer profile record."""
    customer = Customer(**customer_data)
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


def update_customer(
    db: Session, customer_id: int, update_data: dict
) -> Optional[Customer]:
    """Update customer profile information."""
    customer = db.get(Customer, customer_id)
    if not customer:
        return None
    for key, value in update_data.items():
        if hasattr(customer, key) and value is not None:
            setattr(customer, key, value)
    db.commit()
    db.refresh(customer)
    return customer


# ---------------------------------------------------------------------------
# Cooperative Queries
# ---------------------------------------------------------------------------

def get_cooperative_by_id(db: Session, coop_id: int) -> Optional[Cooperative]:
    """Retrieve a cooperative society by ID."""
    return db.get(Cooperative, coop_id)


def get_cooperative_by_reg_number(db: Session, reg_number: str) -> Optional[Cooperative]:
    """Retrieve a cooperative society by registration number."""
    stmt = select(Cooperative).where(Cooperative.registration_number == reg_number)
    return db.scalars(stmt).first()


def list_cooperatives(
    db: Session, skip: int = 0, limit: int = 20, active_only: bool = True
) -> List[Cooperative]:
    """List all cooperative societies."""
    stmt = select(Cooperative)
    if active_only:
        stmt = stmt.where(Cooperative.is_active.is_(True))
    stmt = stmt.offset(skip).limit(limit)
    return list(db.scalars(stmt).all())


def create_cooperative(db: Session, coop_data: dict) -> Cooperative:
    """Register a new labour cooperative society."""
    coop = Cooperative(**coop_data)
    db.add(coop)
    db.commit()
    db.refresh(coop)
    return coop
