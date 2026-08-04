// Analytics logging into Supabase.
//
// Deliberately NOT using @supabase/supabase-js: every write here is a single
// fire-and-forget insert, which PostgREST does over plain fetch, so the
// dependency would buy nothing and cost bundle size.
//
// Two rules this file must never break:
//   1. It uses the ANON key, never the service-role key. The Supabase project
//      is shared with CarCostCheck and others, and the service-role key
//      bypasses RLS on every table in it, including CCC's revenue tables.
//      CarWorthIt is a public repo and must not hold a credential whose blast
//      radius reaches other sites. The anon key can only INSERT into the three
//      cwi_* tables (see migration 002) and can reach nothing else.
//   2. It can never break or slow a page. Every call swallows its own errors
//      and is not awaited by the render path. A logging outage must not take
//      the report down.
import { createHash } from 'crypto';

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const VIN_SALT = process.env.CWI_VIN_SALT || '';

export const HAS_DB = !!(URL_BASE && ANON_KEY);

/**
 * Salted SHA-256 of the VIN. We never store the VIN itself.
 *
 * The salt matters: a VIN is only 17 characters from a constrained alphabet
 * with a checksum, so an unsalted hash is cheap to reverse for a known
 * vehicle. Without CWI_VIN_SALT set we return an empty string, which the
 * insert path treats as "don't log", because a weak hash is worse than no row.
 */
export function hashVin(vin: string): string {
  if (!VIN_SALT) return '';
  return createHash('sha256').update(`${VIN_SALT}:${vin.trim().toUpperCase()}`).digest('hex');
}

async function insert(table: string, row: Record<string, unknown>): Promise<void> {
  if (!HAS_DB) return;
  try {
    await fetch(`${URL_BASE}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
        // return=minimal so PostgREST doesn't send the row back; we don't
        // want it and it's a wasted round trip.
        //
        // Do NOT add resolution=ignore-duplicates here. It makes PostgREST
        // treat the request as an upsert, which needs UPDATE permission as
        // well as INSERT, and our anon policies grant INSERT only. The result
        // is a silent 401 "new row violates row-level security policy" on
        // every write. A duplicate (a repeat lead email) simply fails and is
        // swallowed, which is the behaviour we want anyway.
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
      cache: 'no-store',
    });
  } catch {
    // Swallowed on purpose. See rule 2 above.
  }
}

export type LookupRow = {
  vin: string;
  year?: string | number | null;
  make?: string | null;
  model?: string | null;
  trim?: string | null;
  bodyClass?: string | null;
  fuelType?: string | null;
  state?: string | null;
  country?: string | null;
  mileage?: number | null;
  referrer?: string | null;
  utmSource?: string | null;
  isBot?: boolean;
};

/**
 * Log a VIN lookup. Call WITHOUT awaiting from the render path.
 *
 * Every day without this running is a day of lost data: the aggregate
 * (year/make/model/state) is the only proprietary dataset this site will ever
 * have, and it cannot be backfilled.
 */
export function logLookup(row: LookupRow): void {
  const vin_hash = hashVin(row.vin);
  if (!vin_hash) return; // no salt configured, see hashVin
  const year = row.year != null && row.year !== '' ? Number(row.year) : null;
  void insert('cwi_lookups', {
    vin_hash,
    year: Number.isFinite(year) ? year : null,
    make: row.make || null,
    model: row.model || null,
    trim: row.trim || null,
    body_class: row.bodyClass || null,
    fuel_type: row.fuelType || null,
    state: row.state || null,
    country: row.country || null,
    mileage: row.mileage ?? null,
    referrer: row.referrer || null,
    utm_source: row.utmSource || null,
    is_bot: row.isBot ?? false,
  });
}

export function logLead(email: string, opts: { vin?: string; product?: string; path?: string } = {}): void {
  if (!email) return;
  void insert('cwi_leads', {
    email: email.trim().toLowerCase(),
    vin_hash: opts.vin ? hashVin(opts.vin) : null,
    product_interest: opts.product || null,
    source_path: opts.path || null,
  });
}

export function logPurchase(row: {
  sessionId: string;
  product: string;
  amountCents: number;
  currency?: string;
  email?: string | null;
  vin?: string | null;
  state?: string | null;
}): void {
  void insert('cwi_purchases', {
    stripe_session_id: row.sessionId,
    product: row.product,
    amount_cents: row.amountCents,
    currency: row.currency || 'usd',
    email: row.email || null,
    vin_hash: row.vin ? hashVin(row.vin) : null,
    state: row.state || null,
  });
}
