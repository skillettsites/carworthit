'use client';
import type { ReactNode } from 'react';

// Shared calculator field, defined at module scope so inputs keep focus between keystrokes.
export function Field({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
  min?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-2">{label}</span>
      <div className="mt-1 flex items-center rounded-xl border border-border bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
        {prefix && <span className="pl-3 text-ink-2">{prefix}</span>}
        <input
          type="number"
          value={value}
          step={step}
          min={min}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent px-3 py-3 outline-none"
        />
        {suffix && <span className="pr-3 text-ink-2 text-sm whitespace-nowrap">{suffix}</span>}
      </div>
    </label>
  );
}

export function Out({ label, value, accent }: { label: string; value: ReactNode; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 text-center ${accent ? 'border-brand bg-white ring-1 ring-brand/20' : 'border-border bg-white'}`}>
      <div className={`text-2xl font-extrabold ${accent ? 'text-brand' : 'text-ink'}`}>{value}</div>
      <div className="text-xs text-ink-2 mt-1">{label}</div>
    </div>
  );
}
