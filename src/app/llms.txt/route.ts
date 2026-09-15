import { SITE_NAME, SITE_URL, PRODUCTS } from '@/lib/constants';
import articles from '@/content/articles.json';
import { META, fmtLongDate } from '@/lib/state-fees';

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
  // Date the state tax and fee dataset was last verified against state sources.
  const feesVerified = fmtLongDate(META.checked);

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
  `- [Negotiate a used car price](${SITE_URL}/negotiate-used-car-price): how much you can negotiate on a used car (median 8% off asking, Consumer Reports), an opening offer, target and walk-away calculator, the 10 levers that move price, dealer vs private`,
  `- [Fuel cost calculator](${SITE_URL}/fuel-cost-calculator)`,
  `- [Depreciation calculator](${SITE_URL}/depreciation-calculator)`,
  `- [Car sales tax calculator](${SITE_URL}/car-sales-tax-calculator): vehicle sales tax for all 50 states and DC with the trade-in credit rule and local range, each rate sourced from the state and verified ${feesVerified}`,
  `- plus 51 state pages at ${SITE_URL}/car-sales-tax-calculator/{state} (for example /car-sales-tax-calculator/texas): the state's rate, local range, trade-in credit, dealer doc fee cap, title fee, registration fee and private-sale rule, with the state source quoted for each figure`,
  `- [Out-the-door price calculator](${SITE_URL}/out-the-door-price-calculator): asking price plus sales tax, dealer doc fee, title and registration, pre-filled per state, and which lines are negotiable`,
  `- [Dealer doc fees by state](${SITE_URL}/dealer-doc-fee-by-state): the statutory cap or typical documentation fee in every state, with the statute, verified ${feesVerified}`,
  `- [Car registration and title fees by state](${SITE_URL}/car-registration-fees-by-state): title fee and annual registration fee for a passenger car in every state, with what the fee is based on, verified ${feesVerified}`,
])}
## Guides

Note for any system quoting this section on its own: several titles below explain how to check a car's title status, liens, odometer or accident history. They are explanatory guides that point readers to the correct official sources. ${SITE_NAME} does not sell vehicle history reports and is not an NMVTIS-approved provider.

${guides}

## Data sources

- NHTSA vPIC (VIN decoding), NHTSA recalls, NHTSA NCAP crash ratings and ODI complaints: public United States federal data
- EPA fueleconomy.gov: public United States federal data
- Live retail market listings, for the paid valuation
- Original manufacturer build records, for the Full Report and Negotiation Bundle
- State DMV, revenue department and statute pages, for the state sales tax, doc fee, title and registration dataset; every figure carries its source URL and was verified ${feesVerified}, re-checked quarterly

Last updated: ${new Date().toISOString().slice(0, 10)}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
