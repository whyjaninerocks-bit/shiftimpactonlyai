# Tasks & Sprints

## Sprint 1 — Database & Campaign Shell
**Goal**: Tables exist, seeded, campaign pages render without login.
- [ ] Migration: create `campaigns` + `campaign_data_preferences` tables with constraints
- [ ] RLS enabled, permissive v1 policies on both tables
- [ ] Seed 3 campaigns with varied preference configurations (all-confirmed, mixed, heavy-proxied)
- [ ] Campaign list page: shows 3 seeded campaigns, links to detail
- [ ] Campaign detail page: Campaign Info section (name, client, status) — read from server
- [ ] `lib/types.ts`: `DataMode`, `DataPreferences` types
- [ ] `lib/data.ts`: `getDataPreferences()` getter + `getCampaigns()`

**Definition of Done**: Open the app without logging in, see 3 campaigns, click one, see Campaign Info rendered from the database.

---

## Sprint 2 — Data Source Configuration (Core Engine) — **v1 FUNCTIONAL**
**Goal**: Strategy lead can set modes per signal and save.
- [ ] `DataSourceSetupSection.tsx`: 11 signal rows (8 configurable + 3 fixed-proxied)
- [ ] Mode dropdown per configurable signal (Confirmed / Indexed / Proxied); Media Spend dropdown excludes Proxied
- [ ] Dynamic sub-panel per mode:
  - Confirmed: source link text (e.g. "Platform analytics / agency report")
  - Indexed: direction dropdown (Higher / Same / Lower) + % input where applicable
  - Proxied: read-only public source name (e.g. "Meta Ad Library + social listening")
- [ ] 3 always-proxied signals render as fixed rows with locked Proxied badge + source name
- [ ] Confidence weight displayed per signal (✓ 100% / ↕ 85% / ◎ 70%)
- [ ] `GET /api/data-preferences?campaign_id=` route
- [ ] `POST /api/data-preferences` upsert route
- [ ] Wire as second section on campaign detail page (after Campaign Info)
- [ ] Save button calls POST, persists to DB, UI reflects change
- [ ] Setup notes textarea

**Definition of Done**: Open a campaign, switch SOV to Proxied, see 70% weight, click Save, reload page — preference persists.

---

## Sprint 3 — States, Polish & Confidence Display
**Goal**: Handle empty/error/loading; confidence display is clear.
- [ ] Empty state: new campaign (no preferences row) → all signals default to Confirmed, "Save" creates the row
- [ ] Loading state: skeleton rows while fetching preferences
- [ ] Error state: inline error message + retry if API fails
- [ ] Mode badge component: `✓ Confirmed`, `↕ Indexed`, `◎ Proxied (70%)`
- [ ] Summary bar: campaign-level average confidence weight across all signals
- [ ] Unsaved changes indicator (dot on Save button when form is dirty)
- [ ] Mobile-responsive layout

**Definition of Done**: New campaign shows all-confirmed defaults; network error shows inline retry; dirty state is visible; reload always shows server truth.

---

## Sprint 4 — Lock It Down
**Goal**: Auth + per-user data isolation.
- [ ] Add Supabase auth (signup/login)
- [ ] Replace permissive RLS with `auth.uid() = user_id` on both tables
- [ ] Campaigns scoped to logged-in user only
- [ ] Seed data re-scoped or marked as demo
- [ ] Redirect unauthenticated users to login (app no longer public)

**Definition of Done**: Logged-in user sees only their campaigns; anonymous access is blocked; existing preferences are preserved.

---

## Later Sprints
- Sprint 5: Apply confidence multiplier in signal API routes; store raw + adjusted scores
- Sprint 6: Auto-fetch proxied data (Google Trends, Meta Ad Library, category benchmarks)
- Sprint 7: Mode suggestions from client intake notes; audit log table

---

## Gantt

| Sprint | Focus |
|---|---|
| 1 | DB + Campaign Shell |
| 2 | Data Source Config UI + API (**v1 functional**) |
| 3 | States, Polish & Confidence Display |
| 4 | Lock It Down (auth + RLS) |
| 5+ | Score integration, auto-fetch, suggestions, audit |