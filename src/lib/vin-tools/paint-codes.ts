/**
 * Where the factory paint-code label sits, by make.
 *
 * The VIN does not encode paint. That is the point of /paint-code-by-vin, and
 * it is confirmed by PaintScratch's own guide ("The VIN identifies the
 * vehicle, but it does not include the paint code"). No manufacturer site we
 * tried served a public paint-code page to a script on September 15, 2026
 * (ford.com timed out; Toyota, Honda, Hyundai, Kia, GM, Subaru and Nissan
 * support paths returned 404; Mopar and Audi returned 403), so the locations
 * below come from the two largest US touch-up paint retailers, each of which
 * publishes a per-make locator page. Both were fetched and read that day.
 * They are retailer guidance, not manufacturer statements, and the page says
 * so.
 */
export interface PaintRow {
  make: string;
  location: string;
  format: string;
  sources: { name: string; url: string; checked: string }[];
}

const PS = (slug: string) => ({ name: 'PaintScratch', url: `https://www.paintscratch.com/touch-up-paint-codes/${slug}.htm`, checked: '2026-09-15' });
const ATU = (slug: string) => ({ name: 'AutomotiveTouchup', url: `https://www.automotivetouchup.com/paint-codes/${slug}.aspx`, checked: '2026-09-15' });

export const PAINT_LOCATIONS: PaintRow[] = [
  {
    make: 'Ford',
    location: 'Driver-side door jamb or door edge, on the certification label. Read the code next to EXT PNT, above the wheelbase (WB) entry.',
    format: 'Two characters, letters and/or numbers (for example PM, FL, SH).',
    sources: [PS('ford'), ATU('ford')],
  },
  {
    make: 'Chevrolet and GMC',
    location: 'Service Parts Identification label, which GM moves around: usually inside the glove box, on the spare tire cover or in the spare tire well; some Camaro and Corvette models put it in the center console or under the trunk lid.',
    format: 'Preceded by BC/CC; U marks the upper (body) color and L the lower color on two-tone vehicles (for example 51/WA316N, shown on the label as BC/CC U316N; two-tone vehicles add BC/CC L316N).',
    sources: [PS('chevrolet'), ATU('chevrolet'), ATU('gmc')],
  },
  {
    make: 'Toyota and Lexus',
    location: 'Driver-side door jamb, on the color ID plate.',
    format: 'Three characters after C/TR (for example C/TR 3P1 FA09, where 3P1 is the paint and FA09 the interior trim).',
    sources: [PS('toyota'), ATU('toyota'), PS('lexus')],
  },
  {
    make: 'Honda',
    location: 'Driver-side door jamb, on the color ID tag; a few models carry it on the firewall instead.',
    format: 'Two letters, three digits and a suffix (for example NH731P, B92P, YR525M).',
    sources: [PS('honda'), ATU('honda')],
  },
  {
    make: 'Nissan',
    location: 'Driver-side door jamb on most models, sometimes low on the jamb; older models used the passenger-side firewall, the center of the firewall or the radiator support.',
    format: 'Three characters, sometimes followed by a space and a fourth (for example AX6).',
    sources: [PS('nissan'), ATU('nissan')],
  },
  {
    make: 'Jeep, Dodge, Chrysler and Ram',
    location: 'Driver-side door jamb on modern vehicles (2007 and newer), on the safety certification label after PNT; older vehicles used the top of the radiator support, the firewall or, on some Wranglers, under the driver seat.',
    format: 'Three characters starting with P (for example PX8, PRV, PS2); the older BS/GBS style carries a year letter before the two-letter code.',
    sources: [PS('jeep'), ATU('jeep'), ATU('dodge'), ATU('chrysler')],
  },
  {
    make: 'BMW',
    location: 'Under the hood on a strut tower, fender edge or the engine-side firewall; newer models also carry it in the driver-side door jamb or B-pillar area.',
    format: 'Three digits, sometimes with a slash and a fourth (for example 300, 475, A52, 354/7).',
    sources: [PS('bmw'), ATU('bmw')],
  },
  {
    make: 'Audi and Volkswagen',
    location: 'Paper tag in the trunk: under the trunk lid, in the spare tire well, under the floor mat or on the fuse box cover; some models also have a plate in the driver-side door jamb.',
    format: 'Two to four characters, often paired with a second short code (for example LY9H / P1, LD7X / 2R).',
    sources: [PS('audi'), ATU('audi'), PS('volkswagen'), ATU('volkswagen')],
  },
  {
    make: 'Subaru',
    location: 'Strut tower sticker (driver side on 1990 and newer, passenger side on many 2007 and newer), or the door edge or door jamb.',
    format: 'Three characters (for example 37J, 3M6); two-tone cars list both codes.',
    sources: [PS('subaru'), ATU('subaru')],
  },
  {
    make: 'Hyundai',
    location: 'Driver-side door jamb or door edge on most 1997 and newer models; a few (Excel, Scoupe, some Sonata) used the firewall center or the front of the radiator support.',
    format: 'Two characters on most (for example 3E, W1), three on some newer models (S3B).',
    sources: [PS('hyundai'), ATU('hyundai')],
  },
  {
    make: 'Kia',
    location: 'Driver-side door jamb on every model both retailers list.',
    format: 'Two characters (for example B3, 6Y).',
    sources: [PS('kia'), ATU('kia')],
  },
  {
    make: 'Mazda',
    location: 'Driver-side door jamb or door frame; otherwise an under-hood label on the firewall near the windshield.',
    format: 'Two or three characters (for example 41V, 46G, A4A).',
    sources: [PS('mazda'), ATU('mazda')],
  },
  {
    make: 'Mercedes-Benz',
    location: 'Driver-side door jamb on recent models; older cars used the radiator support bar or a label on the underside of the hood.',
    format: 'Three digits (for example 040, 197, 723), older codes prefixed DB.',
    sources: [PS('mercedes-benz'), ATU('mercedes-benz')],
  },
  {
    make: 'Tesla',
    location: 'Driver-side door jamb label.',
    format: 'Three or four characters (for example PPSW, 19E, PPMR).',
    sources: [PS('tesla'), ATU('tesla')],
  },
  {
    make: 'Harley-Davidson',
    location: 'Usually no code on the bike; the color name is what is listed, and the paint formula has to come from Harley-Davidson or a PPG / Axalta formula number.',
    format: 'Color name rather than a code.',
    sources: [PS('harley-davidson')],
  },
];
