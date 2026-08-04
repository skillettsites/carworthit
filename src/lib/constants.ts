// Site-wide configuration for CarWorthIt (US market)
// Pre-data-provider launch: the site is fully live with the FREE preview working,
// but paid checkout + plate lookup are held back until the Vehicle Databases key
// is in. Flip both to true (and redeploy) to go fully live.
export const CHECKOUT_ENABLED = false; // buy buttons show "Coming soon" while false
export const PLATE_ENABLED = false; // plate->VIN needs the paid API; VIN-only while false

export const SITE_NAME = 'CarWorthIt';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://carworthit.com';
export const SITE_TAGLINE = 'Know what a used car is really worth, before you buy.';
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-GKFGSRW0KL';
// Deliberately quotes no competitor price. Carfax and AutoCheck change theirs
// without notice and a stale figure in a meta description is both wrong
// everywhere at once and impossible to spot. Compare on what we do, not on a
// number we cannot keep current.
// Leads on the VIN valuation intent, which is where the searches actually are
// ("price my car by vin" and "car value check", ~20k/mo combined), not on
// "is this car worth it" (50/mo), which is the brand promise, not the query.
// Careful to promise free only for what is genuinely free: the VIN report.
export const SITE_DESCRIPTION =
  'Price any US car by its VIN, priced against local comparables at its real mileage, not a generic year and model guess. Free VIN report with specs, open recalls, safety ratings and running costs, no signup.';

export const REPORT_PRICE_USD = 6.99;
export const REPORT_PRICE_CENTS = 699;
export const CURRENCY = 'usd';

// Three products, mirroring CarCostCheck (valuation / history / bundle).
export const PRODUCTS = {
  valuation: { id: 'valuation', name: 'Valuation', price: 2.99, cents: 299, strike: null },
  history: { id: 'history', name: 'History Report', price: 6.99, cents: 699, strike: null },
  bundle: { id: 'bundle', name: 'Complete Bundle', price: 8.99, cents: 899, strike: 9.98 },
} as const;
export type ProductId = keyof typeof PRODUCTS;
export const isProductId = (v: string): v is ProductId => v === 'valuation' || v === 'history' || v === 'bundle';

export const SUPPORT_EMAIL = 'support@carworthit.com';
export const MEDIA_EMAIL = 'media@carworthit.com';

// A named, quotable human. Every journalist platform and every data study
// needs one, and its absence is what stops a site being cited rather than
// just read. Keep this factual: no invented titles, no invented credentials.
export const ANALYST = {
  name: 'David Skillett',
  role: 'Founder and Analyst',
  bio:
    'David Skillett founded CarWorthIt after building CarCostCheck, a UK vehicle-data service that analyses more than 62 million government MOT test records. He works with public vehicle datasets from NHTSA, the EPA and the FBI, and writes CarWorthIt’s data studies and buying guides.',
} as const;

// Whether the paid Vehicle Databases data is live. Flips automatically when the key is set.
export const HAS_VDB = !!process.env.VEHICLEDATABASES_KEY;
export const HAS_STRIPE = !!process.env.STRIPE_SECRET_KEY;
