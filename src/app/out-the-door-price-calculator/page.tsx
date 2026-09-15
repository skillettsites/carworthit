import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import SearchBox from '@/components/SearchBox';
import VerifiedLine from '@/components/VerifiedLine';
import OutTheDoorCalc from '@/components/calc/OutTheDoorCalc';
import { faqSchema, breadcrumbSchema, howToSchema } from '@/lib/schema';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import { STATES, CALC_STATES, META, fmtLongDate, money, joinNames, tidy } from '@/lib/state-fees';

const PATH = '/out-the-door-price-calculator';
const VERIFIED = fmtLongDate(META.checked);

export const metadata: Metadata = {
  title: 'Out-the-Door Car Price Calculator (2026)',
  description: `Itemize a used car's out-the-door price: sales tax with your state's trade-in rule, the dealer doc fee, title and registration, pre-filled from state figures verified ${VERIFIED}, plus which lines are negotiable.`,
  alternates: { canonical: `${SITE_URL}${PATH}` },
};

function facts() {
  const capped = STATES.filter((s) => s.docFee.cap !== null);
  const lowestCap = capped.length ? Math.min(...capped.map((s) => s.docFee.cap as number)) : 0;
  const titled = STATES.filter((s) => s.titleFee.amount !== null);
  const minTitle = titled.length ? Math.min(...titled.map((s) => s.titleFee.amount as number)) : 0;
  const maxTitle = titled.length ? Math.max(...titled.map((s) => s.titleFee.amount as number)) : 0;
  const full = STATES.filter((s) => s.tradeIn.credit === 'full');
  const none = STATES.filter((s) => s.tradeIn.credit === 'none');
  const noCap = STATES.filter((s) => s.docFee.capType === 'none');
  return { capped, lowestCap, minTitle, maxTitle, full, none, noCap };
}

const F = facts();

const opening = tidy(
  `An out-the-door price is the vehicle price plus sales tax, the dealer's documentation fee, title and registration, and any add-ons: the figure you actually pay. Verified ${VERIFIED}: doc fees are capped by law in ${
    F.capped.length
  } states (lowest ${money(F.lowestCap)}) and uncapped in ${F.noCap.length}, title fees run ${money(F.minTitle)} to ${money(
    F.maxTitle,
  )}, and ${F.full.length} of the 50 states and DC deduct a trade-in before tax while ${F.none.length} do not. Enter the asking price and your state and the calculator itemizes the rest.`,
);

const faqs = [
  {
    q: 'What does an out-the-door price include?',
    a: 'The vehicle price, sales tax, the dealer documentation fee, title and registration (sometimes shown as tag, title and license), and any add-ons or accessories on the order. It is the total you sign for, before financing. Ask every dealer for the out-the-door figure in writing, because the advertised price leaves all of this out.',
  },
  {
    q: 'Why is the tax shown as a range?',
    a: 'Because local sales tax depends on the address where you register the car, and the calculator does not take a ZIP code. It uses the state rate plus the state’s published local range; enter your own combined local rate and the range collapses to one figure. States with no local tax on vehicles show a single number.',
  },
  {
    q: 'Which lines on the buyer’s order are negotiable?',
    a: tidy(
      `The price, always. Add-ons such as nitrogen, etching, paint protection and fabric coating can be declined. Any “market adjustment” is dealer margin, not a fee. The doc fee is set by the dealer${
        F.capped.length ? ` (capped by law in ${F.capped.length} states)` : ''
      } and rarely removed, so ask for the same amount off the price instead. Sales tax, title and registration are set by the state and are not negotiable.`,
    ),
  },
  {
    q: 'Where do the pre-filled fees come from?',
    a: `Each state's doc fee cap (or the typical fee where there is no cap), title fee and base registration fee come from our state table, checked against the statute or DMV page on ${VERIFIED}; the state's own sales tax page quotes the source. They are starting points: overwrite them with the figures on the dealer's order, and if a fee is marked not verified, enter the dealer's number.`,
  },
  {
    q: 'Does a trade-in lower the out-the-door price?',
    a: tidy(
      `It lowers the amount you owe by its value, and in ${F.full.length} states it also lowers the tax, because the tax is calculated on the price after the trade-in. ${
        F.none.length ? `${joinNames(F.none)} tax the full price, so there the trade-in reduces only the amount due.` : ''
      } The calculator shows both lines separately.`,
    ),
  },
  {
    q: 'How do I know whether the asking price itself is fair?',
    a: `Price the specific car rather than the model. CarWorthIt values a VIN at its actual mileage against cars listed near your ZIP code from $${PRODUCTS.valuation.price}; the $${PRODUCTS.negotiation.price} ${PRODUCTS.negotiation.name} adds an opening offer, a walk-away price and the evidence for both. Put the resulting price into this calculator to see the out-the-door figure to aim for.`,
  },
];

const howTo = howToSchema(
  'How to calculate a used car’s out-the-door price',
  'Add sales tax, the dealer doc fee, title and registration to the asking price, with the trade-in rule for your state.',
  [
    { name: 'Enter the asking price', text: 'The price on the listing or the buyer’s order, before fees.' },
    { name: 'Choose your state', text: 'The state where you will register the car. The doc fee, title and registration pre-fill from the state table.' },
    { name: 'Enter a trade-in', text: 'The allowance the dealer offered. It reduces the tax only where the state allows.' },
    { name: 'Check the fee lines', text: 'Overwrite the doc fee, title and registration with the figures on the dealer’s order if you have it, and add any accessories or add-ons.' },
    { name: 'Read the itemized total', text: 'The out-the-door price and the amount due after trade-in, with the tax range explained.' },
  ],
);

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          howTo,
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Calculators', url: `${SITE_URL}/tools` },
            { name: 'Out-the-Door Price Calculator', url: `${SITE_URL}${PATH}` },
          ]),
        ]}
      />
      <div className="container-x max-w-4xl py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-2">
          <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/tools" className="hover:text-ink">Calculators</Link> /{' '}
          <span className="text-ink">Out-the-Door Price Calculator</span>
        </nav>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold">Out-the-Door Price Calculator</h1>
        <p className="mt-3 text-lg text-ink-2 leading-relaxed">{opening}</p>
        <VerifiedLine className="mt-2" />

        <div className="mt-6">
          <OutTheDoorCalc states={CALC_STATES} />
        </div>

        <h2 className="mt-12 text-2xl font-extrabold">How to read a dealer&apos;s buyer&apos;s order</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          Ask for the itemized quote by email before you visit. It should show the same lines as the calculator, in
          roughly this order:
        </p>
        <ul className="mt-3 space-y-2 text-ink-2">
          <li><strong className="text-ink">Selling price.</strong> The negotiated figure, not the sticker. Any &ldquo;market adjustment&rdquo; belongs here, and it is margin.</li>
          <li><strong className="text-ink">Trade-in allowance and payoff.</strong> What they credit for your car, and what is still owed on it. Check the allowance against a real valuation, not the dealer&apos;s.</li>
          <li><strong className="text-ink">Documentation fee.</strong> The dealer&apos;s own charge. Compare it with the <Link href="/dealer-doc-fee-by-state" className="text-brand underline">cap or typical fee for your state</Link>.</li>
          <li><strong className="text-ink">Sales tax.</strong> State plus local, on the price after the trade-in where your state allows. Check it with the <Link href="/car-sales-tax-calculator" className="text-brand underline">sales tax calculator</Link>.</li>
          <li><strong className="text-ink">Title, registration and plates.</strong> State fees passed through. They should match the <Link href="/car-registration-fees-by-state" className="text-brand underline">state schedule</Link>; a &ldquo;tag and title&rdquo; line well above it has something else inside.</li>
          <li><strong className="text-ink">Add-ons.</strong> Protection packages, etching, nitrogen, dealer-installed accessories. Each one is a yes-or-no decision, and the answer can be no.</li>
        </ul>

        <h2 className="mt-10 text-2xl font-extrabold">Which fees are negotiable</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="font-bold text-ink">Negotiable</p>
            <ul className="mt-2 space-y-1 text-sm text-ink-2">
              <li>The selling price</li>
              <li>Any market adjustment</li>
              <li>Add-ons and accessories (decline them)</li>
              <li>The trade-in allowance</li>
              <li>The doc fee, in effect: ask for it back in the price</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="font-bold text-ink">Fixed by the state</p>
            <ul className="mt-2 space-y-1 text-sm text-ink-2">
              <li>Sales tax</li>
              <li>Title fee</li>
              <li>Registration and plate fees</li>
              <li>Any state inspection or emissions fee</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8">
          <h2 className="text-xl font-bold">Now check the price the tax is built on</h2>
          <p className="mt-2 text-ink-2">
            You have just typed the asking price. Run the car&apos;s VIN to see what that exact vehicle is worth at its mileage
            against cars for sale near your ZIP code, from ${PRODUCTS.valuation.price}. The ${PRODUCTS.negotiation.price}{' '}
            <Link href="/pricing" className="text-brand underline font-semibold">{PRODUCTS.negotiation.name}</Link> adds your
            opening offer, your walk-away price and the evidence to argue for them.
          </p>
          <div className="mt-5 max-w-xl"><SearchBox /></div>
        </div>

        <p className="mt-6 text-sm text-ink-2">
          State rules and sources: pick your state on the{' '}
          <Link href="/car-sales-tax-calculator" className="text-brand underline">car sales tax calculator</Link> for the
          rate, trade-in credit, doc fee cap, title and registration with the state page each figure came from.
        </p>

        <h2 className="mt-10 text-2xl font-extrabold">Common questions</h2>
        <div className="mt-4 space-y-5">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-bold">{f.q}</h3>
              <p className="mt-1 leading-relaxed text-ink-2">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
