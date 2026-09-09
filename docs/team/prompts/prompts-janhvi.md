# Antigravity Prompts — Janhvi (branch: `Janhvi`)
### Frontend track

> Place at: `docs/team/prompts/janhvi.md`
> Before Prompt 1, paste `docs/ANTIGRAVITY_CONTEXT.md` into Antigravity.
> No dependencies — start immediately. Priti and Ashana build on top of your design system and mock data.

## Setup
```bash
git checkout master
git pull
git checkout -b Janhvi
```

## Prompt 1 — Tailwind theme & design tokens
```
Set up the Tailwind design system in frontend/tailwind.config.js. Define a
"Trust + Service + Technology + Community" theme:
- Primary: deep teal (#0F766E family) — trust, cooperation
- Secondary: warm saffron/amber (#F59E0B family) — service, energy
- Neutral background/greys for cards and dashboards
- Accent: soft blue for links/actions
Add font family (Inter or similar) via index.css. Do not build any pages yet —
only the theme config and base index.css.
```
**Commit:** `feat(design): add SevaSangam Tailwind theme and base typography`

## Prompt 2 — Core UI components
```
Inside frontend/src/components/ui and components/common, create reusable
components in JavaScript (no TypeScript): Button, Input, Card, Badge, Avatar,
Modal, Toast, Loading, EmptyState. Use the Tailwind theme from the previous
step. Keep them generic — Priti and Ashana will reuse these for worker and
admin dashboards too.
```
**Commit:** `feat(ui): add core reusable UI component library`

## Prompt 3 — Mock data files
```
Inside frontend/src/mock/data, create realistic placeholder JS data files:
users.js, customers.js, workers.js (name, skills, rating, distance,
availability, location lat/lng), services.js, skills.js, certifications.js,
bookings.js, ratings.js, payments.js, invoices.js, notifications.js,
complaints.js, welfare.js, analytics.js. Keep each file's data small (5-10
sample records) but structurally realistic.
```
**Commit:** `feat(mock): add placeholder mock data for all entities`

## Prompt 4 — Customer layout + navigation
```
Create frontend/src/layouts/CustomerLayout.jsx with a sidebar (Home, Services,
My Bookings, Emergency, Profile) and a top header with language selector
placeholder and profile menu. Use the UI components already created.
```
**Commit:** `feat(customer): add customer dashboard layout and sidebar`

## Prompt 5 — Customer dashboard pages
```
Inside frontend/src/dashboards/customer, create: Home.jsx (browse service
categories as cards), Services.jsx (search + filter services), WorkerProfile.jsx
(worker detail view with skills/ratings), BookingHistory.jsx, and a multi-step
BookingFlow.jsx (select service -> select worker -> select date/time ->
confirm). Use the mock data from mock/data directly for now — Priti's API
service layer will replace these direct calls later.
```
**Commit:** `feat(customer): add customer dashboard pages and booking flow`

## Final step
```bash
git push origin Janhvi
```
Open a PR into `master` titled "Design system + mock data + customer dashboard".
