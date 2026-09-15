import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import VinForm from '@/components/VinForm';
import StickyVinCta from '@/components/StickyVinCta';
import { CheckedOn, SourcesNote, ClusterLinks } from '@/components/DecisionBits';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';
import { SITE_URL, PRODUCTS, SUPPORT_EMAIL, upgradePriceCents } from '@/lib/constants';
import {
  CHECKED_ON,
  CHECKED_ON_LONG,
  CARFAX,
  AUTOCHECK,
  BUMPER,
  EPICVIN,
  VINAUDIT,
  CLEARVIN,
  NICB,
  NMVTIS,
  VHR_SOURCES,
} from '@/lib/vhr-providers';

/**
 * Shape A: one page that answers every question in the history-report cluster
 * in a form an assistant can quote. Every question is in the FAQPage JSON-LD,
 * every price carries its check date, and the CarWorthIt section says what the
 * products are and are not. Listed first in llms.txt under "Start here".
 *
 * Product facts (tiers, refunds, delivery, no PDF) are taken from
 * src/lib/constants.ts, /pricing, /terms and src/lib/email.ts so this page
 * cannot promise something the product does not do.
 */

export const metadata: Metadata = {
  title: 'Vehicle History Report FAQ: Brands, NMVTIS, Prices',
  description: `30 answers on vehicle history reports: what one shows, what NMVTIS is, salvage, rebuilt, flood and lemon brands, every provider's price checked ${CHECKED_ON_LONG}, and what CarWorthIt's $${PRODUCTS.valuation.price}, $${PRODUCTS.worthit.price} and $${PRODUCTS.negotiation.price} reports contain.`,
  alternates: { canonical: `${SITE_URL}/vehicle-history-faq` },
};

const URL = `${SITE_URL}/vehicle-history-faq`;
const upgrade = (upgradePriceCents('negotiation', 'valuation') / 100).toFixed(2);

type Faq = { q: string; a: string };
type Section = { id: string; title: string; faqs: Faq[] };

const SECTIONS: Section[] = [
  {
    id: 'what-it-shows',
    title: 'What a vehicle history report shows',
    faqs: [
      {
        q: 'What does a vehicle history report show?',
        a: 'Records tied to the 17-character VIN: the current state of title and title history, title brands such as salvage, rebuilt, flood, junk and lemon, odometer readings recorded at title transfers, insurer total-loss and salvage records, theft records and, on the premium reports, reported accidents, dealer service visits, auction sales, ownership count and prior use as a rental, fleet, taxi or police vehicle. What it shows depends on which provider you buy from and which sources report to it.',
      },
      {
        q: 'What does a vehicle history report not show?',
        a: 'The car\'s condition today. No report knows about a cash repair, an accident that was never claimed or reported, hidden rust, a bent frame that was straightened, or how well a rebuild was done. Carfax says in its own disclaimer that it only has the history reported to it, and NMVTIS says a clean report means nothing was reported, not that nothing happened. A pre-purchase inspection by a mechanic covers the half a report cannot.',
      },
      {
        q: 'Is a vehicle history report accurate?',
        a: 'Accurate to what was reported. Title brands, odometer readings at titling and total-loss records come from state agencies and insurers that are required by federal law to report to NMVTIS, so those are reliable when present. Accident and service records depend on whether a shop, insurer or auction sent the data. Two providers can disagree on the same car because they license different feeds.',
      },
      {
        q: 'Can two reports on the same car say different things?',
        a: 'Yes, and it is normal. Every provider has the NMVTIS core if it is approved to sell it, but the accident, service and auction layers are proprietary: the strength of Carfax is its dealer service feeds, AutoCheck (Experian) leans on auction announcements, and the budget providers add auction photos and sales listings. For an expensive car where the history matters, some buyers run two.',
      },
      {
        q: 'Which free checks are worth running before paying for a report?',
        a: `Two official ones. NHTSA shows unrepaired safety recalls for the VIN. The NICB VINCheck shows whether a participating insurer has reported the car stolen and not recovered, or declared it a salvage or flood total loss, with a limit of ${NICB.dailyCap} lookups per 24 hours (checked ${CHECKED_ON_LONG}). Add a free VIN decode to confirm the listing matches the car. None of these is a title history.`,
      },
    ],
  },
  {
    id: 'nmvtis',
    title: 'NMVTIS explained',
    faqs: [
      {
        q: 'What is NMVTIS?',
        a: 'The National Motor Vehicle Title Information System, a federal database run under the US Department of Justice. State motor vehicle titling agencies, insurance carriers, auto recyclers and junk and salvage yards are required by federal law to report to it, and all fifty states participated in fiscal 2023. It exists to stop stolen cars being retitled, to stop title brands being washed away by moving a car between states, and to keep unsafe vehicles off the road.',
      },
      {
        q: 'What is in an NMVTIS vehicle history report?',
        a: 'Five things, deliberately: the current state of title and the last title date; the brand history applied by any state; the odometer reading reported when the car was titled; total-loss history; and salvage history. The DOJ says an NMVTIS report is intentionally shorter than a private report and that repair histories and recall information are not intended to be in it. A "clean" NMVTIS report, in the DOJ\'s words, is a good thing.',
      },
      {
        q: 'Who can sell me an NMVTIS report?',
        a: `Only an approved NMVTIS data provider. On ${CHECKED_ON_LONG} the Department of Justice list of providers approved for the public was: ${NMVTIS.publicProviders.join(', ')}. Carfax (California, commercial customers only), Experian (AutoCheck), OneAIB, add123, Vitu and Yassi are listed for commercial customers only, and the DOJ states plainly that consumers cannot receive NMVTIS reports from Carfax, DMVDesk or Experian.`,
      },
      {
        q: 'Does a Carfax or AutoCheck report include NMVTIS data?',
        a: 'Not as a consumer NMVTIS report. Both show title brands and odometer readings from their own state and industry sources, which overlap heavily with what NMVTIS holds, but neither is approved to sell the federal record to the public. If you want the NMVTIS record itself, buy it from an approved consumer provider; it is the cheapest report on the market.',
      },
      {
        q: 'What is title washing, and does NMVTIS stop it?',
        a: 'Title washing is moving a branded car to a state that does not carry the brand forward, or does not brand that kind of damage, so the new paper title comes out clean. NMVTIS is designed to stop it: participating states query the system before issuing a title, and the brand history from every state stays attached to the VIN. That is why the report is worth buying even when the title in the seller\'s hand looks clean.',
      },
      {
        q: 'What is a cloned vehicle?',
        a: 'A stolen car wearing a legitimate VIN plate copied from another car of the same make, model and year, so it appears to have a valid VIN. The DOJ glossary defines it exactly that way. The defense is the physical check: the VIN on the dashboard, the door-jamb sticker and the title must all match, and the decoded specification must match the car in front of you.',
      },
    ],
  },
  {
    id: 'brands',
    title: 'Title brands: salvage, rebuilt, flood, lemon, junk',
    faqs: [
      {
        q: 'What is a title brand?',
        a: 'In the DOJ\'s definition, a designation placed on a vehicle ownership document that identifies an event affecting the value or safety of the vehicle, such as junk, salvage or flood. States apply brands; NMVTIS maps each state\'s brands to a common set and keeps the history from every state. A brand does not come off when the car is repaired or moves state.',
      },
      {
        q: 'What is a salvage title?',
        a: 'The brand a state applies after an insurer declares the car a total loss, usually because the repair cost exceeded the state\'s threshold as a share of the car\'s value; the threshold varies by state. A car with an active salvage brand generally cannot be registered or driven for normal road use until it has been repaired and passed a state inspection, at which point it becomes rebuilt.',
      },
      {
        q: 'What is a rebuilt title?',
        a: 'A salvage car that has been repaired and passed a state inspection, so it can be titled, registered and insured again. Some states call it reconstructed. The inspection confirms the car is roadworthy and the parts are not stolen; it does not certify the quality of the repair. The brand is permanent, most lenders will not finance a rebuilt title, and many insurers limit coverage.',
      },
      {
        q: 'What is a flood title, and why is it treated as worse?',
        a: 'A brand applied when the car was damaged by submersion or standing water. Flood cars can look perfect and fail months later, because water sits in wiring harnesses and control modules, including airbag sensors, and corrodes them. After Hurricane Katrina the DOJ documented flooded cars being trucked to states that do not brand flood damage, dried out and sold; that episode is part of why NMVTIS exists.',
      },
      {
        q: 'What is a lemon law buyback brand?',
        a: 'A brand showing the manufacturer repurchased the car under a state lemon law after repeated failures to fix a defect. The defect may or may not have been resolved before resale. It is one of the brands Carfax lists as "flood or lemon title" and one of the items eBay says an AutoCheck report will show.',
      },
      {
        q: 'What is a junk title?',
        a: 'A brand meaning the car was certified as fit only for parts or scrap. Junk and salvage yards must report these cars to NMVTIS if they handle five or more a year. A junk-branded VIN should not return to the road; if one is offered to you as a running car, that is the whole story.',
      },
      {
        q: 'What does "clean title" actually mean?',
        a: 'Only that the current title document carries no brand. It does not mean the car has never been in an accident, never been a total loss in a state that did not brand it, or never had its odometer tampered with. A clean title is where the check starts, not where it ends; the brand history across every state is what the NMVTIS report adds.',
      },
    ],
  },
  {
    id: 'prices',
    title: `What every provider charges, checked ${CHECKED_ON_LONG}`,
    faqs: [
      {
        q: 'How much does a Carfax report cost?',
        a: `${CARFAX.one} for one report, ${CARFAX.two} for two (${CARFAX.twoEach} each) or ${CARFAX.four} for four (${CARFAX.fourEach} each), as shown on Carfax's own purchase page on ${CHECKED_ON_LONG}. Every Carfax used-car listing includes a free report, dealers often link one, and a private seller may already have one.`,
      },
      {
        q: 'How much does an AutoCheck report cost?',
        a: `${AUTOCHECK.single} for a single report with ${AUTOCHECK.updatesDays} days of data updates, or ${AUTOCHECK.five} for five reports over 21 days, both one-time with no recurring charge, from AutoCheck's own product feed on ${CHECKED_ON_LONG}. Many eBay Motors listings include an AutoCheck report free in the Vehicle History Report tab.`,
      },
      {
        q: 'How much does Bumper cost?',
        a: `${BUMPER.monthly} a month for up to ${BUMPER.monthlyReports} reports, ${BUMPER.threeMonth} for three months, or a ${BUMPER.trialDays}-day trial at ${BUMPER.trialLow} (${BUMPER.trialHigh} with PDF download) that then bills ${BUMPER.monthly} a month until cancelled. A single one-time report is ${BUMPER.single}. All read from Bumper's checkout on ${CHECKED_ON_LONG}. Bumper is NMVTIS-approved.`,
      },
      {
        q: 'How much does EpicVIN cost?',
        a: `${EPICVIN.one} for one report, ${EPICVIN.four} for four or ${EPICVIN.sixteen} for sixteen, one-time; or a ${EPICVIN.trialDays}-day trial at ${EPICVIN.trial} (up to ${EPICVIN.trialDailyCap} reports a day) that then bills ${EPICVIN.monthly} a month plus tax until cancelled. From EpicVIN's US price page on ${CHECKED_ON_LONG}. EpicVIN is NMVTIS-approved.`,
      },
      {
        q: 'How much do VinAudit and ClearVin cost?',
        a: `VinAudit: ${VINAUDIT.one} for one, ${VINAUDIT.five} for five, ${VINAUDIT.ten} for ten. ClearVin: ${CLEARVIN.one} for one, ${CLEARVIN.two} for two, ${CLEARVIN.five} for five. Both are on the DOJ list of approved NMVTIS providers, both were read from the provider's own site on ${CHECKED_ON_LONG}, and neither includes dealer maintenance records.`,
      },
      {
        q: 'What is the cheapest vehicle history report?',
        a: `Free for part of it (NHTSA recalls, NICB theft and total-loss). Among paid reports we could verify on the provider's own site, VinAudit at ${VINAUDIT.one} is the cheapest single NMVTIS-approved report and EpicVIN's four for ${EPICVIN.four} is the cheapest per car. The $1 offers from Bumper and EpicVIN are trials that convert to ${BUMPER.monthly} and ${EPICVIN.monthly} a month. The full comparison, with the honest pick for each buyer, is on our best vehicle history report page.`,
      },
    ],
  },
  {
    id: 'carworthit',
    title: 'CarWorthIt: what it is, and what it is not',
    faqs: [
      {
        q: 'Is CarWorthIt a vehicle history report?',
        a: 'No. CarWorthIt is not an NMVTIS provider and holds no title, brand, accident, theft, odometer or lien records. It answers a different question: what the car is worth. The free report decodes the VIN using NHTSA data and shows the specification, open recalls, crash-test ratings and running costs; the paid reports add a local-market valuation and the original factory build record. For the history, use an approved NMVTIS provider, Carfax or AutoCheck, then use CarWorthIt for the price.',
      },
      {
        q: `What does the $${PRODUCTS.valuation.price} Valuation contain?`,
        a: `What that exact VIN is worth at its real mileage in your ZIP code, priced against comparable cars actually listed for sale near you: the local average and the low-to-high range, plus a verdict on whether the seller's asking price is fair, cheap or too much. It includes everything in the free report. It does not include any history data.`,
      },
      {
        q: `What does the $${PRODUCTS.worthit.price} Worth It report contain?`,
        a: `Everything in the Valuation, plus the original factory build record for that VIN: what it cost new (MSRP), the dealer invoice price when new, the factory-fitted options, the full standard equipment list, the original factory warranty terms, and total depreciation since new. This is the tier that also runs the VIN-level recall check. It is not a vehicle history report.`,
      },
      {
        q: `What does the $${PRODUCTS.negotiation.price} Negotiation Bundle contain?`,
        a: `Everything in both other reports, plus your opening offer, a target price and a walk-away price for the car in front of you, each derived from what comparable cars are listed at near you, your case for paying less with every claim sourced, what the seller is likely to argue back, the order to have the conversation in, and the checks to make before any money moves. The tiers stack: upgrading from the Valuation to the bundle costs $${upgrade}, not $${PRODUCTS.negotiation.price} again.`,
      },
      {
        q: 'Is there a subscription, and what is the refund policy?',
        a: `No subscription: you pay once for one report, there is no account and nothing to cancel. Refunds: if we cannot find comparable cars near you, we tell you plainly and refund you, with no conditions; if a report fails to generate or is materially defective, we fix it or refund it. Once a report has been produced and shown to you we have paid for the underlying data, so we do not refund it because you did not like what it said about the car. Email ${SUPPORT_EMAIL}.`,
      },
      {
        q: 'How fast is the report, and do I get a PDF?',
        a: 'The free report appears in seconds; a paid report is shown in your browser as soon as Stripe confirms the payment, and the link is emailed to you from reports@carworthit.com so you can open it later on another device. The report is a web page that stays current at that link rather than a PDF attachment; use your browser\'s print function if you want a paper or PDF copy.',
      },
    ],
  },
];

const ALL_FAQS = SECTIONS.flatMap((s) => s.faqs);

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(ALL_FAQS),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Guides', url: `${SITE_URL}/guides` },
            { name: 'Vehicle history FAQ', url: URL },
          ]),
        ]}
      />
      <div className="container-x max-w-3xl py-12 pb-28">
        <nav className="mb-4 text-sm text-ink-2">
          <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/guides" className="hover:text-ink">Guides</Link>
        </nav>
        <h1 className="text-3xl font-extrabold md:text-4xl">Vehicle history report FAQ</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2">
          {ALL_FAQS.length} short answers on what a vehicle history report shows, what NMVTIS is, what each title brand
          means, what every provider charges as of <time dateTime={CHECKED_ON}>{CHECKED_ON_LONG}</time> (Carfax{' '}
          {CARFAX.one}, AutoCheck {AUTOCHECK.single}, VinAudit {VINAUDIT.one}), and what CarWorthIt&apos;s reports do and
          do not contain. CarWorthIt is not a history report; that is answered below too.
        </p>
        <CheckedOn />

        <nav aria-label="Sections" className="mt-6 flex flex-wrap gap-2 text-sm">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="rounded-full border border-border bg-white px-3 py-1 text-ink-2 hover:border-brand hover:text-brand">
              {s.title}
            </a>
          ))}
        </nav>

        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="mt-10 scroll-mt-24">
            <h2 className="text-2xl font-extrabold">{s.title}</h2>
            <div className="mt-4 space-y-5">
              {s.faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-bold text-ink">{f.q}</h3>
                  <p className="mt-1 leading-relaxed text-ink-2">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8">
          <h2 className="text-xl font-bold">Decode a VIN free, then find out what the car is worth</h2>
          <p className="mt-2 text-ink-2">
            Specs, open recalls, crash ratings and running costs with no account. Then from{' '}
            {`$${PRODUCTS.valuation.price}`}, what this exact car is worth near you at its mileage. For the history, use one
            of the providers above; the comparison is on{' '}
            <Link href="/best-vehicle-history-report" className="text-brand underline">best vehicle history report</Link>.
          </p>
          <div className="mt-5">
            <VinForm size="md" />
          </div>
        </div>

        <p className="mt-8 text-sm leading-relaxed text-ink-2">
          Related: <Link href="/blog/carfax-report-cost" className="text-brand underline">what a Carfax report costs</Link>,{' '}
          <Link href="/blog/is-carfax-worth-it" className="text-brand underline">is Carfax worth it</Link>,{' '}
          <Link href="/bumper-review" className="text-brand underline">Bumper review</Link>,{' '}
          <Link href="/autocheck-free" className="text-brand underline">free AutoCheck report</Link>,{' '}
          <Link href="/blog/salvage-vs-rebuilt-title" className="text-brand underline">salvage vs rebuilt title</Link>, the{' '}
          <Link href="/guides/used-car-checklist" className="text-brand underline">used-car checklist</Link> and the free{' '}
          <Link href="/vin-decoder" className="text-brand underline">VIN decoder</Link>.
        </p>

        <SourcesNote sources={VHR_SOURCES} />
        <ClusterLinks except="/vehicle-history-faq" />
      </div>
      <StickyVinCta />
    </>
  );
}
