"use client"

import React from 'react'
import { useBitcoinPrice } from '../hooks/useBitcoinPrice'
import { BitcoinPriceDisplay } from './bitcoin-price-display'

interface BitcoinCountdownProps {
  targetPrice?: number
}

export default function BitcoinCountdown({ targetPrice = 100000 }: BitcoinCountdownProps) {
  const { price, error, loading } = useBitcoinPrice()
  const [prevPrice, setPrevPrice] = React.useState<number | null>(null)
  const [showConfetti, setShowConfetti] = React.useState(false)
  const [reachedTimestamp, setReachedTimestamp] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (price) {
      setPrevPrice(price)
      if (price >= targetPrice && !showConfetti) {
        setShowConfetti(true)
        setReachedTimestamp(new Date().toLocaleString())
        setTimeout(() => setShowConfetti(false), 10000)
      }
    }
  }, [price, targetPrice, showConfetti])

  const remaining = React.useMemo(() => {
    if (!price) return targetPrice
    return Math.max(targetPrice - price, 0)
  }, [price, targetPrice])

  const progress = React.useMemo(() => {
    if (!price) return 0
    return Math.min((price / targetPrice) * 100, 100)
  }, [price, targetPrice])

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-600 text-center font-medium">Error loading Bitcoin price</p>
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
      reachedTimestamp={reachedTimestamp}
      loading={loading}
      targetReached={price !== null && price >= targetPrice}
    />
  )
}
