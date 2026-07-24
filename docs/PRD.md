# ShiftImpact OS — Proxy Mode

## Problem
Clients decline proprietary data (media spend, SOV, attribution, platform analytics). The OS breaks or misleads when confirmed data is absent. Binary data access is the #1 onboarding barrier.

## Target User
- **Strategy lead**: selects each signal's data mode at campaign setup; modifies later.
- **Client**: provides directional input when a signal is Indexed.

## Core Objects
- **Campaign** — the account/campaign being scored.
- **Campaign Data Preferences** — per-signal mode assignment (one row per campaign).
- **Data Mode** — enum: `confirmed` (100% weight), `indexed` (85%), `proxied` (70%).
- **Signal** — 11 tracked signals (SOV, Save Rate, Share Rate, Branded Search, VCR, Retention, Attribution, Media Spend, Review Platform, AI Brand Visibility, Social Currency).
- **Confidence Score** — `rawScore × modeWeight`, rounded; both stored.

## MVP (v1) Checklist
- [ ] Campaign page with Data Source Setup section (2nd, after Campaign Info)
- [ ] Per-signal mode dropdown (Confirmed / Indexed / Proxied)
- [ ] Dynamic sub-panels: Confirmed→link field; Indexed→direction + %; Proxied→read-only source
- [ ] Mode constraints: Media Spend (confirmed/indexed only); Review Platform/AI Brand Visibility/Social Currency (always proxied, locked)
- [ ] GET + POST (upsert) `/api/data-preferences?campaign_id=`
- [ ] Confidence badge per signal (`✓ Confirmed`, `↕ Indexed`, `◎ Proxied (70%)`)
- [ ] Adjusted score display with confidence note
- [ ] Demo seed data rendering without login

## Non-Goals (v1)
- Updating signal API routes for confidence multiplier (Sprint 32)
- Auto-fetching proxied data from public sources
- Confidence badges on existing module headers across the app
- Login / per-user isolation

## Success Scenario
A strategy lead opens a campaign, switches SOV from Confirmed to Indexed, enters "Higher, ~12%", saves, and sees the SOV module badge change to `↕ Indexed` with the adjusted score reflecting the 0.85 multiplier. Refreshing preserves the state.