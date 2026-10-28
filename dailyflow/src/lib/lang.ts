import type { Lang } from './types'

export function detectLang(): Lang {
  const l = (typeof navigator !== 'undefined' ? navigator.language : 'fr').toLowerCase()
  if (l.startsWith('en')) return 'en'
  if (l.startsWith('es')) return 'es'
  return 'fr'
}
