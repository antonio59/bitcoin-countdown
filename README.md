# Bitcoin $100k Countdown

A live price tracker built to count down Bitcoin's run to $100,000 — a milestone it
first crossed on **December 4, 2024**. The site now stands as a milestone record:
when BTC trades below $100k the countdown resumes; above it, the celebration state
fires.

Live at **https://bitcoin-countdown.pages.dev**

## Features

- Real-time Bitcoin price (60s refresh, edge-cached)
- Visual progress rule toward $100k
- Confetti + milestone record when the target is met
- Terminal aesthetic: JetBrains Mono, amber phosphor on OLED black
- `?testPrice=<n>` param to preview any price state

## Tech Stack

- Next.js (App Router, static export) + React 19 + TypeScript
- Tailwind CSS
- Cloudflare Pages — static assets + a Pages Function for `/api/bitcoin-price`
  (CoinGecko primary, Coinbase fallback, 8s timeout, 60s edge cache)

## Development

```bash
pnpm install
pnpm run build        # static export to ./out
pnpm run pages:dev    # local preview incl. the price function (wrangler)
pnpm run pages:deploy # deploy to Cloudflare Pages
```

The Next.js dev server (`pnpm dev`) still works for UI iteration, but
`/api/bitcoin-price` only exists as a Pages Function — use `pages:dev` for the
full stack, or `?testPrice=` to preview states without a backend.

`pnpm run generate-images` regenerates favicons/OG image (requires puppeteer+sharp).
