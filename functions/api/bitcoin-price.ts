const PROVIDERS: Array<{ url: string; extract: (data: unknown) => number | null }> = [
  {
    url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
    extract: (data) => {
      const usd = (data as { bitcoin?: { usd?: unknown } })?.bitcoin?.usd
      return typeof usd === 'number' && Number.isFinite(usd) ? usd : null
    },
  },
  {
    url: 'https://api.coinbase.com/v2/prices/BTC-USD/spot',
    extract: (data) => {
      const amount = (data as { data?: { amount?: unknown } })?.data?.amount
      const usd = typeof amount === 'string' ? Number(amount) : NaN
      return Number.isFinite(usd) ? usd : null
    },
  },
]

const CACHE_TTL_SECONDS = 60

interface PagesContext {
  request: Request
  waitUntil: (promise: Promise<unknown>) => void
}

const edgeCache = (caches as unknown as { default: Cache }).default

async function fetchBitcoinPrice(): Promise<number> {
  for (const provider of PROVIDERS) {
    try {
      const upstream = await fetch(provider.url, {
        signal: AbortSignal.timeout(8000),
        headers: {
          Accept: 'application/json',
          'User-Agent': 'bitcoin-countdown/1.0',
        },
      })
      if (!upstream.ok) continue
      const usd = provider.extract(await upstream.json())
      if (usd !== null) return usd
    } catch {
      // try next provider
    }
  }
  throw new Error('All price providers failed')
}

export async function onRequestGet({ request, waitUntil }: PagesContext): Promise<Response> {
  const cached = await edgeCache.match(request)
  if (cached) return cached

  try {
    const usd = await fetchBitcoinPrice()

    const response = Response.json(
      { bitcoin: { usd } },
      {
        headers: {
          'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
        },
      }
    )
    waitUntil(edgeCache.put(request, response.clone()))
    return response
  } catch {
    return Response.json(
      { error: 'Failed to fetch Bitcoin price' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
