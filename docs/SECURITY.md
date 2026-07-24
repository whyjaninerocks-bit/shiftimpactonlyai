# Security

## Secret Handling
- Supabase keys in env vars only (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).
- Service-role key server-side only; never imported in client components.
- No third-party API keys (Meta Ad Library, Google Trends) in v1.

## Permission Model
- **v1 (demo-first)**: permissive RLS — all reads/writes open; no login wall. Seeded demo rows render for anonymous visitors.
- **Lock-down sprint**: `auth.uid() = user_id` on `campaigns` and `campaign_data_preferences`. Only owner can read/write their campaigns.
- Agent (later) inherits the logged-in user's permissions — never runs as service-role for user actions.

## Approved-Tools Rule
- Agent may only call named tools (listed in Agentic Layer doc).
- No raw `run_any` / `send_any` / arbitrary SQL execution.
- Every agentic action logged to audit table.

## Audit Principle
- Every mode change, preference save, and score recalculation is logged with actor + timestamp + old/new values.
- Audit log survives refresh; stored in Postgres, not client state.

## Data Integrity
- `campaign_id` unique on `campaign_data_preferences` — one preferences row per campaign.
- Mode constraints enforced at DB level via CHECK constraints where possible; UI prevents invalid combos.
- Review Platform / AI Brand Visibility / Social Currency locked to `proxied` (default + UI disabled).