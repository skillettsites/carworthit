// Turns the national Retail Market Value feed into something a buyer can use
// where they are standing.
//
// Everything here is DERIVED from the listings the feed returned. Nothing is
// invented: a "near you" figure only exists when enough real listings sit
// inside the radius, and the radius widens in fixed steps until they do. If
// the buyer's ZIP has no centroid, or the country is thin for this car, the
// national figures are what we show and the copy says so.
import type { MarketEvidence, MarketListing } from './types';
import { zipToLatLng, milesBetween } from './zip-geo';

/** Radii tried in order. The first with MIN_LOCAL listings wins. */
export const RADII_MILES = [50, 100, 250, 500] as const;
/** Fewer than this and a "near you" median is noise dressed as a number. */
export const MIN_LOCAL = 8;

export interface ListingWithDistance extends MarketListing {
  miles: number;
}

export interface LocalMarket {
  /** null means national: no radius held enough listings, or no ZIP centroid. */
  radius: number | null;
  zip: string;
  count: number;
  median: number;
  min: number;
  max: number;
  p25: number;
  p75: number;
  /** Nearest first. Trimmed to what the tier is allowed to show. */
  listings: ListingWithDistance[];
  /** Every listing inside the radius (or every listing, when national), for counts that must not depend on the display cap. */
  inside: ListingWithDistance[];
}

export const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

export function median(xs: number[]): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function percentile(xs: number[], p: number): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const idx = Math.min(s.length - 1, Math.max(0, Math.round((p / 100) * (s.length - 1))));
  return s[idx];
}

function stats(listings: ListingWithDistance[]) {
  const prices = listings.map((l) => l.adjPrice);
  return {
    count: listings.length,
    median: Math.round(median(prices)),
    min: Math.round(Math.min(...prices)),
    max: Math.round(Math.max(...prices)),
    p25: Math.round(percentile(prices, 25)),
    p75: Math.round(percentile(prices, 75)),
  };
}

/**
 * The listings nearest the buyer, and the market they describe.
 *
 * Prices are the feed's mileage-adjusted figures, so the median is directly
 * comparable with the car in front of the buyer rather than with a pool of
 * cars at other odometer readings.
 */
export function localMarket(ev: MarketEvidence, zip: string, max = 30): LocalMarket | null {
  if (!ev.listings.length) return null;
  const here = zipToLatLng(zip);
  if (!here) return null;
  const withMiles: ListingWithDistance[] = ev.listings
    .filter((l) => Number.isFinite(l.lat) && Number.isFinite(l.lng) && l.adjPrice > 0)
    .map((l) => ({ ...l, miles: Math.round(milesBetween(here.lat, here.lng, l.lat, l.lng)) }))
    .sort((a, b) => a.miles - b.miles);
  if (!withMiles.length) return null;

  for (const r of RADII_MILES) {
    const inside = withMiles.filter((l) => l.miles <= r);
    if (inside.length >= MIN_LOCAL) {
      return { radius: r, zip, ...stats(inside), listings: inside.slice(0, max), inside };
    }
  }
  // Nothing within 500 miles holds MIN_LOCAL listings: report the nearest
  // as national context, with no radius claim.
  return { radius: null, zip, ...stats(withMiles), listings: withMiles.slice(0, max), inside: withMiles };
}

/** Share of listings (0 to 100) whose mileage-adjusted price is below `asking`. */
export function cheaperThanShare(listings: MarketListing[], asking: number): number | null {
  const prices = listings.map((l) => l.adjPrice).filter((p) => p > 0);
  if (!prices.length) return null;
  const below = prices.filter((p) => p < asking).length;
  return Math.round((below / prices.length) * 100);
}

export type Strength = 'strong' | 'fair' | 'thin';

/**
 * How much weight the national figure can bear. Stated on the page, because a
 * 2003 Accord priced off six listings must not read like a 2019 Model 3 priced
 * off seven hundred.
 */
export function strength(ev: MarketEvidence): { level: Strength; label: string } {
  if (ev.count >= 100 && ev.confidence >= 90) return { level: 'strong', label: 'Strong: a large, current pool of listings' };
  if (ev.count >= 25 && ev.confidence >= 70) return { level: 'fair', label: 'Fair: enough listings to trust the middle, less so the edges' };
  return { level: 'thin', label: 'Thin: few listings, treat the figure as a guide only' };
}

/** Median of the feed's listings, used where the tier may not see the table. */
export function nationalMedian(ev: MarketEvidence): number {
  return Math.round(median(ev.listings.map((l) => l.adjPrice).filter((p) => p > 0)));
}

/** Listings grouped by state, largest first. For the model pages. */
export function byState(ev: MarketEvidence): { state: string; count: number; median: number }[] {
  const groups = new Map<string, number[]>();
  for (const l of ev.listings) {
    if (!l.state || !(l.adjPrice > 0)) continue;
    const g = groups.get(l.state) || [];
    g.push(l.adjPrice);
    groups.set(l.state, g);
  }
  return [...groups.entries()]
    .map(([state, prices]) => ({ state, count: prices.length, median: Math.round(median(prices)) }))
    .sort((a, b) => b.count - a.count);
}

/** Shape the ten bands for a bar chart: each with its share of the tallest. */
export function bandChart(ev: MarketEvidence): { min: number; max: number; count: number; pct: number }[] {
  const tallest = Math.max(1, ...ev.bands.map((b) => b.count));
  return ev.bands.map((b) => ({ ...b, pct: Math.round((b.count / tallest) * 100) }));
}

/** "August 17 to September 7, 2026", from the feed's ISO window. */
export function windowLabel(ev: MarketEvidence): string {
  const fmt = (iso: string, withYear: boolean) => {
    const d = new Date(iso + 'T00:00:00Z');
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', ...(withYear ? { year: 'numeric' } : {}), timeZone: 'UTC' });
  };
  return `${fmt(ev.from, false)} to ${fmt(ev.to, true)}`;
}

/** One quotable sentence, for the page and for llms.txt. */
export function summarySentence(ev: MarketEvidence): string {
  return `${ev.vehicleDesc} at ${ev.mileage.toLocaleString('en-US')} miles: ${usd(ev.avg)} average retail value across ${ev.count.toLocaleString('en-US')} US listings observed ${windowLabel(ev)}, ranging ${usd(ev.low)} to ${usd(ev.high)}.`;
}
