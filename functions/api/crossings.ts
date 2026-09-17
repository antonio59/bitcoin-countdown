const TARGET = 100_000
// 2024-11-01 UTC — comfortably before the first $100k cross (Dec 4, 2024)
const HISTORY_START = 1730332800
const CACHE_TTL_SECONDS = 1800

interface PagesContext {
  request: Request
  waitUntil: (promise: Promise<unknown>) => void
}

interface Candle {
  t: number
  h: number
  c: number
}

const edgeCache = (caches as unknown as { default: Cache }).default

const FETCH_OPTS = {
  headers: { Accept: 'application/json', 'User-Agent': 'bitcoin-countdown/1.0' },
} as const

// Kraken OHLC: [time, open, high, low, close, vwap, volume, count] — values are strings.
// `since` is a forward cursor: oldest 720 candles after it; `result.last` continues.
async function fromKraken(): Promise<Candle[]> {
  const candles: Candle[] = []
  let since = HISTORY_START
  for (let page = 0; page < 10; page++) {
    const res = await fetch(
      `https://api.kraken.com/0/public/OHLC?pair=XBTUSD&interval=1440&since=${since}`,
      { ...FETCH_OPTS, signal: AbortSignal.timeout(8000) }
    )
    if (!res.ok) throw new Error(`Kraken responded ${res.status}`)
    const json = (await res.json()) as {
      error?: string[]
      result?: Record<string, unknown>
    }
    if (json.error?.length) throw new Error(`Kraken error: ${json.error[0]}`)
    const result = json.result ?? {}
    const batch = Object.values(result).find(Array.isArray) as
      | [number, string, string, string, string, string, string, number][]
      | undefined
    if (!batch?.length) throw new Error('Unexpected Kraken payload')
    for (const c of batch) {
      candles.push({ t: c[0], h: Number(c[2]), c: Number(c[4]) })
    }
    const last = typeof result.last === 'number' ? result.last : 0
    if (batch.length < 720 || last <= since) break
    since = last
  }
  return candles
}

// Coinbase candles: [time, low, high, open, close, volume] — newest first, max 300/request.
async function fromCoinbase(): Promise<Candle[]> {
  const candles: Candle[] = []
  const now = Math.floor(Date.now() / 1000)
  for (let end = now; end > HISTORY_START; end -= 300 * 86400) {
    const start = Math.max(HISTORY_START, end - 300 * 86400)
    const res = await fetch(
      `https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=86400&start=${new Date(start * 1000).toISOString()}&end=${new Date(end * 1000).toISOString()}`,
      { ...FETCH_OPTS, signal: AbortSignal.timeout(8000) }
    )
    if (!res.ok) throw new Error(`Coinbase responded ${res.status}`)
    const batch = (await res.json()) as [number, number, number, number, number, number][]
    if (!Array.isArray(batch)) throw new Error('Unexpected Coinbase payload')
    for (const c of batch) {
      candles.push({ t: c[0], h: c[2], c: c[4] })
    }
    if (batch.length < 2) break
  }
  return candles
}

// A crossing = a day whose high traded at/above target while the previous day closed below.
function computeCrossings(candles: Candle[]): string[] {
  const sorted = [...candles].sort((a, b) => a.t - b.t)
  const dates: string[] = []
  for (let i = 0; i < sorted.length; i++) {
    const prevClose = i > 0 ? sorted[i - 1].c : 0
    if (sorted[i].h >= TARGET && prevClose < TARGET) {
      dates.push(new Date(sorted[i].t * 1000).toISOString().slice(0, 10))
    }
  }
  return dates
}

export async function onRequestGet({ request, waitUntil }: PagesContext): Promise<Response> {
  const cached = await edgeCache.match(request)
  if (cached) return cached

  let candles: Candle[] | null = null
  for (const source of [fromKraken, fromCoinbase]) {
    try {
      candles = await source()
      break
    } catch {
      // try next source
    }
  }

  if (!candles?.length) {
    return Response.json(
      { error: 'Failed to fetch price history' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  const response = Response.json(
    { target: TARGET, crossings: computeCrossings(candles) },
    { headers: { 'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}` } }
  )
  waitUntil(edgeCache.put(request, response.clone()))
  return response
}
