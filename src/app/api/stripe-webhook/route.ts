import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { logPurchaseAwaited, markEmailSent } from '@/lib/db';
import { isProductId } from '@/lib/constants';
import { vinsFromMetadata } from '@/lib/multi-vin';
import { decodeVin } from '@/lib/nhtsa';
import { sendOrderEmail } from '@/lib/email';
import { detectEmailTypo } from '@/lib/email-typo';

// Records completed purchases and delivers the report, independently of the
// browser.
//
// The report page also logs on render, but that only fires if the customer
// actually lands back on the site. If they close the tab at Stripe's confirm
// screen, the sale still happened and we still want the row. Both paths write
// to the same table and cwi_purchases has a unique index on the session id, so
// whichever arrives second is rejected harmlessly rather than duplicating.
//
// This is also the ONLY place the report link is emailed. That matters: it is
// the one code path guaranteed to run for every paid order, whatever the buyer
// does with their browser afterwards. The first sale this site ever took (23
// Aug 2026) was made on a phone at midnight, and before this existed there was
// no way to send that buyer the report they had just paid for.

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
      const email = s.customer_details?.email ?? null;
      const vins = vinsFromMetadata(m);

      // Awaited, unlike the report page's fire-and-forget version: the email
      // status is stamped onto this row a moment later, and /r/<token>
      // resolves against it, so it has to exist first.
      await logPurchaseAwaited({
        sessionId: s.id,
        product,
        amountCents: s.amount_total ?? 0,
        currency: s.currency ?? 'usd',
        email,
        vin: vins[0] ?? m.vin ?? null,
        state: null,
      });

      // Never let delivery take down the webhook. A non-200 makes Stripe
      // retry, and a failed email is not a reason to replay a real payment.
      try {
        await deliverReport(s.id, product, vins, email);
      } catch (err) {
        console.error('[cwi:webhook] delivery failed', s.id, err instanceof Error ? err.message : String(err));
        await markEmailSent(s.id, 'failed').catch(() => {});
      }
    }
  }

  // Always 200 on a verified event. A non-200 makes Stripe retry, and a
  // logging failure is not a reason to make Stripe retry a real payment.
  return NextResponse.json({ received: true });
}

async function deliverReport(
  sessionId: string,
  product: string,
  vins: string[],
  email: string | null,
): Promise<void> {
  if (!isProductId(product)) return;

  if (!email) {
    // Stripe collects an email on every Checkout session, so this should not
    // happen. Recorded rather than ignored, because a paid order we cannot
    // deliver is something a human needs to see.
    console.error('[cwi:webhook] paid session with no email', sessionId);
    await markEmailSent(sessionId, 'no_email');
    return;
  }

  // Name the car in the subject line. NHTSA's decode is free and needs no key,
  // so this costs nothing and is worth it: "Your Valuation: 2019 Dodge
  // Challenger" is a far better inbox line than a 17-character VIN, and it
  // reassures the buyer the email is about the right car before they open it.
  // Individually guarded, so one unknown VIN cannot cost the whole order its
  // email.
  const names = await Promise.all(
    vins.map(async (vin) => {
      try {
        const specs = await decodeVin(vin);
        if (!specs) return null;
        const parts = [specs.year, specs.make, specs.model].filter(Boolean);
        return parts.length ? parts.join(' ') : null;
      } catch {
        return null;
      }
    }),
  );

  const status = await sendOrderEmail({ to: email, product, vins, names, stripeSessionId: sessionId });
  await markEmailSent(sessionId, status);

  // Email-typo auto-rescue (gnail.com, gmail.co, hotmial.com and friends).
  // Someone who mistyped their address has paid us and would otherwise get
  // nothing at all, so the corrected address gets a copy too. Only ever an
  // extra send: the original still goes out, in case the "typo" was real.
  const corrected = detectEmailTypo(email);
  if (corrected && status === 'sent') {
    try {
      await sendOrderEmail({
        to: corrected,
        product,
        vins,
        names,
        stripeSessionId: sessionId,
        retryAttempt: 'typo_rescue',
      });
      console.warn('[cwi:webhook] typo rescue sent', sessionId, email, '->', corrected);
    } catch (err) {
      console.error('[cwi:webhook] typo rescue failed', sessionId, err instanceof Error ? err.message : String(err));
    }
  }
}
