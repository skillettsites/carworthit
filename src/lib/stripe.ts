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

const stripe = HAS_STRIPE ? new Stripe(process.env.STRIPE_SECRET_KEY as string) : null;

/**
 * What the buyer told us, carried through Stripe and read back after payment.
 *
 * Stripe metadata is the right home for this. It survives the redirect, it
 * cannot be tampered with by the customer, and it means we do not need our own
 * session store just to remember three numbers. Values are strings because
 * Stripe metadata is string-only.
 */
export interface CheckoutContext {
  vin: string;
  mileage: number;
  zip: string;
  asking: number | null;
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
  const amount = upgradePriceCents(product, upgradeFrom ? upgradeFrom.product : null);
  const credited = p.cents - amount;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: CURRENCY,
          unit_amount: amount,
          product_data: {
            name: credited > 0 ? `${SITE_NAME} upgrade to ${p.name}` : `${SITE_NAME} ${p.name}`,
            description:
              credited > 0
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
      vin: ctx.vin,
      product,
      mileage: String(ctx.mileage),
      zip: ctx.zip,
      asking: ctx.asking === null ? '' : String(ctx.asking),
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
    if (m.vin !== vin) return null;
    const product = m.product || '';
    if (!isProductId(product)) return null;
    const mileage = Number(m.mileage);
    if (!Number.isFinite(mileage) || mileage <= 0) return null;
    if (!m.zip) return null;
    const asking = m.asking ? Number(m.asking) : null;
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
      refunded,
    };
  } catch {
    return null;
  }
}
