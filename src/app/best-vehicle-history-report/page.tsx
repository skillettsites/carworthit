import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import VinForm from '@/components/VinForm';
import StickyVinCta from '@/components/StickyVinCta';
import { CheckedOn, ProviderTable, FaqBlock, SourcesNote, ClusterLinks, NotAHistoryReport } from '@/components/DecisionBits';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import {
  CHECKED_ON,
  CHECKED_ON_LONG,
  PROVIDERS,
  VHR_SOURCES,
  CARFAX,
  AUTOCHECK,
  BUMPER,
  EPICVIN,
  VINAUDIT,
  CLEARVIN,
  NMVTIS,
  NICB,
} from '@/lib/vhr-providers';

/**
 * The decision page for "best / cheapest vehicle history report".
 *
 * Replaces /blog/cheapest-vin-check and /blog/carfax-alternatives, which both
 * redirect here. Those posts described prices as "most expensive", "mid-priced"
 * and "about $15" because nobody had checked; every figure here was read from
 * the provider's own site on CHECKED_ON and the source list is on the page.
 *
 * Rendered entirely on the server: the answer, the table and the FAQ are in the
 * HTML. The VIN box is the only client component and sits below the answer,
 * with the honest note that it is not a history report.
 */

export const metadata: Metadata = {
  title: 'Best Vehicle History Report 2026: Prices Checked',
  description: `Carfax ${CARFAX.one}, AutoCheck ${AUTOCHECK.single}, Bumper ${BUMPER.monthly}/mo, EpicVIN ${EPICVIN.one}, VinAudit ${VINAUDIT.one}, ClearVin ${CLEARVIN.one}, all checked ${CHECKED_ON_LONG}. Which is NMVTIS-approved, which is a subscription, and the honest pick for each buyer.`,
  alternates: { canonical: `${SITE_URL}/best-vehicle-history-report` },
};

const URL = `${SITE_URL}/best-vehicle-history-report`;

const winners = [
  {
    who: 'You just want to know the title is clean',
    pick: `VinAudit, ${VINAUDIT.one}`,
    why: `The cheapest NMVTIS-approved report we could verify. It shows the current title, every brand from every state, the odometer readings and total-loss and salvage history, which is the fraud check that matters. Five reports for ${VINAUDIT.five} if you are shortlisting.`,
  },
  {
    who: 'You are comparing three or four cars',
    pick: `EpicVIN four-pack, ${EPICVIN.four}, or AutoCheck five for ${AUTOCHECK.five}`,
    why: `EpicVIN's four reports for ${EPICVIN.four} is the lowest per-car price with NMVTIS data and auction photos, provided you buy the pack and not the ${EPICVIN.trial} trial, which becomes ${EPICVIN.monthly} a month. AutoCheck's five for ${AUTOCHECK.five} adds Experian's accident and auction records, with no subscription.`,
  },
  {
    who: 'You want the deepest accident and service history on one expensive car',
    pick: `Carfax, ${CARFAX.one}, or free from the listing`,
    why: 'Carfax lists dealer service records, oil changes and tire rotations included, that the NMVTIS-based reports do not. Before you pay, check whether the car is on a Carfax or dealer listing, which include the report free, or ask the seller for theirs. Then still run a cheap NMVTIS check yourself, because consumers cannot buy an NMVTIS report from Carfax.',
  },
  {
    who: 'You are on eBay Motors',
    pick: 'The AutoCheck report in the listing, free',
    why: 'eBay says many sellers include an AutoCheck report in the Vehicle History Report tab. If it is not there, you can buy one from the listing.',
  },
  {
    who: 'You check cars every week',
    pick: `Bumper, ${BUMPER.monthly} a month for ${BUMPER.monthlyReports} reports`,
    why: `A membership only makes sense at volume. It auto-renews every 30 days until you cancel, and the ${BUMPER.trialLow} trial is the same membership with a seven-day head start, so set a reminder. A single Bumper report is ${BUMPER.single}, more than a month.`,
  },
  {
    who: 'You want to know what to pay',
    pick: `CarWorthIt, from $${PRODUCTS.valuation.price}`,
    why: 'No history report answers this, because it is a different question. Once the history is clean, we price the exact VIN at its mileage against cars listed near your ZIP code and say whether the asking price stands up. We do not sell history data and we say so.',
  },
];

const faqs = [
  {
    q: 'What is the best vehicle history report?',
    a: `It depends on the job. For a cheap, authoritative title and brand check, an NMVTIS report from VinAudit at ${VINAUDIT.one} (checked ${CHECKED_ON_LONG}). For the deepest accident and dealer service history on one car, Carfax at ${CARFAX.one}, or free if the car is on a Carfax or dealer listing. For comparing several cars, EpicVIN's four for ${EPICVIN.four} or AutoCheck's five for ${AUTOCHECK.five}. For volume, Bumper's ${BUMPER.monthly} a month.`,
  },
  {
    q: 'What is the cheapest vehicle history report?',
    a: `Free, for part of it: NHTSA shows unrepaired recalls by VIN and the NICB VINCheck shows theft and insurer total-loss records, five lookups a day. The cheapest paid report we could verify on the provider's own site is VinAudit at ${VINAUDIT.one} for one or ${VINAUDIT.five} for five, and it is NMVTIS-approved. EpicVIN's four reports for ${EPICVIN.four} works out cheaper per car.`,
  },
  {
    q: 'Which vehicle history reports are NMVTIS-approved?',
    a: `Of the providers on this page, Bumper, EpicVIN, VinAudit and ClearVin are on the US Department of Justice list of approved NMVTIS data providers for consumers. Carfax and Experian (AutoCheck) are listed for commercial customers only, and the DOJ page states that consumers cannot receive NMVTIS reports from Carfax or Experian. That does not mean their reports lack title data; it means the official federal record is not what you are buying from them.`,
  },
  {
    q: 'Is a $1 vehicle history report real?',
    a: `The $1 is real but it is a trial. Bumper's ${BUMPER.trialLow} seven-day trial becomes ${BUMPER.monthly} a month and EpicVIN's ${EPICVIN.trial} three-day trial becomes ${EPICVIN.monthly} a month, both renewing until you cancel (checked ${CHECKED_ON_LONG}). If you only need one or two reports, a one-time purchase is cheaper than forgetting to cancel.`,
  },
  {
    q: 'Do cheaper reports use the same data as Carfax?',
    a: 'They overlap on title, brand, odometer, theft and total-loss records, which come from NMVTIS and state sources any approved provider can access. What Carfax and AutoCheck add is their own accident, dealer service and auction feeds, which is why they cost more and why a minor reported fender-bender or a service visit may only show up there.',
  },
  {
    q: 'Can I get a vehicle history report for free?',
    a: 'Yes, in three places. Every Carfax used-car listing includes a free Carfax report and many dealer websites link one. eBay Motors listings often include an AutoCheck report in the Vehicle History Report tab. And NHTSA and the NICB give you recalls, theft and total-loss records for nothing. What you cannot get free is a full title-brand and odometer history for a private-party car.',
  },
  {
    q: 'Is CarWorthIt a vehicle history report?',
    a: `No. CarWorthIt is not an NMVTIS provider and holds no title, accident, theft, odometer or lien records. The free report decodes the VIN and shows specs, open recalls, crash ratings and running costs. The paid reports, from $${PRODUCTS.valuation.price}, price that exact car near you at its mileage and say whether the asking price is fair. Buy the history from a provider above, then use us to decide what to pay.`,
  },
  {
    q: 'When were these prices checked?',
    a: `Every price on this page was read from the provider's own purchase page or product feed on ${CHECKED_ON_LONG}. The source URLs are listed at the foot of the page. Providers change prices without notice, so confirm on their site before you pay.`,
  },
];

const itemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Vehicle history report providers compared',
  description: `Prices, pricing model and NMVTIS status checked ${CHECKED_ON_LONG}`,
  itemListOrder: 'https://schema.org/ItemListUnordered',
  numberOfItems: PROVIDERS.length,
  itemListElement: PROVIDERS.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: p.name,
    url: p.url.startsWith('/') ? `${SITE_URL}${p.url}` : p.url,
    description: `${p.single}. ${p.packs}. ${p.model}.`,
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Best vehicle history report', url: URL },
          ]),
          itemList,
        ]}
      />
      <div className="container-x max-w-4xl py-12 pb-28">
        <nav className="mb-4 text-sm text-ink-2">
          <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/guides" className="hover:text-ink">Guides</Link>
        </nav>
        <h1 className="text-3xl font-extrabold md:text-4xl">Best vehicle history report: every provider&apos;s price, checked</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2">
          The cheapest NMVTIS-approved history report is VinAudit at {VINAUDIT.one}; the most detailed is Carfax at{' '}
          {CARFAX.one}, or free on a Carfax or dealer listing. AutoCheck is {AUTOCHECK.single}, EpicVIN {EPICVIN.one},
          ClearVin {CLEARVIN.one}, and Bumper {BUMPER.monthly} a month. All read from the providers&apos; own sites on{' '}
          <time dateTime={CHECKED_ON}>{CHECKED_ON_LONG}</time>.
        </p>
        <CheckedOn />

        <h2 className="mt-10 text-2xl font-extrabold">The comparison</h2>
        <p className="mt-2 leading-relaxed text-ink-2">
          &quot;NMVTIS-approved for consumers&quot; means the provider is on the US Department of Justice list to sell the
          federal title record to the public. Carfax and Experian appear on that list for dealers only.
        </p>
        <ProviderTable providers={PROVIDERS} />

        <h2 className="mt-12 text-2xl font-extrabold">The honest winner for each buyer</h2>
        <div className="mt-4 space-y-4">
          {winners.map((w) => (
            <div key={w.who} className="rounded-xl border border-border bg-white p-5">
              <p className="text-sm font-medium text-ink-2">{w.who}</p>
              <p className="mt-1 text-lg font-bold text-ink">{w.pick}</p>
              <p className="mt-1 leading-relaxed text-ink-2">{w.why}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-extrabold">Start with the free checks</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          Before paying anyone, two official sources cover the fraud basics for nothing. The{' '}
          <a href={NICB.url} rel="nofollow noopener" target="_blank" className="text-brand underline">NICB VINCheck</a> tells
          you whether a participating insurer has reported the car stolen and not recovered, or declared it a salvage or
          flood total loss, with a limit of {NICB.dailyCap} lookups per 24 hours. NHTSA shows every unrepaired safety
          recall for the VIN. Decode the VIN free with our{' '}
          <Link href="/vin-decoder" className="text-brand underline">VIN decoder</Link> to confirm the listing matches the
          car. None of that is a title history, which is where the paid report earns its money.
        </p>

        <h2 className="mt-10 text-2xl font-extrabold">What NMVTIS actually gives you</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          The National Motor Vehicle Title Information System is the federal database that state titling agencies,
          insurers, auto recyclers and junk and salvage yards are required by law to report to. An NMVTIS report is
          deliberately short: the current state of title and last title date, the brand history from every state
          (salvage, junk, flood, rebuilt and the rest), the odometer reading, total-loss history and salvage history.
          It does not contain repair histories or recall information; the DOJ says plainly that those belong to the
          private providers. That is the split to keep in mind: NMVTIS for &quot;has this car been branded or
          written off anywhere&quot;, Carfax or AutoCheck for &quot;what happened to it in between&quot;. The approved
          consumer providers on the DOJ list as of {CHECKED_ON_LONG} are {NMVTIS.publicProviders.join(', ')}.
        </p>

        <h2 className="mt-10 text-2xl font-extrabold">The subscription trap, spelled out</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          Two of the cheapest headline prices are trials. Bumper&apos;s {BUMPER.trialLow} (or {BUMPER.trialHigh} with PDF
          download) buys {BUMPER.trialDays} days, after which the membership bills {BUMPER.monthly} a month and renews every
          30 days until you cancel, by phone, email, the contact form or your account page. EpicVIN&apos;s {EPICVIN.trial} buys{' '}
          {EPICVIN.trialDays} days, capped at {EPICVIN.trialDailyCap} reports a day, then {EPICVIN.monthly} a month plus tax.
          Neither is hidden, and both let you cancel online, but if you want one report and you value your time, a
          one-time purchase is the cheaper path. The full terms are on the{' '}
          <Link href="/bumper-review" className="text-brand underline">Bumper review</Link>.
        </p>

        <h2 className="mt-10 text-2xl font-extrabold">Why Carfax and AutoCheck cost more</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          They own data the others cannot buy. Carfax describes its database as holding billions of records from more
          than 151,000 sources, and its report checks for reported accidents with severity and point of impact, airbag
          deployment, and service items such as oil changes, tire rotations and brake work. AutoCheck says it has data
          from 95% of US auction houses, most of them supplying structural-damage announcements, and adds its score. If
          a documented
          accident and service trail changes your decision on the car in front of you, that is the one thing worth
          paying more for. It is also the thing you can often get free: see{' '}
          <Link href="/blog/carfax-report-cost" className="text-brand underline">what a Carfax report costs</Link> and{' '}
          <Link href="/autocheck-free" className="text-brand underline">how to get an AutoCheck report free</Link>. The
          longer argument is in <Link href="/blog/is-carfax-worth-it" className="text-brand underline">is Carfax worth it</Link>.
        </p>

        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8">
          <h2 className="text-xl font-bold">History clean? Now the other question: what should you pay?</h2>
          <p className="mt-2 text-ink-2">
            Run the VIN free for the specification, open recalls, crash ratings and running costs. Then from{' '}
            {`$${PRODUCTS.valuation.price}`}, see what this exact car is worth at its mileage near your ZIP code and whether
            the asking price stands up. The {`$${PRODUCTS.worthit.price}`} Worth It report adds what it cost new and its
            factory options; the {`$${PRODUCTS.negotiation.price}`} bundle adds your opening offer and walk-away price.
          </p>
          <div className="mt-5">
            <VinForm size="md" />
          </div>
          <NotAHistoryReport />
        </div>

        <FaqBlock faqs={faqs} />
        <SourcesNote sources={VHR_SOURCES} />
        <ClusterLinks except="/best-vehicle-history-report" />
      </div>
      <StickyVinCta />
    </>
  );
}
