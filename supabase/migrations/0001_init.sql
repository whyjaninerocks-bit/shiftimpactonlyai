create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  client_name text,
  status text default 'active',
  created_at timestamptz not null default now()
);

alter table campaigns enable row level security;

drop policy if exists "campaigns_v1_read" on campaigns;
create policy "campaigns_v1_read" on campaigns for select using (true);

drop policy if exists "campaigns_v1_write" on campaigns;
create policy "campaigns_v1_write" on campaigns for all using (true) with check (true);

create table if not exists campaign_data_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  campaign_id uuid not null,
  mode_sov text default 'confirmed' check (mode_sov in ('confirmed','indexed','proxied')),
  indexed_sov_direction text check (indexed_sov_direction in ('Higher','Same','Lower')),
  indexed_sov_pct integer,
  mode_save_rate text default 'confirmed' check (mode_save_rate in ('confirmed','indexed','proxied')),
  indexed_save_rate_direction text check (indexed_save_rate_direction in ('Higher','Same','Lower')),
  mode_share_rate text default 'confirmed' check (mode_share_rate in ('confirmed','indexed','proxied')),
  indexed_share_rate_direction text check (indexed_share_rate_direction in ('Higher','Same','Lower')),
  mode_branded_search text default 'confirmed' check (mode_branded_search in ('confirmed','indexed','proxied')),
  indexed_branded_search_direction text check (indexed_branded_search_direction in ('Higher','Same','Lower')),
  indexed_branded_search_pct integer,
  mode_vcr text default 'confirmed' check (mode_vcr in ('confirmed','indexed','proxied')),
  indexed_vcr_direction text check (indexed_vcr_direction in ('Higher','Same','Lower')),
  mode_retention text default 'confirmed' check (mode_retention in ('confirmed','indexed','proxied')),
  indexed_retention_direction text check (indexed_retention_direction in ('Higher','Same','Lower')),
  mode_attribution text default 'confirmed' check (mode_attribution in ('confirmed','indexed','proxied')),
  indexed_attribution_direction text check (indexed_attribution_direction in ('Higher','Same','Lower')),
  mode_media_spend text default 'confirmed' check (mode_media_spend in ('confirmed','indexed')),
  setup_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id)
);

alter table campaign_data_preferences enable row level security;

drop policy if exists "campaign_data_preferences_v1_read" on campaign_data_preferences;
create policy "campaign_data_preferences_v1_read" on campaign_data_preferences for select using (true);

drop policy if exists "campaign_data_preferences_v1_write" on campaign_data_preferences;
create policy "campaign_data_preferences_v1_write" on campaign_data_preferences for all using (true) with check (true);

insert into campaigns (id, name, client_name, status) values
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Q3 Growth Campaign', 'Nordic Beverage Co', 'active'),
  ('a1b2c3d4-0001-4000-8000-000000000002', 'Summer Launch 2026', 'Urban Apparel Brand', 'active'),
  ('a1b2c3d4-0001-4000-8000-000000000003', 'Always-On Brand Building', 'FinTech Startup', 'active')
  on conflict (id) do nothing;

insert into campaign_data_preferences (campaign_id, mode_sov, indexed_sov_direction, indexed_sov_pct, mode_save_rate, indexed_save_rate_direction, mode_share_rate, indexed_share_rate_direction, mode_branded_search, indexed_branded_search_direction, indexed_branded_search_pct, mode_vcr, indexed_vcr_direction, mode_retention, indexed_retention_direction, mode_attribution, indexed_attribution_direction, mode_media_spend, setup_notes) values
  ('a1b2c3d4-0001-4000-8000-000000000001', 'confirmed', null, null, 'confirmed', null, 'confirmed', null, 'confirmed', null, null, 'confirmed', null, 'confirmed', null, 'confirmed', null, 'confirmed', 'Full data access — client provides all platform analytics and agency reports.'),
  ('a1b2c3d4-0001-4000-8000-000000000002', 'proxied', null, null, 'indexed', 'Higher', null, 'proxied', null, 'indexed', 'Higher', 12, 'indexed', 'Same', 'proxied', null, 'proxied', 'indexed', 'Client restricts platform data — using directional signals and public sources where possible.'),
  ('a1b2c3d4-0001-4000-8000-000000000003', 'indexed', 'Higher', 15, 'indexed', 'Same', null, 'confirmed', null, 'indexed', 'Higher', 8, 'proxied', null, 'proxied', null, 'indexed', 'Lower', 'confirmed', 'Mixed access — confirmed media spend and branded search, directional SOV and save rate, proxied VCR and retention.')
  on conflict (campaign_id) do nothing;