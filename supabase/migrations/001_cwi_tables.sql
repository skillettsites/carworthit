-- CarWorthIt analytics tables. Run once in the Supabase SQL editor.
-- Project: noxczmrnyyosgvvjlqca (shared Pro project, cwi_ prefix keeps this
-- separate from the CarCostCheck tables).
--
-- We deliberately store a SALTED HASH of the VIN, never the VIN itself. Every
-- story angle and every "our data shows" pitch needs year/make/model/state,
-- none of them need the VIN. Hashing keeps repeat-lookup counting working
-- while removing the retention question entirely. The salt lives in
-- CWI_VIN_SALT (server-only) so the hash is not brute-forceable.

create table if not exists cwi_lookups (
  id           bigserial primary key,
  created_at   timestamptz not null default now(),
  vin_hash     text        not null,
  year         int,
  make         text,
  model        text,
  trim         text,
  body_class   text,
  fuel_type    text,
  state        text,          -- 2-letter, from the edge geo header
  country      text,
  mileage      int,           -- null until the Carketa flow collects it
  referrer     text,
  utm_source   text,
  is_bot       boolean not null default false
);

create index if not exists cwi_lookups_created_idx on cwi_lookups (created_at desc);
create index if not exists cwi_lookups_ymm_idx     on cwi_lookups (year, make, model);
create index if not exists cwi_lookups_state_idx   on cwi_lookups (state);
create index if not exists cwi_lookups_vin_idx     on cwi_lookups (vin_hash);

create table if not exists cwi_leads (
  id               bigserial primary key,
  created_at       timestamptz not null default now(),
  email            text not null,
  vin_hash         text,
  product_interest text,
  source_path      text
);

create unique index if not exists cwi_leads_email_idx on cwi_leads (lower(email));

create table if not exists cwi_purchases (
  id                bigserial primary key,
  created_at        timestamptz not null default now(),
  stripe_session_id text unique not null,
  product           text not null,
  amount_cents      int  not null,
  currency          text not null default 'usd',
  email             text,
  vin_hash          text,
  state             text
);

create index if not exists cwi_purchases_created_idx on cwi_purchases (created_at desc);

-- RLS on, with no policies: the anon key can do nothing at all. Every write
-- goes through the server using the service-role key, which bypasses RLS.
-- This is what stops the public anon key being able to read the query log.
alter table cwi_lookups   enable row level security;
alter table cwi_leads     enable row level security;
alter table cwi_purchases enable row level security;
