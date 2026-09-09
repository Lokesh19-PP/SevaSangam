# SevaSangam — Team Contributions & Task Tracker

> Place at: `docs/team/CONTRIBUTIONS.md`

Read `docs/ANTIGRAVITY_CONTEXT.md` first — every member's Antigravity session should start with that file.

## Branching rule

- One branch per member, matching their name exactly (case-sensitive):
  `Lokesh`, `Yash`, `Yash-Thakur`, `Janhvi`, `Priti`, `Ashana`
- Branch off `master`, open a PR into `master` when a task is done, small PRs (one prompt = roughly one commit = one logical unit).
- Never force-push over someone else's branch.
- If two people touch the same file, pull `master` first and resolve locally before opening the PR.

## Teams

**Backend (boys), ordered by difficulty:**
- Yash-Thakur — Easy — scaffold, config, health check, Docker, docs, env files
- Yash — Medium — DB connection, models, schemas, repositories
- Lokesh — Hard — business logic services + AI matching & forecasting

**Frontend (girls):**
- Janhvi — Design system + Customer Dashboard + mock data
- Priti — Worker Dashboard + component library + API service layer
- Ashana — Admin Dashboard + Routing/Auth/Context + i18n

## Suggested order (so nobody blocks on empty folders)

**Round 1 (parallel, no dependencies):** Yash-Thakur (backend scaffold), Janhvi (design system + mock data)
**Round 2:** Yash (DB/models/schemas/repositories, needs Yash-Thakur's scaffold merged), Priti (worker dashboard + API layer, needs Janhvi's mock data + design system)
**Round 3:** Lokesh (services + AI, needs Yash's models/schemas merged), Ashana (admin dashboard + routing, needs Janhvi's design system + Priti's API layer)

## Task table

| Member | Branch | Folder(s) owned | Depends on |
|---|---|---|---|
| Yash Thakur | `Yash-Thakur` | `backend/app/core`, `backend/app/main.py`, `backend/requirements.txt`, `backend/Dockerfile`, `backend/.env.example`, `docker/`, `docker-compose.yml`, root `docs/architecture/*` placeholders, root `README.md` | — |
| Yash | `Yash` | `backend/app/database`, `backend/app/models`, `backend/app/schemas`, `backend/app/repositories` | Yash-Thakur's scaffold |
| Lokesh | `Lokesh` | `backend/app/services`, `backend/app/ai/*` | Yash's models/schemas |
| Janhvi | `Janhvi` | Tailwind theme, `frontend/src/components/ui`, `components/common`, `dashboards/customer/*`, `frontend/src/mock/data/*` | — |
| Priti | `Priti` | `frontend/src/dashboards/worker/*`, `components/cards`, `components/forms`, `frontend/src/services/api/*`, `frontend/src/mock/mockApi.js` | Janhvi's design system + mock data |
| Ashana | `Ashana` | `frontend/src/dashboards/admin/*`, `routes/*`, `context/*`, `layouts/*`, `i18n/*` | Janhvi's design system, Priti's API layer |

## Definition of done (per task)

- Files created in the exact folder specified.
- No secrets committed. `.env.example` only.
- Commit message follows the format given in that member's prompt file.
- A one-line update added to `docs/team/CONTRIBUTIONS.md` under "Progress log" below once merged.

## Progress log

<!-- Each member appends a line here after merging a PR, e.g.:
- 2026-09-12 — Yash-Thakur — Backend scaffold + Docker + health endpoint merged
-->
