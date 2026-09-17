"use client"

import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'

interface BitcoinConfettiProps {
  show: boolean
}

const CONFETTI_COLORS = ['#FFB000', '#F7931A', '#F2EAD9', '#FFD25F']

export function BitcoinConfetti({ show }: BitcoinConfettiProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', updateWindowSize)
    updateWindowSize()

    return () => window.removeEventListener('resize', updateWindowSize)
  }, [])

  if (!show) return null

  return <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={1000} colors={CONFETTI_COLORS} />
}
