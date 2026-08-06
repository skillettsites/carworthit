// Site-wide configuration for CarWorthIt (US market).

// Paid reports. Held back until the Stripe key is rotated and added to the
// Vercel production environment; the buy buttons show "Coming soon" while false.
export const CHECKOUT_ENABLED = process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === 'true';
// Plate to VIN exists and is cheap (5p) but adds nothing to the core product yet.
export const PLATE_ENABLED = false;

export const SITE_NAME = 'CarWorthIt';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://carworthit.com';
export const SITE_TAGLINE = 'Price any used car by its VIN, and find out if it’s worth it.';
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-GKFGSRW0KL';

// Leads on the VIN valuation intent, which is where the search volume actually
// is. Deliberately quotes no competitor price: they change without notice and a
// stale figure in a meta description is wrong everywhere at once.
export const SITE_DESCRIPTION =
  'Price any US car by its VIN, against cars actually for sale near you, at its real mileage. Free VIN report with specs, open recalls, safety ratings and running costs, no signup.';

export const CURRENCY = 'usd';

/**
 * Two paid tiers, both built on OneAuto US data.
 *
 * Neither sells the valuation on its own. Under OneAuto's Carketa terms we may
 * include the valuation in a product of our own but may not resell the data
 * standalone, so every tier bundles it with material from other sources. Only
 * `average_market_price_usd`, `low_price_usd` and `high_price_usd` may ever be
 * shown; comparables, days-on-market and the comparables' mileage range are
 * trade-only and are discarded in the API client.
 */
export const PRODUCTS = {
  valuation: {
    id: 'valuation',
    name: 'Value Report',
    price: 2.99,
    cents: 299,
    strike: null,
    blurb: 'What it’s worth near you, a verdict on the asking price, plus recalls, safety and running costs.',
  },
  worthit: {
    id: 'worthit',
    name: 'Worth It Report',
    price: 6.99,
    cents: 699,
    strike: null,
    blurb: 'Everything in the Value Report, plus what it cost new, its factory options and full standard equipment.',
  },
} as const;

export type ProductId = keyof typeof PRODUCTS;
export const isProductId = (v: string): v is ProductId => v === 'valuation' || v === 'worthit';

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
    'David Skillett founded CarWorthIt after building CarCostCheck, a UK vehicle-data service that analyses more than 62 million government MOT test records. He works with public vehicle datasets from NHTSA, the EPA and the FBI, and writes CarWorthIt’s data studies and buying guides.',
} as const;

export const HAS_STRIPE = !!process.env.STRIPE_SECRET_KEY;
