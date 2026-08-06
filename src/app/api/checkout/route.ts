import { NextRequest, NextResponse } from 'next/server';
import { createCheckout, getPaidSession } from '@/lib/stripe';
import { isValidVin } from '@/lib/nhtsa';
import { isProductId, CHECKOUT_ENABLED, tierRank } from '@/lib/constants';

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
  if (asking !== null && (!Number.isFinite(asking) || asking <= 0)) {
    return NextResponse.json({ error: 'Asking price should be a number.' }, { status: 400 });
  }

  // Upgrade credit. The client sends the Stripe session id it holds, but that
  // is only a claim: we re-verify it against Stripe, and getPaidSession also
  // checks the session was actually paid AND was for THIS VIN. Without that
  // round trip, anyone could post an arbitrary token and buy the top tier for
  // the price of the difference.
  let upgradeFrom: { product: typeof product; sessionId: string } | undefined;
  const fromToken = typeof body.upgradeFrom === 'string' ? body.upgradeFrom.trim() : '';
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

  const { url } = await createCheckout(
    product,
    { vin, mileage: Math.round(mileage), zip, asking },
    req.nextUrl.origin,
    upgradeFrom,
  );
  return NextResponse.json({ url });
}
