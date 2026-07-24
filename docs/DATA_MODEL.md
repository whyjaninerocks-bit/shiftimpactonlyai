# Data Model

## Table: `campaigns`

| Field | Type | Notes |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| user_id | uuid | nullable — for owner-scoping at lock-down |
| name | text | not null — campaign name |
| client_name | text | nullable — client/org name |
| status | text | default 'active' |
| created_at | timestamptz | default now() |

## Table: `campaign_data_preferences`

One row per campaign (UNIQUE on campaign_id).

| Field | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | nullable — for owner-scoping later |
| campaign_id | uuid | not null, UNIQUE |
| mode_sov | text | confirmed\|indexed\|proxied, default 'confirmed' |
| indexed_sov_direction | text | Higher\|Same\|Lower |
| indexed_sov_pct | integer | approximate % |
| mode_save_rate | text | confirmed\|indexed\|proxied |
| indexed_save_rate_direction | text | Higher\|Same\|Lower |
| mode_share_rate | text | confirmed\|indexed\|proxied |
| indexed_share_rate_direction | text | Higher\|Same\|Lower |
| mode_branded_search | text | confirmed\|indexed\|proxied |
| indexed_branded_search_direction | text | Higher\|Same\|Lower |
| indexed_branded_search_pct | integer | approximate % |
| mode_vcr | text | confirmed\|indexed\|proxied |
| indexed_vcr_direction | text | Higher\|Same\|Lower |
| mode_retention | text | confirmed\|indexed\|proxied |
| indexed_retention_direction | text | Higher\|Same\|Lower |
| mode_attribution | text | confirmed\|indexed\|proxied |
| indexed_attribution_direction | text | Higher\|Same\|Lower |
| mode_media_spend | text | confirmed\|indexed — NO proxied |
| setup_notes | text | free-text notes |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### Always-Proxied Signals (no columns — fixed in UI)
- **Review Platform** — Google Reviews + TripAdvisor
- **AI Brand Visibility** — AI tool monitoring
- **Social Currency** — public post metrics

### Relationships
- `campaign_data_preferences.campaign_id` → `campaigns.id` (1:1). No FK constraint in v1 (demo rows exist without referential enforcement); add FK at lock-down.

### RLS / Permissions
- v1: RLS enabled, permissive policies (`using (true)`) — app renders for anonymous visitors.
- Lock-down: replace with `auth.uid() = user_id` on both tables.

### AI-Generated Fields
No AI-generated fields in v1. Later: proxied signal values will carry `value + source + confidence + review_status`.