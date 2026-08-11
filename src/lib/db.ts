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

/**
 * Save a lead and report whether it actually saved.
 *
 * Everything else in this file is fire-and-forget on purpose: a dropped
 * analytics row must never break a page. A person typing their email is the
 * opposite case. If we cannot store it we have to say so, or we show "Saved"
 * to someone whose address went nowhere — which is exactly how a sister site
 * silently binned every enquiry for five months.
 *
 * `cwi_leads_email_idx` is UNIQUE on lower(email), so the second time a person
 * submits the same address PostgREST returns 409. That is not a failure from
 * their side: they are on the list. It is reported as saved.
 */
export async function saveLead(
  email: string,
  opts: { vin?: string; product?: string; path?: string } = {},
): Promise<{ ok: boolean; duplicate: boolean }> {
  if (!HAS_DB) return { ok: false, duplicate: false };
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/cwi_leads`, {
      method: 'POST',
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
        // See insert() above: never resolution=ignore-duplicates here, anon
        // holds INSERT only and the upsert it implies needs UPDATE too.
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        vin_hash: opts.vin ? hashVin(opts.vin) : null,
        product_interest: opts.product || null,
        source_path: opts.path || null,
      }),
      cache: 'no-store',
    });
    if (res.status === 409) return { ok: true, duplicate: true };
    if (!res.ok) {
      console.error('[cwi] saveLead failed', res.status, (await res.text()).slice(0, 200));
      return { ok: false, duplicate: false };
    }
    return { ok: true, duplicate: false };
  } catch (err) {
    console.error('[cwi] saveLead threw', err instanceof Error ? err.message : String(err));
    return { ok: false, duplicate: false };
  }
}

/**
 * Cache of a purchased report, so revisiting it never re-charges the data APIs.
 *
 * Reads go through a SECURITY DEFINER function rather than a SELECT policy:
 * the anon key is public, and a readable table could be trawled. The function
 * only ever returns the one row whose Stripe session id you already hold.
 */
export async function getCachedReport<T>(sessionId: string): Promise<T | null> {
  if (!HAS_DB || !sessionId) return null;
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/rpc/get_cwi_report`, {
      method: 'POST',
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_session_id: sessionId }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const payload = await res.json();
    return payload ?? null;
  } catch {
    return null;
  }
}

export function cacheReport(sessionId: string, vin: string, product: string, payload: unknown): void {
  if (!sessionId) return;
  void insert('cwi_reports', {
    stripe_session_id: sessionId,
    vin,
    product,
    payload,
  });
}

/**
 * Repair a cached report that was stored incomplete.
 *
 * `cwi_reports` is keyed on the Stripe session id and anon holds INSERT only,
 * so the first write for a session is permanent. A row written before the
 * factory build record arrived would otherwise hide the paid half of the
 * report forever, for a customer who paid for exactly that. Goes through a
 * SECURITY DEFINER function rather than an anon UPDATE policy so the public
 * anon key cannot be used to overwrite arbitrary rows. See migration 004.
 */
export function healCachedReport(sessionId: string, payload: unknown): void {
  if (!HAS_DB || !sessionId) return;
  void fetch(`${URL_BASE}/rest/v1/rpc/heal_cwi_report`, {
    method: 'POST',
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_session_id: sessionId, p_payload: payload }),
    cache: 'no-store',
  }).catch(() => {});
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
