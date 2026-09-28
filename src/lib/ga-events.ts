/**
 * GA4 ecommerce payloads and the one safe way to hand them to gtag.js.
 *
 * Why `gtagEvent` has a fallback: a client effect can run before the
 * afterInteractive gtag.js script has defined window.gtag. gtag.js only
 * replays `arguments` objects from the dataLayer queue and silently ignores a
 * plain array, which is exactly how HomeBuyerCheck recorded zero purchases for
 * weeks. The fallback below queues a genuine `arguments` object.
 *
 * Nothing personal goes to GA: no email, no ZIP, no VIN. The transaction id is
 * the Stripe PaymentIntent id, which identifies the payment in Stripe but,
 * unlike the Checkout Session id, does not open the paid report.
 */

import { PRODUCTS, type ProductId } from './constants';

export interface GaItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
}

export interface PurchaseEvent {
  transaction_id: string;
  value: number;
  currency: 'USD';
  items: GaItem[];
}

/** Cents to dollars, 2 dp, never NaN or negative. */
export function centsToDollars(cents: number | null | undefined): number {
  const n = Number(cents);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n) / 100;
}

/**
 * The GA4 `purchase` payload, built from what Stripe says was collected. Null
 * when anything needed is missing, so the caller fires nothing rather than a
 * $0 or untied purchase.
 */
export function buildPurchaseEvent(input: {
  transactionId: string | null | undefined;
  product: ProductId;
  amountCents: number | null | undefined;
  vehicles: number;
}): PurchaseEvent | null {
  const id = (input.transactionId ?? '').trim();
  if (!id) return null;
  const value = centsToDollars(input.amountCents);
  if (value <= 0) return null;
  const qty = Math.max(1, Math.floor(input.vehicles) || 1);
  return {
    transaction_id: id,
    value,
    currency: 'USD',
    items: [
      {
        item_id: input.product,
        item_name: PRODUCTS[input.product].name,
        // GA multiplies price by quantity, so a basket carries its per-vehicle price.
        price: Math.round((value / qty) * 100) / 100,
        quantity: qty,
      },
    ],
  };
}

/** localStorage key that stops a revisit of the report counting the sale twice. */
export function purchaseFiredKey(transactionId: string): string {
  return `cwi_purchase_fired_${transactionId}`;
}

type GtagWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

/** Send an event to GA4, or queue it as a real `arguments` object until gtag.js loads. */
export function gtagEvent(name: string, params: object): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer || [];
  if (typeof w.gtag === 'function') {
    w.gtag('event', name, params);
    return true;
  }
  const queue = w.dataLayer;
  // Must be a classic function: gtag.js checks for an Arguments object.
  const push = function () {
    // eslint-disable-next-line prefer-rest-params
    queue.push(arguments);
  } as (...args: unknown[]) => void;
  push('event', name, params);
  return true;
}
