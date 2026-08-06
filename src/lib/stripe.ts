import Stripe from 'stripe';
import { HAS_STRIPE, CURRENCY, SITE_NAME, PRODUCTS, type ProductId, isProductId } from './constants';

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
): Promise<{ url: string }> {
  const p = PRODUCTS[product];
  if (!stripe) return { url: `/report/${ctx.vin}` };
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: CURRENCY,
          unit_amount: p.cents,
          product_data: {
            name: `${SITE_NAME} ${p.name}`,
            description: `${p.blurb} VIN ${ctx.vin}.`,
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
    const s = await stripe.checkout.sessions.retrieve(token);
    if (s.payment_status !== 'paid') return null;
    const m = s.metadata || {};
    if (m.vin !== vin) return null;
    const product = m.product || '';
    if (!isProductId(product)) return null;
    const mileage = Number(m.mileage);
    if (!Number.isFinite(mileage) || mileage <= 0) return null;
    if (!m.zip) return null;
    const asking = m.asking ? Number(m.asking) : null;
    return {
      product,
      ctx: {
        vin,
        mileage,
        zip: m.zip,
        asking: Number.isFinite(asking as number) ? (asking as number) : null,
      },
      email: s.customer_details?.email || null,
    };
  } catch {
    return null;
  }
}
