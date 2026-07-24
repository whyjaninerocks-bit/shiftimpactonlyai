# Tasks & Sprints

## Sprint 1 — Foundation + Core Engine
- Create `campaigns` + `campaign_data_preferences` tables with seed data
- Build `lib/types.ts` — `DataMode`, `DataPreferences`, `SignalConfig` types
- Build `lib/data.ts` — `getDataPreferences()` getter + `upsertDataPreferences()` setter
- Confidence weight constants + `calculateAdjustedScore()` utility
- **DoD**: Table exists, types compile, getter returns seeded row, score math returns correct value.

## Sprint 2 — API Routes
- `GET /api/data-preferences?campaign_id=` — returns preferences or empty
- `POST /api/data-preferences` — upsert with validation (mode constraints, direction/pct for indexed)
- Error handling: 400 for invalid mode, 404 for missing campaign
- **DoD**: GET returns seeded data; POST upserts and GET reflects change; invalid mode returns 400.

## Sprint 3 — Data Source Setup UI (v1 functional milestone)
- Campaign page layout with Data Source Setup as 2nd section
- Per-signal row: name + description + mode dropdown + dynamic sub-panel
- Confirmed sub-panel: source link input
- Indexed sub-panel: direction dropdown (Higher/Same/Lower) + % input
- Proxied sub-panel: read-only public source display
- Media Spend: dropdown limited to confirmed/indexed
- Review Platform / AI Brand Visibility / Social Currency: locked to proxied, dropdown disabled
- Save button calls POST; re-fetches on success
- Confidence badge per signal row
- **DoD**: Strategy lead switches SOV to Indexed, enters Higher ~12%, saves, sees badge + adjusted score. Refresh preserves state. Empty/loading/error states handled.

## Sprint 4 — Polish + Adjusted Score Display
- Campaign health score shows raw + adjusted with confidence note
- Visual mode indicators (checkmark/up-down/proxy icons)
- Empty state: no preferences yet → prompt to set up
- Loading skeleton for preferences fetch
- Error state: API failure → retry button
- **DoD**: All five UI states (loading, empty, partial, error, ready) work. Adjusted score visible and labeled.

## Sprint 5 — Lock It Down (auth + RLS)
- Add Supabase auth (signup/login)
- Replace permissive RLS with `auth.uid() = user_id` policies
- Set `user_id` on create
- Gate campaign creation behind login; existing demo rows visible read-only
- **DoD**: New user signs up, creates campaign, sets preferences, refreshes — data persists and is isolated from other users.

## Gantt
```
S1: Foundation        ████
S2: API Routes        ████
S3: Setup UI (v1)     ██████
S4: Polish            ████
S5: Lock Down         ████
```
**v1 functional**: end of Sprint 3 — success scenario usable without login.