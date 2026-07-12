// Valuation — VinAudit Market Value API (paid product). Real contract + sample
// fallback so the flow works before the key is added.
import type { Valuation } from './types';

const API = 'https://marketvalue.vinaudit.com/getmarketvalue.php';

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function insuranceByAge(base: number) {
  // annual premium scales loosely with vehicle value
  const f = Math.max(0.6, Math.min(2.2, base / 15000));
  return [
    { band: 'Age 16-25', annual: Math.round(2600 * f) },
    { band: 'Age 26-40', annual: Math.round(1650 * f) },
    { band: 'Age 41-65', annual: Math.round(1400 * f) },
    { band: 'Age 65+', annual: Math.round(1550 * f) },
  ];
}

function build(mean: number, isSample: boolean): Valuation {
  const m = Math.max(1200, Math.round(mean));
  return {
    mean: m,
    low: Math.round(m * 0.88),
    high: Math.round(m * 1.12),
    tradeIn: Math.round(m * 0.84),
    privateParty: m,
    dealerRetail: Math.round(m * 1.14),
    insuranceByAge: insuranceByAge(m),
    isSample,
  };
}

function sampleValuation(vin: string, year: string): Valuation {
  const age = Math.max(0, new Date().getUTCFullYear() - (Number(year) || 2015));
  const h = hash(vin);
  const newPrice = 27000 + (h % 12000); // varies by VIN
  const mean = newPrice * Math.pow(0.86, age) * (0.92 + ((h >> 5) % 16) / 100);
  return build(mean, true);
}

interface ValueResponse {
  success?: boolean;
  prices?: { mean?: number; average?: number; below?: number; above?: number };
  mean?: number;
}

export async function getValuation(vin: string, year: string): Promise<Valuation> {
  const key = process.env.VINAUDIT_KEY;
  const clean = vin.trim().toUpperCase();
  if (!key) return sampleValuation(clean, year);
  try {
    const res = await fetch(`${API}?key=${encodeURIComponent(key)}&vin=${encodeURIComponent(clean)}&format=json`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return sampleValuation(clean, year);
    const data = (await res.json()) as ValueResponse;
    const mean = data.prices?.mean ?? data.prices?.average ?? data.mean;
    if (!mean || data.success === false) return sampleValuation(clean, year);
    return build(mean, false);
  } catch {
    return sampleValuation(clean, year);
  }
}
