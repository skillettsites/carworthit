import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import VinForm from '@/components/VinForm';
import StickyVinCta from '@/components/StickyVinCta';
import { CheckedOn, FaqBlock, SourcesNote, ClusterLinks, NotAHistoryReport } from '@/components/DecisionBits';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import { CHECKED_ON, CHECKED_ON_LONG, BUMPER, VINAUDIT, EPICVIN, AUTOCHECK, CARFAX, VHR_SOURCES } from '@/lib/vhr-providers';

/**
 * Bumper's headline is "$1", its price is $27.99 a month, and the distance
 * between the two is what people search for. Everything here was read from
 * bumper.com's own checkout pages and terms on CHECKED_ON. No affiliate
 * relationship, no rating we did not measure.
 */

export const metadata: Metadata = {
  title: `Bumper Review 2026: ${BUMPER.trialLow} Trial, ${BUMPER.monthly}/mo, How to Cancel`,
  description: `Bumper's real pricing on ${CHECKED_ON_LONG}: a ${BUMPER.trialLow} seven-day trial that becomes ${BUMPER.monthly} a month, ${BUMPER.single} for a single report, what the report contains, whether it is NMVTIS-approved, and exactly how to cancel.`,
  alternates: { canonical: `${SITE_URL}/bumper-review` },
};

const URL = `${SITE_URL}/bumper-review`;

const sources = VHR_SOURCES.filter((s) => /bumper|department of justice|vinaudit|epicvin|autocheck: single|carfax packages/i.test(s.claim));

const faqs = [
  {
    q: 'How much does Bumper cost?',
    a: `On ${CHECKED_ON_LONG}, Bumper's checkout showed a membership at ${BUMPER.monthly} a month for up to ${BUMPER.monthlyReports} reports with PDF download, a three-month plan at ${BUMPER.threeMonth}, a seven-day trial at ${BUMPER.trialLow} (or ${BUMPER.trialHigh} with PDF download) that then bills ${BUMPER.monthly} a month, and a single one-time report at ${BUMPER.single}. Bumper's homepage says "plans start at ${BUMPER.monthly} per month".`,
  },
  {
    q: 'Is the Bumper $1 trial really $1?',
    a: `Yes, for seven days. Bumper's trial page says the trial "lasts until" the end date shown at checkout, after which "you will be charged the standard monthly rate" of ${BUMPER.monthly} plus tax, renewing every 30 days until you cancel. You can cancel during the trial for any reason.`,
  },
  {
    q: 'How do I cancel Bumper?',
    a: `Four ways, from Bumper's terms: log in and go to My Account, then Edit Account Information, then Cancel My Account; call ${BUMPER.phone} during posted hours (Monday to Friday, 9am to 5pm Eastern on the checkout page); email support; or use the Contact Us form. Online, email and form requests are accepted 24 hours a day. Cancelling stops future renewals but does not refund charges already made.`,
  },
  {
    q: 'Does Bumper give refunds?',
    a: 'Bumper\'s checkout carries a "Satisfaction Guaranteed" line offering help or a refund if you are dissatisfied. Its terms say refund requests are considered case by case, you are typically limited to one refund per subscription, repeat requests can be refused, and a refund can take up to thirty days to show on your card.',
  },
  {
    q: 'Is Bumper NMVTIS-approved?',
    a: 'Yes. Bumper.com is on the US Department of Justice list of approved NMVTIS data providers for consumers, and its checkout pages carry the "Approved NMVTIS data provider" mark. BeenVerified is listed as a second site owned by the same provider.',
  },
  {
    q: 'What does a Bumper report include?',
    a: 'Per Bumper\'s own checkout: VIN lookups, accident and salvage lookups (Bumper footnotes that accident coverage varies by state), theft records, sales and background searches, title checks, specifications and equipment, market values and ownership cost, and, on most plans, PDF downloads. Bumper states it does not have the complete history of every vehicle and has no reports for tractors or trailers.',
  },
  {
    q: 'Is Bumper cheaper than Carfax?',
    a: `Per report at volume, yes: ${BUMPER.monthly} for up to ${BUMPER.monthlyReports} reports against ${CARFAX.one} for one Carfax. For a single car, no: Bumper's one-time report is ${BUMPER.single}, while VinAudit is ${VINAUDIT.one}, EpicVIN ${EPICVIN.one} and AutoCheck ${AUTOCHECK.single}. Carfax still has the dealer service records Bumper does not.`,
  },
  {
    q: 'Does CarWorthIt compete with Bumper?',
    a: `No. CarWorthIt is not a history report and is not an NMVTIS provider. We decode the VIN free and, from $${PRODUCTS.valuation.price}, price that exact car at its mileage against cars listed near you. Bumper answers "what happened to this car"; we answer "what is it worth and is the asking price fair".`,
  },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Guides', url: `${SITE_URL}/guides` },
            { name: 'Bumper review', url: URL },
          ]),
        ]}
      />
      <div className="container-x max-w-3xl py-12 pb-28">
        <nav className="mb-4 text-sm text-ink-2">
          <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/guides" className="hover:text-ink">Guides</Link>
        </nav>
        <h1 className="text-3xl font-extrabold md:text-4xl">Bumper review: the $1 trial, the {BUMPER.monthly} a month, and how to cancel</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2">
          Bumper is a subscription. The {BUMPER.trialLow} you see advertised buys {BUMPER.trialDays} days, then the
          membership bills {BUMPER.monthly} a month for up to {BUMPER.monthlyReports} reports and renews every 30 days
          until you cancel. A single one-time report is {BUMPER.single}. It is an approved NMVTIS provider and the report
          is decent; the question is whether you need fifty of them. Read from bumper.com on{' '}
          <time dateTime={CHECKED_ON}>{CHECKED_ON_LONG}</time>.
        </p>
        <CheckedOn />

        <h2 className="mt-10 text-2xl font-extrabold">Bumper pricing, as shown at checkout</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border" tabIndex={0}>
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left">
                <th className="py-2.5 pl-3 pr-4 font-semibold">Option</th>
                <th className="py-2.5 pr-4 font-semibold">Price</th>
                <th className="py-2.5 pr-4 font-semibold">Then</th>
                <th className="py-2.5 pr-4 font-semibold">Reports</th>
                <th className="py-2.5 pr-4 font-semibold">PDF</th>
                <th className="py-2.5 pr-4 font-semibold">Checked</th>
              </tr>
            </thead>
            <tbody className="text-ink-2">
              {[
                ['7-day trial', `${BUMPER.trialLow} up front`, `${BUMPER.monthly} a month, renews every 30 days`, `${BUMPER.monthlyReports} a month`, 'No'],
                ['7-day trial with PDF', `${BUMPER.trialHigh} up front`, `${BUMPER.monthly} a month, renews every 30 days`, `${BUMPER.monthlyReports} a month`, 'Yes'],
                ['Monthly membership', `${BUMPER.monthly} a month`, 'Renews monthly until cancelled', `${BUMPER.monthlyReports} a month`, 'Yes'],
                ['3-month membership', `${BUMPER.threeMonth} per 3 months`, 'Renews every 3 months until cancelled', `${BUMPER.monthlyReports} a month`, 'Yes'],
                ['One report, one-time', BUMPER.single, 'Shown as a one-time payment', '1', 'Yes'],
              ].map((r) => (
                <tr key={r[0]} className="border-b border-border last:border-0">
                  <td className="py-2.5 pl-3 pr-4 align-top font-semibold text-ink">{r[0]}</td>
                  <td className="py-2.5 pr-4 align-top">{r[1]}</td>
                  <td className="py-2.5 pr-4 align-top">{r[2]}</td>
                  <td className="py-2.5 pr-4 align-top">{r[3]}</td>
                  <td className="py-2.5 pr-4 align-top">{r[4]}</td>
                  <td className="py-2.5 pr-4 align-top whitespace-nowrap">{CHECKED_ON_LONG}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-ink-2">
          Plus applicable sales tax on every option. Bumper runs price tests on its checkout, so the variant you are
          shown may differ; the homepage&apos;s own line is &quot;plans start at {BUMPER.monthly} per month&quot;.
        </p>

        <h2 className="mt-10 text-2xl font-extrabold">What the report contains</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          Bumper&apos;s checkout lists the membership benefits as VIN lookups, accident and salvage lookups, theft record
          lookups, sales and background searches, title checks, specifications and equipment details, and market values
          and ownership cost, with searches by VIN, license plate or year, make and model. The accident line carries a
          footnote pointing to Bumper&apos;s state-coverage page, which is Bumper saying that accident data is not
          uniform across states. The data, in Bumper&apos;s words, comes from &quot;official public records, government
          sources and trusted industry partners, where available&quot;, and Bumper is on the Department of Justice list
          of approved NMVTIS providers, so the title, brand, odometer and total-loss core is the federal record. It has no
          history for tractors or trailers, and, like every report, it states that it does not have the complete history
          of every vehicle.
        </p>

        <h2 className="mt-10 text-2xl font-extrabold">Cancellation terms, from Bumper&apos;s own terms</h2>
        <ul className="mt-3 space-y-2 text-ink-2">
          <li>
            <strong className="text-ink">Four ways to cancel:</strong> in your account (My Account, Edit Account
            Information, Cancel My Account); by phone on {BUMPER.phone} during posted hours; by email to support; or
            through the Contact Us form. Online, email and form requests are accepted 24 hours a day.
          </li>
          <li>
            <strong className="text-ink">What cancelling does:</strong> stops the plan renewing and cancels future
            recurring charges. It does not refund charges already incurred, and you remain responsible for the current
            period.
          </li>
          <li>
            <strong className="text-ink">Trial:</strong> the trial page says you may cancel before it ends &quot;for any
            reason&quot;; otherwise it converts to the standard monthly rate on the end date shown at checkout.
          </li>
          <li>
            <strong className="text-ink">Refunds:</strong> considered case by case, typically one per subscription,
            and refusable for repeat requests. Allow up to thirty days for one to show on your statement.
          </li>
        </ul>

        <h2 className="mt-10 text-2xl font-extrabold">Pros and cons</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-white p-5">
            <h3 className="font-bold text-good">Pros</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-ink-2">
              <li>NMVTIS-approved, so the title and brand core is the federal record.</li>
              <li>Cheapest per report at volume: {BUMPER.monthly} for up to {BUMPER.monthlyReports} a month.</li>
              <li>Search by plate or model as well as VIN, and PDF download on the paid plans.</li>
              <li>Cancellation is available online, by phone and by email, and the terms are plainly stated.</li>
              <li>A one-time single report exists if you do not want a membership.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <h3 className="font-bold text-bad">Cons</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-ink-2">
              <li>The advertised {BUMPER.trialLow} is a trial; the product is {BUMPER.monthly} a month that auto-renews.</li>
              <li>The single report at {BUMPER.single} costs more than a month and more than VinAudit ({VINAUDIT.one}), EpicVIN ({EPICVIN.one}) or AutoCheck ({AUTOCHECK.single}).</li>
              <li>Accident coverage varies by state, by Bumper&apos;s own footnote.</li>
              <li>No dealer service records of the kind Carfax has.</li>
              <li>Refunds are discretionary and normally one per subscription.</li>
            </ul>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-extrabold">Verdict</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          Take the trial if you are about to check a stack of cars in one week, put the cancellation date in your
          calendar, and use the account page to cancel. Take the monthly plan if you are a serious shopper working through
          dozens of listings. For one car, do not use Bumper at all: a {VINAUDIT.one} VinAudit report is the same federal
          title record for a third of the price, and the comparison of every provider is on{' '}
          <Link href="/best-vehicle-history-report" className="text-brand underline">best vehicle history report</Link>.
          If the car is on eBay Motors, the AutoCheck report may already be free:{' '}
          <Link href="/autocheck-free" className="text-brand underline">how to get an AutoCheck report free</Link>.
        </p>

        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8">
          <h2 className="text-xl font-bold">After the history: what is the car actually worth?</h2>
          <p className="mt-2 text-ink-2">
            Decode the VIN free (or use the <Link href="/vin-decoder" className="text-brand underline">VIN decoder</Link>),
            then from {`$${PRODUCTS.valuation.price}`} see what it is worth near you at its mileage and whether the asking
            price stands up. One payment, no subscription, nothing to cancel.
          </p>
          <div className="mt-5">
            <VinForm size="md" />
          </div>
          <NotAHistoryReport />
        </div>

        <FaqBlock faqs={faqs} />
        <SourcesNote sources={sources} />
        <ClusterLinks except="/bumper-review" />
      </div>
      <StickyVinCta />
    </>
  );
}
