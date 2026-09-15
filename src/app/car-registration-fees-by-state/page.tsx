import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import StickyVinCta from '@/components/StickyVinCta';
import VerifiedLine from '@/components/VerifiedLine';
import SortableTable, { type SortRow } from '@/components/calc/SortableTable';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/constants';
import {
  STATES,
  META,
  fmtLongDate,
  titleFeeText,
  registrationText,
  registrationBasisText,
  money,
  joinNames,
  tidy,
} from '@/lib/state-fees';

const PATH = '/car-registration-fees-by-state';
const VERIFIED = fmtLongDate(META.checked);
const UNKNOWN = 1e9;

export const metadata: Metadata = {
  title: 'Car Registration and Title Fees by State (2026)',
  description: `Title fees and annual registration fees for a passenger car in all 50 states and DC, with what each fee is based on (flat, weight, value or age). Sourced from each state's DMV and verified ${VERIFIED}.`,
  alternates: { canonical: `${SITE_URL}${PATH}` },
};

function facts() {
  const titled = STATES.filter((s) => s.titleFee.amount !== null);
  const minTitle = titled.length ? Math.min(...titled.map((s) => s.titleFee.amount as number)) : 0;
  const maxTitle = titled.length ? Math.max(...titled.map((s) => s.titleFee.amount as number)) : 0;
  const minTitleStates = titled.filter((s) => s.titleFee.amount === minTitle);
  const maxTitleStates = titled.filter((s) => s.titleFee.amount === maxTitle);
  const regKnown = STATES.filter((s) => s.registration.min !== null);
  const minReg = regKnown.length ? Math.min(...regKnown.map((s) => s.registration.min as number)) : 0;
  const minRegStates = regKnown.filter((s) => s.registration.min === minReg);
  const byBasis = (b: string) => STATES.filter((s) => s.registration.basis === b);
  const flat = byBasis('flat');
  const value = byBasis('value');
  const weight = byBasis('weight');
  const age = byBasis('age');
  const mpg = byBasis('mpg');
  const mixed = byBasis('mixed');
  const titleUnverified = STATES.filter((s) => s.titleFee.amount === null);
  const regUnverified = STATES.filter((s) => s.registration.min === null && s.registration.max === null);
  return { minTitle, maxTitle, minTitleStates, maxTitleStates, minReg, minRegStates, flat, value, weight, age, mpg, mixed, titleUnverified, regUnverified };
}

const F = facts();

const basisSentence = tidy(
  [
    F.flat.length ? `${F.flat.length} states charge a flat fee` : '',
    F.value.length ? `${F.value.length} base it on the car's value` : '',
    F.weight.length ? `${F.weight.length} on its weight` : '',
    F.age.length ? `${F.age.length} on its age` : '',
    F.mpg.length ? `${F.mpg.length} on fuel economy` : '',
    F.mixed.length ? `${F.mixed.length} combine a flat fee with a value or weight element` : '',
  ]
    .filter(Boolean)
    .join(', '),
);

const opening = tidy(
  `Car registration and title fees by state, verified ${VERIFIED}. A new title costs from ${money(F.minTitle)} in ${joinNames(
    F.minTitleStates,
  )} to ${money(F.maxTitle)} in ${joinNames(F.maxTitleStates)}. The state's annual registration fee for a passenger car starts at ${money(
    F.minReg,
  )} in ${joinNames(F.minRegStates)}, before any value-based tax or county add-on; ${basisSentence}. The table sorts by either fee and links each row to the state DMV page it came from.`,
);

const faqs = [
  {
    q: 'What is the difference between a title fee and a registration fee?',
    a: 'The title fee pays for the certificate that records you as the owner; you pay it once, when the car changes hands. The registration fee pays for the plates and the right to drive the car on public roads; you pay it when you buy and then every year (or two, in some states) at renewal. Both are set by the state, not the dealer.',
  },
  {
    q: 'Why does registration cost so much more in some states?',
    a: tidy(
      `Because of what the fee is based on. ${
        F.value.length || F.mixed.length
          ? `${joinNames([...F.value, ...F.mixed])} include a charge based on the car's value, which is why a new $60,000 car can cost several hundred dollars a year to register there and far less once it ages.`
          : ''
      } ${F.weight.length ? `${joinNames(F.weight)} scale the fee by weight.` : ''} ${
        F.flat.length ? `${joinNames(F.flat)} charge one flat fee whatever you drive.` : ''
      } County or local add-ons then vary within a state, which is why our figures are the state base.`,
    ),
  },
  {
    q: 'Do I pay these fees when buying from a dealer?',
    a: 'Yes. The dealer collects the title and registration fees on the buyer’s order and files the paperwork with the state; the fees should match the state schedule, so compare the lines with this table. On a private sale you pay them yourself at the DMV or county office when you title the car, together with any sales tax due.',
  },
  {
    q: 'Are title and registration fees negotiable?',
    a: 'No. They are set by the state and passed through by the dealer. What you can check is that the amounts on the buyer’s order match the state schedule and that the dealer has not rolled its own charges into the “tag and title” line. The dealer’s own documentation fee is a separate line, and that one is worth checking against our doc fee table.',
  },
  {
    q: 'Which figures could you not verify?',
    a: tidy(
      F.titleUnverified.length || F.regUnverified.length
        ? `As of ${VERIFIED}: title fee not verified for ${F.titleUnverified.length ? joinNames(F.titleUnverified) : 'none'}; registration not verified for ${
            F.regUnverified.length ? joinNames(F.regUnverified) : 'none'
          }. Those rows say not verified rather than showing an estimate, and each links to the page we checked.`
        : `Every title and registration figure in the table was verified against a state page on ${VERIFIED}.`,
    ),
  },
  {
    q: 'How current is this table?',
    a: `Every row was checked on ${VERIFIED} against the DMV fee schedule linked in the source column, and the table is re-verified quarterly, next due ${fmtLongDate(META.refreshDue)}. Registration fees change at the start of state fiscal years, usually July, so a figure dated before then may have moved.`,
  },
];

function rows(): SortRow[] {
  return STATES.map((s) => {
    const t = s.titleFee;
    const r = s.registration;
    const src = r.source ?? t.source;
    const srcType = r.source ? r.sourceType : t.sourceType;
    return {
      state: { text: s.name, sort: s.name, href: `/car-sales-tax-calculator/${s.slug}` },
      title: { text: titleFeeText(s), sort: t.amount ?? UNKNOWN, sub: t.basis && t.basis !== 'flat' ? t.basis : undefined },
      registration: { text: registrationText(s), sort: r.min ?? r.max ?? UNKNOWN },
      basis: { text: registrationBasisText(s), sort: r.basis ?? 'zzz', sub: r.note ?? undefined },
      source: src
        ? {
            text: new URL(src).hostname.replace(/^www\./, ''),
            sort: srcType === 'primary' ? 0 : 1,
            href: src,
            external: true,
            sub: srcType === 'primary' ? 'State source' : 'Secondary source',
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
            { name: 'Car Registration Fees by State', url: `${SITE_URL}${PATH}` },
          ]),
        ]}
      />
      <div className="container-x max-w-4xl py-12 pb-28">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-2">
          <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/tools" className="hover:text-ink">Calculators</Link> /{' '}
          <span className="text-ink">Car Registration Fees by State</span>
        </nav>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold">Car Registration and Title Fees by State</h1>
        <p className="mt-3 text-lg text-ink-2 leading-relaxed">{opening}</p>
        <VerifiedLine className="mt-2" />

        <div className="mt-6">
          <SortableTable
            caption={`Title and registration fees by state, verified ${VERIFIED}`}
            initialKey="state"
            columns={[
              { key: 'state', label: 'State' },
              { key: 'title', label: 'Title fee', numeric: true },
              { key: 'registration', label: 'Registration (annual)', numeric: true },
              { key: 'basis', label: 'Basis' },
              { key: 'source', label: 'Source' },
              { key: 'verified', label: 'Verified' },
            ]}
            rows={rows()}
          />
        </div>

        <h2 className="mt-12 text-2xl font-extrabold">Reading the registration column</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          The figure is the state-level fee for an ordinary passenger car. Where the state charges by value, weight or age,
          the range is the base band and the note says what moves it; county and local add-ons are extra everywhere they
          exist. For the full cost of a purchase, the{' '}
          <Link href="/out-the-door-price-calculator" className="text-brand underline">out-the-door price calculator</Link>{' '}
          pre-fills your state&apos;s title and registration alongside{' '}
          <Link href="/car-sales-tax-calculator" className="text-brand underline">sales tax</Link> and the{' '}
          <Link href="/dealer-doc-fee-by-state" className="text-brand underline">dealer doc fee</Link>, and each state&apos;s
          sales tax page quotes the wording the DMV uses.
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
