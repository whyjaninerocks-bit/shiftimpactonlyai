# Tasks

## Sprint 1 — Foundation & Core Engine
**Goal:** DB tables, seed data, campaign page rendering data source config UI end-to-end.
- [ ] Migration: create campaigns, signals, campaign_data_preferences tables with RLS
- [ ] Seed 4 campaigns, 11 signals (catalog), 3 preference rows
- [ ] `lib/types.ts` — add `DataMode` ('confirmed'|'indexed'|'proxied'), `SignalConfig`, `DataPreferences`
- [ ] `lib/data.ts` — add `getDataPreferences(campaignId)`, `getSignals()`, `getCampaigns()`
- [ ] Campaign list page (homepage) — renders seeded campaigns, no login wall
- [ ] Campaign detail page — Campaign Info section + Data Source Configuration section
- [ ] `DataSourceSetupSection.tsx` — 11 signal rows, mode dropdown, dynamic sub-panels:
  - Confirmed: link-to-source text input
  - Indexed: direction dropdown (Higher/Up, Same/Flat, Lower/Down) + approximate % input
  - Proxied: read-only proxy source name from signals catalog
  - Review Platform / AI Brand Visibility / Social Currency: locked to Proxied, not user-configurable
  - Media Spend: Proxied option disabled (indexed minimum)
- [ ] Mode badge per signal (✓Conf, ↕Index, ◎Prox with %)
- [ ] GET `/api/data-preferences?campaign_id=` — returns saved preferences or defaults
- [ ] POST `/api/data-preferences` — upserts preferences row
- [ ] Save button persists to DB, reload reflects saved state
- [ ] Confidence multiplier display: adjustedScore = rawScore × multiplier (use placeholder rawScore=100 for v1)
- [ ] Handle loading (skeleton rows), empty (no saved prefs → all default Proxied), error (retry button)

**Definition of Done:** Visitor opens campaign page without login, changes SOV to Indexed (Higher, 15%), saves, reloads, sees saved mode + 85% multiplier. No dead buttons.

→ **v1 functional milestone**

## Sprint 2 — Confidence Scoring Refinement
**Goal:** Campaign-level aggregate confidence + UI polish.
- [ ] Campaign-level aggregate confidence score (avg of all signal multipliers)
- [ ] Visual indicator when aggregate < 0.80 (amber warning)
- [ ] Signal reordering by confidence (lowest first toggle)
- [ ] Setup notes textarea saved to DB
- [ ] Export preferences as JSON (download button)

**Definition of Done:** Campaign page shows aggregate confidence score; toggling sort reorders signals; notes persist on reload.

## Sprint 3 — Lock It Down
**Goal:** Auth + per-user RLS owner policies.
- [ ] Supabase Auth (email/password + magic link)
- [ ] Login/signup pages
- [ ] Replace v1 permissive RLS with owner-scoped policies (`auth.uid() = user_id`)
- [ ] user_id populated on insert from session
- [ ] Campaign list scoped to current user
- [ ] Redirect unauthenticated users to /login (homepage no longer public)

**Definition of Done:** New user signs up, creates a campaign, sets preferences, logs out, cannot see another user's campaigns.

## Sprint 4 — Auto-Fetch Proxied Data
**Goal:** Named tools fetch public-source proxy data.
- [ ] `fetch_google_trends` tool for branded search
- [ ] `fetch_meta_ad_library` tool for SOV
- [ ] `fetch_category_benchmark` tool for save_rate, share_rate, vcr, retention
- [ ] Store proxied value + source + confidence + review_status
- [ ] Proxied sub-panel shows fetched value (read-only) with 'last fetched' timestamp
- [ ] Audit log table + logging on each fetch

**Definition of Done:** Proxied signals show auto-fetched data with source attribution; review_status defaults to 'unreviewed'.

## Text Gantt
```
Sprint 1: [DB][UI][API][Core Engine]  ← v1 functional
Sprint 2: [Confidence][Polish]
Sprint 3: [Auth][RLS]
Sprint 4: [Auto-Fetch][Audit]
```