# Intelligence Layer

## Messy Input
A client says: "We can share SOV directionally but not exact figures, we can't share media spend details, and we have no retention data." This is unstructured availability info the strategy lead translates into mode assignments.

## Auto-Structure (v2+)
Future: parse client intake notes → suggest mode per signal.

```json
{
  "campaign_id": "uuid",
  "suggested_modes": {
    "sov": "indexed",
    "save_rate": "confirmed",
    "media_spend": "indexed",
    "retention": "proxied"
  },
  "reasoning": "Client mentioned directional SOV, confirmed platform access, spend restrictions, no retention data."
}
```

## Events to Track
- `data_mode_changed` — signal, old_mode, new_mode, campaign_id, user
- `preferences_saved` — campaign_id, modes_snapshot, timestamp
- `confidence_viewed` — campaign_id, signal, mode (for tracking which signals are most often proxied)

## Scoring Rules (deterministic — no AI needed)

| Mode | Multiplier |
|---|---|
| Confirmed | 1.0 |
| Indexed | 0.85 |
| Proxied | 0.70 |

`adjustedScore = Math.round(rawScore * multiplier)` — applied per signal module.

## What Gets Ranked
- v1: nothing ranked — just displaying mode + weight per signal.
- Later: campaigns ranked by overall confidence (avg of signal multipliers). Signals ranked by most-proxied to highlight data gaps.

## v1 vs Later
- **v1**: Display mode + confidence weight. No score computation.
- **Later**: Apply multiplier in signal API routes. Store raw + adjusted. Auto-suggest modes from intake notes. Rank campaigns by confidence level.