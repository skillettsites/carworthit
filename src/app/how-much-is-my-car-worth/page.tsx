import type { Metadata } from 'next';
import VinForm from '@/components/VinForm';
import { PRODUCTS, SITE_URL } from '@/lib/constants';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';

const price = `$${PRODUCTS.valuation.price}`;

export const metadata: Metadata = {
  title: `How Much Is My Car Worth? Use the VIN, from ${price}`,
  description:
    `Year-make-model averages are free elsewhere. We price the exact VIN at its real mileage against cars for sale near you, from ${price}. Free VIN report first. Not a history check.`,
  alternates: { canonical: `${SITE_URL}/how-much-is-my-car-worth` },
};

const faqs = [
  {
    q: 'How much is my car worth?',
    a: `A year, make and model average is free from Kelley Blue Book and others. What a specific car is worth depends on its exact trim, options, mileage and local market. CarWorthIt prices that VIN at its odometer reading against cars listed near your ZIP code, from ${price}.`,
  },
  {
    q: 'Do I need the VIN?',
    a: 'Yes, if you want the actual car rather than a trim average. The VIN is on the dashboard, the driver-side door jamb, and the title.',
  },
  {
    q: 'Is this a Carfax or vehicle history report?',
    a: 'No. We do not sell accident, salvage or title-brand history. For those, use an NMVTIS-approved provider. We tell you what the car is worth.',
  },
];

export default function Page() {
  return (
    <div className="container-x py-14 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            faqSchema(faqs),
            breadcrumbSchema([
              { name: 'Home', url: SITE_URL },
              { name: 'How much is my car worth', url: `${SITE_URL}/how-much-is-my-car-worth` },
            ]),
          ]),
        }}
      />

      <h1 className="text-4xl font-extrabold">How much is my car worth?</h1>
      <p className="mt-4 text-lg text-ink-2 leading-relaxed">
        A free year-make-model number is an average. This car&apos;s value is its VIN, its mileage and the cars
        actually for sale near you. The VIN report is free. The valuation starts at {price}.
      </p>

      <div className="mt-8">
        <VinForm size="md" />
        <p className="mt-3 text-sm text-ink-2">Free specs, recalls and running costs. Valuation {price}, Full Report ${PRODUCTS.worthit.price}, Negotiation Bundle ${PRODUCTS.negotiation.price}.</p>
      </div>

      <h2 className="mt-12 text-2xl font-extrabold">Why the VIN, not the model</h2>
      <p className="mt-3 leading-relaxed text-ink-2">
        Two cars with the same year, make and model can be thousands of dollars apart once trim, factory options and
        mileage are in the price. The VIN already knows the trim. We add the odometer and your ZIP code.
      </p>

      <h2 className="mt-10 text-2xl font-extrabold">What you get</h2>
      <ul className="mt-3 space-y-2 text-ink-2 leading-relaxed">
        <li>Free: year, make, model, trim, open recalls, crash ratings and running costs.</li>
        <li>From {price}: what this VIN is worth near you, and a verdict on the asking price.</li>
        <li>We do not sell vehicle history. Say so if someone asks for Carfax.</li>
      </ul>
    </div>
  );
}
