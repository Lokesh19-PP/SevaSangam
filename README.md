# SevaSangam (सेवा संगम) Lokesh

> _"Trusted Services. Fair Opportunities. Stronger Communities."_

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20PostGIS-336791?style=flat-square&logo=postgresql&logoColor=white)](https://postgis.net)
[![Docker](https://img.shields.io/badge/Container-Docker%20Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com)

---

## 📖 Project Overview

**SevaSangam** is a cooperative-owned digital service marketplace developed for the **Smart India Hackathon (Problem Statement 26089, Ministry of Cooperation / NCCT)**.

Unlike conventional gig-economy aggregators, SevaSangam connects customers directly with **verified skilled workers from Labour Cooperative Societies** (electricians, plumbers, carpenters, caregivers, domestic help, technicians, and drivers), ensuring fair pay, worker dignity, and cooperative transparency.

### 🌟 Key Differentiators

- **Fair Workload Distribution**: Algorithmic allocation ensuring balanced job distribution among all active cooperative workers rather than monopolization by top-rated workers.
- **Worker Welfare & Insurance**: Transparent visibility into cooperative welfare schemes, accident insurance, healthcare benefits, and emergency funds.
- **AI Smart Matching**: Multi-criteria ranking balancing skill proficiency, proximity (PostGIS), real-time availability, rating, and current workload.
- **AI Demand Forecasting**: Predictive scheduling helping cooperatives anticipate regional demand surges and prepare worker capacity.
- **Emergency / On-Demand Booking**: Rapid response dispatch for urgent utility breakdowns and household crises.
- **Multilingual Accessibility**: Native support for English, Hindi (हिंदी), and Marathi (मराठी).

---

## 👥 Three Dedicated Roles & Dashboards

The application enforces strict separation between user personas:

1. **👤 Customer Dashboard**: Browse certified cooperative services, discover nearby workers, schedule appointments, track live requests, trigger emergency dispatches, and rate service delivery.
2. **👷 Worker Dashboard**: Manage profile, certifications, and availability; receive incoming job dispatches; track daily/weekly earnings; view welfare scheme entitlements.
3. **🏢 Cooperative Administrator Dashboard**: Verify new worker registrations and trade certificates via OCR, monitor real-time booking dispatches, oversee workforce utilization and fair distribution metrics, resolve grievances, and review analytics.

---

## 🛠️ Technology Stack

| Layer              | Technologies                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------- |
| **Frontend**       | React 19 (JavaScript), Vite, Tailwind CSS, React Router, i18next                         |
| **Backend**        | FastAPI, Python 3.12+, Pydantic v2, REST APIs                                            |
| **Database**       | PostgreSQL + PostGIS extension                                                           |
| **AI / ML**        | Scikit-learn (matching & forecasting), OpenCV + Tesseract OCR (certificate verification) |
| **Communications** | Twilio API (SMS & WhatsApp notifications)                                                |
| **Infra & DevOps** | Docker, Docker Compose, Vercel                                                           |

---

## 📂 Project Structure

```
SevaSangam/
├── backend/                  # FastAPI REST backend service
│   ├── app/
│   │   ├── ai/               # AI matching & demand forecasting algorithms
│   │   ├── api/routes/       # REST API endpoints & route handlers
│   │   ├── core/             # Configuration, constants & exception definitions
│   │   ├── database/         # DB engine, session & PostGIS configuration
│   │   ├── integrations/     # External integrations (Twilio, OCR, payments)
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── repositories/     # Data access layer (all DB queries)
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── services/         # Core business logic
│   │   └── main.py           # FastAPI entrypoint
│   ├── Dockerfile
│   └── requirements.txt
├── docker/                   # Docker build definitions
│   ├── backend/Dockerfile
│   └── frontend/Dockerfile
├── docker-compose.yml        # Root orchestrator (Frontend, Backend, PostGIS)
├── docs/                     # System architecture & team documentation
│   ├── architecture/         # Frontend, backend, and system architecture docs
│   ├── team/                 # Contribution guide & per-member task prompts
│   └── ANTIGRAVITY_CONTEXT.md# Master team context document
└── frontend/                 # React client application
    ├── src/
    │   ├── components/       # Reusable UI component library
    │   ├── dashboards/       # Separated Customer, Worker, and Admin views
    │   ├── hooks/            # Custom React hooks (business logic)
    │   ├── i18n/             # Translations (en, hi, mr)
    │   ├── services/api/     # Modular API client layer
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Local Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher) & `npm`
- [Python](https://www.python.org/) (v3.12 or higher)
- [Docker & Docker Compose](https://www.docker.com/) (recommended for PostGIS)

---

### 1. Running Frontend Locally

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend will be available at: **`http://localhost:5173`**

---

### 2. Running Backend Locally

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment configuration
cp .env.example .env

# Run FastAPI server with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API Base URL: **`http://localhost:8000/api`**
- Health Check: **`http://localhost:8000/api/health`**
- Interactive Swagger Docs: **`http://localhost:8000/docs`**

---

### 3. Running Full Stack with Docker Compose

To spin up the Frontend, Backend, and PostgreSQL + PostGIS database all together:

```bash
# From the repository root
docker-compose up --build
```

Services started:

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000`
- **PostgreSQL / PostGIS Database**: `localhost:5432`

---

## 📚 Documentation Links

- [System Architecture](docs/architecture/system-architecture.md)
- [Frontend Architecture](docs/architecture/frontend-architecture.md)
- [Backend Architecture](docs/architecture/backend-architecture.md)
- [Team Contributions & Roles](docs/team/CONTRIBUTIONS.md)
- [Master Context Guide](docs/ANTIGRAVITY_CONTEXT.md)

---

## ⚖️ License

Developed for the **Smart India Hackathon (SIH)** under Problem Statement 26089 (Ministry of Cooperation / NCCT).
