import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import VinForm from '@/components/VinForm';
import StickyVinCta from '@/components/StickyVinCta';
import { FaqBlock, ClusterLinks, SourcesNote } from '@/components/DecisionBits';
import { faqSchema, breadcrumbSchema, howToSchema } from '@/lib/schema';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import { CHECKED_ON, CHECKED_ON_LONG, NICB, NMVTIS, NHTSA_RECALLS, VINAUDIT, type Source } from '@/lib/vhr-providers';

/**
 * The one used-car checklist.
 *
 * Three pages used to chase the same query: this guide, /blog/used-car-inspection-checklist
 * (226 words) and /blog/how-to-check-a-used-car-before-buying (572 words). Both
 * blog posts now redirect here and their only distinct material (the three-layer
 * structure, the inspection table, the negotiation angle) is folded in below.
 */

export const metadata: Metadata = {
  title: 'Used Car Checklist: 46 Checks Before You Buy (2026)',
  description:
    'The complete used-car buying checklist for US buyers: the free VIN checks, the history report, the in-person inspection and test drive, the paperwork, and how to turn what you find into a lower price. Printable.',
  alternates: { canonical: `${SITE_URL}/guides/used-car-checklist` },
};

const sources: Source[] = [
  {
    claim: 'NICB VINCheck is free, covers stolen-not-recovered and insurer total-loss records, five searches per 24 hours per IP',
    url: NICB.url,
    checked: CHECKED_ON,
  },
  { claim: 'NHTSA shows unrepaired recalls by VIN, free', url: NHTSA_RECALLS.url, checked: CHECKED_ON },
  {
    claim: 'An NMVTIS report covers current title, brand history, odometer, total loss and salvage history; approved providers are listed by the US Department of Justice',
    url: NMVTIS.understandingUrl,
    checked: CHECKED_ON,
  },
  { claim: `VinAudit, an approved NMVTIS provider, sells a single report for ${VINAUDIT.one}`, url: VINAUDIT.url, checked: CHECKED_ON },
  {
    claim: 'FTC: dealers must display a Buyers Guide in every used car offered for sale, saying whether it is sold "as is" or with a warranty',
    url: 'https://consumer.ftc.gov/articles/buying-used-car-dealer',
    checked: CHECKED_ON,
  },
];

type Item = { text: string; why?: string };
type Section = { id: string; title: string; when: string; items: Item[] };

const SECTIONS: Section[] = [
  {
    id: 'vin',
    title: '1. Before you go: the free VIN checks',
    when: 'Every car on your shortlist, from your sofa',
    items: [
      { text: 'Get the VIN from the listing. A seller who will not give it to you has answered a different question.' },
      { text: 'Decode it free and confirm the year, make, model, engine and trim match the ad.', why: 'A wrong trim in the listing is the most common honest mistake and the most common dishonest one.' },
      { text: 'Check the VIN for unrepaired recalls at NHTSA.', why: 'Free, official, and a recall repair is free at any franchised dealer.' },
      { text: 'Run the NICB VINCheck for theft and insurer total-loss records.', why: 'Free, five lookups a day. It only sees participating insurers, so a clean result is reassuring, not proof.' },
      { text: 'Note the EPA fuel economy and the five-year running cost.', why: 'A cheap car that costs $600 a year more in gas is not the cheap car.' },
      { text: 'Search the year, make and model plus "common problems" and read the recalls and complaints, not the forums.' },
    ],
  },
  {
    id: 'history',
    title: '2. The finalist: buy one history report',
    when: 'The one or two cars you are serious about',
    items: [
      { text: `Buy an NMVTIS report from an approved provider (from ${VINAUDIT.one}) for the title, brand, odometer, total-loss and salvage history.`, why: 'NMVTIS is the federal title database every insurer, salvage yard and state titling agency must report to. It is the source the paid reports draw their brand data from.' },
      { text: 'Look for any brand: salvage, rebuilt, junk, flood, lemon. Any of them changes the price, the insurance and the resale.' },
      { text: 'Read every odometer reading in order. A reading lower than an earlier one is a rollback until proven otherwise.' },
      { text: 'Check the title state history. A car titled in three states in two years is a title-washing pattern.' },
      { text: 'Pay for Carfax or AutoCheck only if the car is expensive enough that a documented service trail changes your decision.', why: 'Their proprietary dealer and auction feeds are the one thing the cheaper reports do not have.' },
      { text: 'If the seller already has a report, ask for it, then still run the NMVTIS check yourself. Reports go stale.' },
    ],
  },
  {
    id: 'paperwork',
    title: '3. Paperwork, before you drive it',
    when: 'At the seller’s, before the test drive',
    items: [
      { text: 'The VIN on the dashboard, the door-jamb sticker and the title all match the VIN you checked.' },
      { text: 'The title is in the seller’s name and their ID matches it. If it is not, walk away or insist the titled owner attends.' },
      { text: 'No lien is shown on the title, or the seller has a lien-release letter from the lender.' },
      { text: 'The odometer on the title (or last transfer) is lower than the odometer in the car.' },
      { text: 'Service records exist, and the mileages on them line up with the odometer history in the report.' },
      { text: 'For a dealer: the buyer’s guide is in the window and it says "as is" or "warranty". That sticker is the contract.' },
    ],
  },
  {
    id: 'exterior',
    title: '4. Outside the car',
    when: 'In daylight, dry, with the car cold',
    items: [
      { text: 'Panel gaps even all the way round. Uneven gaps on one side mean that side has been apart.' },
      { text: 'Paint color and texture the same on every panel. Overspray on rubber trim or in the door jambs means repainting.' },
      { text: 'All four tires the same brand and size, with even tread across each tire.', why: 'Wear on one edge points to alignment or suspension damage, not just a cheap owner.' },
      { text: 'Rust check: wheel arches, rocker panels, the bottom of the doors and under the trunk carpet.' },
      { text: 'Glass: chips in the windshield, and the manufacturer logo the same on every window. One different window has been replaced.' },
      { text: 'Every light and lens works and none is fogged inside. Bolt heads under the hood and on the fenders unmarked by a wrench.' },
    ],
  },
  {
    id: 'interior',
    title: '5. Inside the car',
    when: 'Before you start it',
    items: [
      { text: 'Wear on the driver’s seat bolster, the pedals and the steering wheel matches the mileage. A 40,000-mile car with a shiny steering wheel and a worn-through pedal is not a 40,000-mile car.' },
      { text: 'Musty smell, damp carpet, silt under the seats or in the spare-wheel well, rust on the seat bolts: any of these is a flood car until proven otherwise.' },
      { text: 'Turn the key to "on" without starting. Every warning light should come on, then go out. A bulb that never lights has been removed.' },
      { text: 'Test every electrical item: windows, locks, mirrors, seats, climate control on both hot and cold, the infotainment, the cameras, the USB ports.' },
      { text: 'Airbag light comes on and goes off. An airbag light that stays on, or never lights, is a deal-breaker.' },
    ],
  },
  {
    id: 'engine',
    title: '6. Under the hood and the cold start',
    when: 'The engine must be cold; ask the seller not to warm it up',
    items: [
      { text: 'Oil: level, color and no milky residue on the cap or dipstick (coolant in the oil).' },
      { text: 'Coolant: the right color, at the mark, no oil film in the reservoir.' },
      { text: 'Transmission fluid where there is a dipstick: red or pink, not brown, and no burnt smell.' },
      { text: 'Belts, hoses and the battery terminals. Look for fresh leaks under the car after it has sat.' },
      { text: 'Cold start: it should fire straight away. Listen for knocks and rattles in the first thirty seconds and watch the exhaust for blue (oil) or white (coolant) smoke.' },
    ],
  },
  {
    id: 'drive',
    title: '7. The test drive',
    when: 'At least 20 minutes, including a highway stretch',
    items: [
      { text: 'Brakes: firm pedal, straight stop, no pulsing or pulling.' },
      { text: 'Steering: the car tracks straight with your hands off the wheel on a flat road, and there is no play or clunk over bumps.' },
      { text: 'Transmission: smooth shifts up and down, no flare, no hunting, no shudder on take-off.' },
      { text: 'Full-throttle acceleration once, on a safe road, listening for hesitation or a check-engine light.' },
      { text: 'Tight turns both ways at low speed with the windows down: clicking means a worn CV joint.' },
      { text: 'Highway speed: no vibration through the wheel or the seat, and the temperature gauge stays steady.' },
    ],
  },
  {
    id: 'ppi',
    title: '8. The pre-purchase inspection',
    when: 'Any car you are about to pay real money for',
    items: [
      { text: 'Book an independent mechanic, not the seller’s. A lift and a scan tool find what a driveway cannot: frame repairs, hidden leaks, stored fault codes.' },
      { text: 'Ask specifically for a check of structural repairs and the airbag system if the report showed an accident.' },
      { text: 'A seller who refuses an inspection has told you what it would find.' },
    ],
  },
  {
    id: 'price',
    title: '9. The price, last',
    when: 'Only after the car has passed everything above',
    items: [
      { text: `Find out what this exact car is worth at its mileage near you, then compare that with the asking price. CarWorthIt does that from $${PRODUCTS.valuation.price}, with a verdict on the seller's number.` },
      { text: 'Every fault you found is a number: a tire set, a brake job, an open recall the dealer must fix before delivery, a due service. Add them up and take them off your offer.' },
      { text: 'Decide your walk-away price before you talk, and say it out loud to yourself. The car you are looking at is not the last car.' },
    ],
  },
];

const HOWTO_STEPS = SECTIONS.map((s) => ({
  name: s.title.replace(/^\d+\.\s*/, ''),
  text: s.items.map((i) => i.text).join(' '),
}));

const faqs = [
  {
    q: 'What should I check when buying a used car?',
    a: 'Work in three layers. First the free checks on every car on your shortlist: decode the VIN, look up unrepaired recalls at NHTSA and run the NICB VINCheck for theft and total-loss records. Second, on the finalist, one history report: an NMVTIS report from an approved provider for the title, brand and odometer history, or Carfax or AutoCheck if a documented service trail matters. Third, in person: paperwork, exterior, interior, a cold start, a proper test drive and a pre-purchase inspection by an independent mechanic. Only then talk about price.',
  },
  {
    q: 'Is a vehicle history report enough on its own?',
    a: 'No. A history report catches paperwork problems you cannot see, such as a salvage brand or an odometer rollback, but it knows nothing about the car’s condition today. An inspection catches mechanical and repair problems the paperwork will never show. A clean report without an inspection, or an inspection without a report, both leave a gap.',
  },
  {
    q: 'How much should I spend checking a used car?',
    a: `The NHTSA and NICB checks are free. An NMVTIS history report from an approved provider starts at ${VINAUDIT.one} (VinAudit, checked ${CHECKED_ON_LONG}); Carfax and AutoCheck cost more and add dealer and auction records. A pre-purchase inspection by an independent mechanic is the best money in the whole process. Do the free checks on every car and pay only for the finalist.`,
  },
  {
    q: 'Should I get a used car inspected by a mechanic?',
    a: 'Yes, for anything you would mind losing money on. A mechanic with a lift and a scan tool finds frame repairs, hidden leaks and stored fault codes that a test drive and a history report both miss. If the seller refuses an inspection, treat that as the result.',
  },
  {
    q: 'What is the single most important check?',
    a: 'For fraud, the title and brand check: a salvage, flood or junk brand, or a stolen car, is a deal-breaker no matter how it drives. For condition, the pre-purchase inspection. Together with the free recall and theft checks they cover the risks that actually cost people money.',
  },
  {
    q: 'How do I use the checklist to negotiate?',
    a: 'Every finding is leverage. Worn tires, a due service, an open recall, a brake job and a mismatched panel are all numbers you can name. Add them up, take them off your offer, and be ready to walk. Knowing what the car is actually worth near you at its mileage is the other half of that conversation.',
  },
  {
    q: 'Does CarWorthIt do the history check?',
    a: 'No. CarWorthIt decodes the VIN free and shows specs, open recalls, crash ratings and running costs, then prices the car near you at its mileage. It holds no title, accident, theft, odometer or lien records and is not an NMVTIS provider. For the history, use an approved NMVTIS provider, the free NICB VINCheck, or Carfax or AutoCheck.',
  },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          howToSchema(
            'How to check a used car before you buy',
            'A nine-part checklist covering free VIN checks, the history report, paperwork, exterior, interior, cold start, test drive, inspection and price.',
            HOWTO_STEPS,
          ),
          faqSchema(faqs),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Guides', url: `${SITE_URL}/guides` },
            { name: 'Used-car checklist', url: `${SITE_URL}/guides/used-car-checklist` },
          ]),
        ]}
      />
      <div className="container-x max-w-3xl py-12 pb-28">
        <nav className="mb-4 text-sm text-ink-2">
          <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/guides" className="hover:text-ink">Guides</Link>
        </nav>
        <h1 className="text-3xl font-extrabold md:text-4xl">The used-car checklist: 46 checks before you buy</h1>
        <p className="mt-3 text-lg leading-relaxed text-ink-2">
          Checking a used car properly takes three layers: free VIN checks on every car you shortlist, one paid history
          report on the finalist, then a physical inspection and test drive. Do them in that order and you spend nothing
          on the cars you reject. Updated <time dateTime={CHECKED_ON}>{CHECKED_ON_LONG}</time>.
        </p>

        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold text-ink">Start with the free VIN report</p>
          <VinForm size="md" />
          <p className="mt-2 text-sm text-ink-2">
            Specs, open recalls, crash-test ratings and running costs, free, no signup. Not a history report: for
            title, theft and odometer records use step 2 below.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 text-sm">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="rounded-full border border-border bg-white px-3 py-1 text-ink-2 hover:border-brand hover:text-brand">
              {s.title.replace(/^\d+\.\s*/, '')}
            </a>
          ))}
          <a href="#print" className="rounded-full border border-border bg-white px-3 py-1 text-ink-2 hover:border-brand hover:text-brand">
            Printable version
          </a>
        </div>

        <h2 className="mt-10 text-2xl font-extrabold">Why three layers</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          A history report and a test drive cover different risks. The report catches paperwork problems you cannot
          see on a driveway: a salvage or flood brand applied in another state, an odometer that went backwards, a
          theft record, a lien. The inspection catches what no database knows: a bent frame straightened badly, a
          transmission that shudders when warm, an airbag that was never replaced. Buyers get burned by doing one and
          skipping the other. The free checks come first only because they cost nothing and rule cars out early,
          which is the cheapest thing a check can do.
        </p>

        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="mt-10 scroll-mt-24">
            <h2 className="text-2xl font-extrabold">{s.title}</h2>
            <p className="mt-1 text-sm font-medium text-ink-2">{s.when}</p>
            <ul className="mt-4 space-y-3">
              {s.items.map((i) => (
                <li key={i.text} className="flex gap-3">
                  <span aria-hidden className="mt-1.5 inline-block h-4 w-4 shrink-0 rounded border border-border bg-white" />
                  <div>
                    <p className="leading-relaxed text-ink">{i.text}</p>
                    {i.why && <p className="mt-0.5 text-sm text-ink-2">{i.why}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <h2 className="mt-12 text-2xl font-extrabold">The inspection at a glance</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border" tabIndex={0}>
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left">
                <th className="py-2.5 pl-3 pr-4 font-semibold">Check</th>
                <th className="py-2.5 pr-4 font-semibold">What you are looking for</th>
                <th className="py-2.5 pr-4 font-semibold">If it fails</th>
              </tr>
            </thead>
            <tbody className="text-ink-2">
              {[
                ['Panel gaps and paint', 'Even gaps, matching color, no overspray', 'Ask for the repair invoice or walk'],
                ['Tires', 'Matching set, even wear', 'Price a set and an alignment into your offer'],
                ['Fluids', 'Clean oil, correct coolant, red transmission fluid', 'Milky oil or brown fluid: walk'],
                ['Warning lights', 'All light on key-on, all go out', 'A missing light has been pulled: walk'],
                ['Cold start', 'Instant start, no smoke, no knock', 'Blue or white smoke: walk'],
                ['Test drive', 'Straight tracking, smooth shifts, no vibration', 'Get the inspection before any money moves'],
                ['Mechanic inspection', 'No structural repair, no stored codes', 'Deduct the repair or walk'],
              ].map((r) => (
                <tr key={r[0]} className="border-b border-border last:border-0">
                  <td className="py-2.5 pl-3 pr-4 align-top font-semibold text-ink">{r[0]}</td>
                  <td className="py-2.5 pr-4 align-top">{r[1]}</td>
                  <td className="py-2.5 pr-4 align-top">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section id="print" className="mt-12 scroll-mt-24 rounded-2xl border border-border bg-white p-6 print:border-0 print:p-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold">Printable checklist</h2>
              <p className="mt-1 text-sm text-ink-2">
                Every item above as a tick list. Print this page for a tick list to take with you.
              </p>
            </div>
            <span className="hidden text-xs text-ink-2 sm:block print:hidden">Use your browser&apos;s Print command</span>
          </div>
          <div className="mt-4 columns-1 gap-8 sm:columns-2">
            {SECTIONS.map((s) => (
              <div key={s.id} className="mb-5 break-inside-avoid">
                <h3 className="font-bold text-ink">{s.title}</h3>
                <ul className="mt-1.5 space-y-1 text-sm text-ink-2">
                  {s.items.map((i) => (
                    <li key={i.text} className="flex gap-2">
                      <span aria-hidden className="mt-1 inline-block h-3 w-3 shrink-0 rounded-sm border border-ink-2" />
                      <span>{i.text.split('.')[0]}.</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8">
          <h2 className="text-xl font-bold">Passed everything? Now find out what it is worth</h2>
          <p className="mt-2 text-ink-2">
            The checklist tells you whether to buy. It does not tell you what to pay. From {`$${PRODUCTS.valuation.price}`},
            CarWorthIt prices this exact VIN at its mileage against cars actually for sale near your ZIP code and says
            whether the asking price stands up. The {`$${PRODUCTS.negotiation.price}`} bundle adds your opening offer and
            walk-away price.
          </p>
          <div className="mt-5">
            <VinForm size="md" />
          </div>
        </div>

        <FaqBlock faqs={faqs} heading="Frequently asked questions" />

        <p className="mt-8 text-sm text-ink-2">
          Where the history checks come from and what they can and cannot show is set out in the{' '}
          <Link href="/vehicle-history-faq" className="text-brand underline">vehicle history FAQ</Link>, and the
          providers are compared, with dated prices, in{' '}
          <Link href="/best-vehicle-history-report" className="text-brand underline">best vehicle history report</Link>.
          Decode any VIN free with the <Link href="/vin-decoder" className="text-brand underline">VIN decoder</Link>.
        </p>

        <SourcesNote sources={sources} />
        <ClusterLinks except="/guides/used-car-checklist" />
      </div>
      <StickyVinCta />
    </>
  );
}
