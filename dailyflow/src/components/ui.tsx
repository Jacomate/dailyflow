import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Difficulty, WheelKind } from '../lib/types'

export const WHEEL_META: Record<WheelKind, { name: string; short: string; color: string; deep: string; palette: string[] }> = {
  envies: {
    name: 'Envies et objectifs',
    short: 'Envies',
    color: 'var(--color-envies)',
    deep: 'var(--color-envies-deep)',
    palette: ['#E0457B', '#A82D5A', '#C93A6C', '#8A2149'],
  },
  hustle: {
    name: 'Side hustles',
    short: 'Side hustles',
    color: 'var(--color-hustle)',
    deep: 'var(--color-hustle-deep)',
    palette: ['#14906F', '#0E6E55', '#1A7F64', '#0B5A46'],
  },
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = { 1: 'Facile', 2: 'Moyen', 3: 'Exigeant' }
export const QUALITY_LABEL: Record<Difficulty, string> = { 1: 'Brouillon', 2: 'Correct', 3: 'Solide' }

export function formatDuration(min: number) {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} h ${m}` : `${h} h`
}

export function DifficultyDots({ value }: { value: Difficulty }) {
  return (
    <span className="inline-flex items-center gap-1.5" title={`Difficulté : ${DIFFICULTY_LABEL[value]}`}>
      <span className="inline-flex gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <span key={i} className={`h-2 w-2 rounded-full ${i <= value ? 'bg-ink' : 'bg-line'}`} />
        ))}
      </span>
      <span>{DIFFICULTY_LABEL[value]}</span>
    </span>
  )
}

export function PageHeader({ title, back, right }: { title: string; back?: string; right?: ReactNode }) {
  return (
    <header className="flex items-center gap-3 pb-4 pt-2">
      {back && (
        <Link to={back} className="-ml-2 grid h-11 w-11 place-items-center rounded-full text-ink hover:bg-paper-deep" aria-label="Retour">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
      )}
      <h1 className="flex-1 text-[26px] font-bold leading-tight">{title}</h1>
      {right}
    </header>
  )
}

/** Bouton en deux temps pour les actions destructrices, sans boîte de dialogue native. */
export function ConfirmButton({
  label,
  confirmLabel,
  onConfirm,
  className = 'btn-ghost',
}: {
  label: string
  confirmLabel: string
  onConfirm: () => void
  className?: string
}) {
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    if (!armed) return
    const t = window.setTimeout(() => setArmed(false), 4000)
    return () => window.clearTimeout(t)
  }, [armed])
  return (
    <button
      type="button"
      className={armed ? 'btn border-2 border-danger bg-danger text-white' : className}
      onClick={() => (armed ? (setArmed(false), onConfirm()) : setArmed(true))}
    >
      {armed ? confirmLabel : label}
    </button>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-13 shrink-0 rounded-full border-2 border-ink transition-colors ${checked ? 'bg-ink' : 'bg-white'}`}
    >
      <span
        className={`absolute top-0.5 h-5.5 w-5.5 rounded-full transition-all ${checked ? 'left-[22px] bg-sun' : 'left-0.5 bg-line'}`}
      />
    </button>
  )
}
