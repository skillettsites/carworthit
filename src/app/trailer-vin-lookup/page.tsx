import type { Metadata } from 'next';
import Link from 'next/link';
import VehicleTypePage from '@/components/tools/VehicleTypePage';
import { SITE_URL } from '@/lib/constants';
import { vehicleTypeBySlug } from '@/lib/vin-tools/vehicle-types';

const def = vehicleTypeBySlug('trailer-vin-lookup')!;

export const metadata: Metadata = {
  title: def.metaTitle,
  description: def.metaDescription,
  alternates: { canonical: `${SITE_URL}/${def.slug}` },
};

const faqs = [
  {
    q: 'What does a trailer VIN lookup show?',
    a: 'What 49 CFR 565.15 requires a trailer VIN to make decipherable: the type of trailer, body type, length and axle configuration, plus the manufacturer, model year and plant. For the four camping trailers we decoded (Forest River, Keystone, Grand Design, Jayco), vPIC returned the body type "Camping or Travel Trailer", a length in feet, two axles, and for three of them the hitch type (bumper pull or ball hitch). No engine, and no GVWR.',
  },
  {
    q: 'Why is there no GVWR in a trailer decode?',
    a: 'Because the VIN standard does not ask trailers to encode it. vPIC left GVWR blank for all four test trailers. The rated weight is on the trailer\'s certification label: 49 CFR 567.4 requires that label to carry the GVWR, the month and year of manufacture and the VIN, fixed to the forward half of the left side of the trailer.',
  },
  {
    q: 'Why does the decode say only "Keystone" or "Jayco" for the model?',
    a: 'Because those builders filed the model line at the brand level rather than by floor plan. Forest River returned "Salem Towables" and Grand Design returned the "Imagine" series, so it varies by manufacturer. The floor plan and options are on the builder\'s own label, not in NHTSA\'s record.',
  },
  {
    q: 'Where is the VIN on a trailer?',
    a: 'On the certification label, which 49 CFR 567.4(d) requires on the forward half of the left side of the trailer, readable from outside without moving anything. Builders may also stamp it on the frame near the tongue. The title and registration carry the same 17 characters.',
  },
  {
    q: 'Do utility, boat and cargo trailers decode too?',
    a: 'If they carry a 17-character VIN from a manufacturer that files patterns with NHTSA, yes, with the same fields. Very small builders have six-character WMIs (positions 1 to 3 plus 12 to 14) and may file thin patterns, so expect fewer fields. A homemade trailer with a state-assigned VIN will not decode.',
  },
  {
    q: 'Can I check a trailer for theft or a salvage title?',
    a: 'NICB VINCheck (free) searches participating insurers\' theft, salvage and flood records; NMVTIS reports cover title state and brands. CarWorthIt does not sell history and cannot value a trailer; the stolen vehicle check and title check pages explain the free routes.',
  },
];

export default function Page() {
  return (
    <VehicleTypePage
      def={def}
      intro={
        <p>
          <strong>
            Enter a 17-character trailer VIN to get the builder, model year, trailer type, body type, length and number of axles that
            the manufacturer filed with NHTSA, free.
          </strong>{' '}
          For four camping trailers we decoded on September 15, 2026 (Forest River, Keystone, Grand Design and Jayco), vPIC returned
          all of those and left GVWR blank on every one. A trailer decode has no engine because the VIN standard only asks trailers to
          encode type, body, length and axles.
        </p>
      }
      faqs={faqs}
      freeCan={[
        'Builder, model year, body class (Trailer), trailer body type (for example Camping or Travel Trailer), length in feet, axle count and plant.',
        'The hitch type where filed (Bumper Pull or Ball Hitch for three of four test trailers).',
        'Whether the VIN is valid: 17 characters and a correct check digit.',
        'NICB VINCheck (free): theft, salvage and flood records from participating insurers.',
      ]}
      freeCannot={[
        'GVWR or axle ratings (blank for all four test trailers; read the certification label on the trailer).',
        'Floor plan, options or the builder\'s model line where the builder filed only its brand name.',
        'Title brands, liens or theft (NMVTIS providers, state agencies, NICB).',
        'A CarWorthIt valuation: the paid product prices cars and light trucks, not trailers.',
      ]}
      sourceIds={['vpicApi', 'cfr565', 'cfr567', 'nicbVincheck']}
      related={[
        { href: '/rv-vin-lookup', label: 'RV VIN lookup (motorhomes)' },
        { href: '/vin-year-chart', label: 'VIN model year chart' },
        { href: '/title-check', label: 'Title check' },
        { href: '/stolen-vehicle-check', label: 'Stolen vehicle check' },
      ]}
    >
      <h2>What a trailer VIN has to encode</h2>
      <p>
        49 CFR 565.15 Table VIII lists, for &quot;Trailer, including trailer kits and incomplete trailer&quot;, the attributes positions
        4 to 8 must make decipherable: type of trailer, body type, length and axle configuration. That is the whole list, which is why a
        trailer decode is short. The GVWR is not in it; it is on the certification label the builder must fix to the forward half of the left side of the trailer
        under 49 CFR 567.4, along with the VIN and the month and year of manufacture.
      </p>

      <h2>Reading the four test decodes</h2>
      <ul>
        <li>
          <strong>Length</strong> came back as 32, 29, 37 and 35.99 (feet). Treat it as the builder&apos;s filed figure, not a tape
          measure.
        </li>
        <li>
          <strong>Axles</strong> came back as 2 for all four.
        </li>
        <li>
          <strong>Trailer type</strong> (the hitch) came back as Bumper Pull for Keystone and Jayco and Ball Hitch for Grand Design;
          Forest River left it blank.
        </li>
        <li>
          <strong>Model</strong> is wherever the builder put it: a model line for Forest River (Salem Towables), a series for Grand
          Design (Imagine), and just the brand name for Keystone and Jayco.
        </li>
      </ul>

      <h2>Motorhomes are the opposite case</h2>
      <p>
        A towable&apos;s VIN belongs to the trailer builder, so the decode names the builder. A motorhome&apos;s VIN belongs to the chassis
        maker (Ford, Freightliner, Mercedes-Benz), so its decode names the chassis and says nothing about the coach. The{' '}
        <Link href="/rv-vin-lookup">RV VIN lookup</Link> shows that side.
      </p>
    </VehicleTypePage>
  );
}
