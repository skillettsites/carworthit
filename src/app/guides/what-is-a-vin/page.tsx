import type { Metadata } from 'next';
import Link from 'next/link';
import Article from '@/components/Article';
import VinForm from '@/components/VinForm';

export const metadata: Metadata = {
  title: 'What is a VIN and where do I find it?',
  description: 'A VIN is the 17-character code that identifies a specific vehicle. Here is what each part means and the five places you can find it.',
};

export default function Page() {
  return (
    <>
      <Article
        title="What is a VIN and where do I find it?"
        subtitle="The Vehicle Identification Number is the single most useful thing you can get from a seller, it unlocks the car’s entire recorded history."
      >
        <p>
          A <strong>VIN (Vehicle Identification Number)</strong> is a unique 17-character code stamped on every car built
          since 1981. No two vehicles share one. Because it&apos;s tied to that exact car, it&apos;s the key that lets you
          pull title records, salvage brands, odometer readings and recalls.
        </p>

        <h2>Where to find the VIN</h2>
        <ul>
          <li><strong>The listing</strong>, reputable sellers and dealers include it. If they won&apos;t share it, that&apos;s a red flag.</li>
          <li><strong>The windshield</strong>, lower corner on the driver&apos;s side, visible from outside.</li>
          <li><strong>The driver&apos;s door jamb</strong>, on a sticker where the door latches.</li>
          <li><strong>The title and registration</strong>, printed on the paperwork.</li>
          <li><strong>Insurance documents</strong>, usually listed on the policy.</li>
        </ul>

        <h2>What the 17 characters mean</h2>
        <ul>
          <li><strong>Characters 1-3 (WMI)</strong>, the manufacturer and country of origin.</li>
          <li><strong>Characters 4-8</strong>, the vehicle&apos;s model, body, engine and series.</li>
          <li><strong>Character 9</strong>, a check digit that validates the VIN.</li>
          <li><strong>Character 10</strong>, the model year.</li>
          <li><strong>Character 11</strong>, the assembly plant.</li>
          <li><strong>Characters 12-17</strong>, the unique serial number of that specific car.</li>
        </ul>
        <p>Note: a valid VIN never contains the letters <strong>I, O or Q</strong>, to avoid confusion with 1 and 0.</p>

        <h2>Check any VIN for free</h2>
        <p>Enter a VIN below to instantly decode the specs, see open recalls, and preview the history, no signup.</p>
      </Article>
      <div className="container-x max-w-3xl pb-14">
        <VinForm size="md" />
        <p className="mt-6 text-sm text-ink-2">
          Next: <Link href="/guides/used-car-checklist" className="text-brand underline">the used-car buying checklist →</Link>
        </p>
      </div>
    </>
  );
}
