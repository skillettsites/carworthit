'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VinForm({ size = 'lg', dark = false }: { size?: 'lg' | 'md'; dark?: boolean }) {
  const [vin, setVin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const valid = /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin.trim());

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const clean = vin.trim().toUpperCase();
    if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(clean)) {
      setError('A VIN is exactly 17 characters (letters and numbers, no I, O or Q).');
      return;
    }
    setError('');
    setLoading(true);
    router.push(`/report/${clean}`);
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className={`search-glow flex flex-col sm:flex-row gap-2 rounded-2xl bg-white p-2 ${size === 'lg' ? '' : 'max-w-xl'}`}>
        <input
          value={vin}
          onChange={(e) => setVin(e.target.value.toUpperCase())}
          placeholder="Enter 17-character VIN"
          aria-label="Vehicle Identification Number"
          maxLength={17}
          className={`flex-1 rounded-xl bg-transparent px-4 font-mono tracking-wider text-ink outline-none placeholder:text-slate-400 ${
            size === 'lg' ? 'py-4 text-lg' : 'py-3'
          }`}
        />
        <button
          type="submit"
          disabled={loading}
          className={`rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-600 hover:to-cyan-500 disabled:opacity-60 ${
            size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3'
          }`}
        >
          {loading ? 'Checking…' : 'Check this car'}
        </button>
      </div>
      {error ? (
        <p className={`mt-2 text-sm ${dark ? 'text-red-300' : 'text-bad'}`}>{error}</p>
      ) : (
        <p className={`mt-2 text-sm ${dark ? 'text-slate-300' : 'text-ink-2'}`}>
          Free preview instantly. {valid ? '✓ Looks like a valid VIN' : 'The VIN is on the dashboard, door jamb, or title.'}
        </p>
      )}
    </form>
  );
}
