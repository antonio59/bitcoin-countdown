"use client"

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useBitcoinPrice } from '../hooks/useBitcoinPrice'
import { BitcoinConfetti } from './bitcoin-confetti'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

interface BitcoinCountdownProps {
  targetPrice?: number
}

function BitcoinCountdownContent({ targetPrice = 100000 }: BitcoinCountdownProps) {
  const { price, error, loading } = useBitcoinPrice()
  const [prevPrice, setPrevPrice] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [reachedTimestamp, setReachedTimestamp] = useState<string | null>(null)

  const progress = useMemo(() => {
    if (!price) return 0
    return Math.min((price / targetPrice) * 100, 100)
  }, [price, targetPrice])

  useEffect(() => {
    if (price) {
      setPrevPrice(price)
    }
  }, [price])

  useEffect(() => {
    if (price && price >= targetPrice && !showConfetti) {
      setShowConfetti(true)
      setReachedTimestamp(new Date().toLocaleString())
      // Hide confetti after 10 seconds
      setTimeout(() => setShowConfetti(false), 10000)
    }
  }, [price, showConfetti, targetPrice])

  const renderPriceChange = () => {
    if (!price || !prevPrice) return null
    const isUp = price > prevPrice
    const Icon = isUp ? ArrowUpIcon : ArrowDownIcon
    const colorClass = isUp ? 'text-green-500' : 'text-red-500'
    return (
      <span className={`inline-flex items-center ${colorClass}`}>
        <Icon className="w-4 h-4 mr-1" />
        {Math.abs(price - prevPrice).toFixed(2)}
      </span>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto bg-red-500 text-white p-4 rounded-lg">
        <p role="alert">Error: {error}</p>
        <p className="text-sm mt-2">Please try again later or contact support if the problem persists.</p>
      </div>
    )
  }

  return (
    <>
      <BitcoinConfetti show={showConfetti} />
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
            {price && price >= targetPrice ? "Bitcoin reached the target! 🎉" : "Bitcoin to $100k Countdown"}
          </div>
          <p className="text-gray-500 text-sm mb-4">Watch Bitcoin's journey to ${targetPrice.toLocaleString()}</p>
          {loading ? (
            <div className="text-center py-4">Loading Bitcoin price...</div>
          ) : price ? (
            <>
              <div className="flex items-baseline mb-4">
                <div className="text-4xl font-bold text-gray-900" aria-live="polite">${price.toLocaleString()}</div>
                <div className="ml-2">{renderPriceChange()}</div>
              </div>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div 
                    style={{ width: `${progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500 ease-in-out"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {progress.toFixed(2)}% to ${targetPrice.toLocaleString()}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                ${(targetPrice - price).toLocaleString()} to go!
              </div>
              {reachedTimestamp && (
                <div className="mt-4 text-sm text-green-600" aria-live="polite">
                  Bitcoin reached ${targetPrice.toLocaleString()} on: {reachedTimestamp}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default function BitcoinCountdown(props: BitcoinCountdownProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BitcoinCountdownContent {...props} />
    </Suspense>
  )
}

