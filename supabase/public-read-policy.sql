-- Run once in the Supabase SQL editor for a public, read-only exhibition page.
alter table public.exhibition_recommendations enable row level security;

drop policy if exists "Public recommendations are readable"
on public.exhibition_recommendations;

create policy "Public recommendations are readable"
on public.exhibition_recommendations
for select
to anon
using (true);
