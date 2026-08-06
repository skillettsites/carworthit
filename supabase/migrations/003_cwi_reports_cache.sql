-- Persist a purchased report so revisiting it never re-charges the data APIs.
--
-- Without this, every render of /report/{vin}?paid=cs_... re-calls Carketa (20p)
-- and VIN Decode Plus (12p). The 24h fetch cache hides it for a day, then the
-- cost returns. A buyer who bookmarks their report and checks it weekly while
-- car shopping costs more in API calls than the report sold for.
--
-- Keyed on the Stripe session id, which is already the proof of purchase.

create table if not exists cwi_reports (
  stripe_session_id text primary key,
  created_at        timestamptz not null default now(),
  vin               text not null,
  product           text not null,
  payload           jsonb not null   -- { valuation, factory }
);

alter table cwi_reports enable row level security;

-- Anon may write its own report once. No SELECT policy at all, so the table
-- cannot be listed or trawled even though the anon key is public.
create policy cwi_reports_anon_insert on cwi_reports
  for insert to anon with check (true);

-- Reads go through this function instead. SECURITY DEFINER lets it bypass RLS,
-- but it only ever returns the single row whose session id you already hold,
-- and a Stripe session id is unguessable. That gives us caching without
-- exposing the table to enumeration.
create or replace function get_cwi_report(p_session_id text)
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select payload from cwi_reports where stripe_session_id = p_session_id;
$$;

revoke all on function get_cwi_report(text) from public;
grant execute on function get_cwi_report(text) to anon;
