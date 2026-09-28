import data from '@/content/model-problems.json';

/**
 * NHTSA complaint, recall and investigation counts behind the data-backed
 * "[model] common problems" pages.
 *
 * Built by scripts/model-problems/build.py from free public NHTSA data:
 * api.nhtsa.gov/complaints/complaintsByVehicle, api.nhtsa.gov/recalls/
 * recallsByVehicle and the ODI investigations file (static.nhtsa.gov/odi/ffdd/
 * inv/FLAT_INV.zip). Every figure is a count of NHTSA records on the pull date.
 * Nothing is estimated: no failure rates, no repair costs.
 *
 * Year flags, applied to model years old enough to judge (judgeThrough and
 * earlier, the same four-year rule the other model guides use):
 *   most     one of up to three years with the most complaints, each at least
 *            twice the median year (the years to avoid, going by complaints)
 *   high     at least twice the median, but not in the top three
 *   above    at least 1.25 times the median
 *   fewest   half the median or less, only among the last 15 judged years
 *   sparse   under a tenth of the median (often a short or skipped model year)
 *   typical  everything else
 *   new      newer than judgeThrough and below twice the median
 *   newhigh  newer than judgeThrough and already at twice the median
 */

export type YearFlag = 'most' | 'high' | 'above' | 'typical' | 'fewest' | 'sparse' | 'new' | 'newhigh';

export interface ProblemYear {
  year: number;
  complaints: number;
  crashes: number;
  fires: number;
  injuries: number;
  recalls: number;
  top: { c: string; n: number }[];
  flag: YearFlag;
}

export interface ProblemRecall {
  campaign: string;
  date: string | null;
  component: string;
  componentFull: string;
  defect: string;
  parkIt: boolean;
  parkOutside: boolean;
  years: number[];
}

export interface ProblemInvestigation {
  action: string;
  subject: string;
  opened: string | null;
  closed: string | null;
  campaign: string | null;
  years: number[];
  component: string;
}

export interface ModelProblems {
  name: string;
  make: string;
  nhtsaModels: string[];
  pulled: string;
  judgeThrough: number;
  median: number;
  summary: {
    worst: { year: number; n: number }[];
    high: number[];
    newHigh: { year: number; n: number }[];
    fewest: { year: number; n: number }[];
    topJudged: { year: number; n: number }[];
    recentFloor: number;
  };
  totals: {
    complaints: number;
    crashes: number;
    fires: number;
    injuries: number;
    recalls: number;
    investigations: number;
    firstYear: number;
    lastYear: number;
  };
  /** Newest first. */
  years: ProblemYear[];
  components: { c: string; n: number }[];
  themes: { key: string; label: string; n: number; share: number; topYears: { year: number; n: number }[] }[];
  /** Newest first. */
  recalls: ProblemRecall[];
  investigations: ProblemInvestigation[];
}

const ALL = data as unknown as Record<string, ModelProblems>;

export function getModelProblems(slug: string): ModelProblems | null {
  return ALL[slug] ?? null;
}

export const MODEL_PROBLEM_SLUGS = Object.keys(ALL);

/** "2026-09-28" to "September 28, 2026". */
export function longDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

/** [2013, 2014, 2015, 2017] to "2013 to 2015, 2017". */
export function yearSpan(years: number[]): string {
  if (!years.length) return '';
  const out: string[] = [];
  let start = years[0];
  let prev = years[0];
  for (const y of [...years.slice(1), Number.NaN]) {
    if (y === prev + 1) {
      prev = y;
      continue;
    }
    out.push(start === prev ? String(start) : `${start} to ${prev}`);
    start = y;
    prev = y;
  }
  return out.join(', ');
}

const n = (x: number) => x.toLocaleString('en-US');

/** "2016 (510 complaints), 2014 (377)" */
export function listYears(items: { year: number; n: number }[]): string {
  const parts = items.map((x, i) => `${x.year} (${n(x.n)}${i === 0 ? ' complaints' : ''})`);
  if (parts.length <= 1) return parts.join('');
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

/** The plain-text short answer, shared by the page and its first FAQ. */
export function shortAnswer(d: ModelProblems): string {
  const s = d.summary;
  const bits: string[] = [];
  if (s.worst.length) {
    bits.push(
      `${d.name} years to avoid, going by NHTSA owner complaints: ${listYears(s.worst)}, each at least twice the median model year (${n(d.median)}).`,
    );
  } else {
    bits.push(
      `No ${d.name} model year stands out in NHTSA owner complaints: none drew twice the median (${n(d.median)}). The most complained-about years are ${listYears(s.topJudged)}.`,
    );
  }
  if (s.newHigh.length) {
    bits.push(`Newer years already past that line: ${listYears(s.newHigh)}.`);
  }
  const top = d.components.slice(0, 3).map((c) => `${c.c.toLowerCase()} (${n(c.n)})`);
  if (top.length) bits.push(`The components owners report most are ${top.slice(0, -1).join(', ')} and ${top[top.length - 1]}.`);
  bits.push(
    `NHTSA lists ${n(d.totals.recalls)} recall campaign${d.totals.recalls === 1 ? '' : 's'}${
      d.totals.investigations ? ` and ${n(d.totals.investigations)} defect investigation${d.totals.investigations === 1 ? '' : 's'}` : ''
    } for the ${d.totals.firstYear} to ${d.totals.lastYear} model years.`,
  );
  return bits.join(' ');
}
