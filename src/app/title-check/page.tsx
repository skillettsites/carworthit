import type { Metadata } from 'next';
import Link from 'next/link';
import ToolPage from '@/components/tools/ToolPage';
import VinDecodeTool from '@/components/VinDecodeTool';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Car Title Check by VIN: Free Sources and Brands',
  description:
    'Check a car title by VIN: free NHTSA decode, NICB VINCheck for theft and salvage, then an NMVTIS provider for brands. Title brand table (salvage, rebuilt, flood, lemon, junk, odometer) and what free cannot show.',
  alternates: { canonical: `${SITE_URL}/title-check` },
};

/*
 * Sources (all fetched September 15, 2026):
 * - NICB VINCheck: https://www.nicb.org/vincheck (free; theft-not-recovered, salvage, flood; 5 searches per 24h per IP; insurer records only)
 * - NMVTIS report contents: https://vehiclehistory.bja.ojp.gov/nmvtis_understandingvhr (five indicators)
 * - NMVTIS approved providers: https://vehiclehistory.bja.ojp.gov/nmvtis_vehiclehistory
 * - Brand definitions: TxDMV Title Check "Title Brands & What They Mean" tab, https://www.txdmv.gov/motorists/buying-or-selling-a-vehicle/title-check-look-before-you-buy
 * - Odometer brand and disclosure: 49 CFR 580.5(e) via eCFR
 */

const BRANDS: { brand: string; means: string; value: string }[] = [
  {
    brand: 'Salvage',
    means:
      'Wrecked, destroyed or damaged to the point that the cost of parts and labor to rebuild it exceeds a percentage of its retail value set by the state (TxDMV definition). It can be rebuilt for use again.',
    value: 'Treat it as a project or parts car until it has been rebuilt and passed the state inspection; price it that way.',
  },
  {
    brand: 'Rebuilt (prior salvage)',
    means: 'A previously salvage-branded vehicle that has passed the state\'s anti-theft and safety inspections or other procedures to return to the road.',
    value: 'Pay less than for a clean-title equivalent, ask your insurer before you buy, and expect the brand to follow the car.',
  },
  {
    brand: 'Water damage (flood)',
    means: 'Damaged exclusively by flood water (TxDMV wording).',
    value: 'Electrical and corrosion problems surface for years; treat as a salvage-grade discount.',
  },
  {
    brand: 'Manufacturer buyback / warranty return (lemon)',
    means: 'Returned to the manufacturer under warranty or bought back under a state lemon law.',
    value: 'Ask for the buyback paperwork: the defect that triggered the return matters more than the label.',
  },
  {
    brand: 'Junk',
    means: 'Incapable of safe operation and with no resale value except as parts or scrap, or irreversibly designated as parts or scrap by the owner. "This vehicle shall never be titled or registered."',
    value: 'Zero as a vehicle. Anyone selling a junk-branded car as a runner is committing fraud.',
  },
  {
    brand: 'Odometer (not actual / exceeds mechanical limits)',
    means:
      'The title carries the seller\'s federal odometer statement. Under 49 CFR 580.5(e) the seller must certify the reading is actual, or state that it exceeds mechanical limits, or state that it is NOT the actual mileage and should not be relied upon.',
    value: 'A "not actual mileage" brand removes the mileage from the valuation; price it as a high-mileage car.',
  },
  {
    brand: 'VIN replaced by a state-assigned VIN',
    means: 'The vehicle should be titled under a different VIN (TxDMV note); it does not necessarily indicate a problem.',
    value: 'Research the correct VIN before paying; a mismatched VIN blocks registration.',
  },
];

const faqs = [
  {
    q: 'Can I check a car title for free?',
    a: 'Partly. The NHTSA decode above is free and confirms the year, make, model and trim behind the VIN. NICB VINCheck is free and searches participating insurers for vehicles reported stolen and not recovered, or reported as salvage or flood-damaged; it allows five searches per 24 hours per IP address. Neither shows the current state of title or the full brand history. For that you need an NMVTIS-approved provider, which charges, or a title record request from the state that issued the title.',
  },
  {
    q: 'What does an NMVTIS title check show?',
    a: 'Exactly five things, by the program\'s own description: the current state of title and last title date, brand history applied by any state, odometer readings, total loss history and salvage history. It does not include accident or repair history. A clean NMVTIS report is described by the program as "a GOOD thing".',
  },
  {
    q: 'Which title brands matter most to a buyer?',
    a: 'Junk (never to be titled again), salvage (a total loss that can be rebuilt), rebuilt (a salvage car that passed inspection), water damage and a "not actual mileage" odometer brand. A manufacturer buyback brand means a lemon-law return. The table on this page gives the state definitions for each.',
  },
  {
    q: 'Does a VIN decoder show if a title is clean?',
    a: 'No. A decoder reads the manufacturer\'s build record for the VIN: what the vehicle is, where it was built, its engine and body. Title status is recorded by state titling agencies after the sale, so it sits in NMVTIS and state records, not in the VIN itself.',
  },
  {
    q: 'How do I check the title in person?',
    a: 'Ask to see the physical or electronic title. Confirm the VIN on it matches the dashboard VIN and the door-jamb certification label, that the seller\'s name is the owner on the title, that any lienholder box is empty or released, and read the brand and odometer boxes. If the seller cannot produce the title, walk away.',
  },
  {
    q: 'Does CarWorthIt sell a title check?',
    a: 'No. CarWorthIt is not an NMVTIS-approved provider and does not sell vehicle history. This page exists to route you to the free and official sources. What CarWorthIt sells is a valuation of the exact VIN at its mileage and ZIP code from $2.99, and the factory build record from $6.99.',
  },
  {
    q: 'What does a state DMV title record add?',
    a: 'The NMVTIS FAQ says a complete copy of a specific state title record comes from the current state titling agency, and approved providers must give customers a route to that state. A state record can show the current lienholder and the exact brand wording, which the NMVTIS summary may not.',
  },
];

export default function Page() {
  return (
    <ToolPage
      h1="Car Title Check by VIN"
      path="/title-check"
      crumbs={[
        { name: 'Calculators', path: '/tools' },
        { name: 'Title check', path: '/title-check' },
      ]}
      intro={
        <>
          <p>
            <strong>Three steps, two of them free.</strong> Decode the VIN below (free, NHTSA data) to confirm the vehicle. Run it through{' '}
            <a href="https://www.nicb.org/vincheck" target="_blank" rel="nofollow noopener">
              NICB VINCheck
            </a>{' '}
            (free, five searches a day) for theft, salvage and flood records from insurers. Then, for the current state of title and every
            brand any state has applied, buy an NMVTIS report from an{' '}
            <a href="https://vehiclehistory.bja.ojp.gov/nmvtis_vehiclehistory" target="_blank" rel="nofollow noopener">
              approved provider
            </a>
            . No free source shows the title itself.
          </p>
        </>
      }
      tool={<VinDecodeTool mode="history" inputId="vin-title" buttonLabel="Decode this VIN free" />}
      faqs={faqs}
      howTo={{
        name: 'How to check a car title status',
        description: 'The order that costs the least and catches the most.',
        steps: [
          { name: 'Decode the VIN', text: 'Confirm the year, make, model and trim match the listing and the car in front of you. A mismatch ends the conversation.' },
          {
            name: 'Run NICB VINCheck',
            text: 'Free. It returns theft-and-not-recovered, salvage and flood records from participating NICB member insurers, which represent 92.49% of US earned premium. It does not query law enforcement records and is not a full history report.',
          },
          {
            name: 'Buy an NMVTIS report',
            text: 'From a US Department of Justice approved provider. It shows the current state of title, brand history from every state, odometer readings, total loss and salvage history. Texas DMV says provider prices "begin at only a couple dollars".',
          },
          {
            name: 'Read the physical title',
            text: 'VIN matches, seller is the titled owner, lienholder released, brand box, odometer statement. Then request the state title record if anything looks off.',
          },
        ],
      }}
      freeCan={[
        'The free NHTSA decode: year, make, model, trim, body, engine, plant, and whether the VIN itself is valid.',
        'NICB VINCheck: reported stolen and not recovered, reported salvage or flood by participating insurers.',
        'The title document in the seller\'s hand: owner name, lienholder, brand box, odometer statement.',
        'The free CarWorthIt report: open recalls, crash-test ratings, running costs.',
      ]}
      freeCannot={[
        'The current state of title, or brands applied by states (that is NMVTIS, paid).',
        'Records of insurers that do not participate in VINCheck, or any law enforcement record.',
        'Accident and repair history (not in NMVTIS either; only commercial history reports carry some of it).',
        'Anything CarWorthIt sells: we are not an NMVTIS provider and do not sell history.',
      ]}
      sourceIds={['nicbVincheck', 'nmvtisReport', 'nmvtisProviders', 'nmvtisFaq', 'txdmvBrands', 'cfr580']}
      related={[
        { href: '/lien-check', label: 'Lien check: is money still owed on it?' },
        { href: '/stolen-vehicle-check', label: 'Stolen vehicle check' },
        { href: '/odometer-check', label: 'Odometer rollback check' },
        { href: '/vin-decoder', label: 'Free VIN decoder' },
      ]}
    >
      <h2>Title brands and what each one means</h2>
      <p>
        Brands are labels a state titling agency applies to a title. NMVTIS keeps the history of brands applied by any state, so a car
        that was salvage-titled in one state and re-titled clean in another still shows the brand. The definitions below are the ones
        Texas DMV publishes with its NMVTIS title check; the brand set is the national NMVTIS one.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold">Brand</th>
              <th className="py-2 pr-4 font-semibold">What it means</th>
              <th className="py-2 font-semibold">What it does to the deal</th>
            </tr>
          </thead>
          <tbody>
            {BRANDS.map((b) => (
              <tr key={b.brand} className="border-b border-border align-top">
                <td className="py-2 pr-4 font-semibold text-ink">{b.brand}</td>
                <td className="py-2 pr-4">{b.means}</td>
                <td className="py-2">{b.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>What NICB VINCheck covers, in NICB&apos;s words</h2>
      <p>
        VINCheck &quot;allows you to enter a vehicle identification number (VIN) to instantly learn whether the vehicle has been reported
        as stolen but not recovered or reported as a salvage or flood-damaged vehicle by participating NICB member insurance
        companies.&quot; It is free, limited to five searches per 24 hours per IP address, and NICB is explicit that it &quot;does not
        query law enforcement records&quot; and &quot;is not a comprehensive vehicle history report&quot;. Use it as a fast, free filter,
        not as the last word.
      </p>

      <h2>What an NMVTIS report shows, and what it leaves out</h2>
      <p>
        The National Motor Vehicle Title Information System is the US Department of Justice database that state titling agencies,
        insurers and salvage yards are required to report into. Its consumer report is deliberately short: current state of title and
        last title date, brand history, odometer reading, total loss history and salvage history. It does not contain repair history,
        and the NMVTIS FAQ says so. You buy it from an approved provider, never from NMVTIS directly; the public providers listed on
        September 15, 2026 were Bumper, Carsforsale, Carvertical, Checkthatvin, Clearvin, EpicVin, GoodCar, Titlecheck.us, VinAudit,
        VinData, VinReport and VinSmart. Carfax appears on the list only as a commercial provider, for California.
      </p>

      <h2>Reading the title itself</h2>
      <ul>
        <li>
          <strong>VIN match.</strong> The 17 characters on the title must match the dashboard plate (visible through the windshield at
          the driver-side pillar) and the certification label in the driver door jamb. Both locations are federal requirements.
        </li>
        <li>
          <strong>Owner and lienholder.</strong> The seller should be the titled owner. A lienholder still listed means the loan may be
          open; see the <Link href="/lien-check">lien check</Link>.
        </li>
        <li>
          <strong>Brand box.</strong> Salvage, rebuilt, flood, junk or buyback printed on the face of the title.
        </li>
        <li>
          <strong>Odometer statement.</strong> Federal law requires the seller to certify the reading as actual, exceeding mechanical
          limits, or not actual. See the <Link href="/odometer-check">odometer check</Link> for the exemptions.
        </li>
      </ul>
    </ToolPage>
  );
}
