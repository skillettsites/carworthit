import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import VinForm from '@/components/VinForm';
import StickyVinCta from '@/components/StickyVinCta';
import { CheckedOn, FaqBlock, SourcesNote, ClusterLinks, NotAHistoryReport } from '@/components/DecisionBits';
import { faqSchema, breadcrumbSchema, howToSchema } from '@/lib/schema';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import { CHECKED_ON, CHECKED_ON_LONG, AUTOCHECK, CARFAX, VINAUDIT, EPICVIN, NICB, VHR_SOURCES } from '@/lib/vhr-providers';

/**
 * "autocheck free" is a big query that AutoCheck.com itself holds. The honest
 * answer is that there is a free route (eBay Motors listings, some dealer
 * listings) and a paid one (AutoCheck direct), and this page gives both with
 * the source for each. The eBay statement is quoted from eBay's own help
 * center; the prices are from AutoCheck's own product feed.
 */

export const metadata: Metadata = {
  title: `Free AutoCheck Report: eBay Listings, or ${AUTOCHECK.single} Direct`,
  description: `How to get an AutoCheck vehicle history report free on eBay Motors and dealer listings, what AutoCheck charges direct (${AUTOCHECK.single} for one, ${AUTOCHECK.five} for five, checked ${CHECKED_ON_LONG}), and what to do when neither applies.`,
  alternates: { canonical: `${SITE_URL}/autocheck-free` },
};

const URL = `${SITE_URL}/autocheck-free`;

const sources = VHR_SOURCES.filter((s) => /autocheck|ebay|carfax packages|carfax: every|vinaudit|epicvin|NICB|department of justice/i.test(s.claim));

const steps = [
  {
    name: 'Open the eBay Motors listing and find the Vehicle History Report tab',
    text: 'eBay says many sellers include an AutoCheck report with the listing. It sits in the "Vehicle History Report" tab on the listing page. If it is there, it is free to read.',
  },
  {
    name: 'If the tab is empty, buy one from the listing or check a dealer listing',
    text: `eBay gives you the option to buy an AutoCheck report from the listing when the seller has not provided one. Dealer websites often link a free history report on each car: Carfax says so of its own reports, and some dealers use AutoCheck instead. Look for the link on the vehicle page or ask the dealer.`,
  },
  {
    name: 'Otherwise, buy direct from AutoCheck',
    text: `AutoCheck's own price on ${CHECKED_ON_LONG} was ${AUTOCHECK.single} for a single report, one-time, with 21 days of data updates, or ${AUTOCHECK.five} for five reports over 21 days.`,
  },
  {
    name: 'Run the free government checks either way',
    text: 'NHTSA shows unrepaired recalls for the VIN and the NICB VINCheck shows theft and insurer total-loss records, both free. Neither is a substitute for a title history, but both are worth thirty seconds.',
  },
];

const faqs = [
  {
    q: 'How can I get an AutoCheck report for free?',
    a: 'Two legitimate routes. On eBay Motors, eBay says many sellers include an AutoCheck report in the listing\'s Vehicle History Report tab, free to read. On dealer websites, look for a free history report link on each car; Carfax says dealers often provide its reports free, and some dealers use AutoCheck instead. There is no free AutoCheck for a private-party car that is not on eBay; you buy it, or you buy a cheaper NMVTIS report instead.',
  },
  {
    q: 'How much does an AutoCheck report cost?',
    a: `${AUTOCHECK.single} for a single report or ${AUTOCHECK.five} for five reports over 21 days, both one-time payments with no recurring charge, as listed in AutoCheck's own product feed on ${CHECKED_ON_LONG}. The single report includes access to data updates for 21 days. AutoCheck for Business is ${AUTOCHECK.business}.`,
  },
  {
    q: 'Is the AutoCheck report on eBay the full report?',
    a: 'eBay describes it as the AutoCheck vehicle history report, including title details, ownership transfers and DMV transactions, reported accidents and damage, odometer rollback indicators, rental, fleet, taxi and police use, and the AutoCheck Score. It does not include the previous owners\' names or addresses. eBay also says "no history found" can mean AutoCheck has not received the data yet, so a blank section is not proof of a clean history.',
  },
  {
    q: 'What is the AutoCheck Score?',
    a: 'A single number on a 100-point scale that Experian calculates from the vehicle\'s age, mileage, vehicle class, number of owners and history events such as accidents, theft or taxi use, compared with similar vehicles. It is a quick way to compare two listings; it is not a substitute for reading the report.',
  },
  {
    q: 'Is AutoCheck NMVTIS-approved?',
    a: 'Experian, which owns AutoCheck, appears on the US Department of Justice list of NMVTIS data providers for commercial customers only, and the DOJ states that consumers cannot receive NMVTIS reports from Experian. AutoCheck reports still show title and odometer data from Experian\'s own sources; if you want the federal record itself, buy it from an approved consumer provider such as VinAudit or EpicVIN.',
  },
  {
    q: 'AutoCheck or Carfax: which should I get?',
    a: `AutoCheck is ${AUTOCHECK.single} against Carfax's ${CARFAX.one} (both checked ${CHECKED_ON_LONG}), is stronger on auction records and gives you a score; Carfax has the deeper dealer service history. If either is free on the listing you are looking at, take that one. If you are paying and the car's service history matters, Carfax; if you are comparing several cars, AutoCheck's five for ${AUTOCHECK.five}.`,
  },
  {
    q: `What if the car is not on eBay and I do not want to pay ${AUTOCHECK.single}?`,
    a: `Buy an NMVTIS-approved report instead: VinAudit at ${VINAUDIT.one} or EpicVIN at ${EPICVIN.one} (checked ${CHECKED_ON_LONG}) covers the current title, brand history, odometer readings, total-loss and salvage records, which is the fraud check. You give up AutoCheck's auction announcements and score. Run the free NICB and NHTSA checks as well.`,
  },
  {
    q: 'Does CarWorthIt include an AutoCheck report?',
    a: `No. CarWorthIt is not a history report, is not affiliated with AutoCheck or Experian, and is not an NMVTIS provider. We decode the VIN free and, from $${PRODUCTS.valuation.price}, price that exact car at its mileage against cars listed near you. Get the history from AutoCheck, Carfax or an approved NMVTIS provider; use us to decide what to pay.`,
  },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          howToSchema('How to get an AutoCheck report free', 'The free routes to an AutoCheck vehicle history report and what to do when they do not apply.', steps),
          faqSchema(faqs),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Guides', url: `${SITE_URL}/guides` },
            { name: 'Free AutoCheck report', url: URL },
          ]),
        ]}
      />
      <div className="container-x max-w-3xl py-12 pb-28">
        <nav className="mb-4 text-sm text-ink-2">
          <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/guides" className="hover:text-ink">Guides</Link>
        </nav>
        <h1 className="text-3xl font-extrabold md:text-4xl">How to get an AutoCheck report free</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2">
          Free, if the car is on eBay Motors: eBay says many sellers include an AutoCheck report in the listing&apos;s
          Vehicle History Report tab. Some dealer listings include one too. Otherwise AutoCheck charges {AUTOCHECK.single} for
          one report or {AUTOCHECK.five} for five over 21 days, one-time, as of{' '}
          <time dateTime={CHECKED_ON}>{CHECKED_ON_LONG}</time>. There is no legitimate free AutoCheck for a private-party
          car that is not on eBay.
        </p>
        <CheckedOn />

        <h2 className="mt-10 text-2xl font-extrabold">The four steps</h2>
        <ol className="mt-4 space-y-4">
          {steps.map((s, i) => (
            <li key={s.name} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">{i + 1}</span>
              <div>
                <h3 className="font-bold text-ink">{s.name}</h3>
                <p className="mt-1 leading-relaxed text-ink-2">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <h2 className="mt-10 text-2xl font-extrabold">What AutoCheck charges direct</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border" tabIndex={0}>
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left">
                <th className="py-2.5 pl-3 pr-4 font-semibold">Package (AutoCheck&apos;s name)</th>
                <th className="py-2.5 pr-4 font-semibold">Price</th>
                <th className="py-2.5 pr-4 font-semibold">Terms, in AutoCheck&apos;s words</th>
                <th className="py-2.5 pr-4 font-semibold">Checked</th>
              </tr>
            </thead>
            <tbody className="text-ink-2">
              <tr className="border-b border-border">
                <td className="py-2.5 pl-3 pr-4 align-top font-semibold text-ink">{AUTOCHECK.singleName}</td>
                <td className="py-2.5 pr-4 align-top">{AUTOCHECK.single}</td>
                <td className="py-2.5 pr-4 align-top">One AutoCheck vehicle history report; search by VIN or US license plate; includes access to dynamic vehicle data updates for {AUTOCHECK.updatesDays} days; one-time fee, no recurring charges</td>
                <td className="py-2.5 pr-4 align-top whitespace-nowrap">{CHECKED_ON_LONG}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2.5 pl-3 pr-4 align-top font-semibold text-ink">{AUTOCHECK.fiveName}</td>
                <td className="py-2.5 pr-4 align-top">{AUTOCHECK.five}</td>
                <td className="py-2.5 pr-4 align-top">Five reports for 21 days; data updates during the term; one-time fee, no recurring charges</td>
                <td className="py-2.5 pr-4 align-top whitespace-nowrap">{CHECKED_ON_LONG}</td>
              </tr>
              <tr>
                <td className="py-2.5 pl-3 pr-4 align-top font-semibold text-ink">AutoCheck for Business</td>
                <td className="py-2.5 pr-4 align-top">{AUTOCHECK.business}</td>
                <td className="py-2.5 pr-4 align-top">Packages for dealerships, lenders, insurers, manufacturers, auctions and credit unions</td>
                <td className="py-2.5 pr-4 align-top whitespace-nowrap">{CHECKED_ON_LONG}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-ink-2">
          Read from AutoCheck&apos;s own product feed, the data its purchase page is built from. For comparison, Carfax was{' '}
          {CARFAX.one} for one report the same day; see{' '}
          <Link href="/blog/carfax-report-cost" className="text-brand underline">what a Carfax report costs</Link>.
        </p>

        <h2 className="mt-10 text-2xl font-extrabold">What the eBay report shows, in eBay&apos;s words</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          eBay&apos;s help center describes the AutoCheck report in a listing as showing whether the vehicle has ever
          been stolen, salvaged or rebuilt, turned in under a lemon law, in a flood or hail storm, in an accident or fire
          (if reported), a victim of potential odometer rollback, used as a rental, fleet, police or taxi vehicle,
          abandoned or forfeited, or reported as having a lien. It shows the title details including all ownership
          transfers and DMV transactions, and the AutoCheck Score. It does not include
          the previous owners&apos; names or addresses. eBay also says &quot;no history found&quot; may mean AutoCheck has
          not yet received that data, and it recommends a physical inspection or a third-party inspection service on top
          of the report. That last point is the right one: the report is paperwork, and the{' '}
          <Link href="/guides/used-car-checklist" className="text-brand underline">checklist</Link> is the car.
        </p>

        <h2 className="mt-10 text-2xl font-extrabold">When neither free route applies</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          A private-party car on Craigslist, Facebook Marketplace or a driveway has no listing report. You have three
          choices. Pay AutoCheck {AUTOCHECK.single}, which gets you the auction and accident records and the score. Pay a
          cheaper NMVTIS-approved provider ({VINAUDIT.one} at VinAudit, {EPICVIN.one} at EpicVIN) for the federal title,
          brand, odometer and total-loss record, which is the fraud check and is a record Experian is not approved to sell
          you. Or, for a car you are only mildly interested in, run the free{' '}
          <a href={NICB.url} rel="nofollow noopener" target="_blank" className="text-brand underline">NICB VINCheck</a>{' '}
          and the NHTSA recall lookup and decide whether it is worth a paid report at all. Every provider&apos;s price is on{' '}
          <Link href="/best-vehicle-history-report" className="text-brand underline">best vehicle history report</Link>.
        </p>

        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8">
          <h2 className="text-xl font-bold">Report in hand? The next question is the price</h2>
          <p className="mt-2 text-ink-2">
            Decode the VIN free here or with the <Link href="/vin-decoder" className="text-brand underline">VIN decoder</Link>,
            then from {`$${PRODUCTS.valuation.price}`} see what this exact car is worth at its mileage near you and whether
            the asking price stands up.
          </p>
          <div className="mt-5">
            <VinForm size="md" />
          </div>
          <NotAHistoryReport />
        </div>

        <FaqBlock faqs={faqs} />
        <SourcesNote sources={sources} />
        <ClusterLinks except="/autocheck-free" />
      </div>
      <StickyVinCta />
    </>
  );
}
