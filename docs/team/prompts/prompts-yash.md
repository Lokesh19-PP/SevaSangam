# Antigravity Prompts — Yash (branch: `Yash`)
### Backend track — Difficulty: MEDIUM

> Place at: `docs/team/prompts/yash.md`
> Before Prompt 1, paste `docs/ANTIGRAVITY_CONTEXT.md` into Antigravity.
> Depends on Yash-Thakur's scaffold (branch `Yash-Thakur`). If his PR isn't merged yet: `git fetch origin Yash-Thakur && git merge origin/Yash-Thakur`.

## Setup
```bash
git checkout master
git pull
git checkout -b Yash
```

## Prompt 1 — Database connection layer
```
Implement backend/app/database/connection.py, base.py, session.py for
PostgreSQL + PostGIS using SQLAlchemy (with a placeholder DATABASE_URL from
core/config.py). Do not connect to a real database yet — just the
connection/session boilerplate so repositories can import it later.
```
**Commit:** `feat(backend): add database connection and session boilerplate`

## Prompt 2 — Core models
```
Inside backend/app/models, create SQLAlchemy model files for: User, Customer,
Worker, Cooperative, ServiceCategory, Skill, WorkerSkill, Certification, Booking,
Rating. Keep fields minimal but realistic (id, foreign keys, timestamps, core
attributes from the SevaSangam context). Add a placeholder latitude/longitude
float field on Worker and Customer for now — real PostGIS geometry columns come
later.
```
**Commit:** `feat(backend): add core SQLAlchemy models`

## Prompt 3 — Pydantic schemas
```
Inside backend/app/schemas, create matching Pydantic request/response schemas for
auth.py, user.py, worker.py, service.py, booking.py — mirroring the models from
the previous step.
```
**Commit:** `feat(backend): add Pydantic schemas for auth, users, workers, services, bookings`

## Prompt 4 — Repositories
```
Inside backend/app/repositories, create user_repository.py, worker_repository.py,
booking_repository.py, service_repository.py, rating_repository.py,
analytics_repository.py. Each should only contain DB query functions using the
models from the previous step — no business logic. Use simple functions like
get_worker_by_id, list_available_workers, create_booking, etc.
```
**Commit:** `feat(backend): add repository layer for DB access`

## Prompt 5 — Repository tests (basic)
```
Inside backend/app/tests, add a couple of simple unit tests for
worker_repository.py and booking_repository.py using an in-memory SQLite
database (swap the SQLAlchemy engine for tests only) to confirm create/read
functions work as expected.
```
**Commit:** `test(backend): add basic repository tests with in-memory SQLite`

## Final step
```bash
git push origin Yash
```
Open a PR into `master` titled "Backend database layer: models, schemas, repositories".
