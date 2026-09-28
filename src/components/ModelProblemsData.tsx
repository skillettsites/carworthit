import type { ReactNode } from 'react';
import { type ModelProblems, type YearFlag, longDate, yearSpan, shortAnswer } from '@/lib/model-problems';

// The data half of a "[model] common problems" page. Server-rendered tables
// built from NHTSA counts, so a crawler and a reader see the same numbers,
// and the prose around them (in articles.json) never has to repeat a figure
// that could drift from the data.

const n = (x: number) => x.toLocaleString('en-US');

const FLAG: Record<YearFlag, { label: string; cls: string }> = {
  most: { label: 'Year to avoid', cls: 'bg-red-50 text-red-700 border-red-200' },
  newhigh: { label: 'High already', cls: 'bg-red-50 text-red-700 border-red-200' },
  high: { label: 'High', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  above: { label: 'Above median', cls: 'bg-amber-50 text-amber-800 border-amber-100' },
  typical: { label: 'Typical', cls: 'bg-slate-50 text-slate-600 border-slate-200' },
  fewest: { label: 'Fewest complaints', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  sparse: { label: 'Few records', cls: 'bg-slate-50 text-slate-500 border-slate-200' },
  new: { label: 'Too new to judge', cls: 'bg-slate-50 text-slate-500 border-slate-200' },
};

function Table({ children }: { children: ReactNode }) {
  return (
    <div className="table-scroll" tabIndex={0}>
      <table>{children}</table>
    </div>
  );
}

/** The answer first, in one box: the years, the parts, the recalls. */
export function ProblemsShortAnswer({ d }: { d: ModelProblems }) {
  return (
    <div className="not-prose mb-8 rounded-2xl border-2 border-brand/30 bg-gradient-to-br from-blue-50 to-cyan-50 p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-wide text-brand">Short answer</p>
      <p className="mt-2 leading-relaxed text-ink">{shortAnswer(d)}</p>
      <p className="mt-3 text-xs text-ink-2">
        Source: NHTSA complaints, recalls and defect investigations for the {d.totals.firstYear} to {d.totals.lastYear}{' '}
        {d.name}, {n(d.totals.complaints)} complaints in all, pulled {longDate(d.pulled)}.
      </p>
    </div>
  );
}

/** Complaints, recalls and the parts owners name, one row per model year. */
export function ProblemsByYear({ d }: { d: ModelProblems }) {
  return (
    <section className="article-body">
      <h2>{d.name} complaints and recalls by model year</h2>
      <p>
        Owner complaints filed with NHTSA&apos;s Office of Defects Investigation and distinct recall campaigns, for every
        model year with records, counted on {longDate(d.pulled)}. The median model year up to {d.judgeThrough} drew{' '}
        {n(d.median)} complaints; a year is marked to avoid when it is one of the three highest and drew at least twice
        that. Years after {d.judgeThrough} have had less time to collect complaints, so they are judged only if they
        already pass the same line.
      </p>
      <Table>
        <thead>
          <tr>
            <th>Model year</th>
            <th>Verdict</th>
            <th>Complaints</th>
            <th>Recalls</th>
            <th>Crash / fire / injury reports</th>
            <th>Most-reported components</th>
          </tr>
        </thead>
        <tbody>
          {d.years.map((y) => (
            <tr key={y.year}>
              <td>
                <strong>{y.year}</strong>
              </td>
              <td>
                <span className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-semibold ${FLAG[y.flag].cls}`}>
                  {FLAG[y.flag].label}
                </span>
              </td>
              <td>{n(y.complaints)}</td>
              <td>{y.recalls}</td>
              <td>
                {y.crashes} / {y.fires} / {y.injuries}
              </td>
              <td>{y.top.length ? y.top.map((c) => `${c.c} (${n(c.n)})`).join(', ') : 'None listed'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <p className="text-sm">
        Counts are raw totals and are not adjusted for how many of each year were sold, so a big-selling year draws more
        complaints than a slow one. Crash, fire and injury columns count complaints that report one, as filed by the owner.
      </p>
    </section>
  );
}

const RECALLS_SHOWN = 15;

function RecallRows({ rows }: { rows: ModelProblems['recalls'] }) {
  return (
    <>
      {rows.map((r) => (
        <tr key={r.campaign}>
          <td className="whitespace-nowrap font-mono text-xs">{r.campaign}</td>
          <td className="whitespace-nowrap">{longDate(r.date)}</td>
          <td>{yearSpan(r.years)}</td>
          <td>{r.component || 'Not stated'}</td>
          <td>
            {r.parkIt && <strong>NHTSA park-it warning: do not drive until repaired. </strong>}
            {r.parkOutside && <strong>NHTSA park-outside warning. </strong>}
            {r.defect}
          </td>
        </tr>
      ))}
    </>
  );
}

/** What owners describe, every recall with its campaign number, the investigations, and the method. */
export function ProblemsDetail({ d }: { d: ModelProblems }) {
  const first = d.recalls.slice(0, RECALLS_SHOWN);
  const rest = d.recalls.slice(RECALLS_SHOWN);
  const themes = d.themes.slice(0, 10);
  // A live example of the source query, for the busiest model year.
  const busiest = [...d.years].sort((a, b) => b.complaints - a.complaints)[0];
  const sampleUrl = `https://api.nhtsa.gov/complaints/complaintsByVehicle?make=${encodeURIComponent(d.make.toLowerCase())}&model=${encodeURIComponent(
    d.nhtsaModels[0].toLowerCase(),
  )}&modelYear=${busiest?.year ?? d.totals.lastYear}`;
  return (
    <section className="article-body">
      <h2>What {d.name} owners report most</h2>
      <p>
        NHTSA files each complaint under one or more component categories. Across all {n(d.totals.complaints)}{' '}
        {d.name} complaints, these are the most common:
      </p>
      <Table>
        <thead>
          <tr>
            <th>NHTSA component</th>
            <th>Complaints</th>
            <th>Share of complaints</th>
          </tr>
        </thead>
        <tbody>
          {d.components.map((c) => (
            <tr key={c.c}>
              <td>{c.c}</td>
              <td>{n(c.n)}</td>
              <td>{((100 * c.n) / Math.max(1, d.totals.complaints)).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {themes.length > 0 && (
        <>
          <p>
            The categories are broad, so the owners&apos; own descriptions were also searched for specific symptoms. These
            are counts of complaints whose text mentions each one, not diagnoses, and one complaint can mention several.
          </p>
          <Table>
            <thead>
              <tr>
                <th>What the complaint describes</th>
                <th>Complaints</th>
                <th>Share</th>
                <th>Model years with the most</th>
              </tr>
            </thead>
            <tbody>
              {themes.map((t) => (
                <tr key={t.key}>
                  <td>{t.label}</td>
                  <td>{n(t.n)}</td>
                  <td>{t.share.toFixed(1)}%</td>
                  <td>{t.topYears.map((y) => `${y.year} (${n(y.n)})`).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <h2>
        {d.name} recalls ({n(d.totals.recalls)} campaign{d.totals.recalls === 1 ? '' : 's'})
      </h2>
      {d.recalls.length ? (
        <>
          <p>
            Every recall campaign NHTSA lists for the {d.name}, newest first, with the model years it covers and NHTSA&apos;s
            own description of the defect, shortened. A recall on the model is not proof a given car was affected or
            left unrepaired: check a specific car by entering its VIN at nhtsa.gov/recalls or in the free CarWorthIt VIN
            report.
          </p>
          <Table>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Reported</th>
                <th>Model years</th>
                <th>Component</th>
                <th>The defect, in NHTSA&apos;s words</th>
              </tr>
            </thead>
            <tbody>
              <RecallRows rows={first} />
            </tbody>
          </Table>
          {rest.length > 0 && (
            <details className="not-prose rounded-xl border border-border bg-white p-4">
              <summary className="cursor-pointer font-semibold text-ink">
                Show the other {rest.length} {d.name} recall{rest.length === 1 ? '' : 's'}
              </summary>
              <div className="article-body mt-3">
                <Table>
                  <thead>
                    <tr>
                      <th>Campaign</th>
                      <th>Reported</th>
                      <th>Model years</th>
                      <th>Component</th>
                      <th>The defect, in NHTSA&apos;s words</th>
                    </tr>
                  </thead>
                  <tbody>
                    <RecallRows rows={rest} />
                  </tbody>
                </Table>
              </div>
            </details>
          )}
        </>
      ) : (
        <p>NHTSA lists no recall campaigns for these model years.</p>
      )}

      <h2>NHTSA defect investigations</h2>
      {d.investigations.length ? (
        <>
          <p>
            Investigations are opened when NHTSA sees a possible safety defect, often from complaints like the ones above.
            PE is a preliminary evaluation, EA an engineering analysis, RQ a recall query into whether an earlier recall
            went far enough, DP a defect petition and AQ an audit query.
          </p>
          <Table>
            <thead>
              <tr>
                <th>Number</th>
                <th>Opened</th>
                <th>Status</th>
                <th>{d.name} years</th>
                <th>Subject</th>
                <th>Recall campaign linked</th>
              </tr>
            </thead>
            <tbody>
              {d.investigations.map((i) => (
                <tr key={i.action}>
                  <td className="whitespace-nowrap font-mono text-xs">{i.action}</td>
                  <td className="whitespace-nowrap">{longDate(i.opened)}</td>
                  <td className="whitespace-nowrap">{i.closed ? `Closed ${longDate(i.closed)}` : <strong>Open</strong>}</td>
                  <td>{yearSpan(i.years)}</td>
                  <td>{i.subject}</td>
                  <td className="whitespace-nowrap font-mono text-xs">{i.campaign || 'No'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <p>NHTSA&apos;s investigation file lists no defect investigations covering these {d.name} model years.</p>
      )}

      <h3>How these numbers were counted</h3>
      <p className="text-sm">
        Complaints: NHTSA&apos;s{' '}
        <a href={sampleUrl} rel="nofollow">
          complaints API
        </a>{' '}
        for NHTSA model names {d.nhtsaModels.join(', ')}, each complaint counted once per model year; hybrid and plug-in
        versions, which NHTSA files separately, are not included. Recalls: distinct campaign numbers from NHTSA&apos;s{' '}
        <a href="https://www.nhtsa.gov/recalls" rel="nofollow">recalls database</a> for the same names and years.
        Investigations: NHTSA&apos;s{' '}
        <a href="https://static.nhtsa.gov/odi/ffdd/inv/FLAT_INV.zip" rel="nofollow">
          defect investigation file
        </a>
        . All pulled {longDate(d.pulled)}. These are counts of reports, not failure rates, and they say nothing about any
        individual car. For that, check the VIN.
      </p>
    </section>
  );
}
