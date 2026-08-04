-- Remove CarWorthIt's ability to touch any other site's data.
--
-- 001 left CarWorthIt writing with the SHARED project's service-role key.
-- That key bypasses RLS on all 89 tables in this project, including
-- CarCostCheck's revenue tables (searches, premium_reports, trade_credits,
-- stripe_events) and personal ones (properties, net_worth_snapshots).
-- CarWorthIt is a PUBLIC repo and pre-revenue, so it should not be holding a
-- credential whose blast radius includes the £3k/month site.
--
-- Fix: CarWorthIt uses the ANON key instead, with INSERT-only policies on its
-- own three tables. The anon key is already public in every other site's
-- client bundle, so using it here adds no new exposure, and every table in
-- this project has RLS enabled (verified: zero with rowsecurity=false), so
-- anon can reach nothing it has not been granted.
--
-- Deliberately INSERT only. Nothing here needs to read its own rows back at
-- runtime; analysis happens through the dashboard and the Management API.

create policy cwi_lookups_anon_insert   on cwi_lookups   for insert to anon with check (true);
create policy cwi_leads_anon_insert     on cwi_leads     for insert to anon with check (true);
create policy cwi_purchases_anon_insert on cwi_purchases for insert to anon with check (true);

-- The anon key is public, so anyone could in principle POST junk rows. This is
-- a log table so the impact is low, but requiring a well-formed hash filters
-- out casual garbage and keeps the aggregate usable.
alter table cwi_lookups
  add constraint cwi_lookups_vin_hash_format check (vin_hash ~ '^[0-9a-f]{64}$');
