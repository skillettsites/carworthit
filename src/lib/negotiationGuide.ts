// Data behind /negotiate-used-car-price.
//
// Same rule as src/lib/negotiation.ts: never put a dollar value on a lever we
// have not measured. This page has no valuation to lean on, so every figure it
// shows is a typical range from a named source, fetched on the date recorded,
// and the page says so next to the number. Nothing here is a promise about a
// specific car; that is what the $9.99 bundle is for, because it prices the
// actual VIN against live local listings.
//
// Every entry in SOURCES was fetched on CHECKED_ON. Re-verify before changing
// a number, and change the date when you do.

export const CHECKED_ON = '2026-09-15';
export const CHECKED_ON_LABEL = 'September 15, 2026';

export interface Source {
  id: string;
  name: string;
  url: string;
  /** The date shown on the source itself, or the date we fetched it. */
  date: string;
  /** What we took from it, verbatim or near-verbatim. */
  quote: string;
}

export const SOURCES: Record<string, Source> = {
  crHaggle: {
    id: 'crHaggle',
    name: 'Consumer Reports, "Why Haggling for Your Next Car Really Pays"',
    url: 'https://www.consumerreports.org/used-car-buying/why-haggling-for-your-next-car-really-pays/',
    date: 'May 3, 2016 (survey of 1,006 used-car buyers)',
    quote:
      '70 percent of used-car buyers haggled over the price, succeeding 83 percent of the time, with the median savings being $900, or 8 percent less than the asking price. Simply asking for a better price worked for 68 percent of successful negotiators; sharing the value of similar cars researched online worked for 48 percent; threatening to walk away worked for 28 percent.',
  },
  nerdwallet: {
    id: 'nerdwallet',
    name: 'NerdWallet, "How to Negotiate a Used Car Price"',
    url: 'https://www.nerdwallet.com/auto-loans/learn/negotiating-basics-buying-car',
    date: 'December 23, 2025',
    quote:
      'If you know that the current market value of the car is $25,000, offer below that, perhaps $23,000. Raise your opening offer by smaller and smaller increments: $500, then $250, then $100. Negotiating as a monthly-payment buyer is a mistake since it obscures the price of the car. With a private seller, avoid a low-ball offer; ask "What is your best price?"',
  },
  nerdwalletPrivate: {
    id: 'nerdwalletPrivate',
    name: 'NerdWallet, "How To Buy a Used Car From a Private Seller"',
    url: 'https://www.nerdwallet.com/article/loans/auto-loans/tips-for-buying-a-used-car-from-a-private-seller',
    date: 'January 5, 2026',
    quote:
      'Cars sold by individuals usually sell for less than at a dealership. Private sellers may be more willing to negotiate than dealerships. Ensure the seller has the car title in their name; if there is still a loan on the car, obtain the payoff amount from their lender.',
  },
  edmunds: {
    id: 'edmunds',
    name: 'Edmunds Help Center, "When negotiating a purchase, how low of a price should I start out with?"',
    url: 'https://help.edmunds.com/hc/en-us/articles/206102507',
    date: 'fetched September 15, 2026',
    quote: 'For used cars, use our appraisal tool and start with $500 above the Trade-In value.',
  },
  kbb: {
    id: 'kbb',
    name: 'Kelley Blue Book, "How to Buy a Used Car in 10 Steps"',
    url: 'https://www.kbb.com/car-advice/10-steps-to-buying-a-used-car/',
    date: 'November 6, 2023',
    quote:
      'Be respectful and understand nobody wants a complete lowball offer. Treat the sale of your existing car as a separate transaction. Look for any extra fees on the bottom line; VIN etching is not necessary unless you want or ask for the service.',
  },
  haig: {
    id: 'haig',
    name: 'Haig Partners, Q2 2025 Haig Report (publicly traded dealership groups)',
    url: 'https://haigpartners.com/resources/used-vehicle-profits-steady-in-q2-2025-what-it-means-for-dealers-planning-their-next-move/',
    date: 'August 2025',
    quote: 'Used vehicle gross profit per vehicle retailed rose to $1,668, up from $1,642 in Q1 2025.',
  },
  caredge: {
    id: 'caredge',
    name: 'CarEdge (Ray Shefska, former dealer), "How Much Do Dealers Markup Used Cars?"',
    url: 'https://caredge.com/guides/how-much-do-dealers-markup-used-cars',
    date: 'February 6, 2020',
    quote:
      'Car dealers mark up used cars by between $1,500 and $3,000 on average. The idea is to sell or turn your inventory within 60 days of acquiring it; if a used car does not sell within 60 days (or at the max 90), off to the auction it goes. They are adjusting a used car\'s price downward every 10 days.',
  },
  progressive: {
    id: 'progressive',
    name: 'Progressive, "How to Negotiate a Used Car Price"',
    url: 'https://www.progressive.com/answers/negotiating-used-car-price/',
    date: 'August 15, 2023',
    quote:
      'Aim for paying the market value of the vehicle, since that is likely a fair price for both parties. If you cannot reach an agreement, do not be afraid to walk away. Leave your name and number with the salesperson and ask them to call if they change their mind.',
  },
  crTires: {
    id: 'crTires',
    name: 'Consumer Reports, "How to Save Money When Buying Replacement Tires" (47,706-member survey)',
    url: 'https://www.consumerreports.org/cars/tire-buying-maintenance/how-to-save-money-when-buying-replacement-tires-a6799675738/',
    date: 'October 14, 2025',
    quote:
      'CR members paid an average of $212 for their last tire. Their median installation cost per tire, among those who were charged, was $31.',
  },
  crInspect: {
    id: 'crInspect',
    name: 'Consumer Reports, "How to Inspect a Used Car to Avoid Costly Repairs"',
    url: 'https://www.consumerreports.org/cars/how-to-inspect-a-used-car-a1377126659/',
    date: 'March 20, 2026',
    quote:
      'A thorough diagnosis should cost around $100 to $150, but check the price in advance. You can then use the report when you begin to negotiate with the seller. Tires must have at least 1/16 inch of tread to be legal on the road.',
  },
  crBuy: {
    id: 'crBuy',
    name: 'Consumer Reports, "How to Buy a Used Car"',
    url: 'https://www.consumerreports.org/cars/buying-a-car/how-to-buy-a-used-car-a5221672417/',
    date: 'July 21, 2026',
    quote: 'Walking into a dealership with your financing already set up gives you a big leg up in the negotiations.',
  },
  repairpalBrakes: {
    id: 'repairpalBrakes',
    name: 'RepairPal, brake pad replacement cost estimate',
    url: 'https://repairpal.com/estimator/brake-pad-replacement-cost',
    date: 'estimates updated September 3, 2026',
    quote: 'The average cost for a Brake Pad Replacement is between $335 and $394.',
  },
  repairpalTimingBelt: {
    id: 'repairpalTimingBelt',
    name: 'RepairPal, timing belt replacement cost estimate',
    url: 'https://repairpal.com/estimator/timing-belt-replacement-cost',
    date: 'estimates updated September 3, 2026',
    quote: 'The average cost for a Timing Belt Replacement is between $918 and $1,338.',
  },
  fhwa: {
    id: 'fhwa',
    name: 'FHWA, Average Annual Miles per Driver by Age Group',
    url: 'https://www.fhwa.dot.gov/ohim/onh00/bar8.htm',
    date: 'fetched September 15, 2026',
    quote: 'Average annual miles per driver, all age groups: 13,476.',
  },
  nhtsaRecalls: {
    id: 'nhtsaRecalls',
    name: 'NHTSA recall campaign feed (recallsByVehicle)',
    url: 'https://api.nhtsa.gov/recalls/recallsByVehicle?make=ford&model=explorer&modelYear=2013',
    date: 'fetched September 15, 2026',
    quote: 'Campaign remedies in the feed state the repair is done "free of charge" (43 of 47 campaigns checked across four model years; the rest are label or notification remedies).',
  },
};

/** The numbers the calculator uses, each traceable to one SOURCES entry. */
export const FIGURES = {
  /** Consumer Reports: median saving among successful hagglers, as a share of asking price. */
  medianSavingPct: 8,
  medianSavingUsd: 900,
  haggledPct: 70,
  succeededPct: 83,
  tacticAskPct: 68,
  tacticResearchPct: 48,
  tacticWalkPct: 28,
  /** NerdWallet's worked example: the climb from opening to settled price is $500 + $250 + $100 on a $25,000 car. */
  nwClimbUsd: 850,
  nwExampleCar: 25000,
  nwOpeningUsd: 23000,
  /** Haig Partners: front-end gross per used vehicle at public dealer groups, Q2 2025. */
  dealerGrossUsd: 1668,
  /** CarEdge: typical dealer markup band on a used car. */
  dealerMarkupLow: 1500,
  dealerMarkupHigh: 3000,
  dealerTurnDaysLow: 60,
  dealerTurnDaysHigh: 90,
  /** Consumer Reports tire survey. */
  tireEachUsd: 212,
  tireInstallEachUsd: 31,
  /** RepairPal national ranges. */
  brakePadsLow: 335,
  brakePadsHigh: 394,
  timingBeltLow: 918,
  timingBeltHigh: 1338,
  /** Consumer Reports: a mechanic's pre-purchase diagnosis. */
  inspectionLow: 100,
  inspectionHigh: 150,
  /** FHWA average annual miles per driver. */
  milesPerYear: 13476,
} as const;

/** Derived, and shown as derived on the page. */
export const DERIVED = {
  /** NerdWallet's $850 climb on a $25,000 car, as a share of price. */
  climbPct: Math.round((FIGURES.nwClimbUsd / FIGURES.nwExampleCar) * 1000) / 10, // 3.4
  /** Four tires at the CR average, installed at the CR median. */
  tireSetUsd: 4 * (FIGURES.tireEachUsd + FIGURES.tireInstallEachUsd), // 972
  /** Midpoint of RepairPal's brake pad range. */
  brakePadsMidUsd: Math.round((FIGURES.brakePadsLow + FIGURES.brakePadsHigh) / 2), // 365
} as const;

export type SellerType = 'dealer' | 'private';

export interface OfferInput {
  asking: number;
  seller: SellerType;
  modelYear: number;
  mileage: number;
  issues: {
    recall: boolean;
    tires: boolean;
    brakes: boolean;
    service: boolean;
    cosmetic: boolean;
    noHistory: boolean;
  };
  /** A written quote the buyer already holds for outstanding work, in dollars. 0 if none. */
  quote: number;
}

export interface OfferLine {
  label: string;
  amount: number;
  why: string;
  source: string;
}

export interface OfferResult {
  opening: number;
  target: number;
  walkAway: number;
  /** Asking price minus quotable work. The number the percentages act on. */
  net: number;
  deductions: OfferLine[];
  /** Things to say that carry no dollar figure, because none has been measured. */
  leverage: { title: string; detail: string; source: string }[];
  /** The seller's likely answer, so you are not surprised by it. */
  sellerSide: { title: string; detail: string; source: string }[];
  reasons: { opening: string; target: string; walkAway: string };
  mileageNote: string | null;
}

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const round10 = (n: number) => Math.max(0, Math.round(n / 10) * 10);

/**
 * Pure arithmetic. No API, no valuation, no invented percentages: every step
 * names the source it leans on, and the page prints those reasons next to the
 * numbers.
 */
export function computeOffer(input: OfferInput, nowYear = new Date().getUTCFullYear()): OfferResult {
  const asking = Math.max(0, input.asking || 0);
  const deductions: OfferLine[] = [];
  const leverage: OfferResult['leverage'] = [];
  const sellerSide: OfferResult['sellerSide'] = [];

  // ---- Quotable work: the only money that comes off for a known issue ------
  if (input.issues.tires) {
    deductions.push({
      label: 'Four tires',
      amount: DERIVED.tireSetUsd,
      why: `${usd(FIGURES.tireEachUsd)} a tire plus ${usd(FIGURES.tireInstallEachUsd)} to fit each one, times four. A seller can check that figure in a minute, which is why it works.`,
      source: `${SOURCES.crTires.name}, ${SOURCES.crTires.date}`,
    });
  }
  if (input.issues.brakes) {
    deductions.push({
      label: 'Brake pads',
      amount: DERIVED.brakePadsMidUsd,
      why: `RepairPal's national range is ${usd(FIGURES.brakePadsLow)} to ${usd(FIGURES.brakePadsHigh)}; we use the midpoint. Rotors are extra, so get a quote if the pedal pulses.`,
      source: `${SOURCES.repairpalBrakes.name}, ${SOURCES.repairpalBrakes.date}`,
    });
  }
  const quote = Math.max(0, input.quote || 0);
  if (quote > 0) {
    deductions.push({
      label: 'Your written quote',
      amount: quote,
      why: 'Work you have already had priced by a shop. A quote on paper is the strongest deduction there is, because the seller can read it.',
      source: 'Your own quote',
    });
  }
  if (input.issues.service && quote === 0) {
    leverage.push({
      title: 'A major service is due',
      detail: `We have not put a number on this because it depends entirely on the car. As a guide, RepairPal's national range for a timing belt is ${usd(FIGURES.timingBeltLow)} to ${usd(FIGURES.timingBeltHigh)}. Get the dealer's or an independent shop's quote for the service that is due and enter it above; then it comes off all three prices.`,
      source: `${SOURCES.repairpalTimingBelt.name}, ${SOURCES.repairpalTimingBelt.date}`,
    });
  }
  if (input.issues.cosmetic && quote === 0) {
    leverage.push({
      title: 'Cosmetic damage',
      detail:
        'Dents, scuffs and curbed wheels are a fair thing to point at, but there is no typical price for them, so we have not invented one. A body shop will quote it for free; enter that quote above and it comes off every number.',
      source: 'No sourced national figure; use a quote',
    });
  }

  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  const net = Math.max(0, asking - totalDeductions);

  // ---- The three numbers ---------------------------------------------------
  //
  // Target: Consumer Reports' median result among buyers who haggled and won
  // was 8% ($900) under asking. On a dealer car the saving is also capped by
  // what dealers actually make on a used car, because no dealer sells below
  // what they paid plus reconditioning.
  const crSaving = net * (FIGURES.medianSavingPct / 100);
  const targetSaving = input.seller === 'dealer' ? Math.min(crSaving, FIGURES.dealerGrossUsd) : crSaving;
  // Opening: below the target by NerdWallet's climb, $850 on a $25,000 car
  // (3.4%), so there is room to move up in shrinking steps. On a dealer car the
  // opening saving is capped at the top of CarEdge's markup band.
  const climb = net * (DERIVED.climbPct / 100);
  const openingSaving =
    input.seller === 'dealer' ? Math.min(targetSaving + climb, FIGURES.dealerMarkupHigh) : targetSaving + climb;

  let opening = round10(net - openingSaving);
  let target = round10(net - targetSaving);
  // Walk-away: the advertised price less the work you can prove it needs. Above
  // that you are paying more than they asked for a car you know needs money.
  const walkAway = round10(net);
  if (target > walkAway) target = walkAway;
  if (opening > target) opening = target;

  const dealerCap = input.seller === 'dealer' && crSaving > FIGURES.dealerGrossUsd;
  const reasons = {
    opening:
      input.seller === 'dealer'
        ? `${usd(opening)} is ${usd(net - opening)} under the ${totalDeductions > 0 ? 'price after known work' : 'asking price'}: the target saving plus room to climb in shrinking steps (${DERIVED.climbPct}% of the price, NerdWallet's $500, $250, $100 example scaled to this car), never more than ${usd(FIGURES.dealerMarkupHigh)}, the top of the markup band a former dealer describes${openingSaving >= FIGURES.dealerMarkupHigh ? ', which is the limit here' : ''}. It is low enough to leave room and high enough that a dealer knows you are serious.`
        : `${usd(opening)} is ${usd(net - opening)} under the ${totalDeductions > 0 ? 'price after known work' : 'asking price'}: the target saving plus ${DERIVED.climbPct}% of room to climb in shrinking steps (NerdWallet's $500, $250, $100 example on a $25,000 car, scaled). A private seller has no floor other than their own needs, so there is no cap here.`,
    target: dealerCap
      ? `${usd(target)} is ${usd(FIGURES.dealerGrossUsd)} under. Eight percent would be ${usd(crSaving)}, but public dealer groups made a front-end gross of about ${usd(FIGURES.dealerGrossUsd)} per used car in Q2 2025, and a dealer will not sell for less than they have in it. Expect them to protect some of that gross.`
      : `${usd(target)} is ${FIGURES.medianSavingPct}% under: Consumer Reports found the median successful haggle saved ${FIGURES.medianSavingPct}% (${usd(FIGURES.medianSavingUsd)}) off the asking price, and 83% of buyers who haggled got something.`,
    walkAway:
      totalDeductions > 0
        ? `${usd(walkAway)} is the asking price less the ${usd(totalDeductions)} of work you can prove it needs. Paying more means paying the advertised price for a car that is not yet in advertised condition. To set a tighter ceiling you need to know what comparable cars near you are listed at, which this page cannot see.`
        : `${usd(walkAway)} is their own advertised price. Never pay above it: a seller who raises the price once you are interested is telling you something. To set a tighter ceiling you need to know what comparable cars near you are listed at, which this page cannot see.`,
  };

  // ---- Leverage without a dollar value ------------------------------------
  if (input.issues.recall) {
    leverage.push({
      title: 'An open safety recall',
      detail:
        'Not money off, a condition. The repair is free at a franchised dealer, so ask for the work to be done and the paperwork handed over before you pay. A seller who will not spend a free afternoon on a safety recall tells you how the rest of the car has been treated.',
      source: `${SOURCES.nhtsaRecalls.name}, ${SOURCES.nhtsaRecalls.date}`,
    });
  }
  if (input.issues.noHistory) {
    leverage.push({
      title: 'No service history',
      detail: `There is no typical price for missing paperwork, so it does not move the numbers. What it does is raise the odds that the car needs money, which is why the ${usd(FIGURES.inspectionLow)} to ${usd(FIGURES.inspectionHigh)} pre-purchase inspection stops being optional. Say that out loud: "With no records I will need an inspection before I can go further."`,
      source: `${SOURCES.crInspect.name}, ${SOURCES.crInspect.date}`,
    });
  }
  if (input.seller === 'dealer') {
    leverage.push({
      title: 'How long it has been on the lot',
      detail: `Most dealers work to a ${FIGURES.dealerTurnDaysLow} to ${FIGURES.dealerTurnDaysHigh} day turn and cut the price every 10 days or so. Ask when the car came in. Past ${FIGURES.dealerTurnDaysLow} days it is costing them money to keep.`,
      source: `${SOURCES.caredge.name}, ${SOURCES.caredge.date}`,
    });
    sellerSide.push({
      title: 'They have less room than you think on a cheap car',
      detail: `A used car earns a dealer about ${usd(FIGURES.dealerGrossUsd)} in front-end gross on average. On a low-priced car that gross may be most of the room there is, so a refusal at your opening is not a bluff. Move to the target and hold there.`,
      source: `${SOURCES.haig.name}, ${SOURCES.haig.date}`,
    });
  } else {
    leverage.push({
      title: 'Ask for their best price before you make an offer',
      detail:
        'With a private seller, a lowball can end the conversation. "What is your best price?" gets them to move first, and whatever they say becomes your new asking price to work from.',
      source: `${SOURCES.nerdwallet.name}, ${SOURCES.nerdwallet.date}`,
    });
    sellerSide.push({
      title: 'They are already cheaper than a dealer',
      detail:
        'Cars sold by individuals usually sell for less than at a dealership, and a private seller knows it. Lead on the car and the checks, not on "dealers are charging more".',
      source: `${SOURCES.nerdwalletPrivate.name}, ${SOURCES.nerdwalletPrivate.date}`,
    });
  }

  // ---- Mileage against age: context, never money ---------------------------
  // Only for cars up to ten years old. The FHWA figure is miles per DRIVER per
  // year, and older cars are driven less each year than new ones, so past a
  // decade the multiplication says a 2010 car "should" have 215,000 miles,
  // which is nonsense a seller would rightly laugh at.
  let mileageNote: string | null = null;
  const age = nowYear - input.modelYear;
  if (Number.isFinite(age) && age >= 1 && age <= 10 && input.mileage > 0) {
    const expected = age * FIGURES.milesPerYear;
    if (input.mileage > expected * 1.15) {
      mileageNote = `${input.mileage.toLocaleString('en-US')} miles is above the roughly ${expected.toLocaleString('en-US')} a ${age}-year-old US car has typically covered (FHWA average, ${FIGURES.milesPerYear.toLocaleString('en-US')} miles a year). The asking price already reflects the mileage, so this is not more money off; it is a condition argument and a reason to insist on the inspection.`;
    } else if (input.mileage < expected * 0.8) {
      mileageNote = `${input.mileage.toLocaleString('en-US')} miles is below the roughly ${expected.toLocaleString('en-US')} a ${age}-year-old US car has typically covered (FHWA average). Expect the seller to lead with that; the answer is that a car that has sat needs its seals, tires and service dates checked just as carefully.`;
    }
  }

  return { opening, target, walkAway, net, deductions, leverage, sellerSide, reasons, mileageNote };
}
