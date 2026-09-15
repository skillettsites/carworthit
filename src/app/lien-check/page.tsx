import type { Metadata } from 'next';
import Link from 'next/link';
import ToolPage from '@/components/tools/ToolPage';
import VinDecodeTool from '@/components/VinDecodeTool';
import { SITE_URL } from '@/lib/constants';
import { LIEN_LOOKUPS } from '@/lib/vin-tools/state-lookups';

export const metadata: Metadata = {
  title: 'Car Lien Check by VIN: Free Routes, State Lookups',
  description:
    'How to check if a car has a lien: read the title, ask the lender for a payoff letter, request the state title record, and which state DMVs offer an online lien lookup (verified September 15, 2026). What a history report can and cannot show.',
  alternates: { canonical: `${SITE_URL}/lien-check` },
};

/*
 * Sources (fetched September 15, 2026): the state pages listed in
 * src/lib/vin-tools/state-lookups.ts, the NMVTIS report description
 * (vehiclehistory.bja.ojp.gov/nmvtis_understandingvhr) and NMVTIS FAQ
 * (state title records come from the titling agency). NMVTIS's five
 * indicators do not include liens, which is why this page routes lien
 * questions to the title and the state, not to a history report.
 */

const faqs = [
  {
    q: 'How do I check if a car has a lien on it for free?',
    a: 'Read the title: the lienholder is printed on it, and in states with electronic lien and title (ELT) programs the lender holds the title until the loan is paid, so a seller who cannot produce a title often still has a loan. Then ask the seller for the lender\'s payoff letter. Wisconsin offers a free online lien holder search by VIN; most other states require a title record request, which usually carries a small fee, and some restrict lien inquiries to lenders.',
  },
  {
    q: 'Does a vehicle history report show liens?',
    a: 'An NMVTIS report does not: by the program\'s own description it covers the current state of title and last title date, brand history, odometer readings, total loss history and salvage history. Some commercial history reports include a lien or loan indicator from lender data, but the state title record is the only authoritative source, and even that is only as current as the lender\'s last filing.',
  },
  {
    q: 'What happens if I buy a car with a lien on it?',
    a: 'The lender\'s security interest stays with the car. You may be unable to get a title in your name, and if the previous owner stops paying, the lender can repossess the vehicle from you. The fix is to never pay the seller in full while a lienholder is still listed.',
  },
  {
    q: 'How do I buy a car that still has a loan on it?',
    a: 'Get the payoff amount and the lender\'s payoff address in writing from the lender, not the seller. Pay the lender directly (or meet the seller at the lender\'s branch), get the lien release or the title with the lien signed off, and pay the seller only the difference. If the payoff exceeds the price, the seller has to bring cash to the table before the lien can clear.',
  },
  {
    q: 'What is an electronic lien and title (ELT)?',
    a: 'A system in which the state holds the title electronically and the lender holds the record until the loan is paid, instead of a paper title with a lienholder box. Wisconsin, Nebraska, Texas, Pennsylvania, Tennessee and Virginia all describe ELT programs on their DMV sites (checked September 15, 2026). In an ELT state the owner does not have a paper title while the loan is open, so "I lost the title" needs a follow-up question.',
  },
  {
    q: 'Can CarWorthIt check for a lien?',
    a: 'No. The free decode above reads the NHTSA build record for the VIN and nothing else. CarWorthIt does not sell vehicle history and is not an NMVTIS provider. Use the title, the lender and the state routes on this page; use CarWorthIt afterwards to see what the car is worth at its mileage near you.',
  },
];

export default function Page() {
  return (
    <ToolPage
      h1="Car Lien Check by VIN"
      path="/lien-check"
      crumbs={[
        { name: 'Calculators', path: '/tools' },
        { name: 'Lien check', path: '/lien-check' },
      ]}
      intro={
        <>
          <p>
            <strong>A lien is a lender&apos;s claim on the car, and it is recorded on the title, not in the VIN.</strong> The free ways to
            check are to read the title (the lienholder is printed on it), ask the lender for a payoff letter, and request the title
            record from the state that issued it. Only one state we could verify, Wisconsin, offers a free public online lien lookup by
            VIN; the rest are listed below with what they charge. Decode the VIN first to be sure the title you are shown belongs to
            the car.
          </p>
        </>
      }
      tool={<VinDecodeTool mode="history" inputId="vin-lien" buttonLabel="Decode this VIN free" />}
      faqs={faqs}
      howTo={{
        name: 'How to check a used car for a lien',
        description: 'Four checks, in the order that catches the most for the least money.',
        steps: [
          { name: 'Match the VIN', text: 'Decode it above, then confirm the title, the dashboard plate and the door-jamb label all carry the same 17 characters.' },
          {
            name: 'Read the lienholder box on the title',
            text: 'A named lienholder with no release stamp or letter means money may still be owed. In an ELT state the lender holds the title until payoff, so no title usually means an open loan.',
          },
          {
            name: 'Get the payoff letter from the lender',
            text: 'Ask the seller for the lender\'s name and account, then get the payoff figure and payoff address directly from the lender. Pay the lender, not the seller, for that amount.',
          },
          {
            name: 'Request the state title record if in doubt',
            text: 'The NMVTIS FAQ says a complete copy of a state title record comes from the current titling agency. Wisconsin\'s lien holder search is free online; Wyoming charges $15 by mail; California charges $2 online for your own vehicle and $5 by mail for someone else\'s.',
          },
        ],
      }}
      freeCan={[
        'The title: owner, lienholder, brand box, odometer statement.',
        'The lender: a payoff letter with the exact amount and where to send it.',
        'Wisconsin DMV: a free online lien holder search by VIN (who received the title and the lender\'s name and address).',
        'The free decode: confirms the VIN is real and matches the paperwork.',
      ]}
      freeCannot={[
        'Liens in most states without a title record request and, usually, a fee.',
        'Liens from an NMVTIS report: NMVTIS covers title state, brands, odometer, total loss and salvage, not loans.',
        'A lien recorded after the record you are looking at was pulled.',
        'Anything from CarWorthIt: we hold no lien data and do not sell history.',
      ]}
      sourceIds={['nmvtisReport', 'nmvtisFaq', 'wisconsinLien', 'nebraskaLien', 'californiaRecords', 'wyomingTitleSearch', 'mississippiTitle', 'connecticutLien', 'texasTitleCheck']}
      related={[
        { href: '/title-check', label: 'Title check: brands and NMVTIS' },
        { href: '/stolen-vehicle-check', label: 'Stolen vehicle check' },
        { href: '/odometer-check', label: 'Odometer rollback check' },
        { href: '/check-car-value', label: 'What is it worth at this mileage?' },
      ]}
    >
      <h2>How a car lien works</h2>
      <p>
        When a car is financed, the lender records a security interest with the state titling agency and is listed on the title as
        the lienholder. In paper-title states the owner holds a title with the lender named on it; in electronic lien and title
        states the lender holds the title record until the loan is paid, and the owner gets a confirmation of ownership instead
        (Wisconsin describes exactly this for liens listed on or after July 30, 2012). Either way, the lien follows the car, not the
        borrower: if you pay a private seller in full and the loan is never cleared, the lender can still repossess the car from you.
      </p>

      <h2>The free routes</h2>
      <ul>
        <li>
          <strong>The title.</strong> The lienholder box is the record. A release letter from the lender, or a lien release stamped
          on the title, is what clears it. No title in an ELT state means the lender still holds it.
        </li>
        <li>
          <strong>The lender letter.</strong> Ask the seller which lender and get the payoff amount and payoff address from the lender
          in writing. Pay the lender directly; the seller gets the remainder.
        </li>
        <li>
          <strong>The state title record.</strong> The titling agency holds the current lien filing. Some states expose it online,
          most sell it as a record request, and a few restrict lien inquiries to lenders.
        </li>
      </ul>

      <h2>What a vehicle history report shows about liens</h2>
      <p>
        An NMVTIS report shows five things: current state of title and last title date, brand history, odometer reading, total loss
        history and salvage history. Liens are not one of them. Commercial history reports sometimes include a loan or lien
        indicator, but treat it as a prompt to check the title, not as proof either way. The title record from the state is the
        authoritative source.
      </p>

      <h2>State lien and title lookups we could verify</h2>
      <p>
        Every row below was verified by opening the agency&apos;s own page on September 15, 2026. Many state DMV sites (Florida, New
        York, Michigan, Illinois, Massachusetts, Maryland, Iowa, Arizona, Utah and others) refused our requests that day, so they are
        not listed; that means &quot;not verified&quot;, not &quot;no lookup exists&quot;. Ask that state&apos;s titling agency for a
        title record request.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-semibold">State</th>
              <th className="py-2 pr-4 font-semibold">What it offers</th>
              <th className="py-2 pr-4 font-semibold">Cost</th>
              <th className="py-2 font-semibold">Public, online</th>
            </tr>
          </thead>
          <tbody>
            {LIEN_LOOKUPS.map((r) => (
              <tr key={r.state} className="border-b border-border align-top">
                <td className="py-2 pr-4 font-semibold text-ink">
                  <a href={r.url} target="_blank" rel="nofollow noopener">
                    {r.state}
                  </a>
                </td>
                <td className="py-2 pr-4">
                  {r.what}
                  {r.note ? ` ${r.note}` : ''}
                </td>
                <td className="py-2 pr-4">{r.cost}</td>
                <td className="py-2">
                  {r.publicAccess ? 'Public' : 'Restricted'}, {r.online ? 'online' : 'by mail'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Buying a car that still has a loan on it</h2>
      <p>
        It is common and it is safe if the money goes to the lender. Get the payoff figure from the lender, pay it to the lender (a
        cashier&apos;s check at the branch, or the lender&apos;s payoff address), collect the lien release or the released title, and pay
        the seller only the difference. If the loan is bigger than the price, the seller has to fund the gap before the lien can be
        released. Never hand a private seller the full price on a promise to clear the loan afterwards.
      </p>
      <p>
        Once the lien question is settled, the remaining question is price.{' '}
        <Link href="/check-car-value">Check what this VIN is worth at its mileage near you</Link>.
      </p>
    </ToolPage>
  );
}
