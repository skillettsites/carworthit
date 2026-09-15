import raw from '@/content/state-fees.json';

/**
 * State vehicle purchase taxes and fees: the one dataset behind
 * /car-sales-tax-calculator, its 51 state pages, /dealer-doc-fee-by-state,
 * /car-registration-fees-by-state and /out-the-door-price-calculator.
 *
 * REFRESH: every figure in src/content/state-fees.json carries a `source` URL,
 * a verbatim `evidence` quote and a `checked` date. Re-verify the whole file
 * QUARTERLY (next due December 15, 2026). States change doc fee caps in their
 * January and July legislative sessions, and local sales tax rates change on
 * quarter boundaries. When done, update `meta.checked`, `meta.refreshDue` and
 * each row's `checked`; every page reads its "figures verified" line from them.
 *
 * Accuracy rule: nothing in the JSON is guessed. A figure that could not be
 * verified against the state's own page is null with a `note`, and the text
 * helpers below render "not verified" for it rather than a number.
 */

export type SourceType = 'primary' | 'secondary';

export interface Sourced {
  source: string | null;
  sourceType: SourceType | null;
  evidence: string | null;
  note: string | null;
}

export interface SalesTaxRow extends Sourced {
  /** What the state calls the tax on a vehicle purchase. */
  taxName: string | null;
  /** State-level percentage applied to the taxable price. 0 for no tax. */
  stateRate: number | null;
  /** "excise" = a vehicle-specific tax in place of the general sales tax. */
  rateType: 'sales' | 'excise' | 'none';
  /** Dollar ceiling on the state tax, if any (e.g. an infrastructure fee cap). */
  flatCap: number | null;
  /** Dollar floor on the state tax, if any. */
  flatMin: number | null;
  /** Short display text when the rate is a table rather than one percentage (DC). */
  rateText: string | null;
  /** One sentence the calculator shows about a tier, floor, exemption or table the arithmetic cannot capture. */
  rateNote: string | null;
  localApplies: boolean | null;
  localMin: number | null;
  localMax: number | null;
  /** Dollar amount of the price the local tax applies to, where the state caps it (e.g. the first $5,000). */
  localBaseCap: number | null;
  localNote: string | null;
  effective: string | null;
}

export interface TradeInRow extends Sourced {
  credit: 'full' | 'none' | 'partial' | null;
  cap: number | null;
  capNote: string | null;
}

export interface DocFeeRow extends Sourced {
  cap: number | null;
  capType: 'statutory' | 'formula' | 'none' | null;
  capNote: string | null;
  typicalMin: number | null;
  typicalMax: number | null;
  statute: string | null;
}

export interface TitleFeeRow extends Sourced {
  amount: number | null;
  amountMax: number | null;
  basis: string | null;
}

export interface RegistrationRow extends Sourced {
  min: number | null;
  max: number | null;
  basis: 'flat' | 'weight' | 'value' | 'age' | 'mpg' | 'mixed' | null;
}

export interface PrivateSaleRow extends Sourced {
  taxed: boolean | null;
  collectedAt: string | null;
  valuationRule: string | null;
}

export interface StateFees {
  code: string;
  name: string;
  slug: string;
  checked: string;
  salesTax: SalesTaxRow;
  tradeIn: TradeInRow;
  docFee: DocFeeRow;
  titleFee: TitleFeeRow;
  registration: RegistrationRow;
  privateSale: PrivateSaleRow;
}

export interface Dataset {
  meta: { checked: string; refreshDue: string; note: string };
  states: StateFees[];
}

const data = raw as unknown as Dataset;

export const META = data.meta;

/** All 51 rows, alphabetical by state name. */
export const STATES: StateFees[] = [...data.states].sort((a, b) => a.name.localeCompare(b.name));

export const getState = (slug: string): StateFees | undefined => STATES.find((s) => s.slug === slug);
export const getStateByCode = (code: string): StateFees | undefined =>
  STATES.find((s) => s.code === code.toUpperCase());

/* ------------------------------------------------------------------ */
/* Slim shape for the client calculators                               */
/* ------------------------------------------------------------------ */

/**
 * Numbers only. The client components receive this rather than the full row,
 * so the evidence quotes and source URLs stay out of the browser bundle.
 */
export interface CalcState {
  code: string;
  name: string;
  slug: string;
  taxName: string | null;
  stateRate: number | null;
  rateType: 'sales' | 'excise' | 'none';
  flatCap: number | null;
  flatMin: number | null;
  rateText: string | null;
  rateNote: string | null;
  localApplies: boolean | null;
  localMin: number | null;
  localMax: number | null;
  localBaseCap: number | null;
  tradeCredit: 'full' | 'none' | 'partial' | null;
  tradeCap: number | null;
  /** Pre-fill for the out-the-door tool: the statutory cap, else the typical high end. */
  docFee: number | null;
  docFeeLabel: string;
  titleFee: number | null;
  registration: number | null;
}

export function defaultDocFee(s: StateFees): { amount: number | null; label: string } {
  const d = s.docFee;
  if (d.cap !== null) return { amount: d.cap, label: `${s.name} caps doc fees at ${money(d.cap)}` };
  const rule = d.capType === 'formula' ? 'Capped by formula in' : 'No cap in';
  if (d.typicalMax !== null && d.typicalMax === d.typicalMin) return { amount: d.typicalMax, label: `${rule} ${s.name}; average charged` };
  if (d.typicalMax !== null) return { amount: d.typicalMax, label: `${rule} ${s.name}; typical high end` };
  if (d.typicalMin !== null) return { amount: d.typicalMin, label: `${rule} ${s.name}; typical figure` };
  return { amount: null, label: `Not verified for ${s.name}; enter the dealer's figure` };
}

export const defaultTitleFee = (s: StateFees): number | null => s.titleFee.amount;
export const defaultRegistration = (s: StateFees): number | null => s.registration.min;

export function toCalcState(s: StateFees): CalcState {
  const doc = defaultDocFee(s);
  return {
    code: s.code,
    name: s.name,
    slug: s.slug,
    taxName: s.salesTax.taxName,
    stateRate: s.salesTax.stateRate,
    rateType: s.salesTax.rateType,
    flatCap: s.salesTax.flatCap,
    flatMin: s.salesTax.flatMin,
    rateText: s.salesTax.rateText,
    rateNote: s.salesTax.rateNote,
    localApplies: s.salesTax.localApplies,
    localMin: s.salesTax.localMin,
    localMax: s.salesTax.localMax,
    localBaseCap: s.salesTax.localBaseCap,
    tradeCredit: s.tradeIn.credit,
    tradeCap: s.tradeIn.cap,
    docFee: doc.amount,
    docFeeLabel: doc.label,
    titleFee: defaultTitleFee(s),
    registration: defaultRegistration(s),
  };
}

export const CALC_STATES: CalcState[] = STATES.map(toCalcState);

/* ------------------------------------------------------------------ */
/* Arithmetic                                                          */
/* ------------------------------------------------------------------ */

const clamp = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const round2 = (n: number) => Math.round(n * 100) / 100;

export interface TaxInput {
  price: number;
  tradeIn: number;
  /** Combined local rate in percent, replacing the state's typical range. */
  localRate?: number | null;
}

export interface TaxResult {
  price: number;
  tradeIn: number;
  /** Trade-in value actually deducted from the taxable price. */
  tradeInCredit: number;
  taxable: number;
  rateKnown: boolean;
  stateRate: number;
  stateTax: number;
  localOverride: boolean;
  localMin: number;
  localMax: number;
  /** The part of the taxable price the local rate applied to (capped in a few states). */
  localBase: number;
  localTaxMin: number;
  localTaxMax: number;
  totalMin: number;
  totalMax: number;
  flatCapApplied: boolean;
  flatMinApplied: boolean;
}

/**
 * Vehicle sales/use tax for one state.
 *
 * Trade-in: deducted in full where the state allows it, up to the cap where
 * the credit is partial, not at all where the state taxes the full price.
 * Local tax: a range from the state's typical local rates unless the user
 * supplies their own combined local rate. Both apply to the same taxable base.
 * A dollar cap or floor on the state tax is applied to the state portion only.
 */
export function calcVehicleTax(s: CalcState, input: TaxInput): TaxResult {
  const price = clamp(input.price);
  const tradeIn = clamp(input.tradeIn);
  const rateKnown = s.stateRate !== null;
  const stateRate = s.stateRate ?? 0;

  let tradeInCredit = 0;
  if (s.tradeCredit === 'full') tradeInCredit = Math.min(tradeIn, price);
  else if (s.tradeCredit === 'partial') tradeInCredit = Math.min(tradeIn, price, s.tradeCap ?? tradeIn);

  const taxable = Math.max(0, price - tradeInCredit);

  let stateTax = (taxable * stateRate) / 100;
  let flatCapApplied = false;
  let flatMinApplied = false;
  if (s.flatCap !== null && stateTax > s.flatCap) {
    stateTax = s.flatCap;
    flatCapApplied = true;
  }
  if (s.flatMin !== null && taxable > 0 && stateTax < s.flatMin) {
    stateTax = s.flatMin;
    flatMinApplied = true;
  }

  const override =
    typeof input.localRate === 'number' && Number.isFinite(input.localRate) && input.localRate >= 0;
  const localMin = override ? (input.localRate as number) : s.localApplies ? (s.localMin ?? 0) : 0;
  const localMax = override ? (input.localRate as number) : s.localApplies ? (s.localMax ?? 0) : 0;
  // Some states apply local tax only to the first N dollars of the price.
  const localBase = s.localBaseCap !== null ? Math.min(taxable, s.localBaseCap) : taxable;
  const localTaxMin = (localBase * localMin) / 100;
  const localTaxMax = (localBase * localMax) / 100;

  return {
    price,
    tradeIn,
    tradeInCredit: round2(tradeInCredit),
    taxable: round2(taxable),
    rateKnown,
    stateRate,
    stateTax: round2(stateTax),
    localOverride: override,
    localMin,
    localMax,
    localBase: round2(localBase),
    localTaxMin: round2(localTaxMin),
    localTaxMax: round2(localTaxMax),
    totalMin: round2(stateTax + localTaxMin),
    totalMax: round2(stateTax + localTaxMax),
    flatCapApplied,
    flatMinApplied,
  };
}

export interface OtdInput extends TaxInput {
  docFee: number;
  titleFee: number;
  registration: number;
  addons: number;
}

export interface OtdResult {
  tax: TaxResult;
  docFee: number;
  titleFee: number;
  registration: number;
  addons: number;
  fees: number;
  /** Price plus tax and fees, before the trade-in is subtracted. */
  outTheDoorMin: number;
  outTheDoorMax: number;
  /** What the buyer actually owes after the trade-in is credited. */
  dueMin: number;
  dueMax: number;
}

export function calcOutTheDoor(s: CalcState, input: OtdInput): OtdResult {
  const tax = calcVehicleTax(s, input);
  const docFee = clamp(input.docFee);
  const titleFee = clamp(input.titleFee);
  const registration = clamp(input.registration);
  const addons = clamp(input.addons);
  const fees = round2(docFee + titleFee + registration + addons);
  const outTheDoorMin = round2(tax.price + tax.totalMin + fees);
  const outTheDoorMax = round2(tax.price + tax.totalMax + fees);
  const tradeApplied = Math.min(tax.tradeIn, tax.price);
  return {
    tax,
    docFee,
    titleFee,
    registration,
    addons,
    fees,
    outTheDoorMin,
    outTheDoorMax,
    dueMin: round2(outTheDoorMin - tradeApplied),
    dueMax: round2(outTheDoorMax - tradeApplied),
  };
}

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

export function money(n: number, cents?: boolean): string {
  const showCents = cents ?? Math.abs(n % 1) > 0.004;
  return `$${n.toLocaleString('en-US', {
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  })}`;
}

export function moneyRange(min: number, max: number): string {
  return Math.abs(max - min) < 0.005 ? money(min) : `${money(min)} to ${money(max)}`;
}

export const pct = (n: number): string => `${Number(n.toFixed(3))}%`;

export function fmtLongDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export const NOT_VERIFIED = 'Not verified';

/** "Alaska, Delaware and Oregon". */
export function joinNames(states: { name: string }[]): string {
  const names = states.map((s) => s.name);
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

/** Collapse the double spaces left by optional sentence fragments. */
export const tidy = (s: string): string => s.replace(/\s+/g, ' ').trim();

/** "6.25%" or "None" or "Not verified". */
export function stateRateText(s: StateFees): string {
  const t = s.salesTax;
  if (t.stateRate === null) return t.rateText ?? NOT_VERIFIED;
  if (t.rateType === 'none' || t.stateRate === 0) return 'None';
  return pct(t.stateRate);
}

/** "0% to 2.75%" or "None" or "Not verified". */
export function localRangeText(s: StateFees): string {
  const t = s.salesTax;
  if (t.localApplies === null) return NOT_VERIFIED;
  if (!t.localApplies) return 'None';
  const cap = t.localBaseCap !== null ? ` on the first ${money(t.localBaseCap)}` : '';
  if (t.localMin === null || t.localMax === null) return `Yes, range not verified${cap}`;
  if (t.localMin === t.localMax) return `${pct(t.localMax)}${cap}`;
  return `${pct(t.localMin)} to ${pct(t.localMax)}${cap}`;
}

export function tradeInText(s: StateFees): string {
  const t = s.tradeIn;
  if (t.credit === null && s.salesTax.rateType === 'none') return 'No state tax to credit';
  if (t.credit === 'full') return 'Yes, full credit';
  if (t.credit === 'none') return 'No credit';
  if (t.credit === 'partial') return t.cap !== null ? `Partial, capped at ${money(t.cap)}` : 'Partial';
  return NOT_VERIFIED;
}

export function docFeeText(s: StateFees): string {
  const d = s.docFee;
  if (d.cap !== null) return `${money(d.cap)} cap`;
  const typical =
    d.typicalMin !== null && d.typicalMax !== null
      ? ` (typically ${moneyRange(d.typicalMin, d.typicalMax)})`
      : d.typicalMax !== null
        ? ` (typically up to ${money(d.typicalMax)})`
        : '';
  if (d.capType === 'formula') return `Capped by formula${typical}`;
  if (d.capType === 'none') return `No cap${typical}`;
  return typical ? `Cap not verified${typical}` : NOT_VERIFIED;
}

export function titleFeeText(s: StateFees): string {
  const t = s.titleFee;
  if (t.amount === null) return NOT_VERIFIED;
  if (t.amountMax !== null && t.amountMax !== t.amount) return moneyRange(t.amount, t.amountMax);
  return money(t.amount);
}

export function registrationText(s: StateFees): string {
  const r = s.registration;
  if (r.min === null && r.max === null) return NOT_VERIFIED;
  if (r.min !== null && r.max !== null) return moneyRange(r.min, r.max);
  return `${money((r.min ?? r.max) as number)}+`;
}

export function registrationBasisText(s: StateFees): string {
  const b = s.registration.basis;
  if (!b) return NOT_VERIFIED;
  const map: Record<NonNullable<RegistrationRow['basis']>, string> = {
    flat: 'Flat fee',
    weight: 'By weight',
    value: 'By value',
    age: 'By age',
    mpg: 'By fuel economy',
    mixed: 'Flat plus value or weight',
  };
  return map[b];
}

export function privateSaleText(s: StateFees): string {
  const p = s.privateSale;
  if (p.taxed === null) return NOT_VERIFIED;
  return p.taxed ? 'Yes, paid when you title the car' : 'No';
}

/** True when the row has at least one verified figure in each group. */
export function sourcesFor(s: StateFees): { label: string; url: string; type: SourceType | null }[] {
  const groups: [string, Sourced][] = [
    ['Sales tax', s.salesTax],
    ['Trade-in credit', s.tradeIn],
    ['Doc fee', s.docFee],
    ['Title fee', s.titleFee],
    ['Registration', s.registration],
    ['Private sale', s.privateSale],
  ];
  const seen = new Set<string>();
  const out: { label: string; url: string; type: SourceType | null }[] = [];
  for (const [label, g] of groups) {
    if (!g.source || seen.has(g.source)) continue;
    seen.add(g.source);
    out.push({ label, url: g.source, type: g.sourceType });
  }
  return out;
}
