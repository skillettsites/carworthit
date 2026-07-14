// Vehicle Databases — the PAID data layer for both the valuation and the
// history checks. One integration, one auth header. NOTE: this is a commercial
// data aggregator positioned as an "NMVTIS alternative", NOT the official NMVTIS
// feed. CarWorthIt is not an approved NMVTIS provider, so no user-facing copy may
// call this an "NMVTIS report" or "official NMVTIS data".
//
// Auth:  header  x-AuthKey: <VEHICLEDATABASES_KEY>
// Base:  https://api.vehicledatabases.com
// Docs:  https://vehicledatabases.com/docs
//
// SERVICES: which endpoints we actually call maps 1:1 to the plan you activate
// in the VDB portal. Default below = PAYG Standard ($375, 4 services): valuation
// + title/salvage + theft + auction. Recalls stay FREE on NHTSA (see nhtsa.ts),
// so we never spend a VDB service slot on them. When you upgrade (e.g. Basic
// $180/mo = 5 services), flip `salesHistory` to true — nothing else changes.
//
// COST SAFETY: these functions are only ever called AFTER payment (see the report
// page + sample), so free traffic never spends a credit. Responses are cached for
// 30 days, so a buyer reloading their report never re-charges the card... er, the
// credit meter.
import type {
  HistoryData,
  Valuation,
  ValuationCondition,
  TitleRecord,
  TitleBrand,
  AuctionRecord,
} from './types';

const BASE = 'https://api.vehicledatabases.com';
const CACHE_SECONDS = 60 * 60 * 24 * 30; // 30 days

// Services included on the active plan. Default = PAYG Standard (4 services).
const ENABLED = {
  marketValue: true,
  titleCheck: true,
  stolenCheck: true,
  auction: true,
  salesHistory: false, // unlock with Basic sub ($180/mo, 5 svc) or PAYG Premium+
};

// ---- helpers --------------------------------------------------------------

// Parse "$8,641" | "8641" | 8641 -> 8641. Returns 0 when unparseable.
function money(v: unknown): number {
  if (typeof v === 'number') return Math.round(v);
  if (typeof v !== 'string') return 0;
  const n = Number(v.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? Math.round(n) : 0;
}
// Same, but undefined when there's genuinely no value (for optional fields).
function numOrUndef(v: unknown): number | undefined {
  const n = money(v);
  return n > 0 ? n : undefined;
}

type VdbResponse = { status: number; body: Record<string, unknown> | null };

// A "hard" error means the data service failed us (auth, quota, rate-limit,
// outage) — as opposed to a normal 400 "record not found" (a clean vehicle).
// On a hard error for a PAID lookup we must return unavailable, never fake data.
function isHardError(status: number): boolean {
  return status === 401 || status === 403 || status === 429 || status >= 500;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function vdb(path: string): Promise<VdbResponse | null> {
  const key = process.env.VEHICLEDATABASES_KEY;
  if (!key) return null;
  // Retry only transient failures (429 / 5xx). Quota/auth (403/401) won't recover.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      // Clean vehicles return HTTP 400 with a JSON error body on stolen/auction,
      // so we read the JSON regardless of res.ok and interpret status ourselves.
      const res = await fetch(`${BASE}${path}`, {
        headers: { 'x-AuthKey': key },
        next: { revalidate: CACHE_SECONDS },
      });
      if ((res.status === 429 || res.status >= 500) && attempt < 2) {
        await sleep(300 * (attempt + 1));
        continue;
      }
      const body = (await res.json().catch(() => null)) as Record<string, unknown> | null;
      return { status: res.status, body };
    } catch {
      if (attempt < 2) {
        await sleep(300 * (attempt + 1));
        continue;
      }
      return null; // network failure after retries
    }
  }
  return null;
}

function insuranceByAge(base: number) {
  const f = Math.max(0.6, Math.min(2.2, base / 15000));
  return [
    { band: 'Age 16-25', annual: Math.round(2600 * f) },
    { band: 'Age 26-40', annual: Math.round(1650 * f) },
    { band: 'Age 41-65', annual: Math.round(1400 * f) },
    { band: 'Age 65+', annual: Math.round(1550 * f) },
  ];
}

// ---- valuation (market-value/v2/{vin}) ------------------------------------

interface MarketValueRow {
  Condition?: string;
  'Trade-In'?: string;
  'Private Party'?: string;
  'Dealer Retail'?: string;
}

function buildValuation(conditions: ValuationCondition[], isSample: boolean): Valuation {
  const pps = conditions.map((c) => c.privateParty).filter((n) => n > 0);
  const cleanRow =
    conditions.find((c) => /clean/i.test(c.condition)) ??
    conditions[Math.floor(conditions.length / 2)] ??
    conditions[0];
  const mean = cleanRow?.privateParty || (pps.length ? Math.round(pps.reduce((a, b) => a + b, 0) / pps.length) : 0);
  return {
    mean,
    low: pps.length ? Math.min(...pps) : Math.round(mean * 0.88),
    high: pps.length ? Math.max(...pps) : Math.round(mean * 1.12),
    tradeIn: cleanRow?.tradeIn || Math.round(mean * 0.84),
    privateParty: cleanRow?.privateParty || mean,
    dealerRetail: cleanRow?.dealerRetail || Math.round(mean * 1.14),
    conditions,
    insuranceByAge: insuranceByAge(mean || 1),
    isSample,
  };
}

// Returns a real Valuation, or null when it's genuinely unavailable (data
// service failed, or no value on record for this VIN). Returns SAMPLE data ONLY
// when no key is configured (local dev) — a paying customer must never be shown
// fabricated numbers.
export async function getValuation(vin: string, year: string): Promise<Valuation | null> {
  const clean = vin.trim().toUpperCase();
  if (!process.env.VEHICLEDATABASES_KEY) return sampleValuation(clean, year); // dev only
  if (!ENABLED.marketValue) return null;
  const res = await vdb(`/market-value/v2/${clean}`);
  if (!res || isHardError(res.status)) return null; // service failure -> unavailable, NOT sample
  const rows = ((res.body?.data as Record<string, unknown> | undefined)?.market_value as
    | { market_value_data?: Array<{ 'market value'?: MarketValueRow[] }> }
    | undefined)?.market_value_data?.[0]?.['market value'];
  if (!Array.isArray(rows) || rows.length === 0) return null; // no value on record for this VIN
  const conditions: ValuationCondition[] = rows
    .map((r) => ({
      condition: String(r.Condition ?? '').trim(),
      tradeIn: money(r['Trade-In']),
      privateParty: money(r['Private Party']),
      dealerRetail: money(r['Dealer Retail']),
    }))
    .filter((c) => c.tradeIn || c.privateParty || c.dealerRetail);
  if (conditions.length === 0) return null;
  return buildValuation(conditions, false);
}

// ---- history (title-check + stolen-check + auction [+ sales-history]) ------

function extractAuctionRecords(data: unknown): AuctionRecord[] {
  const d = data as Record<string, unknown> | null | undefined;
  const arr: unknown[] = Array.isArray(d)
    ? (d as unknown[])
    : Array.isArray(d?.auction)
      ? (d!.auction as unknown[])
      : Array.isArray(d?.records)
        ? (d!.records as unknown[])
        : Array.isArray(d?.sales)
          ? (d!.sales as unknown[])
          : [];
  return arr.map((raw) => {
    const r = raw as Record<string, unknown>;
    const imgs = r.images;
    return {
      date: (r.sale_date || r.date || r.saleDate) as string | undefined,
      seller: (r.seller || r.seller_name || r.auction_name || r.auction) as string | undefined,
      location: (r.location || r.city || r.state) as string | undefined,
      odometer: numOrUndef(r.odometer ?? r.mileage ?? r.odometer_reading),
      primaryDamage: (r.primary_damage || r.damage || r.primaryDamage) as string | undefined,
      secondaryDamage: (r.secondary_damage || r.secondaryDamage) as string | undefined,
      condition: (r.condition || r.grade) as string | undefined,
      salePrice: numOrUndef(r.sale_price ?? r.price ?? r.purchase_price ?? r.final_bid),
      images: Array.isArray(imgs) ? imgs.length : typeof imgs === 'number' ? imgs : undefined,
    };
  });
}

// Returns real history, or null when the data service failed for every call
// (quota/outage). Sample data ONLY when no key is configured (local dev).
export async function getHistory(vin: string): Promise<HistoryData | null> {
  const clean = vin.trim().toUpperCase();
  if (!process.env.VEHICLEDATABASES_KEY) return sampleHistory(clean); // dev only

  const SKIP = 'skip' as const;
  const [title, stolen, auction, sales] = await Promise.all([
    ENABLED.titleCheck ? vdb(`/title-check/${clean}`) : Promise.resolve(SKIP),
    ENABLED.stolenCheck ? vdb(`/stolen-check/${clean}`) : Promise.resolve(SKIP),
    ENABLED.auction ? vdb(`/auction/${clean}`) : Promise.resolve(SKIP),
    ENABLED.salesHistory ? vdb(`/sales-history/${clean}`) : Promise.resolve(SKIP),
  ]);

  // A normal 400 "record not found" (clean car) is fine; a hard error (403 quota,
  // 429, 5xx, network) is not. If EVERY attempted call hard-failed, the data is
  // unavailable -> return null so the paid report shows an honest error, NOT a
  // falsely "all clear" (or sample) car.
  const attempted = [title, stolen, auction, sales].filter((r): r is VdbResponse | null => r !== SKIP);
  const anyOk = attempted.some((r) => r && !isHardError(r.status));
  if (!anyOk) return null;

  const bodyOf = (r: VdbResponse | 'skip' | null): Record<string, unknown> | null =>
    r !== SKIP && r && !isHardError(r.status) ? r.body : null;
  const titleBody = bodyOf(title);
  const stolenBody = bodyOf(stolen);
  const auctionBody = bodyOf(auction);
  const salesBody = bodyOf(sales);

  // Title / salvage
  const titleData = (titleBody?.data as { salvage?: boolean; salvage_details?: unknown[] } | undefined) ?? undefined;
  const salvage = titleData?.salvage === true;
  const salvageDetails = Array.isArray(titleData?.salvage_details) ? titleData!.salvage_details : [];
  const brands: TitleBrand[] = salvageDetails.map((raw) => {
    const b = raw as Record<string, unknown>;
    return {
      label: String(b.brand || b.type || b.title || 'Salvage'),
      state: b.state as string | undefined,
      date: (b.date || b.reported_date) as string | undefined,
    };
  });
  if (salvage && brands.length === 0) brands.push({ label: 'Salvage' });

  // Theft: a clean car returns status:"error" ("Record(s) were not found").
  const theft = stolenBody?.status === 'success';

  // Auction (accident proxy)
  const auctionRecords = auctionBody?.status === 'success' ? extractAuctionRecords(auctionBody.data) : [];
  const soldAtSalvageAuction = auctionRecords.length > 0;

  // Ownership timeline + odometer come from sales-history (5th service, off by
  // default). Auction rows also carry odometer readings, so use those too.
  const salesRecords = salesBody?.status === 'success' ? extractAuctionRecords(salesBody.data) : [];
  const titles: TitleRecord[] = salesRecords.map((s) => ({
    state: s.location || '',
    date: s.date || '',
    type: 'Listing / sale record',
    mileage: s.odometer,
  }));
  const odometer = [...auctionRecords, ...salesRecords]
    .filter((r) => r.odometer && r.date)
    .map((r) => ({ date: r.date as string, reading: r.odometer as number, source: 'Vehicle Databases' }));

  const totalLoss =
    salvage || soldAtSalvageAuction || brands.some((b) => /junk|total|flood|fire/i.test(b.label));

  return {
    titles,
    brands,
    odometer,
    salvage,
    theft,
    totalLoss,
    auctionRecords,
    soldAtSalvageAuction,
    jsiRecords: brands.length,
    ownersEstimate: titles.length ? new Set(titles.map((t) => t.date)).size || undefined : undefined,
    isSample: false,
  };
}

// ---- sample fallbacks (no key / local dev) --------------------------------

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function sampleValuation(vin: string, year: string): Valuation {
  const age = Math.max(0, new Date().getUTCFullYear() - (Number(year) || 2015));
  const h = hash(vin);
  const newPrice = 27000 + (h % 12000);
  const clean = Math.max(1500, Math.round(newPrice * Math.pow(0.86, age) * (0.92 + ((h >> 5) % 16) / 100)));
  const grid: Array<[string, number]> = [
    ['Outstanding', 1.09],
    ['Clean', 1.0],
    ['Average', 0.9],
    ['Rough', 0.78],
  ];
  const conditions: ValuationCondition[] = grid.map(([condition, f]) => ({
    condition,
    tradeIn: Math.round(clean * f * 0.84),
    privateParty: Math.round(clean * f),
    dealerRetail: Math.round(clean * f * 1.14),
  }));
  return buildValuation(conditions, true);
}

const US_STATES = ['CA', 'TX', 'FL', 'NY', 'PA', 'OH', 'GA', 'NC', 'MI', 'IL', 'AZ', 'WA', 'CO', 'TN'];

export function sampleHistory(vin: string): HistoryData {
  const h = hash(vin);
  const branded = h % 5 === 0; // ~20% of sample VINs carry a brand, to exercise the UI
  const owners = 1 + (h % 3);
  const baseYear = 2015 + (h % 8);
  const stateA = US_STATES[h % US_STATES.length];
  const stateB = US_STATES[(h >> 3) % US_STATES.length];

  const titles: TitleRecord[] = [
    { state: stateA, date: `${baseYear}-04-12`, type: 'Original title', mileage: 12 + (h % 40) },
    { state: stateB, date: `${baseYear + 2}-08-03`, type: 'Transfer of ownership', mileage: 24000 + (h % 20000) },
  ];
  if (owners >= 3)
    titles.push({ state: stateA, date: `${baseYear + 4}-01-19`, type: 'Transfer of ownership', mileage: 52000 + (h % 15000) });

  const odometer = titles
    .filter((t) => t.mileage !== undefined)
    .map((t) => ({ date: t.date, reading: t.mileage as number, source: 'Title record' }));

  const brands: TitleBrand[] = branded ? [{ label: h % 2 ? 'Salvage' : 'Flood', state: stateB, date: `${baseYear + 3}-06-01` }] : [];
  const auctionRecords: AuctionRecord[] = branded
    ? [{
        date: `${baseYear + 3}-05-20`, seller: 'Copart', location: stateB,
        odometer: 60000 + (h % 30000), primaryDamage: h % 2 ? 'Front end' : 'Flood',
        condition: 'Non-runner', salePrice: 3200 + (h % 2500), images: 8,
      }]
    : [];

  return {
    titles,
    brands,
    odometer,
    salvage: branded && h % 2 === 0,
    theft: false,
    totalLoss: branded,
    auctionRecords,
    soldAtSalvageAuction: auctionRecords.length > 0,
    jsiRecords: branded ? 1 + (h % 2) : 0,
    ownersEstimate: owners,
    isSample: true,
  };
}
