// fueleconomy.gov, FREE, no API key. Returns MPG (or MPGe for EVs) + annual fuel
// cost + range. Real data. The service returns XML; we fetch and pull fields.
//
// Accuracy notes (fixes from QA):
//  - EPA model names differ from NHTSA/vPIC ("F150 Pickup 4WD" vs "F-150",
//    "Grand Cherokee 4WD", "Model 3 Long Range"), so we resolve the EPA model by
//    fuzzy-matching the decoded model, disambiguating by drive type.
//  - A model can have several engine variants (4-cyl vs V6). We match the option
//    to the decoded engine (displacement + cylinders) instead of taking the first,
//    which previously returned the wrong MPG (e.g. the 4-cyl Accord for a V6).
//  - EVs carry MPGe in comb08 and a separate range field, not MPG/fuel cost.
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

// Parse <menuItem><text>..</text><value>..</value></menuItem> (either child order).
function parseMenuItems(xml: string): { text: string; value: string }[] {
  return (xml.match(/<menuItem>[\s\S]*?<\/menuItem>/g) || [])
    .map((block) => ({
      text: (block.match(/<text>([\s\S]*?)<\/text>/) || [])[1]?.trim() || '',
      value: (block.match(/<value>([\s\S]*?)<\/value>/) || [])[1]?.trim() || '',
    }))
    .filter((i) => i.value);
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const wants4wd = (d: string) => /4wd|awd|4x4|all-wheel|all wheel|four|4motion|quattro/i.test(d);
const wants2wd = (d: string) => /4x2|2wd|rwd|fwd|rear-wheel|front-wheel|rear wheel|front wheel/i.test(d);
const opt4wd = (t: string) => /4wd|awd|4x4|all-wheel|4motion|quattro/i.test(t);
const opt2wd = (t: string) => /2wd|rwd|fwd|2x4|rear-wheel|front-wheel/i.test(t);

// Resolve the decoded model to fueleconomy.gov's model string for this year+make.
async function resolveModel(year: string, make: string, model: string, drive?: string): Promise<string | null> {
  const xml = await getXml(`${BASE}/vehicle/menu/model?year=${encodeURIComponent(year)}&make=${encodeURIComponent(make)}`);
  if (!xml) return null;
  const items = parseMenuItems(xml).map((i) => i.text).filter(Boolean);
  if (!items.length) return null;
  const target = norm(model);
  const exact = items.filter((m) => norm(m) === target);
  let cand = exact.length ? exact : items.filter((m) => norm(m).includes(target) || target.includes(norm(m)));
  if (!cand.length) return null;
  if (cand.length > 1 && drive) {
    if (wants4wd(drive)) {
      const p = cand.find((m) => opt4wd(m));
      if (p) return p;
    } else if (wants2wd(drive)) {
      const p = cand.find((m) => opt2wd(m));
      if (p) return p;
    }
  }
  // otherwise the shortest (most generic) match
  return cand.sort((a, b) => a.length - b.length)[0];
}

// From the trim/engine options for a model, pick the one matching the decoded
// engine (displacement + cylinders); fall back to the first.
function pickOptionId(items: { text: string; value: string }[], displacementL?: string, cylinders?: string): string | null {
  if (!items.length) return null;
  const dispTarget = displacementL ? Number(displacementL) : NaN;
  const cylTarget = cylinders ? Number(cylinders) : NaN;
  let best = items[0];
  let bestScore = -Infinity;
  for (const it of items) {
    let score = 0;
    const dm = it.text.match(/([\d.]+)\s*L/i);
    if (dm && Number.isFinite(dispTarget)) {
      const diff = Math.abs(Number(dm[1]) - dispTarget);
      score += diff < 0.15 ? 3 : -diff;
    }
    const cm = it.text.match(/(\d+)\s*cyl/i);
    if (cm && Number.isFinite(cylTarget) && Number(cm[1]) === cylTarget) score += 1;
    if (score > bestScore) {
      bestScore = score;
      best = it;
    }
  }
  return best.value;
}

export async function getRunningCosts(
  year: string,
  make: string,
  model: string,
  engine?: { displacementL?: string; cylinders?: string; driveType?: string },
): Promise<RunningCosts | null> {
  if (!year || !make || !model) return null;
  const epaModel = await resolveModel(year, make, model, engine?.driveType);
  if (!epaModel) return null;
  const optsXml = await getXml(
    `${BASE}/vehicle/menu/options?year=${encodeURIComponent(year)}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(epaModel)}`,
  );
  if (!optsXml) return null;
  const items = parseMenuItems(optsXml);
  const id = pickOptionId(items, engine?.displacementL, engine?.cylinders);
  if (!id) return null;

  const vXml = await getXml(`${BASE}/vehicle/${id}`);
  if (!vXml) return null;
  const num = (n?: string) => (n !== undefined && n !== '' ? Number(n) : undefined);
  const comb = num(tag(vXml, 'comb08'));
  const city = num(tag(vXml, 'city08'));
  const hwy = num(tag(vXml, 'highway08'));
  const fuelCost = num(tag(vXml, 'fuelCost08'));
  const co2 = num(tag(vXml, 'co2TailpipeGpm'));
  const fuelType1 = tag(vXml, 'fuelType1') || '';
  const atv = tag(vXml, 'atvType') || '';
  const isElectric = /electric/i.test(fuelType1) || atv === 'EV';
  const range = num(tag(vXml, 'range'));
  if (comb === undefined && city === undefined) return null;
  return {
    mpgCombined: comb,
    mpgCity: city,
    mpgHighway: hwy,
    annualFuelCost: fuelCost,
    fuelType: tag(vXml, 'fuelType') || fuelType1 || undefined,
    co2: co2 ? Math.round(co2) : undefined,
    isElectric,
    rangeMiles: isElectric && range ? Math.round(range) : undefined,
    displ: tag(vXml, 'displ') || undefined,
    cylinders: tag(vXml, 'cylinders') || undefined,
    source: 'fueleconomy.gov',
  };
}
