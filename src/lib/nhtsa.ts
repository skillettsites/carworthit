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

export function isValidVin(vin: string): boolean {
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin.trim());
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

export async function getRecalls(make: string, model: string, year: string): Promise<Recall[]> {
  if (!make || !model || !year) return [];
  const url = `${RECALLS}?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
  const data = (await getJson(url)) as
    | { results?: Array<Record<string, string>> }
    | null;
  if (!data?.results?.length) return [];
  return data.results.slice(0, 25).map((x) => ({
    campaign: x.NHTSACampaignNumber || '',
    component: x.Component || '',
    summary: x.Summary || '',
    remedy: x.Remedy || undefined,
    date: x.ReportReceivedDate || undefined,
  }));
}
