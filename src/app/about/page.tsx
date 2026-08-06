import type { Metadata } from 'next';
import Link from 'next/link';
import VinForm from '@/components/VinForm';
import { SITE_NAME, SITE_URL, PRODUCTS, ANALYST, MEDIA_EMAIL } from '@/lib/constants';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'About CarWorthIt',
  description:
    'CarWorthIt is an independent US car valuation service. Who we are, where our data comes from, what our reports can tell you and what they cannot.',
  alternates: { canonical: `${SITE_URL}/about` },
};

const schema = [
  {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About CarWorthIt',
    url: `${SITE_URL}/about`,
    mainEntity: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      description:
        'Independent US car valuation service. Prices any vehicle by VIN against comparable cars listed nearby, at its real mileage, and shows what it cost new.',
      employee: { '@type': 'Person', name: ANALYST.name, jobTitle: ANALYST.role, description: ANALYST.bio },
    },
  },
  breadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'About', url: `${SITE_URL}/about` },
  ]),
];

export default function About() {
  return (
    <div className="container-x py-14 max-w-3xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <h1 className="text-4xl font-extrabold">About CarWorthIt</h1>
      <p className="mt-4 text-lg text-ink-2 leading-relaxed">
        CarWorthIt answers one question: is this car worth it? Enter a VIN and we tell you what the car is worth
        against others actually for sale near you, what it cost new, what it costs to run, and whether the price
        you have been quoted is fair.
      </p>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Why we built it</h2>
        <p className="mt-3 text-ink-2 leading-relaxed">
          Most free valuation tools ask for the year, make, model and trim, then give you a national average. That
          is not what your car is worth. A car&apos;s value depends on its mileage and where it is being sold, and
          the gap between a national guess and a local reality is routinely thousands of dollars.
        </p>
        <p className="mt-3 text-ink-2 leading-relaxed">
          So we do it the other way round. We start from the VIN, ask for the odometer reading and your ZIP code,
          and price the car against comparable cars listed near you. Paid reports start at $
          {PRODUCTS.valuation.price}, and the VIN report covering specs, open recalls, safety ratings and running
          costs is free for any valid VIN with no signup.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Who writes this</h2>
        <p className="mt-3 text-ink-2 leading-relaxed">
          <strong className="text-ink">{ANALYST.name}</strong>, {ANALYST.role}. {ANALYST.bio}
        </p>
        <p className="mt-3 text-ink-2 leading-relaxed">
          Press and data inquiries:{' '}
          <a href={`mailto:${MEDIA_EMAIL}`} className="text-brand font-medium hover:underline">{MEDIA_EMAIL}</a>. See
          our <Link href="/methodology" className="text-brand font-medium hover:underline">methodology</Link> for
          exactly which dataset produces which number.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Where our data comes from</h2>
        <ul className="mt-3 space-y-2 text-ink-2 leading-relaxed">
          <li><strong className="text-ink">A licensed US vehicle-pricing provider</strong>, for market values calculated from comparable cars currently listed for sale near your ZIP code.</li>
          <li><strong className="text-ink">The factory build record</strong> for your exact VIN, for the original sticker price, dealer invoice price, fitted options, standard equipment and warranty terms.</li>
          <li><strong className="text-ink">NHTSA</strong>, for VIN decoding, open safety recalls and 5-star crash-test ratings.</li>
          <li><strong className="text-ink">EPA fueleconomy.gov</strong>, for official MPG figures and annual fuel costs.</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Editorial policy</h2>
        <ul className="mt-3 space-y-2 text-ink-2 leading-relaxed list-disc pl-5">
          <li>We do not quote competitors&apos; prices. They change them without notice and a stale figure is worse than none, so we rank them instead and tell you to check their site.</li>
          <li>We never invent a number. If a dataset does not cover your car, the report says so rather than estimating and presenting it as fact.</li>
          <li>Estimates are labeled as estimates, with the assumptions stated on the <Link href="/methodology" className="text-brand font-medium hover:underline">methodology</Link> page.</li>
          <li>If we cannot value your car, we refund you.</li>
          <li>We correct errors on the page rather than quietly deleting them. Found one? Email <a href={`mailto:${MEDIA_EMAIL}`} className="text-brand font-medium hover:underline">{MEDIA_EMAIL}</a>.</li>
          <li>Any paid link is labeled a paid link, in the text, not behind a tooltip.</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">What we are honest about</h2>
        <p className="mt-3 text-ink-2 leading-relaxed">
          We value the specific car you asked about, at its mileage in its local market, and we measure it against
          what comparable cars are currently listed for because that is the only evidence a valuation can be built
          on. It is still a statistical estimate rather than an appraisal. Condition, service history, accident
          damage and local demand can all move a real sale price either side of our figure, and no data feed can see
          the state of a clutch or the quality of a past repair.
        </p>
        <p className="mt-3 text-ink-2 leading-relaxed">
          We do not sell a vehicle history report. Accident and title-brand data in the United States sits behind
          licenses we do not hold, and we would rather tell you that than sell you a thin substitute. For that,
          use an approved provider. Always pair any report with a test drive and, for anything expensive, an
          inspection by an independent mechanic.
        </p>
        <p className="mt-3 text-ink-2 leading-relaxed">
          We are independent and not affiliated with Carfax, AutoCheck, Experian or Kelley Blue Book. CarWorthIt is
          not an approved NMVTIS data provider.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Learn before you buy</h2>
        <p className="mt-3 text-ink-2 leading-relaxed">
          Our <Link href="/blog" className="text-brand font-medium hover:underline">buying guides</Link> cover
          pricing a car properly, spotting a bad deal, diminished value after an accident, and what to check before
          you hand over money. All free.
        </p>
      </section>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Check a car now</h2>
        <VinForm size="md" />
      </div>
    </div>
  );
}
