-- Let an incomplete cached report be repaired.
--
-- 003 gave anon INSERT only, with the Stripe session id as the primary key, so
-- the first write for a session won wins permanently. That was fine while the
-- only thing cached was the valuation, which was already guarded. It was not
-- fine once the paid tiers started caching the factory build record too:
--
--   buyer pays $6.99 or $9.99  ->  Carketa returns a valuation  ->  VIN Decode
--   Plus misses (it answers 200 with an empty payload for vehicles it has no
--   record of)  ->  a row is written with factory: null  ->  "What it cost
--   new", "Options this car was built with" and "Standard equipment" can never
--   render again, on any visit, for a customer who paid specifically for them.
--
-- The application now refuses to cache an incomplete result, but rows already
-- written that way still need a repair path, and without UPDATE the only
-- alternative is to re-call the paid APIs on every single visit for that buyer.
--
-- SECURITY DEFINER rather than an anon UPDATE policy: a blanket
-- "for update to anon using (true)" would let anyone holding the public anon
-- key overwrite any cached report if they could guess a session id. This
-- function can only ever touch the single row whose unguessable session id the
-- caller already holds, which is the same trust boundary get_cwi_report uses.
create or replace function heal_cwi_report(p_session_id text, p_payload jsonb)
returns void
language sql
security definer
set search_path = public
as $$
  update cwi_reports
     set payload = p_payload
   where stripe_session_id = p_session_id;
$$;

revoke all on function heal_cwi_report(text, jsonb) from public;
grant execute on function heal_cwi_report(text, jsonb) to anon;
