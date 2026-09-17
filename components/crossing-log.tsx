"use client"

import React from 'react'
import { useCrossings } from '../hooks/useCrossings'

export function CrossingLog() {
  const { crossings, loading, error } = useCrossings()

  const firstCross = crossings.length ? crossings[0] : null
  const latestFirst = [...crossings].reverse()

  return (
    <section className="w-full max-w-2xl border border-terminal-line bg-terminal-panel" aria-label="$100k crossing log">
      <div className="flex items-center justify-between border-b border-terminal-line px-4 py-2.5 text-xs sm:text-sm">
        <span className="text-terminal-muted">crossing log</span>
        <span className="text-terminal-muted">BTC ≥ $100k / daily</span>
      </div>

      <div className="max-h-64 overflow-y-auto px-4 py-3">
        {loading ? (
          <p className="py-6 text-center text-sm text-terminal-muted">loading history…</p>
        ) : error ? (
          <p className="py-6 text-center text-sm text-terminal-muted">crossing log unavailable</p>
        ) : (
          <ol className="divide-y divide-terminal-line/60 text-sm">
            {latestFirst.map((date) => {
              const index = crossings.indexOf(date) + 1
              return (
                <li key={date} className="flex items-baseline py-2">
                  <span className="text-terminal-text">{date}</span>
                  <span className="flex-1 mx-3 border-b border-dotted border-terminal-line translate-y-[-4px]" aria-hidden="true" />
                  {date === firstCross ? (
                    <span className="text-terminal-amber">first cross</span>
                  ) : (
                    <span className="text-terminal-muted">cross #{String(index).padStart(2, '0')}</span>
                  )}
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </section>
  )
}
