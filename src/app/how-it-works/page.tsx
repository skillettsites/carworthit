import type { Metadata } from 'next';
import VinForm from '@/components/VinForm';
import { PRODUCTS, SITE_URL } from '@/lib/constants';
import { howToSchema, breadcrumbSchema } from '@/lib/schema';

const price = `$${PRODUCTS.valuation.price}`;

export const metadata: Metadata = {
  title: 'How to value a car by VIN, step by step',
  description:
    'How to find out what a used car is worth using its VIN, your mileage and your ZIP code, and how to tell whether the asking price is fair.',
  alternates: { canonical: `${SITE_URL}/how-it-works` },
};

const steps = [
  {
    name: 'Find the VIN',
    text: 'The 17-character Vehicle Identification Number is on the seller’s listing, the lower corner of the windshield, the driver’s door jamb, or the title. It uniquely identifies that exact car, including its trim and the options it was built with.',
  },
  {
    name: 'See the free VIN report',
    text: 'We decode the VIN with NHTSA to show the year, make, model, engine and specification, list every open safety recall, add the NHTSA 5-star crash-test ratings and pull the EPA’s official fuel economy. Free, instantly, with no signup.',
  },
  {
    name: 'Add the mileage and your ZIP code',
    text: 'These are the two things that decide what a car is actually worth. Mileage is the biggest lever on value after age, and the same car sells for different money in different markets.',
  },
  {
    name: 'Get the valuation and the verdict',
    text: `From ${price} you get what that specific car is worth at its mileage in your local market, with the local range from lowest to highest. Tell us what the seller wants and we say plainly whether it is fair, cheap, or too much.`,
  },
  {
    name: 'Take the Negotiation Bundle with you',
    text: `The ${PRODUCTS.negotiation.name}, $${PRODUCTS.negotiation.price}, turns the valuation into a plan: where to open, what to aim to pay, when to walk away, your case for paying less, what the seller will argue back, and the order to say it in.`,
  },
];

export default function HowItWorks() {
  return (
    <div className="container-x py-14 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            howToSchema(
              'How to value a used car by VIN',
              'Find what a used car is worth using its VIN, odometer reading and ZIP code.',
              steps,
            ),
            breadcrumbSchema([
              { name: 'Home', url: SITE_URL },
              { name: 'How it works', url: `${SITE_URL}/how-it-works` },
            ]),
          ]),
        }}
      />

      <h1 className="text-4xl font-extrabold">How it works</h1>
      <p className="mt-4 text-lg text-ink-2 leading-relaxed">
        About a minute. The VIN report is free; you only pay if you want to know what the car is worth.
      </p>

      <ol className="mt-10 space-y-8">
        {steps.map((s, i) => (
          <li key={s.name} className="flex gap-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">
              {i + 1}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{s.name}</h2>
              <p className="mt-1 text-ink-2 leading-relaxed">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 rounded-2xl border border-border bg-white p-6">
        <h2 className="text-xl font-bold">What we don&apos;t do</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          We do not sell a vehicle history report. Accident records and title brands in the United States sit behind
          licenses we do not hold, and we would rather tell you that than sell a thin substitute. For title, salvage
          and theft history, use an NMVTIS-approved provider. CarWorthIt is not affiliated with Carfax, AutoCheck,
          Experian or Kelley Blue Book, and is not an approved NMVTIS data provider.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="mb-4 text-2xl font-bold">Check a car now</h2>
        <VinForm size="md" />
      </div>
    </div>
  );
}
