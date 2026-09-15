/**
 * Manufacturer window-sticker (Monroney label) lookups that verifiably work
 * for the public today. Only makes listed here get a /window-sticker/[make]
 * page; every other make gets the honest "no free sticker" answer on the hub.
 *
 * Verification method (September 15, 2026): each endpoint was requested from
 * a script with real VINs harvested from public used-car listings, and the
 * returned PDF was opened and read. "Real sticker" means the PDF contained the
 * model year, trim, MSRP and equipment list; "not released" means the service
 * returned its own placeholder page. Counts below are what happened that day.
 */
export interface StickerOem {
  slug: string;
  make: string;
  /** vPIC Make values that map to this page. */
  vpicMakes: string[];
  /** Append the 17-character VIN to this to fetch the PDF. */
  endpoint: string;
  endpointHost: string;
  verification: {
    checked: string;
    httpStatus: number;
    contentType: string;
    realStickers: number;
    tested: number;
    modelYearsWorked: string;
    modelYearsFailed: string;
    notes: string;
  };
}

export const STICKER_OEMS: StickerOem[] = [
  {
    slug: 'ford',
    make: 'Ford',
    vpicMakes: ['FORD'],
    endpoint: 'https://www.windowsticker.forddirect.com/windowsticker.pdf?vin=',
    endpointHost: 'windowsticker.forddirect.com',
    verification: {
      checked: '2026-09-15',
      httpStatus: 200,
      contentType: 'application/pdf',
      realStickers: 5,
      tested: 14,
      modelYearsWorked: '2018, 2021, 2022, 2023',
      modelYearsFailed: '2013, 2018, 2019, 2020, 2023',
      notes:
        'Fourteen F-150 VINs: thirteen from public used listings plus one pattern-valid 2013 VIN. Five returned the full sticker (MSRP, options, fuel economy label). Nine returned a one-page PDF reading "The window sticker has not yet been released for this vehicle", including three 2023 trucks, so coverage is patchy rather than age-based. The service returns that placeholder for any VIN it does not hold, so a blank result is not proof of anything about the truck.',
    },
  },
  {
    slug: 'jeep',
    make: 'Jeep',
    vpicMakes: ['JEEP'],
    endpoint: 'https://www.jeep.com/hostd/windowsticker/getWindowStickerPdf.do?vin=',
    endpointHost: 'jeep.com',
    verification: {
      checked: '2026-09-15',
      httpStatus: 200,
      contentType: 'application/pdf',
      realStickers: 3,
      tested: 4,
      modelYearsWorked: '2023',
      modelYearsFailed: '2015',
      notes:
        'Three 2023 Grand Cherokee VINs from used listings returned the full sticker (base price, exterior and interior color, engine, transmission, standard and optional equipment). A pattern-valid 2015 VIN returned "We are unable to retrieve a window sticker for this VIN at this time." The same Stellantis service answers on jeep.com, ramtrucks.com, dodge.com and chrysler.com.',
    },
  },
  {
    slug: 'ram',
    make: 'Ram',
    vpicMakes: ['RAM'],
    endpoint: 'https://www.ramtrucks.com/hostd/windowsticker/getWindowStickerPdf.do?vin=',
    endpointHost: 'ramtrucks.com',
    verification: {
      checked: '2026-09-15',
      httpStatus: 200,
      contentType: 'application/pdf',
      realStickers: 4,
      tested: 10,
      modelYearsWorked: '2017, 2018, 2021, 2023',
      modelYearsFailed: '2014, 2015, 2016',
      notes:
        'Ten used Ram 1500 VINs. Every 2017 or newer truck returned the full sticker (one 2018 built for Canada came back as the French-language label). All six 2014 to 2016 trucks returned "We are unable to retrieve a window sticker for this VIN at this time", so treat 2017 as the practical cutoff.',
    },
  },
  {
    slug: 'dodge',
    make: 'Dodge',
    vpicMakes: ['DODGE'],
    endpoint: 'https://www.dodge.com/hostd/windowsticker/getWindowStickerPdf.do?vin=',
    endpointHost: 'dodge.com',
    verification: {
      checked: '2026-09-15',
      httpStatus: 200,
      contentType: 'application/pdf',
      realStickers: 4,
      tested: 4,
      modelYearsWorked: '2019, 2020, 2021, 2025',
      modelYearsFailed: 'none in the sample',
      notes: 'Four used Challenger and Charger VINs, 2019 to 2025, all returned the full sticker.',
    },
  },
  {
    slug: 'chrysler',
    make: 'Chrysler',
    vpicMakes: ['CHRYSLER'],
    endpoint: 'https://www.chrysler.com/hostd/windowsticker/getWindowStickerPdf.do?vin=',
    endpointHost: 'chrysler.com',
    verification: {
      checked: '2026-09-15',
      httpStatus: 200,
      contentType: 'application/pdf',
      realStickers: 2,
      tested: 4,
      modelYearsWorked: '2017, 2023',
      modelYearsFailed: '2015, 2016',
      notes:
        'The chrysler.com address of the shared Stellantis service returned a full sticker for a 2017 Journey and a 2023 Grand Cherokee L, so it is not restricted to Chrysler-badged VINs. A 2016 Ram and a pattern-valid 2015 Grand Cherokee VIN returned "unable to retrieve". Fewer Chrysler-badged VINs were available to test.',
    },
  },
];

/** Makes checked that have NO verified public sticker lookup. */
export const NO_STICKER_MAKES: { make: string; tried: string; result: string }[] = [
  { make: 'Toyota', tried: 'toyota.com/owners/resources/window-sticker; toyota.com/config/pub/windowsticker; smartpath.toyota.com', result: '404 / 502 / 403 on September 15, 2026. Toyota Owners (toyota.com/owners) offers manuals and warranty details behind a sign-in, not a sticker.' },
  { make: 'Honda', tried: 'automobiles.honda.com/window-sticker; owners.honda.com', result: '403 and a redirect to mygarage.honda.com/s/find-honda. No public sticker endpoint found.' },
  { make: 'Chevrolet, GMC, Buick, Cadillac', tried: 'gm.com/window-sticker; chevrolet.com/window-sticker', result: '404 on both. The GM owner site (experience.gm.com) is behind an account.' },
  { make: 'Hyundai', tried: 'hyundaiusa.com/us/en/window-sticker and two other paths', result: '404 / 403.' },
  { make: 'Kia', tried: 'kia.com/us/en/window-sticker and two other paths', result: '404.' },
  { make: 'Nissan', tried: 'nissanusa.com/window-sticker; nissanusa.com/owners/window-sticker', result: '404.' },
  { make: 'Subaru', tried: 'subaru.com/window-sticker; subaru.com/services/window-sticker.html', result: '404 / 500.' },
  { make: 'BMW, Audi, Harley-Davidson', tried: 'brand sites', result: 'No sticker endpoint found; BMW and Audi paths timed out or returned 403.' },
];

export function stickerOemForMake(vpicMake: string | undefined): StickerOem | undefined {
  if (!vpicMake) return undefined;
  const m = vpicMake.trim().toUpperCase();
  return STICKER_OEMS.find((o) => o.vpicMakes.includes(m));
}
