# Security

## Secret Handling
- Supabase service key and any third-party API keys (Google Trends, Meta Ad Library — later) live in server-side environment variables only.
- Never exposed to the frontend, never in client components, never in `NEXT_PUBLIC_*`.

## Permission Model
- **v1 (demo-first)**: RLS enabled with permissive policies — all reads/writes open. No authentication required. App renders for anonymous visitors with seed data.
- **Lock-down sprint**: Replace permissive policies with owner-scoped: `auth.uid() = user_id` on `campaigns` and `campaign_data_preferences`. Every query is scoped to the logged-in user's campaigns only.
- Agent (later) inherits the user's permissions — it can only read/write campaigns the user owns.

## Approved-Tools Rule
- v1: no external tools used.
- Later: only named, approved tools (`google_trends_fetch`, `meta_ad_library_fetch`, `category_benchmark_lookup`). Never raw `run_any` or `send_any`. Each tool has a defined input/output schema and is called through a controlled wrapper.

## Audit Principle
- Every preference save writes to `campaign_data_preferences` with `updated_at` timestamp.
- Later: every mode change and every proxied data fetch is logged to an audit table with actor, campaign, signal, old/new mode, and timestamp.
- Truth is server-derived: preferences are always read from Postgres, never from localStorage. A page refresh shows the same state on every device.