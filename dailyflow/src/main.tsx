import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Service worker : mise en cache pour l'installation et le hors-ligne.
// Ignoré si le navigateur ne le permet pas (aperçu intégré, navigation privée…).
if (import.meta.env.PROD && 'serviceWorker' in navigator && window.self === window.top) {
  import('virtual:pwa-register')
    .then(({ registerSW }) => registerSW({ immediate: true }))
    .catch(() => {})
}
