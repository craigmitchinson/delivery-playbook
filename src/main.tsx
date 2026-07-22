// Design-system CSS first: tokens, then the shared self-hosted fonts, then the
// app's own styles (which only use var(--c-*) references).
import '@ccs/ui/tokens.css'
import '@ccs/ui/fonts.css'
import './styles.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
