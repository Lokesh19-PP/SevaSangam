"""Database initialization and demo seeding module for SevaSangam."""

import logging
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.core.constants import BookingStatus, PaymentStatus, UserRole, WorkerStatus
from app.database.base import Base
from app.database.connection import engine
from app.database.session import SessionLocal
from app.models.booking import Booking
from app.models.certification import Certification
from app.models.cooperative import Cooperative
from app.models.customer import Customer
from app.models.rating import Rating
from app.models.service_category import ServiceCategory
from app.models.skill import Skill, WorkerSkill
from app.models.user import User
from app.models.worker import Worker
from app.services.auth_service import hash_password

logger = logging.getLogger(__name__)


def init_database() -> None:
    """Create all tables and seed initial demo data if database is fresh."""
    try:
        # Create all tables defined in models
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified/created successfully.")

        db: Session = SessionLocal()
        try:
            seed_demo_data(db)
        finally:
            db.close()
    except Exception as exc:
        logger.warning("Database init/seed encountered an issue: %s", exc)


def seed_demo_data(db: Session) -> None:
    """Seed comprehensive demo users, workers, categories, skills, and bookings."""
    # Check if already seeded
    if db.query(User).first():
        logger.info("Database already contains data, skipping seed.")
        return

    logger.info("Seeding initial demo data for SevaSangam...")

    # 1. Create Cooperative
    coop = Cooperative(
        name="Maharashtra Labour Welfare Cooperative Federation",
        registration_number="MH-COOP-2024-8891",
        contact_person="Federation Secretary",
        phone="+91-9820012345",
        email="federation@sevasangam.org",
        address="Bandra Kurla Complex",
        city="Mumbai",
        state="Maharashtra",
        pincode="400051",
        is_active=True,
    )
    db.add(coop)
    db.flush()

    # 2. Create Service Categories
    categories_data = [
        ("Electrical & Wiring", "electrical-wiring", "Home & industrial electrical repair, wiring, switchboards, MCB install", "Zap"),
        ("Plumbing & Sanitary", "plumbing-sanitary", "Pipe repairs, leak detection, taps, washbasin & geyser fitting", "Wrench"),
        ("Carpentry & Woodwork", "carpentry-woodwork", "Furniture repairs, door latch, custom cabinetry and woodwork", "Hammer"),
        ("Deep Home Cleaning", "deep-cleaning", "Sanitization, kitchen & bathroom deep scrub, sofa shampooing", "Sparkles"),
        ("AC & Appliance Repair", "appliance-repair", "AC servicing, gas refilling, refrigerator & washing machine repair", "Airplay"),
        ("Painting & Waterproofing", "painting-waterproofing", "Interior wall painting, texture finish, wall seepage treatment", "Paintbrush"),
    ]

    categories = []
    for name, code, desc, icon in categories_data:
        cat = ServiceCategory(name=name, code=code, description=desc, icon=icon, base_rate=350.0, is_active=True)
        db.add(cat)
        categories.append(cat)
    db.flush()

    # 3. Create Skills for Categories
    skills = []
    for cat in categories:
        s1 = Skill(name=f"{cat.name} Specialist", category_id=cat.id, description=f"Certified {cat.name} professional")
        s2 = Skill(name=f"{cat.name} Quick Service", category_id=cat.id, description=f"Emergency & routine {cat.name}")
        db.add_all([s1, s2])
        skills.extend([s1, s2])
    db.flush()

    # 4. Create Admin User
    admin_user = User(
        email="admin@sevasangam.org",
        phone="+91-9000000001",
        hashed_password=hash_password("admin123"),
        full_name="SevaSangam Admin",
        role=UserRole.ADMIN,
        is_active=True,
    )
    db.add(admin_user)

    # 5. Create Customer User
    customer_user = User(
        email="customer@sevasangam.org",
        phone="+91-9876543210",
        hashed_password=hash_password("password123"),
        full_name="Rajesh Sharma",
        role=UserRole.CUSTOMER,
        is_active=True,
    )
    db.add(customer_user)
    db.flush()

    customer_profile = Customer(
        user_id=customer_user.id,
        address="Flat 402, Greenfield Heights, Andheri West, Mumbai",
        city="Mumbai",
        pincode="400053",
        latitude=19.1363,
        longitude=72.8277,
    )
    db.add(customer_profile)

    # 6. Create Worker Users & Profiles
    workers_seed = [
        {
            "name": "Suresh Kumar",
            "email": "suresh@sevasangam.org",
            "phone": "+91-9811122233",
            "rating": 4.9,
            "ratings_count": 48,
            "jobs": 52,
            "wage": 650.0,
            "exp": 6,
            "lat": 19.1136,
            "lon": 72.8697,
            "cat_idx": 0,
        },
        {
            "name": "Ramesh Patil",
            "email": "ramesh@sevasangam.org",
            "phone": "+91-9822233344",
            "rating": 4.8,
            "ratings_count": 35,
            "jobs": 39,
            "wage": 550.0,
            "exp": 4,
            "lat": 19.1200,
            "lon": 72.8400,
            "cat_idx": 1,
        },
        {
            "name": "Priya Sharma",
            "email": "priya@sevasangam.org",
            "phone": "+91-9833344455",
            "rating": 4.95,
            "ratings_count": 62,
            "jobs": 68,
            "wage": 600.0,
            "exp": 5,
            "lat": 19.1300,
            "lon": 72.8350,
            "cat_idx": 3,
        },
        {
            "name": "Aniket Rao",
            "email": "aniket@sevasangam.org",
            "phone": "+91-9844455566",
            "rating": 4.75,
            "ratings_count": 28,
            "jobs": 31,
            "wage": 700.0,
            "exp": 8,
            "lat": 19.1050,
            "lon": 72.8550,
            "cat_idx": 2,
        },
    ]

    worker_entities = []
    for w_data in workers_seed:
        u = User(
            email=w_data["email"],
            phone=w_data["phone"],
            hashed_password=hash_password("password123"),
            full_name=w_data["name"],
            role=UserRole.WORKER,
            is_active=True,
        )
        db.add(u)
        db.flush()

        w = Worker(
            user_id=u.id,
            cooperative_id=coop.id,
            status=WorkerStatus.VERIFIED,
            daily_wage_rate=w_data["wage"],
            experience_years=w_data["exp"],
            latitude=w_data["lat"],
            longitude=w_data["lon"],
            is_available=True,
            current_active_jobs=0,
            total_completed_jobs=w_data["jobs"],
            average_rating=w_data["rating"],
            total_ratings=w_data["ratings_count"],
            insurance_policy_number=f"INSR-COOP-{u.id:04d}",
        )
        db.add(w)
        db.flush()
        worker_entities.append((w, w_data["cat_idx"]))

        # Assign skill
        cat_id = categories[w_data["cat_idx"]].id
        related_skills = [s for s in skills if s.category_id == cat_id]
        if related_skills:
            ws = WorkerSkill(
                worker_id=w.id,
                skill_id=related_skills[0].id,
                proficiency_level="expert",
                is_verified=True,
            )
            db.add(ws)

        # Add Certification
        cert = Certification(
            worker_id=w.id,
            title=f"NSDC Certified - {categories[w_data['cat_idx']].name}",
            issuing_organization="Labour Cooperative Federation of India",
            verification_status="verified",
            ocr_verified=True,
        )
        db.add(cert)

    # 7. Create Demo Bookings
    if worker_entities and customer_profile:
        b1 = Booking(
            booking_reference="BK-2024-0001",
            customer_id=customer_profile.id,
            worker_id=worker_entities[0][0].id,
            category_id=categories[0].id,
            status=BookingStatus.COMPLETED,
            payment_status=PaymentStatus.PAID,
            is_emergency=False,
            service_address="Flat 402, Greenfield Heights, Andheri West, Mumbai",
            service_latitude=19.1363,
            service_longitude=72.8277,
            description="Complete electrical checkup and MCB replacement",
            total_amount=650.0,
            completed_at=datetime.now(timezone.utc),
        )
        b2 = Booking(
            booking_reference="BK-2024-0002",
            customer_id=customer_profile.id,
            worker_id=worker_entities[1][0].id,
            category_id=categories[1].id,
            status=BookingStatus.ASSIGNED,
            payment_status=PaymentStatus.PENDING,
            is_emergency=False,
            service_address="Flat 402, Greenfield Heights, Andheri West, Mumbai",
            service_latitude=19.1363,
            service_longitude=72.8277,
            description="Fix kitchen sink pipe leak and tap washer replacement",
            total_amount=550.0,
        )
        db.add_all([b1, b2])
        db.flush()

        # Add Rating for completed booking
        r = Rating(
            booking_id=b1.id,
            worker_id=worker_entities[0][0].id,
            customer_id=customer_profile.id,
            score=5.0,
            review="Punctual, polite, and resolved the electrical issue in 30 minutes. True cooperative professionalism!",
        )
        db.add(r)

    db.commit()
    logger.info("Initial demo seed data committed successfully.")
