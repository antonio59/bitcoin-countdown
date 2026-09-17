import puppeteer from 'puppeteer'

const url = process.argv[2] || 'http://localhost:8788/'
const out = process.argv[3] || 'screenshot.png'
const width = Number(process.argv[4] || 1280)
const height = Number(process.argv[5] || 800)

const browser = await puppeteer.launch({
  executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
})
const page = await browser.newPage()
await page.setViewport({ width, height, deviceScaleFactor: 2 })
await page.goto(url, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 1200))
await page.screenshot({ path: out })
await browser.close()
console.log(`saved ${out}`)
