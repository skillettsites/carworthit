import type { Metadata } from 'next';
import Link from 'next/link';
import VehicleTypePage from '@/components/tools/VehicleTypePage';
import { SITE_URL } from '@/lib/constants';
import { vehicleTypeBySlug } from '@/lib/vin-tools/vehicle-types';

const def = vehicleTypeBySlug('motorcycle-vin-check')!;

export const metadata: Metadata = {
  title: def.metaTitle,
  description: def.metaDescription,
  alternates: { canonical: `${SITE_URL}/${def.slug}` },
};

const faqs = [
  {
    q: 'Does a motorcycle VIN decode the same way as a car VIN?',
    a: 'It is the same 17-character standard (49 CFR 565), decoded from the same NHTSA vPIC database. The regulation says a motorcycle VIN must make decipherable the type of motorcycle, line, engine type and net brake horsepower, and that is what came back for the two test bikes: body class (touring, cruiser), series, engine size, cylinders and horsepower. Transmission and drive type were blank for both.',
  },
  {
    q: 'Where is the VIN on a motorcycle?',
    a: 'On the frame. Harley-Davidson\'s own instruction is that the VIN is stamped on the steering head and repeated on a label on the right front down tube. Federal rule 49 CFR 567.4(e) puts every motorcycle\'s certification label, which carries the VIN, as close as practicable to where the steering post meets the handlebars, so the steering head area is the place to look on any make. The title and registration carry it as well.',
  },
  {
    q: 'What is the 10th character on a motorcycle VIN?',
    a: 'The model-year code, same as cars: A is 2010, B 2011, up to Y for 2030, and 1 to 9 for 2001 to 2009. The 7th-character rule that disambiguates 1980 to 2009 from 2010 to 2039 is written for cars, SUVs and light trucks, so for a bike the decoder above relies on what the manufacturer filed for the pattern.',
  },
  {
    q: 'Does the decode show whether a motorcycle was stolen or salvaged?',
    a: 'No. NICB VINCheck (free) searches participating insurers\' theft, salvage and flood records and NICB says it covers "some motorcycles". NMVTIS reports from approved providers cover title state and brands. The stolen vehicle check and title check pages on this site explain both; CarWorthIt does not sell history.',
  },
  {
    q: 'Can CarWorthIt value a motorcycle?',
    a: 'No. The paid valuation prices cars and light trucks against retail listings; it is not built for motorcycles and we do not sell it as if it were. The decode is free. NHTSA\'s recall feed does list motorcycle campaigns (for a 2017 Harley-Davidson FLHX it returned two when we checked on September 15, 2026), but it files them under factory model codes such as FLHX, so the free report\'s recall lookup, which matches on the decoded model name, can miss them; check nhtsa.gov/recalls or the manufacturer\'s recall page by VIN as well.',
  },
  {
    q: 'Why did the decode return horsepower but not transmission?',
    a: 'Because horsepower is one of the attributes the VIN standard requires a motorcycle VIN to encode, while transmission is not. A blank field is the manufacturer not filing that attribute for the pattern, not a fault in the VIN.',
  },
];

export default function Page() {
  return (
    <VehicleTypePage
      def={def}
      intro={
        <p>
          <strong>
            Enter a 17-character motorcycle VIN to get the make, model, series, model year, engine size, cylinders, horsepower and
            plant that the manufacturer filed with NHTSA, free.
          </strong>{' '}
          For the two bikes we tested on September 15, 2026 (a Harley-Davidson Street Glide and a Honda VT750 Shadow), vPIC returned
          all of those and left transmission and drive type blank. It does not return theft or title records; the free source for
          those is NICB VINCheck.
        </p>
      }
      faqs={faqs}
      freeCan={[
        'Make, model, series, model year, body class (touring, cruiser and so on), engine size, cylinders, horsepower, fuel and plant.',
        'Whether the VIN is valid: 17 characters, no I, O or Q, and the position-9 check digit.',
        'NICB VINCheck (free): theft-and-not-recovered, salvage and flood records from participating insurers, which NICB says include some motorcycles.',
        'NHTSA recall campaigns for the model year and factory model code, at nhtsa.gov/recalls or the manufacturer\'s VIN recall lookup (Harley-Davidson has one).',
      ]}
      freeCannot={[
        'Transmission or final drive (blank for both test bikes).',
        'Options, paint, MSRP or the original window sticker.',
        'Title brands, liens, odometer history or accidents (NMVTIS providers and state agencies).',
        'A CarWorthIt valuation: the paid product prices cars and light trucks, not motorcycles.',
      ]}
      sourceIds={['vpicApi', 'cfr565', 'cfr567', 'harleyRecalls', 'nicbVincheck']}
      related={[
        { href: '/vin-decoder/harley-davidson', label: 'Harley-Davidson VIN decoder' },
        { href: '/atv-vin-lookup', label: 'ATV VIN lookup' },
        { href: '/vin-year-chart', label: 'VIN model year chart' },
        { href: '/stolen-vehicle-check', label: 'Stolen vehicle check' },
      ]}
    >
      <h2>What a motorcycle VIN has to encode</h2>
      <p>
        49 CFR 565.15 sets out what positions 4 to 8 must make decipherable for each vehicle type. For a motorcycle that is the type
        of motorcycle, the line, the engine type and the net brake horsepower, with the regulation adding that the encoded horsepower
        must be within 10 percent of the actual figure. That is why a bike decode reliably returns engine and horsepower while a car
        decode often does not: the standard asks for it.
      </p>

      <h2>Where the VIN is on a motorcycle</h2>
      <p>
        Harley-Davidson tells owners on its recall lookup page: &quot;You can locate your VIN, stamped on the steering head, and also on
        a label located on the right front down tube.&quot; The federal rule (49 CFR 565.13(e)) only requires the VIN to appear clearly
        and indelibly on a part not designed to be removed, or on a permanently affixed plate or label, so other manufacturers choose
        their own spot on the frame; the steering head or neck is the usual one. The certification label rule for motorcycles (49 CFR 567.4(e)) puts the label on a permanent
        member of the bike as close as practicable to where the steering post meets the handlebars, which is why the steering head is
        the place to look. Compare the frame stamping with the title before money changes hands.
      </p>

      <h2>Reading the result</h2>
      <ul>
        <li>
          <strong>Make and manufacturer.</strong> Harley-Davidson decodes with the manufacturer &quot;Harley-Davidson Motor Company&quot;
          and the plant (York, Pennsylvania for the test bike); Honda bikes decode to Honda Motor Co., Ltd. and the Japanese plant.
        </li>
        <li>
          <strong>Series.</strong> The factory model code (FLHX for the Street Glide test bike, VT750C for the Shadow). This is the code
          parts catalogs use.
        </li>
        <li>
          <strong>Engine.</strong> Displacement in liters (1.584 L, which vPIC also gives as 96.7 cubic inches, on the Harley; 0.745 L, or 745 cc, on the Honda),
          cylinders and horsepower as filed.
        </li>
        <li>
          <strong>Blanks.</strong> Transmission and drive were blank for both test bikes. That is a blank filing, not a fault.
        </li>
      </ul>
      <p>
        For a specific make, the <Link href="/vin-decoder/harley-davidson">Harley-Davidson VIN decoder</Link> lists every Harley WMI
        vPIC holds.
      </p>
    </VehicleTypePage>
  );
}
