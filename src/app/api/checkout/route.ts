import { NextRequest, NextResponse } from 'next/server';
import { createCheckout } from '@/lib/stripe';
import { isValidVin } from '@/lib/nhtsa';
import { isProductId, CHECKOUT_ENABLED } from '@/lib/constants';

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

  const { url } = await createCheckout(product, { vin, mileage: Math.round(mileage), zip, asking }, req.nextUrl.origin);
  return NextResponse.json({ url });
}
