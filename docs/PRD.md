# ShiftImpact Data Source Configuration

## Problem
Strategy leads run campaign scoring modules that require proprietary client data (media spend, SOV, attribution). Clients often withhold this data, blocking onboarding and producing misleading scores when modules run on assumptions.

## Target User
Strategy lead who configures campaigns with client input. They decide, per signal, whether the client has confirmed data, can provide directional estimates, or needs public-source proxies.

## Core Objects
- **Campaign** — a client engagement with a name, client, brand, and status.
- **Signal** — catalog entry (SOV, Save Rate, Share Rate, Branded Search, VCR, Retention, Attribution, Media Spend, Review Platform, AI Brand Visibility, Social Currency) with description, allowed modes, and proxy source.
- **Campaign Data Preferences** — per-campaign configuration: each signal's mode (Confirmed / Indexed / Proxied), plus indexed direction + approximate %, and setup notes. One row per campaign.

## MVP (v1)
- [ ] Campaigns render from seed data on the homepage (no login wall)
- [ ] Campaign page shows Campaign Info, then Data Source Configuration, then placeholder for Brief
- [ ] Per-signal rows with mode dropdown and dynamic sub-panels (Confirmed link, Indexed direction+pct, Proxied read-only source)
- [ ] GET / POST endpoints upsert preferences to DB
- [ ] Confidence multiplier applied: Confirmed 1.0, Indexed 0.85, Proxied 0.70 — adjusted score visible per signal
- [ ] Mode badge per signal (✓Conf, ↕Index, ◎Prox)
- [ ] Saving preferences persists to DB and UI reflects saved state on reload

## Non-goals (v1)
- Auto-fetching proxied data from public sources
- Updating downstream signal API routes for multiplier propagation
- Multi-user auth and per-user data isolation (later sprint)
- FRAME Brief generation

## Success Criteria
A visitor opens the campaign page without logging in, sees 11 signal rows pre-populated from saved preferences, changes SOV from Confirmed to Indexed, selects "Higher" + 15%, saves, reloads the page, and sees the saved Indexed mode with 15% and the adjusted confidence multiplier of 85% displayed.