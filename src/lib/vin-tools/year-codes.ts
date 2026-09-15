/**
 * VIN position 10 model-year codes.
 *
 * Source: 49 CFR 565.15(d), read on the eCFR on September 15, 2026.
 * Table XIII lists 1980 (A) through 2013 (D); Table VII lists 2005 (5)
 * through 2039 (9). The two overlap and agree for 2005 to 2013. The letters
 * I, O, Q, U and Z and the digit 0 are never used as a year code.
 *
 * The note to Table VII is the disambiguation rule: for passenger cars and
 * for MPVs and trucks of 10,000 lb GVWR or less, a NUMERIC position 7 means
 * position 10 refers to 1980 to 2009, and an ALPHABETIC position 7 means
 * 2010 to 2039.
 */
export const YEAR_CODE_SEQUENCE = 'ABCDEFGHJKLMNPRSTVWXY123456789'.split('');

export interface YearCodeRow {
  code: string;
  first: number; // 1980 to 2009 cycle
  second: number; // 2010 to 2039 cycle
}

export const YEAR_CODES: YearCodeRow[] = YEAR_CODE_SEQUENCE.map((code, i) => ({
  code,
  first: 1980 + i,
  second: 2010 + i,
}));

/** Look up the two candidate model years for a position-10 character. */
export function yearsForCode(ch: string): YearCodeRow | undefined {
  return YEAR_CODES.find((r) => r.code === ch.toUpperCase());
}

/**
 * Resolve the model year from a full 17-character VIN using the position 7
 * rule from the note to Table VII. Returns null when the 10th character is
 * not a valid year code. For vehicles outside the rule's scope (heavy trucks,
 * trailers, motorcycles) position 7 is not defined this way, so the caller
 * should say "either year" rather than trust this.
 */
export function modelYearFromVin(vin: string): { year: number | null; ambiguous: boolean; row?: YearCodeRow } {
  const clean = vin.trim().toUpperCase();
  const row = yearsForCode(clean[9] || '');
  if (!row) return { year: null, ambiguous: true };
  const p7 = clean[6] || '';
  if (/[0-9]/.test(p7)) return { year: row.first, ambiguous: false, row };
  if (/[A-Z]/.test(p7)) return { year: row.second, ambiguous: false, row };
  return { year: null, ambiguous: true, row };
}
