import type { Metadata } from 'next';
import Link from 'next/link';
import VinForm from '@/components/VinForm';
import { SITE_NAME, SITE_URL, PRODUCTS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About CarWorthIt',
  description:
    'CarWorthIt is an independent, lower-cost US used-car checking service. Who we are, where our data comes from, and what our reports can and cannot tell you.',
  alternates: { canonical: `${SITE_URL}/about` },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About CarWorthIt',
  url: `${SITE_URL}/about`,
  mainEntity: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'Independent US used-car checking service providing VIN-based title, salvage, theft, odometer and market-value reports as a lower-cost alternative to Carfax and AutoCheck.',
  },
};

export default function About() {
  return (
    <div className="container-x py-14 max-w-3xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <h1 className="text-4xl font-extrabold">About CarWorthIt</h1>
      <p className="mt-4 text-lg text-ink-2 leading-relaxed">
        CarWorthIt helps used-car buyers in the United States avoid expensive mistakes. Enter a VIN and we pull together
        the checks that matter, title and salvage history, odometer readings, theft and total-loss records, safety
        recalls, and what the car is really worth, in one place, for a fraction of what the big-name reports charge.
      </p>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Why we built it</h2>
        <p className="mt-3 text-ink-2 leading-relaxed">
          A single history report from the household names can cost ${'44.99'} or more, and a buyer often needs to check
          several cars before choosing one. That adds up fast. We think the essential facts about a car, is the title
          clean, has the odometer been rolled back, was it ever a total loss, what is it actually worth, should not cost
          more than the tank of gas you spend driving to view it. Our history report starts at ${PRODUCTS.history.price},
          and a free preview of specs, recalls and running costs is available for any valid VIN with no signup.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Where our data comes from</h2>
        <ul className="mt-3 space-y-2 text-ink-2 leading-relaxed">
          <li><strong className="text-ink">A licensed US vehicle-data provider</strong>, for title brands, salvage, junk, flood and rebuilt records, theft and total-loss history, odometer readings and salvage-auction damage.</li>
          <li><strong className="text-ink">NHTSA</strong>, the National Highway Traffic Safety Administration, for VIN decoding, open safety recalls and 5-star crash-test ratings.</li>
          <li><strong className="text-ink">EPA fueleconomy.gov</strong>, for official MPG figures and estimated annual running costs.</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">What we are honest about</h2>
        <p className="mt-3 text-ink-2 leading-relaxed">
          A history report is powerful, but it is not everything. It can only show what was reported to an insurer, body
          shop, police or DMV, so a minor accident fixed privately may never appear. No report can see current mechanical
          condition, hidden rust or the quality of past repairs. That is why we always tell buyers to pair a report with
          a test drive and, for anything expensive, a pre-purchase inspection by an independent mechanic.
        </p>
        <p className="mt-3 text-ink-2 leading-relaxed">
          We are an independent service and are not affiliated with Carfax, AutoCheck or Experian. CarWorthIt is not an
          approved NMVTIS data provider, and our history report is not an official NMVTIS report. Our reports are for
          informational purposes and are not a substitute for an in-person inspection.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Learn before you buy</h2>
        <p className="mt-3 text-ink-2 leading-relaxed">
          Our{' '}
          <Link href="/blog" className="text-brand font-medium hover:underline">
            buying guides
          </Link>{' '}
          walk through checking a title, spotting odometer fraud, reading a history report and inspecting a used car,
          all free.
        </p>
      </section>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Check a car now</h2>
        <VinForm size="md" />
      </div>
    </div>
  );
}
