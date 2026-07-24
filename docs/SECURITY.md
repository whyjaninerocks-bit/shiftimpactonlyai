# Security

## Secret Handling
- Supabase connection string in server-side env only (SUPABASE_URL, SUPABASE_ANON_KEY)
- Never expose service role key to frontend
- API routes use anon key with RLS for v1 (permissive), service role only in backend migrations

## Permission Model
- **v1 (demo-first):** Permissive RLS — all tables readable/writable without login. Seeded demo rows render for anonymous visitors.
- **Lock-down sprint:** Replace v1 policies with owner-scoped: `auth.uid() = user_id` on all tables. Campaigns and preferences only visible/editable by their owner.
- Agent (when added) inherits the logged-in user's permissions via RLS — never elevated.

## Approved-Tools Rule
- v1 has no agent tools. When added, agents use named tools only (`fetch_meta_ad_library`, `fetch_google_trends`, `fetch_category_benchmark`).
- Never expose raw `run_any` or `send_any` capabilities.
- Each tool has a fixed input schema and returns structured data.

## Audit Principle
- v1: No audit logging (manual mode selection only).
- v2: Every preference save and every proxy data fetch logged with actor, action, campaign_id, signal_key, before/after values, tool used, timestamp.
- Deletes are human-only and always logged.

## Data Integrity
- `UNIQUE(campaign_id)` on campaign_data_preferences prevents duplicate configs
- signal_configs JSONB validated at app layer (mode must be confirmed/indexed/proxied; pct nullable unless mode=indexed)
- Media Spend enforces indexed-minimum at app layer (mode cannot be proxied)