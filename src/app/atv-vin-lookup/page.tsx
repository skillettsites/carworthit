import type { Metadata } from 'next';
import Link from 'next/link';
import VehicleTypePage from '@/components/tools/VehicleTypePage';
import { SITE_URL } from '@/lib/constants';
import { vehicleTypeBySlug } from '@/lib/vin-tools/vehicle-types';

const def = vehicleTypeBySlug('atv-vin-lookup')!;

export const metadata: Metadata = {
  title: def.metaTitle,
  description: def.metaDescription,
  alternates: { canonical: `${SITE_URL}/${def.slug}` },
};

const faqs = [
  {
    q: 'Why does an ATV VIN decode as a motorcycle?',
    a: 'Because NHTSA files ATVs and side-by-sides under the vehicle type MOTORCYCLE in vPIC. All three test VINs (Polaris, Can-Am, Yamaha) came back with that type. The decoder above expects it and will not flag it as a mismatch.',
  },
  {
    q: 'What does an ATV VIN lookup actually return?',
    a: 'Less than a car or a road bike. For the three test VINs vPIC returned the make, model year, plant and GVWR class every time; a trim for the Can-Am (XT/XT-P); a transmission style ("Motorcycle - Chain Drive Off-Road") and drive type for the Polaris; and fuel for the Yamaha. None of the three returned a model name, displacement or horsepower. All three carried NHTSA error 14, "unable to provide information for some of the characters in the VIN, based on the manufacturer submission", which is vPIC saying the manufacturer filed a thin pattern; the Polaris VIN also carried error 5.',
  },
  {
    q: 'Where is the VIN on an ATV or UTV?',
    a: 'On the frame, on a certification label and usually a stamping. The federal certification-label rule for motorcycles (49 CFR 567.4(e)) puts the label as close as practicable to where the steering post meets the handlebars; on a side-by-side with a steering wheel the label is wherever the maker chose. Check the owner\'s manual for the exact spot and compare it with the title or bill of sale.',
  },
  {
    q: 'Do ATVs have titles?',
    a: 'That is a state matter and the rules differ from state to state. A VIN check on this page cannot tell you whether a given ATV is titled; ask the titling agency in the state where it is kept. NICB VINCheck covers "vehicles insured in the United States, plus some motorcycles and watercraft", so an insured ATV may appear in its theft and salvage records.',
  },
  {
    q: 'Why did my Polaris VIN come back with error 5?',
    a: 'Error 5 means "VIN has errors in few positions": one or more characters do not match any pattern the manufacturer filed. vPIC shows which positions and the values it would accept. Re-read the VIN on the frame; if it is correct, the manufacturer\'s filing simply does not cover that pattern and the decode is as complete as it will get.',
  },
  {
    q: 'Can CarWorthIt value an ATV?',
    a: 'No. The paid valuation prices cars and light trucks against retail listings and has no powersports data, so we do not offer it for ATVs. The decode above is free and that is the honest limit of what this page does.',
  },
];

export default function Page() {
  return (
    <VehicleTypePage
      def={def}
      intro={
        <p>
          <strong>
            An ATV VIN lookup returns less than a car VIN: for the Polaris, Can-Am and Yamaha VINs we tested on September 15, 2026,
            NHTSA returned the make, model year, plant and weight class every time, but no model name, displacement or horsepower for
            any of them.
          </strong>{' '}
          vPIC files ATVs and side-by-sides as motorcycles, and all three decodes carried NHTSA&apos;s error 14, which means the
          manufacturer filed a thin pattern. Enter your VIN below to see exactly what came back for yours; the table further down shows
          what to expect.
        </p>
      }
      faqs={faqs}
      freeCan={[
        'Make, model year, plant and GVWR class (returned for all three test VINs).',
        'Sometimes a trim (Can-Am XT/XT-P), a transmission style and drive type (Polaris), or fuel (Yamaha).',
        'Whether the VIN is valid: 17 characters and a correct check digit, plus NHTSA\'s note on which positions it could not read.',
        'NICB VINCheck (free) for theft, salvage and flood records on insured vehicles.',
      ]}
      freeCannot={[
        'Model name, displacement or horsepower (blank for all three test VINs).',
        'Options, color or the original price.',
        'Whether your state titles ATVs, or the title status itself (ask the state agency; NMVTIS covers titled vehicles).',
        'A CarWorthIt valuation: the paid product prices cars and light trucks, not powersports.',
      ]}
      sourceIds={['vpicApi', 'cfr565', 'cfr567', 'nicbVincheck']}
      related={[
        { href: '/motorcycle-vin-check', label: 'Motorcycle VIN check' },
        { href: '/trailer-vin-lookup', label: 'Trailer VIN lookup' },
        { href: '/vin-year-chart', label: 'VIN model year chart' },
        { href: '/stolen-vehicle-check', label: 'Stolen vehicle check' },
      ]}
    >
      <h2>Why the decode is thin</h2>
      <p>
        vPIC decodes from the patterns each manufacturer files with NHTSA under 49 CFR 565. The VIN standard requires a motorcycle
        VIN to make decipherable the type, line, engine type and net brake horsepower, and road bikes generally return all of that.
        The three ATV patterns we tested did not: NHTSA answered with error 14 for all three and listed the unused positions (4, 6, 7 and 8 for the
        Polaris; 7 for the Can-Am; 5, 6 and 7 for the Yamaha), which is its way of saying the manufacturer&apos;s submission does not
        describe those characters. That leaves make, year, plant and weight class as the reliable fields.
      </p>

      <h2>What to do with a thin decode</h2>
      <ul>
        <li>
          <strong>Confirm the year and make</strong> against the title, registration or bill of sale. That much the decode does well.
        </li>
        <li>
          <strong>Get the model from the machine.</strong> The model and engine are on the manufacturer&apos;s labels and in the owner&apos;s
          manual, not in NHTSA&apos;s record.
        </li>
        <li>
          <strong>Run NICB VINCheck</strong> if the ATV was insured; it is free and covers theft, salvage and flood records from
          participating insurers.
        </li>
        <li>
          <strong>Ask the state</strong> whether it titles ATVs. Where it does, an NMVTIS report from an approved provider covers the
          title state and brands; where it does not, there is no title to check and the bill of sale is the ownership document.
        </li>
      </ul>
      <p>
        Road motorcycles decode far more fully; see the <Link href="/motorcycle-vin-check">motorcycle VIN check</Link> for what a Harley
        or Honda returns.
      </p>
    </VehicleTypePage>
  );
}
