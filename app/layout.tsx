import React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: 'Bitcoin $100k — Reached',
  description: 'Bitcoin crossed $100,000 on December 4, 2024. Live price tracker and milestone record.',
  openGraph: {
    title: 'Bitcoin $100k — Reached',
    description: 'Bitcoin crossed $100,000 on December 4, 2024. Live price tracker and milestone record.',
    url: siteUrl,
    siteName: 'Bitcoin $100k Countdown',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Bitcoin $100k Countdown',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitcoin $100k — Reached',
    description: 'Bitcoin crossed $100,000 on December 4, 2024. Live price tracker and milestone record.',
    images: [`${siteUrl}/og-image.png`],
    creator: '@antoniojasmith',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/mask-icon.svg',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="font-mono bg-terminal-bg text-terminal-text">{children}</body>
    </html>
  )
}
