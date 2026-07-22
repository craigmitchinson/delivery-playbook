import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// No backend. Single-page app that renders a six-slide, fixed-dimension deck.
// The @ccs/ui tokens and self-hosted fonts are vendored under src/vendor/ccs-ui,
// so everything resolves inside the project — no fs.allow escape hatch needed.
export default defineConfig({
  plugins: [react()],
  // Fixed port within the CCS suite (the suite hub lives on 5170).
  server: {
    port: 5180,
    strictPort: true,
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
