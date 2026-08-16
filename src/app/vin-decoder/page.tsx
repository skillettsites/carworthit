import type { Metadata } from 'next';
import Link from 'next/link';
import VinDecodeTool from '@/components/VinDecodeTool';
import JsonLd from '@/components/JsonLd';
import StickyVinCta from '@/components/StickyVinCta';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';
import { SITE_URL, PRODUCTS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Free VIN Decoder, Then Value the Car from $2.99',
  description:
    'Free VIN decoder for any 17-character VIN. Then a local-market valuation from $2.99. Specs, recalls and running costs with no account. Not a history report.',
  alternates: { canonical: `${SITE_URL}/vin-decoder` },
};

const faqs = [
  {
    q: 'What is a VIN decoder?',
    a: 'A VIN decoder reads the 17-character Vehicle Identification Number stamped on every car built since 1981 and tells you what the manufacturer built. The VIN is not random: specific characters encode the country of assembly, the manufacturer, the body style, the engine, the model year and the plant. A decoder translates those positions back into plain English.',
  },
  {
    q: 'Is this VIN decoder really free?',
    a: 'Yes, and there is no account and no card. It reads the NHTSA vPIC database, which is public United States federal data. You can also use NHTSA’s own tool directly at vpic.nhtsa.dot.gov if you prefer.',
  },
  {
    q: 'Where do I find the VIN on a car?',
    a: 'Three reliable places: the driver-side corner of the dashboard, visible through the windshield; the sticker inside the driver-side door jamb; and the vehicle’s title, registration and insurance documents. On a listing it is often in the description or a photo of the door jamb. If a private seller will not give you the VIN, treat that as the answer to a different question.',
  },
  {
    q: 'Why does a VIN never contain I, O or Q?',
    a: 'Those three letters are excluded from the VIN standard because they are too easily confused with the digits 1 and 0. If you have typed an I or an O, it is almost certainly a 1 or a zero.',
  },
  {
    q: 'Does decoding a VIN show accidents, theft or title problems?',
    a: 'No. A decode tells you what the vehicle is, not what has happened to it. Accident, salvage, title-brand and theft records in the United States sit behind NMVTIS and commercial licences. CarWorthIt does not sell those and says so plainly; for them, use an NMVTIS-approved provider listed at vehiclehistory.bja.ojp.gov.',
  },
  {
    q: 'Does the VIN tell me what the car is worth?',
    a: `Not on its own. The VIN fixes the exact trim and factory options, which is the starting point for a valuation, but value also depends on mileage and where you are. CarWorthIt prices a specific VIN at its real odometer reading against cars listed near your ZIP code, from $${PRODUCTS.valuation.price}.`,
  },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'VIN Decoder', url: `${SITE_URL}/vin-decoder` },
          ]),
        ]}
      />
      <div className="container-x max-w-3xl py-12 pb-28">
        <h1 className="text-3xl md:text-4xl font-extrabold">Free VIN Decoder</h1>
        <p className="mt-3 text-lg text-ink-2 leading-relaxed">
          Enter any 17-character VIN to see the year, make, model, trim, engine, drivetrain and where it was built.
          Free, instant, and no account.
        </p>

        {/* The tool sits immediately under the H1 on purpose. Every page
            outranking us on this term puts an input box above the fold; the
            ones that lead with an article do not rank. */}
        <div className="mt-6">
          <VinDecodeTool />
        </div>

        <h2 className="mt-12 text-2xl font-extrabold">What a VIN actually tells you</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          Every road vehicle built for sale in the United States since 1981 carries a 17-character VIN, and the
          characters are positional rather than sequential. Read left to right, they break into three blocks.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 pr-4 font-semibold">Positions</th>
                <th className="py-2 pr-4 font-semibold">Name</th>
                <th className="py-2 font-semibold">What it encodes</th>
              </tr>
            </thead>
            <tbody className="text-ink-2">
              <tr className="border-b border-border">
                <td className="py-2 pr-4 font-mono">1 to 3</td>
                <td className="py-2 pr-4">World Manufacturer Identifier</td>
                <td className="py-2">Country of assembly and the manufacturer. A VIN starting 1, 4 or 5 was built in the United States; 2 is Canada, 3 Mexico, J Japan, K South Korea, W Germany, and Y Sweden or Finland.</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 font-mono">4 to 8</td>
                <td className="py-2 pr-4">Vehicle Descriptor Section</td>
                <td className="py-2">Body style, engine, transmission, restraint system and model line. This is the block that fixes the exact trim, and it is why a VIN is a better starting point for a valuation than a year, make and model.</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 font-mono">9</td>
                <td className="py-2 pr-4">Check digit</td>
                <td className="py-2">A calculated value that validates the other sixteen. A mistyped VIN usually fails here, which is how a decoder can tell you the number is wrong before it looks anything up.</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 font-mono">10</td>
                <td className="py-2 pr-4">Model year</td>
                <td className="py-2">A single letter or digit. Note it is the MODEL year, not the build date, so a car sold in late 2019 can carry a 2020 model year.</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 font-mono">11</td>
                <td className="py-2 pr-4">Plant code</td>
                <td className="py-2">The specific factory that assembled it.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">12 to 17</td>
                <td className="py-2 pr-4">Serial number</td>
                <td className="py-2">The unique sequence for that individual vehicle.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 text-2xl font-extrabold">What a decode does not tell you</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          This is worth being blunt about, because plenty of sites blur it. Decoding a VIN reads the manufacturer&apos;s
          build record. It says nothing about what has happened to the vehicle since it left the factory. A decode will
          not show you an accident, a salvage or flood title, an odometer rollback, an outstanding lien or a theft
          record. Those live in separate, commercially licensed databases.
        </p>
        <p className="mt-3 leading-relaxed text-ink-2">
          CarWorthIt does not sell vehicle history reports and does not hold an NMVTIS licence. For title and salvage
          history, use an approved provider from the official list at{' '}
          <a href="https://vehiclehistory.bja.ojp.gov" rel="nofollow noopener" target="_blank" className="text-brand underline">
            vehiclehistory.bja.ojp.gov
          </a>
          . We would rather point you there than sell you a thin substitute.
        </p>

        <h2 className="mt-10 text-2xl font-extrabold">What you can get free, beyond the decode</h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          Running the VIN through the free report adds three things the decode alone does not cover, all from public
          federal data and still with no account:
        </p>
        <ul className="mt-3 space-y-2 text-ink-2">
          <li>
            <strong>Open safety recalls</strong> from the NHTSA campaign feed, which is the single most useful free
            check on any used car.
          </li>
          <li>
            <strong>Crash-test ratings and complaint counts</strong> from the NHTSA safety programme.
          </li>
          <li>
            <strong>EPA fuel economy and an estimated annual fuel cost</strong>, plus a five-year cost to own.
          </li>
        </ul>
        <p className="mt-4 leading-relaxed text-ink-2">
          The paid tiers, from ${PRODUCTS.valuation.price}, add what that specific VIN is worth at its real mileage
          against cars listed near you, and a verdict on the asking price.{' '}
          <Link href="/how-it-works" className="text-brand underline">
            How it works
          </Link>
          .
        </p>

        <h2 className="mt-10 text-2xl font-extrabold">Common questions</h2>
        <div className="mt-4 space-y-5">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-bold">{f.q}</h3>
              <p className="mt-1 leading-relaxed text-ink-2">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
      <StickyVinCta />
    </>
  );
}
