// Site-wide configuration for CarWorthIt (US market).

// Paid reports. Held back until the Stripe key is rotated and added to the
// Vercel production environment; the buy buttons show "Coming soon" while false.
export const CHECKOUT_ENABLED = process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === 'true';
// Plate to VIN exists and is cheap (5p) but adds nothing to the core product yet.
export const PLATE_ENABLED = false;

export const SITE_NAME = 'CarWorthIt';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://carworthit.com';
export const SITE_TAGLINE = 'How much is a car worth? Find out by VIN, with the listings to prove it.';

/**
 * Off by decision (16 September 2026): the paid listings feed is only called
 * when a report has been bought. Switching this on runs the feed once per VIN
 * on the FREE report (24p, cached a week, humans only) so the buy cards can
 * quote the listing count; the prices, bands and listings stay paid either way.
 */
export const FREE_EVIDENCE_TEASER = false;
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-GKFGSRW0KL';

// Leads on the VIN valuation intent, which is where the search volume actually
// is. Deliberately quotes no competitor price: they change without notice and a
// stale figure in a meta description is wrong everywhere at once.
export const SITE_DESCRIPTION =
  'Price any US car by its VIN, against cars actually for sale near you, at its real mileage. Free VIN report with specs, open recalls, safety ratings and running costs, no signup.';

export const CURRENCY = 'usd';

/**
 * Three paid tiers, all built on OneAuto US data.
 *
 * None sells the valuation on its own. Under OneAuto's Carketa terms we may
 * include the valuation in a product of our own but may not resell the data
 * standalone, so every tier bundles it with material from other sources. Only
 * `average_market_price_usd`, `low_price_usd` and `high_price_usd` may ever be
 * shown; comparables, days-on-market and the comparables' mileage range are
 * trade-only and are discarded in the API client.
 *
 * `negotiation` is the flagship: it contains both lower tiers plus the pack.
 *
 * No `strike` price on it. The tiers are cumulative, so nobody would ever buy
 * the lower two separately, and presenting $9.98 struck through would be a
 * saving against a purchase no one would make. The value argument is what the
 * pack does, not a fake discount.
 */
export const PRODUCTS = {
  valuation: {
    id: 'valuation',
    name: 'Valuation',
    price: 2.99,
    cents: 299,
    strike: null,
    // Describes ONLY what the $2.99 adds. Recalls, safety ratings, running
    // costs and specs are on the free report for any valid VIN, and this
    // blurb renders both on /pricing and as the Stripe checkout line-item
    // description, so listing them here sold free content as part of the
    // purchase, on the last screen a buyer reads before paying. The same
    // page's own FAQ says those four are free, so it contradicted itself.
    blurb: 'What it’s worth near you at its mileage, the national low, average and high, the nearest listings, and a verdict on the asking price.',
  },
  worthit: {
    id: 'worthit',
    name: 'Full Report',
    price: 6.99,
    cents: 699,
    strike: null,
    blurb: 'Everything in the Valuation with more of the nearest listings, plus what it cost new, its factory options and full standard equipment.',
  },
  negotiation: {
    id: 'negotiation',
    name: 'Negotiation Bundle',
    price: 9.99,
    cents: 999,
    strike: null,
    blurb:
      'Everything in both reports, plus your opening offer, your walk-away price, the 30 nearest listings and the evidence to argue for them.',
  },
} as const;

export type ProductId = keyof typeof PRODUCTS;
export const isProductId = (v: string): v is ProductId =>
  v === 'valuation' || v === 'worthit' || v === 'negotiation';

/** Tiers in ascending order, so "what does this tier include" is a comparison. */
export const TIER_ORDER: ProductId[] = ['valuation', 'worthit', 'negotiation'];
export const tierRank = (p: ProductId) => TIER_ORDER.indexOf(p);

/** Stripe will not process a payment-mode charge below 50 cents USD. */
export const STRIPE_MIN_CENTS = 50;

/**
 * What to charge, in cents, for `to` when the buyer already paid for `from`.
 *
 * The single source of truth for upgrade pricing, deliberately shared by the
 * checkout API and the buy form. Computing it in both places independently is
 * how a customer ends up shown $3.00 and charged $9.99.
 *
 * Credits only a strictly lower tier, and only when the remainder still clears
 * Stripe's minimum. On today's prices every delta is $3.00 or more, so the
 * minimum check never fires; it exists so that changing a price in this file
 * cannot silently produce an unchargeable checkout session.
 */
export function upgradePriceCents(to: ProductId, from: ProductId | null): number {
  const full = PRODUCTS[to].cents;
  if (from === null || tierRank(from) >= tierRank(to)) return full;
  const remainder = full - PRODUCTS[from].cents;
  return remainder >= STRIPE_MIN_CENTS ? remainder : full;
}
/** Does this tier include the factory build record (MSRP, options, warranty)? */
export const includesFactory = (p: ProductId) => tierRank(p) >= tierRank('worthit');
/**
 * Does this tier include the VIN-level recall check?
 *
 * Paid, ~12p a call. Deliberately not on the $2.99 tier: 12p is a fifth of
 * that tier's margin for a section it does not promise. The free NHTSA feed
 * still runs on every tier, it just cannot say whether the work was done.
 */
export const includesRecallCheck = (p: ProductId) => tierRank(p) >= tierRank('worthit');
/** Does this tier include the negotiation pack? */
export const includesNegotiation = (p: ProductId) => tierRank(p) >= tierRank('negotiation');

// Kept for older imports that read a single headline price.
export const REPORT_PRICE_USD = PRODUCTS.worthit.price;
export const REPORT_PRICE_CENTS = PRODUCTS.worthit.cents;

export const SUPPORT_EMAIL = 'support@carworthit.com';
export const MEDIA_EMAIL = 'media@carworthit.com';

// A named, quotable human. Every journalist platform and every data study needs
// one, and its absence is what stops a site being cited rather than just read.
// Keep this factual: no invented titles, no invented credentials.
export const ANALYST = {
  name: 'David Skillett',
  role: 'Founder and Analyst',
  bio:
    'David Skillett founded CarWorthIt after building CarCostCheck, a UK vehicle-data service that analyzes more than 62 million government MOT test records. He works with public vehicle datasets from NHTSA, the EPA and the FBI, and writes CarWorthIt’s data studies and buying guides.',
} as const;

export const HAS_STRIPE = !!process.env.STRIPE_SECRET_KEY;
