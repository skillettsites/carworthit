import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import StickyVinCta from '@/components/StickyVinCta';
import VerifiedLine from '@/components/VerifiedLine';
import SalesTaxCalc from '@/components/calc/SalesTaxCalc';
import { faqSchema, breadcrumbSchema, howToSchema } from '@/lib/schema';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import {
  STATES,
  CALC_STATES,
  META,
  fmtLongDate,
  stateRateText,
  localRangeText,
  tradeInText,
  pct,
  joinNames,
  tidy,
} from '@/lib/state-fees';

const PATH = '/car-sales-tax-calculator';
const VERIFIED = fmtLongDate(META.checked);

export const metadata: Metadata = {
  title: 'Car Sales Tax Calculator by State (2026 Rates)',
  description: `Sales tax on a used car in any US state, with the trade-in credit and local rate applied. All 50 states plus DC, every rate sourced from the state and verified ${VERIFIED}.`,
  alternates: { canonical: `${SITE_URL}${PATH}` },
};

/**
 * Facts for the opening paragraph and FAQs, derived from the dataset at build
 * time so the prose can never disagree with the table under it.
 */
function facts() {
  const rated = STATES.filter((s) => s.salesTax.stateRate !== null);
  const noTax = rated.filter((s) => s.salesTax.rateType === 'none' || s.salesTax.stateRate === 0);
  const taxed = rated.filter((s) => (s.salesTax.stateRate ?? 0) > 0);
  const maxRate = taxed.length ? Math.max(...taxed.map((s) => s.salesTax.stateRate ?? 0)) : 0;
  const maxStates = taxed.filter((s) => s.salesTax.stateRate === maxRate);
  const withLocal = STATES.filter((s) => s.salesTax.localApplies && s.salesTax.localMax !== null);
  const maxLocal = withLocal.length ? Math.max(...withLocal.map((s) => s.salesTax.localMax ?? 0)) : 0;
  const maxLocalStates = withLocal.filter((s) => s.salesTax.localMax === maxLocal);
  const full = STATES.filter((s) => s.tradeIn.credit === 'full');
  const none = STATES.filter((s) => s.tradeIn.credit === 'none');
  const partial = STATES.filter((s) => s.tradeIn.credit === 'partial');
  const privateTaxed = STATES.filter((s) => s.privateSale.taxed === true);
  const presumptive = STATES.filter((s) => s.privateSale.taxed === true && s.privateSale.valuationRule);
  const noTaxWithLocal = noTax.filter((s) => s.salesTax.localApplies);
  // DC's excise is a verified table rather than one rate, so it is not "unverified".
  const unverified = STATES.filter((s) => s.salesTax.stateRate === null && !s.salesTax.rateText);
  return {
    noTax,
    maxRate,
    maxStates,
    maxLocal,
    maxLocalStates,
    full,
    none,
    partial,
    privateTaxed,
    presumptive,
    noTaxWithLocal,
    unverified,
  };
}

const F = facts();

const opening = tidy(
  `Car sales tax by state, verified ${VERIFIED}. State rates on a used car run from ${
    F.noTax.length ? `none in ${joinNames(F.noTax)}` : 'zero'
  } to ${pct(F.maxRate)} in ${joinNames(F.maxStates)}, before local taxes, which add up to ${pct(F.maxLocal)} on top of the state rate in ${joinNames(
    F.maxLocalStates,
  )}. ${F.full.length} of the 50 states and DC deduct a trade-in before tax, ${F.none.length} tax the full price${
    F.partial.length ? ` and ${F.partial.length} deduct part of it` : ''
  }. Pick your state and the calculator applies its rule.`,
);

const faqs = [
  {
    q: 'How is sales tax on a used car calculated?',
    a: `Take the agreed price, subtract the trade-in where your state allows it, and multiply by the state rate plus any local rate for the address where you will register the car. A dealer collects the tax at signing; on a private sale you pay it when you title the car. The calculator above does exactly that with each state's own rule, verified ${VERIFIED}.`,
  },
  {
    q: 'Which states have no sales tax on a car purchase?',
    a: tidy(
      F.noTax.length
        ? `As of ${VERIFIED}, ${joinNames(F.noTax)} charge no state sales tax on a vehicle purchase. ${
            F.noTaxWithLocal.length ? `Local sales taxes can still apply in ${joinNames(F.noTaxWithLocal)}.` : ''
          } Buying in one of them does not avoid tax if you register the car elsewhere: your home state charges its own tax when you title it.`
        : `We have not verified a zero-rate state against a state source as of ${VERIFIED}.`,
    ),
  },
  {
    q: 'Do I pay sales tax on a private-party car sale?',
    a: tidy(
      `In ${F.privateTaxed.length} of the 50 states and DC in our table, yes: the buyer pays the same tax when titling the car, at the DMV or county tax office rather than to the seller. ${
        F.presumptive.length
          ? `${joinNames(F.presumptive)} tax a presumptive or book value when it is higher than the price you paid, so a low figure on the bill of sale does not lower the tax.`
          : ''
      } Each state page says where you pay.`,
    ),
  },
  {
    q: 'Does a trade-in reduce the sales tax?',
    a: tidy(
      `In ${F.full.length} states the trade-in allowance comes off the price before tax, so on a $30,000 car with a $10,000 trade you pay tax on $20,000. ${
        F.none.length ? `${joinNames(F.none)} tax the full price regardless of the trade-in.` : ''
      } ${F.partial.length ? `${joinNames(F.partial)} deduct only part of it.` : ''} Enter your trade-in above and the calculator applies the rule for the state you pick.`,
    ),
  },
  {
    q: 'Do I pay tax where I buy the car or where I live?',
    a: 'Where you register it. Vehicle sales tax follows the registration address, so a dealer in another state usually collects nothing or your home state’s rate, and your DMV bills any difference when you title the car. Local rates are usually based on where the car will be registered too, though some states use the dealer’s location; the state pages note this where the state says so, and the calculator lets you type in your own combined local rate.',
  },
  {
    q: 'Is the dealer doc fee included in this calculator?',
    a: 'No. The documentation fee is a dealer charge on top of the price, and in some states it is itself taxable. Our dealer doc fee by state table lists each state’s cap or typical fee, and the out-the-door price calculator adds the doc fee, title and registration to the tax to show the full figure.',
  },
  {
    q: 'How current are these rates?',
    a: tidy(
      `Every row was checked against the state's own revenue or DMV page on ${VERIFIED}, with the source linked on each state page. We re-verify the full table quarterly, next due ${fmtLongDate(
        META.refreshDue,
      )}. ${
        F.unverified.length
          ? `Where a rate could not be confirmed against a state source (${joinNames(F.unverified)}) it is shown as not verified rather than estimated.`
          : 'Where a figure cannot be confirmed against a state source it is shown as not verified rather than estimated.'
      }`,
    ),
  },
];

const howTo = howToSchema(
  'How to calculate sales tax on a used car',
  'Work out the state and local sales tax on a used car purchase, with the trade-in credit your state allows.',
  [
    { name: 'Enter the price', text: 'Type the agreed vehicle price, before fees.' },
    { name: 'Choose your state', text: 'Pick the state where you will register the car, not where the dealer is.' },
    { name: 'Enter a trade-in', text: 'If you are trading a car in, enter the allowance. The calculator deducts it only where the state does.' },
    { name: 'Add your local rate', text: 'If you know the combined local rate at your address, enter it; otherwise the state’s typical range is used.' },
    { name: 'Read the result', text: 'The state tax, the local estimate, the trade-in credit applied and the total are shown, with the state’s rule explained underneath.' },
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
            { name: 'Car Sales Tax Calculator', url: `${SITE_URL}${PATH}` },
          ]),
        ]}
      />
      <div className="container-x max-w-4xl py-12 pb-28">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-2">
          <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/tools" className="hover:text-ink">Calculators</Link> /{' '}
          <span className="text-ink">Car Sales Tax Calculator</span>
        </nav>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold">Car Sales Tax Calculator</h1>
        <p className="mt-3 text-lg text-ink-2 leading-relaxed">{opening}</p>
        <VerifiedLine className="mt-2" />

        <div className="mt-6">
          <SalesTaxCalc states={CALC_STATES} />
        </div>

        <p className="mt-4 text-sm text-ink-2">
          Want the full figure with doc fee, title and registration? Use the{' '}
          <Link href="/out-the-door-price-calculator" className="text-brand underline">out-the-door price calculator</Link>.
          Fee tables: <Link href="/dealer-doc-fee-by-state" className="text-brand underline">dealer doc fees by state</Link> and{' '}
          <Link href="/car-registration-fees-by-state" className="text-brand underline">registration and title fees by state</Link>.
        </p>

        <h2 className="mt-12 text-2xl font-extrabold">Car sales tax by state</h2>
        <p className="mt-2 text-ink-2">
          Every state and DC, with the state rate on a vehicle purchase, the typical local range, and whether a trade-in is
          deducted first. Click a state for the full rule set, the doc fee cap, title and registration fees, and the source
          for each figure.
        </p>
        <div className="table-scroll mt-4 border border-border" tabIndex={0}>
          <table className="w-full min-w-[640px] text-sm">
            <caption className="sr-only">Vehicle sales tax by state, verified {VERIFIED}</caption>
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-cyan-50 text-left">
                <th scope="col" className="border-b-2 border-blue-200 px-3 py-2.5 font-bold text-blue-900">State</th>
                <th scope="col" className="border-b-2 border-blue-200 px-3 py-2.5 font-bold text-blue-900">State rate</th>
                <th scope="col" className="border-b-2 border-blue-200 px-3 py-2.5 font-bold text-blue-900">Local range</th>
                <th scope="col" className="border-b-2 border-blue-200 px-3 py-2.5 font-bold text-blue-900">Trade-in credit</th>
                <th scope="col" className="border-b-2 border-blue-200 px-3 py-2.5 font-bold text-blue-900">Tax</th>
                <th scope="col" className="border-b-2 border-blue-200 px-3 py-2.5 font-bold text-blue-900">Verified</th>
              </tr>
            </thead>
            <tbody>
              {STATES.map((s) => (
                <tr key={s.code} className="border-b border-slate-100 even:bg-slate-50/60">
                  <td className="px-3 py-2.5">
                    <Link href={`${PATH}/${s.slug}`} className="font-semibold text-brand underline">{s.name}</Link>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">{stateRateText(s)}</td>
                  <td className="px-3 py-2.5 tabular-nums">{localRangeText(s)}</td>
                  <td className="px-3 py-2.5">{tradeInText(s)}</td>
                  <td className="px-3 py-2.5 text-ink-2">{s.salesTax.taxName ?? 'Not verified'}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-ink-2">{fmtLongDate(s.checked)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 text-2xl font-extrabold">What the calculator does, and what it leaves out</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          It applies the state rate to the price, deducts the trade-in first only where the state does, and adds the local
          range the state publishes. Where a state caps the tax at a dollar figure or charges a minimum, the calculator
          applies that too. It does not know your exact address, so the local figure is a range unless you type in your own
          rate, and it does not include the dealer documentation fee, title or registration; those are on the{' '}
          <Link href="/out-the-door-price-calculator" className="text-brand underline">out-the-door calculator</Link>.
        </p>
        <p className="mt-3 leading-relaxed text-ink-2">
          Tax is the one line on a buyer&apos;s order you cannot negotiate. The price is. CarWorthIt prices a specific VIN at
          its mileage against cars listed near your ZIP code from ${PRODUCTS.valuation.price}, and the ${PRODUCTS.negotiation.price}{' '}
          <Link href="/pricing" className="text-brand underline">{PRODUCTS.negotiation.name}</Link> adds an opening offer and a
          walk-away figure, so the number the tax is calculated on is the right one.
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
      <StickyVinCta />
    </>
  );
}
