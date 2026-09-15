import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import StickyVinCta from '@/components/StickyVinCta';
import VerifiedLine from '@/components/VerifiedLine';
import SortableTable, { type SortRow } from '@/components/calc/SortableTable';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import { STATES, META, fmtLongDate, docFeeText, money, moneyRange, joinNames, tidy } from '@/lib/state-fees';

const PATH = '/dealer-doc-fee-by-state';
const VERIFIED = fmtLongDate(META.checked);
const UNKNOWN = 1e9;

export const metadata: Metadata = {
  title: 'Dealer Doc Fees by State (2026): Caps and Typical Fees',
  description: `Dealer documentation fee caps for all 50 states and DC, with the statute and the typical fee where there is no cap. Each figure sourced from the state and verified ${VERIFIED}.`,
  alternates: { canonical: `${SITE_URL}${PATH}` },
};

function facts() {
  const capped = STATES.filter((s) => s.docFee.cap !== null).sort((a, b) => (a.docFee.cap ?? 0) - (b.docFee.cap ?? 0));
  const lowestCap = capped.length ? (capped[0].docFee.cap as number) : 0;
  const highestCap = capped.length ? (capped[capped.length - 1].docFee.cap as number) : 0;
  const lowest = capped.filter((s) => s.docFee.cap === lowestCap);
  const highest = capped.filter((s) => s.docFee.cap === highestCap);
  const formula = STATES.filter((s) => s.docFee.cap === null && s.docFee.capType === 'formula');
  const noCap = STATES.filter((s) => s.docFee.capType === 'none');
  const typicalMins = noCap.map((s) => s.docFee.typicalMin).filter((n): n is number => n !== null);
  const typicalMaxs = noCap.map((s) => s.docFee.typicalMax).filter((n): n is number => n !== null);
  const typicalLow = typicalMins.length ? Math.min(...typicalMins) : null;
  const typicalHigh = typicalMaxs.length ? Math.max(...typicalMaxs) : null;
  const unverified = STATES.filter((s) => s.docFee.cap === null && s.docFee.capType === null);
  const under100 = capped.filter((s) => (s.docFee.cap ?? 0) <= 100);
  return { capped, lowestCap, highestCap, lowest, highest, formula, noCap, typicalLow, typicalHigh, unverified, under100 };
}

const F = facts();

const opening = tidy(
  `Dealer documentation fees by state, verified ${VERIFIED}. ${F.capped.length} states cap the doc fee by law, from ${money(
    F.lowestCap,
  )} in ${joinNames(F.lowest)} up to ${money(F.highestCap)} in ${joinNames(F.highest)}${
    F.formula.length ? `, and ${joinNames(F.formula)} cap it by formula` : ''
  }. ${F.noCap.length} of the 50 states and DC set no cap${
    F.typicalLow !== null && F.typicalHigh !== null ? `, where dealers typically charge ${moneyRange(F.typicalLow, F.typicalHigh)}` : ''
  }. The table sorts by fee, and every row links to its statute or state page.`,
);

const faqs = [
  {
    q: 'What is a dealer doc fee?',
    a: 'A documentation fee (doc fee, processing fee, conveyance fee) is the dealer’s charge for preparing the sales contract, title paperwork and registration filing. It is a dealer fee, not a government one, and it is added to the price on the buyer’s order. In capped states the dealer cannot charge more than the cap; in the others the dealer sets it.',
  },
  {
    q: 'Which states have the lowest doc fee caps?',
    a: tidy(
      F.capped.length
        ? `As of ${VERIFIED}, the lowest cap is ${money(F.lowestCap)} in ${joinNames(F.lowest)}. ${
            F.under100.length ? `${joinNames(F.under100)} all cap the fee at $100 or less.` : ''
          } The highest statutory cap is ${money(F.highestCap)} in ${joinNames(F.highest)}.`
        : `We have not verified a statutory cap against a state source as of ${VERIFIED}.`,
    ),
  },
  {
    q: 'Which states have no cap on dealer doc fees?',
    a: tidy(
      F.noCap.length
        ? `${joinNames(F.noCap)} set no legal maximum${
            F.typicalLow !== null && F.typicalHigh !== null ? `; typical fees there run ${moneyRange(F.typicalLow, F.typicalHigh)}` : ''
          }. ${
            F.unverified.length
              ? `For ${joinNames(F.unverified)} we could not confirm the rule against a state source, so the table says not verified.`
              : ''
          }`
        : `Every state in the table has a verified cap or formula as of ${VERIFIED}.`,
    ),
  },
  {
    q: 'Is the doc fee negotiable?',
    a: 'Dealers rarely remove it, and many say they charge every customer the same fee. What is always negotiable is the price, so treat the doc fee as part of the out-the-door figure and ask for the same amount off the car. In a capped state, check the fee on the buyer’s order against the cap in this table.',
  },
  {
    q: 'Is sales tax charged on the doc fee?',
    a: 'In some states yes, because the fee is treated as part of the selling price; in others it is not. The state revenue page linked on each state’s sales tax page is the place to confirm it. Our sales tax calculator applies the rate to the vehicle price only.',
  },
  {
    q: 'How current is this table?',
    a: tidy(
      `Every row was checked on ${VERIFIED} against the statute or the state page linked in the source column, and the table is re-verified quarterly, next due ${fmtLongDate(
        META.refreshDue,
      )}. Doc fee caps change at legislative sessions, so if the buyer's order shows a different figure, check the linked source before assuming the dealer is wrong.`,
    ),
  },
];

function rows(): SortRow[] {
  return STATES.map((s) => {
    const d = s.docFee;
    const amount = d.cap ?? d.typicalMax ?? d.typicalMin;
    const rule =
      d.cap !== null ? 'Statutory cap' : d.capType === 'formula' ? 'Formula cap' : d.capType === 'none' ? 'No cap' : 'Not verified';
    return {
      state: { text: s.name, sort: s.name, href: `/car-sales-tax-calculator/${s.slug}` },
      fee: { text: docFeeText(s), sort: amount ?? UNKNOWN },
      rule: { text: rule, sort: rule, sub: d.capNote ?? undefined },
      statute: { text: d.statute ?? (d.source ? 'See source' : 'Not verified'), sort: d.statute ?? 'zzz' },
      source: d.source
        ? {
            text: new URL(d.source).hostname.replace(/^www\./, ''),
            sort: d.sourceType === 'primary' ? 0 : 1,
            href: d.source,
            external: true,
            sub: d.sourceType === 'primary' ? 'State source' : 'Secondary, cites the statute',
          }
        : { text: 'Not verified', sort: 2 },
      verified: { text: fmtLongDate(s.checked), sort: s.checked },
    };
  });
}

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Calculators', url: `${SITE_URL}/tools` },
            { name: 'Dealer Doc Fees by State', url: `${SITE_URL}${PATH}` },
          ]),
        ]}
      />
      <div className="container-x max-w-4xl py-12 pb-28">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-2">
          <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/tools" className="hover:text-ink">Calculators</Link> /{' '}
          <span className="text-ink">Dealer Doc Fees by State</span>
        </nav>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold">Dealer Doc Fees by State</h1>
        <p className="mt-3 text-lg text-ink-2 leading-relaxed">{opening}</p>
        <VerifiedLine className="mt-2" />

        <div className="mt-6">
          <SortableTable
            caption={`Dealer documentation fee caps by state, verified ${VERIFIED}`}
            initialKey="state"
            columns={[
              { key: 'state', label: 'State' },
              { key: 'fee', label: 'Doc fee', numeric: true },
              { key: 'rule', label: 'Rule' },
              { key: 'statute', label: 'Statute' },
              { key: 'source', label: 'Source' },
              { key: 'verified', label: 'Verified' },
            ]}
            rows={rows()}
          />
        </div>

        <h2 className="mt-12 text-2xl font-extrabold">How to use this on a buyer&apos;s order</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          Find the doc fee line on the dealer&apos;s itemized quote. In a capped state it should be at or under the figure
          above; if it is higher, the linked statute is your evidence. In a no-cap state, compare it with the typical range
          and fold the difference into your price negotiation. Then run the whole quote through the{' '}
          <Link href="/out-the-door-price-calculator" className="text-brand underline">out-the-door price calculator</Link>,
          which pre-fills this fee for your state alongside{' '}
          <Link href="/car-sales-tax-calculator" className="text-brand underline">sales tax</Link> and{' '}
          <Link href="/car-registration-fees-by-state" className="text-brand underline">title and registration</Link>.
        </p>
        <p className="mt-3 leading-relaxed text-ink-2">
          The fee is a fixed line; the price above it is not. The ${PRODUCTS.negotiation.price}{' '}
          <Link href="/pricing" className="text-brand underline">{PRODUCTS.negotiation.name}</Link> prices the specific VIN at its
          mileage against cars for sale near you and gives you an opening offer and a walk-away figure to argue from.
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
