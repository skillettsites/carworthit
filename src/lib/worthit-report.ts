// Assembles the Worth-It report: the paid product.
//
// Deliberately mixes four sources so the thing we sell is our report, not a
// resold price feed:
//   Carketa (paid)      what it is worth locally, at this mileage
//   Decode Plus (paid)  what it cost new, and how it was specified
//   NHTSA + EPA (free)  recalls, safety ratings, running costs
//   Ours                five-year running costs, and the verdict
import type {
  FactoryData,
  FreeReport,
  MarketValuation,
  WorthItVerdict,
} from './types';

export interface WorthItReport {
  free: FreeReport;
  valuation: MarketValuation | null;
  factory: FactoryData | null;
  verdict: WorthItVerdict | null;
  /** What the buyer is being asked to pay, if they told us. */
  askingPrice: number | null;
}

const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

/**
 * The verdict. This is the brand promise, so it has to be honest rather than
 * flattering: if a car is overpriced we say so plainly.
 *
 * Bands are set against the local range where we have one, because a $2,000
 * spread means something very different on a $9k car than a $60k one. Where the
 * feed gave no range we fall back to comparing against the average only, rather
 * than inventing bounds.
 */
export function buildVerdict(
  askingPrice: number | null,
  v: MarketValuation | null,
): WorthItVerdict | null {
  if (!v) return null;

  const range =
    v.lowPrice !== null && v.highPrice !== null
      ? `between ${money(v.lowPrice)} and ${money(v.highPrice)}, averaging ${money(v.averagePrice)}`
      : `averaging ${money(v.averagePrice)}`;

  if (askingPrice === null || !Number.isFinite(askingPrice) || askingPrice <= 0) {
    return {
      standing: 'unknown',
      headline: 'Add the asking price to get a verdict',
      detail: `Comparable cars near ${v.zip} are listed ${range} at around ${v.mileage.toLocaleString('en-US')} miles. Tell us what the seller is asking and we will tell you how it compares.`,
      differenceFromAverage: null,
    };
  }

  const diff = askingPrice - v.averagePrice;
  const abs = money(Math.abs(diff));

  // Exactly at the average. Without this, the copy reads "$0 above average".
  if (diff === 0) {
    return {
      standing: 'fair',
      headline: 'Priced right at the local average',
      detail: `At ${money(askingPrice)} this is exactly the average asking price for comparable cars near ${v.zip}. Nothing to argue with on price, so judge it on condition and history.`,
      differenceFromAverage: 0,
    };
  }

  if (v.lowPrice !== null && askingPrice <= v.lowPrice) {
    return {
      standing: 'below',
      headline: 'Priced below the local market',
      detail: `At ${money(askingPrice)} this is at or under the cheapest comparable car near ${v.zip}, and ${abs} below the local average. That is a genuinely good price, so check the condition and history carefully to understand why.`,
      differenceFromAverage: diff,
    };
  }
  if (diff < 0) {
    return {
      standing: 'below',
      headline: 'Priced below average',
      detail: `At ${money(askingPrice)} this is ${abs} below the local average of ${money(v.averagePrice)}${v.lowPrice !== null && v.highPrice !== null ? ', and inside the normal range for the area' : ''}.`,
      differenceFromAverage: diff,
    };
  }
  if (v.highPrice !== null && askingPrice <= v.highPrice) {
    return {
      standing: 'fair',
      headline: 'Priced in line with the local market',
      detail: `At ${money(askingPrice)} this sits ${abs} above the local average of ${money(v.averagePrice)}, but still inside the normal range for comparable cars near ${v.zip}. Worth negotiating, not worth walking away from.`,
      differenceFromAverage: diff,
    };
  }
  return {
    standing: 'above',
    headline: 'Priced above the local market',
    detail:
      v.highPrice !== null
        ? `At ${money(askingPrice)} this is ${abs} above the local average and higher than every comparable car we can see near ${v.zip}. Unless it is unusually well specified or exceptionally low mileage, there is room to negotiate or a better car elsewhere.`
        : `At ${money(askingPrice)} this is ${abs} above the local average of ${money(v.averagePrice)} for comparable cars near ${v.zip}. Unless it is unusually well specified or exceptionally low mileage, there is room to negotiate.`,
    differenceFromAverage: diff,
  };
}

/**
 * Total depreciation since new: what it stickered at, against what it is worth
 * now. Uses combined MSRP where available, since that is what the first owner
 * actually paid on the window sticker, options and delivery included.
 */
export function depreciation(
  factory: FactoryData | null,
  v: MarketValuation | null,
): { paidNew: number; worthNow: number; lost: number; pct: number } | null {
  const paidNew = factory?.combinedMsrp || factory?.msrp || null;
  if (!paidNew || !v || paidNew <= v.averagePrice) return null;
  const lost = paidNew - v.averagePrice;
  return {
    paidNew,
    worthNow: v.averagePrice,
    lost,
    pct: Math.round((lost / paidNew) * 100),
  };
}

/** Group standard equipment for display without dumping 177 rows on the page. */
export function groupFeatures(factory: FactoryData | null): { category: string; items: string[] }[] {
  if (!factory?.standardFeatures?.length) return [];
  const map = new Map<string, string[]>();
  for (const f of factory.standardFeatures) {
    const list = map.get(f.category) || [];
    if (!list.includes(f.description)) list.push(f.description);
    map.set(f.category, list);
  }
  return [...map.entries()]
    .map(([category, items]) => ({ category, items }))
    .sort((a, b) => b.items.length - a.items.length);
}
