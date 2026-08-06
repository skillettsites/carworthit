import Stripe from 'stripe';
import {
  HAS_STRIPE,
  CURRENCY,
  SITE_NAME,
  PRODUCTS,
  upgradePriceCents,
  type ProductId,
  isProductId,
} from './constants';
import { ladderTotalCents, ladderFullCents, derivedSessionId, vinsFromMetadata } from './multi-vin';

const stripe = HAS_STRIPE ? new Stripe(process.env.STRIPE_SECRET_KEY as string) : null;

/**
 * What the buyer told us, carried through Stripe and read back after payment.
 *
 * Stripe metadata is the right home for this. It survives the redirect, it
 * cannot be tampered with by the customer, and it means we do not need our own
 * session store just to remember three numbers. Values are strings because
 * Stripe metadata is string-only.
 */
/** One vehicle in an order. Every vehicle needs its own odometer reading. */
export interface Vehicle {
  vin: string;
  mileage: number;
  asking: number | null;
}

export interface CheckoutContext {
  vin: string;
  mileage: number;
  zip: string;
  asking: number | null;
  /**
   * Additional vehicles in the same order, beyond the first.
   *
   * Each carries its OWN mileage, because the pricing feed takes VIN, ZIP and
   * odometer reading per vehicle and one reading cannot describe five cars.
   * ZIP is shared: it is the buyer's market, not the car's.
   */
  extras?: Vehicle[];
}

export async function createCheckout(
  product: ProductId,
  ctx: CheckoutContext,
  origin: string,
  /**
   * The tier this buyer already paid for, if this is an upgrade. Verified
   * against Stripe by the caller, never taken from the client.
   */
  upgradeFrom?: { product: ProductId; sessionId: string },
): Promise<{ url: string }> {
  const p = PRODUCTS[product];
  if (!stripe) return { url: `/report/${ctx.vin}` };

  // Charge the DIFFERENCE on an upgrade, not the full price again. The tiers
  // are cumulative, so billing $6.99 for the Full Report to someone who
  // already paid $2.99 for the Valuation inside it charges them twice for
  // the same valuation.
  //
  // `upgradePriceCents` is shared with the buy form so the price quoted and the
  // price charged cannot drift apart, and it refuses a credit that would leave
  // a charge under Stripe's minimum.
  const extras = ctx.extras ?? [];
  const vehicleCount = 1 + extras.length;

  // Upgrades and multi-vehicle baskets are deliberately exclusive. An upgrade
  // credits one specific earlier purchase of one specific VIN, so spreading
  // that credit across a basket has no defensible meaning. The API refuses the
  // combination rather than guessing.
  const amount =
    vehicleCount > 1
      ? ladderTotalCents(product, vehicleCount)
      : upgradePriceCents(product, upgradeFrom ? upgradeFrom.product : null);
  const credited = vehicleCount > 1 ? 0 : p.cents - amount;
  const saved = vehicleCount > 1 ? ladderFullCents(product, vehicleCount) - amount : 0;

  const allVins = [ctx.vin, ...extras.map((e) => e.vin)];

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: CURRENCY,
          unit_amount: amount,
          product_data: {
            name:
              vehicleCount > 1
                ? `${SITE_NAME} ${p.name}, ${vehicleCount} vehicles`
                : credited > 0
                  ? `${SITE_NAME} upgrade to ${p.name}`
                  : `${SITE_NAME} ${p.name}`,
            description:
              vehicleCount > 1
                ? `A ${p.name} for each of ${vehicleCount} vehicles, plus a side-by-side comparison. Saves $${(saved / 100).toFixed(2)}. VINs ${allVins.join(', ')}.`
                : credited > 0
                  ? `Upgrade from the ${PRODUCTS[upgradeFrom!.product].name}, with the $${(credited / 100).toFixed(2)} you already paid credited. VIN ${ctx.vin}.`
                  : `${p.blurb} VIN ${ctx.vin}.`,
          },
        },
        quantity: 1,
      },
    ],
    // Collected so we can email the report and answer support queries. Stripe
    // handles the field, so we are not storing card data anywhere near us.
    customer_creation: 'if_required',
    metadata: {
      // `vin`, `mileage` and `asking` stay as the FIRST vehicle's values so
      // every session created before multi-VIN existed still reads correctly,
      // and so a single-vehicle order is byte-identical to what it was.
      vin: ctx.vin,
      product,
      mileage: String(ctx.mileage),
      zip: ctx.zip,
      asking: ctx.asking === null ? '' : String(ctx.asking),
      // Parallel comma-joined lists, one entry per vehicle, first included.
      // Five 17-character VINs plus separators is 89 characters, well inside
      // Stripe's 500-character limit on a metadata value.
      vins: allVins.join(','),
      mileages: [ctx.mileage, ...extras.map((e) => e.mileage)].join(','),
      askings: [ctx.asking ?? '', ...extras.map((e) => e.asking ?? '')].join(','),
      // What we actually charged, so revenue logging reports the real figure
      // rather than the tier's list price.
      amountCents: String(amount),
      upgradedFrom: upgradeFrom ? upgradeFrom.product : '',
      upgradedFromSession: upgradeFrom ? upgradeFrom.sessionId : '',
    },
    success_url: `${origin}/report/${ctx.vin}?paid={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/report/${ctx.vin}`,
  });
  return { url: session.url || `/report/${ctx.vin}` };
}

export interface PaidSession {
  product: ProductId;
  ctx: CheckoutContext;
  email: string | null;
  /** What was actually charged, in cents. An upgrade pays only the difference. */
  amountCents: number;
  /** Every VIN this one payment covers, in order. Length 1 for a single buy. */
  vins: string[];
  /** Every vehicle in the order with its own mileage and asking price. */
  vehicles: Vehicle[];
  /** Index of the VIN being viewed within `vins`. 0 for a single buy. */
  index: number;
  /**
   * Cache key for THIS vehicle. Vehicle 1 uses the real Stripe session id;
   * later vehicles use a derived id so each gets its own row in `cwi_reports`
   * rather than five vehicles fighting over one primary key.
   */
  cacheKey: string;
  /**
   * Whether the payment was fully refunded. `payment_status` stays "paid" after
   * a refund, so this is the only way to tell. It must never earn an upgrade
   * credit: otherwise a buyer refunds their $2.99 Valuation and still gets
   * $2.99 off the $9.99 pack, and /pricing promises a refund whenever we cannot
   * value a car, so that path is routine rather than exotic.
   *
   * Deliberately does NOT revoke access to the report itself. The refund we
   * promise is for a car we could not value, so there is nothing to revoke, and
   * pulling a report out from under someone we already refunded would create
   * support work without protecting any revenue.
   */
  refunded: boolean;
}

/**
 * Verify a returning customer actually paid, and recover what they told us.
 *
 * The session id in the URL is the proof of purchase. It is unguessable and we
 * re-check `payment_status` against Stripe on every render rather than trusting
 * the URL, so a shared link cannot unlock a different VIN.
 */
export async function getPaidSession(vin: string, token: string): Promise<PaidSession | null> {
  if (!stripe || !token) return null;
  try {
    // Expand to the charge so a refund can be detected. `payment_status` alone
    // still reads "paid" on a fully refunded session.
    const s = await stripe.checkout.sessions.retrieve(token, {
      expand: ['payment_intent.latest_charge'],
    });
    if (s.payment_status !== 'paid') return null;

    const pi = s.payment_intent;
    const charge =
      pi && typeof pi !== 'string' && pi.latest_charge && typeof pi.latest_charge !== 'string'
        ? pi.latest_charge
        : null;
    const refunded = !!charge && (charge.refunded || (charge.amount_refunded ?? 0) >= charge.amount);
    const m = s.metadata || {};

    // Membership, not equality. One payment can cover up to five vehicles, and
    // the visitor may be looking at any of them. A VIN outside the order still
    // gets nothing, so a shared link cannot unlock a car nobody paid for.
    const vins = vinsFromMetadata(m);
    const index = vins.indexOf(vin);
    if (index === -1) return null;

    const product = m.product || '';
    if (!isProductId(product)) return null;

    // Per-vehicle mileage and asking price.
    //
    // ⚠️ Use presence of the KEY to decide legacy, and never `??` on a split
    // result. `''.split(',')` is `['']`, and `''` is not nullish, so
    // `mileages[0] ?? m.mileage` silently yields `''`, `Number('')` is 0, and
    // the guard below then throws away a session the customer has paid for.
    // Sessions created before multi-VIN existed have no `mileages` key at all,
    // and every session the currently deployed build creates is that shape.
    const hasLists = typeof m.mileages === 'string';

    let mileage: number;
    if (!hasLists) {
      // Legacy single-vehicle session. `vinsFromMetadata` already fell back to
      // `m.vin`, so index can only be 0 here, but assert it rather than assume.
      if (index !== 0) return null;
      mileage = Number(m.mileage);
    } else {
      const mileages = m.mileages.split(',');
      // Refuse a length mismatch rather than paper over it. Falling back to
      // vehicle 1's mileage would price vehicle 3 at the wrong odometer
      // reading and look entirely healthy while doing it, and mileage is the
      // single biggest driver of the number we are selling.
      if (mileages.length !== vins.length) return null;
      mileage = Number(mileages[index]);
    }
    if (!Number.isFinite(mileage) || mileage <= 0) return null;
    if (!m.zip) return null;

    // An empty entry means "no asking price given", which is legitimate, so
    // blanks are preserved here rather than filtered out.
    let rawAsking: string | undefined;
    if (typeof m.askings !== 'string') {
      rawAsking = m.asking;
    } else {
      const askings = m.askings.split(',');
      if (askings.length !== vins.length) return null;
      rawAsking = askings[index];
    }
    const asking = rawAsking ? Number(rawAsking) : null;
    // Prefer what Stripe says was actually collected. `amount_total` is the
    // truth; the metadata figure is a fallback for sessions created before it
    // was recorded, and the list price is the last resort.
    const amountCents =
      typeof s.amount_total === 'number' && s.amount_total >= 0
        ? s.amount_total
        : Number(m.amountCents) || PRODUCTS[product].cents;
    return {
      product,
      ctx: {
        vin,
        mileage,
        zip: m.zip,
        asking: Number.isFinite(asking as number) ? (asking as number) : null,
      },
      email: s.customer_details?.email || null,
      amountCents,
      vins,
      // Built from the same validated lists, so the comparison page cannot see
      // a different set of mileages than the individual reports do.
      vehicles: vins.map((v, i) => {
        const mi = hasLists ? Number(m.mileages.split(',')[i]) : Number(m.mileage);
        const ai = typeof m.askings === 'string' ? m.askings.split(',')[i] : m.asking;
        return { vin: v, mileage: mi, asking: ai ? Number(ai) : null };
      }),
      index,
      cacheKey: derivedSessionId(token, index),
      refunded,
    };
  } catch {
    return null;
  }
}

/**
 * Read just the VIN list off a session, without asserting the caller is
 * entitled to anything.
 *
 * The comparison page cannot call getPaidSession directly because that checks
 * VIN membership, and the comparison's whole job is to show the order rather
 * than one vehicle in it. This learns the first VIN so the caller can then go
 * through getPaidSession properly: none of the payment, refund or VIN checks
 * are skipped, they just happen on the second call.
 */
export async function peekOrderVins(token: string): Promise<string[]> {
  if (!stripe || !token) return [];
  try {
    const s = await stripe.checkout.sessions.retrieve(token);
    if (s.payment_status !== 'paid') return [];
    return vinsFromMetadata(s.metadata);
  } catch {
    return [];
  }
}
