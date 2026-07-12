// VinAudit (NMVTIS), the PAID history layer. Real API contract + realistic
// sample fallback so the whole product works locally before the key is added.
// When VINAUDIT_KEY is set it calls the live API; otherwise it returns
// deterministic sample data derived from the VIN (same VIN => same result).
import type { HistoryData, TitleRecord, TitleBrand } from './types';

const API = 'https://api.vinaudit.com/query.php';

// Small deterministic hash so sample data is stable per VIN.
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const US_STATES = ['CA', 'TX', 'FL', 'NY', 'PA', 'OH', 'GA', 'NC', 'MI', 'IL', 'AZ', 'WA', 'CO', 'TN'];

function sampleHistory(vin: string): HistoryData {
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
    .map((t) => ({ date: t.date, reading: t.mileage as number, source: 'NMVTIS title record' }));

  const brands: TitleBrand[] = branded ? [{ label: h % 2 ? 'Salvage' : 'Flood', state: stateB, date: `${baseYear + 3}-06-01` }] : [];

  return {
    titles,
    brands,
    odometer,
    salvage: branded && h % 2 === 0,
    theft: false,
    totalLoss: branded,
    jsiRecords: branded ? 1 + (h % 2) : 0,
    ownersEstimate: owners,
    isSample: true,
  };
}

interface VinAuditResponse {
  success?: boolean;
  titles?: Array<{ state?: string; date?: string; vehicle?: string; meta?: string; mileage?: string | number }>;
  titlebrands?: Array<{ state?: string; date?: string; type?: string }>;
  jsi?: Array<{ state?: string; date?: string; type?: string }>;
  checks?: Array<{ name?: string; result?: string }>;
}

function mapLive(vin: string, data: VinAuditResponse): HistoryData {
  const titles: TitleRecord[] = (data.titles || []).map((t) => ({
    state: t.state || '',
    date: t.date || '',
    type: t.vehicle || t.meta || 'Title record',
    mileage: t.mileage !== undefined ? Number(t.mileage) : undefined,
  }));
  const brands: TitleBrand[] = [...(data.titlebrands || []), ...(data.jsi || [])].map((b) => ({
    label: b.type || 'Brand',
    state: b.state,
    date: b.date,
  }));
  const odometer = titles
    .filter((t) => t.mileage !== undefined && !Number.isNaN(t.mileage))
    .map((t) => ({ date: t.date, reading: t.mileage as number, source: 'NMVTIS title record' }));
  const checkHit = (name: string) =>
    (data.checks || []).some((c) => (c.name || '').toLowerCase().includes(name) && /yes|found|true/i.test(c.result || ''));
  return {
    titles,
    brands,
    odometer,
    salvage: brands.some((b) => /salvage/i.test(b.label)) || checkHit('salvage'),
    theft: checkHit('theft') || checkHit('stolen'),
    totalLoss: brands.some((b) => /junk|total|flood/i.test(b.label)) || checkHit('total'),
    jsiRecords: (data.jsi || []).length,
    ownersEstimate: new Set(titles.map((t) => t.date)).size || undefined,
    isSample: false,
  };
}

export async function getHistory(vin: string): Promise<HistoryData> {
  const key = process.env.VINAUDIT_KEY;
  const clean = vin.trim().toUpperCase();
  if (!key) return sampleHistory(clean);
  try {
    const url = `${API}?key=${encodeURIComponent(key)}&vin=${encodeURIComponent(clean)}&format=json`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return sampleHistory(clean);
    const data = (await res.json()) as VinAuditResponse;
    if (!data || data.success === false) return sampleHistory(clean);
    return mapLive(clean, data);
  } catch {
    return sampleHistory(clean);
  }
}
