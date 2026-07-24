# Architecture

## Stack
Next.js (App Router) + Supabase (Postgres) + Vercel.

## What to Build Now (v1)
- `campaigns` and `campaign_data_preferences` tables with seed data
- Campaign list page + campaign detail page (Campaign Info + Data Source Configuration)
- Per-signal mode dropdowns with dynamic sub-panels
- API routes: `GET/POST /api/data-preferences`
- Confidence weight display per signal row
- All viewable without login (demo-first)

## What to Build Next
- Confidence badges on each signal module header across the app
- Apply confidence multiplier in signal API routes (raw → adjusted score)
- Store both raw and adjusted scores

## What to Build Later
- Auto-fetch proxied data (Google Trends, Meta Ad Library, category benchmarks)
- Auth + per-user RLS owner policies
- Mode-based recommendations (suggest Indexed for clients with partial data)

## Key User Action Flow
1. Strategy lead opens campaign detail page
2. Data Source Configuration section renders (second panel, after Campaign Info)
3. Each signal row shows current mode + confidence weight
4. Lead clicks mode dropdown, selects Confirmed / Indexed / Proxied
5. Dynamic sub-panel appears: Confirmed → source link; Indexed → direction (Higher/Same/Lower) + % input; Proxied → read-only public source name
6. Lead clicks Save → `POST /api/data-preferences` upserts to `campaign_data_preferences`
7. Page reloads, preferences persist from server (never localStorage)

## Layer Plan
1. **Data** — tables, constraints, seed rows (truth lives in Postgres)
2. **App logic** — API routes, types, getter, UI components with mode dropdowns
3. **Smart features** — confidence multiplier on scores, auto-fetch proxied data, mode recommendations

## Why the Core Runs Without AI
Mode configuration is pure data entry: pick a mode per signal, store it, display the weight. No AI computation needed for v1. The confidence weight is a deterministic lookup (1.0 / 0.85 / 0.70). AI enters later when scores are computed and proxied data is fetched.