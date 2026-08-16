import type { Metadata } from 'next';
import VinForm from '@/components/VinForm';
import { PRODUCTS, SITE_URL } from '@/lib/constants';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';

const price = `$${PRODUCTS.valuation.price}`;

export const metadata: Metadata = {
  title: `Check Car Value by VIN from ${price}`,
  description:
    `Check what a used car is worth from its VIN. Free report first, then a local-market valuation from ${price}. Not Carfax, not a history report.`,
  alternates: { canonical: `${SITE_URL}/check-car-value` },
};

const faqs = [
  {
    q: 'How do I check a car’s value?',
    a: `Enter the 17-character VIN. You get a free decode, recalls and running costs. The paid valuation, from ${price}, prices that exact car at its mileage against listings near your ZIP code.`,
  },
  {
    q: 'Is checking a car’s value free?',
    a: 'The VIN report is free. The market valuation is paid, because it uses live local listings for that specific vehicle rather than a national trim average.',
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
              { name: 'Check car value', url: `${SITE_URL}/check-car-value` },
            ]),
          ]),
        }}
      />

      <h1 className="text-4xl font-extrabold">Check a car&apos;s value by VIN</h1>
      <p className="mt-4 text-lg text-ink-2 leading-relaxed">
        Paste the VIN. See the free report. Pay only if you want what this car is worth near you, from {price}.
      </p>

      <div className="mt-8">
        <VinForm size="md" />
        <p className="mt-3 text-sm text-ink-2">Valuation {price} · Full Report ${PRODUCTS.worthit.price} · Negotiation Bundle ${PRODUCTS.negotiation.price}. No history report.</p>
      </div>

      <h2 className="mt-12 text-2xl font-extrabold">What this is not</h2>
      <p className="mt-3 leading-relaxed text-ink-2">
        This is not Carfax, AutoCheck or an NMVTIS history report. We do not sell accident or title-brand data.
        CarWorthIt tells you what the car is worth, what it cost new, and what it costs to run.
      </p>
    </div>
  );
}
