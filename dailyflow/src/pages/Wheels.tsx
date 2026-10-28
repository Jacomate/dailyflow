import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Wheel, type WheelSegment } from '../components/Wheel'
import { DifficultyDots, WHEEL_META, formatDuration } from '../components/ui'
import { acceptRun, draw, eligibleMissions, openRun, reroll, skipRun, startRun, useData, type DrawError } from '../lib/store'
import { useT, type Dict } from '../lib/i18n'
import { missionText } from '../lib/demo'
import { randomInt } from '../lib/random'
import type { Lang, Mission, WheelKind } from '../lib/types'

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
function buildSegments(pool: Mission[], lang: Lang, targetId?: string): WheelSegment[] {
  let chosen = pool
  if (pool.length > MAX_SEGMENTS) {
    const target = pool.find((m) => m.id === targetId)
    const others = shuffle(pool.filter((m) => m.id !== targetId)).slice(0, target ? MAX_SEGMENTS - 1 : MAX_SEGMENTS)
    chosen = shuffle(target ? [target, ...others] : others)
  }
  return chosen.map((m) => ({ id: m.id, label: missionText(m, lang).title }))
}

function errorText(t: Dict, code: DrawError, max?: number): string {
  const e = t.spin.errors
  return code === 'noneForDuration' ? e.noneForDuration(formatDuration(max ?? 0)) : e[code]
}

export default function Wheels() {
  const data = useData()
  const t = useT()
  const lang = data.settings.lang
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
  // Changer de langue : la roue se redessine avec les titres traduits.
  useEffect(() => {
    if (!spinning) setSnapshot(null)
    setError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  const segments = snapshot ?? buildSegments(pool, lang, current?.missionId)
  const currentMission = current ? data.missions.find((m) => m.id === current.missionId) : undefined
  const text = currentMission ? missionText(currentMission, lang) : undefined
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
    setSnapshot(buildSegments(basePool, lang, targetId))
    setSpinning(true)
    setSpinKey((k) => k + 1)
  }

  function onSpin() {
    setError(null)
    const before = pool
    const res = draw(wheel, maxDuration)
    if (!res.ok) return setError(errorText(t, res.reason, maxDuration))
    spinTo(res.run.missionId, before)
  }

  function onReroll() {
    if (!current) return
    setError(null)
    const before = pool
    const res = reroll(current.id, maxDuration)
    if (!res.ok) return setError(errorText(t, res.reason, maxDuration))
    spinTo(res.run.missionId, before)
  }

  return (
    <div>
      <header className="flex items-center justify-between pb-3 pt-4">
        <h1 className="text-[28px] font-bold leading-none">{t.spin.title}</h1>
        <Link to={`/roues/${wheel}/missions`} className="text-sm font-semibold text-ink underline decoration-2 underline-offset-4">
          {t.spin.manage}
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-paper-deep p-1" role="tablist" aria-label={t.spin.choose}>
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
            {t.wheels[k].short}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm font-semibold text-ink-soft" id="max-label">
        {t.spin.maxTime}
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
            {d ? formatDuration(d) : t.spin.all}
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
        {spinning ? t.spin.spinning : pool.length === 0 ? t.spin.none : t.spin.possible(pool.length, pool.length > MAX_SEGMENTS ? MAX_SEGMENTS : null)}
      </p>

      {error && (
        <p role="alert" className="mt-3 rounded-xl border-2 border-danger/40 bg-white px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {!current && (
        <div className="mt-5">
          <button className="btn-sun w-full text-lg" onClick={onSpin} disabled={spinning || pool.length === 0}>
            {t.spin.launch}
          </button>
          {pool.length === 0 && (
            <Link to={`/roues/${wheel}/missions/nouvelle`} className="btn-ghost mt-3 w-full">
              {t.spin.addMission}
            </Link>
          )}
        </div>
      )}

      {showResult && currentMission && text && (
        <section className="mt-6 rounded-3xl border-[3px] border-ink bg-white p-5" aria-labelledby="result-title">
          <p className="text-sm font-semibold" style={{ color: meta.deep }}>
            {t.spin.drawn}
          </p>
          <h2 id="result-title" className="mt-1 text-2xl font-bold leading-tight">
            {text.title}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed">{text.objective}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-soft">
            <span>{formatDuration(currentMission.durationMin)}</span>
            <DifficultyDots value={currentMission.difficulty} />
          </div>
          <p className="mt-3 border-l-4 pl-3 text-sm" style={{ borderColor: meta.color }}>
            <span className="font-semibold">{t.common.successIf} : </span>
            {text.successCriterion}
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
              {t.spin.startNow}
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                acceptRun(current.id)
                navigate('/')
              }}
            >
              {t.spin.later}
            </button>
            {current.rerollUsed ? (
              <button className="btn text-ink-soft" onClick={() => skipRun(current.id)}>
                {t.spin.notToday}
              </button>
            ) : (
              <button className="btn text-ink" onClick={onReroll}>
                {t.spin.reroll}
              </button>
            )}
          </div>
        </section>
      )}

      {current && current.status !== 'drawn' && currentMission && text && (
        <section className="mt-6 rounded-3xl border-2 border-line bg-white p-5">
          <p className="text-sm text-ink-soft">{current.status === 'in_progress' ? t.spin.inProgress : t.spin.accepted}</p>
          <h2 className="mt-1 text-xl font-bold">{text.title}</h2>
          <Link to={`/mission/${current.id}`} className="btn-primary mt-4 w-full">
            {t.spin.open}
          </Link>
          <p className="mt-3 text-center text-xs text-ink-soft">{t.spin.oneAtATime}</p>
        </section>
      )}
    </div>
  )
}
