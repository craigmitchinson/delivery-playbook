// Renders the built one-pager to PDF (A4 landscape) with headless Chromium.
// Needs playwright resolvable (npx playwright or NODE_PATH) and a Chromium.
import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'

const html = fileURLToPath(new URL('playbook-on-a-page.html', import.meta.url))
const pdf = fileURLToPath(new URL('playbook-on-a-page.pdf', import.meta.url))
const launch = { executablePath: process.env.CHROMIUM_PATH || undefined }

const browser = await chromium.launch(launch)
const page = await browser.newPage()
await page.goto(`file://${html}`, { waitUntil: 'load' })
await page.emulateMedia({ media: 'print', colorScheme: 'light' })
await page.pdf({
  path: pdf,
  format: 'A4',
  landscape: true,
  printBackground: true,
  scale: 0.88,
  margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
})
await browser.close()
console.log('wrote', pdf)
