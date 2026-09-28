'use client';

import { useEffect } from 'react';
import { buildPurchaseEvent, gtagEvent, purchaseFiredKey } from '@/lib/ga-events';
import type { ProductId } from '@/lib/constants';

/**
 * Fires the GA4 `purchase` event on the report a buyer lands on after paying
 * (Stripe's success_url is /report/<VIN>?paid=<session>).
 *
 * The figures come from the server, which read them off the verified Stripe
 * session, never from the URL. Fired once per transaction per browser
 * (localStorage), and only within 48 hours of the checkout: the report link is
 * also emailed, and a buyer reopening it next week on another device must not
 * count as a second sale. GA4 also de-duplicates on transaction_id.
 */
export default function PurchaseEvent({
  transactionId,
  product,
  amountCents,
  vehicles,
  createdAt,
}: {
  transactionId: string;
  product: ProductId;
  amountCents: number;
  vehicles: number;
  /** Stripe session creation time, in epoch seconds. */
  createdAt: number;
}) {
  useEffect(() => {
    if (!transactionId) return;
    if (!createdAt || Date.now() - createdAt * 1000 > 48 * 60 * 60 * 1000) return;
    const key = purchaseFiredKey(transactionId);
    try {
      if (window.localStorage.getItem(key)) return;
    } catch {
      /* storage unavailable: fire once for this page view */
    }
    const payload = buildPurchaseEvent({ transactionId, product, amountCents, vehicles });
    if (!payload) return;
    gtagEvent('purchase', payload);
    try {
      window.localStorage.setItem(key, '1');
    } catch {
      /* ignore */
    }
  }, [transactionId, product, amountCents, vehicles, createdAt]);
  return null;
}
