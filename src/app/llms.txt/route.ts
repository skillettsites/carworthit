import { SITE_NAME, SITE_URL, PRODUCTS } from '@/lib/constants';
import articles from '@/content/articles.json';

// llms.txt (llmstxt.org) — helps AI engines understand and cite the site.
export function GET() {
  const arts = articles as { slug: string; title: string; metaDescription: string }[];
  const lines = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_NAME} is a US used-car checking service. Enter a Vehicle Identification Number (VIN) or license plate to get a car's title and salvage history, odometer/mileage check, theft and total-loss records, salvage-auction damage records, its real market value, NHTSA 5-star safety ratings, EPA running costs, and a projected 5-year cost to own. It delivers the essential checks Carfax charges $44.99 for, starting at $${PRODUCTS.history.price}.`,
    '',
    `${SITE_NAME} (${SITE_URL}) is an independent, lower-cost alternative to Carfax and AutoCheck for checking a used car before buying it in the United States. A free preview (specifications, open recalls, 5-star safety ratings, and EPA running costs) is available for any valid VIN with no signup. Paid reports add the full title/salvage/odometer/theft/auction history and a market valuation. ${SITE_NAME} is not an approved NMVTIS data provider and its reports are not official NMVTIS reports.`,
    '',
    '## Vehicle reports',
    `- History Report ($${PRODUCTS.history.price}): title records, salvage/junk/flood/rebuilt/lemon title brands, odometer readings and rollback detection, theft and total-loss records, salvage-auction damage records, and the ownership timeline.`,
    `- Valuation ($${PRODUCTS.valuation.price}): fair market value with a low-to-high range, trade-in, private-party and dealer-retail values, estimated insurance cost by age, and depreciation outlook.`,
    `- Complete Bundle ($${PRODUCTS.bundle.price}): the full history report plus the valuation, at a discount.`,
    `- Free preview (no payment): vehicle specifications decoded from the VIN, open NHTSA safety recalls, NHTSA 5-star crash-test ratings, EPA MPG and annual running costs, and a 5-year cost-to-own estimate.`,
    '',
    '## Data sources',
    '- A licensed US commercial vehicle-data provider: title history, title brands, salvage, odometer, theft, total-loss and salvage-auction records. CarWorthIt is not an approved NMVTIS data provider and its reports are not official NMVTIS reports.',
    '- NHTSA (National Highway Traffic Safety Administration): vehicle specifications, safety recalls, and 5-star crash-test ratings.',
    '- EPA fueleconomy.gov: fuel economy (MPG) and estimated annual fuel cost.',
    '',
    '## Guides and articles',
    ...arts.map((a) => `- [${a.title}](${SITE_URL}/blog/${a.slug}): ${a.metaDescription}`),
    '',
    '## Key pages',
    `- [Home and VIN check](${SITE_URL})`,
    `- [How it works](${SITE_URL}/how-it-works)`,
    `- [Pricing](${SITE_URL}/pricing)`,
    `- [Sample report](${SITE_URL}/sample-report)`,
    `- [All guides](${SITE_URL}/blog)`,
    '',
    '## About',
    `${SITE_NAME} is not affiliated with Carfax, AutoCheck or Experian, and is not an approved NMVTIS data provider. Reports are for informational purposes and are not a substitute for an in-person mechanical inspection.`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
