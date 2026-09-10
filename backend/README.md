# SevaSangam — Backend Service

FastAPI-powered REST API backend for **SevaSangam**, a cooperative-owned digital service marketplace connecting customers with verified workers from Labour Cooperative Societies.

---

## Architecture & Project Structure

The backend follows a modular monolith architecture adhering to strict separation of concerns:

```
backend/
├── app/
│   ├── ai/             # AI smart matching & demand forecasting algorithms
│   ├── api/
│   │   └── routes/     # REST API route handlers (endpoints only, no business logic)
│   ├── core/           # App configuration, security settings, exceptions & constants
│   ├── database/       # PostgreSQL/PostGIS database session, engine & base metadata
│   ├── integrations/   # External service integrations (Twilio SMS/WhatsApp, OCR, mock payments)
│   ├── models/         # SQLAlchemy ORM models
│   ├── repositories/   # Data access layer (all DB queries live here)
│   ├── schemas/        # Pydantic schemas (request validation & response serialization)
│   ├── services/       # Core business logic layer
│   ├── tests/          # Pytest automated unit and integration tests
│   ├── utils/          # Shared utility functions and helpers
│   └── main.py         # FastAPI application entrypoint
├── .env.example        # Sample environment variables
├── Dockerfile          # Container definition for backend service
├── README.md           # Backend documentation (this file)
└── requirements.txt    # Python dependencies
```

---

## Architectural Rules

1. **Route Handlers (`api/routes/`)**: Keep endpoints thin. Validate requests via `schemas/` and delegate directly to `services/`.
2. **Business Logic (`services/`)**: All business logic, workflow orchestration, and calculations belong in `services/`.
3. **Data Access (`repositories/`)**: Route handlers and services never query the database directly. All database queries must go through repository classes.
4. **AI & ML (`ai/`)**: All AI matching and forecasting logic stays isolated inside `app/ai/`.
5. **Integrations (`integrations/`)**: Twilio, OCR, and payment gateways stay modularized in `app/integrations/`.

---

## Local Development Setup

### 1. Prerequisites
- Python 3.12 or higher
- PostgreSQL with PostGIS extension (or run via root Docker Compose)

### 2. Setup Virtual Environment
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment
```bash
cp .env.example .env
```
Update `.env` with your local database credentials and test tokens.

### 5. Run the Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Interactive OpenAPI: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## Running with Docker

```bash
# Build image
docker build -t sevasangam-backend .

# Run container
docker run -p 8000:8000 --env-file .env sevasangam-backend
```
