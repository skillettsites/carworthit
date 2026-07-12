import { NextRequest, NextResponse } from 'next/server';
import { createCheckout } from '@/lib/stripe';
import { isValidVin } from '@/lib/nhtsa';
import { isProductId, CHECKOUT_ENABLED } from '@/lib/constants';

export async function POST(req: NextRequest) {
  if (!CHECKOUT_ENABLED) return NextResponse.json({ error: 'Paid reports are launching soon.' }, { status: 403 });
  let vin = '';
  let product = 'history';
  try {
    const body = await req.json();
    vin = String(body.vin || '').trim().toUpperCase();
    product = String(body.product || 'history');
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  if (!isValidVin(vin)) return NextResponse.json({ error: 'Invalid VIN' }, { status: 400 });
  if (!isProductId(product)) return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
  const { url } = await createCheckout(vin, product, req.nextUrl.origin);
  return NextResponse.json({ url });
}
