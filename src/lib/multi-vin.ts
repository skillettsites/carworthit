/**
 * Multi-VIN checkout: shared pricing ladder, derived per-vehicle session ids,
 * and VIN-list validation.
 *
 * Ported from carcostcheck/src/lib/multi-car.ts, which solved the same problem
 * for registrations. The design decision worth keeping is that a multi-VIN
 * order is ONE Stripe checkout session:
 *
 *   Vehicle 1 uses the REAL session id everywhere, so the existing single-car
 *   success flow, the cache in `cwi_reports` and `getPaidSession` all keep
 *   working untouched. Vehicles 2..N get a DERIVED id `${sessionId}MV{n}`,
 *   alphanumeric so it stays URL-safe, and unique per vehicle so the cache's
 *   primary key gives each report its own row with no schema change.
 *
 * Anything else (one session per car, or a new orders table) would mean either
 * N payments for one basket or a migration on the table that currently holds
 * every purchased report.
 */
import { PRODUCTS, STRIPE_MIN_CENTS, type ProductId } from './constants';

/**
 * Cents: [first vehicle, second, third and beyond].
 *
 * The discount is deliberately modest and flat rather than a percentage. Each
 * extra VIN still costs us a full Carketa call plus a Decode Plus call, so the
 * margin per vehicle has to survive the ladder. Second vehicle is 50c off,
 * third onwards $1 off each, mirroring CarCostCheck.
 */
const LADDER: Record<ProductId, [number, number, number]> = {
  valuation: [PRODUCTS.valuation.cents, PRODUCTS.valuation.cents - 50, PRODUCTS.valuation.cents - 100],
  worthit: [PRODUCTS.worthit.cents, PRODUCTS.worthit.cents - 50, PRODUCTS.worthit.cents - 100],
  negotiation: [PRODUCTS.negotiation.cents, PRODUCTS.negotiation.cents - 50, PRODUCTS.negotiation.cents - 100],
};

/** Five is CarCostCheck's limit and the point where a basket stops being a basket. */
export const MAX_VINS = 5;

export function ladderPriceCents(product: ProductId, index: number): number {
  const [first, second, rest] = LADDER[product];
  const raw = index === 0 ? first : index === 1 ? second : rest;
  // Floor at Stripe's minimum. The discount is a flat subtraction, so at a
  // sub-$1.50 tier price the third-vehicle line would otherwise go to zero or
  // negative and produce a checkout session Stripe refuses to process.
  // `upgradePriceCents` already guards this; the ladder must too.
  return Math.max(STRIPE_MIN_CENTS, raw);
}

export function ladderTotalCents(product: ProductId, count: number): number {
  let total = 0;
  for (let i = 0; i < count; i++) total += ladderPriceCents(product, i);
  return total;
}

/** What the same basket would cost with no ladder, for an honest strike-through. */
export function ladderFullCents(product: ProductId, count: number): number {
  return PRODUCTS[product].cents * count;
}

/** Vehicle 1 keeps the REAL session id; 2..N get an alphanumeric-suffixed one. */
export function derivedSessionId(sessionId: string, index: number): string {
  return index === 0 ? sessionId : `${sessionId}MV${index + 1}`;
}

/**
 * Recover the VIN list from Stripe metadata.
 *
 * Falls back to the single `vin` field so every session created before
 * multi-VIN existed still resolves. Stripe metadata values are capped at 500
 * characters; five VINs plus separators is 89, so there is no truncation risk.
 */
export function vinsFromMetadata(metadata: Record<string, string> | null | undefined): string[] {
  if (!metadata) return [];
  if (metadata.vins) {
    const list = metadata.vins.split(',').map((v) => v.trim().toUpperCase()).filter(Boolean);
    if (list.length) return list;
  }
  return metadata.vin ? [metadata.vin.toUpperCase()] : [];
}
