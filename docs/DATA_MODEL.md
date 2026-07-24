# Data Model

## Table: `campaign_data_preferences`

| Field | Type | Notes |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `user_id` | uuid nullable | owner-scoping (later) |
| `campaign_id` | uuid | unique, FK to campaigns |
| `mode_sov` | text | confirmed / indexed / proxied |
| `mode_save_rate` | text | confirmed / indexed / proxied |
| `mode_share_rate` | text | confirmed / indexed / proxied |
| `mode_branded_search` | text | confirmed / indexed / proxied |
| `mode_vcr` | text | confirmed / indexed / proxied |
| `mode_retention` | text | confirmed / indexed / proxied |
| `mode_attribution` | text | confirmed / indexed / proxied |
| `mode_media_spend` | text | confirmed / indexed only |
| `mode_review_platform` | text | always `proxied` (locked) |
| `mode_ai_brand_visibility` | text | always `proxied` (locked) |
| `mode_social_currency` | text | always `proxied` (locked) |
| `indexed_sov_direction` | text | higher / same / lower |
| `indexed_sov_pct` | numeric | approximate % |
| `indexed_save_rate_direction` | text | higher / same / lower |
| `indexed_save_rate_pct` | numeric | |
| `indexed_share_rate_direction` | text | |
| `indexed_share_rate_pct` | numeric | |
| `indexed_branded_search_direction` | text | |
| `indexed_branded_search_pct` | numeric | |
| `indexed_vcr_direction` | text | |
| `indexed_vcr_pct` | numeric | |
| `indexed_retention_direction` | text | |
| `indexed_retention_pct` | numeric | |
| `indexed_attribution_direction` | text | |
| `indexed_attribution_pct` | numeric | |
| `indexed_media_spend_direction` | text | |
| `indexed_media_spend_pct` | numeric | |
| `setup_notes` | text | free-text |
| `confirmed_source_links` | jsonb | map signal→URL for confirmed mode |
| `created_at` | timestamptz | default now() |
| `updated_at` | timestamptz | default now() |

## Table: `campaigns` (minimal, for FK)
| Field | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid nullable | owner-scoping (later) |
| `name` | text | campaign name |
| `client_name` | text | |
| `health_score` | numeric | raw score 0–100 |
| `created_at` | timestamptz | default now() |

## AI-Generated Fields
None in v1. Later: auto-fetched proxied data will carry `value` + `source` + `confidence` + `review_status`.

## RLS / Permissions
- v1: permissive (demo-first, no login wall).
- Later: `auth.uid() = user_id` on both tables.