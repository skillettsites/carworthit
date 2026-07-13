'use client';
import { useState } from 'react';
import Link from 'next/link';

// Sticky bottom bar shown on content pages (articles, calculators) to keep the
// VIN-check CTA in view while the user scrolls. Dismissible.
export default function StickyVinCta() {
  const [closed, setClosed] = useState(false);
  if (closed) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-white/95 backdrop-blur shadow-[0_-4px_24px_rgba(15,23,42,0.08)]">
      <div className="container-x flex items-center justify-between gap-3 py-3">
        <div className="min-w-0">
          <p className="font-bold text-ink text-sm sm:text-base leading-tight">Checking a specific car?</p>
          <p className="text-xs text-ink-2 hidden sm:block mt-0.5">Run its VIN free: title, salvage, odometer, recalls and running costs in seconds.</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href="/#check"
            className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-600 hover:to-cyan-500 whitespace-nowrap"
          >
            Check a VIN
          </Link>
          <button
            type="button"
            onClick={() => setClosed(true)}
            aria-label="Dismiss"
            className="p-1.5 text-ink-2 hover:text-ink rounded-md"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
