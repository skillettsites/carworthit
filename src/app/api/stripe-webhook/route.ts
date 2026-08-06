import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { logPurchase } from '@/lib/db';
import { isProductId } from '@/lib/constants';

// Records completed purchases independently of the browser.
//
// The report page also logs on render, but that only fires if the customer
// actually lands back on the site. If they close the tab at Stripe's confirm
// screen, the sale still happened and we still want the row. Both paths write
// to the same table and cwi_purchases has a unique index on the session id, so
// whichever arrives second is rejected harmlessly rather than duplicating.

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  const raw = await req.text();
  const stripe = new Stripe(key);

  let event: Stripe.Event;
  try {
    // Signature verification is the whole point of this endpoint being public.
    // Never parse the body before this succeeds.
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const s = event.data.object as Stripe.Checkout.Session;
    const m = s.metadata || {};
    const product = m.product || '';
    if (s.payment_status === 'paid' && isProductId(product)) {
      logPurchase({
        sessionId: s.id,
        product,
        amountCents: s.amount_total ?? 0,
        currency: s.currency ?? 'usd',
        email: s.customer_details?.email ?? null,
        vin: m.vin ?? null,
        state: null,
      });
    }
  }

  // Always 200 on a verified event. A non-200 makes Stripe retry, and a
  // logging failure is not a reason to make Stripe retry a real payment.
  return NextResponse.json({ received: true });
}
