import React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: 'Bitcoin $100k Countdown',
  description: 'Track Bitcoin\'s journey to $100,000 with live price updates and a visual countdown.',
  openGraph: {
    title: 'Bitcoin $100k Countdown',
    description: 'Track Bitcoin\'s journey to $100,000 with live price updates and a visual countdown.',
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
    title: 'Bitcoin $100k Countdown',
    description: 'Track Bitcoin\'s journey to $100,000 with live price updates and a visual countdown.',
    images: [`${siteUrl}/og-image.png`],
    creator: '@yourtwitterhandle',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    shortcut: '/shortcut-icon.png',
    apple: '/apple-touch-icon.png',
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
    <html lang="en">
      <head>
        <Script 
          src='https://storage.ko-fi.com/cdn/widget/Widget_2.js'
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
