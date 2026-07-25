create extension if not exists pgcrypto;

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  client_name text,
  brand_name text,
  status text default 'active',
  created_at timestamptz not null default now()
);

alter table campaigns add column if not exists user_id uuid;
alter table campaigns add column if not exists client_name text;
alter table campaigns add column if not exists brand_name text;
alter table campaigns add column if not exists status text default 'active';
alter table campaigns add column if not exists created_at timestamptz not null default now();

create table if not exists signals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  key text not null,
  name text not null,
  description text,
  proxy_source text,
  allows_confirmed boolean default true,
  allows_indexed boolean default true,
  allows_proxied boolean default true,
  sort_order int default 0,
  created_at timestamptz not null default now()
);

alter table signals add column if not exists user_id uuid;
alter table signals add column if not exists key text;
alter table signals add column if not exists name text;
alter table signals add column if not exists description text;
alter table signals add column if not exists proxy_source text;
alter table signals add column if not exists allows_confirmed boolean default true;
alter table signals add column if not exists allows_indexed boolean default true;
alter table signals add column if not exists allows_proxied boolean default true;
alter table signals add column if not exists sort_order int default 0;
alter table signals add column if not exists created_at timestamptz not null default now();
create unique index if not exists signals_key_idx on signals(key);

create table if not exists campaign_data_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  campaign_id uuid not null,
  signal_configs jsonb not null default '{}',
  setup_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table campaign_data_preferences add column if not exists id uuid default gen_random_uuid();
alter table campaign_data_preferences add column if not exists user_id uuid;
alter table campaign_data_preferences add column if not exists campaign_id uuid;
alter table campaign_data_preferences add column if not exists signal_configs jsonb not null default '{}';
alter table campaign_data_preferences add column if not exists setup_notes text;
alter table campaign_data_preferences add column if not exists created_at timestamptz not null default now();
alter table campaign_data_preferences add column if not exists updated_at timestamptz not null default now();
create unique index if not exists campaign_data_preferences_campaign_id_idx on campaign_data_preferences(campaign_id);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'campaign_data_preferences_campaign_id_fkey'
  ) then
    alter table campaign_data_preferences
      add constraint campaign_data_preferences_campaign_id_fkey
      foreign key (campaign_id) references campaigns(id) on delete cascade;
  end if;
end $$;

alter table campaigns enable row level security;
drop policy if exists "campaigns_v1_read" on campaigns;
create policy "campaigns_v1_read" on campaigns for select using (true);
drop policy if exists "campaigns_v1_write" on campaigns;
create policy "campaigns_v1_write" on campaigns for all using (true) with check (true);

alter table signals enable row level security;
drop policy if exists "signals_v1_read" on signals;
create policy "signals_v1_read" on signals for select using (true);
drop policy if exists "signals_v1_write" on signals;
create policy "signals_v1_write" on signals for all using (true) with check (true);

alter table campaign_data_preferences enable row level security;
drop policy if exists "campaign_data_preferences_v1_read" on campaign_data_preferences;
create policy "campaign_data_preferences_v1_read" on campaign_data_preferences for select using (true);
drop policy if exists "campaign_data_preferences_v1_write" on campaign_data_preferences;
create policy "campaign_data_preferences_v1_write" on campaign_data_preferences for all using (true) with check (true);

insert into campaigns (id, name, client_name, brand_name, status) values
  ('a0000000-0000-4000-8000-000000000001', 'Q4 Holiday Push 2024', 'Acme Retail Group', 'Acme', 'active'),
  ('a0000000-0000-4000-8000-000000000002', 'Spring Brand Lift Study', 'Northwind Foods', 'Northwind', 'active'),
  ('a0000000-0000-4000-8000-000000000003', 'Always-On Performance', 'Globex Tech', 'Globex', 'active'),
  ('a0000000-0000-4000-8000-000000000004', 'Back-to-School Launch', 'Stark Apparel', 'Stark', 'active')
  on conflict (id) do update set
    name = excluded.name,
    client_name = excluded.client_name,
    brand_name = excluded.brand_name,
    status = excluded.status;

insert into signals (key, name, description, proxy_source, allows_confirmed, allows_indexed, allows_proxied, sort_order) values
  ('sov', 'SOV', 'Share of Voice in category', 'Meta Ad Library + social listening', true, true, true, 1),
  ('save_rate', 'Save Rate', 'Percentage of users who save content', 'Category benchmark', true, true, true, 2),
  ('share_rate', 'Share Rate', 'Percentage of users who share content', 'Category benchmark', true, true, true, 3),
  ('branded_search', 'Branded Search', 'Branded search query volume', 'Google Trends', true, true, true, 4),
  ('vcr', 'VCR', 'View Completion Rate for video assets', 'Category benchmark', true, true, true, 5),
  ('retention', 'Retention', 'D7/D30 user retention', 'App category benchmark', true, true, true, 6),
  ('attribution', 'Attribution', 'Multi-touch attribution data', 'Baseline delta', true, true, true, 7),
  ('media_spend', 'Media Spend', 'Total media investment by channel', null, true, true, false, 8),
  ('review_platform', 'Review Platform', 'Public review platform ratings', 'Always public (auto-proxied)', false, false, true, 9),
  ('ai_brand_visibility', 'AI Brand Visibility', 'Brand mention frequency in AI tools', 'Always public (auto-proxied)', false, false, true, 10),
  ('social_currency', 'Social Currency', 'Social engagement quality score', 'Always public (auto-proxied)', false, false, true, 11)
  on conflict (key) do update set
    name = excluded.name,
    description = excluded.description,
    proxy_source = excluded.proxy_source,
    allows_confirmed = excluded.allows_confirmed,
    allows_indexed = excluded.allows_indexed,
    allows_proxied = excluded.allows_proxied,
    sort_order = excluded.sort_order;

insert into campaign_data_preferences (campaign_id, signal_configs, setup_notes) values
  ('a0000000-0000-4000-8000-000000000001',
   '{"sov":{"mode":"indexed","direction":"up","pct":15},"save_rate":{"mode":"confirmed","direction":null,"pct":null},"share_rate":{"mode":"proxied","direction":null,"pct":null},"branded_search":{"mode":"indexed","direction":"up","pct":8},"vcr":{"mode":"confirmed","direction":null,"pct":null},"retention":{"mode":"proxied","direction":null,"pct":null},"attribution":{"mode":"indexed","direction":"flat","pct":0},"media_spend":{"mode":"confirmed","direction":null,"pct":null},"review_platform":{"mode":"proxied","direction":null,"pct":null},"ai_brand_visibility":{"mode":"proxied","direction":null,"pct":null},"social_currency":{"mode":"proxied","direction":null,"pct":null}}',
   'Client provided SOV direction and confirmed VCR. Remaining signals proxied or indexed pending data.'),
  ('a0000000-0000-4000-8000-000000000002',
   '{"sov":{"mode":"proxied","direction":null,"pct":null},"save_rate":{"mode":"proxied","direction":null,"pct":null},"share_rate":{"mode":"proxied","direction":null,"pct":null},"branded_search":{"mode":"indexed","direction":"down","pct":5},"vcr":{"mode":"proxied","direction":null,"pct":null},"retention":{"mode":"indexed","direction":"up","pct":12},"attribution":{"mode":"proxied","direction":null,"pct":null},"media_spend":{"mode":"indexed","direction":"flat","pct":0},"review_platform":{"mode":"proxied","direction":null,"pct":null},"ai_brand_visibility":{"mode":"proxied","direction":null,"pct":null},"social_currency":{"mode":"proxied","direction":null,"pct":null}}',
   'Client withheld most data. Using public sources and directional estimates only.'),
  ('a0000000-0000-4000-8000-000000000003',
   '{"sov":{"mode":"confirmed","direction":null,"pct":null},"save_rate":{"mode":"confirmed","direction":null,"pct":null},"share_rate":{"mode":"confirmed","direction":null,"pct":null},"branded_search":{"mode":"confirmed","direction":null,"pct":null},"vcr":{"mode":"confirmed","direction":null,"pct":null},"retention":{"mode":"indexed","direction":"up","pct":20},"attribution":{"mode":"confirmed","direction":null,"pct":null},"media_spend":{"mode":"confirmed","direction":null,"pct":null},"review_platform":{"mode":"proxied","direction":null,"pct":null},"ai_brand_visibility":{"mode":"proxied","direction":null,"pct":null},"social_currency":{"mode":"proxied","direction":null,"pct":null}}',
   'Full data sharing client. All signals confirmed except retention (indexed).')
  on conflict (campaign_id) do update set
    signal_configs = excluded.signal_configs,
    setup_notes = excluded.setup_notes,
    updated_at = now();
