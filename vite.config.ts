import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// @ccs/ui is a `file:../ccs-ui` dependency, so npm links it as a junction and
// its self-hosted fonts resolve to a path outside this project. Without this
// the dev server 403s them and the deck silently falls back to system fonts —
// which is exactly the non-deterministic rendering the self-hosted fonts exist
// to prevent. Production builds copy them into dist/ and are unaffected.
const suiteRoot = fileURLToPath(new URL('..', import.meta.url))

// No backend. Single-page app that renders a six-slide, fixed-dimension deck.
export default defineConfig({
  plugins: [react()],
  // Fixed port within the CCS suite (the suite hub lives on 5170).
  server: {
    port: 5180,
    strictPort: true,
    fs: { allow: [suiteRoot] },
  },
  preview: {
    port: 5180,
    strictPort: true,
  },
  // Inline nothing as base64 so font files stay deterministic, cacheable assets.
  build: {
    assetsInlineLimit: 0,
  },
})
