import type { Metadata } from 'next';
import Link from 'next/link';
import ToolPage from '@/components/tools/ToolPage';
import VinDecodeTool from '@/components/VinDecodeTool';
import { SITE_URL, PRODUCTS } from '@/lib/constants';
import samples from '@/content/vin-tools/sample-decodes.json';
import type { SampleDecode } from '@/lib/vin-tools/makes';

export const metadata: Metadata = {
  title: 'Transmission by VIN (Free): NHTSA Data',
  description:
    'Find the transmission by VIN, free: NHTSA vPIC returns the transmission style and speeds when the manufacturer filed them. Blank means it was not filed. What we saw for 12 makes, and where else to look.',
  alternates: { canonical: `${SITE_URL}/transmission-by-vin` },
};

/*
 * Sources: vPIC DecodeVinValues fields TransmissionStyle and
 * TransmissionSpeeds (variable IDs 37 and 63 in GetVehicleVariableList,
 * fetched September 15, 2026); one real or pattern-valid decode per make in
 * src/content/vin-tools/sample-decodes.json, same date.
 */

const S = samples as Record<string, SampleDecode>;
const ORDER = ['ford', 'toyota', 'honda', 'chevrolet', 'nissan', 'bmw', 'audi', 'jeep', 'subaru', 'hyundai', 'kia', 'harley-davidson'];
const NAMES: Record<string, string> = {
  ford: 'Ford',
  toyota: 'Toyota',
  honda: 'Honda',
  chevrolet: 'Chevrolet',
  nissan: 'Nissan',
  bmw: 'BMW',
  audi: 'Audi',
  jeep: 'Jeep',
  subaru: 'Subaru',
  hyundai: 'Hyundai',
  kia: 'Kia',
  'harley-davidson': 'Harley-Davidson',
};

const withStyle = ORDER.filter((k) => S[k].fields.TransmissionStyle);
const withSpeeds = ORDER.filter((k) => S[k].fields.TransmissionSpeeds);

const faqs = [
  {
    q: 'Can you tell the transmission from the VIN?',
    a: `Sometimes. NHTSA's vPIC database returns a transmission style (automatic, manual, CVT) and a speed count only when the manufacturer included them in the VIN pattern it filed. For the twelve makes we decoded on September 15, 2026, ${withStyle.length} of 12 returned a transmission style and ${withSpeeds.length} of 12 returned the number of speeds. A blank is a blank filing, not a fault in the VIN.`,
  },
  {
    q: 'Why is the transmission blank for my VIN?',
    a: 'Because the manufacturer did not file that attribute for the pattern. The VIN standard (49 CFR 565.15) requires cars to encode line, series, body type, engine type and restraint system; transmission is not on the list, so it appears only where the maker chose to include it. In our sample, Toyota, BMW, Hyundai and Kia VINs came back blank while Ford, Honda, Chevrolet, Nissan, Audi, Jeep and Subaru VINs did not.',
  },
  {
    q: 'Where else is the transmission recorded?',
    a: 'On the window sticker (Monroney label), which lists it by name; in the manufacturer\'s build record, which is what the CarWorthIt Full Report reproduces; on the certification or service-parts label on some makes; and, physically, on the transmission case tag. A dealer can also read it from the VIN through the manufacturer\'s own system.',
  },
  {
    q: 'Does "4WD/4-Wheel Drive/4x4" mean the same as AWD?',
    a: 'vPIC records whatever the manufacturer filed. The Toyota Camry sample, a sedan, returned "4WD/4-Wheel Drive/4x4", while the BMW and Audi samples returned "AWD/All-Wheel Drive" and the Chevrolet returned "FWD/Front-Wheel Drive". Treat 4WD and AWD values as "power to all four wheels" rather than as a statement about the specific system.',
  },
  {
    q: 'Can the decode tell me if the transmission has been replaced?',
    a: 'No. The decode is the build record: what the vehicle left the factory with. A replacement or a swap is not reported to NHTSA. Service records and a physical inspection of the case tag are the only ways to know.',
  },
  {
    q: 'What is the difference between transmission style and transmission speeds?',
    a: 'Style is the type (automatic, manual, CVT, automated manual); speeds is the count of forward gears, which vPIC records as a number such as 6 or 10. A CVT has no fixed speed count, so the Subaru sample returned the style "Continuously Variable Transmission (CVT)" and left speeds blank.',
  },
];

export default function Page() {
  return (
    <ToolPage
      h1="Transmission by VIN"
      path="/transmission-by-vin"
      crumbs={[
        { name: 'VIN decoder', path: '/vin-decoder' },
        { name: 'Transmission by VIN', path: '/transmission-by-vin' },
      ]}
      intro={
        <>
          <p>
            <strong>
              Enter a VIN and NHTSA returns the transmission style and number of speeds the manufacturer filed for it, free. If the
              field comes back blank, the manufacturer did not file it; the VIN is not wrong and the car is not missing a
              transmission.
            </strong>{' '}
            For twelve makes decoded on September 15, 2026, {withStyle.length} returned a transmission style and {withSpeeds.length}{' '}
            returned a speed count. The table below shows which.
          </p>
        </>
      }
      tool={<VinDecodeTool mode="transmission" inputId="vin-trans" buttonLabel="Show the transmission" placeholder={S.ford.vin} />}
      faqs={faqs}
      freeCan={[
        'Transmission style (automatic, manual, CVT) and speed count where the manufacturer filed them with NHTSA.',
        'Drive type (front, rear, 4x2, 4WD/AWD) where filed, and the electrification level for hybrids and EVs.',
        'The rest of the decode: year, make, model, trim, engine, body, plant.',
        'The free CarWorthIt report: open recalls, crash-test ratings and running costs.',
      ]}
      freeCannot={[
        'A transmission the manufacturer did not file: a blank is a blank filing, and the decode cannot invent it.',
        'Whether the transmission was replaced or swapped since the car was built.',
        'The exact transmission model code or fluid specification: that is the service manual or the case tag.',
        'Options and the window sticker: the build record is in the paid report.',
      ]}
      sourceIds={['vpicApi', 'cfr565']}
      nextStep={
        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8">
          <h2 className="text-xl font-bold">If NHTSA has nothing, the build record usually does</h2>
          <p className="mt-2 text-ink-2">
            The CarWorthIt {PRODUCTS.worthit.name} (${PRODUCTS.worthit.price}) is built on the manufacturer&apos;s build record for the
            exact VIN: the transmission as specified, the engine, the sticker price when new, installed options and standard
            equipment. It also includes the local-market valuation at the car&apos;s mileage. Run the VIN free first: the free report
            already shows recalls, safety ratings and running costs.{' '}
            <Link href="/sample-report" className="text-brand underline">
              See a sample
            </Link>
            .
          </p>
        </div>
      }
      related={[
        { href: '/engine-by-vin', label: 'Engine by VIN' },
        { href: '/vin-decoder', label: 'Free VIN decoder' },
        { href: '/window-sticker', label: 'Window sticker by VIN' },
        { href: '/check-warranty-by-vin', label: 'Warranty by VIN' },
      ]}
    >
      <h2>What came back for twelve makes</h2>
      <p>
        One VIN per make, decoded through NHTSA vPIC on September 15, 2026 (public-listing VINs for ten makes; pattern-valid test
        VINs for Subaru and Harley-Davidson). This is the honest picture of how often the transmission is on file.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold">Make (sample vehicle)</th>
              <th className="py-2 pr-4 font-semibold">Transmission style</th>
              <th className="py-2 pr-4 font-semibold">Speeds</th>
              <th className="py-2 font-semibold">Drive type</th>
            </tr>
          </thead>
          <tbody className="text-ink-2">
            {ORDER.map((k) => {
              const f = S[k].fields;
              return (
                <tr key={k} className="border-b border-border">
                  <td className="py-1.5 pr-4 font-semibold text-ink">
                    {NAMES[k]} ({f.ModelYear} {f.Model})
                  </td>
                  <td className="py-1.5 pr-4">{f.TransmissionStyle || <span className="italic">not filed</span>}</td>
                  <td className="py-1.5 pr-4">{f.TransmissionSpeeds || <span className="italic">not filed</span>}</td>
                  <td className="py-1.5">{f.DriveType || <span className="italic">not filed</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2>Why a blank is not an error</h2>
      <p>
        vPIC decodes from the VIN patterns each manufacturer submits under 49 CFR 565. The regulation says what positions 4 to 8
        must make decipherable for a passenger car: line, series, body type, engine type and restraint system. Transmission is not
        on that list, so a maker that does not fold it into the pattern files nothing for it, and NHTSA returns nothing. The
        vehicle still has a transmission, the VIN is still valid, and the decoder above says &quot;not filed with NHTSA by the
        manufacturer&quot; rather than guessing. The same goes for speeds: a CVT has no gear count, and some makers file the style
        without the number.
      </p>

      <h2>Where to look when the field is blank</h2>
      <ul>
        <li>
          <strong>The window sticker.</strong> The Monroney label names the transmission. For Ford, Jeep, Ram, Dodge and Chrysler
          there is a manufacturer lookup; see <Link href="/window-sticker">window sticker by VIN</Link>.
        </li>
        <li>
          <strong>The build record.</strong> The manufacturer&apos;s own record for the VIN, which the paid CarWorthIt report reproduces.
        </li>
        <li>
          <strong>The car.</strong> The transmission case carries a tag or stamping; the service-parts or certification label on some
          makes lists a transmission code.
        </li>
        <li>
          <strong>A dealer.</strong> The parts desk reads the transmission from the VIN in the manufacturer&apos;s system.
        </li>
      </ul>
    </ToolPage>
  );
}
