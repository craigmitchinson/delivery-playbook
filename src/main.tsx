// Design-system CSS first: tokens, then the shared self-hosted fonts, then the
// app's own styles (which only use var(--c-*) references). Vendored from the
// @ccs/ui package so this repo is self-contained — see src/vendor/ccs-ui/README.md.
import './vendor/ccs-ui/tokens.css'
import './vendor/ccs-ui/fonts.css'
import './styles.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
