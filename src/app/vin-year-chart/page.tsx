import type { Metadata } from 'next';
import Link from 'next/link';
import ToolPage from '@/components/tools/ToolPage';
import VinDecodeTool from '@/components/VinDecodeTool';
import YearCodeTable from '@/components/tools/YearCodeTable';
import { SITE_URL } from '@/lib/constants';
import { MAKES } from '@/lib/vin-tools/makes';

export const metadata: Metadata = {
  title: 'VIN Year Chart: 10th Character Codes 1980 to 2030',
  description:
    'VIN model year chart from 49 CFR 565: every 10th-character code from 1980 (A) to 2030 (Y), the 7th-character rule that separates 1985 from 2015, and where the VIN is on each make. Free decoder resolves it.',
  alternates: { canonical: `${SITE_URL}/vin-year-chart` },
};

/*
 * Sources (fetched September 15, 2026 via the eCFR versioner API):
 * 49 CFR 565.15(d) Table XIII (1980 A to 2013 D) and Table VII (2005 to 2039)
 * with its note on position 7. VIN placement: 49 CFR 565.13(f); door label:
 * 49 CFR 567.4(c), (d) trailers, (e) motorcycles. Harley-Davidson location
 * from harley-davidson.com/us/en/tools/service-recalls.html.
 */

const faqs = [
  {
    q: 'Which character of the VIN is the year?',
    a: 'The 10th. Under 49 CFR 565.15 it is a single letter or digit: A for 1980, B for 1981 and so on to Y for 2000, then 1 to 9 for 2001 to 2009, then the cycle repeats with A for 2010 through Y for 2030 and 1 to 9 for 2031 to 2039. The letters I, O, Q, U and Z and the digit 0 are never used.',
  },
  {
    q: 'How do I tell a 1985 VIN from a 2015 VIN if both use F?',
    a: 'By the 7th character. The note to Table VII in 49 CFR 565.15 says that for passenger cars, and for SUVs and trucks of 10,000 lb GVWR or less, a numeric 7th character means the 10th character refers to 1980 to 2009, and an alphabetic 7th character means 2010 to 2039. The decoder on this page applies that rule; for heavier vehicles, trailers and motorcycles the rule is not defined, and NHTSA resolves the year from the manufacturer\'s pattern.',
  },
  {
    q: 'Is the 10th character the build date?',
    a: 'No, it is the model year, which the manufacturer designates and which can run ahead of the calendar: a car built in late 2019 can carry a 2020 code. The month and year of manufacture are on the certification label in the driver door jamb (49 CFR 567.4(g)(2)).',
  },
  {
    q: 'Why does 2010 start over at A?',
    a: 'Because the 1980 cycle ran out of usable characters after 9 in 2009. Rather than extend the alphabet, the regulation reused the same 30 codes and added the 7th-character rule to keep the two cycles apart. That is why 49 CFR 565.13(d) says VINs of vehicles built within a 30-year period must not be identical.',
  },
  {
    q: 'What year code does a 2026 vehicle have?',
    a: 'T. From Table VII: S is 2025, T is 2026, V is 2027, W is 2028, X is 2029 and Y is 2030.',
  },
  {
    q: 'Do older cars have a year code?',
    a: 'Only from the 1981 model year, when the 17-character VIN with a check digit became mandatory. Pre-1981 serial numbers use each manufacturer\'s own scheme and do not have a standard year position; the classic car VIN decoder page covers what to do with those.',
  },
];

const VIN_LOCATIONS = MAKES.map((m) => ({
  make: m.name,
  slug: m.slug,
  text:
    m.kind === 'motorcycle'
      ? 'Stamped on the steering head, and on a label on the right front down tube (Harley-Davidson). The certification label for any motorcycle sits as close as practicable to where the steering post meets the handlebars (49 CFR 567.4(e)).'
      : 'Dashboard plate at the base of the windshield, driver side, readable from outside (49 CFR 565.13(f)); certification label at the driver door hinge pillar, latch post or door edge (49 CFR 567.4(c)); title, registration and insurance card.',
}));

export default function Page() {
  return (
    <ToolPage
      h1="VIN Year Chart: the 10th Character, 1980 to 2030"
      path="/vin-year-chart"
      crumbs={[
        { name: 'VIN decoder', path: '/vin-decoder' },
        { name: 'VIN year chart', path: '/vin-year-chart' },
      ]}
      intro={
        <>
          <p>
            <strong>
              The 10th character of a VIN is the model year: A is 1980 or 2010, B is 1981 or 2011, through Y for 2000 or 2030, with 1
              to 9 covering 2001 to 2009 and 2031 to 2039.
            </strong>{' '}
            The codes come from 49 CFR 565.15 (Table XIII for 1980 to 2013, Table VII for 2005 to 2039), read on the eCFR on September
            15, 2026. For cars, SUVs and light trucks a numeric 7th character means the earlier cycle and a letter means 2010 onward.
            Paste a VIN below and the decoder resolves it; the full chart follows.
          </p>
        </>
      }
      tool={<VinDecodeTool mode="year" inputId="vin-year" buttonLabel="Find the model year" />}
      faqs={faqs}
      freeCan={[
        'The model year, from the 10th character and the 7th-character rule, for any 1981-or-later VIN.',
        'NHTSA\'s own model year for the VIN, which applies the manufacturer\'s pattern (the decoder shows both).',
        'The month and year of manufacture: on the certification label in the door jamb, not in the VIN.',
        'Where the VIN is on the vehicle, by make, from the federal placement rules.',
      ]}
      freeCannot={[
        'A year for a pre-1981 serial number: there is no standard position.',
        'The build date from the VIN alone: the 10th character is the model year.',
        'Resolve the 1980-to-2009 versus 2010-to-2039 cycle by rule for heavy trucks, trailers or motorcycles: NHTSA uses the manufacturer\'s pattern instead.',
        'Anything about the vehicle\'s history: a decode is the build record only.',
      ]}
      sourceIds={['cfr565', 'cfr567', 'vpic', 'harleyRecalls']}
      related={[
        { href: '/vin-decoder', label: 'Free VIN decoder' },
        { href: '/classic-car-vin-decoder', label: 'Classic car VIN decoder (pre-1981)' },
        { href: '/guides/what-is-a-vin', label: 'What is a VIN and where do I find it?' },
        { href: '/engine-by-vin', label: 'Engine by VIN' },
      ]}
    >
      <h2>The full chart, 1980 to 2039</h2>
      <p>
        Both columns use the same code. The left column is the 1980 cycle (Table XIII), the right column the 2010 cycle (Table VII).
        For passenger cars, SUVs and trucks up to 10,000 lb GVWR, read the left column when the 7th character of the VIN is a digit
        and the right column when it is a letter.
      </p>
      <YearCodeTable from={1980} to={2039} />

      <h2>The 7th-character rule, exactly as written</h2>
      <p>
        Note to Table VII, 49 CFR 565.15: &quot;For passenger cars, and for multipurpose passenger vehicles and trucks with a gross
        vehicle weight rating of 4536 kg (10,000 lb) or less, if position 7 is numeric, the Model Year in position 10 of the VIN
        refers to a year in the range 1980-2009. If position 7 is alphabetic, the Model Year in Position 10 of the VIN refers to a
        year in the range 2010-2039.&quot; The same regulation requires that VINs of any two vehicles built within a 30-year period
        are never identical, which is what makes the shared codes safe.
      </p>

      <h2>Where the VIN is, by make</h2>
      <p>
        The placement is federal, not brand-specific: 49 CFR 565.13(f) puts the VIN of every passenger car, SUV and light truck
        inside the passenger compartment where it can be read through the glass from the driver-side windshield pillar, and 49 CFR
        567.4 puts the certification label (which repeats the VIN) at the driver door hinge pillar, latch post or door edge. Trailers
        carry the label on the forward half of the left side (567.4(d)); motorcycles near the steering head (567.4(e)). The per-make
        decoders below list each make&apos;s WMI codes.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold">Make</th>
              <th className="py-2 font-semibold">Where to find the VIN</th>
            </tr>
          </thead>
          <tbody className="text-ink-2">
            {VIN_LOCATIONS.map((r) => (
              <tr key={r.slug} className="border-b border-border align-top">
                <td className="py-1.5 pr-4 font-semibold text-ink">
                  <Link href={`/vin-decoder/${r.slug}`}>{r.make}</Link>
                </td>
                <td className="py-1.5">{r.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Worked examples from real decodes</h2>
      <ul>
        <li>
          <strong>1HGCM82633A004352</strong>: 10th character 3, 7th character 2 (numeric), so 2003. NHTSA agrees: a 2003 Honda Accord.
        </li>
        <li>
          <strong>1FTEW1EG1JFE44843</strong>: 10th character J, 7th character E (alphabetic), so 2018. NHTSA: 2018 Ford F-150.
        </li>
        <li>
          <strong>2HGFE2F53PH521585</strong>: 10th character P, 7th character F, so 2023. NHTSA: 2023 Honda Civic.
        </li>
        <li>
          <strong>1HD1KB4157Y675236</strong> (a motorcycle): 10th character 7, so 2007; the 7th-character rule does not apply to
          motorcycles, and NHTSA resolves 2007 from Harley-Davidson&apos;s pattern.
        </li>
      </ul>
    </ToolPage>
  );
}
