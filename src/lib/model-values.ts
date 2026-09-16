// The model-value pages: /car-value/2018-chevrolet-equinox and friends.
//
// Each row in `cwi_model_values` is one Retail Market Value result for one
// year, make, model and trim, reduced to what a public page may show: the
// national low, average and high, the confidence, the count, the observation
// window, the ten price bands and a per-state median. No individual listing
// and no listing VIN is stored here; those are shown only inside a paid
// report, which is the limit OneAuto confirmed on 15 September 2026.
//
// Rows arrive two ways. A seed script values the most-searched model years
// from a synthetic VIN (NHTSA complaint prefixes, which decode to the right
// trim), and every real report a customer buys writes its own row, so the
// pages grow with the traffic. Writes go through a SECURITY DEFINER function
// gated on CWI_WRITE_SECRET, because the anon key is public and a plain
// INSERT policy would let anyone poison a public page.
import type { MarketEvidence } from './types';
import { byState, strength } from './market-evidence';

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const WRITE_SECRET = process.env.CWI_WRITE_SECRET || '';

export interface ModelValueRow {
  prefix: string;
  slug: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  vehicle_desc: string | null;
  mileage_basis: number;
  pricing: {
    mean: number;
    sd: number;
    count: number;
    confidence: number;
    low: number;
    avg: number;
    high: number;
    mileageAdjustment: number;
  };
  distribution: { min: number; max: number; count: number }[];
  states: { state: string; count: number; median: number }[];
  summary: { strength: 'strong' | 'fair' | 'thin'; medianListing: number };
  listings_count: number;
  sale_date_from: string | null;
  sale_date_to: string | null;
  fetched_at: string;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** VIN positions 1 to 8 plus 10 and 11: everything that fixes the model, minus the check digit. */
export const vinPrefix = (vin: string) => {
  const v = vin.trim().toUpperCase();
  return v.slice(0, 8) + v.slice(9, 11);
};

/**
 * "2018 Chevrolet Equinox LT" from the feed, split the way the page needs it.
 * The free NHTSA decode is passed in as the fallback because the feed's
 * description is one string and a two-word make ("Land Rover") cannot be
 * told apart from a two-word model by position alone.
 */
export function splitDesc(
  desc: string,
  fallback: { year?: string; make?: string; model?: string; trim?: string },
): { year: number; make: string; model: string; trim: string | null } {
  const m = desc.match(/^(\d{4})\s+(.+)$/);
  const year = Number(m?.[1] || fallback.year);
  const rest = (m?.[2] || '').trim();
  const fbMake = (fallback.make || '').trim();
  const fbModel = (fallback.model || '').trim();
  if (fbMake && rest.toLowerCase().startsWith(fbMake.toLowerCase())) {
    const after = rest.slice(fbMake.length).trim();
    if (fbModel && after.toLowerCase().startsWith(fbModel.toLowerCase())) {
      const trim = after.slice(fbModel.length).trim();
      return { year, make: titleCase(fbMake), model: fbModel, trim: trim || (fallback.trim ?? null) };
    }
    const [model, ...trimParts] = after.split(/\s+/);
    return { year, make: titleCase(fbMake), model: model || fbModel, trim: trimParts.join(' ') || null };
  }
  const [make, model, ...trimParts] = rest.split(/\s+/);
  return { year, make: make || titleCase(fbMake), model: model || fbModel, trim: trimParts.join(' ') || null };
}

const titleCase = (s: string) =>
  s
    .toLowerCase()
    .split(/(\s+|-)/)
    .map((w) => (w.length > 1 && !/^\s+$/.test(w) && w !== '-' ? w[0].toUpperCase() + w.slice(1) : w.toUpperCase()))
    .join('')
    .replace(/\bBmw\b/, 'BMW')
    .replace(/\bGmc\b/, 'GMC')
    .replace(/\bRam\b/, 'Ram');

export function toModelRow(
  vin: string,
  ev: MarketEvidence,
  fallback: { year?: string; make?: string; model?: string; trim?: string },
): ModelValueRow | null {
  const { year, make, model, trim } = splitDesc(ev.vehicleDesc, fallback);
  if (!year || !make || !model) return null;
  const prices = ev.listings.map((l) => l.adjPrice).filter((p) => p > 0).sort((a, b) => a - b);
  const medianListing = prices.length ? prices[Math.floor(prices.length / 2)] : ev.avg;
  return {
    prefix: vinPrefix(vin),
    slug: `${year}-${slugify(make)}-${slugify(model)}`,
    year,
    make,
    model,
    trim,
    vehicle_desc: ev.vehicleDesc,
    mileage_basis: ev.mileage,
    pricing: {
      mean: ev.mean,
      sd: ev.standardDeviation,
      count: ev.count,
      confidence: ev.confidence,
      low: ev.low,
      avg: ev.avg,
      high: ev.high,
      mileageAdjustment: ev.mileageAdjustment,
    },
    distribution: ev.bands,
    states: byState(ev).slice(0, 15),
    summary: { strength: strength(ev).level, medianListing },
    listings_count: ev.listings.length,
    sale_date_from: ev.from || null,
    sale_date_to: ev.to || null,
    fetched_at: ev.fetchedAt,
  };
}

const headers = () => ({
  apikey: ANON_KEY,
  Authorization: `Bearer ${ANON_KEY}`,
  'Content-Type': 'application/json',
});

/** Write or refresh a row. Never awaited on a render path; never throws. */
export async function upsertModelValue(row: ModelValueRow): Promise<boolean> {
  if (!URL_BASE || !ANON_KEY || !WRITE_SECRET) return false;
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/rpc/upsert_cwi_model_value`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ p_secret: WRITE_SECRET, p_row: row }),
      cache: 'no-store',
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function select<T>(query: string, revalidate = 86400): Promise<T[]> {
  if (!URL_BASE || !ANON_KEY) return [];
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/cwi_model_values?${query}`, {
      headers: headers(),
      next: { revalidate },
    });
    if (!res.ok) return [];
    return (await res.json()) as T[];
  } catch {
    return [];
  }
}

/** Does a row already exist for this VIN prefix? Free-view seeding must not overwrite a row struck at a real odometer reading. */
export async function hasModelValue(prefix: string): Promise<boolean> {
  const rows = await select<{ prefix: string }>(`select=prefix&prefix=eq.${encodeURIComponent(prefix)}&limit=1`, 0);
  return rows.length > 0;
}

/** Every trim row for one model page, newest first. */
export function getModelValues(slug: string): Promise<ModelValueRow[]> {
  return select<ModelValueRow>(`slug=eq.${encodeURIComponent(slug)}&order=fetched_at.desc`);
}

export interface ModelIndexRow {
  slug: string;
  year: number;
  make: string;
  model: string;
  pricing: { avg: number; count: number };
  fetched_at: string;
}

/** One row per slug for the index, sitemap and related links. */
export async function getModelIndex(): Promise<ModelIndexRow[]> {
  const rows = await select<ModelIndexRow>(
    `select=slug,year,make,model,pricing,fetched_at&order=make.asc,model.asc,year.desc&limit=5000`,
  );
  const seen = new Map<string, ModelIndexRow>();
  for (const r of rows) if (!seen.has(r.slug)) seen.set(r.slug, r);
  return [...seen.values()];
}
