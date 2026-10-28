import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Wheel, type WheelSegment } from '../components/Wheel'
import { DifficultyDots, WHEEL_META, formatDuration } from '../components/ui'
import { acceptRun, draw, eligibleMissions, openRun, reroll, skipRun, startRun, useData } from '../lib/store'
import { randomInt } from '../lib/random'
import type { Mission, WheelKind } from '../lib/types'

const DURATIONS = [undefined, 15, 30, 60, 120] as const
const MAX_SEGMENTS = 12

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Parts affichées sur la roue : toutes les missions admissibles, ou un échantillon contenant le résultat. */
function buildSegments(pool: Mission[], targetId?: string): WheelSegment[] {
  let chosen = pool
  if (pool.length > MAX_SEGMENTS) {
    const target = pool.find((m) => m.id === targetId)
    const others = shuffle(pool.filter((m) => m.id !== targetId)).slice(0, target ? MAX_SEGMENTS - 1 : MAX_SEGMENTS)
    chosen = shuffle(target ? [target, ...others] : others)
  }
  return chosen.map((m) => ({ id: m.id, label: m.title }))
}

export default function Wheels() {
  const data = useData()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const wheel: WheelKind = params.get('w') === 'hustle' ? 'hustle' : 'envies'
  const maxParam = Number(params.get('max'))
  const maxDuration = DURATIONS.includes(maxParam as 15) ? maxParam : undefined

  const meta = WHEEL_META[wheel]
  const pool = useMemo(() => eligibleMissions(data, wheel, maxDuration), [data, wheel, maxDuration])
  const current = openRun(data, wheel)

  const [spinKey, setSpinKey] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [snapshot, setSnapshot] = useState<WheelSegment[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const segments = snapshot ?? buildSegments(pool, current?.missionId)
  const currentMission = current ? data.missions.find((m) => m.id === current.missionId) : undefined
  const showResult = current && current.status === 'drawn' && !spinning

  function setParam(key: string, value?: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
    setSnapshot(null)
    setError(null)
  }

  function spinTo(targetId: string, basePool: Mission[]) {
    setSnapshot(buildSegments(basePool, targetId))
    setSpinning(true)
    setSpinKey((k) => k + 1)
  }

  function onSpin() {
    setError(null)
    const before = pool
    const res = draw(wheel, maxDuration)
    if (!res.ok) return setError(res.reason)
    spinTo(res.run.missionId, before)
  }

  function onReroll() {
    if (!current) return
    setError(null)
    const before = pool
    const res = reroll(current.id, maxDuration)
    if (!res.ok) return setError(res.reason)
    spinTo(res.run.missionId, before)
  }

  return (
    <div>
      <header className="flex items-center justify-between pb-3 pt-4">
        <h1 className="text-[28px] font-bold leading-none">Roues</h1>
        <Link to={`/roues/${wheel}/missions`} className="text-sm font-semibold text-ink underline decoration-2 underline-offset-4">
          Gérer les missions
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-paper-deep p-1" role="tablist" aria-label="Choisir une roue">
        {(['envies', 'hustle'] as WheelKind[]).map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={wheel === k}
            disabled={spinning}
            onClick={() => setParam('w', k === 'envies' ? undefined : k)}
            className="min-h-11 rounded-xl text-[15px] font-semibold transition-colors"
            style={wheel === k ? { background: WHEEL_META[k].color, color: '#fff' } : { color: 'var(--color-ink-soft)' }}
          >
            {WHEEL_META[k].short}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm font-semibold text-ink-soft" id="max-label">
        Temps maximum
      </p>
      <div className="mt-1.5 grid grid-cols-5 gap-1.5" role="group" aria-labelledby="max-label">
        {DURATIONS.map((d) => (
          <button
            key={d ?? 'all'}
            className="chip justify-center px-1"
            aria-pressed={maxDuration === d}
            disabled={spinning || !!current}
            onClick={() => setParam('max', d ? String(d) : undefined)}
          >
            {d ? formatDuration(d) : 'Tout'}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <Wheel
          segments={segments}
          palette={meta.palette}
          spinKey={spinKey}
          targetId={current?.missionId}
          onSpinEnd={() => setSpinning(false)}
        />
      </div>

      <p className="mt-4 text-center text-sm text-ink-soft" aria-live="polite">
        {spinning
          ? 'La roue tourne…'
          : pool.length === 0
            ? 'Aucune mission ne correspond.'
            : `${pool.length} mission${pool.length > 1 ? 's' : ''} possible${pool.length > 1 ? 's' : ''}${pool.length > MAX_SEGMENTS ? ` (${MAX_SEGMENTS} affichées)` : ''}`}
      </p>

      {error && (
        <p role="alert" className="mt-3 rounded-xl border-2 border-danger/40 bg-white px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {!current && (
        <div className="mt-5">
          <button className="btn-sun w-full text-lg" onClick={onSpin} disabled={spinning || pool.length === 0}>
            Lancer la roue
          </button>
          {pool.length === 0 && (
            <Link to={`/roues/${wheel}/missions/nouvelle`} className="btn-ghost mt-3 w-full">
              Ajouter une mission
            </Link>
          )}
        </div>
      )}

      {showResult && currentMission && (
        <section className="mt-6 rounded-3xl border-[3px] border-ink bg-white p-5" aria-labelledby="result-title">
          <p className="text-sm font-semibold" style={{ color: meta.deep }}>
            Mission tirée
          </p>
          <h2 id="result-title" className="mt-1 text-2xl font-bold leading-tight">
            {currentMission.title}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed">{currentMission.objective}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-soft">
            <span>{formatDuration(currentMission.durationMin)}</span>
            <DifficultyDots value={currentMission.difficulty} />
          </div>
          <p className="mt-3 border-l-4 pl-3 text-sm" style={{ borderColor: meta.color }}>
            <span className="font-semibold">Réussi si : </span>
            {currentMission.successCriterion}
          </p>
          <div className="mt-5 grid gap-2">
            <button
              className="btn-primary"
              onClick={() => {
                acceptRun(current.id)
                startRun(current.id)
                navigate(`/mission/${current.id}`)
              }}
            >
              Commencer maintenant
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                acceptRun(current.id)
                navigate('/')
              }}
            >
              Garder pour plus tard
            </button>
            {current.rerollUsed ? (
              <button className="btn text-ink-soft" onClick={() => skipRun(current.id)}>
                Pas aujourd’hui
              </button>
            ) : (
              <button className="btn text-ink" onClick={onReroll}>
                Relancer une fois
              </button>
            )}
          </div>
        </section>
      )}

      {current && current.status !== 'drawn' && currentMission && (
        <section className="mt-6 rounded-3xl border-2 border-line bg-white p-5">
          <p className="text-sm text-ink-soft">{current.status === 'in_progress' ? 'En cours' : 'Acceptée, à faire'}</p>
          <h2 className="mt-1 text-xl font-bold">{currentMission.title}</h2>
          <Link to={`/mission/${current.id}`} className="btn-primary mt-4 w-full">
            Ouvrir la mission
          </Link>
          <p className="mt-3 text-center text-xs text-ink-soft">Une mission à la fois par roue : termine-la pour relancer.</p>
        </section>
      )}
    </div>
  )
}
