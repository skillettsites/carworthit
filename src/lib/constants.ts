// Site-wide configuration for CarWorthIt (US market)
// Pre-data-provider launch: the site is fully live with the FREE preview working,
// but paid checkout + plate lookup are held back until the VinAudit/ClearVin key
// is in. Flip both to true (and redeploy) to go fully live.
export const CHECKOUT_ENABLED = false; // buy buttons show "Coming soon" while false
export const PLATE_ENABLED = false; // plate->VIN needs the paid API; VIN-only while false

export const SITE_NAME = 'CarWorthIt';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://carworthit.com';
export const SITE_TAGLINE = 'Know what a used car is really worth, before you buy.';
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-GKFGSRW0KL';
export const SITE_DESCRIPTION =
  'Run any US car by its VIN and get the title history, salvage/theft checks, real mileage, recalls, running costs and what it should cost to own, the essential checks Carfax charges $44.99 for, for $9.99.';

export const REPORT_PRICE_USD = 9.99;
export const REPORT_PRICE_CENTS = 999;
export const CURRENCY = 'usd';

// Three products, mirroring CarCostCheck (valuation / history / bundle).
export const PRODUCTS = {
  valuation: { id: 'valuation', name: 'Valuation', price: 4.99, cents: 499, strike: null },
  history: { id: 'history', name: 'History Report', price: 9.99, cents: 999, strike: null },
  bundle: { id: 'bundle', name: 'Complete Bundle', price: 12.99, cents: 1299, strike: 14.98 },
} as const;
export type ProductId = keyof typeof PRODUCTS;
export const isProductId = (v: string): v is ProductId => v === 'valuation' || v === 'history' || v === 'bundle';

export const SUPPORT_EMAIL = 'support@carworthit.com';

// Whether the paid VinAudit data is live. Flips automatically when the key is set.
export const HAS_VINAUDIT = !!process.env.VINAUDIT_KEY;
export const HAS_STRIPE = !!process.env.STRIPE_SECRET_KEY;
