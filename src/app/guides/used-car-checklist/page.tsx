import type { Metadata } from 'next';
import Article from '@/components/Article';
import VinForm from '@/components/VinForm';

export const metadata: Metadata = {
  title: 'The used-car buying checklist',
  description: 'The exact paperwork, VIN and in-person checks to run before buying a used car in the US.',
};

export default function Page() {
  return (
    <>
      <Article title="The used-car buying checklist" subtitle="Run these before you hand over any money. It takes fifteen minutes and saves thousands.">
        <h2>1. Before you view, check the VIN</h2>
        <ul>
          <li>Confirm the VIN in the listing matches the car and the title.</li>
          <li>Run the VIN for <strong>title brands</strong> (salvage, junk, flood, rebuilt), <strong>theft</strong> and <strong>total-loss</strong> records.</li>
          <li>Check the <strong>odometer history</strong> for any reading lower than an earlier one, a sign of rollback.</li>
          <li>Look up open <strong>safety recalls</strong> and ask if they&apos;ve been fixed.</li>
        </ul>

        <h2>2. The paperwork</h2>
        <ul>
          <li>Title in the seller&apos;s name, matching their ID.</li>
          <li>No <strong>lien</strong> shown, or proof it&apos;s been paid off.</li>
          <li>Service records that line up with the odometer readings.</li>
        </ul>

        <h2>3. In person</h2>
        <ul>
          <li>Cold-start the engine, listen for knocks and watch for smoke.</li>
          <li>Check panel gaps and paint mismatch (signs of past accident repair).</li>
          <li>Look for water lines or musty smells (flood damage).</li>
          <li>Test every electrical item, and take it on a real test drive.</li>
        </ul>

        <h2>4. The number that decides it</h2>
        <p>
          A cheap car with high running costs isn&apos;t cheap. Before you commit, look at the <strong>true cost to own</strong>:
          fuel, insurance, maintenance, repairs and depreciation over five years. It often changes which car is actually
          the better buy.
        </p>

        <h2>Start with the VIN</h2>
        <p>Every check above starts here, decode the car and preview its history free.</p>
      </Article>
      <div className="container-x max-w-3xl pb-14"><VinForm size="md" /></div>
    </>
  );
}
