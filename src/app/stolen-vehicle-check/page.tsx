import type { Metadata } from 'next';
import Link from 'next/link';
import ToolPage from '@/components/tools/ToolPage';
import VinDecodeTool from '@/components/VinDecodeTool';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Stolen Vehicle Check by VIN (Free, NICB VINCheck)',
  description:
    'Check if a car is stolen by VIN: NICB VINCheck is free and searches insurer theft records (five searches a day). What it covers, what it misses, why no state portal was verifiable, and what to do if a VIN hits.',
  alternates: { canonical: `${SITE_URL}/stolen-vehicle-check` },
};

/*
 * Sources (fetched September 15, 2026):
 * - NICB VINCheck page, quoted directly: https://www.nicb.org/vincheck
 * - NMVTIS report description and providers (vehiclehistory.bja.ojp.gov)
 * - 49 CFR 565.13 and 567.4 for the two VIN locations that must agree.
 * - State portals: the home pages of 43 state police or public-safety
 *   agencies and 49 state titling agencies were fetched and every link
 *   mentioning "stolen", "theft" or "vehicle check" was read. None led to a
 *   public stolen-vehicle VIN search. The Florida, New York, Michigan,
 *   Illinois, Massachusetts, Maryland, Iowa, Arizona, Utah, Alaska, Montana,
 *   New Hampshire, New Mexico, Rhode Island and South Carolina sites blocked
 *   the requests, so nothing is claimed for those states either way.
 */

const faqs = [
  {
    q: 'How do I check if a car is stolen for free?',
    a: 'Run the VIN through NICB VINCheck at nicb.org/vincheck. It is free, allows five searches per 24 hours per IP address, and returns whether participating insurers have reported the vehicle stolen and not recovered, or reported it as salvage or flood-damaged. It also accepts a photo of the VIN plate. A clean result is not a guarantee, and NICB says so on the page.',
  },
  {
    q: 'Does NICB VINCheck search police records?',
    a: 'No. In NICB\'s own words, "VINCheck does not query law enforcement records or records of insurance companies that elect not to participate in VINCheck." It is built from the theft and salvage records of member insurers, which NICB says represent 92.49% of US earned insurance premium. A car stolen from an owner with no comprehensive coverage, or insured by a non-member, may not appear.',
  },
  {
    q: 'Is there a state stolen-vehicle lookup I can use?',
    a: 'We could not verify one. On September 15, 2026 we opened the sites of 43 state police or public-safety agencies and 49 titling agencies and followed every link about theft or stolen vehicles; none led to a public VIN search, and fifteen state sites blocked automated requests entirely. Law enforcement theft records are queried by officers, so the practical route for a buyer is VINCheck first, then the police if you have reason to suspect a specific vehicle.',
  },
  {
    q: 'What if the VIN comes back with a theft record?',
    a: 'Do not buy it and do not confront the seller. Note the listing, the seller\'s details and the VIN, and report it to your local police department; if the vehicle is on a lot, the state agency that licenses dealers also wants to know. Buying a stolen vehicle, even unknowingly, usually means losing both the car and the money when it is recovered for the owner or insurer.',
  },
  {
    q: 'How do thieves hide a stolen car\'s identity?',
    a: 'By fitting a VIN plate and door-jamb label from a wrecked vehicle of the same model ("VIN cloning"), so the paperwork matches a legitimately titled car. The defense is to compare every VIN location: the dashboard plate at the driver-side windshield pillar (required by 49 CFR 565.13), the certification label on the driver door hinge pillar or latch post (49 CFR 567.4), the title, and any VIN stamped or labeled elsewhere on the vehicle. Mismatched fonts, rivets that look disturbed, or a label that sits on fresh paint are the tells.',
  },
  {
    q: 'Does the CarWorthIt decode show theft?',
    a: 'No. The decode reads the manufacturer\'s build record for the VIN and confirms the vehicle is what the seller says. Theft records sit with insurers (VINCheck) and law enforcement. CarWorthIt does not sell vehicle history and is not an NMVTIS provider; it is here to route you to the right free source and, once the car checks out, to price it.',
  },
];

export default function Page() {
  return (
    <ToolPage
      h1="Stolen Vehicle Check by VIN"
      path="/stolen-vehicle-check"
      crumbs={[
        { name: 'Calculators', path: '/tools' },
        { name: 'Stolen vehicle check', path: '/stolen-vehicle-check' },
      ]}
      intro={
        <>
          <p>
            <strong>
              The free check is{' '}
              <a href="https://www.nicb.org/vincheck" target="_blank" rel="nofollow noopener">
                NICB VINCheck
              </a>
              : five searches a day, insurer theft and salvage records, no account.
            </strong>{' '}
            It does not search police records, and we could not verify a single public state stolen-vehicle portal on September 15,
            2026. Decode the VIN below first, so the VIN you are checking is a real one that matches the car, then run VINCheck, then
            compare every VIN location on the vehicle.
          </p>
        </>
      }
      tool={<VinDecodeTool mode="history" inputId="vin-stolen" buttonLabel="Decode this VIN free" />}
      faqs={faqs}
      howTo={{
        name: 'How to check whether a vehicle is stolen',
        description: 'Four steps, all free, in order.',
        steps: [
          { name: 'Decode the VIN', text: 'A VIN that will not decode, or decodes to a different year, make or model than the car in front of you, is the first red flag.' },
          {
            name: 'Run NICB VINCheck',
            text: 'Enter the VIN or photograph the plate at nicb.org/vincheck. It reports theft-and-not-recovered, salvage and flood records from participating insurers. Five searches per 24 hours per IP address.',
          },
          {
            name: 'Compare every VIN location',
            text: 'Dashboard plate at the driver-side windshield pillar, certification label in the driver door jamb, the title and registration. All must match exactly, and the plate and label must look factory-fitted.',
          },
          {
            name: 'Involve the police if anything hits',
            text: 'A VINCheck theft record, a VIN that will not decode, or plates and labels that do not match: report it to local police with the listing and the seller\'s details rather than confronting the seller.',
          },
        ],
      }}
      freeCan={[
        'NICB VINCheck: reported stolen and not recovered, salvage or flood, from participating NICB member insurers.',
        'The free decode: proves the VIN is real and what vehicle it belongs to.',
        'Your inspection: dashboard plate, door-jamb label, title and registration all carrying the same 17 characters.',
        'The free CarWorthIt report: open recalls, crash-test ratings and running costs.',
      ]}
      freeCannot={[
        'Law enforcement theft records (VINCheck does not query them; the public cannot).',
        'Records of insurers that do not participate in VINCheck, or thefts never claimed on insurance.',
        'A state stolen-vehicle portal: none could be verified on September 15, 2026.',
        'Anything from CarWorthIt: we hold no theft data and do not sell history.',
      ]}
      sourceIds={['nicbVincheck', 'nmvtisReport', 'cfr565', 'cfr567']}
      related={[
        { href: '/title-check', label: 'Title check: brands and NMVTIS' },
        { href: '/lien-check', label: 'Lien check' },
        { href: '/odometer-check', label: 'Odometer rollback check' },
        { href: '/vin-decoder', label: 'Free VIN decoder' },
      ]}
    >
      <h2>NICB VINCheck, explained</h2>
      <p>
        The National Insurance Crime Bureau is funded by insurers, and VINCheck is built from their claims records. NICB describes it
        this way: it lets you &quot;instantly learn whether the vehicle has been reported as stolen but not recovered or reported as a
        salvage or flood-damaged vehicle by participating NICB member insurance companies.&quot; The member companies represent 92.49% of
        US earned insurance premium (NICB&apos;s figure, with an asterisk on its page). It covers vehicles insured in the United States,
        plus some motorcycles and watercraft. You can type the VIN or upload a photo of the plate, and you get five searches per 24
        hours per IP address.
      </p>
      <p>
        The limits are stated on the same page and worth repeating: &quot;VINCheck does not query law enforcement records or records of
        insurance companies that elect not to participate.&quot; &quot;It is not a comprehensive vehicle history report and should not be
        relied upon when purchasing a vehicle.&quot; A stolen car whose owner never made a claim, or whose insurer is not a member, can
        come back clean. Treat a hit as decisive and a clean result as one check passed.
      </p>

      <h2>State stolen-vehicle portals: what we found</h2>
      <p>
        The plan for this page was a table of state lookup portals. We built the table by opening each agency&apos;s own site rather
        than copying other websites&apos; lists, and it came back empty. On September 15, 2026 we fetched the home pages of 43 state
        police or department of public safety sites and 49 state titling agencies and followed every link whose text or address
        mentioned stolen vehicles, theft or a vehicle check. What those links led to was theft-prevention advice (Arizona&apos;s vehicle
        theft task force, Maryland&apos;s vehicle theft prevention council, Louisiana&apos;s insurance fraud and auto theft unit), scrap-metal
        registries, identity-theft pages and press releases. None was a public VIN search. Fifteen state sites (including Florida, New
        York, Michigan, Illinois, Massachusetts, Maryland, Arizona and Utah) refused automated requests, so for those states we say
        nothing either way rather than guess.
      </p>
      <p>
        If a state does offer one, its titling agency or state police will say so on its own site; that is the only source worth
        trusting for a claim like this. Until then, VINCheck plus a physical VIN comparison is the buyer&apos;s toolkit, and the police
        are the route when something looks wrong.
      </p>

      <h2>The physical VIN check</h2>
      <p>
        Federal rules fix where the VIN must be. For passenger cars, SUVs and trucks up to 10,000 lb GVWR, 49 CFR 565.13(f) requires
        the VIN inside the passenger compartment, readable from outside through the glass by someone standing at the driver-side
        windshield pillar, in characters at least 4 mm tall. 49 CFR 567.4 requires the certification label, which carries the VIN
        and the date of manufacture, on the driver door&apos;s hinge pillar, latch post or door edge (trailers and motorcycles are
        excepted). Compare both against the title. Then look at how they are fitted: rivets, fonts and label edges on a factory
        plate are uniform, and a label on paint that is fresher than the surrounding jamb is a label that was moved.
      </p>

      <h2>If the VIN hits</h2>
      <ul>
        <li>Walk away. Do not pay a deposit &quot;to hold it&quot; while you check.</li>
        <li>Keep the listing, photos, the VIN and the seller&apos;s contact details.</li>
        <li>Report it to your local police department. If the seller is a licensed dealer, the state agency that licenses dealers also takes complaints.</li>
        <li>If you already bought it, contact the police and your insurer immediately; a recovered stolen vehicle goes back to its owner or the insurer that paid the claim.</li>
      </ul>
      <p>
        Once a car passes, the question changes from &quot;is it real&quot; to &quot;is it worth the asking price&quot;.{' '}
        <Link href="/check-car-value">Check what it is worth at its mileage near you</Link>.
      </p>
    </ToolPage>
  );
}
