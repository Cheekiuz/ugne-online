-- Run once in Supabase SQL Editor.
-- Unique first-party visitors for ugne.online (not Google Analytics).

create table if not exists site_visitors (
  visitor_id text primary key,
  first_seen timestamptz not null default now()
);

alter table site_visitors enable row level security;

drop policy if exists "Anyone can insert site visitors" on site_visitors;
create policy "Anyone can insert site visitors"
  on site_visitors for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Anyone can read site visitor count" on site_visitors;
create policy "Anyone can read site visitor count"
  on site_visitors for select
  to anon, authenticated
  using (true);

grant select, insert on table site_visitors to anon, authenticated;
