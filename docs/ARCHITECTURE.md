# Architecture

## Stack
Next.js (App Router) · Supabase (Postgres + RLS) · Vercel deploy.

## Build Now vs Later
- **Now**: data preferences table, CRUD API, setup UI, confidence badge + adjusted score, demo seed.
- **Later**: signal API routes apply multiplier; auto-fetch proxied data (Meta Ad Library, Google Trends, etc.); confidence badges across all module headers; per-user auth + RLS.

## Key User Action Flow
1. Strategy lead opens campaign page.
2. Data Source Setup section loads preferences via `GET /api/data-preferences?campaign_id=`.
3. Lead changes a signal's mode in dropdown.
4. Sub-panel renders for that mode (link / direction+% / read-only source).
5. Lead clicks Save → `POST /api/data-preferences` (upsert).
6. UI re-reads, updates confidence badge + adjusted score.

## Layer Plan
- **Data first**: `campaign_data_preferences` table with mode per signal, indexed direction/pct, constraints.
- **App logic**: API routes for get/upsert; React UI with dynamic sub-panels; confidence weight math (`confirmed=1.0, indexed=0.85, proxied=0.70`).
- **Smart features (later)**: auto-fetch proxied data from public APIs; AI-assisted mode suggestion based on available data.

## Why Core Works Without AI
All mode selection, confidence weighting, and display are deterministic table reads + simple math. No LLM calls needed. The AI layer (later) only suggests modes or auto-fills proxied sources — the system runs fully without it.