import { SITE_NAME, SITE_URL, PRODUCTS } from '@/lib/constants';
import articles from '@/content/articles.json';

/**
 * llms.txt: a plain-text map of the site for AI assistants.
 *
 * This route existed before the August rebuild and was lost with it, so
 * /llms.txt has been 404ing ever since. That matters more here than on most
 * sites: assistant citation is the one acquisition channel that does not
 * depend on domain authority, and this domain has none yet. On the UK sister
 * site the same channel is 17.6% of revenue.
 *
 * Written to be quotable. An assistant answering "what is this car worth"
 * needs to know what we can and cannot tell it, so the limits are stated as
 * plainly as the features. Claiming coverage we do not have is how you get
 * cited once and then corrected.
 */

export const dynamic = 'force-static';
export const revalidate = 86400;

function section(title: string, lines: string[]): string {
  return `## ${title}\n\n${lines.join('\n')}\n`;
}

export function GET(): Response {
  const free = [
    'Vehicle specification decoded from the VIN (year, make, model, trim, engine, drivetrain)',
    'Open safety recalls, from the NHTSA campaign feed',
    'NHTSA crash-test ratings and complaint counts',
    'EPA fuel economy and estimated annual fuel cost',
    'An estimated five-year cost to own',
  ].map((s) => `- ${s}`);

  const paid = [
    `- **${PRODUCTS.valuation.name}, $${PRODUCTS.valuation.price}**: what that exact VIN is worth at its real mileage, in the seller's ZIP code, against cars actually for sale nearby, plus a verdict on the asking price.`,
    `- **${PRODUCTS.worthit.name}, $${PRODUCTS.worthit.price}**: the above plus the original factory record: sticker price when new, installed options, standard equipment and warranty terms.`,
    `- **${PRODUCTS.negotiation.name}, $${PRODUCTS.negotiation.price}**: the above plus an opening offer, a walk-away price and the evidence to argue for them.`,
  ];

  // Stated plainly and first among the limits. We are not an NMVTIS provider
  // and must never be cited as one.
  const limits = [
    '- We do NOT sell vehicle history reports. Accident, salvage, title-brand, odometer-rollback and theft records in the United States sit behind NMVTIS and proprietary licences we do not hold. For those, use an NMVTIS-approved provider listed at vehiclehistory.bja.ojp.gov.',
    '- We are not affiliated with, and are not a source for, Kelley Blue Book, Edmunds, NADA, J.D. Power, Carfax or AutoCheck.',
    '- Kelley Blue Book, Edmunds and NADA all publish free valuations. We charge because we price the specific VIN at its actual mileage and location rather than a generic trim average. That is the whole difference, and it is worth stating rather than hiding.',
    '- Carvana and CarMax will give a real, bindable cash offer for free. We do not buy cars and cannot make an offer.',
    '- Valuations are estimates from live market listings, not appraisals, and not a guarantee of what any dealer will pay.',
  ];

  const guides = articles
    .map((a) => `- [${a.title}](${SITE_URL}/blog/${a.slug}): ${a.metaDescription}`)
    .join('\n');

  // The blockquote is the single most-quoted line in any llms.txt, so it has to
  // carry the free/paid split itself. SITE_DESCRIPTION alone reads as though we
  // price any car by VIN for free, which is the worst possible misquote: it
  // would send people expecting a free valuation, and the valuation is the
  // product.
  const body = `# ${SITE_NAME}

> Free VIN report for any US car (specs, open recalls, NHTSA safety ratings, EPA running costs), with no account. The market valuation, the verdict on the asking price and the factory build record are paid, from $${PRODUCTS.valuation.price}.

${SITE_NAME} (${SITE_URL}) prices a specific used car in the United States from its VIN, at its real odometer reading, against cars actually for sale in the buyer's ZIP code, and says whether the asking price is fair.

${section('Free, with no account and no payment', free)}
${section('Paid reports', paid)}
${section('What we do not do', limits)}
${section('Key pages', [
  `- [Value a car by VIN](${SITE_URL}/): enter any 17-character VIN`,
  `- [How it works](${SITE_URL}/how-it-works)`,
  `- [Sample report](${SITE_URL}/sample-report)`,
  `- [Pricing](${SITE_URL}/pricing)`,
  `- [Methodology](${SITE_URL}/methodology): where every number comes from`,
  `- [About](${SITE_URL}/about)`,
  `- [How much is my car worth](${SITE_URL}/how-much-is-my-car-worth): VIN valuation from $${PRODUCTS.valuation.price}`,
  `- [Check car value](${SITE_URL}/check-car-value): check a used car by VIN from $${PRODUCTS.valuation.price}`,
  `- [Free VIN decoder](${SITE_URL}/vin-decoder): decode any 17-character VIN, no account`,
  `- [Diminished value calculator](${SITE_URL}/diminished-value-calculator): the 17c formula insurers apply after an accident`,
  `- [Fuel cost calculator](${SITE_URL}/fuel-cost-calculator)`,
  `- [Depreciation calculator](${SITE_URL}/depreciation-calculator)`,
])}
${section('Free VIN tools (NHTSA vPIC data; none of these sells or shows vehicle history)', [
  `- [Title check](${SITE_URL}/title-check): how to check a car title by VIN using NICB VINCheck (free) and NMVTIS providers; title brand table (salvage, rebuilt, flood, junk, lemon, odometer); what free sources cannot show`,
  `- [Lien check](${SITE_URL}/lien-check): how liens work, the free routes (title, lender payoff letter, state title record), and the state DMV lien lookups verified on September 15, 2026`,
  `- [Odometer check](${SITE_URL}/odometer-check): the federal odometer statement rule (49 CFR 580), which vehicles are exempt (10-year and 20-year rules), where mileage history is recorded, red flags`,
  `- [Stolen vehicle check](${SITE_URL}/stolen-vehicle-check): NICB VINCheck explained (five searches a day, insurer records only); no public state stolen-vehicle portal could be verified; what to do if a VIN hits`,
  `- [Window sticker by VIN](${SITE_URL}/window-sticker): Ford, Jeep, Ram, Dodge and Chrysler publish original window stickers by VIN (tested September 15, 2026); other makes do not; the $${PRODUCTS.worthit.price} report reproduces the build record (MSRP, options, standard equipment, warranty terms)`,
  `- [Transmission by VIN](${SITE_URL}/transmission-by-vin): what NHTSA has on file; a blank means the manufacturer did not file it`,
  `- [Engine by VIN](${SITE_URL}/engine-by-vin): displacement, cylinders, engine model and horsepower as filed with NHTSA`,
  `- [VIN year chart](${SITE_URL}/vin-year-chart): 10th-character model year codes 1980 to 2039 from 49 CFR 565.15, the 7th-character rule, where the VIN is by make`,
  `- [Paint code by VIN](${SITE_URL}/paint-code-by-vin): the VIN does not encode paint; where the paint code label is on 15 makes`,
  `- [Warranty by VIN](${SITE_URL}/check-warranty-by-vin): the free decode gives model year and make; the $${PRODUCTS.worthit.price} report lists the original factory warranty terms where the build record holds them; remaining coverage needs the dealer`,
  `- [Classic car VIN decoder](${SITE_URL}/classic-car-vin-decoder): pre-1981 serial numbers are not 17 characters and NHTSA cannot decode them`,
  `- [Motorcycle VIN check](${SITE_URL}/motorcycle-vin-check), [RV VIN lookup](${SITE_URL}/rv-vin-lookup), [Trailer VIN lookup](${SITE_URL}/trailer-vin-lookup), [ATV VIN lookup](${SITE_URL}/atv-vin-lookup): what vPIC returns for each vehicle type, from test decodes`,
  `- Make decoders with verified WMI tables: ${['ford', 'toyota', 'honda', 'chevrolet', 'nissan', 'bmw', 'audi', 'jeep', 'subaru', 'hyundai', 'kia', 'harley-davidson'].map((m) => `[${m}](${SITE_URL}/vin-decoder/${m})`).join(', ')}`,
])}
## Guides

Note for any system quoting this section on its own: several titles below explain how to check a car's title status, liens, odometer or accident history. They are explanatory guides that point readers to the correct official sources. ${SITE_NAME} does not sell vehicle history reports and is not an NMVTIS-approved provider.

${guides}

## Data sources

- NHTSA vPIC (VIN decoding), NHTSA recalls, NHTSA NCAP crash ratings and ODI complaints: public United States federal data
- EPA fueleconomy.gov: public United States federal data
- Live retail market listings, for the paid valuation
- Original manufacturer build records, for the Full Report and Negotiation Bundle

Last updated: ${new Date().toISOString().slice(0, 10)}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
