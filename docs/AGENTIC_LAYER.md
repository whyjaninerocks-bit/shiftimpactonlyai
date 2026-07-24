# Agentic Layer

## v1: No Agentic Actions
All mode selection is manual — the strategy lead decides per signal with client input. No automated actions in v1.

## Draftable Actions (Later — Low Risk: auto)
- **Suggest default modes** from client intake notes or campaign type → draft mode assignment, strategy lead reviews and accepts/edits.
- **Tag signals as data-gap risks** when >50% of signals are proxied → auto-flag in setup notes.

## Executable After Approval (Later — Medium Risk: light approval)
- **Auto-fetch proxied data** for a signal (Google Trends, Meta Ad Library, category benchmarks) → populate proxied value, set `review_status = 'unreviewed'`, strategy lead confirms before it feeds into scores.
- **Apply confidence multiplier** to signal scores → draft adjusted score, lead approves before publishing.

## Human-Only Actions (High Risk: always human)
- **Final mode selection** — the strategy lead must choose each signal's mode. This is a client-facing decision with commercial implications. Never auto-set.
- **Publishing confidence-weighted scores to client** — human must review before client sees adjusted scores.

## Named Tools (Later)
- `google_trends_fetch` — fetch search volume index for branded search proxied mode
- `meta_ad_library_fetch` — fetch active ad count for SOV proxied estimate
- `category_benchmark_lookup` — fetch save rate / VCR / retention benchmarks

## Audit Log Fields (for later implementation)
`action`, `actor_user_id`, `campaign_id`, `signal_name`, `old_mode`, `new_mode`, `timestamp`, `approved_by`

## v1 vs Later
- **v1**: Zero agentic actions — pure manual configuration.
- **Later**: Mode suggestions (low risk), proxied data auto-fetch (medium), score adjustment (medium), all logged.