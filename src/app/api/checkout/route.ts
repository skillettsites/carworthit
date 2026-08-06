import { NextRequest, NextResponse } from 'next/server';
import { createCheckout, getPaidSession, type Vehicle } from '@/lib/stripe';
import { isValidVin } from '@/lib/nhtsa';
import { isProductId, CHECKOUT_ENABLED, tierRank } from '@/lib/constants';
import { MAX_VINS } from '@/lib/multi-vin';

/** Ceiling on a stated asking price. Above this it is a typo, not a car. */
const MAX_ASKING = 10_000_000;

export async function POST(req: NextRequest) {
  if (!CHECKOUT_ENABLED) {
    return NextResponse.json({ error: 'Paid reports are launching shortly.' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const vin = String(body.vin || '').trim().toUpperCase();
  const product = String(body.product || '');
  const mileage = Number(body.mileage);
  const zip = String(body.zip || '').trim();
  const askingRaw = body.asking;

  // Validate before charging. Taking money and then discovering we cannot look
  // the car up is the worst possible order to find out.
  if (!isValidVin(vin)) return NextResponse.json({ error: 'That VIN doesn’t look right.' }, { status: 400 });
  if (!isProductId(product)) return NextResponse.json({ error: 'Unknown product' }, { status: 400 });
  if (!Number.isFinite(mileage) || mileage <= 0 || mileage > 999999) {
    return NextResponse.json({ error: 'Enter the mileage in miles.' }, { status: 400 });
  }
  if (!/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: 'Enter a 5-digit US ZIP code.' }, { status: 400 });
  }
  const asking =
    askingRaw === null || askingRaw === undefined || askingRaw === ''
      ? null
      : Number(askingRaw);
  // Bounded at both ends. Without a ceiling, 1.2e29 was accepted and written
  // into metadata verbatim, producing a verdict and a negotiation pack full of
  // nonsense figures for a car nobody is selling for that.
  if (asking !== null && (!Number.isFinite(asking) || asking <= 0 || asking > MAX_ASKING)) {
    return NextResponse.json(
      { error: `Asking price should be a number between $1 and $${MAX_ASKING.toLocaleString('en-US')}.` },
      { status: 400 },
    );
  }

  // Upgrade credit. The client sends the Stripe session id it holds, but that
  // is only a claim: we re-verify it against Stripe, and getPaidSession also
  // checks the session was actually paid AND was for THIS VIN. Without that
  // round trip, anyone could post an arbitrary token and buy the top tier for
  // the price of the difference.
  // Present but not an array means a broken client. Ignoring it would quietly
  // sell one report to someone who asked for five.
  if (body.extras !== undefined && body.extras !== null && !Array.isArray(body.extras)) {
    return NextResponse.json({ error: 'Invalid vehicle list.' }, { status: 400 });
  }
  const hasExtras = Array.isArray(body.extras) && body.extras.length > 0;

  let upgradeFrom: { product: typeof product; sessionId: string } | undefined;
  const fromToken = typeof body.upgradeFrom === 'string' ? body.upgradeFrom.trim() : '';
  // Checked BEFORE verifying the token, so the buyer gets the reason that
  // actually applies rather than a confusing "we could not confirm your earlier
  // purchase", and so we do not call Stripe to validate a request we refuse.
  if (fromToken && hasExtras) {
    return NextResponse.json(
      { error: 'An upgrade covers one vehicle. Buy the extra vehicles as a separate order.' },
      { status: 400 },
    );
  }
  if (fromToken) {
    const prior = await getPaidSession(vin, fromToken);
    // Only ever credit a STRICTLY LOWER tier that was actually paid and not
    // refunded. Crediting an equal or higher tier would let a buyer pay nothing;
    // crediting a refunded one gives them the discount and their money back.
    const creditable = prior && !prior.refunded && tierRank(prior.product) < tierRank(product);
    if (creditable) {
      upgradeFrom = { product: prior.product, sessionId: fromToken };
    } else {
      // REFUSE rather than quietly charging full price. The buyer clicked a
      // button reading "Get the Negotiation Bundle, $3.00"; sending them to a
      // Stripe page for $9.99 with no explanation is the worst possible way to
      // handle it, and getPaidSession also returns null on a transient Stripe
      // outage, so this is not only a tampering path.
      return NextResponse.json(
        {
          error:
            'We could not confirm your earlier purchase, so we have not applied the upgrade credit. Please reopen your report from the link you were given after paying, then try again.',
        },
        { status: 409 },
      );
    }
  }

  // Extra vehicles in the same basket. Each carries its own odometer reading,
  // because the pricing feed takes one per vehicle.
  const extras: Vehicle[] = [];
  if (hasExtras) {
    if ((body.extras as unknown[]).length > MAX_VINS - 1) {
      return NextResponse.json({ error: `Up to ${MAX_VINS} vehicles per order.` }, { status: 400 });
    }
    const seen = new Set([vin]);
    for (const raw of body.extras as unknown[]) {
      const e = raw as Record<string, unknown>;
      const v = String(e?.vin || '').trim().toUpperCase();
      const m = Number(e?.mileage);
      if (!isValidVin(v)) {
        return NextResponse.json({ error: `That VIN doesn’t look right: ${v || 'blank'}` }, { status: 400 });
      }
      // Reject rather than dedupe: silently charging for four cars when five
      // were entered is the kind of thing a customer only notices afterwards.
      if (seen.has(v)) {
        return NextResponse.json({ error: `${v} is in the order twice.` }, { status: 400 });
      }
      if (!Number.isFinite(m) || m <= 0 || m > 999999) {
        return NextResponse.json({ error: `Enter the mileage for ${v}.` }, { status: 400 });
      }
      const a = e?.asking === null || e?.asking === undefined || e?.asking === '' ? null : Number(e.asking);
      if (a !== null && (!Number.isFinite(a) || a <= 0 || a > MAX_ASKING)) {
        return NextResponse.json({ error: `Asking price for ${v} should be a number.` }, { status: 400 });
      }
      seen.add(v);
      extras.push({ vin: v, mileage: Math.round(m), asking: a });
    }
  }

  const { url } = await createCheckout(
    product,
    { vin, mileage: Math.round(mileage), zip, asking, extras },
    req.nextUrl.origin,
    upgradeFrom,
  );
  return NextResponse.json({ url });
}
