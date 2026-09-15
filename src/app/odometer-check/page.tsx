import type { Metadata } from 'next';
import Link from 'next/link';
import ToolPage from '@/components/tools/ToolPage';
import VinDecodeTool from '@/components/VinDecodeTool';
import { SITE_URL, PRODUCTS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Odometer Rollback Check by VIN: Rules and Red Flags',
  description:
    'How to check a used car for odometer fraud: the federal odometer statement rule (49 CFR 580), which vehicles are exempt, where mileage history is recorded, and the red flags to check in person. Free VIN decode.',
  alternates: { canonical: `${SITE_URL}/odometer-check` },
};

/*
 * Sources (fetched September 15, 2026):
 * - 49 CFR Part 580 via the eCFR versioner API (580.5 disclosure content and
 *   certification options; 580.8 dealer retention for five years; 580.17
 *   exemptions: GVWR over 16,000 lb, not self-propelled, MY2010 and older
 *   transferred 10+ years after Jan 1 of the model year, MY2011 and newer
 *   transferred 20+ years after).
 * - NMVTIS report contents (odometer readings are one of the five
 *   indicators): vehiclehistory.bja.ojp.gov/nmvtis_understandingvhr
 * - nhtsa.gov/equipment/odometer-fraud returned HTTP 403 to our requests that
 *   day, so NHTSA's consumer-page figures are NOT quoted here.
 */

const faqs = [
  {
    q: 'How can you tell if an odometer has been rolled back?',
    a: 'Compare the reading against every recorded one: the odometer statement on the title from the last sale, the readings in an NMVTIS report (odometer is one of its five indicators), inspection and emissions records, and service invoices. Any later reading that is lower than an earlier one, or a jump that does not fit the car\'s age, is the signal. Then match the reading to the wear: pedals, steering wheel, driver seat bolster, tires and brake wear on a car claiming low miles.',
  },
  {
    q: 'What is the federal odometer statement?',
    a: 'Under 49 CFR 580.5, when ownership transfers the seller must disclose the mileage on the title (or on the reassignment document, or an electronic title), signed, with the seller\'s printed name. The seller must certify that the reading is the actual mileage, or state that it exceeds the odometer\'s mechanical limits, or state that it does not reflect the actual mileage and should not be relied upon, with a warning to the buyer that a discrepancy exists.',
  },
  {
    q: 'Which vehicles are exempt from odometer disclosure?',
    a: 'Under 49 CFR 580.17: vehicles with a GVWR over 16,000 pounds; vehicles that are not self-propelled; model year 2010 and older vehicles transferred at least 10 years after January 1 of their model year; and model year 2011 and newer vehicles transferred at least 20 years after January 1 of their model year. The rule\'s own example: in 2031, model year 2011 and older vehicles are exempt. So a 2012 car sold in 2026 still needs a mileage disclosure.',
  },
  {
    q: 'Can digital odometers be rolled back?',
    a: 'Yes, the display can be altered with the right tools, which is why the recorded history matters more than the dashboard. The title statement from the last transfer, NMVTIS readings and dated service records are what expose a changed display.',
  },
  {
    q: 'Does a VIN decoder show mileage?',
    a: 'No. The VIN is assigned at the factory and encodes what the vehicle is, not what has happened to it. Mileage readings are recorded by states at title transfer and by NMVTIS reporting; the free decode above confirms the vehicle, and the history sources on this page hold the readings.',
  },
  {
    q: 'What should I do if I suspect odometer fraud?',
    a: 'Do not buy the car. If you already have, keep the title with the mileage statement, the sales contract and every record that contradicts it. The odometer statement on the title is a signed federal disclosure, which is what makes a false one actionable; a lawyer or your state attorney general\'s consumer office can advise on the remedy in your state.',
  },
];

export default function Page() {
  return (
    <ToolPage
      h1="Odometer Rollback Check by VIN"
      path="/odometer-check"
      crumbs={[
        { name: 'Calculators', path: '/tools' },
        { name: 'Odometer check', path: '/odometer-check' },
      ]}
      intro={
        <>
          <p>
            <strong>The VIN does not store mileage, but the paperwork behind it does.</strong> Federal rule 49 CFR 580.5 requires the
            seller to disclose the mileage on the title at every transfer and to certify it as actual, over mechanical limits, or not
            actual. An NMVTIS report lists recorded odometer readings; inspection and service records add more. Decode the VIN below
            to confirm the vehicle, then compare every recorded reading against the dashboard and the wear.
          </p>
        </>
      }
      tool={<VinDecodeTool mode="history" inputId="vin-odo" buttonLabel="Decode this VIN free" />}
      faqs={faqs}
      howTo={{
        name: 'How to check a car for odometer fraud',
        description: 'Paper first, then the car.',
        steps: [
          { name: 'Confirm the vehicle', text: 'Decode the VIN above and check it matches the title, the dashboard plate and the door-jamb label.' },
          {
            name: 'Read the last odometer statement',
            text: 'It is on the title from the previous transfer (49 CFR 580.5). Note the reading, the date and which of the three certifications the seller chose.',
          },
          {
            name: 'Pull the recorded readings',
            text: 'An NMVTIS report from an approved provider lists odometer readings as one of its five indicators. Add any state inspection or emissions printouts and dated service invoices the seller has.',
          },
          {
            name: 'Plot them against today',
            text: 'Readings must rise over time. A later reading below an earlier one, or a car that supposedly stopped accruing miles for years, is the signal.',
          },
          {
            name: 'Match the wear',
            text: 'Brake pedal rubber, steering wheel shine, driver seat bolster, tire date codes and brake wear all age with miles. A 40,000-mile car with a worn-through pedal is telling you something.',
          },
        ],
      }}
      freeCan={[
        'The title: the seller\'s signed mileage statement and which certification they chose.',
        'The free decode: confirms the VIN and the vehicle, so the records you pull are for the right car.',
        'Service invoices, inspection and emissions records the seller hands you, each with a dated reading.',
        'Your own eyes: wear versus the claimed miles.',
      ]}
      freeCannot={[
        'The recorded odometer history across owners and states (that is NMVTIS, paid, or a commercial history report).',
        'Whether a digital display was altered: only the recorded history exposes that.',
        'Readings for exempt vehicles: over 16,000 lb GVWR, not self-propelled, or old enough to fall under the 10-year or 20-year rule.',
        'Anything from CarWorthIt: we hold no mileage history and do not sell it.',
      ]}
      sourceIds={['cfr580', 'nmvtisReport', 'nmvtisProviders']}
      nextStep={
        <div className="mt-12 rounded-2xl border-2 border-brand bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8">
          <h2 className="text-xl font-bold">Once the mileage checks out, price it at that mileage</h2>
          <p className="mt-2 text-ink-2">
            Mileage is the biggest single input to a used-car price after the trim. The CarWorthIt {PRODUCTS.valuation.name} (
            ${PRODUCTS.valuation.price}) prices the exact VIN at its verified odometer reading against cars actually for sale near your
            ZIP code, with a verdict on the asking price. Run the VIN free first for open recalls and running costs.{' '}
            <Link href="/check-car-value" className="text-brand underline">
              Check car value
            </Link>
            .
          </p>
        </div>
      }
      related={[
        { href: '/title-check', label: 'Title check: brands and NMVTIS' },
        { href: '/lien-check', label: 'Lien check' },
        { href: '/stolen-vehicle-check', label: 'Stolen vehicle check' },
        { href: '/vin-year-chart', label: 'VIN model year chart' },
      ]}
    >
      <h2>The federal odometer statement rule, in plain terms</h2>
      <p>
        49 CFR Part 580 is the federal odometer disclosure regulation. Section 580.5 says that when a vehicle changes hands the
        transferor (the seller) must disclose the mileage to the transferee (the buyer) on the physical or electronic title, or on the
        document used to reassign the title, signed and with the seller&apos;s printed name. The disclosure has to contain the odometer
        reading (no tenths), the date, both parties&apos; names and addresses, and the vehicle&apos;s make, model, year, body type and
        VIN, plus a statement that failing to complete it or giving false information may result in fines and/or imprisonment.
      </p>
      <p>Then the seller has to pick one of three certifications (580.5(e)):</p>
      <ul>
        <li>the reading reflects the actual mileage;</li>
        <li>the reading exceeds the odometer&apos;s designed mechanical limit (the five-digit rollover); or</li>
        <li>
          the reading does not reflect the actual mileage and should not be relied upon, with a warning notice to the buyer that a
          discrepancy exists.
        </li>
      </ul>
      <p>
        Dealers must keep copies of every odometer statement they issue and receive for five years (580.8). That retention rule is
        why a dealer&apos;s file on a trade-in is worth asking for.
      </p>

      <h2>Which vehicles are exempt</h2>
      <p>Section 580.17 exempts the seller from disclosing mileage for:</p>
      <ul>
        <li>a vehicle with a GVWR over 16,000 pounds;</li>
        <li>a vehicle that is not self-propelled (trailers);</li>
        <li>a model year 2010 or older vehicle transferred at least 10 years after January 1 of its model year;</li>
        <li>a model year 2011 or newer vehicle transferred at least 20 years after January 1 of its model year;</li>
        <li>a new vehicle before its first retail sale, and vehicles sold by the manufacturer to a US government agency.</li>
      </ul>
      <p>
        The regulation&apos;s own examples: for transfers in 2020, model year 2010 and older were exempt; for transfers in 2031, model
        year 2011 and older will be. In practical terms, every model year 2011 or newer vehicle sold today still requires a mileage
        disclosure, and most 2010 and older vehicles do not, which is exactly why older cars are where &quot;exempt&quot; on the title
        replaces a number.
      </p>

      <h2>Where mileage history is recorded</h2>
      <ul>
        <li>
          <strong>Title transfers.</strong> Each sale produces a signed odometer statement. The reading from the last transfer is on the
          title the seller shows you.
        </li>
        <li>
          <strong>NMVTIS.</strong> Odometer reading is one of the five indicators in an NMVTIS vehicle history report, sold by approved
          providers.
        </li>
        <li>
          <strong>State inspection and emissions programs.</strong> Where a state runs them, the printout carries the reading and the
          date.
        </li>
        <li>
          <strong>Service records.</strong> Every invoice and oil-change sticker is a dated reading. Ask for the folder.
        </li>
      </ul>

      <h2>Red flags in person</h2>
      <ul>
        <li>A later recorded reading that is lower than an earlier one, or a multi-year gap with no miles.</li>
        <li>Worn pedal rubber, a polished steering wheel or a collapsed driver seat bolster on a car claiming low miles.</li>
        <li>Tire date codes and brake wear that do not fit the miles (four original tires on a 90,000-mile car is unusual).</li>
        <li>Service stickers or invoices showing a higher reading than the dash.</li>
        <li>A title marked &quot;not actual mileage&quot; or &quot;exceeds mechanical limits&quot; that the seller did not mention.</li>
        <li>A seller who will not show the title until money changes hands.</li>
      </ul>
      <p>
        For what the brand box on the title means, see the <Link href="/title-check">title check</Link>. For the loan that may still be
        attached, see the <Link href="/lien-check">lien check</Link>.
      </p>
    </ToolPage>
  );
}
