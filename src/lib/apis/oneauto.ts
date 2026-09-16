// OneAuto API client for the US services.
//
// Ported from carcostcheck/src/lib/apis/oneauto.ts, which already handles this
// API's quirks. Keeping the shape familiar so fixes port both ways.
//
// Path convention for the US set is /{provider}/{service}/us/v{n}. The country
// is a segment AFTER the service name, then the version. Carketa is the
// exception and has neither. These paths are not in any published swagger; they
// come from the raw HTML of the public service pages.
import type { FactoryData, MarketEvidence, MarketListing, MarketValuation, RecallReport } from '../types';

const BASE_URL = 'https://api.oneautoapi.com';

// Read the key lazily, not at module load. A module-level const is captured
// before any caller has a chance to populate the environment, which silently
// disables every call and looks exactly like the API returning nothing.
const apiKey = () => process.env.ONEAUTO_API_KEY || '';
export const hasOneAuto = () => !!apiKey();

/**
 * Response codes this API uses, learned the hard way:
 *   400 "Mandatory fields not supplied: a, b, c"  service enabled, params wrong
 *   204 no body                                    enabled, no data, NOT charged
 *   403 "The requested service has not been..."    path exists, not enabled
 *   403 {"message":"Missing Authentication Token"} path does not exist
 *   200 success:true with an empty payload         data miss, but STILL CHARGED
 *
 * That last one matters: VIN Decode Plus returns 200 with model_year 0 rather
 * than a 204 for vehicles it has no record of. OneAuto have acknowledged it as
 * a bug. Until it is fixed we must detect the empty shell ourselves and treat
 * it as a miss, or we will show a customer a blank report they paid for.
 */
async function call(path: string, params: Record<string, string | number>): Promise<Record<string, unknown> | null> {
  const key = apiKey();
  if (!key) return null;
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  ).toString();
  try {
    // Cache identical requests for 24h. Without this, a customer refreshing
    // their paid report re-runs the lookup and we pay for it again: 20p a
    // refresh on a $2.99 sale. The cache key is the full URL, so it is
    // naturally scoped to VIN + ZIP + mileage, which is exactly the granularity
    // a valuation is valid at.
    const res = await fetch(`${BASE_URL}${path}?${qs}`, {
      headers: { 'x-api-key': key },
      next: { revalidate: 86400 },
    });
    // 204 is a legitimate "no data for this vehicle" and is not chargeable.
    if (res.status === 204) return null;
    const body = (await res.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || body.success === false) return null;
    return body;
  } catch {
    return null;
  }
}

/**
 * Carketa market pricing. Needs VIN, ZIP and mileage, which is exactly why it
 * beats a year/make/model lookup: it prices this car, at its mileage, against
 * what comparable cars are actually listed for near the buyer.
 *
 * ⚠️ LICENCE. Only `average_market_price_usd`, `low_price_usd` and
 * `high_price_usd` may be shown to a consumer. The response also contains
 * `current_comparables`, `average_days_on_market` and the comparables' mileage
 * range: those are trade-only under the OneAuto/Carketa terms and must never
 * reach a public page. This function deliberately drops them so they cannot be
 * rendered by accident.
 */
export async function getMarketValuation(
  vin: string,
  zip: string,
  mileage: number,
): Promise<MarketValuation | null> {
  const body = await call('/carketa/marketpricingfromvin/', {
    vehicle_identification_number: vin.trim().toUpperCase(),
    zip_code: zip.trim(),
    current_mileage: Math.round(mileage),
  });
  const d = (body?.result as Record<string, unknown> | undefined)?.market_pricing_data as
    | Record<string, unknown>
    | undefined;
  if (!d) return null;
  const avg = Number(d.average_market_price_usd);
  const low = Number(d.low_price_usd);
  const high = Number(d.high_price_usd);
  if (!Number.isFinite(avg) || avg <= 0) return null;
  // Do NOT fall back to the average when a bound is missing. Three identical
  // figures labelled "lowest / average / highest" reads as a measured range
  // that happens to be flat, which is a fabricated claim, and it also makes the
  // verdict fire its "at or under the cheapest comparable" branch for a car
  // priced exactly at the average.
  return {
    averagePrice: Math.round(avg),
    lowPrice: Number.isFinite(low) && low > 0 ? Math.round(low) : null,
    highPrice: Number.isFinite(high) && high > 0 ? Math.round(high) : null,
    mileage: Math.round(mileage),
    zip: zip.trim(),
    fetchedAt: new Date().toISOString(),
  };
}

type DecodeVehicle = Record<string, unknown>;

const s = (v: unknown): string | undefined => {
  const t = typeof v === 'string' ? v.trim() : '';
  return t && t !== '-' ? t : undefined;
};
const n = (v: unknown): number | undefined => {
  const x = Number(v);
  return Number.isFinite(x) && x > 0 ? x : undefined;
};

/**
 * VIN Decode Plus (US): the original factory record. MSRP, dealer invoice,
 * fitted options, standard equipment and warranty. This is the half of the
 * report that the free NHTSA decode cannot give us.
 */
export async function getFactoryData(vin: string): Promise<FactoryData | null> {
  const body = await call('/oneauto/vindecodeplus/us/v2', {
    vehicle_identification_number: vin.trim().toUpperCase(),
  });
  return parseFactoryData(body);
}

/** Split out from the fetch so fixtures and tests can exercise the same parser. */
export function parseFactoryData(body: Record<string, unknown> | null): FactoryData | null {
  const r = body?.result as Record<string, unknown> | undefined;
  const v = r?.vehicle_data as DecodeVehicle | undefined;
  if (!v) return null;

  // The empty-shell miss described above. model_year 0 with no manufacturer is
  // this API telling us it has no record, in a 200 dressed as a success.
  if (!n(v.model_year) || !s(v.manufacturer_desc)) return null;

  const p = (r?.pricing_data || {}) as Record<string, unknown>;
  const feats = Array.isArray(r?.standard_features) ? (r!.standard_features as Record<string, unknown>[]) : [];
  const opts = Array.isArray(r?.installed_options) ? (r!.installed_options as Record<string, unknown>[]) : [];
  const warr = Array.isArray(r?.warranty_data) ? (r!.warranty_data as Record<string, unknown>[]) : [];

  return {
    year: String(n(v.model_year)),
    make: s(v.manufacturer_desc) || '',
    model: s(v.model_range_desc) || '',
    trim: s(v.trim_desc),
    bodyType: s(v.body_type_desc),
    engine: s(v.engine_desc),
    transmission: s(v.transmission_desc),
    drivetrain: s(v.drivetrain_desc),
    fuelType: s(v.fuel_type_desc),
    cityMpg: n(v.city_mpg),
    highwayMpg: n(v.highway_mpg),
    doors: n(v.number_doors),
    seats: n(v.number_seats),
    msrp: n(p.msrp_usd) ?? null,
    invoicePrice: n(p.dealer_invoice_price_usd) ?? null,
    optionsMsrp: n(p.installed_options_msrp_usd) ?? null,
    deliveryCharges: n(p.delivery_charges_usd) ?? null,
    combinedMsrp: n(p.combined_msrp_usd) ?? null,
    standardFeatures: feats
      .map((f) => ({
        category: s(f.feature_category) || 'Other',
        description: s(f.feature_desc) || s(f.feature_generic_desc) || '',
      }))
      .filter((f) => f.description),
    installedOptions: opts
      .map((o) => ({ description: s(o.feature_desc) || '', msrp: n(o.msrp_usd) ?? null }))
      .filter((o) => o.description),
    warranty: warr
      .map((w) => ({
        type: s(w.warranty_type) || '',
        months: n(w.warranty_months) ?? null,
        miles: n(w.warranty_miles) ?? null,
      }))
      .filter((w) => w.type),
  };
}

/**
 * VIN-level recall status. Paid, ~12p, so it is reserved for the top tier.
 *
 * The free NHTSA feed only lists campaigns ever issued for a year/make/model,
 * which forces the report to say "confirm with a dealer". This answers the
 * question the buyer actually has: is there outstanding work on THIS car. It
 * also surfaces manufacturer service campaigns that never reach NHTSA.
 */
export async function getRecallReport(vin: string): Promise<RecallReport | null> {
  const body = await call('/oneauto/recallreportfromvin/v2', {
    vehicle_identification_number: vin.trim().toUpperCase(),
  });
  return parseRecallReport(body);
}

/** Split from the fetch so fixtures and tests exercise the same parser. */
export function parseRecallReport(body: Record<string, unknown> | null): RecallReport | null {
  const r = body?.result as Record<string, unknown> | undefined;
  if (!r) return null;
  // A response with no VIN echoed back is not a real answer, and treating it
  // as "no recalls" would repeat the NHTSA-outage mistake with a paid feed.
  if (!s(r.vehicle_identification_number) && !s(r.recall_status_checked_datetime)) return null;

  const list = (key: string, source: 'NHTSA' | 'Manufacturer') =>
    (Array.isArray(r[key]) ? (r[key] as Record<string, unknown>[]) : []).map((x) => ({
      source,
      campaign: s(x.campaign_id) || s(x.recall_no) || s(x.nhtsa_campaign_number),
      component: s(x.component_affected) || s(x.component_desc) || s(x.component),
      summary: s(x.summary) || s(x.description) || s(x.recall_desc),
      remedy: s(x.remedy) || s(x.remedy_desc),
    }));

  const items = [...list('nhtsa_recalls', 'NHTSA'), ...list('manufacturer_recalls', 'Manufacturer')];
  const nhtsaCount = n(r.nhtsa_recall_qty) ?? items.filter((i) => i.source === 'NHTSA').length;
  const manufacturerCount = n(r.manufacturer_recall_qty) ?? items.filter((i) => i.source === 'Manufacturer').length;
  const total = n(r.recall_qty) ?? items.length;

  return {
    checkedAt: s(r.recall_status_checked_datetime) || new Date().toISOString(),
    outstanding: r.is_recall_outstanding === true || total > 0,
    total,
    nhtsaCount,
    manufacturerCount,
    items,
  };
}

/**
 * Retail Market Value (US), VIN Audit via OneAuto. Path found by probing on
 * 16 September 2026 (it was not in the Swagger spec yet); it wants the VIN
 * and `current_mileage`, and answers 200 with `success:true` plus
 * `result.pricing_data`, `result.distribution_data`, `result.adjustments_data`
 * and up to 1,000 rows of `result.sales_data`. A synthetic serial number
 * (positions 12 to 17) values fine, which is what the model pages rely on.
 *
 * NATIONAL, not local: the feed values the year, make, model and trim across
 * the whole country (a test VIN drew listings from New York to California).
 * Every listing carries a ZIP and lat/long, so the local view is computed on
 * our side in market-evidence.ts. Carketa stays the headline local number.
 *
 * Enterprise rate 24p a call. Cached a week per VIN and mileage: a buyer who
 * upgrades from the Valuation to the Negotiation Bundle must not pay for the
 * same listings twice.
 */
export async function getRetailMarketValue(vin: string, mileage: number): Promise<MarketEvidence | null> {
  const key = apiKey();
  if (!key) return null;
  const qs = new URLSearchParams({
    vehicle_identification_number: vin.trim().toUpperCase(),
    current_mileage: String(Math.round(mileage)),
  }).toString();
  try {
    const res = await fetch(`${BASE_URL}/vinaudit/retailmarketvalue/us/?${qs}`, {
      headers: { 'x-api-key': key },
      next: { revalidate: 604800 },
    });
    if (res.status === 204) return null;
    const body = (await res.json().catch(() => null)) as Record<string, unknown> | null;
    return parseRetailMarketValue(body, Math.round(mileage));
  } catch {
    return null;
  }
}

export function parseRetailMarketValue(body: Record<string, unknown> | null, mileage: number): MarketEvidence | null {
  if (!body || body.success !== true) return null;
  const r = body.result as Record<string, unknown> | undefined;
  const v = (r?.vehicle_data ?? {}) as Record<string, unknown>;
  const p = (r?.pricing_data ?? {}) as Record<string, unknown>;
  const adj = (r?.adjustments_data ?? {}) as Record<string, unknown>;
  const avg = Number(p.retail_average_valuation_usd ?? p.mean_valuation_usd);
  if (!Number.isFinite(avg) || avg <= 0) return null;

  const num = (x: unknown): number => {
    const y = Number(x);
    return Number.isFinite(y) ? y : 0;
  };
  const bands = (Array.isArray(r?.distribution_data) ? (r!.distribution_data as Record<string, unknown>[]) : [])
    .map((b) => ({ min: num(b.sale_price_min), max: num(b.sale_price_max), count: num(b.sale_prices_count) }))
    .filter((b) => b.max > 0);
  const listings: MarketListing[] = (Array.isArray(r?.sales_data) ? (r!.sales_data as Record<string, unknown>[]) : [])
    .map((l) => ({
      date: s(l.sale_date) || '',
      mileage: num(l.mileage_observed),
      price: num(l.advertised_price_usd),
      adjPrice: Math.round(num(l.mileage_adjusted_price_usd)),
      zip: String(l.zip_code ?? '').padStart(5, '0').slice(0, 5),
      state: s(l.state_code) || '',
      lat: num(l.latitude),
      lng: num(l.longitude),
    }))
    .filter((l) => l.price > 0 && l.adjPrice > 0);

  return {
    vehicleDesc: s(v.vehicle_desc) || [v.model_year, v.manufacturer_desc, v.model_range_desc, v.trim_desc].filter(Boolean).join(' '),
    mileage,
    mean: Math.round(num(p.mean_valuation_usd) || avg),
    standardDeviation: Math.round(num(p.standard_deviation_usd)),
    count: Math.max(num(p.sale_prices_count), listings.length),
    confidence: Math.max(0, Math.min(100, num(p.confidence_level))),
    from: s(p.sale_date_from) || '',
    to: s(p.sale_date_to) || '',
    low: Math.round(num(p.retail_low_valuation_usd) || avg),
    avg: Math.round(avg),
    high: Math.round(num(p.retail_high_valuation_usd) || avg),
    bands,
    mileageAdjustment: Math.round(num(adj.mileage_adjustment)),
    listings,
    fetchedAt: new Date().toISOString(),
  };
}
