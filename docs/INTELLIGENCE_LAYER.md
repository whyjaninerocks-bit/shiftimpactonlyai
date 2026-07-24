# Intelligence Layer

## Messy Inputs
- Client provides vague directional info: "SOV is up a bit" → parsed to `direction=higher, pct=~5`.
- Confirmed data link could be a spreadsheet URL, dashboard screenshot, or agency email.
- Mode choice may be inconsistent across signals (some confirmed, some proxied).

## Auto-Structure Schema
```json
{
  "signal": "sov",
  "mode": "indexed",
  "direction": "higher",
  "pct": 12,
  "confidence_weight": 0.85,
  "source": null,
  "review_status": "unreviewed"
}
```

## Events to Track
- `mode_changed` — signal, old_mode, new_mode, actor
- `preference_saved` — campaign_id, signals_changed[]
- `score_recalculated` — campaign_id, raw_score, adjusted_score, dominant_mode

## Scoring Rules (v1, rule-based)
- `confirmed` → multiplier 1.0
- `indexed` → multiplier 0.85
- `proxied` → multiplier 0.70
- `adjustedScore = Math.round(rawScore × modeWeight)`
- Per-signal mode-weighted; campaign-level score = weighted average of signal scores.
- Both raw + adjusted stored.

## What Gets Ranked
- Campaign health score adjusted for data confidence.
- Signal-level confidence breakdown on campaign page.

## v1 vs Later
- **v1**: manual mode selection, deterministic scoring, no AI.
- **Later**: AI suggests mode based on data availability; auto-fetches proxied data from Meta Ad Library, Google Trends, review APIs; flags low-confidence campaigns.