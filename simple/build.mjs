// Inlines the vendored CCS fonts into the one-page playbook so it is a single
// self-contained file that can be shared or published anywhere.
import { readFileSync, writeFileSync } from 'node:fs'

const dir = new URL('.', import.meta.url)
const fonts = new URL('../src/vendor/ccs-ui/fonts/', import.meta.url)
const faces = [
  ['Gelasio', 'gelasio-600', 600],
  ['Carlito', 'carlito-400', 400],
  ['Carlito', 'carlito-700', 700],
  ['JetBrains Mono', 'jetbrains-mono-500', 500],
]
const css = faces
  .map(([family, file, weight]) => {
    const b64 = readFileSync(new URL(`${file}.woff2`, fonts)).toString('base64')
    return `@font-face { font-family: '${family}'; src: url(data:font/woff2;base64,${b64}) format('woff2'); font-weight: ${weight}; font-style: normal; font-display: swap; }`
  })
  .join('\n')

const src = readFileSync(new URL('playbook-on-a-page.src.html', dir), 'utf8')
writeFileSync(new URL('playbook-on-a-page.html', dir), src.replace('/*FONTS*/', css))
