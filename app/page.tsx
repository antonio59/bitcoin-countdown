"use client"

import React, { Suspense } from 'react'
import BitcoinCountdown from '../components/bitcoin-countdown'
import { CrossingLog } from '../components/crossing-log'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 sm:p-8">
      <Suspense fallback={<div className="w-full max-w-2xl border border-terminal-line bg-terminal-panel px-6 py-20 text-center text-terminal-muted">connecting…</div>}>
        <BitcoinCountdown targetPrice={100000} />
      </Suspense>
      <CrossingLog />
    </main>
  )
}
