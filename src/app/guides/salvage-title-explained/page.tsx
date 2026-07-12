import type { Metadata } from 'next';
import Article from '@/components/Article';
import VinForm from '@/components/VinForm';

export const metadata: Metadata = {
  title: 'Salvage, rebuilt & branded titles explained',
  description: 'What salvage, junk, flood, lemon and rebuilt title brands mean, how they hit value, and when to walk away.',
};

export default function Page() {
  return (
    <>
      <Article title="Salvage, rebuilt & branded titles explained" subtitle="A title brand is a permanent flag on a car’s record. Here’s what each one means for you.">
        <p>When a car is seriously damaged, stolen, or fails to meet standards, its title gets <strong>branded</strong>. The brand follows the VIN forever, even after repairs. Here are the ones that matter.</p>

        <h2>Salvage</h2>
        <p>An insurer declared the car a <strong>total loss</strong>, repairs cost more than the car was worth. A salvage car can&apos;t legally be driven until repaired and re-inspected. Value drops 20-50%.</p>

        <h2>Rebuilt / Reconstructed</h2>
        <p>A salvage car that&apos;s been repaired and passed inspection. Roadworthy again, but the history is permanent and it&apos;s worth much less than a clean-title equivalent.</p>

        <h2>Flood / Water damage</h2>
        <p>Flood cars can look perfect but suffer years of electrical and corrosion problems. Treat any flood brand as a serious warning.</p>

        <h2>Junk</h2>
        <p>Declared fit only for scrap or parts. A junk-branded VIN should never be on the road.</p>

        <h2>Lemon / Manufacturer buyback</h2>
        <p>Repurchased by the maker under lemon law after repeated unfixable faults.</p>

        <h2>How to check</h2>
        <p>Every one of these brands is recorded in NMVTIS. Run the VIN and the full report flags salvage, junk, flood, rebuilt and total-loss records directly.</p>
      </Article>
      <div className="container-x max-w-3xl pb-14"><VinForm size="md" /></div>
    </>
  );
}
