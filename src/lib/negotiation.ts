// The Negotiation Bundle: the top tier's reason to exist.
//
// Everything here is DERIVED. It invents no data. Each lever restates a figure
// the report already shows, in the form of an argument the buyer can make out
// loud, with the source attached so they can defend it if challenged.
//
// Two rules this file must keep:
//
//  1. NEVER put a dollar value on a lever we have not measured. Saying "knock
//     $400 off for the recalls" would be a fabricated number, and a buyer who
//     repeats it to a dealer gets corrected and loses the room. Levers carry a
//     figure only where a real one exists.
//
//  2. NEVER discount twice for mileage. Carketa prices this car AT the buyer's
//     odometer reading, so mileage is already inside the average. Mileage
//     appears here as condition context, never as money off the valuation.
//
// ⚠️ LICENCE. Only the average, low and high price may be shown. The comparable
// listings themselves, days-on-market and the comparables' mileage range are
// trade-only. Nothing in this file may reference them.
import type { FactoryData, FreeReport, MarketValuation } from './types';
import { depreciation } from './worthit-report';

/** FHWA average annual mileage for US drivers, used to judge use against age. */
const US_MILES_PER_YEAR = 13500;

/**
 * Below this, the gap between the target and the asking price is not worth
 * describing as a negotiation. Used to stop the pack promising "real room here"
 * over a few dollars of arithmetic.
 */
const MEANINGFUL_ROOM = 100;

export interface NegotiationLever {
  title: string;
  detail: string;
  /** Attribution, shown small. Every lever is traceable to a source. */
  source: string;
  /**
   * Is this a reason to pay LESS, or just context?
   *
   * The distinction matters because the script quotes a lever back at the
   * seller. Mileage and running costs are deliberately NOT price arguments:
   * the valuation is already struck at the buyer's odometer reading, so using
   * mileage to push the price down again is double-counting, and each of those
   * levers says so in its own body. Quoting them as the price justification
   * contradicted the lever the buyer was reading.
   */
  priceArgument: boolean;
  /**
   * The line to actually say out loud. Titles are written to be scanned, not
   * spoken: "1 open safety recall on this year, make and model" is a database
   * row, and the script used to put it in quotation marks as dialogue.
   */
  say?: string;
}

export interface NegotiationPack {
  askingPrice: number | null;
  /** Where to open. Anchored on the cheapest comparable listed locally. */
  opening: number;
  /** What a well-argued negotiation should land at. */
  target: number;
  /** Above this, buy a different car. */
  walkAway: number;
  /** Asking price minus target, when we know the asking price. */
  savingAtTarget: number | null;
  /** How the three numbers above were reached, stated in full. */
  basis: string;
  /** Arguments that push the price down. */
  levers: NegotiationLever[];
  /** Arguments the seller has. Knowing them is half of not losing to them. */
  sellerLevers: NegotiationLever[];
  /** What to say, in order. */
  script: { step: string; say: string }[];
  /** Do these before money changes hands. */
  checks: string[];
}

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

/**
 * Elapsed months since the car was built, deliberately UNDER-estimated.
 *
 * We only have the model year, not the build date. This assumes the latest
 * plausible build, the end of the model year, which is the safe direction: it
 * makes the car look as young as it could be, so a warranty is never called
 * expired when it might still be running.
 *
 * An earlier version assumed January of the model year and its comment claimed
 * that was conservative. It was the opposite. A 2023 car built in November is
 * 33 months old in August 2026, but January maths returned 43, which was enough
 * to declare a 36-month warranty dead and tell the buyer "every repair from
 * here is yours" about a car still under cover.
 */
function monthsSinceNew(year: string | undefined): number | null {
  const y = Number(year);
  if (!Number.isFinite(y) || y < 1980) return null;
  const now = new Date();
  const months = (now.getUTCFullYear() - y) * 12 + now.getUTCMonth() - 11;
  return months >= 0 ? months : 0;
}

/** 9,999,999 is the feed's sentinel for unlimited-mileage cover. */
const UNLIMITED_MILES = 999999;

type Warranty = { type: string; months: number | null; miles: number | null };

const WARRANTY_NAMES: Record<string, string> = {
  total: 'bumper-to-bumper',
  basic: 'bumper-to-bumper',
  powertrain: 'powertrain',
  anti_corrosion: 'anti-corrosion',
  corrosion: 'anti-corrosion',
  roadside_assistance: 'roadside assistance',
  emissions: 'emissions',
  hybrid: 'hybrid components',
};
const warrantyName = (t: string) => WARRANTY_NAMES[t.toLowerCase()] || t.replace(/_/g, ' ');

const warrantyTerms = (w: Warranty) =>
  [
    w.months ? `${w.months} months` : null,
    w.miles && w.miles < UNLIMITED_MILES ? `${w.miles.toLocaleString('en-US')} miles` : null,
  ]
    .filter(Boolean)
    .join(' / ');

/**
 * Split the warranty record into what has certainly lapsed and what may remain.
 *
 * Judging the whole warranty from a single entry produced a flatly false claim:
 * a car past 36,000 miles on bumper-to-bumper was told "the factory warranty
 * has run out, every repair from here is yours" while the spec table further
 * down the same page still showed powertrain cover running to 60,000 miles.
 * Powertrain is precisely the expensive repair that sentence was about.
 */
function classifyWarranties(factory: FactoryData | null, mileage: number, ageMonths: number | null) {
  const all = (factory?.warranty || []).filter((w) => w.months || w.miles);
  const expired: Warranty[] = [];
  const live: Warranty[] = [];
  for (const w of all) {
    const outOnMiles = w.miles !== null && w.miles < UNLIMITED_MILES && mileage > w.miles;
    // Age is an under-estimate, so only trust it to prove expiry, never to
    // prove cover is still running.
    const outOnTime = w.months !== null && ageMonths !== null && ageMonths > w.months;
    if (outOnMiles || outOnTime) expired.push(w);
    else live.push(w);
  }
  return { all, expired, live };
}

export function buildNegotiationPack(
  free: FreeReport,
  valuation: MarketValuation,
  factory: FactoryData | null,
  askingPrice: number | null,
): NegotiationPack {
  const { averagePrice, lowPrice, highPrice, zip, mileage } = valuation;
  const asking = askingPrice && askingPrice > 0 ? askingPrice : null;

  // ---- The three numbers -------------------------------------------------
  //
  // All three come from the local range and nothing else, so every one of them
  // can be defended with a sentence. Where the feed gave no range we widen off
  // the average using fixed, stated percentages rather than pretending to a
  // precision we do not have.
  // Anchoring only needs the LOW bound, so key off that rather than demanding
  // both. Requiring both meant a feed that returned a low but no high made the
  // pack say "no spread, open 10% under the average" and anchor at $18,000
  // while the report rendered a "$15,000 lowest asking price" tile directly
  // above it: the two halves of the same page disagreeing by $3,000.
  const hasRange = lowPrice !== null;
  let opening = hasRange ? lowPrice! : Math.round(averagePrice * 0.9);
  let target = hasRange
    ? Math.round((lowPrice! + averagePrice) / 2)
    : Math.round(averagePrice * 0.95);
  // Never advise paying more than they asked for. Without this floor, a seller
  // priced under the local market gets a "walk away above" figure ABOVE their
  // own asking price, which reads as permission to bid against yourself.
  let walkAway = asking !== null ? Math.min(averagePrice, asking) : averagePrice;

  // Two ways the default numbers can be wrong for the deal in front of you.
  //
  // `belowCheapest`: the seller is asking less than the cheapest comparable car
  // we can see. The untreated version told a buyer to open at $15,999 on a car
  // advertised at $14,000, and reported the resulting $3,613 loss as a saving.
  //
  // `underTarget`: the ask is under our midpoint but still above the cheapest
  // comparable, so there IS room, just less than the default assumed. Aiming at
  // their own price would throw that room away.
  // `atOrBelowFloor` also catches the ask sitting EXACTLY on our opening number,
  // which used to collapse opening, target and walkAway onto one figure while
  // the copy still promised "there is real room here" and told the buyer to
  // "expect to meet somewhere above your opening".
  let belowCheapest = asking !== null && asking <= opening;
  let underTarget = asking !== null && !belowCheapest && asking < target;
  if (belowCheapest) {
    opening = Math.round(asking! * 0.95);
    target = asking!;
    walkAway = asking!;
  } else if (underTarget) {
    target = Math.round((opening + asking!) / 2);
    // If the midpoint lands within a rounding error of their asking price there
    // is no negotiation to describe. Promising "real room here" over $1 of room
    // reads as padding, so fall through to the honest already-keen copy.
    if (asking! - target < MEANINGFUL_ROOM) {
      underTarget = false;
      belowCheapest = true;
      target = asking!;
      opening = Math.round(asking! * 0.95);
      walkAway = asking!;
    }
  }

  const spread =
    lowPrice !== null && highPrice !== null
      ? `are listed from ${usd(lowPrice)} to ${usd(highPrice)}, averaging ${usd(averagePrice)}`
      : lowPrice !== null
        ? `start at ${usd(lowPrice)} and average ${usd(averagePrice)}`
        : highPrice !== null
          ? `average ${usd(averagePrice)} and reach ${usd(highPrice)}`
          : `average ${usd(averagePrice)}`;
  const near = `Comparable cars near ZIP ${zip} at around ${mileage.toLocaleString('en-US')} miles ${spread}.`;

  // The ceiling is the average, EXCEPT when the seller is asking less than the
  // average, in which case it is their own price. The reason has to follow the
  // number: a flat "pay more and you are paying above the typical local car"
  // was plainly false on a car asking $18,500 against a $19,226 average, which
  // is the most common case of all.
  const ceilingIsAsk = asking !== null && walkAway === asking;
  const ceiling = ceilingIsAsk
    ? `${usd(walkAway)} is your ceiling, because that is their own advertised price and a seller who raises it once you are interested is telling you something.`
    : `${usd(walkAway)} is your ceiling: pay more and you are paying above the typical local car for no stated reason.`;

  // "The cheapest comparable car" only exists when the feed gave us a low. With
  // no range, `opening` is just 90% of the average and must be described as
  // that, not as a real listing we can see.
  const floorPhrase = hasRange ? 'the cheapest comparable car near you' : 'the bottom of the local range';
  const belowAll = hasRange ? 'already under all of it' : 'already under the local average';

  const basis = belowCheapest
    ? `${near} At ${usd(asking!)} this seller is ${belowAll}, so there is little room to argue on price and not much point trying hard. Your job here is not to talk the number down, it is to find out why it is that low before you commit. Open at ${usd(opening)} to see if there is anything there, take ${usd(asking!)} if there is not, and do not let anyone talk you above it.`
    : underTarget
      ? `${near} At ${usd(asking!)} they are already asking under the local average, but still above ${floorPhrase}, so aim between the two: ${usd(target)}. There is real room here, just less of it than usual. ${ceiling}`
      : hasRange
        ? `${near} Your opening number is the cheapest of them, your target is halfway between that and the average, and ${ceiling}`
        : `${near} The feed gave no spread for this one, so we have not invented one: open 10% under the average, aim 5% under, and ${ceiling}`;

  // ---- Levers ------------------------------------------------------------
  const levers: NegotiationLever[] = [];
  const sellerLevers: NegotiationLever[] = [];

  if (asking !== null) {
    if (asking > averagePrice) {
      const over = asking - averagePrice;
      levers.push({
        title: `It is ${usd(over)} over the local average`,
        detail: hasRange
          ? `The seller wants ${usd(asking)}. Comparable cars near ${zip} average ${usd(averagePrice)} and start at ${usd(lowPrice!)}. That gap is the single strongest thing you have, because it is a fact about their price rather than an opinion about their car.`
          : `The seller wants ${usd(asking)} against a local average of ${usd(averagePrice)}. That gap is the strongest thing you have: it is a fact about their price, not an opinion about their car.`,
        source: 'Local market pricing, licensed US vehicle-pricing provider',
        priceArgument: true,
        say: `I have looked at what comparable cars are going for near me at this mileage, and they are averaging ${usd(averagePrice)}. You are asking ${usd(asking)}.`,
      });
    }
    if (highPrice !== null && asking > highPrice) {
      levers.push({
        title: 'It is priced above every comparable car near you',
        detail: `At ${usd(asking)} this is above the dearest comparable car we can see near ${zip}, which tops out at ${usd(highPrice)}. Say that plainly and ask what justifies it. If the answer is not specification or exceptional condition, there is no answer.`,
        source: 'Local market pricing, licensed US vehicle-pricing provider',
        priceArgument: true,
        say: `I cannot find a comparable car near me listed above ${usd(highPrice as number)}, and you are asking ${usd(asking)}.`,
      });
    }
    if (asking <= averagePrice) {
      sellerLevers.push({
        title: 'They are already at or under the local average',
        detail: `At ${usd(asking)} against an average of ${usd(averagePrice)}, the seller has a fair answer to "it is too expensive". Do not lead on price here. Lead on condition, on the checks below, and on being ready to buy today.`,
        source: 'Local market pricing, licensed US vehicle-pricing provider',
        priceArgument: false,
      });
    }
  }

  const recalls = free.recalls;
  if (recalls && recalls.length > 0) {
    const many = recalls.length > 1;
    // NHTSA components arrive as colon-delimited trade strings, e.g.
    // "AIR BAGS:SENSOR:OCCUPANT CLASSIFICATION". Only the first segment means
    // anything to a buyer, and reading the raw string out to a seller is a fast
    // way to sound like you are reciting a database rather than making a point.
    const component = recalls[0].component.split(':')[0].trim().toLowerCase() || 'a safety component';
    levers.push({
      title: `${recalls.length} open safety ${many ? 'recalls' : 'recall'} on this year, make and model`,
      detail: `NHTSA lists ${many ? `${recalls.length} outstanding campaigns, one of them covering` : 'an outstanding campaign covering'} ${component}. The repair is free at a franchised dealer, so this is not money off, it is leverage: say the car should not change hands with ${many ? 'open campaigns' : 'an open campaign'} and ask them to have the work done and the paperwork handed over before you pay. A seller who will not spend a free afternoon on a safety recall tells you how the rest of the car has been treated.`,
      source: 'NHTSA recall campaigns',
      priceArgument: false,
      say: `There ${many ? 'are open safety recalls' : 'is an open safety recall'} on this one. I would want the work done and the paperwork with it before I collect.`,
    });
  }

  const age = monthsSinceNew(factory?.year || free.specs.year);
  const { all: allWarranties, expired: expiredW, live: liveW } = classifyWarranties(factory, mileage, age);
  if (allWarranties.length > 0) {
    const names = (list: Warranty[]) => {
      const seen: string[] = [];
      for (const w of list) {
        const n = warrantyName(w.type);
        if (!seen.includes(n)) seen.push(n);
      }
      return seen.length > 1 ? `${seen.slice(0, -1).join(', ')} and ${seen[seen.length - 1]}` : seen[0];
    };

    if (expiredW.length > 0 && liveW.length === 0) {
      // Everything has lapsed. Only now is the blanket claim true.
      levers.push({
        title: 'The factory warranty has run out',
        detail: `Every part of the original cover has lapsed, including ${names(expiredW)} at ${warrantyTerms(expiredW[0])}. Every repair from here is yours, and the five-year running-cost estimate in this report is what that looks like. You are buying a car with no manufacturer backstop, and the price should reflect that rather than the showroom one.`,
        source: 'Manufacturer build record for this VIN',
        priceArgument: true,
        say: `The factory warranty has run out on this one, so anything that goes wrong from here is on me.`,
      });
    } else if (expiredW.length > 0) {
      // The common and most useful case: bumper-to-bumper gone, powertrain not.
      // Saying "the warranty has run out" here would contradict the spec table
      // further down this same report.
      levers.push({
        title: `The ${names(expiredW)} cover has run out`,
        detail: `The ${names(expiredW)} warranty ran ${warrantyTerms(expiredW[0])} and this car is past it, so day-to-day faults are now yours to pay for. The ${names(liveW)} cover may still apply, which is worth confirming with a franchised dealer against the VIN, but it will not cover the electrics, trim and wear items that actually go wrong at this age.`,
        source: 'Manufacturer build record for this VIN',
        priceArgument: true,
        say: `The bumper-to-bumper cover has run out on this one, so the day-to-day faults are on me from here.`,
      });
    } else {
      sellerLevers.push({
        title: 'Factory warranty may still be running',
        detail: `The original ${names(liveW)} cover ran ${warrantyTerms(liveW[0])} and at ${mileage.toLocaleString('en-US')} miles this car appears to be inside it. Expect the seller to make the most of that, and it is a fair point. Confirm it with a franchised dealer against the VIN before you let it move your number, because cover runs from first registration, not from the model year on the paperwork.`,
        source: 'Manufacturer build record for this VIN',
        priceArgument: false,
      });
    }
  }

  const dep = depreciation(factory, valuation);
  if (dep) {
    levers.push({
      title: `It has already lost ${usd(dep.lost)} of its sticker price`,
      detail: `This car stickered at ${usd(dep.paidNew)} new and is worth about ${usd(dep.worthNow)} now, a fall of ${dep.pct}%. That is the useful half of buying used, and it is also the argument against paying a premium: the curve does not stop the day you sign.`,
      source: 'Manufacturer build record for this VIN, against local market pricing',
      priceArgument: false,
    });
  }

  const o = free.ownership;
  if (o) {
    const fiveYear =
      (free.runningCosts?.annualFuelCost ? o.fuel : 0) +
      o.insurance +
      o.maintenance +
      o.repairs +
      o.taxesFees;
    levers.push({
      title: `Running it costs about ${usd(fiveYear)} over five years`,
      detail: `On top of whatever you pay for it, before depreciation. ${free.runningCosts?.annualFuelCost ? 'Only the fuel figure is specific to this car; the rest are' : 'We had no EPA fuel figure for this car, so fuel is excluded entirely and the rest are'} US national averages scaled for its age. It is a fair thing to say out loud when a seller treats the sticker as the whole cost.`,
      source: 'EPA fuel economy, plus our own running-cost estimate',
      priceArgument: false,
    });
  }

  if (age !== null && age >= 12) {
    const expected = Math.round((age / 12) * US_MILES_PER_YEAR);
    if (mileage > expected * 1.15) {
      levers.push({
        title: 'It has done more miles than average for its age',
        detail: `${mileage.toLocaleString('en-US')} miles against roughly ${expected.toLocaleString('en-US')} for a US car of this age. The valuation above already accounts for the mileage, so this is not more money off. It is a condition argument: more miles means more wear, and it narrows the pool of buyers if you ever sell it on.`,
        source: 'FHWA average annual mileage, about 13,500 miles a year',
        priceArgument: false,
      });
    } else if (mileage < expected * 0.8) {
      sellerLevers.push({
        title: 'It is a low-mileage example and they know it',
        detail: `${mileage.toLocaleString('en-US')} miles against roughly ${expected.toLocaleString('en-US')} for its age. This is the seller's best card and it is a legitimate one. The counter is that low mileage brings its own problems on any car that has sat: perished seals, flat spots, and servicing done by the calendar rather than the odometer. Ask for the service history.`,
        source: 'FHWA average annual mileage, about 13,500 miles a year',
        priceArgument: false,
      });
    }
  }

  const stars = free.safety?.overall;
  if (typeof stars === 'number' && stars > 0 && stars <= 3) {
    levers.push({
      title: `${stars}-star NHTSA overall safety rating`,
      detail: `Below the 4 and 5 stars most of this class carries. It is a real reason to prefer something else, which makes it a real reason for them to move on price.`,
      source: 'NHTSA New Car Assessment Program',
      priceArgument: true,
      say: `This one only scores ${stars} out of 5 with NHTSA, which is below most of what else I am looking at.`,
    });
  }

  if (factory?.installedOptions?.length) {
    const optCount = factory.installedOptions.length;
    sellerLevers.push({
      title: `It was built with ${optCount} factory ${optCount === 1 ? 'option' : 'options'}`,
      detail: `Listed in full in this report${factory.optionsMsrp ? `, and they added ${usd(factory.optionsMsrp)} to the sticker when new` : ''}. Expect this to be quoted at you. The answer is that factory options fade fast in the used market and are already inside the local average above, so they are not a reason to pay over it. Do check the car actually has them.`,
      source: 'Manufacturer build record for this VIN',
      priceArgument: false,
    });
  }

  // ---- The script --------------------------------------------------------
  //
  // Only a lever that is BOTH a genuine price argument and has a spoken line
  // can be quoted here. The old version quoted `levers[0].title` verbatim as
  // dialogue, which produced things nobody says out loud ("1 open safety recall
  // on this year, make and model") and, worse, told the buyer to lead on
  // mileage or running costs, whose own bodies say they are not money off.
  const leadLever = levers.find((l) => l.priceArgument && l.say);
  const script: { step: string; say: string }[] = [
    {
      step: 'Open',
      say: `"I have looked at what comparable cars are going for near me at this mileage. I am interested, and I can move quickly. Where can you get to on price?" Then stop talking. Whoever speaks next gives up ground, and it does not have to be you.`,
    },
    {
      step: 'Anchor',
      say: belowCheapest
        ? `"I was thinking ${usd(opening)}." Worth one try, said once and without pressing. They are already under the local market and they probably know it, so if the answer is no, take the no.`
        : `"I was thinking ${usd(opening)}."${hasRange ? ' That is not a random low-ball, it is what the cheapest comparable car near you is listed at, and you can say exactly that if they push back.' : ' That is 10% under the local average, which is a normal opening rather than an insult.'}`,
    },
  ];
  if (leadLever) {
    script.push({
      step: 'Justify',
      say: `"${leadLever.say}" Give them one reason, not five. A single specific fact lands; a list sounds like haggling and invites them to argue the weakest item on it.`,
    });
  } else {
    // No price argument exists for this car, so do not manufacture one. The
    // honest play is readiness rather than a fabricated grievance.
    script.push({
      step: 'Justify',
      say: `There is no obvious fault to point at on this one, so do not invent one. Sellers hear manufactured complaints all day. "I am ready to buy today if we can get to the right number" is worth more than a weak criticism of their car.`,
    });
  }
  script.push(
    {
      step: 'Land',
      // The "between the cheapest comparable and the average" justification is
      // only true when the feed actually gave us a range. With no low or high
      // there is no cheapest comparable to sit between, so that branch has to
      // justify the number a different way.
      say: belowCheapest
        ? `${usd(target)} is the asking price and it is already below the local market, so landing there is a good result. Spend the effort you would have spent haggling on the inspection instead.`
        : hasRange
          ? `Expect to meet somewhere above your opening. ${usd(target)} is a good outcome and is genuinely defensible: it sits between the cheapest comparable car near you and the local average.`
          : `Expect to meet somewhere above your opening. ${usd(target)} is a good outcome: it is modestly under the local average, which is a normal place for a negotiated private sale to land.`,
    },
    {
      step: 'Close',
      say: `"${usd(target)} and I will take it${
        recalls && recalls.length > 0
          ? `, with the open ${recalls.length === 1 ? 'recall' : 'recalls'} done before I collect`
          : ' today'
      }." Give them a yes to say. A number with a condition attached is easier to accept than a number on its own.`,
    },
    {
      step: 'Walk',
      // Same trap as the basis copy: "you are paying more than the typical
      // comparable car" is false whenever the ceiling is the seller's own
      // below-average asking price, which is the commonest case of all.
      say: ceilingIsAsk
        ? `Do not go above ${usd(walkAway)}. That is what they advertised it at, and a seller who raises the price once you are interested is telling you something. "That is not what was advertised, thanks for your time" is a complete sentence.`
        : `Above ${usd(walkAway)} you are paying more than the typical comparable car near ${zip}${hasRange ? ', and there are cheaper ones listed' : ''}. "That is more than I can justify, thanks for your time" is a complete sentence. Leaving is the only leverage that always works, and sellers do call back.`,
    },
  );

  // ---- Checks ------------------------------------------------------------
  const checks = [
    'Match the VIN on the dashboard, the door jamb and the title. Three places, and they must agree.',
    'Run the title and salvage history through an NMVTIS-approved provider. We do not sell that and this report does not cover it.',
    'Get an independent pre-purchase inspection. About $150, and it is the cheapest money in the whole transaction.',
    'Check the odometer reading against the service records and the title, not just against the seller.',
  ];
  if (recalls && recalls.length > 0) {
    const one = recalls.length === 1;
    checks.unshift(
      `Confirm the ${recalls.length} open ${one ? 'recall' : 'recalls'} against this exact VIN at nhtsa.gov/recalls, and get ${one ? 'it' : 'them'} done before you pay.`,
    );
  }
  if (belowCheapest) {
    checks.unshift(
      'This car is priced under the local market. That is either a motivated seller or a problem, and the inspection is what tells you which. Do not skip it because the price looks good.',
    );
  }
  if (recalls === null) {
    checks.unshift(
      'We could not reach NHTSA to check recalls. Check this VIN yourself at nhtsa.gov/recalls before you commit.',
    );
  }
  checks.push('Ask why they are selling, then ask again later in the conversation. The answers should match.');

  return {
    askingPrice: asking,
    opening,
    target,
    walkAway,
    savingAtTarget: asking !== null ? asking - target : null,
    basis,
    levers,
    sellerLevers,
    script,
    checks,
  };
}
