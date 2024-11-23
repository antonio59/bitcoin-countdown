"use client"

import React, { Suspense } from 'react'
import BitcoinCountdown from '../components/bitcoin-countdown'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div className="animate-pulse bg-gray-200 rounded-xl p-6">Loading...</div>}>
          <BitcoinCountdown targetPrice={100000} />
        </Suspense>
      </div>
    </main>
  )
}
