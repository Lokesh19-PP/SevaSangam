# Antigravity Prompts — Ashana (branch: `Ashana`)
### Frontend track

> Place at: `docs/team/prompts/ashana.md`
> Before Prompt 1, paste `docs/ANTIGRAVITY_CONTEXT.md` into Antigravity.
> Depends on Janhvi's design system (branch `Janhvi`) and Priti's API layer (branch `Priti`). Merge/pull whichever is ready first before you start.

## Setup
```bash
git checkout master
git pull
git checkout -b Ashana
```

## Prompt 1 — Auth & Language context
```
Inside frontend/src/context, create AuthContext.jsx (holds current user, role,
login/logout functions — mock implementation for now, calling authApi.js if
Priti's API layer is merged, otherwise a local mock) and LanguageContext.jsx
(current language state + setLanguage function, default "en"). Also create
AppContext.jsx for minimal shared app-level state. Keep global state minimal,
no Redux.
```
**Commit:** `feat(context): add auth, language, and app context providers`

## Prompt 2 — Routing foundation
```
Inside frontend/src/routes, create AppRoutes.jsx defining top-level routes:
/, /login, /register, /customer/*, /worker/*, /admin/*. Create
ProtectedRoute.jsx (redirects to /login if no user in AuthContext) and
RoleRoute.jsx (redirects if user.role does not match the required role for that
route branch). Wire AppRoutes.jsx into App.jsx.
```
**Commit:** `feat(routes): add protected and role-based routing`

## Prompt 3 — i18n wiring and content
```
Set up frontend/src/i18n/config.js using a lightweight i18n approach reading
from i18n/locales/en.json, hi.json, mr.json. Fill those three files with
translation keys for common UI strings used across all three dashboards:
navigation labels, buttons (Book Now, Accept, Reject, Submit), status labels
(Pending, Confirmed, Completed, Cancelled), and form labels (Name, Skills,
Location, Rating). Keep keys identical across all three files, only values
translated. Wire a useLanguage hook (frontend/src/hooks/useLanguage.js).
```
**Commit:** `feat(i18n): add translation content and language switching hook`

## Prompt 4 — Admin layout + worker verification
```
Create frontend/src/layouts/AdminLayout.jsx (sidebar: Dashboard, Worker
Verification, Bookings, Analytics, Complaints, Welfare). Then create
frontend/src/dashboards/admin/WorkerVerification.jsx: a list of pending workers
with a detail panel showing uploaded certificate placeholder and
Approve/Reject buttons, using Janhvi's UI components.
```
**Commit:** `feat(admin): add admin layout and worker verification page`

## Prompt 5 — Admin analytics & complaints
```
Create frontend/src/dashboards/admin/Analytics.jsx (placeholder cards: total
workers, active workers, total bookings, most demanded services, worker
utilization — pull from analyticsApi.js if Priti's API layer is merged) and
Complaints.jsx (list of complaints with status and a resolve action).
```
**Commit:** `feat(admin): add analytics and complaints management pages`

## Final step
```bash
git push origin Ashana
```
Open a PR into `master` titled "Routing/auth/i18n foundation + admin dashboard".
