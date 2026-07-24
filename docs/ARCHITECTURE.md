# Architecture

## Stack
- **Frontend:** Next.js 14 App Router, React, TypeScript, Tailwind
- **Backend:** Next.js API routes (GET/POST `/api/data-preferences`)
- **Database:** Supabase (Postgres)
- **Hosting:** Vercel

## What to Build Now
- Campaigns table + seed data, signals catalog table, campaign_data_preferences table
- Campaign list page (homepage) rendering seeded campaigns
- Campaign detail page with Data Source Configuration section
- Mode dropdowns + dynamic sub-panels per signal
- GET/POST data-preferences API (upsert)
- Confidence multiplier display

## What to Build Later
- Auth + per-user RLS owner policies
- Auto-fetching proxied data (Meta Ad Library, Google Trends, benchmarks)
- Downstream signal API route updates for multiplier
- FRAME Brief generation

## Key User Action Flow
1. Visitor opens campaign page → page loads signal catalog + saved preferences via GET
2. Each signal row shows current mode (or default Proxied if no saved preference)
3. User selects a mode → sub-panel renders (Confirmed link field, Indexed direction+pct, Proxied source label)
4. User clicks Save → POST upserts `campaign_data_preferences` row
5. Page reloads → GET returns saved state → UI reflects persisted modes and adjusted scores

## Layer Plan
1. **Data:** Tables + constraints + seed rows — the app renders from DB, not mock data
2. **App logic:** API routes for CRUD, mode-to-multiplier mapping, sub-panel rendering rules
3. **Smart features (later):** Auto-fetch proxied sources, confidence badge propagation to scoring modules

## Why the Core Runs Without AI
The mode selection, sub-panel rendering, multiplier calculation, and persistence are pure deterministic logic. No AI is needed for v1 — a strategy lead manually selects modes and the system stores and scores them. AI auto-fetching is a later enhancement.