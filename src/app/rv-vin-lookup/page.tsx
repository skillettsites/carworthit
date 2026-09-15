import type { Metadata } from 'next';
import Link from 'next/link';
import VehicleTypePage from '@/components/tools/VehicleTypePage';
import { SITE_URL } from '@/lib/constants';
import { vehicleTypeBySlug } from '@/lib/vin-tools/vehicle-types';

const def = vehicleTypeBySlug('rv-vin-lookup')!;

export const metadata: Metadata = {
  title: def.metaTitle,
  description: def.metaDescription,
  alternates: { canonical: `${SITE_URL}/${def.slug}` },
};

const faqs = [
  {
    q: 'Why does my motorhome VIN decode as Ford, Freightliner or Mercedes-Benz?',
    a: 'Because a motorhome is built in two stages and the VIN belongs to the first one. 49 CFR 565.13 says a vehicle manufactured in more than one stage gets its VIN from the incomplete vehicle manufacturer, meaning the chassis maker. For our test VINs vPIC returned "Incomplete - Motor Home Chassis" for a Freightliner and "Motorhome Chassis" for a Ford, with each chassis maker\'s engine and GVWR class, and nothing about the coach.',
  },
  {
    q: 'Does an RV VIN lookup show the coach builder and floor plan?',
    a: 'Not from NHTSA. The coach builder (Winnebago, Tiffin, Thor and so on), the floor plan, the length and the house systems are not in the chassis VIN pattern. They are on the coach builder\'s own data plate and final-stage certification label on the finished motorhome, not in NHTSA\'s VIN record. Towable RVs are different: their VIN is the trailer builder\'s, so a travel trailer decodes to Forest River, Keystone, Jayco or Grand Design with a length and axle count; see the trailer VIN lookup.',
  },
  {
    q: 'What is the "Incomplete Vehicle Warning" NHTSA adds?',
    a: 'vPIC attaches it to every chassis decode: "Please be advised that the vehicle may have been altered and may not be an accurate representation of the vehicle in its current condition." It is NHTSA saying what this page says: the decode describes the chassis as it left the first factory, not the motorhome that was built on it.',
  },
  {
    q: 'Does the decode show the engine in a motorhome?',
    a: 'Usually, because the engine is part of the chassis. The Freightliner test VIN returned a 7.2 L six-cylinder Caterpillar diesel; the Ford chassis returned a 6.8 L V10 gasoline engine with 362 horsepower. The Sprinter chassis cab returned a 3.0 L six-cylinder diesel. Transmission was blank for all three.',
  },
  {
    q: 'Can I check an RV for theft or a salvage title?',
    a: 'NICB VINCheck (free) covers vehicles insured in the United States, so a motorhome with a comprehensive policy can appear in its theft, salvage and flood records; NMVTIS reports cover the title state and brands. Neither comes from CarWorthIt, which does not sell history. The stolen vehicle check and title check pages explain both.',
  },
  {
    q: 'Can CarWorthIt value an RV?',
    a: 'No. The paid valuation is built on retail listings of cars and light trucks; it has no motorhome or trailer market data and we do not sell it for RVs. The decode is free and that is where this page stops.',
  },
];

export default function Page() {
  return (
    <VehicleTypePage
      def={def}
      intro={
        <p>
          <strong>
            A motorhome VIN decodes to its chassis, not its coach: enter it below and NHTSA returns the chassis maker (Ford,
            Freightliner, Mercedes-Benz and others), model year, engine and GVWR class, free.
          </strong>{' '}
          That is because the VIN is assigned by the incomplete-vehicle manufacturer under 49 CFR 565.13. For the three chassis VINs we
          tested on September 15, 2026 (Freightliner, Ford and a Mercedes-Benz Sprinter chassis cab), vPIC returned the engine size
          for all three and left the coach builder, floor plan and length blank for all three. Towable RVs decode differently: their VIN belongs to the trailer builder.
        </p>
      }
      faqs={faqs}
      freeCan={[
        'Chassis maker, chassis model, model year, body class ("Incomplete - Motor Home Chassis" or "Stripped Chassis"), engine, fuel, drive and GVWR class.',
        'The plant that built the chassis (Gaffney, South Carolina; Detroit, Michigan; Ludwigsfelde, Germany for the three test VINs).',
        'NICB VINCheck (free): theft, salvage and flood records for vehicles insured in the US.',
        'For towables: the trailer builder, body type, length and axles (see the trailer VIN lookup).',
      ]}
      freeCannot={[
        'The coach builder, model line, floor plan, length or house systems (not in the chassis VIN).',
        'Transmission (blank for all three test chassis).',
        'Title brands, liens, odometer history or accidents (NMVTIS providers and state agencies).',
        'A CarWorthIt valuation: the paid product prices cars and light trucks, not RVs.',
      ]}
      sourceIds={['vpicApi', 'cfr565', 'nicbVincheck']}
      related={[
        { href: '/trailer-vin-lookup', label: 'Trailer VIN lookup (towable RVs)' },
        { href: '/vin-decoder/ford', label: 'Ford VIN decoder' },
        { href: '/engine-by-vin', label: 'Engine by VIN' },
        { href: '/title-check', label: 'Title check' },
      ]}
    >
      <h2>Why the chassis owns the VIN</h2>
      <p>
        49 CFR 565.13(a): &quot;Each vehicle manufactured in more than one stage shall have a VIN assigned by the incomplete vehicle
        manufacturer.&quot; A Class A or Class C motorhome starts life as a stripped or cutaway chassis from Ford, Freightliner Custom
        Chassis, Mercedes-Benz or another chassis maker, and that maker assigns the VIN before the coach builder ever sees it. So
        NHTSA&apos;s record for the VIN is the chassis record: the maker, the engine, the GVWR class and the chassis plant. The coach is
        a second stage that NHTSA files under the coach builder&apos;s own certification, not under the VIN pattern.
      </p>

      <h2>What you will see, and what you will not</h2>
      <ul>
        <li>
          <strong>Make.</strong> The chassis maker. A Ford stripped chassis decodes as Ford even when the manufacturer field reads
          Detroit Chassis LLC, the plant that assembles it.
        </li>
        <li>
          <strong>Model.</strong> The chassis model (&quot;XC Chassis&quot;, &quot;Motorhome Chassis&quot;), not the coach model.
        </li>
        <li>
          <strong>Engine and GVWR.</strong> Present for all three test chassis: the 7.2 L Caterpillar diesel in the Freightliner, the 6.8 L
          V10 in the Ford and the 3.0 L six-cylinder diesel in the Sprinter, with GVWR classes of 26,001 to 33,000 lb, 19,501 to 26,000 lb and 10,001 to 14,000 lb respectively.
        </li>
        <li>
          <strong>Coach data.</strong> Absent. Look for the coach builder&apos;s data plate and the final-stage certification label, which 49 CFR 567
          requires the final-stage manufacturer to add to the finished vehicle.
        </li>
      </ul>

      <h2>Towable RVs are the other way around</h2>
      <p>
        A travel trailer or fifth wheel has no chassis maker in the motorhome sense; the trailer builder assigns the VIN. Those decode
        to the builder (Forest River, Keystone, Jayco, Grand Design in our tests) with the trailer body type, length and axle count,
        and no engine. The <Link href="/trailer-vin-lookup">trailer VIN lookup</Link> shows exactly what came back for four of them.
      </p>
    </VehicleTypePage>
  );
}
