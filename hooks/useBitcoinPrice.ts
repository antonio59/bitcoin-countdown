"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function useBitcoinPrice() {
  const [price, setPrice] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true)
        setError(null)
        // Check if we're in test mode
        const testPrice = searchParams?.get('testPrice')
        if (testPrice) {
          setPrice(Number(testPrice))
          return
        }

        const response = await fetch('/api/bitcoin-price')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (!data.bitcoin || !data.bitcoin.usd) {
          throw new Error('Invalid data structure received from API')
        }
        setPrice(data.bitcoin.usd)
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

  return { price, error, loading }
}
