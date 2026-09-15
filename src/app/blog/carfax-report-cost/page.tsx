import type { Metadata } from 'next';
import Link from 'next/link';
import PostShell from '@/components/PostShell';
import { SourcesNote } from '@/components/DecisionBits';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import { CHECKED_ON, CHECKED_ON_LONG, CARFAX, AUTOCHECK, VINAUDIT, EPICVIN, CLEARVIN, VHR_SOURCES, NMVTIS } from '@/lib/vhr-providers';

/**
 * "carfax report cost" and its 30-odd variants were landing on
 * /blog/is-carfax-worth-it at positions 57 to 100, a page that never stated a
 * price. This is the page for the price question; the worth-it post now links
 * here instead of trying to answer both.
 *
 * A page rather than an articles.json entry so the figures are read from
 * src/lib/vhr-providers.ts, where they carry their source URL and check date.
 */

const SLUG = 'carfax-report-cost';
const TITLE = 'How Much Does a Carfax Report Cost? (Checked September 2026)';
const DESCRIPTION = `A Carfax report costs ${CARFAX.one} for one, ${CARFAX.two} for two or ${CARFAX.four} for four, checked ${CHECKED_ON_LONG}. The three ways to get one free, why the $3.99 resellers are a risk, and what an NMVTIS-approved alternative costs.`;
const PUBLISHED = '2026-09-15';
const UPDATED = CHECKED_ON;

export const metadata: Metadata = {
  title: `Carfax Report Cost: ${CARFAX.one} for One, Free 3 Ways`,
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

const sources = VHR_SOURCES.filter((s) =>
  /carfax|autocheck|vinaudit|epicvin|clearvin|department of justice/i.test(s.claim),
);

const faqs = [
  {
    q: 'How much does a Carfax report cost?',
    a: `On ${CHECKED_ON_LONG}, Carfax's own purchase page listed one report at ${CARFAX.one}, two reports at ${CARFAX.two} (${CARFAX.twoEach} each) and four reports at ${CARFAX.four} (${CARFAX.fourEach} each). Carfax changes its packages from time to time, so confirm on carfax.com before you buy.`,
  },
  {
    q: 'How can I get a Carfax report for free?',
    a: 'Carfax says every car listed on its own used-car listings comes with a free Carfax report, that dealer websites often link a free report for each car in their inventory (and will give you one on the lot if you ask), and that you can ask a private seller for theirs. If none of those apply, you are buying it.',
  },
  {
    q: 'Are the $3.99 Carfax reports legitimate?',
    a: 'They are not sold by Carfax. Carfax\'s Terms of Use say access is for your own personal, non-commercial use and that you may not resell any of its services, so a site selling a Carfax report for a few dollars is either reselling a report against those terms, often from a dealer account, or selling something else under the name. You have no recourse with Carfax if the report is stale, edited or never arrives.',
  },
  {
    q: 'What is a cheaper alternative to a Carfax report?',
    a: `For the title, brand and odometer history, an NMVTIS-approved report: VinAudit at ${VINAUDIT.one}, ClearVin at ${CLEARVIN.one} or EpicVIN at ${EPICVIN.one} (all checked ${CHECKED_ON_LONG}). For accident and auction records with a score, AutoCheck at ${AUTOCHECK.single}, or five reports for ${AUTOCHECK.five}. None of them has Carfax's dealer service records.`,
  },
  {
    q: `Is a Carfax report worth ${CARFAX.one}?`,
    a: `For one expensive car where a documented accident and service history would change your decision, usually yes, and often you can get it free from the listing. For screening a shortlist or confirming a title is clean, no: a ${VINAUDIT.one} NMVTIS report covers the fraud checks. The full answer, with the conditions, is in our "Is Carfax worth it" guide.`,
  },
  {
    q: 'Does a Carfax report include the NMVTIS record?',
    a: 'Not as a consumer product. The US Department of Justice lists Carfax as an NMVTIS provider for commercial customers in California only and states that consumers cannot receive NMVTIS reports from Carfax. Carfax reports do show title brands from their own sources; if you want the federal record itself, buy it from an approved consumer provider.',
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
        { href: '/blog/is-carfax-worth-it', title: 'Is Carfax worth it? A direct answer' },
        { href: '/best-vehicle-history-report', title: 'Best vehicle history report: every provider compared' },
        { href: '/autocheck-free', title: 'How to get an AutoCheck report free' },
        { href: '/vehicle-history-faq', title: 'Vehicle history FAQ' },
      ]}
    >
      <p>
        <strong>Short answer:</strong> a Carfax report costs {CARFAX.one} for one car, {CARFAX.two} for two (
        {CARFAX.twoEach} each) or {CARFAX.four} for four ({CARFAX.fourEach} each), as shown on Carfax&apos;s own purchase
        page on <time dateTime={CHECKED_ON}>{CHECKED_ON_LONG}</time>. It is free if the car is on a Carfax listing, on
        many dealer websites, or if the seller already bought one. The $3.99 reports advertised elsewhere are not sold by
        Carfax.
      </p>

      <h2>What Carfax charges today</h2>
      <div className="table-scroll" tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th>Package (Carfax&apos;s name)</th>
              <th>Price</th>
              <th>Per report</th>
              <th>Carfax&apos;s note</th>
              <th>Checked</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1 CARFAX Report (&quot;Standard&quot;)</td>
              <td>{CARFAX.one}</td>
              <td>{CARFAX.one}</td>
              <td>Best for one car only</td>
              <td>{CHECKED_ON_LONG}</td>
            </tr>
            <tr>
              <td>2 CARFAX Reports</td>
              <td>{CARFAX.two}</td>
              <td>{CARFAX.twoEach}</td>
              <td>&quot;Save $30&quot;, best for comparing two cars</td>
              <td>{CHECKED_ON_LONG}</td>
            </tr>
            <tr>
              <td>4 CARFAX Reports</td>
              <td>{CARFAX.four}</td>
              <td>{CARFAX.fourEach}</td>
              <td>&quot;Save $80&quot;, best for comparing multiple cars</td>
              <td>{CHECKED_ON_LONG}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Those are the three packages on the purchase page as of the date above; packages change, so check before you
        buy. The page does not say how long a multi-report pack stays valid, so ask before
        you buy a pack you plan to use over several weeks. Payment is by card, PayPal or Amazon Pay. Every report covers
        the same things: reported accidents with severity and point of impact, airbag deployment, structural damage,
        dealer service records, ownership history, odometer readings, and flood or lemon title brands. It only knows
        about events that were reported to Carfax, which Carfax says itself.
      </p>

      <h2>The three ways to get a Carfax report free</h2>
      <p>Carfax&apos;s own support center lists them, and they are worth checking before you spend {CARFAX.one}:</p>
      <ol>
        <li>
          <strong>Carfax used-car listings.</strong> Carfax says every car listed on its own listings site comes with a
          free Carfax report. If the car you are looking at is advertised there, the report is a click away.
        </li>
        <li>
          <strong>Dealer websites and showrooms.</strong> Most franchised and larger independent dealers pay Carfax for
          dealer access and link a free report from each car in their online inventory. If there is no link, ask; Carfax
          suggests asking for a copy on the lot too.
        </li>
        <li>
          <strong>Ask the seller.</strong> A private seller who has already bought a report has no reason not to send it
          to you. A seller who refuses has told you something.
        </li>
      </ol>
      <p>
        A free report from a listing is the seller&apos;s copy, run on their date. It is fine for deciding whether to
        visit. Before money moves, run your own cheap title check: an NMVTIS report from an approved provider costs from{' '}
        {VINAUDIT.one} and is the federal record, which, as a consumer, you cannot buy from Carfax at any price.
      </p>

      <h2>The $3.99 Carfax resellers, and why they are a risk</h2>
      <p>
        Search for the price of a Carfax and the first page is mostly sites offering a &quot;Carfax report&quot; for
        $3.99, $5.99 or $14.99. None of them is Carfax. Carfax&apos;s Terms of Use (section 5, read{' '}
        {CHECKED_ON_LONG}) say access to its services is &quot;solely for your own personal and non-commercial use&quot;
        and that &quot;you may not resell or make any commercial use of any Service(s)&quot;. So a cheap reseller is doing
        one of three things: pulling reports through a dealer or subscription account and reselling them against those
        terms, sending you an old report someone else bought, or selling a different provider&apos;s report under the
        Carfax name. In all three cases you have no relationship with Carfax. If the report is stale, edited or never
        turns up, there is nobody to complain to, and you have handed card details to a site whose business model is
        breaking a contract.
      </p>
      <p>
        If {CARFAX.one} is too much, the honest move is not a grey-market Carfax. It is a report from a provider that is
        allowed to sell you one.
      </p>

      <h2>What a legitimate alternative costs</h2>
      <div className="table-scroll" tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>One report</th>
              <th>Packs</th>
              <th>NMVTIS-approved for consumers</th>
              <th>What it lacks vs Carfax</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>VinAudit</td>
              <td>{VINAUDIT.one}</td>
              <td>5 for {VINAUDIT.five}, 10 for {VINAUDIT.ten}</td>
              <td>Yes</td>
              <td>Dealer service history</td>
            </tr>
            <tr>
              <td>ClearVin</td>
              <td>{CLEARVIN.one}</td>
              <td>2 for {CLEARVIN.two}, 5 for {CLEARVIN.five}</td>
              <td>Yes</td>
              <td>Maintenance records (stated on its site)</td>
            </tr>
            <tr>
              <td>EpicVIN</td>
              <td>{EPICVIN.one}</td>
              <td>4 for {EPICVIN.four}, 16 for {EPICVIN.sixteen}</td>
              <td>Yes</td>
              <td>Dealer service history</td>
            </tr>
            <tr>
              <td>AutoCheck (Experian)</td>
              <td>{AUTOCHECK.single}</td>
              <td>5 for {AUTOCHECK.five}, 21 days</td>
              <td>Dealers only</td>
              <td>Thinner service records; strong on auctions</td>
            </tr>
            <tr>
              <td>Carfax</td>
              <td>{CARFAX.one}</td>
              <td>2 for {CARFAX.two}, 4 for {CARFAX.four}</td>
              <td>Dealers only (California)</td>
              <td>The benchmark for service history</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        All prices read from each provider&apos;s own site on {CHECKED_ON_LONG}. The full comparison, including Bumper&apos;s
        subscription and the honest pick for each kind of buyer, is on{' '}
        <Link href="/best-vehicle-history-report">best vehicle history report</Link>. The approved consumer providers on
        the Department of Justice list that day were {NMVTIS.publicProviders.join(', ')}.
      </p>

      <h2>So should you pay for it?</h2>
      <p>
        Pay {CARFAX.one} when a documented accident and service trail on one specific, expensive car would change your
        decision, and the listing does not already include the report. Do not pay it to screen a shortlist or to confirm
        a title is clean; a {VINAUDIT.one} NMVTIS report and the free NICB VINCheck do that. The conditions are set out in{' '}
        <Link href="/blog/is-carfax-worth-it">is Carfax worth it</Link>. And once the history is clean, the question
        Carfax cannot answer is what the car is worth: <Link href="/">CarWorthIt</Link> decodes the VIN free (also see the{' '}
        <Link href="/vin-decoder">VIN decoder</Link>) and from {`$${PRODUCTS.valuation.price}`} prices that exact car at its
        mileage near you, with a verdict on the asking price. We do not sell history reports and are not affiliated with
        Carfax.
      </p>

      <SourcesNote sources={sources} />
    </PostShell>
  );
}
