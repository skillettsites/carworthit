import Stripe from 'stripe';
import { HAS_STRIPE, CURRENCY, SITE_NAME, PRODUCTS, type ProductId, isProductId } from './constants';

const stripe = HAS_STRIPE ? new Stripe(process.env.STRIPE_SECRET_KEY as string) : null;

export async function createCheckout(vin: string, product: ProductId, origin: string): Promise<{ url: string }> {
  const p = PRODUCTS[product];
  // No Stripe key yet -> dev-unlock URL carrying the product, so the full flow is testable.
  if (!stripe) return { url: `/report/${vin}?paid=dev-${product}` };
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: CURRENCY,
          unit_amount: p.cents,
          product_data: { name: `${SITE_NAME}, ${p.name}`, description: `VIN ${vin}` },
        },
        quantity: 1,
      },
    ],
    metadata: { vin, product },
    success_url: `${origin}/report/${vin}?paid={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/report/${vin}`,
  });
  return { url: session.url || `/report/${vin}` };
}

// Returns which product was paid for ('valuation' | 'history' | 'bundle'), or null.
export async function getPaidProduct(vin: string, token: string): Promise<ProductId | null> {
  if (token.startsWith('dev-') && !HAS_STRIPE) {
    const p = token.slice(4);
    return isProductId(p) ? p : null;
  }
  if (!stripe) return null;
  try {
    const s = await stripe.checkout.sessions.retrieve(token);
    if (s.payment_status !== 'paid' || s.metadata?.vin !== vin) return null;
    const p = s.metadata?.product || '';
    return isProductId(p) ? p : null;
  } catch {
    return null;
  }
}
