// NHTSA Safety Ratings (NCAP 5-star) + complaint/investigation counts + safety tech.
// FREE, no API key. Real data. Adds crash-safety depth Carfax's free teaser lacks.
import type { SafetyRatings } from './types';

const BASE = 'https://api.nhtsa.gov/SafetyRatings';

async function getJson(url: string, timeoutMs = 9000): Promise<unknown> {
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

const star = (v?: string) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};
const yesNo = (v?: string) => (v ? /standard|optional|yes/i.test(v) : false);

export async function getSafety(year: string, make: string, model: string): Promise<SafetyRatings | null> {
  if (!year || !make || !model) return null;
  const list = (await getJson(
    `${BASE}/modelyear/${encodeURIComponent(year)}/make/${encodeURIComponent(make)}/model/${encodeURIComponent(model)}`,
  )) as { Results?: Array<{ VehicleId?: number }> } | null;
  const id = list?.Results?.[0]?.VehicleId;
  if (!id) return null;
  const detail = (await getJson(`${BASE}/VehicleId/${id}`)) as { Results?: Array<Record<string, string>> } | null;
  const r = detail?.Results?.[0];
  if (!r) return null;
  return {
    overall: star(r.OverallRating),
    frontal: star(r.OverallFrontCrashRating),
    side: star(r.OverallSideCrashRating),
    rollover: star(r.RolloverRating),
    complaints: r.ComplaintsCount ? Number(r.ComplaintsCount) : undefined,
    investigations: r.InvestigationCount ? Number(r.InvestigationCount) : undefined,
    esc: yesNo(r.NHTSAElectronicStabilityControl),
    fcw: yesNo(r.NHTSAForwardCollisionWarning),
    ldw: yesNo(r.NHTSALaneDepartureWarning),
  };
}
