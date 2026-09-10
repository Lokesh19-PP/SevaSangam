# Backend Architecture — SevaSangam

Overview of the backend architecture, module responsibilities, and layer separation rules for the FastAPI REST API service.

---

## Folder Responsibilities

| Folder / Path | Purpose & Responsibilities |
|---|---|
| `backend/app/main.py` | Application entrypoint, FastAPI instance, middleware setup, and root routes. |
| `backend/app/api/` | Top-level API router registration and versioning. |
| `backend/app/api/routes/` | REST route handlers; thin endpoints validating input schemas and delegating to services. |
| `backend/app/core/` | Global configuration (`config.py`), domain constants (`constants.py`), and custom exceptions (`exceptions.py`). |
| `backend/app/database/` | Database engine setup, scoped sessions, connection lifecycle, and declarative base. |
| `backend/app/models/` | SQLAlchemy ORM entity models representing database tables and PostGIS geometries. |
| `backend/app/schemas/` | Pydantic data schemas for request parsing, validation, and response serialization (DTOs). |
| `backend/app/services/` | Business logic layer; orchestrates workflows, rules, status transitions, and service interactions. |
| `backend/app/repositories/` | Data access layer; encapsulates all SQLAlchemy/PostGIS queries, filtering, and transactions. |
| `backend/app/ai/` | Isolated machine learning algorithms: fair smart-matching, workload balancing, and demand forecasting. |
| `backend/app/integrations/` | Third-party service clients: Twilio SMS/WhatsApp, Tesseract OCR verification, mock payments. |
| `backend/app/utils/` | General helper utilities, string formatters, and security token utilities. |
| `backend/app/tests/` | Automated test suite (Pytest fixtures, unit tests, and API integration tests). |

---

## Core Backend Rules

1. **Layer Separation**:
   $$\text{Route Handler (Thin)} \longrightarrow \text{Service (Business Logic)} \longrightarrow \text{Repository (Database Queries)} \longrightarrow \text{PostgreSQL/PostGIS}$$
2. **No DB Queries in Routes/Services**: All database read/write queries must reside strictly inside `repositories/`.
3. **No Business Logic in Routes**: Route handlers only validate requests (via Pydantic schemas) and pass parameters to `services/`.
4. **Isolated AI & Integrations**:
   - Smart matching and forecasting code belongs only in `app/ai/`.
   - External providers (Twilio, OCR, payment gateways) belong only in `app/integrations/`.
5. **No Hardcoded Secrets**: Secrets are loaded exclusively from `.env` via `app.core.config.Settings`.
