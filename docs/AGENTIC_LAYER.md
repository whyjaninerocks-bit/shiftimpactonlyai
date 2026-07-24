# Agentic Layer

## Draftable Actions (low risk — auto)
- Tag a signal config as 'needs review' if mode is Proxied and proxy source is unavailable
- Summarize campaign confidence profile (aggregate multiplier across all signals)
- Draft setup_notes suggestion based on selected modes

## Executable After Approval (medium risk — light approval)
- Auto-fetch proxied data from public sources (Meta Ad Library, Google Trends) and populate signal value + source + confidence (v2)
- Update downstream signal API routes with multiplier (v2)

## Human-Only Actions (critical risk)
- Delete campaign or preferences
- Override a signal's mode after client sign-off
- Change multiplier values (1.0/0.85/0.70) — these are system constants

## Named Tools
- `fetch_meta_ad_library` — query Meta Ad Library for SOV proxy data (v2)
- `fetch_google_trends` — query Google Trends for branded search proxy (v2)
- `fetch_category_benchmark` — retrieve category benchmark for proxy signals (v2)
- `upsert_data_preferences` — write to campaign_data_preferences (used by API, not exposed as agent tool in v1)

## Audit Log Fields (v2)
- `action`, `actor_id`, `campaign_id`, `signal_key`, `old_value`, `new_value`, `tool_used`, `timestamp`

## v1 vs Later
- **v1:** No agentic actions. All mode selection is manual. No auto-fetching.
- **Later:** Named tools for proxy data fetching, auto-structured inputs, audit logging