# ShiftImpact OS — Proxy Mode: Data Source Configuration

## Problem
Clients frequently refuse to share proprietary data (media spend, exact SOV, attribution outputs, platform analytics). The OS either breaks or returns misleading scores when data is missing. This creates a binary — full access or no intelligence — which is the #1 onboarding barrier.

## Target User
Strategy lead configuring a campaign at setup, with client input on what data they can share. The strategy lead sets a data source mode per signal; the client provides what they can.

## Core Objects
- **Campaign** — name, client, status.
- **CampaignDataPreferences** — per-signal data source mode (Confirmed / Indexed / Proxied) plus indexed direction/pct inputs. One row per campaign.

## MVP (v1) Checklist
- [ ] Campaign list page (seeded, no login required)
- [ ] Campaign detail page with Campaign Info section
- [ ] Data Source Configuration section as second panel: 11 signal rows
- [ ] Mode dropdown per signal (Confirmed / Indexed / Proxied); Media Spend excludes Proxied; 3 signals fixed Proxied
- [ ] Dynamic sub-panel: Confirmed = source link; Indexed = direction + %; Proxied = read-only source name
- [ ] Confidence weight displayed per signal (100% / 85% / 70%)
- [ ] `GET /api/data-preferences?campaign_id=` returns preferences
- [ ] `POST /api/data-preferences` upserts and persists
- [ ] Changes survive reload (server-derived truth)
- [ ] Empty state: new campaign defaults to all-confirmed
- [ ] `lib/types.ts` — `DataMode`, `DataPreferences` types
- [ ] `lib/data.ts` — `getDataPreferences()` getter

## Non-Goals (v1)
- Computing/saving adjusted health scores (signal API route integration)
- Auto-fetching proxied data (Google Trends, Meta Ad Library)
- Confidence badges on module headers across the full app
- Authentication / per-user isolation

## Success Criteria
A strategy lead opens a campaign, switches SOV from Confirmed to Proxied, sees the confidence weight change to 70%, saves, reloads the page — the preference persists and the 70% label is still there.