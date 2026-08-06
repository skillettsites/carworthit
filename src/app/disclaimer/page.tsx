import type { Metadata } from 'next';
import Article from '@/components/Article';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Data sources and disclaimer',
  description: 'Where CarWorthIt sources its vehicle data, what our reports cover, and what they cannot tell you.',
  alternates: { canonical: `${SITE_URL}/disclaimer` },
};

export default function Page() {
  return (
    <Article title="Data sources and disclaimer">
      <h2>Market values</h2>
      <p>
        Valuations are supplied by a <strong>licensed US vehicle-pricing provider</strong>. The figure is for the
        specific vehicle you asked about: the VIN fixes its trim and the options it was built with, and we price it at
        the mileage you give us, in the market around the ZIP code you give us. The evidence it is measured against is
        what comparable vehicles are currently listed for locally, and we show the average, the lowest and the highest
        of those asking prices.
      </p>
      <p>
        It remains a statistical estimate rather than an appraisal.{' '}
        <strong>Nobody has inspected the car.</strong> Condition, service history, accident damage and local demand
        can all move a real sale price either side of our figure. Asking prices are also not sale prices: cars
        frequently sell for less than they are listed at.
      </p>

      <h2>Original factory data</h2>
      <p>
        Original MSRP, dealer invoice price, factory-fitted options, standard equipment and warranty terms come from
        the manufacturer build record for that specific VIN. Coverage is not universal, particularly on older
        vehicles. Where we have no record we say so rather than estimating, and we do not charge for a report we
        cannot produce.
      </p>

      <h2>Specifications, recalls and safety</h2>
      <p>
        Vehicle specifications, open safety recalls and 5-star crash-test ratings come from public data published by
        the{' '}
        <a href="https://www.nhtsa.gov/" target="_blank" rel="noopener noreferrer">
          National Highway Traffic Safety Administration (NHTSA)
        </a>
        . Recalls are matched by year, make and model, so a campaign limited to a narrower VIN range may appear for a
        vehicle outside it. Always confirm any recall with a franchised dealer, who can check by VIN.
      </p>

      <h2>Running costs</h2>
      <p>
        Fuel-economy figures come from the U.S. EPA&apos;s{' '}
        <a href="https://www.fueleconomy.gov/" target="_blank" rel="noopener noreferrer">fueleconomy.gov</a>. The
        five-year running-cost figure combines that vehicle&apos;s EPA fuel figure with US national-average estimates
        for insurance, maintenance, repairs, taxes and fees, scaled for the vehicle&apos;s age. Only the fuel line is
        specific to your car. It excludes depreciation and is an estimate, not a quote.
      </p>

      <h2>We do not sell vehicle history reports</h2>
      <p>
        <strong>
          {SITE_NAME} does not provide title history, salvage or theft records, and is not an approved NMVTIS data
          provider.
        </strong>{' '}
        Accident and title-brand data in the United States sits behind licenses we do not hold. If you want an
        official National Motor Vehicle Title Information System report, buy one from an approved provider listed by
        the U.S. Department of Justice at{' '}
        <a href="https://vehiclehistory.bja.ojp.gov/" target="_blank" rel="noopener noreferrer">
          vehiclehistory.bja.ojp.gov
        </a>
        .
      </p>
      <p>
        A CarWorthIt report is not a mechanical inspection, an appraisal, or a guarantee of a vehicle&apos;s
        condition, safety or value. We strongly recommend an independent, in-person inspection before you buy.
      </p>

      <h2>No affiliation</h2>
      <p>
        {SITE_NAME} is an independent service and is not affiliated with, endorsed by or sponsored by Carfax,
        AutoCheck, Experian, Kelley Blue Book, or any vehicle manufacturer.
      </p>
    </Article>
  );
}
