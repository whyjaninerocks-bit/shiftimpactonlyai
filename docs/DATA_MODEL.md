# Data Model

## campaigns
- `id` uuid PK
- `user_id` uuid nullable (owner scope later)
- `name` text not null
- `client_name` text
- `brand_name` text
- `status` text default 'active'
- `created_at` timestamptz

## signals
- `id` uuid PK
- `user_id` uuid nullable
- `key` text not null unique (e.g. 'sov', 'save_rate')
- `name` text not null (display name)
- `description` text
- `proxy_source` text (e.g. 'Meta Ad Library + social listening')
- `allows_confirmed` boolean default true
- `allows_indexed` boolean default true
- `allows_proxied` boolean default true
- `sort_order` int default 0
- `created_at` timestamptz

## campaign_data_preferences
- `id` uuid PK
- `user_id` uuid nullable
- `campaign_id` uuid not null (UNIQUE)
- `signal_configs` jsonb not null default '{}' — stores per-signal config:
  ```json
  { "sov": {"mode": "indexed", "direction": "up", "pct": 15},
    "save_rate": {"mode": "proxied", "direction": null, "pct": null} }
  ```
- `setup_notes` text
- `created_at` timestamptz
- `updated_at` timestamptz

## Relationships
- campaign_data_preferences.campaign_id → campaigns.id (1:1, unique)
- signals is a static catalog; signalConfigs references signals by `key`

## RLS Notes
- v1: permissive policies (select/insert/update for all) — demo-first, no login wall
- Later: owner-scoped policies (`auth.uid() = user_id`) replace v1 policies

## AI Fields
- No AI-generated fields in v1. When auto-fetching is added later, proxied values will store `value` + `source` text + `confidence` numeric + `review_status` text default 'unreviewed'.