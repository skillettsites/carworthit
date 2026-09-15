import { PRODUCTS } from './constants';

/**
 * Vehicle history report (VHR) providers: prices, terms and NMVTIS status.
 *
 * ONE dataset feeds every page in the history-report cluster
 * (/best-vehicle-history-report, /blog/carfax-report-cost,
 * /blog/is-carfax-worth-it, /bumper-review, /autocheck-free,
 * /vehicle-history-faq). A price lives here once, so a refresh is one edit
 * and the pages cannot disagree with each other.
 *
 * Every figure was read from the provider's own site on CHECKED_ON. The
 * `sources` entries say exactly which URL each number came from and how it was
 * fetched, so the next person can re-verify in minutes. Carfax geo-redirects
 * non-US traffic to carfax.eu and renders its packages client-side, so its
 * purchase page was read through a US-side rendering proxy; the URL recorded
 * is Carfax's own. Anything that could not be read from the provider is
 * marked "not verified" rather than guessed.
 *
 * CarWorthIt is NOT a history report and is NOT an NMVTIS provider. It is in
 * the table only because people compare it, and its row says so plainly.
 */

/** ISO date the prices below were read. Update this whenever a price is. */
export const CHECKED_ON = '2026-09-15';
/** The same date written out, for on-page "checked on" lines. */
export const CHECKED_ON_LONG = 'September 15, 2026';

export interface Source {
  /** What the source establishes. */
  claim: string;
  url: string;
  /** ISO date the page was read. */
  checked: string;
  /** How it was read, when that matters for re-verification. */
  note?: string;
}

export const VHR_SOURCES: Source[] = [
  {
    claim: 'Carfax packages: 1 report $49.99; 2 reports $69.99 ($34.99 each); 4 reports $119.99 ($30.00 each)',
    url: 'https://secure.carfax.com/creditCard.cfx?previousPage=vhrl',
    checked: CHECKED_ON,
    note: 'carfax.com redirects non-US visitors to carfax.eu and loads its package prices client-side, so the purchase page was rendered through a US-side reader (r.jina.ai). The package names and prices are quoted verbatim.',
  },
  {
    claim: 'Carfax: every Carfax used-car listing includes a free Carfax report; dealers often link free reports; ask a private seller for theirs',
    url: 'https://support.carfax.com/article/can-i-get-free-carfax-vehicle-history-reports/',
    checked: CHECKED_ON,
    note: 'Read through the same US-side reader; support.carfax.com returns 403 to non-US requests.',
  },
  {
    claim: 'Carfax History-Based Value examples: 2012 Toyota Camry SE $14,230 with no accidents against $13,410 with accidents; 2014 Ford F-150 XL $23,290 with regular oil changes against $21,970 with no service records',
    url: 'https://www.carfax.com/vehicle-history-reports/',
    checked: '2026-09-14',
    note: 'Read from the Internet Archive capture of September 14, 2026, because carfax.com redirects non-US readers to carfax.eu.',
  },
  {
    claim: 'Carfax describes its database as "containing billions of records from more than 151,000 domestic and international sources" and lists service history items (oil changes, tire rotations, brake rotor replacement, transmission replacement) among what every report checks for',
    url: 'https://www.carfax.com/vehicle-history-reports/',
    checked: '2026-09-14',
    note: 'Internet Archive capture of September 14, 2026 (carfax.com geo-blocks non-US readers).',
  },
  {
    claim: 'AutoCheck for Business description: "Data from 95% of all U.S. auction houses, with most providing exclusive structural damage announcements" and "tens of thousands of distinct accident sources"',
    url: 'https://www.autocheck.com/consumer-api/product/v1/partner',
    checked: CHECKED_ON,
  },
  {
    claim: 'FTC: dealers must display a Buyers Guide in every used car offered for sale, stating whether the car is sold "as is" or with a warranty',
    url: 'https://consumer.ftc.gov/articles/buying-used-car-dealer',
    checked: CHECKED_ON,
  },
  {
    claim: 'Carfax Terms of Use section 5: access is for personal, non-commercial use only; "You may not resell or make any commercial use of any Service(s)"',
    url: 'https://www.carfax.com/company/terms-of-use',
    checked: CHECKED_ON,
  },
  {
    claim: 'AutoCheck: Single Report $29.99 one-time with 21 days of data updates; 5 Reports for 21 Days $59.99 one-time; AutoCheck for Business $99.99',
    url: 'https://www.autocheck.com/consumer-api/product/v1/partner',
    checked: CHECKED_ON,
    note: 'AutoCheck’s own product feed, the JSON that autocheck.com/vehiclehistory renders its package picker from. Names and descriptions quoted verbatim.',
  },
  {
    claim: 'eBay Motors: "Many sellers include a vehicle history report from AutoCheck. If they have, you’ll find it in the “Vehicle History Report” tab. If the seller hasn’t provided a report, you’ll have the option to buy one."',
    url: 'https://www.ebay.com/help/buying/getting-started-ebay/buying-vehicles-parts-accessories?id=4639',
    checked: CHECKED_ON,
  },
  {
    claim: 'Bumper membership: $27.99 per month for 50 reports a month with PDF download; 3 months $54.58; "Plans start at $27.99 per month"',
    url: 'https://www.bumper.com/lp/114010/4/subscribe',
    checked: CHECKED_ON,
    note: 'Plan amounts read from the subscription_plans data embedded in Bumper’s checkout page (2799 and 5458 cents). The homepage FAQ at bumper.com states "Plans start at $27.99 per month". Bumper runs checkout price tests, so a visitor may be shown a different variant.',
  },
  {
    claim: 'Bumper 7-day trial: $1.00 up front (no PDF) or $5.00 (with PDF), then $27.99 per month, renewing every 30 days until cancelled',
    url: 'https://www.bumper.com/lp/114010/5/special-offer',
    checked: CHECKED_ON,
  },
  {
    claim: 'Bumper single report: $31.99, shown as a one-time payment',
    url: 'https://www.bumper.com/lp/114010/6/one-report',
    checked: CHECKED_ON,
  },
  {
    claim: 'Bumper cancellation (Terms s.17): cancel anytime in My Account, by phone 1-332-225-9745, by email or the contact form; cancellation does not refund charges already incurred. Refunds (s.18): case by case, typically one per subscription',
    url: 'https://www.bumper.com/terms/',
    checked: CHECKED_ON,
  },
  {
    claim: 'EpicVIN (US pricing): 1 report $24.99; 4 reports $29.99; 16 reports $86.34; 3-day trial $1 (up to 5 reports a day) then $49.99 plus tax per month; cancel anytime online',
    url: 'https://epicvin.com/price',
    checked: CHECKED_ON,
    note: 'The US region page, selected with the site’s own region switch. The global page shows different subscription pricing.',
  },
  {
    claim: 'VinAudit: single report $9.99; 5 reports $19.99; 10 reports $29.99; "VinAudit is an approved NMVTIS data provider"',
    url: 'https://www.vinaudit.com/',
    checked: CHECKED_ON,
  },
  {
    claim: 'ClearVin: 1 report $17.99; 2 reports $23.98; 5 reports $28.99; approved NMVTIS provider; does not include maintenance records',
    url: 'https://www.clearvin.com/en/payment/buy-credits/',
    checked: CHECKED_ON,
  },
  {
    claim: 'NICB VINCheck: free; reports stolen-not-recovered and insurer salvage or flood total-loss records from participating insurers; maximum five searches per 24 hours per IP address',
    url: 'https://www.nicb.org/vincheck',
    checked: CHECKED_ON,
  },
  {
    claim: 'NHTSA recall lookup by VIN: free; shows unrepaired safety recalls',
    url: 'https://www.nhtsa.gov/recalls',
    checked: CHECKED_ON,
  },
  {
    claim: 'US DOJ list of approved NMVTIS data providers; consumers cannot get NMVTIS reports from Carfax, DMVDesk or Experian (AutoCheck)',
    url: 'https://vehiclehistory.bja.ojp.gov/nmvtis_vehiclehistory',
    checked: CHECKED_ON,
  },
  {
    claim: 'What an NMVTIS report contains: current state of title and last title date, brand history, odometer reading, total loss history, salvage history; sources are state titling agencies, junk and salvage yards, auto recyclers and insurers',
    url: 'https://vehiclehistory.bja.ojp.gov/nmvtis_understandingvhr',
    checked: CHECKED_ON,
  },
  {
    claim: 'NMVTIS glossary: a brand is "a designation placed on a vehicle ownership document ... which identifies or describes an event that affects the value or safety of the vehicle, such as Junk, Salvage, or Flood"; a cloned vehicle carries a legitimate VIN plate replicated from another car; the odometer reading is reported to NMVTIS when a state titles the vehicle; all fifty states participated in FY2023',
    url: 'https://vehiclehistory.bja.ojp.gov/nmvtis-annual-reports-and-financial-audits/glossary',
    checked: CHECKED_ON,
  },
  {
    claim: 'NMVTIS definition of a title brand: "a descriptive label that states assign to a vehicle to identify the vehicle’s current or prior condition, such as junk, salvage, flood"',
    url: 'https://vehiclehistory.bja.ojp.gov/nmvtis_consumers',
    checked: CHECKED_ON,
  },
];

export type Nmvtis = 'yes' | 'no' | 'commercial-only' | 'n/a';

export interface Provider {
  id: string;
  name: string;
  url: string;
  /** Headline single-report price, as shown by the provider. */
  single: string;
  /** Multi-report or subscription options, in the provider's own terms. */
  packs: string;
  model: 'One-time' | 'Subscription' | 'One-time or subscription' | 'Free' | 'Not a history report';
  nmvtis: Nmvtis;
  includes: string;
  /** What it does not have, in one line. */
  gap: string;
  /** Who it is the honest pick for. */
  bestFor: string;
}

/** Ordered for the comparison table: free first, then cheapest paid, then premium, then us. */
export const PROVIDERS: Provider[] = [
  {
    id: 'nicb',
    name: 'NICB VINCheck',
    url: 'https://www.nicb.org/vincheck',
    single: 'Free',
    packs: 'Five lookups per 24 hours per IP address',
    model: 'Free',
    nmvtis: 'n/a',
    includes: 'Reported stolen and not recovered; salvage or flood total-loss from participating insurers',
    gap: 'No title history, no odometer, no accidents; only participating insurers',
    bestFor: 'A free first screen on every car',
  },
  {
    id: 'nhtsa',
    name: 'NHTSA recall lookup',
    url: 'https://www.nhtsa.gov/recalls',
    single: 'Free',
    packs: 'Unlimited',
    model: 'Free',
    nmvtis: 'n/a',
    includes: 'Unrepaired safety recalls for the VIN',
    gap: 'Nothing about title, damage or ownership',
    bestFor: 'Every car, before you visit',
  },
  {
    id: 'vinaudit',
    name: 'VinAudit',
    url: 'https://www.vinaudit.com/',
    single: '$9.99',
    packs: '5 for $19.99; 10 for $29.99',
    model: 'One-time',
    nmvtis: 'yes',
    includes: 'NMVTIS title, brand, odometer, total-loss and salvage records, plus a market value',
    gap: 'No dealer service history; accident detail is thinner than Carfax',
    bestFor: 'Cheapest NMVTIS-approved title check',
  },
  {
    id: 'clearvin',
    name: 'ClearVin',
    url: 'https://www.clearvin.com/',
    single: '$17.99',
    packs: '2 for $23.98; 5 for $28.99',
    model: 'One-time',
    nmvtis: 'yes',
    includes: 'NMVTIS title and brand history, total loss, junk and salvage, liens and impounds, sales history, auction photos',
    gap: 'No maintenance records (stated on its site)',
    bestFor: 'Auction photos of past damage',
  },
  {
    id: 'epicvin',
    name: 'EpicVIN',
    url: 'https://epicvin.com/',
    single: '$24.99',
    packs: '4 for $29.99; 16 for $86.34; or a $1 three-day trial then $49.99 a month',
    model: 'One-time or subscription',
    nmvtis: 'yes',
    includes: 'NMVTIS title brands, total loss, odometer rollback alert, liens, auction sales history and photos, theft records',
    gap: 'No dealer service history; the $1 trial converts to $49.99 a month unless cancelled',
    bestFor: 'Four cars for $29.99 if you skip the trial',
  },
  {
    id: 'bumper',
    name: 'Bumper',
    url: 'https://www.bumper.com/',
    single: '$31.99',
    packs: '$27.99 a month for 50 reports; 3 months $54.58; $1 or $5 seven-day trial then $27.99 a month',
    model: 'One-time or subscription',
    nmvtis: 'yes',
    includes: 'Accident lookups (coverage varies by state), salvage and theft lookups, title and lien details, sales history, market value, recalls and specs, PDF download on most plans',
    gap: 'Membership auto-renews every 30 days until you cancel; one-time report costs more than a month',
    bestFor: 'Checking many cars in one month',
  },
  {
    id: 'autocheck',
    name: 'AutoCheck (Experian)',
    url: 'https://www.autocheck.com/vehiclehistory/',
    single: '$29.99',
    packs: '5 reports for 21 days, $59.99',
    model: 'One-time',
    nmvtis: 'commercial-only',
    includes: 'Accident and damage records, auction announcements, title and odometer data, the AutoCheck Score, 21 days of data updates',
    gap: 'Consumers cannot buy an NMVTIS report from Experian; thinner service history than Carfax',
    bestFor: 'Comparing up to five cars, or free on eBay Motors listings',
  },
  {
    id: 'carfax',
    name: 'Carfax',
    url: 'https://www.carfax.com/vehicle-history-reports/',
    single: '$49.99',
    packs: '2 for $69.99; 4 for $119.99',
    model: 'One-time',
    nmvtis: 'commercial-only',
    includes: 'Reported accidents with severity and point of impact, dealer service records, ownership history, odometer, title and lemon or flood brands',
    gap: 'Most expensive; consumers cannot buy an NMVTIS report from Carfax; only records reported to Carfax',
    bestFor: 'One expensive car where the service trail matters, or free on a Carfax or dealer listing',
  },
  {
    id: 'carworthit',
    name: `CarWorthIt (not a history report)`,
    url: '/',
    single: `Free decode; valuation $${PRODUCTS.valuation.price}; Worth It report $${PRODUCTS.worthit.price}`,
    packs: `Negotiation bundle $${PRODUCTS.negotiation.price}; one-time, no subscription`,
    model: 'Not a history report',
    nmvtis: 'no',
    includes: 'Specs, open recalls, crash ratings and running costs free; then what the car is worth near you at its mileage, what it cost new and its factory options',
    gap: 'No title, accident, theft, odometer or lien records. Buy those from a provider above.',
    bestFor: 'Deciding what to pay once the history is clean',
  },
];

export const byId = (id: string): Provider => {
  const p = PROVIDERS.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown provider ${id}`);
  return p;
};

/** Plain-English rendering of the NMVTIS column. */
export function nmvtisLabel(n: Nmvtis): string {
  switch (n) {
    case 'yes':
      return 'Yes, approved';
    case 'no':
      return 'No';
    case 'commercial-only':
      return 'Dealers only, not consumers';
    default:
      return 'Not applicable';
  }
}

/** Carfax figures, spelled out for the cost page. */
export const CARFAX = {
  one: '$49.99',
  two: '$69.99',
  twoEach: '$34.99',
  four: '$119.99',
  fourEach: '$30.00',
  url: 'https://www.carfax.com/vehicle-history-reports/',
  purchaseUrl: 'https://secure.carfax.com/creditCard.cfx?previousPage=vhrl',
  freeUrl: 'https://support.carfax.com/article/can-i-get-free-carfax-vehicle-history-reports/',
  listingsUrl: 'https://www.carfax.com/cars-for-sale',
  termsUrl: 'https://www.carfax.com/company/terms-of-use',
} as const;

export const AUTOCHECK = {
  single: '$29.99',
  singleName: 'Single Report',
  five: '$59.99',
  fiveName: '5 Reports for 21 Days',
  business: '$99.99',
  updatesDays: 21,
  url: 'https://www.autocheck.com/vehiclehistory/',
  ebayHelpUrl: 'https://www.ebay.com/help/buying/getting-started-ebay/buying-vehicles-parts-accessories?id=4639',
} as const;

export const BUMPER = {
  monthly: '$27.99',
  monthlyReports: 50,
  threeMonth: '$54.58',
  trialLow: '$1.00',
  trialHigh: '$5.00',
  trialDays: 7,
  single: '$31.99',
  phone: '1-332-225-9745',
  url: 'https://www.bumper.com/',
  termsUrl: 'https://www.bumper.com/terms/',
} as const;

export const EPICVIN = {
  one: '$24.99',
  four: '$29.99',
  sixteen: '$86.34',
  sixteenEach: '$5.40',
  trial: '$1',
  trialDays: 3,
  trialDailyCap: 5,
  monthly: '$49.99',
  url: 'https://epicvin.com/',
} as const;

export const VINAUDIT = { one: '$9.99', five: '$19.99', ten: '$29.99', url: 'https://www.vinaudit.com/' } as const;
export const CLEARVIN = { one: '$17.99', two: '$23.98', five: '$28.99', url: 'https://www.clearvin.com/' } as const;

export const NMVTIS = {
  providersUrl: 'https://vehiclehistory.bja.ojp.gov/nmvtis_vehiclehistory',
  understandingUrl: 'https://vehiclehistory.bja.ojp.gov/nmvtis_understandingvhr',
  consumersUrl: 'https://vehiclehistory.bja.ojp.gov/nmvtis_consumers',
  glossaryUrl: 'https://vehiclehistory.bja.ojp.gov/nmvtis-annual-reports-and-financial-audits/glossary',
  /** Approved to sell NMVTIS reports to the public, per the DOJ list on CHECKED_ON. */
  publicProviders: [
    'Bumper.com',
    'Carsforsale.com',
    'Carvertical.com',
    'Checkthatvin.com',
    'Clearvin.com',
    'EpicVin.com',
    'GoodCar.com',
    'Titlecheck.us',
    'Vinaudit.com',
    'Vindata.com',
    'VinReport',
    'Vinsmart.com',
  ],
  /** Listed as commercial-only: dealers and businesses, not consumers. */
  commercialOnly: ['OneAIB', 'add123', 'CARFAX (California, commercial customers only)', 'Vitu', 'Experian (AutoCheck)', 'Yassi'],
} as const;

export const NICB = { url: 'https://www.nicb.org/vincheck', dailyCap: 5 } as const;
export const NHTSA_RECALLS = { url: 'https://www.nhtsa.gov/recalls' } as const;
