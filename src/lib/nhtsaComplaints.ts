// Owner complaints filed with NHTSA for a year, make and model. Free, public
// federal data (api.nhtsa.gov/complaints), cached 30 days per vehicle.
//
// This feeds the free report: a count and the parts owners complain about
// most, matched by year, make and model rather than VIN, so it says what
// tends to go wrong with cars like this one, not what has gone wrong with it.

export interface ComplaintSummary {
  /** Total complaints NHTSA holds for the year, make and model. */
  total: number;
  /** Most-complained-about components, largest first. */
  top: { component: string; count: number }[];
  crashes: number;
  fires: number;
  /** ISO date of the most recent incident, when NHTSA supplied one. */
  latest: string | null;
}

const API = 'https://api.nhtsa.gov/complaints/complaintsByVehicle';

/** NHTSA writes incident dates as MM/DD/YYYY; older records are ISO. Both become YYYY-MM-DD, anything else null. */
function toIso(raw: string | undefined): string | null {
  if (!raw) return null;
  const us = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (us) return `${us[3]}-${us[1]}-${us[2]}`;
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return iso ? iso[0] : null;
}

/** "AIR BAGS:FRONTAL" and "SERVICE BRAKES,ENGINE" reduce to plain words. */
function tidy(component: string): string {
  const head = component.split(':')[0].trim();
  const word = head === 'UNKNOWN OR OTHER' ? 'Other' : head.toLowerCase();
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export async function getComplaints(year: string, make: string, model: string): Promise<ComplaintSummary | null> {
  if (!year || !make || !model) return null;
  const url = `${API}?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
  try {
    const res = await fetch(url, { next: { revalidate: 2592000 }, signal: AbortSignal.timeout(12000) });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      count?: number;
      results?: { components?: string; crash?: boolean; fire?: boolean; dateOfIncident?: string }[];
    };
    const results = data.results ?? [];
    const counts = new Map<string, number>();
    let crashes = 0;
    let fires = 0;
    let latest: string | null = null;
    for (const r of results) {
      if (r.crash) crashes++;
      if (r.fire) fires++;
      const d = toIso(r.dateOfIncident);
      if (d && (!latest || d > latest)) latest = d;
      const seen = new Set<string>();
      for (const c of (r.components || '').split(',')) {
        const name = tidy(c);
        if (!name || name === 'Other' || seen.has(name)) continue;
        seen.add(name);
        counts.set(name, (counts.get(name) || 0) + 1);
      }
    }
    const top = [...counts.entries()]
      .map(([component, count]) => ({ component, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    return { total: data.count ?? results.length, top, crashes, fires, latest };
  } catch {
    return null;
  }
}
