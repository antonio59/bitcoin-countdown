"use client"

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

export function useBitcoinPrice() {
  const [price, setPrice] = useState<number | null>(null)
  const [prevPrice, setPrevPrice] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const searchParams = useSearchParams()
  const priceRef = useRef<number | null>(null)

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setError(null)
        // Check if we're in test mode
        const testPrice = Number(searchParams?.get('testPrice'))
        if (searchParams?.has('testPrice') && Number.isFinite(testPrice) && testPrice > 0) {
          setPrevPrice(priceRef.current)
          priceRef.current = testPrice
          setPrice(testPrice)
          setLoading(false)
          return
        }

        const response = await fetch('/api/bitcoin-price')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        const usd = data?.bitcoin?.usd
        if (typeof usd !== 'number' || !Number.isFinite(usd)) {
          throw new Error('Invalid data structure received from API')
        }
        setPrevPrice(priceRef.current)
        priceRef.current = usd
        setPrice(usd)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [searchParams])

  return { price, prevPrice, error, loading }
}
