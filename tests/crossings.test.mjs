import assert from 'node:assert/strict'
import test from 'node:test'

const DAY = 86_400
const DEC_4_2024 = Date.UTC(2024, 11, 4) / 1000

async function loadComputeCrossings() {
  // crossings.ts reads the Workers cache global while the module loads.
  globalThis.caches = { default: {} }
  const mod = await import('../functions/api/crossings.ts')
  return mod.computeCrossings
}

test('computeCrossings records the day price trades through $100k', async () => {
  const computeCrossings = await loadComputeCrossings()
  const crossings = computeCrossings([
    { t: DEC_4_2024 + DAY, h: 104_000, c: 101_000 },
    { t: DEC_4_2024 - DAY, h: 99_000, c: 98_000 },
    { t: DEC_4_2024, h: 103_000, c: 100_500 },
  ])

  assert.deepEqual(crossings, ['2024-12-04'])
})

test('computeCrossings ignores days that stay under $100k', async () => {
  const computeCrossings = await loadComputeCrossings()
  const crossings = computeCrossings([
    { t: DEC_4_2024, h: 99_999, c: 99_000 },
  ])

  assert.deepEqual(crossings, [])
})

test('computeCrossings does not repeat a cross while the previous close stays above target', async () => {
  const computeCrossings = await loadComputeCrossings()
  const crossings = computeCrossings([
    { t: DEC_4_2024, h: 103_000, c: 100_500 },
    { t: DEC_4_2024 + DAY, h: 105_000, c: 102_000 },
  ])

  assert.deepEqual(crossings, ['2024-12-04'])
})
