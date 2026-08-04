import type { Metadata } from 'next';
import Link from 'next/link';
import VinForm from '@/components/VinForm';
import { SITE_NAME, SITE_URL, ANALYST, MEDIA_EMAIL } from '@/lib/constants';

// Editors link a methodology page as sourcing and resist linking a commercial
// tool page. Two of CarEdge's four trade placements linked their methodology
// page specifically. This page exists to be that link target, so it stays
// honest, specific and free of sales copy.

export const metadata: Metadata = {
  title: 'Methodology, where every CarWorthIt number comes from',
  description:
    'Exactly which dataset produces which figure in a CarWorthIt report, what is measured versus estimated, how often each source updates, and what our data cannot tell you.',
  alternates: { canonical: `${SITE_URL}/methodology` },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'CarWorthIt Methodology',
  url: `${SITE_URL}/methodology`,
  description:
    'Data sources, update frequency and known limitations behind every figure in a CarWorthIt vehicle report.',
  publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  author: { '@type': 'Person', name: ANALYST.name, jobTitle: ANALYST.role },
};

const SOURCES = [
  {
    field: 'Year, make, model, trim, body, engine, plant',
    source: 'NHTSA vPIC VIN decoder',
    url: 'https://vpic.nhtsa.dot.gov/api/',
    type: 'Measured',
    updates: 'Continuously, by NHTSA',
    note: 'Decoded from the VIN itself. Some pre-2000 vehicles decode partially because manufacturers filed less detail.',
  },
  {
    field: 'Open safety recalls',
    source: 'NHTSA recalls database',
    url: 'https://www.nhtsa.gov/recalls',
    type: 'Measured',
    updates: 'As manufacturers file campaigns',
    note: 'Recalls are matched by year, make and model, so a campaign limited to a narrow VIN range may show for a vehicle outside it. Always confirm with a dealer.',
  },
  {
    field: 'Crash-test ratings',
    source: 'NHTSA NCAP 5-star safety ratings',
    url: 'https://www.nhtsa.gov/ratings',
    type: 'Measured',
    updates: 'Annually, per model year',
    note: 'Not every trim is tested. An untested variant shows no rating rather than an inherited one.',
  },
  {
    field: 'MPG and annual fuel cost',
    source: 'EPA fueleconomy.gov',
    url: 'https://www.fueleconomy.gov/feg/ws/',
    type: 'Measured',
    updates: 'Annually, per model year',
    note: 'EPA test-cycle figures at 15,000 miles a year. Real-world economy varies with driving style, climate and condition.',
  },
  {
    field: 'Title brands, salvage, junk, flood, theft, odometer, auction records',
    source: 'A licensed commercial US vehicle-data provider',
    url: null,
    type: 'Measured, where reported',
    updates: 'Per lookup, live',
    note: 'Only ever shows what was actually reported to an insurer, body shop, police force or DMV. A privately repaired accident may never appear anywhere.',
  },
  {
    field: 'Market value',
    source: 'Commercial market-pricing feed built on dealer listing comparables',
    url: null,
    type: 'Modelled',
    updates: 'Per lookup, live',
    note: 'A statistical estimate from comparable listings, not an appraisal. Condition, service history and local demand can move a real sale price either side of it.',
  },
  {
    field: '5-year cost to own',
    source: 'EPA fuel data plus US national averages',
    url: null,
    type: 'Estimated',
    updates: 'Reviewed periodically',
    note: 'Only the fuel line is specific to your car. Insurance, maintenance, repairs, taxes and depreciation are national averages scaled by vehicle age, and are labelled as estimates in the report.',
  },
];

export default function Methodology() {
  return (
    <div className="container-x py-14 max-w-3xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <h1 className="text-4xl font-extrabold">Methodology</h1>
      <p className="mt-4 text-lg text-ink-2 leading-relaxed">
        This page sets out where every figure in a CarWorthIt report comes from, whether it is measured or estimated,
        how often it updates, and what it cannot tell you. If you are a journalist or researcher checking a number we
        published, this is the page to read, and{' '}
        <a href={`mailto:${MEDIA_EMAIL}`} className="text-brand font-medium hover:underline">
          {MEDIA_EMAIL}
        </a>{' '}
        is the address to query it at.
      </p>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Source for every field</h2>
        <p className="mt-3 text-ink-2 leading-relaxed">
          &ldquo;Measured&rdquo; means the figure is a record someone filed. &ldquo;Modelled&rdquo; means it is
          calculated from comparable data. &ldquo;Estimated&rdquo; means it rests on national averages, and we say so
          wherever it appears.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="py-2 pr-4 font-semibold">Field</th>
                <th className="py-2 pr-4 font-semibold">Source</th>
                <th className="py-2 pr-4 font-semibold">Type</th>
                <th className="py-2 font-semibold">Updates</th>
              </tr>
            </thead>
            <tbody>
              {SOURCES.map((s) => (
                <tr key={s.field} className="border-b border-border align-top">
                  <td className="py-3 pr-4 text-ink">{s.field}</td>
                  <td className="py-3 pr-4 text-ink-2">
                    {s.url ? (
                      <a href={s.url} className="text-brand hover:underline" rel="noopener">
                        {s.source}
                      </a>
                    ) : (
                      s.source
                    )}
                    <div className="mt-1 text-xs text-ink-2">{s.note}</div>
                  </td>
                  <td className="py-3 pr-4 text-ink-2 whitespace-nowrap">{s.type}</td>
                  <td className="py-3 text-ink-2 whitespace-nowrap">{s.updates}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">What our data cannot tell you</h2>
        <p className="mt-3 text-ink-2 leading-relaxed">
          Stating this plainly matters more than the features list. No vehicle history report in the United States,
          ours or anyone else&apos;s, can see the following:
        </p>
        <ul className="mt-3 space-y-2 text-ink-2 leading-relaxed list-disc pl-5">
          <li>An accident that was never reported to an insurer, police force or body shop.</li>
          <li>Current mechanical condition, hidden rust, or the quality of past repair work.</li>
          <li>Whether outstanding recall work has actually been carried out.</li>
          <li>Wear that has not yet failed, which is what a pre-purchase inspection is for.</li>
        </ul>
        <p className="mt-3 text-ink-2 leading-relaxed">
          There is also no public US dataset of VIN-level title brands. Every commercial provider, including the
          household names, licenses this from the same small set of sources, which is why no report is exhaustive.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">How we handle corrections</h2>
        <p className="mt-3 text-ink-2 leading-relaxed">
          If a figure here or in one of our studies is wrong, we correct it on the page and say what changed, rather
          than deleting it. Email{' '}
          <a href={`mailto:${MEDIA_EMAIL}`} className="text-brand font-medium hover:underline">
            {MEDIA_EMAIL}
          </a>
          . We do not publish competitor prices, because they change without notice and a stale price is worse than
          none.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Who does the analysis</h2>
        <p className="mt-3 text-ink-2 leading-relaxed">
          <strong className="text-ink">{ANALYST.name}</strong>, {ANALYST.role}. {ANALYST.bio}
        </p>
        <p className="mt-3 text-ink-2 leading-relaxed">
          More detail on{' '}
          <Link href="/about" className="text-brand font-medium hover:underline">
            about
          </Link>{' '}
          and{' '}
          <Link href="/press" className="text-brand font-medium hover:underline">
            press
          </Link>
          .
        </p>
      </section>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Check a car</h2>
        <VinForm size="md" />
      </div>
    </div>
  );
}
