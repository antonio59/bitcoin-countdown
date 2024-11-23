"use client"

import React from 'react'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import { BitcoinConfetti } from './bitcoin-confetti'

interface BitcoinPriceDisplayProps {
  price: number | null
  prevPrice: number | null
  progress: number
  remaining: number
  showConfetti: boolean
  reachedTimestamp: string | null
  loading: boolean
  targetReached: boolean
}

export function BitcoinPriceDisplay({
  price,
  prevPrice,
  progress,
  remaining,
  showConfetti,
  reachedTimestamp,
  loading,
  targetReached
}: BitcoinPriceDisplayProps) {
  return (
    <div className="space-y-2">
      <BitcoinConfetti show={showConfetti} />
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-5">
          <h2 className="text-white text-xl font-bold text-center">
            {targetReached ? "Target Reached! 🎉" : "Bitcoin to $100k"}
          </h2>
        </div>
        
        <div className="px-8 py-6 space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-4 space-x-2">
              <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce" />
              <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-.3s]" />
              <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-.5s]" />
            </div>
          ) : (
            <div>
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 mb-3">
                  ${price?.toLocaleString()}
                </div>
                {prevPrice && price && (
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${price > prevPrice ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                    {price > prevPrice ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
                    ${Math.abs(price - prevPrice).toFixed(2)}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-gray-600">Progress to $100k</span>
                  <span className="text-orange-600">{progress.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-5">
                <div className="text-center">
                  <div className="text-gray-600 font-medium mb-2">Remaining to Target</div>
                  <div className="text-3xl font-bold text-orange-600">
                    ${remaining.toLocaleString()}
                  </div>
                </div>
              </div>

              {reachedTimestamp && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <p className="text-green-600 text-sm text-center font-medium">
                    🎯 Target reached on: {reachedTimestamp}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-8 py-4 border-t border-gray-100">
          <div className="text-center">
            <a 
              href="https://ko-fi.com/O4O416CKYY"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#72a4f2] hover:bg-[#5d93e1] transition-colors"
            >
              <img 
                src="https://storage.ko-fi.com/cdn/cup-border.png"
                alt="Ko-fi"
                className="w-5 h-5 mr-2"
              />
              Buy me a coffee when Bitcoin hits $100k
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
