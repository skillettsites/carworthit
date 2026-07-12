import type { Metadata } from 'next';
import Article from '@/components/Article';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Data sources & NMVTIS disclaimer',
  description: 'How CarWorthIt sources vehicle data, and the NMVTIS consumer disclaimer.',
};

export default function Page() {
  return (
    <Article title="Data sources & NMVTIS disclaimer">
      <h2>Vehicle history data (NMVTIS)</h2>
      <p>
        Vehicle history information in our reports is provided in part by the <strong>National Motor Vehicle Title
        Information System (NMVTIS)</strong>, an electronic system operated under the U.S. Department of Justice that
        contains information supplied by state motor vehicle titling agencies, insurance carriers, and the
        salvage/recycling industry.
      </p>
      <p>
        NMVTIS data may not reflect all title branding, odometer, or total-loss events applicable to a vehicle, and the
        absence of a record is not a guarantee that an event did not occur. Not all jurisdictions and data providers
        report to NMVTIS on the same schedule. A report from {SITE_NAME} does not constitute a mechanical inspection,
        an appraisal, or a guarantee of a vehicle&apos;s condition, safety, or value. We strongly recommend an
        independent, in-person inspection before purchase.
      </p>
      <p>
        The official NMVTIS consumer site and the list of approved data providers are available at{' '}
        <a href="https://vehiclehistory.bja.ojp.gov/" target="_blank" rel="noopener noreferrer">vehiclehistory.bja.ojp.gov</a>.
      </p>

      <h2>Specifications & recalls</h2>
      <p>
        Vehicle specifications and open safety-recall information are decoded from the VIN using public data from the{' '}
        <a href="https://www.nhtsa.gov/" target="_blank" rel="noopener noreferrer">National Highway Traffic Safety Administration (NHTSA)</a>.
      </p>

      <h2>Running costs</h2>
      <p>
        Fuel-economy figures and estimated annual fuel costs are sourced from the U.S. EPA&apos;s{' '}
        <a href="https://www.fueleconomy.gov/" target="_blank" rel="noopener noreferrer">fueleconomy.gov</a>. The
        5-year cost-to-own figure combines this vehicle&apos;s EPA fuel figure with U.S. national-average estimates for
        insurance, maintenance, repairs, taxes and depreciation, and is an estimate only.
      </p>

      <h2>No affiliation</h2>
      <p>{SITE_NAME} is an independent service and is not affiliated with, endorsed by, or sponsored by Carfax, AutoCheck, Experian, or any vehicle manufacturer.</p>
    </Article>
  );
}
