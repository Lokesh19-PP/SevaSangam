"""Data access repository for Service Categories and Skills."""

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.service_category import ServiceCategory
from app.models.skill import Skill


def get_category_by_id(
    db: Session, category_id: int, eager_load_skills: bool = False
) -> Optional[ServiceCategory]:
    """Retrieve service category by ID."""
    if eager_load_skills:
        stmt = (
            select(ServiceCategory)
            .options(selectinload(ServiceCategory.skills))
            .where(ServiceCategory.id == category_id)
        )
        return db.scalars(stmt).first()
    return db.get(ServiceCategory, category_id)


def get_category_by_code(db: Session, code: str) -> Optional[ServiceCategory]:
    """Retrieve service category by unique slug code."""
    stmt = select(ServiceCategory).where(ServiceCategory.code == code)
    return db.scalars(stmt).first()


def list_categories(
    db: Session, active_only: bool = True, eager_load_skills: bool = False
) -> List[ServiceCategory]:
    """List service categories with optional skill loading."""
    stmt = select(ServiceCategory)
    if active_only:
        stmt = stmt.where(ServiceCategory.is_active.is_(True))
    if eager_load_skills:
        stmt = stmt.options(selectinload(ServiceCategory.skills))
    return list(db.scalars(stmt).all())


def create_category(db: Session, category_data: dict) -> ServiceCategory:
    """Create a new service category."""
    category = ServiceCategory(**category_data)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def update_category(
    db: Session, category_id: int, update_data: dict
) -> Optional[ServiceCategory]:
    """Update service category information."""
    category = db.get(ServiceCategory, category_id)
    if not category:
        return None
    for key, value in update_data.items():
        if hasattr(category, key) and value is not None:
            setattr(category, key, value)
    db.commit()
    db.refresh(category)
    return category


def get_skill_by_id(db: Session, skill_id: int) -> Optional[Skill]:
    """Retrieve a skill by ID."""
    return db.get(Skill, skill_id)


def list_skills_by_category(db: Session, category_id: int) -> List[Skill]:
    """Retrieve all skills under a given service category."""
    stmt = select(Skill).where(Skill.category_id == category_id)
    return list(db.scalars(stmt).all())


def create_skill(db: Session, skill_data: dict) -> Skill:
    """Insert a new trade skill."""
    skill = Skill(**skill_data)
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill
