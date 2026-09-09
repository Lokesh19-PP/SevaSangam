# Antigravity Prompts — Priti (branch: `Priti`)
### Frontend track

> Place at: `docs/team/prompts/priti.md`
> Before Prompt 1, paste `docs/ANTIGRAVITY_CONTEXT.md` into Antigravity.
> Depends on Janhvi's design system + mock data (branch `Janhvi`). If her PR isn't merged yet: `git fetch origin Janhvi && git merge origin/Janhvi`.

## Setup
```bash
git checkout master
git pull
git checkout -b Priti
```

## Prompt 1 — Mock API + API client
```
Create frontend/src/mock/mockApi.js exposing async functions that simulate API
calls (with a small artificial delay) reading from Janhvi's mock data files,
e.g. getWorkers(filters), getWorkerById(id), createBooking(data),
getBookingsByUser(id). Then create frontend/src/services/apiClient.js as a thin
wrapper that currently calls mockApi.js functions, structured so swapping to
real fetch() calls to the FastAPI backend later requires no change to callers.
```
**Commit:** `feat(services): add mock API and API client abstraction layer`

## Prompt 2 — Per-domain API service files
```
Inside frontend/src/services/api, create authApi.js, userApi.js, workerApi.js,
serviceApi.js, bookingApi.js, emergencyApi.js, matchingApi.js, ratingApi.js,
paymentApi.js, invoiceApi.js, notificationApi.js, complaintApi.js,
analyticsApi.js, forecastApi.js. Each file exports functions that call
apiClient.js — this is the layer React hooks call, never mock data directly.
```
**Commit:** `feat(services): add per-domain API service files`

## Prompt 3 — Worker-specific components
```
Inside frontend/src/components/cards and components/forms, create
WorkerCard.jsx (photo placeholder, name, skill tags, rating, distance) and
BookingRequestCard.jsx (incoming job request with accept/reject buttons). Also
create a reusable SkillTagInput.jsx form component. Reuse Janhvi's Button/Card/
Badge from components/ui.
```
**Commit:** `feat(components): add worker card and booking request card components`

## Prompt 4 — Worker layout + profile/availability
```
Create frontend/src/layouts/WorkerLayout.jsx (sidebar: Dashboard, My Profile,
Bookings, Earnings, Ratings, Availability; header with availability toggle).
Then create frontend/src/dashboards/worker/Profile.jsx (edit info, skills via
SkillTagInput, certification upload placeholder) and Availability.jsx
(calendar/time-slot toggle UI).
```
**Commit:** `feat(worker): add worker layout, profile, and availability pages`

## Prompt 5 — Bookings, earnings, ratings pages
```
Create frontend/src/dashboards/worker/Bookings.jsx (tabs: New Requests,
Upcoming, Completed — use BookingRequestCard and workerApi.js/bookingApi.js to
fetch data), Earnings.jsx (summary table of completed jobs/amounts), and
Ratings.jsx (average rating, distribution, recent feedback). Wire these through
the hooks (create hooks/useBookings.js, hooks/useWorkers.js if not already
present) rather than calling the API services directly from the component.
```
**Commit:** `feat(worker): add bookings, earnings, and ratings pages wired to API layer`

## Final step
```bash
git push origin Priti
```
Open a PR into `master` titled "API service layer + worker dashboard".
