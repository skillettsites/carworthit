'use client';

import { useState } from 'react';

/**
 * Email capture.
 *
 * The copy here promises ONLY what the product can actually do today.
 *
 * The obvious offer — "we'll email you if this car's price moves" — was
 * deliberately rejected twice over. Nothing in this codebase reads cwi_leads or
 * sends mail, so it would be a promise with no implementation. And re-pricing a
 * car costs a paid Carketa call (~20p) every time, per car, for someone who has
 * paid nothing, which is the one thing this site must never do. A per-car alert
 * is therefore not a feature we are one cron away from; it is a feature that
 * loses money by design.
 *
 * What is left is honest and costs nothing to honour: an occasional guide,
 * built from the free federal data the site already uses.
 *
 * Deliberately does NOT gate the free report. Making people pay with an email
 * to see what the site already gives away would cut the top of the funnel to
 * protect the middle of it.
 */
export default function EmailCapture({
  vin,
  product,
  compact = false,
}: {
  vin?: string;
  product?: string;
  compact?: boolean;
}) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === 'sending' || state === 'done') return;
    setState('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          vin,
          product,
          path: typeof window === 'undefined' ? undefined : window.location.pathname,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setMessage(j.error || 'That did not save. Try again in a moment.');
        setState('error');
        return;
      }
      setState('done');
    } catch {
      setMessage('That did not save. Try again in a moment.');
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <p className={`text-sm text-emerald-700 ${compact ? '' : 'rounded-xl bg-emerald-50 p-4'}`}>
        Saved, thanks. We will not email you about this specific car.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className={compact ? '' : 'rounded-2xl border border-border bg-white p-5'}>
      {!compact && (
        <>
          <h3 className="font-bold">Buying a used car?</h3>
          <p className="mt-1 text-sm text-muted">
            Occasional guides on pricing a car, spotting a bad one and negotiating the price down. No more than a
            couple a month.
          </p>
        </>
      )}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="lead-email" className="sr-only">
          Email address
        </label>
        <input
          id="lead-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === 'error') setState('idle');
          }}
          placeholder="you@example.com"
          className="flex-1 rounded-xl border border-border px-4 py-3 text-base outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={state === 'sending'}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {state === 'sending' ? 'Saving…' : 'Send them'}
        </button>
      </div>
      {state === 'error' && <p className="mt-2 text-sm text-red-600">{message}</p>}
      <p className="mt-2 text-xs text-muted">
        No account needed. Unsubscribe from any email. We never sell your address.
      </p>
    </form>
  );
}
