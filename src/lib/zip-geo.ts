// ZIP code centroids, for ranking market listings by distance from the buyer.
//
// Source: US Census Bureau, 2024 Gazetteer Files, ZIP Code Tabulation Areas
// (2024_Gaz_zcta_national.txt), public domain. 33,791 ZCTAs, each with its
// internal point latitude and longitude rounded to three decimals (about
// 100 metres), which is more than enough to say "within 100 miles".
//
// A ZCTA is not exactly a USPS ZIP code: PO-box-only ZIPs and a few very new
// ZIPs have no ZCTA. When a buyer's ZIP is missing we fall back to the
// national figures and say so, rather than guessing a location.
import { ZCTA_JSON } from '@/content/zcta';

let table: Record<string, [number, number]> | null = null;
function TABLE(): Record<string, [number, number]> {
  if (!table) table = JSON.parse(ZCTA_JSON) as Record<string, [number, number]>;
  return table;
}

export function zipToLatLng(zip: string): { lat: number; lng: number } | null {
  const z = (zip || '').trim().slice(0, 5);
  const hit = TABLE()[z];
  return hit ? { lat: hit[0], lng: hit[1] } : null;
}

/** Great-circle distance in statute miles. */
export function milesBetween(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}
