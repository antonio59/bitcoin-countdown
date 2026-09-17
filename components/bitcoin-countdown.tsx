"use client"

import React from 'react'
import { useBitcoinPrice } from '../hooks/useBitcoinPrice'
import { BitcoinPriceDisplay } from './bitcoin-price-display'

export const TARGET_REACHED_DATE = 'December 4, 2024'

interface BitcoinCountdownProps {
  targetPrice?: number
}

export default function BitcoinCountdown({ targetPrice = 100000 }: BitcoinCountdownProps) {
  const { price, prevPrice, error, loading } = useBitcoinPrice()
  const [showConfetti, setShowConfetti] = React.useState(false)
  const [targetReached, setTargetReached] = React.useState(false)

  React.useEffect(() => {
    if (price !== null && price >= targetPrice && !targetReached) {
      setTargetReached(true)
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!prefersReducedMotion) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 10000)
      }
    }
  }, [price, targetPrice, targetReached])

  const remaining = React.useMemo(() => {
    if (!price) return targetPrice
    return Math.max(targetPrice - price, 0)
  }, [price, targetPrice])

  const progress = React.useMemo(() => {
    if (!price) return 0
    return Math.min((price / targetPrice) * 100, 100)
  }, [price, targetPrice])

  if (error && price === null) {
    return (
      <div className="border border-terminal-line bg-terminal-panel px-6 py-8 text-center">
        <p className="text-terminal-amber">price feed unavailable</p>
        <p className="text-terminal-muted text-sm mt-2">retrying every 60s</p>
      </div>
    )
  }

  return (
    <BitcoinPriceDisplay
      price={price}
      prevPrice={prevPrice}
      progress={progress}
      remaining={remaining}
      showConfetti={showConfetti}
      reachedDate={targetReached ? TARGET_REACHED_DATE : null}
      loading={loading}
      targetReached={price !== null && price >= targetPrice}
    />
  )
}
