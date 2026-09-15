import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import StickyVinCta from '@/components/StickyVinCta';
import VerifiedLine from '@/components/VerifiedLine';
import SalesTaxCalc from '@/components/calc/SalesTaxCalc';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import {
  STATES,
  CALC_STATES,
  getState,
  fmtLongDate,
  stateRateText,
  localRangeText,
  tradeInText,
  docFeeText,
  titleFeeText,
  registrationText,
  registrationBasisText,
  privateSaleText,
  money,
  moneyRange,
  pct,
  tidy,
  type StateFees,
  type Sourced,
} from '@/lib/state-fees';

const HUB = '/car-sales-tax-calculator';

// Every slug comes from the dataset; anything else is a 404, not a render.
export const dynamicParams = false;

export function generateStaticParams() {
  return STATES.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params;
  const s = getState(state);
  if (!s) return {};
  const rate = stateRateText(s);
  const rateBit =
    rate === 'None' ? `${s.name} charges no state sales tax on a used car` : rate === 'Not verified' ? `${s.name} car sales tax` : `${s.name} charges ${rate} on a used car`;
  return {
    title: `${s.name} Car Sales Tax Calculator (2026): Rate, Trade-In Credit, Fees`,
    description: tidy(
      `${rateBit}. Local tax: ${localRangeText(s).toLowerCase()}. Trade-in credit: ${tradeInText(s).toLowerCase()}. Doc fee: ${docFeeText(
        s,
      ).toLowerCase()}. Verified ${fmtLongDate(s.checked)}, sources linked.`,
    ),
    alternates: { canonical: `${SITE_URL}${HUB}/${s.slug}` },
  };
}

function opening(s: StateFees): string {
  const t = s.salesTax;
  const date = fmtLongDate(s.checked);
  let first: string;
  if (t.stateRate === null && t.rateText) {
    first = `${s.name} charges a ${t.taxName ? t.taxName.toLowerCase() : 'vehicle excise tax'} of ${t.rateText} on a used car, verified ${date}. ${t.rateNote ?? ''}`;
  } else if (t.stateRate === null) {
    first = `We have not verified ${s.name}'s vehicle sales tax rate against the state's own page (last attempt ${date}), so the calculator shows local tax only.`;
  } else if (t.rateType === 'none' || t.stateRate === 0) {
    first = `${s.name} charges no state sales tax on a used car purchase, verified ${date}.`;
  } else {
    first = `${s.name} charges ${pct(t.stateRate)} ${t.taxName ? t.taxName.toLowerCase() : 'sales tax'} on a used car purchase, verified ${date}.`;
  }
  const local =
    t.localApplies === null
      ? ''
      : t.localApplies
        ? t.localMin !== null && t.localMax !== null
          ? ` Local taxes add ${localRangeText(s)} depending on where you register the car.`
          : ' Local taxes also apply; the range is not verified.'
        : ' There is no local tax on top.';
  const trade =
    s.tradeIn.credit === 'full'
      ? ' A trade-in is deducted before tax.'
      : s.tradeIn.credit === 'none'
        ? ' A trade-in is not deducted: tax is charged on the full price.'
        : s.tradeIn.credit === 'partial'
          ? ` Part of a trade-in is deducted before tax${s.tradeIn.cap !== null ? ` (capped at ${money(s.tradeIn.cap)})` : ''}.`
          : '';
  const priv =
    s.privateSale.taxed === true
      ? ' Private-party sales are taxed too, paid when you title the car.'
      : s.privateSale.taxed === false
        ? ' Private-party sales are not taxed.'
        : '';
  return tidy(first + local + trade + priv);
}

function buildFaqs(s: StateFees) {
  const n = s.name;
  const date = fmtLongDate(s.checked);
  const nv = (what: string) => `We could not verify ${what} against a ${n} state page on ${date}. Check the state DMV or revenue department before you sign.`;
  const p = s.privateSale;
  const tr = s.tradeIn;
  const d = s.docFee;
  const tf = s.titleFee;
  const r = s.registration;
  const t = s.salesTax;

  const privateA =
    p.taxed === true
      ? tidy(`Yes. ${p.collectedAt ?? `The buyer pays the same rate when titling the car.`} ${p.valuationRule ?? ''}`)
      : p.taxed === false
        ? tidy(`No. ${p.collectedAt ?? ''}`)
        : nv('the private-sale rule');

  const tradeA =
    tr.credit === 'full'
      ? tidy(`Yes. The value of your trade-in is deducted from the price before ${n} tax is calculated. ${tr.capNote ?? ''}`)
      : tr.credit === 'none'
        ? tidy(`No. ${n} charges tax on the full purchase price; a trade-in lowers what you pay the dealer but not the tax. ${tr.capNote ?? ''}`)
        : tr.credit === 'partial'
          ? tidy(`Partly. ${tr.capNote ?? ''} ${tr.cap !== null ? `The credit is capped at ${money(tr.cap)}.` : ''}`)
          : nv('the trade-in rule');

  const docA =
    d.cap !== null
      ? tidy(`${n} caps the dealer documentation fee at ${money(d.cap)}${d.statute ? ` (${d.statute})` : ''}. ${d.capNote ?? ''}`)
      : d.capType === 'none'
        ? tidy(
            `${n} sets no legal cap on dealer doc fees. ${
              d.typicalMin !== null && d.typicalMax !== null
                ? `Dealers typically charge ${moneyRange(d.typicalMin, d.typicalMax)}.`
                : d.typicalMax !== null
                  ? `Dealers typically charge up to ${money(d.typicalMax)}.`
                  : ''
            } ${d.capNote ?? ''} If the dealer will not drop the fee, ask for the same amount off the price.`,
          )
        : d.capType === 'formula'
          ? tidy(`${n} caps the fee by formula. ${d.capNote ?? ''}`)
          : nv('the doc fee rule');

  const titleA = tf.amount !== null ? tidy(`${titleFeeText(s)}${tf.basis ? ` (${tf.basis})` : ''}. ${tf.note ?? ''}`) : nv('the title fee');

  const regA =
    r.min !== null || r.max !== null
      ? tidy(`${registrationText(s)} a year for a passenger car, ${registrationBasisText(s).toLowerCase()}. ${r.note ?? ''}`)
      : nv('the registration fee');

  const localA =
    t.localApplies === true
      ? tidy(`Yes. ${t.localNote ?? `Local rates add ${localRangeText(s)} to the state rate.`}`)
      : t.localApplies === false
        ? tidy(`No. ${t.localNote ?? `${n} applies a single statewide rate to vehicle purchases.`}`)
        : nv('the local tax rule');

  return [
    { q: `Does ${n} charge sales tax on a private-party car sale?`, a: privateA },
    { q: `Does ${n} give a trade-in credit on car sales tax?`, a: tradeA },
    { q: `What is the dealer doc fee cap in ${n}?`, a: docA },
    { q: `Do local sales taxes apply to car purchases in ${n}?`, a: localA },
    { q: `How much does a car title cost in ${n}?`, a: titleA },
    { q: `How much is annual car registration in ${n}?`, a: regA },
  ];
}

function SourceCell({ g }: { g: Sourced }) {
  if (!g.source) return <span className="text-ink-2">Not verified{g.note ? `: ${g.note}` : ''}</span>;
  return (
    <>
      <a href={g.source} className="break-all text-brand underline" rel="nofollow noopener" target="_blank">
        {new URL(g.source).hostname.replace(/^www\./, '')}
      </a>
      <span className="ml-1 text-xs text-ink-2">({g.sourceType === 'primary' ? 'state source' : 'secondary, cites the statute'})</span>
      {g.evidence && <span className="mt-1 block text-xs italic text-ink-2">As published: &ldquo;{g.evidence}&rdquo;</span>}
    </>
  );
}

export default async function Page({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const s = getState(state);
  if (!s) notFound();

  const faqs = buildFaqs(s);
  const url = `${SITE_URL}${HUB}/${s.slug}`;
  const rows: { label: string; value: string; g: Sourced }[] = [
    { label: `State rate (${s.salesTax.taxName ?? 'vehicle tax'})`, value: stateRateText(s), g: s.salesTax },
    { label: 'Local tax range', value: localRangeText(s), g: s.salesTax },
    { label: 'Trade-in credit', value: tradeInText(s), g: s.tradeIn },
    { label: 'Dealer doc fee', value: docFeeText(s), g: s.docFee },
    { label: 'Title fee', value: titleFeeText(s), g: s.titleFee },
    { label: `Registration (${registrationBasisText(s).toLowerCase()})`, value: registrationText(s), g: s.registration },
    { label: 'Private-party sale taxed', value: privateSaleText(s), g: s.privateSale },
  ];

  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Car Sales Tax Calculator', url: `${SITE_URL}${HUB}` },
            { name: s.name, url },
          ]),
        ]}
      />
      <div className="container-x max-w-4xl py-12 pb-28">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-2">
          <Link href="/" className="hover:text-ink">Home</Link> / <Link href={HUB} className="hover:text-ink">Car Sales Tax Calculator</Link> /{' '}
          <span className="text-ink">{s.name}</span>
        </nav>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold">{s.name} Car Sales Tax Calculator</h1>
        <p className="mt-3 text-lg text-ink-2 leading-relaxed">{opening(s)}</p>
        <VerifiedLine className="mt-2" />

        <div className="mt-6">
          <SalesTaxCalc states={CALC_STATES} initialCode={s.code} />
        </div>

        <h2 className="mt-12 text-2xl font-extrabold">The {s.name} numbers, with sources</h2>
        <p className="mt-2 text-ink-2">
          Each figure below was checked on {fmtLongDate(s.checked)} against the page linked in the source column, and the
          wording the state uses is quoted so you can confirm it yourself.
        </p>
        <div className="table-scroll mt-4 border border-border" tabIndex={0}>
          <table className="w-full min-w-[640px] text-sm">
            <caption className="sr-only">{s.name} vehicle taxes and fees with sources</caption>
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-cyan-50 text-left">
                <th scope="col" className="border-b-2 border-blue-200 px-3 py-2.5 font-bold text-blue-900">Item</th>
                <th scope="col" className="border-b-2 border-blue-200 px-3 py-2.5 font-bold text-blue-900">{s.name}</th>
                <th scope="col" className="border-b-2 border-blue-200 px-3 py-2.5 font-bold text-blue-900">Source</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-slate-100 even:bg-slate-50/60">
                  <th scope="row" className="px-3 py-2.5 text-left font-semibold align-top">{r.label}</th>
                  <td className="px-3 py-2.5 align-top tabular-nums whitespace-nowrap">{r.value}</td>
                  <td className="px-3 py-2.5 align-top text-ink-2">
                    <SourceCell g={r.g} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(s.salesTax.rateNote || s.salesTax.localNote || s.tradeIn.capNote || s.docFee.capNote || s.registration.note) && (
          <ul className="mt-4 space-y-2 text-sm text-ink-2">
            {s.salesTax.rateNote && <li><strong className="text-ink">State rate:</strong> {s.salesTax.rateNote}</li>}
            {s.salesTax.localNote && <li><strong className="text-ink">Local tax:</strong> {s.salesTax.localNote}</li>}
            {s.tradeIn.capNote && <li><strong className="text-ink">Trade-in:</strong> {s.tradeIn.capNote}</li>}
            {s.docFee.capNote && <li><strong className="text-ink">Doc fee:</strong> {s.docFee.capNote}</li>}
            {s.registration.note && <li><strong className="text-ink">Registration:</strong> {s.registration.note}</li>}
          </ul>
        )}

        <h2 className="mt-12 text-2xl font-extrabold">Next steps</h2>
        <ul className="mt-3 space-y-2 text-ink-2">
          <li>
            <Link href="/out-the-door-price-calculator" className="text-brand underline">Out-the-door price calculator</Link>: adds
            the {s.name} doc fee, title and registration to the tax for the full figure.
          </li>
          <li>
            <Link href="/dealer-doc-fee-by-state" className="text-brand underline">Dealer doc fees by state</Link> and{' '}
            <Link href="/car-registration-fees-by-state" className="text-brand underline">registration and title fees by state</Link>:
            see how {s.name} compares.
          </li>
          <li>
            <Link href={HUB} className="text-brand underline">All states</Link>: the full sales tax table.
          </li>
        </ul>
        <div className="mt-6 rounded-2xl border border-brand/30 bg-gradient-to-br from-blue-50 to-cyan-50 p-5">
          <p className="font-bold text-ink">Tax is fixed. The price is not.</p>
          <p className="mt-1 text-sm text-ink-2">
            CarWorthIt prices a specific VIN at its mileage against cars actually for sale near your ZIP code from $
            {PRODUCTS.valuation.price}. The ${PRODUCTS.negotiation.price}{' '}
            <Link href="/pricing" className="text-brand underline">{PRODUCTS.negotiation.name}</Link> adds an opening offer and a
            walk-away figure, so the number {s.name} taxes is the right one.
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-extrabold">{s.name} car tax questions</h2>
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
