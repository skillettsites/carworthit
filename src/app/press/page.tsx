import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, ANALYST, MEDIA_EMAIL } from '@/lib/constants';

// CarEdge, Bumper and iSeeCars all run a page like this and it is the cheapest
// item on the authority list. A named, quotable human plus a working media
// address is what every journalist platform and every data study needs.

export const metadata: Metadata = {
  title: 'Press and media, CarWorthIt',
  description:
    'Media contact, company facts, our named analyst and how to request data or commentary from CarWorthIt on used-car values, vehicle history and running costs.',
  alternates: { canonical: `${SITE_URL}/press` },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'CarWorthIt Press and Media',
  url: `${SITE_URL}/press`,
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    email: MEDIA_EMAIL,
    employee: { '@type': 'Person', name: ANALYST.name, jobTitle: ANALYST.role, description: ANALYST.bio },
  },
};

export default function Press() {
  return (
    <div className="container-x py-14 max-w-3xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <h1 className="text-4xl font-extrabold">Press and media</h1>
      <p className="mt-4 text-lg text-ink-2 leading-relaxed">
        We provide data and commentary on used-car values, vehicle history, running costs and what it actually costs to
        own a car in the United States. Journalists are welcome to use our figures with attribution to {SITE_NAME}.
      </p>

      <section className="mt-12 rounded-2xl border border-border bg-white p-6">
        <h2 className="text-2xl font-bold">Media contact</h2>
        <p className="mt-3 text-ink-2 leading-relaxed">
          <a href={`mailto:${MEDIA_EMAIL}`} className="text-brand font-semibold text-lg hover:underline">
            {MEDIA_EMAIL}
          </a>
          <br />
          We aim to reply the same working day. If you are on deadline, say so in the subject line and we will
          prioritise it.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Named analyst, available for comment</h2>
        <p className="mt-3 text-ink-2 leading-relaxed">
          <strong className="text-ink">{ANALYST.name}</strong>, {ANALYST.role}
        </p>
        <p className="mt-3 text-ink-2 leading-relaxed">{ANALYST.bio}</p>
        <p className="mt-3 text-ink-2 leading-relaxed">
          Available for comment on used-car pricing and depreciation, vehicle history and title fraud, odometer
          rollback, running and ownership costs, and vehicle safety recall data.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">About the company, in one paragraph</h2>
        <p className="mt-3 text-ink-2 leading-relaxed">
          CarWorthIt is an independent US used-car checking service. Enter a VIN and it returns specs, open safety
          recalls, crash-test ratings and running costs free, with title and salvage history and a market valuation
          available as paid reports. It is not affiliated with Carfax, AutoCheck or Experian, and is not an approved
          NMVTIS data provider.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Using our figures</h2>
        <ul className="mt-3 space-y-2 text-ink-2 leading-relaxed list-disc pl-5">
          <li>Attribute to <strong className="text-ink">{SITE_NAME}</strong>, and link to the study page rather than the homepage where possible.</li>
          <li>Every figure we publish has a stated source and a stated method on our <Link href="/methodology" className="text-brand font-medium hover:underline">methodology page</Link>. Please check it before publication.</li>
          <li>We will tell you when a number is an estimate rather than a measurement, and we would rather you said so too.</li>
          <li>If we get something wrong we will correct it on the page and tell you. We do not quietly delete.</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Data requests</h2>
        <p className="mt-3 text-ink-2 leading-relaxed">
          We can usually provide a custom cut of our data for a story, including state-level and city-level
          breakdowns, at no cost. Tell us the angle and the deadline at{' '}
          <a href={`mailto:${MEDIA_EMAIL}`} className="text-brand font-medium hover:underline">
            {MEDIA_EMAIL}
          </a>
          .
        </p>
      </section>
    </div>
  );
}
