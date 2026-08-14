// NHTSA vPIC + Recalls, FREE, no API key required. Real data.
import type { VehicleSpecs, Recall } from './types';

const VPIC = 'https://vpic.nhtsa.dot.gov/api/vehicles';
const RECALLS = 'https://api.nhtsa.gov/recalls/recallsByVehicle';

async function getJson(url: string, timeoutMs = 10000): Promise<unknown> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, next: { revalidate: 86400 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

/**
 * ISO 3779 / FMVSS 115 transliteration. I, O and Q are not used in VINs.
 * Letters map to the values NHTSA publishes for the check-digit calculation.
 */
const VIN_TRANSLITERATION: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
};

/** Position weights for the 17-character VIN check digit (character 9 has weight 0). */
const VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

function vinCheckDigit(vin: string): string {
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += VIN_TRANSLITERATION[vin[i]] * VIN_WEIGHTS[i];
  }
  const rem = sum % 11;
  return rem === 10 ? 'X' : String(rem);
}

/**
 * A VIN is 17 characters, no I/O/Q, and the 9th character must be the
 * ISO 3779 check digit.
 *
 * Length and alphabet alone are not enough. `AAAAAAAAAAAAAAAAA` is 17 legal
 * characters, so checkout used to walk past this check and then refuse with
 * "Unknown product" whenever the client omitted a tier. A fake VIN has to
 * fail here so the buyer sees the incorrect-VIN path instead.
 */
export function isValidVin(vin: string): boolean {
  const clean = vin.trim().toUpperCase();
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(clean)) return false;
  return clean[8] === vinCheckDigit(clean);
}

export async function decodeVin(vin: string): Promise<VehicleSpecs | null> {
  const clean = vin.trim().toUpperCase();
  const data = (await getJson(`${VPIC}/DecodeVinValues/${encodeURIComponent(clean)}?format=json`)) as
    | { Results?: Array<Record<string, string>> }
    | null;
  const r = data?.Results?.[0];
  if (!r || !r.Make) return null;
  const val = (k: string) => (r[k] && r[k] !== 'Not Applicable' ? r[k] : undefined);
  return {
    vin: clean,
    year: val('ModelYear') || '',
    make: val('Make') || '',
    model: val('Model') || '',
    trim: val('Trim') || val('Series'),
    bodyClass: val('BodyClass'),
    engine: [val('EngineCylinders') && `${val('EngineCylinders')}-cyl`, val('DisplacementL') && `${Number(val('DisplacementL')).toFixed(1)}L`]
      .filter(Boolean)
      .join(' '),
    cylinders: val('EngineCylinders'),
    displacementL: val('DisplacementL'),
    fuelType: val('FuelTypePrimary'),
    driveType: val('DriveType'),
    transmission: val('TransmissionStyle'),
    doors: val('Doors'),
    plantCountry: val('PlantCountry'),
    vehicleType: val('VehicleType'),
    gvwr: val('GVWR'),
  };
}

/**
 * Open recall campaigns for a year/make/model.
 *
 * Returns `null` when NHTSA could not be reached, and `[]` only when NHTSA
 * genuinely reported no campaigns. The distinction is a safety matter: an
 * outage previously collapsed into an empty array, and the report then told
 * the buyer "no open safety recalls found" for a car that might have an open
 * airbag campaign.
 */
export async function getRecalls(make: string, model: string, year: string): Promise<Recall[] | null> {
  if (!make || !model || !year) return null;
  const url = `${RECALLS}?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
  const data = (await getJson(url)) as
    | { results?: Array<Record<string, string>> }
    | null;
  if (!data) return null; // could not reach NHTSA
  if (!data.results?.length) return [];
  return data.results.slice(0, 25).map((x) => ({
    campaign: x.NHTSACampaignNumber || '',
    component: x.Component || '',
    summary: x.Summary || '',
    remedy: x.Remedy || undefined,
    date: x.ReportReceivedDate || undefined,
  }));
}
