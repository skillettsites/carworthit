// License plate -> VIN. US buyers often have the plate before the VIN.
// Uses VinAudit's plate lookup when the key is set; otherwise (demo mode)
// resolves any plate to the demo vehicle so the flow is fully testable.
const DEMO_VIN = '1HGCV1F30LA000000';

export const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
];

export function isValidPlate(plate: string): boolean {
  return /^[A-Z0-9]{2,8}$/i.test(plate.trim());
}
export function isValidState(state: string): boolean {
  return US_STATES.includes(state.trim().toUpperCase());
}

export async function plateToVin(plate: string, state: string): Promise<string | null> {
  const key = process.env.VINAUDIT_KEY;
  const p = plate.trim().toUpperCase();
  const s = state.trim().toUpperCase();
  if (!isValidPlate(p) || !isValidState(s)) return null;
  if (!key) return DEMO_VIN; // demo: any plate resolves to the sample car
  try {
    const url = `https://plate.vinaudit.com/query.php?key=${encodeURIComponent(key)}&plate=${encodeURIComponent(p)}&state=${encodeURIComponent(s)}&format=json`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = (await res.json()) as { vin?: string; success?: boolean };
    return data.vin || null;
  } catch {
    return null;
  }
}
