import type { Metadata } from 'next';
import Link from 'next/link';
import ToolPage from '@/components/tools/ToolPage';
import VinDecodeTool from '@/components/VinDecodeTool';
import YearCodeTable from '@/components/tools/YearCodeTable';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Classic Car VIN Decoder (Pre-1981 Explained)',
  description:
    'Classic car VIN decoder: 1981 and newer VINs decode free with NHTSA data. Pre-1981 serial numbers are not 17 characters and NHTSA cannot decode them; here is what to do instead, and the 1980 to 2030 year chart.',
  alternates: { canonical: `${SITE_URL}/classic-car-vin-decoder` },
};

/*
 * Sources (fetched September 15, 2026):
 * - vpic.nhtsa.dot.gov: "vPIC is intended for use on Model Years 1981 and
 *   forward. Vehicles prior to 1980's VIN standard are not included in
 *   decoding capability for the system." NHTSA's decoder page also shows the
 *   message "Invalid Year Submitted - Pre-1981 Year Decode Attempt".
 * - 49 CFR 565.13 (17 characters, check digit) and 565.15 Table XIII (1980 =
 *   A onward) via the eCFR.
 * - NICB VINCheck page for theft and salvage coverage.
 */

const faqs = [
  {
    q: 'Can a classic car VIN be decoded?',
    a: 'Only if it is a 17-character VIN, which means model year 1981 or later. NHTSA says on the vPIC site that it "is intended for use on Model Years 1981 and forward" and that vehicles built before the VIN standard "are not included in decoding capability for the system". A 1981 to 1990s car decodes exactly like a new one, with whatever the manufacturer filed; a pre-1981 serial number will not.',
  },
  {
    q: 'Why is my 1970s car\'s VIN not 17 characters?',
    a: 'Because before the 1981 model year there was no federal 17-character format; each manufacturer used its own serial-number scheme, of its own length, encoding the plant, series and body in its own way. The 17-character standard with a check digit in position 9 is 49 CFR 565, and the position-10 year code table begins with A for 1980.',
  },
  {
    q: 'How do I decode a pre-1981 VIN then?',
    a: 'With the manufacturer\'s own serial-number scheme for that era. The reliable routes are the maker\'s own archive or heritage service where one exists, a marque club\'s decoding guide, or a factory build sheet or dealer invoice if one survived with the car. The trim tag, cowl tag or door plate carries the codes the serial number does not.',
  },
  {
    q: 'What does the decoder show for a 1980s or 1990s classic?',
    a: 'What the manufacturer filed with NHTSA for that pattern, which for older vehicles is often less than for a new one: year, make, model and plant are usually present; engine, body and trim may be. A blank field means the manufacturer did not file that attribute, not that NHTSA lost it.',
  },
  {
    q: 'Can I check a classic car for theft or a salvage title?',
    a: 'NICB VINCheck (free) needs "a correct 17-digit VIN" to match, so it works for 1981 and newer classics and not for earlier serial numbers. NMVTIS reports cover titled vehicles by VIN as well. For a pre-1981 car, the title, the state\'s title record and the matching of every number on the car to the paperwork are the checks.',
  },
  {
    q: 'What is a "state-assigned VIN" on an old car?',
    a: 'A replacement identifier a state issues when the original is missing, illegible or the car was built from parts. The NMVTIS brand "VIN replaced by a new state-assigned VIN" exists for exactly this. It does not decode, and it means the title history under the original number and the new number have to be reconciled before you buy.',
  },
];

export default function Page() {
  return (
    <ToolPage
      h1="Classic Car VIN Decoder"
      path="/classic-car-vin-decoder"
      crumbs={[
        { name: 'VIN decoder', path: '/vin-decoder' },
        { name: 'Classic car', path: '/classic-car-vin-decoder' },
      ]}
      intro={
        <>
          <p>
            <strong>
              A classic with a 17-character VIN (model year 1981 or later) decodes free below. A pre-1981 serial number does not: it
              is not 17 characters, and NHTSA says its decoder is &quot;intended for use on Model Years 1981 and forward&quot;.
            </strong>{' '}
            For an older car, the manufacturer&apos;s own serial-number scheme, its archive service and the trim or cowl tag on the car
            are the decoders. This page covers both cases and the 1980 to 2030 model-year chart.
          </p>
        </>
      }
      tool={<VinDecodeTool mode="year" inputId="vin-classic" placeholder="1G1YY2384M5100001" buttonLabel="Decode this VIN free" />}
      faqs={faqs}
      howTo={{
        name: 'How to identify a classic car by its number',
        description: 'Which number you have decides which route works.',
        steps: [
          { name: 'Count the characters', text: 'Seventeen with no I, O or Q: it is a post-1980 VIN, decode it above. Fewer: it is a pre-1981 manufacturer serial number.' },
          {
            name: 'For 17 characters, read the decode and the 10th character',
            text: 'The decoder resolves the model year. B is 1981, C 1982 and so on; the same letters repeat from 2010, and for cars the 7th character (digit for 1980 to 2009, letter for 2010 onward) settles which cycle.',
          },
          {
            name: 'For a serial number, go to the maker',
            text: 'Use the manufacturer\'s heritage or archive service, or a marque club decoding guide for that make and year. Photograph the serial plate, the trim or cowl tag and the engine stamping; those carry what the serial number does not.',
          },
          {
            name: 'Match every number to the paperwork',
            text: 'Serial plate, tags, engine stamping and title must agree. On a pre-1981 car this physical comparison is the theft and identity check, because VINCheck needs a 17-character VIN.',
          },
        ],
      }}
      freeCan={[
        '1981 and newer: year, make, model, plant and whatever else the manufacturer filed, from NHTSA vPIC.',
        'Any VIN: a check that it is 17 characters, uses only allowed characters and has a correct check digit.',
        'The model-year code table for 1980 to 2039 from 49 CFR 565.15.',
        '1981 and newer: NICB VINCheck (free) for theft, salvage and flood records from participating insurers.',
      ]}
      freeCannot={[
        'Decode any pre-1981 serial number: NHTSA does not hold those schemes.',
        'Tell you the original engine, color or options of a classic: that is the trim tag, build sheet or maker\'s archive.',
        'Run VINCheck on a serial number shorter than 17 characters.',
        'Value a classic: CarWorthIt\'s paid valuation is built on current retail listings and is not an appraisal for collector cars.',
      ]}
      sourceIds={['vpic', 'cfr565', 'nicbVincheck', 'txdmvBrands']}
      nextStep={
        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8">
          <h2 className="text-xl font-bold">Where CarWorthIt stops on a classic</h2>
          <p className="mt-2 text-ink-2">
            The decode is free for any 1981-or-later VIN. CarWorthIt&apos;s paid valuation prices a VIN against cars currently listed for
            sale nearby, which works for a ten-year-old sedan and does not work for a collector car whose value is set by originality,
            provenance and auction results. We would rather tell you that than sell you a number. For a classic, an appraiser who
            knows the marque is the right spend.
          </p>
        </div>
      }
      related={[
        { href: '/vin-year-chart', label: 'VIN model year chart 1980 to 2030' },
        { href: '/vin-decoder', label: 'Free VIN decoder (any make)' },
        { href: '/title-check', label: 'Title check' },
        { href: '/stolen-vehicle-check', label: 'Stolen vehicle check' },
      ]}
    >
      <h2>The 1981 line</h2>
      <p>
        The 17-character VIN is federal regulation 49 CFR 565: every VIN must be 17 characters (565.13(b)), carry a check digit in
        position 9 (565.13(c)), use only the letters A to Z minus I, O and Q plus the digits 0 to 9 (565.13(g)), and encode the model
        year in position 10 from a table that starts with A for 1980 (565.15). NHTSA&apos;s vPIC decoder is built on the patterns
        manufacturers file under that regulation, which is why its own site says it is &quot;intended for use on Model Years 1981 and
        forward&quot; and that earlier vehicles &quot;are not included in decoding capability for the system&quot;. Type a 1979 serial
        number into it and NHTSA&apos;s page answers &quot;Pre-1981 Year Decode Attempt&quot;.
      </p>

      <h2>Decoding a pre-1981 serial number</h2>
      <p>
        Before 1981 each manufacturer had its own scheme, and the same position could mean different things at Ford, GM and Chrysler,
        or at the same maker in different decades. There is no federal database of those schemes, so the sources are:
      </p>
      <ul>
        <li>
          <strong>The manufacturer&apos;s archive or heritage service.</strong> Where a maker offers one, it can produce a build record
          from its own files. Check the manufacturer&apos;s site for whether the service exists and what it costs, rather than a third party.
        </li>
        <li>
          <strong>Marque clubs and registries.</strong> Owner clubs publish decoding guides for their make and era, position by
          position.
        </li>
        <li>
          <strong>The car&apos;s own tags.</strong> The trim tag, cowl tag, body plate or door plate carries the body style, paint and
          trim codes; the engine and transmission stampings carry the date and plant codes. These are what an appraiser reads.
        </li>
        <li>
          <strong>Surviving paperwork.</strong> A build sheet, dealer invoice or original warranty card ties the serial number to the
          original specification.
        </li>
      </ul>

      <h2>1981 to 2030: the model-year code</h2>
      <p>
        For anything with a 17-character VIN, the 10th character is the model year. The codes are from 49 CFR 565.15 and repeat every
        30 years, so the decoder uses the 7th character to tell 1981 from 2011 on cars, SUVs and light trucks. The full chart is on the{' '}
        <Link href="/vin-year-chart">VIN year chart</Link>; the classic-relevant slice is below.
      </p>
      <YearCodeTable from={1980} to={2009} compact />

      <h2>Checking a classic&apos;s identity and history</h2>
      <p>
        For a 1981-or-later classic, the same free checks as any used car apply: decode the VIN, run NICB VINCheck (it needs a correct
        17-character VIN to match), and buy an NMVTIS report from an approved provider for the title state and brands. For a pre-1981
        car none of the VIN databases can help, so the checks are physical and documentary: the serial plate, every tag and stamping,
        and the title must agree, and a state-assigned VIN on the title means the original identity was lost at some point and needs
        explaining. The <Link href="/title-check">title check</Link> page covers the brands that can appear on any title.
      </p>
    </ToolPage>
  );
}
