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
  // Quand une nouvelle version prend la main, on recharge une fois pour l'afficher.
  const hadController = !!navigator.serviceWorker.controller
  let reloaded = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloaded) return
    reloaded = true
    window.location.reload()
  })
  import('virtual:pwa-register')
    .then(({ registerSW }) => {
      const update = registerSW({
        immediate: true,
        // Ancienne version restée en attente : on lui demande de s'activer.
        onNeedRefresh: () => update(true),
        // Vérifie les mises à jour quand l'appli revient au premier plan.
        onRegisteredSW: (_url, reg) => {
          if (!reg) return
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') reg.update().catch(() => {})
          })
        },
      })
    })
    .catch(() => {})
}
