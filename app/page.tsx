"use client"

import React from 'react'
import BitcoinCountdown from '../components/bitcoin-countdown'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <BitcoinCountdown targetPrice={100000} />
      </div>
    </main>
  )
}
