"use client"

import React from 'react'
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react'
import { BitcoinConfetti } from './bitcoin-confetti'

interface BitcoinPriceDisplayProps {
  price: number | null
  prevPrice: number | null
  progress: number
  remaining: number
  showConfetti: boolean
  reachedDate: string | null
  loading: boolean
  targetReached: boolean
}

function LedgerRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline text-sm sm:text-base">
      <span className="text-terminal-muted shrink-0">{label}</span>
      <span className="flex-1 mx-3 border-b border-dotted border-terminal-line translate-y-[-4px]" aria-hidden="true" />
      <span className={accent ? 'text-terminal-amber' : 'text-terminal-text'}>{value}</span>
    </div>
  )
}

export function BitcoinPriceDisplay({
  price,
  prevPrice,
  progress,
  remaining,
  showConfetti,
  reachedDate,
  loading,
  targetReached
}: BitcoinPriceDisplayProps) {
  const delta = price !== null && prevPrice !== null ? price - prevPrice : null

  return (
    <div className="w-full max-w-2xl border border-terminal-line bg-terminal-panel shadow-[0_0_80px_rgba(255,176,0,0.07)]">
      <BitcoinConfetti show={showConfetti} />

      {/* status bar */}
      <div className="flex items-center justify-between border-b border-terminal-line px-4 py-2.5 text-xs sm:text-sm">
        <span className="text-terminal-muted">BTC/USD</span>
        <span className="flex items-center gap-2 text-terminal-muted">
          PRICE FEED / 60S
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terminal-led opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-terminal-led" />
          </span>
          <span className="sr-only">live price feed</span>
        </span>
      </div>

      <div className="px-5 py-8 sm:px-10 sm:py-10">
        {loading ? (
          <div className="flex items-center justify-center py-10 space-x-2" role="status" aria-label="Loading Bitcoin price">
            <div className="w-2.5 h-2.5 bg-terminal-amber animate-bounce" />
            <div className="w-2.5 h-2.5 bg-terminal-amber animate-bounce [animation-delay:-.3s]" />
            <div className="w-2.5 h-2.5 bg-terminal-amber animate-bounce [animation-delay:-.5s]" />
          </div>
        ) : (
          <>
            {/* headline price */}
            <div className="text-center">
              <div className="text-5xl sm:text-7xl font-bold text-terminal-amber [text-shadow:0_0_24px_rgba(255,176,0,0.35)]">
                ${price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm">
                {delta === null || delta === 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-terminal-muted">
                    <MinusIcon className="w-4 h-4" aria-hidden="true" /> no change
                  </span>
                ) : delta > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-terminal-led">
                    <ArrowUpIcon className="w-4 h-4" aria-hidden="true" /> ${delta.toFixed(2)} since last check
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-red-400">
                    <ArrowDownIcon className="w-4 h-4" aria-hidden="true" /> ${Math.abs(delta).toFixed(2)} since last check
                  </span>
                )}
              </div>
            </div>

            {/* progress rule */}
            <div className="mt-10">
              <div className="relative h-px bg-terminal-line">
                <div
                  className="absolute inset-y-0 left-0 bg-terminal-amber transition-all duration-500 ease-out motion-reduce:transition-none"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-terminal-amber"
                  style={{ left: `${progress}%` }}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-terminal-muted">
                <span>$0</span>
                <span className="text-terminal-amber">{progress.toFixed(1)}%</span>
                <span>$100,000</span>
              </div>
            </div>

            {/* milestone ledger */}
            <div className="mt-8 space-y-2.5">
              <LedgerRow label="target" value="$100,000.00" />
              <LedgerRow label="remaining" value={`$${remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
              <LedgerRow
                label="status"
                value={targetReached ? 'reached' : 'in progress'}
                accent={targetReached}
              />
            </div>

            {targetReached && (
              <div className="mt-8 flex items-center justify-center gap-2 border border-terminal-line px-4 py-3 text-sm">
                <span className="h-2 w-2 rounded-full bg-terminal-led" aria-hidden="true" />
                <span className="text-terminal-led">TARGET REACHED</span>
                <span className="text-terminal-muted">— first crossed $100,000 on {reachedDate}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* footer */}
      <div className="border-t border-terminal-line px-4 py-3 text-center">
        <a
          href="https://ko-fi.com/antoniojasmith"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center text-sm text-terminal-muted transition-colors duration-200 hover:text-terminal-amber"
        >
          {targetReached
            ? '[ buy me a coffee — the target was reached ]'
            : '[ buy me a coffee — for when it hits $100k ]'}
        </a>
      </div>
    </div>
  )
}
