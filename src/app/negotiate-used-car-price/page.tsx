import type { Metadata } from 'next';
import Link from 'next/link';
import NegotiationCalc from '@/components/calc/NegotiationCalc';
import JsonLd from '@/components/JsonLd';
import StickyVinCta from '@/components/StickyVinCta';
import VinForm from '@/components/VinForm';
import { faqSchema, breadcrumbSchema, howToSchema } from '@/lib/schema';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import { SOURCES, FIGURES, DERIVED, CHECKED_ON, CHECKED_ON_LABEL } from '@/lib/negotiationGuide';

export const revalidate = 86400;

const PATH = '/negotiate-used-car-price';
const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

export const metadata: Metadata = {
  title: 'How to Negotiate a Used Car Price: Offer Calculator',
  description: `Typical room is ${FIGURES.medianSavingPct}% off asking (Consumer Reports). Type the asking price, dealer or private, and known faults to get an opening offer, target and walk-away price, each with its reasoning. Checked ${CHECKED_ON_LABEL}.`,
  alternates: { canonical: `${SITE_URL}${PATH}` },
};

const cite = (s: { name: string; url: string; date: string }) => (
  <a href={s.url} target="_blank" rel="noopener nofollow" className="text-brand underline">
    {s.name}
  </a>
);

const steps = [
  {
    name: 'Find out what comparable cars are listed at near you',
    text: `Look at the same year, model and similar mileage within driving distance. Buyers who shared researched values with the seller succeeded ${FIGURES.tacticResearchPct}% of the time in Consumer Reports' survey. The ${PRODUCTS.negotiation.name} does this for a specific VIN against live local listings.`,
  },
  {
    name: 'Get a pre-purchase inspection',
    text: `About ${usd(FIGURES.inspectionLow)} to ${usd(FIGURES.inspectionHigh)} at an independent shop (Consumer Reports). The report is your evidence: every fault on it is a quotable deduction, and the seller can read it.`,
  },
  {
    name: 'Set three numbers before you speak',
    text: 'An opening offer, a target and a walk-away price. Use the calculator above, then write them down. A number decided in the room is a number decided by the seller.',
  },
  {
    name: 'Ask, then stop talking',
    text: `"I have looked at what comparable cars are going for, I am interested and I can move quickly. Where can you get to on price?" Simply asking worked for ${FIGURES.tacticAskPct}% of successful hagglers, the highest of any tactic Consumer Reports measured.`,
  },
  {
    name: 'Make your opening offer and give one reason',
    text: 'State the number, then the single strongest fact behind it: the comparable listings, the inspection finding, the tires. One specific fact lands; a list invites them to argue the weakest item on it.',
  },
  {
    name: 'Climb in shrinking steps',
    text: 'Raise your offer by smaller and smaller increments, NerdWallet\'s example being $500, then $250, then $100. Each smaller step tells the seller you are running out of room, which is the message you want to send.',
  },
  {
    name: 'Confirm the out-the-door price before you agree',
    text: 'At a dealer, the number that matters is the total with tax, title, registration and every fee. Ask for it in writing and question any fee you did not expect. VIN etching and "reconditioning" are the usual ones.',
  },
  {
    name: 'Walk if it is above your ceiling, and leave your number',
    text: 'Politely. "That is more than I can justify, thanks for your time" is a complete sentence. Leave your name and number and ask them to call if anything changes. Sellers do call back.',
  },
];

const levers = [
  {
    title: '1. What comparable cars are actually listed at near you',
    detail: `The strongest thing you can say is a fact about their price rather than an opinion about their car. Sharing the value of similar cars researched online worked for ${FIGURES.tacticResearchPct}% of successful hagglers.`,
    source: SOURCES.crHaggle,
  },
  {
    title: '2. Just asking for a better price',
    detail: `The least clever tactic is the one that works most often: ${FIGURES.tacticAskPct}% of successful negotiators simply asked. Ask early, ask plainly, and let the silence do the work.`,
    source: SOURCES.crHaggle,
  },
  {
    title: '3. Tires that are near the end',
    detail: `A set of four costs about ${usd(DERIVED.tireSetUsd)} at the survey average of ${usd(FIGURES.tireEachUsd)} a tire plus ${usd(FIGURES.tireInstallEachUsd)} to fit each. A seller can check that in a minute, so it comes straight off the price.`,
    source: SOURCES.crTires,
  },
  {
    title: '4. Any repair you have a quote for',
    detail: `Brake pads run ${usd(FIGURES.brakePadsLow)} to ${usd(FIGURES.brakePadsHigh)} nationally, a timing belt ${usd(FIGURES.timingBeltLow)} to ${usd(FIGURES.timingBeltHigh)}. A written quote is better than any national figure, because it is about this car.`,
    source: SOURCES.repairpalBrakes,
  },
  {
    title: '5. The inspection report',
    detail: `${usd(FIGURES.inspectionLow)} to ${usd(FIGURES.inspectionHigh)} buys an independent list of what the car needs. Consumer Reports' own advice is to use that report when you begin to negotiate. It is the cheapest money in the whole transaction.`,
    source: SOURCES.crInspect,
  },
  {
    title: '6. How long the car has been on the lot',
    detail: `Dealers work to a ${FIGURES.dealerTurnDaysLow} to ${FIGURES.dealerTurnDaysHigh} day turn and trim the price every 10 days or so; after that the car goes to auction. Ask when it came in. A car past ${FIGURES.dealerTurnDaysLow} days is costing them money to keep.`,
    source: SOURCES.caredge,
  },
  {
    title: '7. Knowing what the dealer actually makes',
    detail: `Public dealer groups earned about ${usd(FIGURES.dealerGrossUsd)} in front-end gross per used car in Q2 2025; a former dealer puts the typical markup at ${usd(FIGURES.dealerMarkupLow)} to ${usd(FIGURES.dealerMarkupHigh)}. That is the room. Asking for $5,000 off a $15,000 car is asking them to lose money, and they will not.`,
    source: SOURCES.haig,
  },
  {
    title: '8. Arriving with financing already arranged',
    detail: 'Pre-approval from your bank or credit union turns you into a cash buyer in the dealer\'s eyes and takes the monthly-payment conversation off the table. Consumer Reports calls it a big leg up in the negotiation.',
    source: SOURCES.crBuy,
  },
  {
    title: '9. Negotiating the out-the-door price, one thing at a time',
    detail: 'Settle the price of the car first. Treat your trade-in as a separate transaction. Then ask for the total with every tax and fee, and question the ones you did not expect: VIN etching is not necessary unless you asked for it.',
    source: SOURCES.kbb,
  },
  {
    title: '10. Walking away, politely, and leaving your number',
    detail: `The only leverage that always exists. It worked for ${FIGURES.tacticWalkPct}% of successful hagglers, so it is not the first card to play, but a seller who watches you leave with your number in their hand has a decision to make.`,
    source: SOURCES.progressive,
  },
];

const notWork = [
  {
    title: 'A lowball offer',
    detail: 'Kelley Blue Book\'s advice is blunt: nobody wants a complete lowball offer. With a private seller it can end the conversation, and NerdWallet suggests asking for their best price instead of leading with a number that insults them.',
  },
  {
    title: 'Negotiating the monthly payment',
    detail: 'NerdWallet calls it a mistake, and it is: a payment can be made to look like anything by stretching the term. Negotiate the price of the car, and only the price of the car.',
  },
  {
    title: 'Quoting the mileage back as money off',
    detail: 'The asking price of a used car already reflects its mileage. Asking for a further discount because it has done 90,000 miles is asking to be paid twice for the same thing, and a dealer will say so. Mileage is a condition argument and a reason to inspect, not a number.',
  },
  {
    title: 'Threatening to walk without meaning it',
    detail: `Threatening to walk away worked for only ${FIGURES.tacticWalkPct}% of successful hagglers, the weakest of the three tactics Consumer Reports measured. Sellers hear it all day. Actually leaving is different, and it works.`,
  },
  {
    title: 'Bundling your trade-in into the deal',
    detail: 'A dealer can give you a great trade-in figure and take it back on the price, or the reverse. Kelley Blue Book\'s advice is to treat the sale of your existing car as a separate transaction.',
  },
  {
    title: 'Inventing faults',
    detail: 'Sellers hear manufactured complaints all day and can usually tell. If there is nothing wrong with the car, do not pretend there is. "I am ready to buy today if we can get to the right number" is worth more than a weak criticism.',
  },
];

const faqs = [
  {
    q: 'How much can you negotiate on a used car?',
    a: `In Consumer Reports' survey of 1,006 used-car buyers, ${FIGURES.haggledPct}% haggled, ${FIGURES.succeededPct}% of those succeeded, and the median saving was ${usd(FIGURES.medianSavingUsd)}, or ${FIGURES.medianSavingPct}% off the asking price. On a dealer car the room is bounded by what the dealer makes: about ${usd(FIGURES.dealerGrossUsd)} front-end gross per used vehicle at public dealer groups in Q2 2025 (Haig Partners), or a markup of ${usd(FIGURES.dealerMarkupLow)} to ${usd(FIGURES.dealerMarkupHigh)} according to a former dealer at CarEdge. Figures checked ${CHECKED_ON_LABEL}.`,
  },
  {
    q: 'Is 10% or 20% below asking a reasonable offer?',
    a: `NerdWallet's worked example opens about 8% under the car's market value ($23,000 on a $25,000 car) and climbs in steps of $500, $250 and $100, so an opening around 10% under a fairly priced car is in that spirit and leaves room to move. Twenty percent under is a lowball, and Kelley Blue Book's advice is that nobody wants one. On a dealer car, remember the whole markup is typically ${usd(FIGURES.dealerMarkupLow)} to ${usd(FIGURES.dealerMarkupHigh)} (CarEdge): 20% off a $20,000 car is $4,000, more than the dealer usually has in it.`,
  },
  {
    q: 'Do dealers negotiate on used cars?',
    a: `Yes, within the margin they have. Kelley Blue Book notes dealership prices are "pretty much set" compared with private sales, but Consumer Reports found ${FIGURES.succeededPct}% of buyers who haggled got something. Ask how long the car has been on the lot: dealers typically want a used car gone within ${FIGURES.dealerTurnDaysLow} to ${FIGURES.dealerTurnDaysHigh} days and cut the price every 10 days or so (CarEdge).`,
  },
  {
    q: 'Can you negotiate more with a private seller?',
    a: 'Usually. NerdWallet and Kelley Blue Book both say private sellers tend to have more room and more willingness than a dealership, though neither publishes a percentage and we have not invented one. The trade-off is that you carry the checks a dealer would do: title in the seller\'s name, lien payoff confirmed with the lender, and an independent inspection.',
  },
  {
    q: 'What is a walk-away price?',
    a: 'The number above which you buy a different car. On this page it is the advertised price less any work you can prove the car needs, because paying more than that means paying full price for a car that is not in advertised condition. A tighter ceiling needs local comparable listings, which is what the Negotiation Bundle uses: its walk-away is the local average for that VIN at its mileage.',
  },
  {
    q: 'Should I mention an open safety recall?',
    a: 'Yes, but as a condition rather than money off. Recall repairs are free at a franchised dealer, so ask for the work to be done and the paperwork handed over before you pay. Check any VIN free at nhtsa.gov/recalls, or run it through the free CarWorthIt report, which lists open campaigns for the year, make and model.',
  },
  {
    q: 'What is an out-the-door price and why does it matter?',
    a: 'The total you actually pay: the car, sales tax, title and registration fees, and the dealer\'s documentation fee and any add-ons. Two dealers can quote the same car price and differ by hundreds on the out-the-door figure, so ask for it in writing before you agree. Our out-the-door price calculator works it out by state.',
  },
  {
    q: 'How is the Negotiation Bundle different from this calculator?',
    a: `This calculator applies published typical ranges to the price you type; it cannot see the car. The ${PRODUCTS.negotiation.name} (${usd(PRODUCTS.negotiation.price)}) prices the actual VIN at its mileage against comparable cars listed near your ZIP code, then sets the opening offer at the cheapest comparable, the target between that and the local average, and the walk-away at the average, with each lever sourced. It also includes the ${PRODUCTS.valuation.name} and the ${PRODUCTS.worthit.name}.`,
  },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          howToSchema(
            'How to negotiate a used car price',
            'Set an opening offer, a target and a walk-away price from sourced typical ranges, then run the conversation in order.',
            steps,
          ),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Calculators', url: `${SITE_URL}/tools` },
            { name: 'Negotiate a used car price', url: `${SITE_URL}${PATH}` },
          ]),
        ]}
      />
      <div className="container-x max-w-3xl py-12 pb-28">
        <nav className="text-sm text-ink-2 mb-4">
          <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/tools" className="hover:text-ink">Calculators</Link>
        </nav>
        <h1 className="text-3xl md:text-4xl font-extrabold">How to Negotiate a Used Car Price</h1>
        <p className="mt-3 text-lg text-ink-2 leading-relaxed">
          Typical room on a used car is about <strong className="text-ink">{FIGURES.medianSavingPct}% off the asking price</strong>:
          in Consumer Reports&apos; survey of 1,006 buyers, {FIGURES.haggledPct}% haggled, {FIGURES.succeededPct}% of them won something,
          and the median saving was {usd(FIGURES.medianSavingUsd)}. On a dealer car the ceiling is the dealer&apos;s own margin, about{' '}
          {usd(FIGURES.dealerGrossUsd)} per used car at public dealer groups in Q2 2025. Type the asking price and what you know about the car, and
          the calculator turns those published ranges into an opening offer, a target and a walk-away price, each with its reasoning.
        </p>
        <p className="mt-2 text-sm text-ink-2">
          Figures checked <time dateTime={CHECKED_ON}>{CHECKED_ON_LABEL}</time>. Every number names its source.
        </p>

        <div className="mt-6">
          <NegotiationCalc />
        </div>

        <h2 className="mt-12 text-2xl font-extrabold">The negotiation script, in order</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          Eight steps. The order matters more than the words: the numbers are set before you speak, the ask comes before the
          offer, and the out-the-door total comes before the handshake.
        </p>
        <ol className="mt-5 space-y-5">
          {steps.map((s, i) => (
            <li key={s.name} className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">{i + 1}</div>
              <div>
                <h3 className="font-bold text-ink">{s.name}</h3>
                <p className="mt-1 leading-relaxed text-ink-2">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <h2 className="mt-12 text-2xl font-extrabold">The 10 levers that actually move the price</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          Each one carries its source, so you can say where it came from if you are challenged. Notice what is not on the
          list: mileage, age and &quot;I saw one cheaper online somewhere&quot;. Those are opinions. These are facts.
        </p>
        <div className="mt-5 space-y-4">
          {levers.map((l) => (
            <div key={l.title} className="rounded-xl border border-border bg-white p-5">
              <h3 className="font-bold text-ink">{l.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{l.detail}</p>
              <p className="mt-2 text-xs text-ink-2/80">
                Source: {cite(l.source)}, {l.source.date}.
              </p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-extrabold">What does not work</h2>
        <div className="mt-5 space-y-4">
          {notWork.map((n) => (
            <div key={n.title} className="rounded-xl border border-warn/30 bg-warn/5 p-5">
              <h3 className="font-bold text-ink">{n.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{n.detail}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-extrabold">Dealer vs private seller: what changes</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-white p-5">
            <h3 className="font-bold text-ink">At a dealer</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-2">
              <li>
                <strong className="text-ink">The room is the margin.</strong> About {usd(FIGURES.dealerGrossUsd)} front-end gross per used car
                (Haig Partners, Q2 2025); a {usd(FIGURES.dealerMarkupLow)} to {usd(FIGURES.dealerMarkupHigh)} markup (CarEdge).
              </li>
              <li>
                <strong className="text-ink">Time is your friend.</strong> A {FIGURES.dealerTurnDaysLow} to {FIGURES.dealerTurnDaysHigh} day turn policy
                with price cuts every 10 days or so.
              </li>
              <li>
                <strong className="text-ink">Negotiate the out-the-door price.</strong> Fees can take back what you won on the car. Question
                VIN etching and reconditioning charges (Kelley Blue Book).
              </li>
              <li>
                <strong className="text-ink">Keep the trade-in separate.</strong> One number at a time.
              </li>
              <li>
                <strong className="text-ink">Arrive pre-approved.</strong> It removes the monthly-payment conversation entirely.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <h3 className="font-bold text-ink">With a private seller</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-2">
              <li>
                <strong className="text-ink">Usually cheaper and usually more flexible</strong> (NerdWallet, Kelley Blue Book), with no published
                percentage for either.
              </li>
              <li>
                <strong className="text-ink">Ask &quot;what is your best price?&quot; first.</strong> A lowball can end it (NerdWallet).
              </li>
              <li>
                <strong className="text-ink">You carry the dealer&apos;s checks.</strong> Title in their name, matching their ID; lien payoff
                confirmed with the lender; VIN on the dash, door jamb and title all agreeing.
              </li>
              <li>
                <strong className="text-ink">The {usd(FIGURES.inspectionLow)} to {usd(FIGURES.inspectionHigh)} inspection is not optional.</strong>{' '}
                There is no dealer to go back to afterwards.
              </li>
              <li>
                <strong className="text-ink">Ask why they are selling, then ask again later.</strong> The answers should match.
              </li>
            </ul>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-extrabold">Out-the-door pricing</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          The price of the car is not what you pay. Sales tax, title and registration fees and the dealer&apos;s documentation fee sit
          on top, and they differ by state. Two dealers can agree the same car price and be hundreds apart on the total. Ask for the
          out-the-door figure in writing before you agree to anything, and work it out yourself first with the{' '}
          <Link href="/out-the-door-price-calculator" className="font-semibold text-brand underline">
            out-the-door price calculator
          </Link>
          .
        </p>

        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8">
          <h2 className="text-xl font-bold">The honest next step: numbers for the actual car</h2>
          <p className="mt-2 leading-relaxed text-ink-2">
            Everything above is typical. The {PRODUCTS.negotiation.name}, {usd(PRODUCTS.negotiation.price)}, is specific: it prices the VIN
            at its real mileage against comparable cars listed near your ZIP code, opens at the cheapest of them, aims between that and
            the local average, and walks above the average, with every lever sourced, what the seller will argue back, the conversation
            in order and the checks to make before any money moves. It includes the {usd(PRODUCTS.valuation.price)} {PRODUCTS.valuation.name}{' '}
            and the {usd(PRODUCTS.worthit.price)} {PRODUCTS.worthit.name}. Start with the free VIN report.
          </p>
          <div className="mt-5">
            <VinForm size="md" />
          </div>
          <p className="mt-3 text-sm text-ink-2">
            <Link href="/pricing" className="font-semibold text-brand underline">
              See what each report includes
            </Link>
            . CarWorthIt does not sell vehicle history reports and is not an NMVTIS provider; for title, salvage and odometer records use an
            NMVTIS-approved provider.
          </p>
        </div>

        <h2 className="mt-12 text-2xl font-extrabold">Common questions</h2>
        <div className="mt-4 space-y-5">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-bold">{f.q}</h3>
              <p className="mt-1 leading-relaxed text-ink-2">{f.a}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-extrabold">Sources</h2>
        <p className="mt-2 text-sm text-ink-2">
          Every figure on this page and in the calculator comes from one of these, checked {CHECKED_ON_LABEL}.
        </p>
        <ul className="mt-3 space-y-2 text-sm text-ink-2">
          {Object.values(SOURCES).map((s) => (
            <li key={s.id}>
              {cite(s)} ({s.date}): {s.quote}
            </li>
          ))}
        </ul>

        <h2 className="mt-10 text-2xl font-extrabold">Read next</h2>
        <ul className="mt-3 space-y-2">
          <li>
            <Link href="/guides/used-car-checklist" className="text-brand underline">
              The used-car buying checklist
            </Link>
          </li>
          <li>
            <Link href="/blog/how-to-price-a-used-car-by-vin" className="text-brand underline">
              How to price a used car by VIN
            </Link>
          </li>
          <li>
            <Link href="/blog/carvana-vs-carmax-offer" className="text-brand underline">
              Carvana vs CarMax offers
            </Link>
          </li>
          <li>
            <Link href="/depreciation-calculator" className="text-brand underline">
              Depreciation calculator
            </Link>
          </li>
        </ul>
      </div>
      <StickyVinCta />
    </>
  );
}
