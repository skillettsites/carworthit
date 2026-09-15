/**
 * State titling-agency lookups that were verified by fetching the agency's
 * own page on September 15, 2026. Many state DMV sites (Florida, New York,
 * Michigan, Illinois, Massachusetts, Maryland, Iowa, Arizona, Utah, Alaska,
 * Montana, New Hampshire, New Mexico, Rhode Island, South Carolina) returned
 * HTTP 403 to every request that day, so nothing is claimed for them. The
 * absence of a state below means "not verified", not "does not exist".
 */
export interface StateLookup {
  state: string;
  what: string;
  cost: string;
  online: boolean;
  publicAccess: boolean;
  url: string;
  checked: string;
  note?: string;
}

export const LIEN_LOOKUPS: StateLookup[] = [
  {
    state: 'Wisconsin',
    what: 'Lien holder search by VIN: shows whether the title was delivered to the owner or a lender, and the lender\'s name and address for business loans.',
    cost: 'No fee stated on the page (the page says there is no fee to remove a lien; the search itself lists none).',
    online: true,
    publicAccess: true,
    url: 'https://wisconsindot.gov/Pages/online-srvcs/other-servs/lien-search.aspx',
    checked: '2026-09-15',
    note: 'Titles with a lien listed on or after July 30, 2012 go to the lender; the owner receives a Confirmation of Ownership instead. The page carried an "online services currently unavailable" notice when read.',
  },
  {
    state: 'Nebraska',
    what: 'Online Vehicle Title and Lien Inquiry, linked from the DMV\'s Electronic Lien and Title page; a subscriber Title, Lien and Registration Record Search for business use.',
    cost: '$1.00 per successful record search on the subscriber service; the public inquiry\'s fee, if any, is not stated on the page we could read.',
    online: true,
    publicAccess: true,
    url: 'https://dmv.nebraska.gov/dvr/electronic-lien-and-title',
    checked: '2026-09-15',
    note: 'The inquiry itself (eDmv.Nebraska.gov/TAP) did not respond to our request, so what it displays is not verified.',
  },
  {
    state: 'California',
    what: 'Online vehicle record request for your OWN vehicle; another person\'s vehicle record needs form INF 70 by mail.',
    cost: '$2 online for your own record (plus a 1.95% card fee); $5 per record by mail for someone else\'s vehicle.',
    online: true,
    publicAccess: false,
    url: 'https://www.dmv.ca.gov/portal/customer-service/records-request/online-vehicle-record-request/',
    checked: '2026-09-15',
    note: 'The page does not state that the record shows lienholder details; treat it as a title record request, not a lien lookup.',
  },
  {
    state: 'Texas',
    what: 'Title Check: the state points buyers to NMVTIS-approved providers for title history (brands, junk, salvage, total loss). It is not a state lien lookup.',
    cost: '"Prices begin at only a couple dollars" (TxDMV wording) at the provider.',
    online: true,
    publicAccess: true,
    url: 'https://www.txdmv.gov/motorists/buying-or-selling-a-vehicle/title-check-look-before-you-buy',
    checked: '2026-09-15',
  },
  {
    state: 'Wyoming',
    what: 'Certificate of title search by VIN, title number or owner name, by mail on form MV-220.',
    cost: '$15 per record search.',
    online: false,
    publicAccess: true,
    url: 'https://www.dot.state.wy.us/home/titles_plates_registration/title_search.html',
    checked: '2026-09-15',
  },
  {
    state: 'Mississippi',
    what: 'Title Status Lookup on the DOR Motor Vehicle e-Services site, linked from the DOR motor vehicle page.',
    cost: 'Not stated on the pages we could read.',
    online: true,
    publicAccess: true,
    url: 'https://www.dor.ms.gov/motor-vehicle',
    checked: '2026-09-15',
    note: 'The lookup page itself requires cookies and did not render for our request, so what it displays is not verified.',
  },
  {
    state: 'Connecticut',
    what: 'Lien status inquiry, but only for CT DMV-approved lienholders and their ELT providers, not the public.',
    cost: 'Not applicable to buyers.',
    online: true,
    publicAccess: false,
    url: 'https://portal.ct.gov/dmv/commercial-and-industry-services/make-lien-inquiry',
    checked: '2026-09-15',
  },
];
