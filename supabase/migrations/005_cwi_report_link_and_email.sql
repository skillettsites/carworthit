-- Email the buyer a link to the report they paid for.
--
-- Until now the paid report existed only at the URL the browser happened to be
-- holding after Stripe redirected back. Nothing was ever sent, so a buyer who
-- closed that tab had no way back to what they bought and we had no way to
-- send it to them. The first sale (23 Aug 2026) landed exactly like that.
--
-- Two things are needed for the email, and neither wants a new table.

-- 1. A short link. The email carries carworthit.com/r/<token> rather than a
--    66-character Stripe session id, where the token is the last 12 characters
--    of that session id. No new column: cwi_purchases already stores the full
--    id, and the webhook writes that row whether or not the buyer ever comes
--    back, so the link resolves even for someone who never returned.
--
--    SECURITY DEFINER for the same reason get_cwi_report is: the anon key is
--    public and cwi_purchases has no SELECT policy, so a readable table could
--    be trawled for customer emails. This returns one column of one row, and
--    only to a caller who already holds the token.
--
--    The token is not a cryptographic credential, it is an unguessable handle,
--    which is the same trust model Stripe receipts use. The length check keeps
--    a short or empty token from matching every row via right(id, 0) = ''.
create or replace function get_cwi_session_by_token(p_token text)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select stripe_session_id
    from cwi_purchases
   where length(coalesce(p_token, '')) = 12
     and right(stripe_session_id, 12) = p_token
   order by created_at desc
   limit 1;
$$;

revoke all on function get_cwi_session_by_token(text) from public;
grant execute on function get_cwi_session_by_token(text) to anon;

-- 2. Somewhere to record that the email went out, so "did they get it" is a
--    question the data can answer instead of one that needs a Resend search.
--    Nullable and with no default: an existing row means the sale, not the
--    email, so backfilling these as sent would assert something untrue about
--    the one sale that predates this migration.
alter table cwi_purchases add column if not exists email_sent_at timestamptz;
alter table cwi_purchases add column if not exists email_status text;

comment on column cwi_purchases.email_sent_at is
  'When the report-link email was handed to Resend. Null means never sent.';
comment on column cwi_purchases.email_status is
  'Outcome of that hand-off: sent, no_email, failed, or skipped_disabled.';

-- Anon holds INSERT only on cwi_purchases (migration 002), so the update goes
-- through a definer function rather than an UPDATE policy. A blanket anon
-- UPDATE would let anyone holding the public key rewrite any purchase row.
-- This one can only stamp the two email columns, and only on the row whose
-- unguessable session id the caller already has.
create or replace function mark_cwi_email(p_session_id text, p_status text)
returns void
language sql
security definer
set search_path = public
as $$
  update cwi_purchases
     set email_sent_at = now(),
         email_status = p_status
   where stripe_session_id = p_session_id;
$$;

revoke all on function mark_cwi_email(text, text) from public;
grant execute on function mark_cwi_email(text, text) to anon;
