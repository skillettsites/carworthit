'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface SortCol {
  key: string;
  label: string;
  numeric?: boolean;
}

export interface SortCell {
  text: string;
  /** Sort key. Use a large number for "unknown" numeric cells so they sort last. */
  sort: number | string;
  href?: string;
  sub?: string;
  external?: boolean;
}

export type SortRow = Record<string, SortCell>;

/**
 * A table whose rows arrive fully formed from the server component, so the
 * HTML a crawler sees is the complete table; the only client behaviour is
 * re-ordering rows when a header is clicked.
 */
export default function SortableTable({
  columns,
  rows,
  caption,
  initialKey,
}: {
  columns: SortCol[];
  rows: SortRow[];
  caption: string;
  initialKey?: string;
}) {
  const [sortKey, setSortKey] = useState(initialKey ?? columns[0].key);
  const [dir, setDir] = useState<1 | -1>(1);

  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey]?.sort ?? '';
    const bv = b[sortKey]?.sort ?? '';
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });

  function toggle(key: string) {
    if (key === sortKey) setDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setDir(1);
    }
  }

  return (
    <div className="table-scroll border border-border" tabIndex={0}>
      <table className="w-full min-w-[640px] text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 to-cyan-50 text-left">
            {columns.map((c) => {
              const active = c.key === sortKey;
              return (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={active ? (dir === 1 ? 'ascending' : 'descending') : 'none'}
                  className="whitespace-nowrap border-b-2 border-blue-200 px-3 py-2.5 font-bold text-blue-900"
                >
                  <button
                    type="button"
                    onClick={() => toggle(c.key)}
                    className="inline-flex items-center gap-1 hover:underline"
                  >
                    {c.label}
                    <span aria-hidden="true" className={active ? 'text-brand' : 'text-blue-300'}>
                      {active ? (dir === 1 ? '▲' : '▼') : '↕'}
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={row[columns[0].key]?.text ?? i} className="border-b border-slate-100 even:bg-slate-50/60">
              {columns.map((c) => {
                const cell = row[c.key];
                if (!cell) return <td key={c.key} className="px-3 py-2.5" />;
                return (
                  <td key={c.key} className={`px-3 py-2.5 align-top ${c.numeric ? 'tabular-nums' : ''}`}>
                    {cell.href ? (
                      cell.external ? (
                        <a href={cell.href} className="text-brand underline" rel="nofollow noopener" target="_blank">
                          {cell.text}
                        </a>
                      ) : (
                        <Link href={cell.href} className="font-semibold text-brand underline">
                          {cell.text}
                        </Link>
                      )
                    ) : (
                      cell.text
                    )}
                    {cell.sub && <span className="block text-xs text-ink-2">{cell.sub}</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
