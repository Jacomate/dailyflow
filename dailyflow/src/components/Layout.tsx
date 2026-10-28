import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { isStoragePersistent } from '../lib/store'

const TABS = [
  {
    to: '/',
    label: 'Accueil',
    icon: <path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" />,
  },
  {
    to: '/roues',
    label: 'Roues',
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7" />
      </>
    ),
  },
  {
    to: '/apprendre',
    label: 'Apprendre',
    icon: <path d="M4 6.5C6.5 5 9.5 5 12 6.5v13C9.5 18 6.5 18 4 19.5zM12 6.5C14.5 5 17.5 5 20 6.5v13c-2.5-1.5-5.5-1.5-8 0" />,
  },
  {
    to: '/lab',
    label: 'Lab',
    icon: <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3M7.5 14h9" />,
  },
]

function useOnline() {
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}

export function Layout() {
  const online = useOnline()
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col">
      {!online && (
        <div className="bg-ink px-4 py-2 text-center text-sm text-paper">
          Hors ligne : tes données restent sur ce téléphone et l’appli fonctionne.
        </div>
      )}
      {!isStoragePersistent() && (
        <div className="bg-sun px-4 py-2 text-center text-sm text-ink">
          Ce navigateur bloque la sauvegarde : tes changements seront perdus en fermant la page.
        </div>
      )}
      <main className="flex-1 px-5 pb-[calc(96px+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]">
        <Outlet />
      </main>
      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-line bg-paper/95 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Navigation principale"
      >
        <ul className="mx-auto grid max-w-md grid-cols-4">
          {TABS.map((t) => (
            <li key={t.to}>
              <NavLink
                to={t.to}
                end={t.to === '/'}
                className={({ isActive }) =>
                  `flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold ${isActive ? 'text-ink' : 'text-ink-soft'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`grid h-8 w-14 place-items-center rounded-full ${isActive ? 'bg-sun' : ''}`}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        {t.icon}
                      </svg>
                    </span>
                    {t.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
