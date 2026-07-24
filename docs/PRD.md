# ShiftImpact OS - PRD Addendum v3.0 - Proxy Mode.md

# ShiftImpact OS — PRD Addendum v3.0
## Feature 34: Proxy Mode — Data Source Configuration
**Sprint 31 · 20 July 2026**

---

## Problem

Clients frequently decline to share proprietary data — media spend, exact SOV figures, attribution outputs, platform analytics. The OS currently assumes confirmed data for all inputs. Without data, modules either break or return misleading scores.

This creates a binary situation: full access or no intelligence. That binary is the primary barrier to onboarding.

---

## Solution: Three-Mode Data Source Architecture

Every signal and data input in ShiftImpact OS is assigned one of three data source modes, chosen at campaign setup by the strategy lead with client input:

| Mode | Label | What it means | Confidence weight |
|---|---|---|---|
| **Confirmed** | ✓ Confirmed | Client provides actual data | 100% |
| **Indexed** | ↕ Indexed | Client provides directional signals (Up / Flat / Down + ~%) | 85% |
| **Proxied** | ◎ Proxied | OS derives from public sources | 70% |

The confidence weight is applied as a modifier to the health score of that signal module. A score derived from proxied data is surfaced with a label so the strategy lead always knows what confidence level the intelligence carries.

---

## Signals and their Proxy Source Mapping

| Signal / Module | Confirmed Source | Indexed Input | Proxied Source |
|---|---|---|---|
| Signal 1 — SOV | Platform analytics / agency report | Higher / Same / Lower vs last week + ~% | Meta Ad Library + social listening estimate |
| Signal 2 — Save Rate | Platform analytics (Meta/TikTok) | Save rate trending up / flat / down | Public benchmark for category |
| Signal 2B — Share Rate | Platform analytics | Share rate vs prior period | Category benchmark |
| Signal 3 — Branded Search | Google Search Console / Google Ads | Search volume directional vs last month | Google Trends index |
| Signal 3B — VCR | Platform analytics | VCR above / below campaign average | Published category benchmark |
| Signal 4 — Retention | App analytics (AppsFlyer / Adjust) | D7/D30 retention above / below prior campaign | Published app category benchmark |
| Attribution | AppsFlyer / platform conversion tracking / baseline delta | Conversions tracking up / flat / down | Baseline delta method (Scenario C) |
| Media Spend | Agency report | Spend this week above / below / same as plan | Not proxied — indexed minimum |
| Review Platform | Google Reviews + TripAdvisor (public) | N/A — always public | Auto — always proxied from public platforms |
| AI Brand Visibility | AI tool monitoring (public) | N/A — always public | Auto — always proxied |
| Social Currency | Public post metrics | N/A — public | Auto — always proxied |

---

## UX Design

### Where it lives
A **Data Source Configuration** section appears as the second section in the campaign page, immediately after Campaign Info and before FRAME Brief. It is completed once at campaign setup and can be updated at any time.

### Layout per signal row
Each signal has a single row containing:
1. **Signal name + description** (one line)
2. **Mode dropdown**: `Confirmed` / `Indexed (Directional)` / `Proxied (Public Source)`
3. **Dynamic sub-panel** — appears below the row based on chosen mode:
   - **Confirmed**: link to where data comes from, no extra inputs needed here (data is entered in the signal module itself)
   - **Indexed**: directional dropdown (Higher / Same / Lower) + approximate % input
   - **Proxied**: displays the public source that will be used, read-only

### Confidence indicator
Each signal module header (Signal Intelligence, Review Platform, etc.) displays a small badge showing the data mode: `✓ Confirmed`, `↕ Indexed`, or `◎ Proxied (70%)`. When indexed or proxied, the score carries a confidence note.

---

## Database Schema

**Table: `campaign_data_preferences`**

```sql
CREATE TABLE campaign_data_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,

  -- Signal 1
  mode_sov TEXT DEFAULT 'confirmed' CHECK (mode_sov IN ('confirmed','indexed','proxied')),
  indexed_sov_direction TEXT CHECK (indexed_sov_direction IN ('Higher','Same','Lower')),
  indexed_sov_pct INTEGER,

  -- Signal 2
  mode_save_rate TEXT DEFAULT 'confirmed' CHECK (mode_save_rate IN ('confirmed','indexed','proxied')),
  indexed_save_rate_direction TEXT CHECK (indexed_save_rate_direction IN ('Higher','Same','Lower')),

  -- Signal 2B
  mode_share_rate TEXT DEFAULT 'confirmed' CHECK (mode_share_rate IN ('confirmed','indexed','proxied')),
  indexed_share_rate_direction TEXT CHECK (indexed_share_rate_direction IN ('Higher','Same','Lower')),

  -- Signal 3
  mode_branded_search TEXT DEFAULT 'confirmed' CHECK (mode_branded_search IN ('confirmed','indexed','proxied')),
  indexed_branded_search_direction TEXT CHECK (indexed_branded_search_direction IN ('Higher','Same','Lower')),
  indexed_branded_search_pct INTEGER,

  -- Signal 3B
  mode_vcr TEXT DEFAULT 'confirmed' CHECK (mode_vcr IN ('confirmed','indexed','proxied')),
  indexed_vcr_direction TEXT CHECK (indexed_vcr_direction IN ('Higher','Same','Lower')),

  -- Signal 4
  mode_retention TEXT DEFAULT 'confirmed' CHECK (mode_retention IN ('confirmed','indexed','proxied')),
  indexed_retention_direction TEXT CHECK (indexed_retention_direction IN ('Higher','Same','Lower')),

  -- Attribution
  mode_attribution TEXT DEFAULT 'confirmed' CHECK (mode_attribution IN ('confirmed','indexed','proxied')),
  indexed_attribution_direction TEXT CHECK (indexed_attribution_direction IN ('Higher','Same','Lower')),

  -- Media Spend
  mode_media_spend TEXT DEFAULT 'confirmed' CHECK (mode_media_spend IN ('confirmed','indexed')),

  -- Notes
  setup_notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (campaign_id)
);
```

---

## Confidence Scoring Logic

Applied in each signal API route when computing the health score:

```typescript
function confidenceMultiplier(mode: DataMode): number {
  if (mode === "confirmed") return 1.0;
  if (mode === "indexed")   return 0.85;
  if (mode === "proxied")   return 0.70;
  return 1.0;
}

// Applied as:
const adjustedScore = Math.round(rawScore * confidenceMultiplier(mode));
```

The raw score and adjusted score are both stored. The adjusted score is what appears in the UI. The confidence mode is always surfaced alongside the score.

---

## Sprint Scope

**Sprint 31 — Proxy Mode**

| # | Deliverable |
|---|---|
| 1 | Migration 0024 — `campaign_data_preferences` table |
| 2 | `GET /api/data-preferences?campaign_id=` |
| 3 | `POST /api/data-preferences` (upsert) |
| 4 | `DataSourceSetupSection.tsx` — full setup UI with mode dropdowns + dynamic sub-panels |
| 5 | Update `lib/types.ts` — `DataMode`, `DataPreferences` types |
| 6 | Update `lib/data.ts` — `getDataPreferences()` getter |
| 7 | Update `app/(os)/campaigns/[id]/page.tsx` — wire as second section |
| 8 | `push_sprint31.py` |

**Out of scope for Sprint 31 (Sprint 32):**
- Updating individual signal API routes to apply confidence multiplier
- Auto-fetching proxied data (Google Trends, Meta Ad Library)
- Confidence badge on each module header

---

## Commercial Value

This feature directly reduces the #1 onboarding friction point. It enables ShiftImpact OS to:

1. **Onboard clients who have data access restrictions** — the OS still produces intelligence, clearly labelled by confidence level
2. **Grow into full access over time** — Indexed clients often become Confirmed as trust builds
3. **Work during pitch/trial phase** — a new client can experience the OS output before committing to data sharing
4. **Differentiate from tools that require full API integration** — ShiftImpact OS works at every level of data access

The confidence modifier makes the limitation visible without making it a blocker.