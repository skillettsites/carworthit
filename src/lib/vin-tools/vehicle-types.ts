/**
 * What NHTSA vPIC actually returned for each vehicle type on September 15,
 * 2026. The test VINs are pattern-valid (a real manufacturer WMI, a plausible
 * descriptor and a correct check digit) rather than VINs of specific vehicles
 * on the road; vPIC decodes from the manufacturer's filed patterns, so the
 * fields returned are what a real VIN with the same pattern returns. Each
 * type page prints these lists so the reader knows what to expect BEFORE
 * they type a VIN.
 */
export interface TypeTest {
  vin: string;
  description: string;
  vpicVehicleType: string;
  returned: string[];
  blank: string[];
  errorText: string;
}

export interface VehicleTypeDef {
  slug: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  shortName: string;
  /** vPIC VehicleType values that count as this type. */
  vpicTypes: string[];
  tests: TypeTest[];
}

export const VEHICLE_TYPES: VehicleTypeDef[] = [
  {
    slug: 'motorcycle-vin-check',
    title: 'Motorcycle VIN Check',
    h1: 'Free Motorcycle VIN Check',
    metaTitle: 'Motorcycle VIN Check (Free): Decode Any Bike VIN',
    metaDescription:
      'Free motorcycle VIN check using NHTSA data: make, model, year, engine size, horsepower and plant for any 17-character bike VIN. What it shows and what it cannot.',
    shortName: 'motorcycle',
    vpicTypes: ['MOTORCYCLE'],
    tests: [
      {
        vin: '1HD1KB4157Y675236',
        description: 'Harley-Davidson, 1HD WMI, 2007 pattern',
        vpicVehicleType: 'MOTORCYCLE',
        returned: ['Make (HARLEY-DAVIDSON)', 'Model (Street Glide)', 'Series (FLHX)', 'Model year (2007)', 'Body class (Motorcycle - Touring/Sport Touring)', 'Cylinders (2)', 'Displacement (1.584 L)', 'Horsepower (70)', 'Fuel (Gasoline)', 'GVWR class', 'Plant (York, Pennsylvania)'],
        blank: ['Trim', 'Engine model', 'Transmission', 'Drive type'],
        errorText: '0 - VIN decoded clean',
      },
      {
        vin: 'JH2RC5000EK123456',
        description: 'Honda, JH2 WMI, 2014 pattern',
        vpicVehicleType: 'MOTORCYCLE',
        returned: ['Make (HONDA)', 'Model (VT750 Shadow Aero 750)', 'Series (VT750C)', 'Model year (2014)', 'Body class (Motorcycle - Cruiser)', 'Engine model (RC50E)', 'Cylinders (2)', 'Displacement (0.745 L)', 'Horsepower (44.3)', 'Fuel (Gasoline)', 'GVWR class', 'Plant (Kumamoto, Japan)'],
        blank: ['Trim', 'Transmission', 'Drive type'],
        errorText: '0 - VIN decoded clean',
      },
    ],
  },
  {
    slug: 'rv-vin-lookup',
    title: 'RV VIN Lookup',
    h1: 'Free RV VIN Lookup',
    metaTitle: 'RV VIN Lookup (Free): Motorhome Chassis by VIN',
    metaDescription:
      'Free RV VIN lookup with NHTSA data. A motorhome VIN decodes to the chassis (Ford, Freightliner, Mercedes-Benz), its engine and GVWR, not the coach builder. What you get and what you do not.',
    shortName: 'RV',
    vpicTypes: ['INCOMPLETE VEHICLE', 'MULTIPURPOSE PASSENGER VEHICLE (MPV)', 'TRUCK', 'BUS'],
    tests: [
      {
        vin: '4UZAAHAK29CZ12345',
        description: 'Freightliner Custom Chassis, 4UZ WMI, 2009 pattern',
        vpicVehicleType: 'INCOMPLETE VEHICLE',
        returned: ['Make (FREIGHTLINER)', 'Model (XC Chassis)', 'Model year (2009)', 'Body class (Incomplete - Motor Home Chassis)', 'Engine model (Cat 3126/CFE)', 'Cylinders (6)', 'Displacement (7.2 L)', 'Fuel (Diesel)', 'Drive (4x2)', 'GVWR class (Class 7: 26,001 to 33,000 lb)', 'Plant (Gaffney, South Carolina)'],
        blank: ['Coach builder', 'Coach model', 'Length', 'Horsepower', 'Transmission'],
        errorText: '0 - VIN decoded clean, with an Incomplete Vehicle Warning',
      },
      {
        vin: '1F66F5DY2F0A12345',
        description: 'Ford motorhome chassis (Detroit Chassis LLC), 1F6 WMI, 2015 pattern',
        vpicVehicleType: 'INCOMPLETE VEHICLE',
        returned: ['Make (FORD)', 'Model (Motorhome Chassis)', 'Model year (2015)', 'Body class (Incomplete - Stripped Chassis)', 'Cylinders (10)', 'Displacement (6.8 L)', 'Horsepower (362)', 'Fuel (Gasoline)', 'Drive (4x2)', 'GVWR class (Class 6: 19,501 to 26,000 lb)', 'Plant (Detroit, Michigan)'],
        blank: ['Coach builder', 'Coach model', 'Length', 'Transmission'],
        errorText: '0 - VIN decoded clean, with an Incomplete Vehicle Warning',
      },
      {
        vin: 'WDAPF4CC5G9123456',
        description: 'Mercedes-Benz Sprinter chassis cab, WDA WMI, 2016 pattern',
        vpicVehicleType: 'INCOMPLETE VEHICLE',
        returned: ['Make (MERCEDES-BENZ)', 'Model (Sprinter)', 'Model year (2016)', 'Body class (Incomplete - Chassis Cab (Single Cab))', 'Cylinders (6)', 'Displacement (3.0 L)', 'Fuel (Diesel)', 'Drive (4x2)', 'GVWR class (Class 3: 10,001 to 14,000 lb)', 'Plant (Ludwigsfelde, Germany)'],
        blank: ['Coach builder', 'Coach model', 'Length', 'Horsepower', 'Transmission'],
        errorText: '0 - VIN decoded clean, with an Incomplete Vehicle Warning',
      },
    ],
  },
  {
    slug: 'trailer-vin-lookup',
    title: 'Trailer VIN Lookup',
    h1: 'Free Trailer VIN Lookup',
    metaTitle: 'Trailer VIN Lookup (Free): Camper and Trailer VIN',
    metaDescription:
      'Free trailer VIN lookup using NHTSA data: manufacturer, model year, trailer type, body type, length and axles for travel trailers, fifth wheels and campers. No engine, no GVWR.',
    shortName: 'trailer',
    vpicTypes: ['TRAILER'],
    tests: [
      {
        vin: '4X4TSMH24FS123456',
        description: 'Forest River, 4X4 WMI, 2015 pattern',
        vpicVehicleType: 'TRAILER',
        returned: ['Make (FOREST RIVER)', 'Model (Salem Towables)', 'Model year (2015)', 'Body class (Trailer)', 'Trailer body type (Camping or Travel Trailer)', 'Trailer length (32)', 'Axles (2)', 'Plant (Topeka, Indiana)'],
        blank: ['Trailer type (hitch)', 'GVWR', 'Engine (trailers have none)'],
        errorText: '0 - VIN decoded clean',
      },
      {
        vin: '4YDT29R29FA123456',
        description: 'Keystone RV, 4YD WMI, 2015 pattern',
        vpicVehicleType: 'TRAILER',
        returned: ['Make (KEYSTONE)', 'Model year (2015)', 'Trailer type (Bumper Pull)', 'Trailer body type (Camping or Travel Trailer)', 'Trailer length (29)', 'Axles (2)', 'Plant (Goshen, Indiana)'],
        blank: ['Model line (returned as "Keystone")', 'GVWR'],
        errorText: '0 - VIN decoded clean',
      },
      {
        vin: '573TE372XF1234567',
        description: 'Grand Design RV, 573 WMI, 2015 pattern',
        vpicVehicleType: 'TRAILER',
        returned: ['Make (GRAND DESIGN RECREATIONAL)', 'Series (Imagine)', 'Model year (2015)', 'Trailer type (Ball Hitch)', 'Trailer body type (Camping or Travel Trailer)', 'Trailer length (37)', 'Axles (2)', 'Plant (Middlebury, Indiana)'],
        blank: ['GVWR'],
        errorText: '0 - VIN decoded clean',
      },
      {
        vin: '1UJBJ0BS4F1234567',
        description: 'Jayco, 1UJ WMI, 2015 pattern',
        vpicVehicleType: 'TRAILER',
        returned: ['Make (JAYCO)', 'Model year (2015)', 'Trailer type (Bumper Pull)', 'Trailer body type (Camping or Travel Trailer)', 'Trailer length (35.99)', 'Axles (2)', 'Plant (Middlebury, Indiana)'],
        blank: ['Model line (returned as "Jayco")', 'GVWR'],
        errorText: '0 - VIN decoded clean',
      },
    ],
  },
  {
    slug: 'atv-vin-lookup',
    title: 'ATV VIN Lookup',
    h1: 'Free ATV VIN Lookup',
    metaTitle: 'ATV VIN Lookup (Free): Polaris, Can-Am, Yamaha VIN',
    metaDescription:
      'Free ATV and side-by-side VIN lookup with NHTSA data. vPIC files ATVs as motorcycles and often returns only the make, year and plant. What it showed for Polaris, Can-Am and Yamaha VINs.',
    shortName: 'ATV',
    vpicTypes: ['MOTORCYCLE', 'OFF ROAD VEHICLE', 'LOW SPEED VEHICLE (LSV)'],
    tests: [
      {
        vin: '4XAVAE95XEA123456',
        description: 'Polaris, 4XA WMI, 2014 pattern',
        vpicVehicleType: 'MOTORCYCLE',
        returned: ['Make (POLARIS)', 'Model year (2014)', 'Transmission style (Motorcycle - Chain Drive Off-Road)', 'Drive (4x2)', 'GVWR class', 'Plant (Roseau, Minnesota)'],
        blank: ['Model', 'Engine', 'Displacement', 'Horsepower', 'Fuel'],
        errorText: '5 - VIN has errors in few positions; 14 - unable to provide information for some characters, based on the manufacturer submission',
      },
      {
        vin: '3JB1KAF40LJ001234',
        description: 'Can-Am (BRP Mexico), 3JB WMI, 2020 pattern',
        vpicVehicleType: 'MOTORCYCLE',
        returned: ['Make (CAN-AM)', 'Trim (XT/XT-P)', 'Model year (2020)', 'GVWR class', 'Plant (Juarez, Mexico)'],
        blank: ['Model', 'Engine', 'Displacement', 'Horsepower', 'Fuel', 'Drive'],
        errorText: '0 - VIN decoded clean; 14 - unable to provide information for some characters',
      },
      {
        vin: '5Y4AJ57Y5EA123456',
        description: 'Yamaha Motor Manufacturing (Newnan, Georgia), 5Y4 WMI, 2014 pattern',
        vpicVehicleType: 'MOTORCYCLE',
        returned: ['Make (YAMAHA)', 'Model year (2014)', 'Fuel (Gasoline)', 'GVWR class', 'Plant (Newnan, Georgia)'],
        blank: ['Model', 'Engine', 'Displacement', 'Horsepower', 'Drive'],
        errorText: '0 - VIN decoded clean; 14 - unable to provide information for some characters',
      },
    ],
  },
];

export const vehicleTypeBySlug = (slug: string) => VEHICLE_TYPES.find((t) => t.slug === slug);
