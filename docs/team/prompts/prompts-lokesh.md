# Antigravity Prompts — Lokesh (branch: `Lokesh`)
### Backend track — Difficulty: HARD

> Place at: `docs/team/prompts/lokesh.md`
> Before Prompt 1, paste `docs/ANTIGRAVITY_CONTEXT.md` into Antigravity.
> Depends on Yash's models/schemas/repositories (branch `Yash`). If his PR isn't merged yet: `git fetch origin Yash && git merge origin/Yash`.
> This is the hardest track — the actual "smart" part of SevaSangam (fair AI matching + demand forecasting). Take it slow, one prompt at a time.

## Setup
```bash
git checkout master
git pull
git checkout -b Lokesh
```

## Prompt 1 — Core business services
```
Inside backend/app/services, create auth_service.py, worker_service.py,
booking_service.py, rating_service.py. These call the repositories built by Yash
and contain the actual business rules (e.g. booking_service.py handles status
transitions Pending -> Confirmed -> Completed, and rejects double-booking a
worker at the same time slot). No AI logic here yet — that's isolated in ai/.
```
**Commit:** `feat(backend): add core business logic services`

## Prompt 2 — AI matching skeleton
```
Inside backend/app/ai/matching, create scoring.py with a function
calculate_suitability_score(worker, customer_location, required_skill) that
combines: skill match (boolean/weight), distance (lower is better), rating
(higher is better), and current workload (lower is better = fairness), returning
a single numeric score. Create model.py with a rank_workers(workers, criteria)
function using scoring.py. Use plain Python/numpy for now — a real Scikit-learn
model can replace the scoring function later without changing the function
signature.
```
**Commit:** `feat(ai): add smart worker matching scoring skeleton`

## Prompt 3 — AI forecasting skeleton
```
Inside backend/app/ai/forecasting, create preprocessing.py (turns a list of past
bookings into a simple time-series structure by service category + location +
date), model.py (a placeholder Scikit-learn model, e.g. simple linear regression
or moving average, trainable on that structure), and predictor.py exposing a
predict_demand(service_category, location, date_range) function. Use dummy/mock
historical data if no real data exists yet.
```
**Commit:** `feat(ai): add demand forecasting skeleton`

## Prompt 4 — Wire matching and forecast services
```
Create backend/app/services/matching_service.py that ties together
worker_repository (to fetch candidate workers) and ai/matching (to rank them),
exposing find_best_workers(booking_request) for use by a future booking route.
Also create backend/app/services/forecast_service.py wiring
ai/forecasting/predictor.py similarly.
```
**Commit:** `feat(backend): wire matching and forecasting services together`

## Prompt 5 — Fairness check
```
Add a fairness safeguard to ai/matching/model.py: if the top-ranked worker has
received significantly more jobs than others with similar skill/rating in the
recent period, slightly boost underutilized workers' scores before finalizing
the ranked list. Document this logic clearly with comments since it's the core
differentiator of SevaSangam versus private gig platforms.
```
**Commit:** `feat(ai): add fair job distribution safeguard to matching algorithm`

## Final step
```bash
git push origin Lokesh
```
Open a PR into `master` titled "Backend services + AI matching/forecasting with fairness logic".
