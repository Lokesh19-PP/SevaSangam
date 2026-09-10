# Frontend Architecture — SevaSangam

Overview of the frontend architecture, folder responsibilities, and key design rules for the React (Vite + Tailwind CSS) client application.

---

## Folder Responsibilities

| Folder / Path | Purpose & Responsibilities |
|---|---|
| `src/assets/` | Static assets organized by type: `icons/`, `images/`, and `logo/`. |
| `src/components/cards/` | Domain-specific cards (e.g., worker card, service card, booking card). |
| `src/components/charts/` | Visualization components for admin analytics and worker earnings charts. |
| `src/components/common/` | Shared components like modals, loaders, alerts, and badges. |
| `src/components/forms/` | Reusable form elements, booking forms, and verification uploads. |
| `src/components/maps/` | Map displays, worker tracking, and location picker components. |
| `src/components/navigation/`| Navbars, sidebars, breadcrumbs, and bottom navigation bars. |
| `src/components/ui/` | Base primitive design system elements (buttons, inputs, dropdowns). |
| `src/context/` | Global React context providers (AuthContext, LanguageContext, ThemeContext). |
| `src/dashboards/customer/` | Customer-specific dashboard views, bookings, and worker discovery. |
| `src/dashboards/worker/` | Worker dashboard views, incoming jobs, profile, earnings, and availability. |
| `src/dashboards/admin/` | Cooperative Admin dashboard, verification queue, fair allocation, analytics. |
| `src/hooks/` | Custom hooks containing UI business logic and state orchestration. |
| `src/i18n/locales/` | Translation dictionaries for English (`en.json`), Hindi (`hi.json`), and Marathi (`mr.json`). |
| `src/layouts/` | Shell layouts wrapping dashboards (CustomerLayout, WorkerLayout, AdminLayout). |
| `src/mock/data/` | Static JSON mock datasets for offline development and testing. |
| `src/mock/mockApi.js` | Simulated API layer returning mock responses before backend integration. |
| `src/pages/` | Public top-level route pages (Landing, Login, Register, About, 404). |
| `src/routes/` | Router configuration, role-based route guards, and path definitions. |
| `src/services/api/` | API client modules encapsulating all HTTP calls (`workerService.js`, etc.). |
| `src/utils/` | Formatting utilities, date helpers, geo math, and constants. |

---

## Core Frontend Rules

1. **Pure JavaScript**: Use React JavaScript (`.jsx` / `.js`) exclusively — no TypeScript.
2. **Data Flow Pipeline**:
   $$\text{Component} \longrightarrow \text{Custom Hook} \longrightarrow \text{services/api/*.js} \longrightarrow \text{apiClient.js} \longrightarrow \text{FastAPI / mockApi.js}$$
3. **No Direct API/Mock Calls in UI**: Components never import mock data or call fetch/axios directly.
4. **No Hardcoded Strings**: All user-facing text must be routed through `i18n/locales/*.json`.
5. **Role Isolation**: The three dashboards (Customer, Worker, Admin) are strictly separated; no shared state or UI leakage.
