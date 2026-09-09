# SevaSangam — Antigravity Master Context

> Place this file at: `docs/ANTIGRAVITY_CONTEXT.md`
> **Paste this file's content as the FIRST message in every Antigravity session**, before any member-specific task prompt. It gives Antigravity the full picture so it never contradicts another member's work.

## 1. What we're building

**SevaSangam** — "Trusted Services. Fair Opportunities. Stronger Communities."

A cooperative-owned digital service marketplace (SIH Problem Statement 26089, Ministry of Cooperation / NCCT) connecting customers with **verified workers from Labour Cooperative Societies** — electricians, plumbers, carpenters, domestic help, caregivers, drivers, gardeners, cleaners, technicians.

This is explicitly **NOT an Urban Company clone**. The differentiators are:

- Fair job distribution among cooperative workers (not just nearest/highest-rated)
- Worker welfare & insurance visibility
- AI-based smart matching balancing skill + distance + availability + rating + **current workload**
- AI demand forecasting
- Emergency/on-demand booking
- Geo-matching via PostGIS
- Multilingual (English, Hindi, Marathi to start)

## 2. Three roles / three dashboards

1. **Customer** — browse services, find nearby workers, book, schedule, track, emergency request, history, ratings.
2. **Worker** — profile, skills, certifications, availability, accept/reject jobs, earnings, ratings.
3. **Cooperative Administrator** — verify workers/certificates, monitor bookings, workforce utilization & fair distribution, complaints, analytics, welfare programs.

Each dashboard is **completely separated** — no shared UI leaking between roles.

## 3. Tech stack (do not substitute without team agreement)

- **Frontend:** React (JavaScript, not TypeScript), Tailwind CSS, React Router, Vite
- **Backend:** FastAPI, Python, Pydantic, REST APIs
- **Database:** PostgreSQL + PostGIS (geo)
- **AI/ML:** Scikit-learn (matching + forecasting), TensorFlow optional/future, OpenCV + Tesseract OCR (certificate verification)
- **Notifications:** Twilio (SMS/WhatsApp)
- **Auth:** Auth0 or Firebase Authentication (RBAC: customer/worker/admin)
- **Payments (MVP):** mock/modular only — pending/paid/cash, no real gateway yet. Razorpay/UPI later.
- **Deployment:** Docker (backend), Vercel (frontend)
- **Architecture style:** modular monolith. No microservices.

## 4. Golden rules (apply to every task, every member)

- JavaScript only on frontend — no TypeScript.
- React components must **never** call mock data or APIs directly. Always: `Component → hook → services/api/*.js → apiClient.js → mock/mockApi.js` (later swapped to FastAPI, same call signature).
- Business logic never lives in React components or in FastAPI route handlers — it lives in `services/` (backend) or hooks (frontend).
- Backend DB access only through `repositories/`.
- AI logic stays isolated inside `backend/app/ai/`.
- Twilio/OCR/payment code stays isolated inside `backend/app/integrations/`.
- Never hardcode secrets — always `.env` + `.env.example` placeholders.
- No user-facing string is hardcoded in components — route through `i18n/locales/*.json`.
- Keep everything modular and simple — this is a hackathon MVP, not a production fintech system.

## 5. Current repo state (as of last check)

```
SevaSangam/
├── backend/        ← EMPTY, needs Phase-1 structure
├── docker/         ← EMPTY, needs Dockerfiles + compose wiring
├── docs/           ← EMPTY, needs architecture + team docs (this file included)
└── frontend/
    ├── public/
    └── src/
        ├── assets/{icons,images,logo}
        ├── components/{cards,charts,common,forms,maps,navigation,ui}
        ├── context/
        ├── dashboards/{admin,customer,worker}
        ├── hooks/
        ├── i18n/locales/
        ├── layouts/
        ├── mock/data/
        ├── pages/
        ├── routes/
        ├── services/api/
        └── utils/
```

Frontend skeleton exists but is **mostly empty folders** — no real components/pages built yet. Backend has not been scaffolded at all yet.

## 6. Team & branches

**Backend team (by difficulty):**

| Member      | Branch        | Difficulty | Owns                                                                    |
| ----------- | ------------- | ---------- | ----------------------------------------------------------------------- |
| Yash Thakur | `Yash-Thakur` | Easy       | Backend scaffold, core config, health endpoint, Docker, docs, env files |
| Yash        | `Yash`        | Medium     | Database connection/session, models, schemas, repositories              |
| Lokesh      | `Lokesh`      | Hard       | Services (business logic) + AI matching & forecasting skeleton          |

**Frontend team:**

| Member | Branch   | Owns                                                            |
| ------ | -------- | --------------------------------------------------------------- |
| Janhvi | `Janhvi` | Design system + Customer Dashboard + mock data                  |
| Priti  | `Priti`  | Worker Dashboard + shared component library + API service layer |
| Ashana | `Ashana` | Admin Dashboard + Routing/Auth/Context + i18n                   |

Full task breakdown: see `docs/team/CONTRIBUTIONS.md`.
Per-member copy-paste prompts: see `docs/team/prompts/<name>.md`.

## 7. What NOT to do yet

Do not implement: real payment gateway, real Twilio account wiring, production Auth secrets, full PostGIS queries with real data, trained ML models. All of these get **stubbed/mocked** first — real integration is a later phase after the demo-ready prototype works end-to-end on mock data.
