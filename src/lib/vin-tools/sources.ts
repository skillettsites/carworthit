/**
 * Every external fact on the VIN tool pages traces to one of these sources.
 * `checked` is the date the page was fetched and read (US format on the page,
 * ISO here). If a fact cannot be pinned to a source below it does not go on a
 * page. Re-verify by fetching the URL; the HTTP status on that date is noted
 * where it matters.
 */
export const CHECKED_ON = '2026-09-15';
export const CHECKED_ON_TEXT = 'September 15, 2026';

export interface Source {
  id: string;
  name: string;
  url: string;
  checked: string;
  note?: string;
}

export const SOURCES: Record<string, Source> = {
  nicbVincheck: {
    id: 'nicbVincheck',
    name: 'NICB VINCheck',
    url: 'https://www.nicb.org/vincheck',
    checked: CHECKED_ON,
    note:
      'Free; searches participating insurers\' records for vehicles reported stolen and not recovered, or reported as salvage or flood-damaged; maximum five searches per 24 hours per IP address; does not query law enforcement records; member companies represent 92.49% of US earned insurance premium.',
  },
  nmvtisProviders: {
    id: 'nmvtisProviders',
    name: 'NMVTIS approved data providers (US Department of Justice)',
    url: 'https://vehiclehistory.bja.ojp.gov/nmvtis_vehiclehistory',
    checked: CHECKED_ON,
    note: 'Public-facing approved providers listed that day: Bumper.com, Carsforsale.com, Carvertical.com, Checkthatvin.com, Clearvin.com, EpicVin.com, GoodCar.com, Titlecheck.us, Vinaudit.com, Vindata.com, VinReport, Vinsmart.com.',
  },
  nmvtisReport: {
    id: 'nmvtisReport',
    name: 'Understanding an NMVTIS Vehicle History Report',
    url: 'https://vehiclehistory.bja.ojp.gov/nmvtis_understandingvhr',
    checked: CHECKED_ON,
    note: 'Five indicators only: current state of title and last title date, brand history, odometer reading, total loss history, salvage history.',
  },
  nmvtisFaq: {
    id: 'nmvtisFaq',
    name: 'NMVTIS FAQ',
    url: 'https://vehiclehistory.bja.ojp.gov/faq/list',
    checked: CHECKED_ON,
    note: 'NMVTIS does not contain repair history; a complete copy of a state title record comes from the current state titling agency.',
  },
  cfr580: {
    id: 'cfr580',
    name: '49 CFR Part 580, Odometer Disclosure Requirements (eCFR)',
    url: 'https://www.ecfr.gov/current/title-49/subtitle-B/chapter-V/part-580',
    checked: CHECKED_ON,
    note: 'Read via the eCFR versioner API on the current edition. 580.5 disclosure on transfer; 580.17 exemptions (GVWR over 16,000 lb, not self-propelled, model year 2010 and older after 10 years, model year 2011 and newer after 20 years).',
  },
  cfr565: {
    id: 'cfr565',
    name: '49 CFR Part 565, Vehicle Identification Number Requirements (eCFR)',
    url: 'https://www.ecfr.gov/current/title-49/subtitle-B/chapter-V/part-565',
    checked: CHECKED_ON,
    note: '565.13: 17 characters, check digit in position 9, no I, O or Q, VIN readable through the windshield at the left pillar. 565.15 Table VII (2005 to 2039) and Table XIII (1980 to 2013) give the model-year codes.',
  },
  cfr567: {
    id: 'cfr567',
    name: '49 CFR Part 567, Certification label (eCFR)',
    url: 'https://www.ecfr.gov/current/title-49/subtitle-B/chapter-V/part-567',
    checked: CHECKED_ON,
    note: '567.4(c): label on the hinge pillar, door-latch post or door edge next to the driver\'s seat (trailers and motorcycles excepted); 567.4(g)(6): the label carries the VIN.',
  },
  vpic: {
    id: 'vpic',
    name: 'NHTSA vPIC (Product Information Catalog and Vehicle Listing)',
    url: 'https://vpic.nhtsa.dot.gov/',
    checked: CHECKED_ON,
    note: '"vPIC is intended for use on Model Years 1981 and forward. Vehicles prior to 1980\'s VIN standard are not included in decoding capability for the system." Decoder version 4.07, updated July 18, 2026.',
  },
  vpicApi: {
    id: 'vpicApi',
    name: 'NHTSA vPIC API, DecodeVinValues',
    url: 'https://vpic.nhtsa.dot.gov/api/',
    checked: CHECKED_ON,
  },
  txdmvBrands: {
    id: 'txdmvBrands',
    name: 'Texas DMV, Title Check: Title Brands and What They Mean',
    url: 'https://www.txdmv.gov/motorists/buying-or-selling-a-vehicle/title-check-look-before-you-buy',
    checked: CHECKED_ON,
    note: 'NMVTIS brand definitions for junk, salvage, rebuilt, water damage, odometer, manufacturer buyback and VIN replaced.',
  },
  wisconsinLien: {
    id: 'wisconsinLien',
    name: 'Wisconsin DMV lien holder search',
    url: 'https://wisconsindot.gov/Pages/online-srvcs/other-servs/lien-search.aspx',
    checked: CHECKED_ON,
  },
  nebraskaLien: {
    id: 'nebraskaLien',
    name: 'Nebraska DMV, Electronic Lien and Title',
    url: 'https://dmv.nebraska.gov/dvr/electronic-lien-and-title',
    checked: CHECKED_ON,
  },
  californiaRecords: {
    id: 'californiaRecords',
    name: 'California DMV, online vehicle record request',
    url: 'https://www.dmv.ca.gov/portal/customer-service/records-request/online-vehicle-record-request/',
    checked: CHECKED_ON,
  },
  wyomingTitleSearch: {
    id: 'wyomingTitleSearch',
    name: 'Wyoming DOT, Title Search',
    url: 'https://www.dot.state.wy.us/home/titles_plates_registration/title_search.html',
    checked: CHECKED_ON,
  },
  connecticutLien: {
    id: 'connecticutLien',
    name: 'Connecticut DMV, lien status inquiry',
    url: 'https://portal.ct.gov/dmv/commercial-and-industry-services/make-lien-inquiry',
    checked: CHECKED_ON,
  },
  mississippiTitle: {
    id: 'mississippiTitle',
    name: 'Mississippi DOR, Title Status Lookup',
    url: 'https://www.dor.ms.gov/motor-vehicle',
    checked: CHECKED_ON,
  },
  texasTitleCheck: {
    id: 'texasTitleCheck',
    name: 'Texas DMV, Title Check',
    url: 'https://www.txdmv.gov/motorists/buying-or-selling-a-vehicle/title-check-look-before-you-buy',
    checked: CHECKED_ON,
  },
  fordSticker: {
    id: 'fordSticker',
    name: 'Ford window sticker service (FordDirect)',
    url: 'https://www.windowsticker.forddirect.com/windowsticker.pdf?vin=',
    checked: CHECKED_ON,
  },
  stellantisSticker: {
    id: 'stellantisSticker',
    name: 'Stellantis window sticker service (Jeep, Ram, Dodge, Chrysler)',
    url: 'https://www.jeep.com/hostd/windowsticker/getWindowStickerPdf.do?vin=',
    checked: CHECKED_ON,
  },
  paintScratch: {
    id: 'paintScratch',
    name: 'PaintScratch, Find Your Paint Code',
    url: 'https://www.paintscratch.com/pages/finding-your-color-code',
    checked: CHECKED_ON,
    note: '"The VIN identifies the vehicle, but it does not include the paint code."',
  },
  automotiveTouchup: {
    id: 'automotiveTouchup',
    name: 'AutomotiveTouchup, paint code locations',
    url: 'https://www.automotivetouchup.com/paint-codes/',
    checked: CHECKED_ON,
  },
  harleyRecalls: {
    id: 'harleyRecalls',
    name: 'Harley-Davidson Safety Recall Information',
    url: 'https://www.harley-davidson.com/us/en/tools/service-recalls.html',
    checked: CHECKED_ON,
    note: '"You can locate your VIN, stamped on the steering head, and also on a label located on the right front down tube."',
  },
  kiaWarranty: {
    id: 'kiaWarranty',
    name: 'Kia warranty',
    url: 'https://www.kia.com/us/en/warranty',
    checked: CHECKED_ON,
    note: '10-year/100,000-mile powertrain limited warranty and 5-year/60,000-mile new vehicle limited warranty, original purchaser and certified pre-owned only.',
  },
  kiaOwners: { id: 'kiaOwners', name: 'Kia Owner Portal', url: 'https://owners.kia.com/us/en/kia-owner-portal.html', checked: CHECKED_ON },
  toyotaOwners: { id: 'toyotaOwners', name: 'Toyota Owners', url: 'https://www.toyota.com/owners', checked: CHECKED_ON },
  gmOwners: { id: 'gmOwners', name: 'GM owner account (experience.gm.com)', url: 'https://experience.gm.com/owners', checked: CHECKED_ON },
  chevroletWarranty: { id: 'chevroletWarranty', name: 'Chevrolet warranty information', url: 'https://www.chevrolet.com/owners/warranty', checked: CHECKED_ON },
  hyundaiOwners: { id: 'hyundaiOwners', name: 'MyHyundai owner portal', url: 'https://owners.hyundaiusa.com/us/en', checked: CHECKED_ON },
  hyundaiWarranty: { id: 'hyundaiWarranty', name: 'Hyundai warranty coverage', url: 'https://www.hyundaiusa.com/us/en/assurance/america-best-warranty', checked: CHECKED_ON },
  nissanOwners: { id: 'nissanOwners', name: 'Nissan Owners', url: 'https://www.nissanusa.com/owners.html', checked: CHECKED_ON },
  subaruOwners: { id: 'subaruOwners', name: 'Subaru owners', url: 'https://www.subaru.com/owners/benefits-of-ownership.html', checked: CHECKED_ON },
  hondaFind: { id: 'hondaFind', name: 'Honda MyGarage, find your Honda', url: 'https://mygarage.honda.com/s/find-honda', checked: CHECKED_ON },
};

export const src = (id: keyof typeof SOURCES) => SOURCES[id];
