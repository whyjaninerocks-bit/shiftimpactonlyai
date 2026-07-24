# Intelligence Layer

## Messy Inputs
- Client provides directional estimates in plain language ("SOV is up maybe 15%")
- Strategy lead translates to structured Indexed mode: direction=up, pct=15
- Later: natural language input auto-parsed to mode/direction/pct

## Auto-Structure Schema (v2 input parsing)
```json
{
  "signal": "sov",
  "parsed_mode": "indexed",
  "direction": "up",
  "pct": 15,
  "confidence": 0.92,
  "review_status": "unreviewed"
}
```

## Events to Track
- `preference_saved` — campaign_id, signal key, mode, timestamp
- `mode_changed` — campaign_id, signal key, old_mode, new_mode
- `confidence_calculated` — campaign_id, signal key, raw_score, multiplier, adjusted_score

## Scoring Rules (v1 — rule-based, no AI)
- Confirmed → multiplier 1.00
- Indexed → multiplier 0.85
- Proxied → multiplier 0.70
- `adjustedScore = rawScore × multiplier`
- Signals with no saved preference default to Proxied (0.70)
- Media Spend: indexed-only minimum (cannot be fully proxied)
- Review Platform, AI Brand Visibility, Social Currency: always Proxied (auto-set, not user-configurable)

## What Gets Ranked
- Per-signal adjusted confidence score
- Campaign-level aggregate confidence (average of all signal multipliers) — display only in v1

## v1 vs Later
- **v1:** Manual mode selection, deterministic multiplier, display-only scores
- **Later:** AI-parse client text to structured modes, auto-fetch proxied data, propagate multipliers to downstream scoring modules, confidence badge in module headers