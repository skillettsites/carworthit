// Assembles the Worth-It report: the paid product.
//
// Deliberately mixes four sources so the thing we sell is our report, not a
// resold price feed:
//   Carketa (paid)      what it is worth locally, at this mileage
//   Decode Plus (paid)  what it cost new, and how it was specified
//   NHTSA + EPA (free)  recalls, safety ratings, running costs
//   Ours                five-year cost to own, and the verdict
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

/**
 * The verdict. This is the brand promise, so it has to be honest rather than
 * flattering: if a car is overpriced we say so plainly.
 *
 * Bands are set against the local range rather than a flat percentage, because
 * a $2,000 spread means something very different on a $9k car than a $60k one.
 */
export function buildVerdict(
  askingPrice: number | null,
  v: MarketValuation | null,
): WorthItVerdict | null {
  if (!v) return null;

  if (askingPrice === null || !Number.isFinite(askingPrice) || askingPrice <= 0) {
    return {
      standing: 'unknown',
      headline: 'Add the asking price to get a verdict',
      detail: `Comparable ${''}cars near ${v.zip} are listed between $${v.lowPrice.toLocaleString('en-US')} and $${v.highPrice.toLocaleString('en-US')}, averaging $${v.averagePrice.toLocaleString('en-US')} at around ${v.mileage.toLocaleString('en-US')} miles. Tell us what the seller is asking and we will tell you how it compares.`,
      differenceFromAverage: null,
    };
  }

  const diff = askingPrice - v.averagePrice;
  const abs = Math.abs(diff).toLocaleString('en-US');

  if (askingPrice <= v.lowPrice) {
    return {
      standing: 'below',
      headline: 'Priced below the local market',
      detail: `At $${askingPrice.toLocaleString('en-US')} this is at or under the cheapest comparable car near ${v.zip}, and $${abs} below the local average. That is a genuinely good price, so check the condition and history carefully to understand why.`,
      differenceFromAverage: diff,
    };
  }
  if (diff < 0) {
    return {
      standing: 'below',
      headline: 'Priced below average',
      detail: `At $${askingPrice.toLocaleString('en-US')} this is $${abs} below the local average of $${v.averagePrice.toLocaleString('en-US')}, and inside the normal range for the area.`,
      differenceFromAverage: diff,
    };
  }
  if (askingPrice <= v.highPrice) {
    return {
      standing: 'fair',
      headline: 'Priced in line with the local market',
      detail: `At $${askingPrice.toLocaleString('en-US')} this sits $${abs} above the local average of $${v.averagePrice.toLocaleString('en-US')}, but still inside the normal range for comparable cars near ${v.zip}. Worth negotiating, not worth walking away from.`,
      differenceFromAverage: diff,
    };
  }
  return {
    standing: 'above',
    headline: 'Priced above the local market',
    detail: `At $${askingPrice.toLocaleString('en-US')} this is $${abs} above the local average and higher than every comparable car we can see near ${v.zip}. Unless it is unusually well specified or exceptionally low mileage, there is room to negotiate or a better car elsewhere.`,
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
