# Antigravity Prompts — Yash Thakur (branch: `Yash-Thakur`)
### Backend track — Difficulty: EASY

> Place at: `docs/team/prompts/yash-thakur.md`
> Before Prompt 1, paste `docs/ANTIGRAVITY_CONTEXT.md` into Antigravity.
> This is the first backend work — nothing exists in `backend/` yet, so you're laying the foundation Yash and Lokesh build on next. No dependencies, start immediately.

## Setup
```bash
git checkout master
git pull
git checkout -b Yash-Thakur
```

## Prompt 1 — Backend skeleton
```
Initialize the FastAPI project inside backend/ following this exact structure:
backend/app/{api/routes, models, schemas, services, repositories, ai, integrations,
database, core, utils, tests}, backend/app/main.py, backend/requirements.txt,
backend/Dockerfile, backend/.env.example, backend/README.md. Only create folders
and empty/placeholder files at this stage — no business logic yet.
```
**Commit:** `feat(backend): scaffold FastAPI project folder structure`

## Prompt 2 — Core config & health endpoint
```
Implement backend/app/core/config.py (Pydantic settings reading from .env:
DATABASE_URL, AUTH_SECRET placeholders, TWILIO_* placeholders), core/constants.py,
core/exceptions.py. Implement backend/app/main.py to initialize FastAPI, mount a
basic root GET /api and GET /api/health endpoint returning a JSON confirming
"SevaSangam backend is running".
```
**Commit:** `feat(backend): add core config and health check endpoint`

## Prompt 3 — Docker setup
```
Create docker/frontend/Dockerfile, docker/backend/Dockerfile (basic — Node build
for frontend, Python/FastAPI for backend matching backend/requirements.txt), and
a root docker-compose.yml wiring frontend, backend, and a postgres+postgis
service for local development.
```
**Commit:** `feat(infra): add Docker setup for frontend, backend, and postgres+postgis`

## Prompt 4 — Docs placeholders
```
Create docs/architecture/frontend-architecture.md and
docs/architecture/backend-architecture.md as placeholder docs describing each
side's folder responsibilities (reference the structure already defined in
docs/ANTIGRAVITY_CONTEXT.md). Keep them short — a table of folder -> purpose.
```
**Commit:** `docs: add frontend and backend architecture placeholder docs`

## Prompt 5 — Root README
```
Update the root README.md with a short SevaSangam project overview, tagline,
tech stack summary, and setup instructions for running frontend
(npm install && npm run dev) and backend (pip install -r requirements.txt &&
uvicorn app.main:app --reload) locally.
```
**Commit:** `docs: update root README with project overview and local setup steps`

## Final step
```bash
git push origin Yash-Thakur
```
Open a PR into `master` titled "Backend scaffold + Docker + docs foundation".
