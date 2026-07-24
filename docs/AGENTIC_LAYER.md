# Agentic Layer

## Draftable Actions (low risk — auto)
- Pre-fill Indexed direction/pct from prior period comparison.
- Suggest mode for a signal based on whether a confirmed source link exists.
- Draft `setup_notes` summarizing mode selections.

## Executable-After-Approval Actions (medium risk — light approval)
- Update a signal's mode from confirmed→indexed or indexed→proxied.
- Recalculate campaign health score after mode change.
- Fetch proxied data from public API and populate signal value (later).

## Human-Only Actions (high/critical risk)
- Delete a campaign's data preferences.
- Change Media Spend to a mode outside confirmed/indexed (impossible by constraint).
- Send client-facing report with adjusted scores (requires human review of confidence labels).

## Named Tools
- `get_data_preferences(campaign_id)`
- `upsert_data_preferences(campaign_id, fields)`
- `calculate_adjusted_score(raw_score, mode)`
- `fetch_proxied_sov(campaign_id)` (later)
- `fetch_google_trends(keyword)` (later)

## Audit Log Fields
`action, actor, campaign_id, signal, old_value, new_value, timestamp`

## v1 vs Later
- **v1**: no agentic actions; all manual.
- **Later**: mode suggestion + auto-fetch proxied data (medium risk, light approval).