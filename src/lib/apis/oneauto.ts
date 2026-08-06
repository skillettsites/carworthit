// OneAuto API client for the US services.
//
// Ported from carcostcheck/src/lib/apis/oneauto.ts, which already handles this
// API's quirks. Keeping the shape familiar so fixes port both ways.
//
// Path convention for the US set is /{provider}/{service}/us/v{n}. The country
// is a segment AFTER the service name, then the version. Carketa is the
// exception and has neither. These paths are not in any published swagger; they
// come from the raw HTML of the public service pages.
import type { FactoryData, MarketValuation } from '../types';

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
    const res = await fetch(`${BASE_URL}${path}?${qs}`, {
      headers: { 'x-api-key': key },
      cache: 'no-store',
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
  return {
    averagePrice: Math.round(avg),
    lowPrice: Number.isFinite(low) && low > 0 ? Math.round(low) : Math.round(avg),
    highPrice: Number.isFinite(high) && high > 0 ? Math.round(high) : Math.round(avg),
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
