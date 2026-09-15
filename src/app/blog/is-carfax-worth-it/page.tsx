import type { Metadata } from 'next';
import Link from 'next/link';
import PostShell from '@/components/PostShell';
import { SourcesNote } from '@/components/DecisionBits';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import { CHECKED_ON, CHECKED_ON_LONG, CARFAX, AUTOCHECK, VINAUDIT, EPICVIN, VHR_SOURCES } from '@/lib/vhr-providers';

/**
 * Same slug as before, on purpose: this URL already sits at positions 28 to 50
 * for "is carfax worth it", "carfax worth it" and "is carfax value accurate"
 * with 105 impressions and no clicks. The old version opened with two
 * paragraphs of throat-clearing and never named a price. This one answers in
 * the first sentence, dates every figure, and sends the cost questions that
 * were leaking onto it to /blog/carfax-report-cost.
 *
 * Built as a page rather than an articles.json body so the prices come from
 * src/lib/vhr-providers.ts.
 */

const SLUG = 'is-carfax-worth-it';
const TITLE = 'Is Carfax Worth It? A Direct Answer, With Today’s Prices';
const DESCRIPTION = `Yes for one expensive car where the service trail matters, no for screening a shortlist. What Carfax has that ${VINAUDIT.one} reports do not, whether the Carfax value is accurate, with every price checked ${CHECKED_ON_LONG}.`;
const PUBLISHED = '2026-07-13';
const UPDATED = CHECKED_ON;

export const metadata: Metadata = {
  title: 'Is Carfax Worth It? When Yes, When No (2026)',
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'article',
    url: `${SITE_URL}/blog/${SLUG}`,
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
};

const sources = VHR_SOURCES.filter((s) => /carfax|autocheck|vinaudit|epicvin|department of justice|NMVTIS report contains|NICB|NHTSA/i.test(s.claim));

const faqs = [
  {
    q: 'Is Carfax worth it?',
    a: `Yes, when you are about to pay real money for one specific car and a documented accident and dealer service history would change your decision; its dealer and repair-shop feeds are the one thing cheaper reports cannot match. No, for screening a shortlist or confirming a title is clean: an NMVTIS-approved report from VinAudit at ${VINAUDIT.one} (checked ${CHECKED_ON_LONG}) covers the title, brand, odometer and total-loss records, and NHTSA and the NICB cover recalls and theft for free.`,
  },
  {
    q: 'How much is a Carfax report?',
    a: `${CARFAX.one} for one report, ${CARFAX.two} for two or ${CARFAX.four} for four on Carfax's own purchase page as of ${CHECKED_ON_LONG}, and free on Carfax and most dealer listings. The full breakdown, including the resellers to avoid, is in our Carfax report cost guide.`,
  },
  {
    q: 'Is the Carfax value accurate?',
    a: 'Carfax\'s "History-Based Value" adjusts a book-style figure for the car\'s reported history, which is a sensible idea, but it is still a model of a typical car rather than a price observed in your market. Treat it as one estimate. What a car is actually worth is what comparable cars are listed and selling for near you at that mileage this month, which is what CarWorthIt prices, and neither number knows what a particular seller will accept.',
  },
  {
    q: 'What is the cheapest way to check a used car by VIN?',
    a: `Free first: NHTSA for unrepaired recalls and the NICB VINCheck for theft and insurer total-loss records (five lookups a day). Then, on the car you are serious about, an NMVTIS report from an approved provider: VinAudit at ${VINAUDIT.one} or EpicVIN at ${EPICVIN.one} as of ${CHECKED_ON_LONG}. That covers the fraud checks for under ten dollars.`,
  },
  {
    q: 'Do cheaper VIN checks use the same data as Carfax?',
    a: 'They overlap on the core fraud checks. Title brands, odometer readings, total-loss and salvage records come from NMVTIS and state sources any approved provider can access, so a cheap report catches the same salvage title Carfax would. What Carfax and AutoCheck add is their own accident, repair-shop and auction feeds, which is the extra you pay for.',
  },
  {
    q: 'Can I trust a clean Carfax report?',
    a: 'A clean report is a good sign, not a guarantee. Carfax only knows about events reported to it, so a cash repair or an accident never claimed on insurance will not appear, and Carfax says so in its own disclaimer. Pair any report, cheap or premium, with a pre-purchase inspection by a mechanic you chose.',
  },
  {
    q: 'Does CarWorthIt provide vehicle history reports?',
    a: `No. CarWorthIt is not an NMVTIS provider and holds no title, salvage, theft, odometer, accident or lien records. It decodes the VIN free and shows specs, open recalls, crash ratings and running costs, then from $${PRODUCTS.valuation.price} prices that exact car at its mileage near you and gives a verdict on the asking price. Buy the history from an approved provider, Carfax or AutoCheck; use us for the price.`,
  },
];

export default function Page() {
  return (
    <PostShell
      slug={SLUG}
      title={TITLE}
      description={DESCRIPTION}
      published={PUBLISHED}
      updated={UPDATED}
      faqs={faqs}
      related={[
        { href: '/blog/carfax-report-cost', title: 'How much does a Carfax report cost?' },
        { href: '/best-vehicle-history-report', title: 'Best vehicle history report: every provider compared' },
        { href: '/blog/autocheck-vs-carfax', title: 'AutoCheck vs Carfax' },
        { href: '/vehicle-history-faq', title: 'Vehicle history FAQ' },
      ]}
    >
      <p>
        <strong>Short answer: yes, if</strong> you are about to pay real money for one specific car and a documented
        accident and service history would change your mind, and the report is not already free on the listing.{' '}
        <strong>No, if</strong> you are screening several cars or just want to confirm the title is clean: a{' '}
        {VINAUDIT.one} NMVTIS report and two free government checks do that. Carfax charges {CARFAX.one} for one report as
        of <time dateTime={CHECKED_ON}>{CHECKED_ON_LONG}</time>; the alternatives run from free to {AUTOCHECK.single}.
      </p>

      <h2>The conditions, in one table</h2>
      <div className="table-scroll" tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th>Your situation</th>
              <th>Worth {CARFAX.one}?</th>
              <th>Do this instead, or as well</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Buying one car over about $10,000 from a private seller, no report in the listing</td>
              <td><strong>Yes</strong></td>
              <td>Still run a {VINAUDIT.one} NMVTIS report; Carfax cannot sell you the federal record</td>
            </tr>
            <tr>
              <td>The car is on a Carfax or dealer listing</td>
              <td><strong>No, it is free</strong></td>
              <td>Open the report from the listing, then run your own NMVTIS check before you pay</td>
            </tr>
            <tr>
              <td>Shortlisting three or four cars</td>
              <td><strong>No</strong></td>
              <td>EpicVIN four for {EPICVIN.four}, or AutoCheck five for {AUTOCHECK.five}; buy Carfax on the finalist if at all</td>
            </tr>
            <tr>
              <td>You only want to know it is not salvage, flood or stolen</td>
              <td><strong>No</strong></td>
              <td>NICB VINCheck (free) plus VinAudit {VINAUDIT.one}</td>
            </tr>
            <tr>
              <td>The seller&apos;s story does not add up</td>
              <td><strong>Yes</strong></td>
              <td>Carfax for the service and ownership trail, and a pre-purchase inspection</td>
            </tr>
            <tr>
              <td>You want to know what to pay</td>
              <td><strong>Not the right tool</strong></td>
              <td>A local-market valuation for that VIN at its mileage</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Prices checked on each provider&apos;s own site on {CHECKED_ON_LONG}; the sources are listed at the foot of the page.
        What Carfax charges for packs, and the resellers to avoid, is on its own page:{' '}
        <Link href="/blog/carfax-report-cost">how much does a Carfax report cost</Link>.
      </p>

      <h2>What Carfax is genuinely good at</h2>
      <p>
        Carfax is a vehicle history report: enter a VIN or plate, pay, and get a timeline of what has been reported about
        that car. The part the cheap reports do not have is the service and accident detail. Carfax describes its
        database as holding billions of records from more than 151,000 sources, and its report checks for oil changes,
        tire rotations, brake and transmission work, reported accidents with severity and point of impact, and airbag
        deployment. When the car is expensive enough that this trail changes your decision, that is what {CARFAX.one}
        buys.
      </p>

      <h2>Where it falls short</h2>
      <p>
        No history report is complete, and Carfax says as much in its own disclaimers: it only knows about events that
        were reported to it. A cash repair never appears. An accident with no insurance claim and no police report never
        appears. Plenty of buyers have pulled a clean Carfax and found frame damage once a mechanic put the car on a lift.
      </p>
      <p>
        The other issue is that most of what people assume is Carfax-exclusive is not. Title brands, salvage and junk
        records, odometer readings and total-loss entries originate in NMVTIS, the federal title database, and any
        approved provider will sell you that record for a few dollars. Carfax is not one of them for consumers: the
        Department of Justice lists Carfax as an NMVTIS provider for commercial customers in California only. A theft
        and total-loss screen is free at the NICB. Recalls and crash ratings are free at NHTSA. Carfax bundles all of
        that onto one page, and bundling public records is not the same as owning them.
      </p>

      <h2>Carfax vs AutoCheck vs the cheap and free checks</h2>
      <div className="table-scroll" tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Carfax ({CARFAX.one})</th>
              <th>AutoCheck ({AUTOCHECK.single})</th>
              <th>NMVTIS report ({VINAUDIT.one} at VinAudit)</th>
              <th>NHTSA and NICB (free)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Title history and brands</td><td>Yes, own sources</td><td>Yes, own sources</td><td>Yes, the federal record</td><td>No</td></tr>
            <tr><td>Salvage and total-loss</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Total-loss only, participating insurers</td></tr>
            <tr><td>Odometer readings</td><td>Yes</td><td>Yes</td><td>Yes</td><td>No</td></tr>
            <tr><td>Theft records</td><td>Yes</td><td>Yes</td><td>Some providers</td><td>Yes, NICB</td></tr>
            <tr><td>Reported accidents, severity, point of impact</td><td>Strongest</td><td>Strong, auction-led</td><td>No</td><td>No</td></tr>
            <tr><td>Dealer service records</td><td>Yes</td><td>Thinner</td><td>No</td><td>No</td></tr>
            <tr><td>Unrepaired recalls</td><td>Included</td><td>Included</td><td>Sometimes</td><td>Yes, NHTSA</td></tr>
            <tr><td>Auction announcements and a score</td><td>No</td><td>Yes</td><td>No</td><td>No</td></tr>
            <tr><td>NMVTIS-approved for consumers</td><td>No</td><td>No</td><td>Yes</td><td>Not applicable</td></tr>
            <tr><td>What the car is worth near you</td><td>An estimate</td><td>An estimate</td><td>Some providers</td><td>No</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        The pattern: on the fraud and safety checks every paid service is drawing from the same public well, and two of
        those checks are free. The premium is the private accident and service depth, and only Carfax and AutoCheck have
        it. See <Link href="/blog/autocheck-vs-carfax">AutoCheck vs Carfax</Link> for the head-to-head and{' '}
        <Link href="/autocheck-free">how to get an AutoCheck report free</Link> on eBay Motors.
      </p>

      <h2>Is the Carfax value accurate?</h2>
      <p>
        A lot of people arrive here asking that, so: Carfax publishes a &quot;History-Based Value&quot; that adjusts a book
        figure for the car&apos;s reported history. The examples on its own report page show $820 between a 2012 Camry SE
        with and without an accident ($14,230 against $13,410) and $1,320 between a 2014 F-150 XL with and without service
        records ($23,290 against $21,970). The idea is sound. The
        limit is that it is a model of a typical car of that year and trim, not a price observed in your market this
        month. Two identical cars can be listed two thousand dollars apart in different states. Use it as one estimate,
        then look at what comparable cars are actually listed for near you at that mileage before you make an offer.
      </p>

      <h2>Where CarWorthIt fits, and where it does not</h2>
      <p>
        Worth being blunt, because plenty of VIN sites are not. CarWorthIt is not a vehicle history report and does not
        pretend to be. We hold no title, salvage, theft, odometer, accident or lien records and we do not sell them. For
        any of that, use an approved NMVTIS provider, the free NICB VINCheck, and Carfax or AutoCheck when the service
        trail matters.
      </p>
      <p>
        We answer the other half of the question, the half a history report leaves open: whether the number on the
        windshield is fair. The free report decodes the VIN (try the <Link href="/vin-decoder">VIN decoder</Link>) and
        shows the factory specification, open NHTSA recalls, crash-test ratings and an estimated running cost. The
        Valuation, {`$${PRODUCTS.valuation.price}`}, prices that exact car at its mileage near your ZIP code against cars actually
        for sale, with a verdict on the asking price. The Worth It report, {`$${PRODUCTS.worthit.price}`}, adds the original
        factory build record: MSRP, options, standard equipment and warranty. The Negotiation Bundle,{' '}
        {`$${PRODUCTS.negotiation.price}`}, turns that into an opening offer, a target and a walk-away price.
      </p>

      <h2>The bottom line</h2>
      <p>
        Carfax is a good product often bought at the wrong moment. Paying {CARFAX.one} to discover a salvage title is
        overkill when a {VINAUDIT.one} NMVTIS report would have flagged it. Screen with the free checks and a cheap report,
        take the free Carfax when the listing offers one, and pay for it only on the car you are ready to buy. Then, with
        the history settled, decide what the car is worth. Two different questions, and you want both answered before any
        money moves. The rest of the cluster: <Link href="/best-vehicle-history-report">every provider compared</Link>,
        the <Link href="/vehicle-history-faq">vehicle history FAQ</Link>, and the{' '}
        <Link href="/guides/used-car-checklist">used-car checklist</Link>.
      </p>

      <SourcesNote sources={sources} />
    </PostShell>
  );
}
