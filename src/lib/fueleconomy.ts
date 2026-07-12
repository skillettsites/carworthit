// fueleconomy.gov, FREE, no API key. Returns MPG + annual fuel cost. Real data.
// The service returns XML; we fetch and pull the fields we need.
import type { RunningCosts } from './types';

const BASE = 'https://www.fueleconomy.gov/ws/rest';

async function getXml(url: string, timeoutMs = 10000): Promise<string | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, next: { revalidate: 86400 } });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function tag(xml: string, name: string): string | undefined {
  const m = xml.match(new RegExp(`<${name}>([^<]*)</${name}>`));
  return m ? m[1] : undefined;
}
function firstValue(xml: string): string | undefined {
  // menu options come back as <menuItem><text>..</text><value>ID</value></menuItem>
  const m = xml.match(/<value>([^<]+)<\/value>/);
  return m ? m[1] : undefined;
}

export async function getRunningCosts(year: string, make: string, model: string): Promise<RunningCosts | null> {
  if (!year || !make || !model) return null;
  // 1. find matching vehicle option id
  const optsXml = await getXml(
    `${BASE}/vehicle/menu/options?year=${encodeURIComponent(year)}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`,
  );
  const id = optsXml ? firstValue(optsXml) : undefined;
  if (!id) return null;
  // 2. fetch that vehicle's economy record
  const vXml = await getXml(`${BASE}/vehicle/${id}`);
  if (!vXml) return null;
  const num = (n?: string) => (n !== undefined && n !== '' ? Number(n) : undefined);
  const comb = num(tag(vXml, 'comb08'));
  const city = num(tag(vXml, 'city08'));
  const hwy = num(tag(vXml, 'highway08'));
  const fuelCost = num(tag(vXml, 'fuelCost08'));
  const co2 = num(tag(vXml, 'co2TailpipeGpm'));
  if (comb === undefined && city === undefined) return null;
  return {
    mpgCombined: comb,
    mpgCity: city,
    mpgHighway: hwy,
    annualFuelCost: fuelCost,
    fuelType: tag(vXml, 'fuelType'),
    co2: co2 ? Math.round(co2) : undefined,
    source: 'fueleconomy.gov',
  };
}
