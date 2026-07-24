create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  client_name text,
  health_score numeric default 0,
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
  campaign_id uuid unique not null references campaigns(id) on delete cascade,
  mode_sov text default 'confirmed' check (mode_sov in ('confirmed','indexed','proxied')),
  mode_save_rate text default 'confirmed' check (mode_save_rate in ('confirmed','indexed','proxied')),
  mode_share_rate text default 'confirmed' check (mode_share_rate in ('confirmed','indexed','proxied')),
  mode_branded_search text default 'confirmed' check (mode_branded_search in ('confirmed','indexed','proxied')),
  mode_vcr text default 'confirmed' check (mode_vcr in ('confirmed','indexed','proxied')),
  mode_retention text default 'confirmed' check (mode_retention in ('confirmed','indexed','proxied')),
  mode_attribution text default 'confirmed' check (mode_attribution in ('confirmed','indexed','proxied')),
  mode_media_spend text default 'confirmed' check (mode_media_spend in ('confirmed','indexed')),
  mode_review_platform text default 'proxied' check (mode_review_platform = 'proxied'),
  mode_ai_brand_visibility text default 'proxied' check (mode_ai_brand_visibility = 'proxied'),
  mode_social_currency text default 'proxied' check (mode_social_currency = 'proxied'),
  indexed_sov_direction text check (indexed_sov_direction in ('higher','same','lower')),
  indexed_sov_pct numeric,
  indexed_save_rate_direction text check (indexed_save_rate_direction in ('higher','same','lower')),
  indexed_save_rate_pct numeric,
  indexed_share_rate_direction text check (indexed_share_rate_direction in ('higher','same','lower')),
  indexed_share_rate_pct numeric,
  indexed_branded_search_direction text check (indexed_branded_search_direction in ('higher','same','lower')),
  indexed_branded_search_pct numeric,
  indexed_vcr_direction text check (indexed_vcr_direction in ('higher','same','lower')),
  indexed_vcr_pct numeric,
  indexed_retention_direction text check (indexed_retention_direction in ('higher','same','lower')),
  indexed_retention_pct numeric,
  indexed_attribution_direction text check (indexed_attribution_direction in ('higher','same','lower')),
  indexed_attribution_pct numeric,
  indexed_media_spend_direction text check (indexed_media_spend_direction in ('higher','same','lower')),
  indexed_media_spend_pct numeric,
  setup_notes text,
  confirmed_source_links jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table campaign_data_preferences enable row level security;
drop policy if exists "campaign_data_preferences_v1_read" on campaign_data_preferences;
create policy "campaign_data_preferences_v1_read" on campaign_data_preferences for select using (true);
drop policy if exists "campaign_data_preferences_v1_write" on campaign_data_preferences;
create policy "campaign_data_preferences_v1_write" on campaign_data_preferences for all using (true) with check (true);

insert into campaigns (id, name, client_name, health_score) values
  ('a1111111-1111-1111-1111-111111111111', 'Q4 Brand Launch', 'Nova Beverages', 78),
  ('b2222222-2222-2222-2222-222222222222', 'Summer App Install Drive', 'FitKit', 64),
  ('c3333333-3333-3333-3333-333333333333', 'Always-On Retail', 'GreenLeaf Co.', 82),
  ('d4444444-4444-4444-4444-444444444444', 'Holiday Consideration', 'Atlas Travel', 71)
on conflict (id) do nothing;

insert into campaign_data_preferences (campaign_id, mode_sov, mode_save_rate, mode_branded_search, mode_attribution, mode_media_spend, indexed_sov_direction, indexed_sov_pct, setup_notes, confirmed_source_links) values
  ('a1111111-1111-1111-1111-111111111111', 'confirmed', 'confirmed', 'confirmed', 'confirmed', 'confirmed', null, null, 'All data confirmed via agency dashboard.', '{"sov":"https://agency.example.com/nova-sov","save_rate":"https://ads.facebook.com/nova-saves"}'::jsonb),
  ('b2222222-2222-2222-2222-222222222222', 'indexed', 'indexed', 'proxied', 'indexed', 'indexed', 'higher', 15, 'Client provided directional input for most signals.', '{}'::jsonb),
  ('c3333333-3333-3333-3333-333333333333', 'confirmed', 'confirmed', 'confirmed', 'confirmed', 'confirmed', null, null, 'Full confirmed data from internal team.', '{}'::jsonb),
  ('d4444444-4444-4444-4444-444444444444', 'proxied', 'proxied', 'indexed', 'proxied', 'indexed', 'higher', 8, 'Minimal client data; relying on public sources.', '{}'::jsonb)
on conflict (campaign_id) do nothing;