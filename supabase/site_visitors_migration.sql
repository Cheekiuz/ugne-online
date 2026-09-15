-- Run once in Supabase SQL Editor.
-- Same policy style as sponsor_smiles (that one already works).

create table if not exists public.site_visitors (
  visitor_id text primary key,
  first_seen timestamptz not null default now()
);

alter table public.site_visitors enable row level security;

drop policy if exists "Anyone can insert site visitors" on public.site_visitors;
create policy "Anyone can insert site visitors"
  on public.site_visitors
  for insert
  to anon
  with check (true);

drop policy if exists "Anyone can read site visitor count" on public.site_visitors;
create policy "Anyone can read site visitor count"
  on public.site_visitors
  for select
  to anon
  using (true);

notify pgrst, 'reload schema';
