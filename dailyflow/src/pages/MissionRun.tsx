import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ConfirmButton, DifficultyDots, PageHeader, WHEEL_META, formatDuration, runTitle } from '../components/ui'
import { useT } from '../lib/i18n'
import { missionText } from '../lib/demo'
import { completeRun, skipRun, startRun, toggleStep, useData } from '../lib/store'
import type { Difficulty } from '../lib/types'

function useMinutesSince(iso?: string) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!iso) return
    const t = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(t)
  }, [iso])
  return iso ? Math.max(0, Math.floor((now - Date.parse(iso)) / 60_000)) : 0
}

export default function MissionRun() {
  const { runId } = useParams()
  const data = useData()
  const t = useT()
  const lang = data.settings.lang
  const navigate = useNavigate()
  const run = data.runs.find((r) => r.id === runId)
  const mission = run ? data.missions.find((m) => m.id === run.missionId) : undefined
  const elapsed = useMinutesSince(run?.status === 'in_progress' ? run.startedAt : undefined)

  const [finishing, setFinishing] = useState(false)
  const [note, setNote] = useState('')
  const [quality, setQuality] = useState<Difficulty | null>(null)
  const [qualityError, setQualityError] = useState(false)

  if (!run) {
    return (
      <div>
        <PageHeader title={t.common.notFound} back="/" />
        <p className="text-ink-soft">{t.run.gone}</p>
      </div>
    )
  }

  const meta = WHEEL_META[run.wheel]
  const text = mission ? missionText(mission, lang) : undefined
  const steps = text?.steps ?? []
  const editable = run.status === 'accepted' || run.status === 'in_progress'

  return (
    <div>
      <PageHeader title={runTitle(run, data, lang)} back="/" />
      <div className="-mt-2 mb-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
        <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: meta.deep }}>
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} />
          {t.wheels[run.wheel].short}
        </span>
        {mission && <span>{formatDuration(mission.durationMin)}</span>}
        {mission && <DifficultyDots value={mission.difficulty} />}
      </div>

      {!mission && (
        <p className="mb-4 rounded-xl bg-white p-4 text-sm text-ink-soft">
          {t.run.templateDeleted}
        </p>
      )}

      {mission && text && (
        <>
          <section>
            <h2 className="text-lg font-bold">{t.common.objective}</h2>
            <p className="mt-1 text-[15px] leading-relaxed">{text.objective}</p>
          </section>

          {steps.length > 0 && (
            <section className="mt-6">
              <h2 className="text-lg font-bold">
                {t.common.steps}{' '}
                <span className="text-sm font-semibold text-ink-soft">
                  {run.stepsDone.length}/{steps.length}
                </span>
              </h2>
              <ol className="mt-2 grid gap-2">
                {steps.map((s, i) => {
                  const done = run.stepsDone.includes(i)
                  return (
                    <li key={i}>
                      <label
                        className={`flex min-h-12 items-center gap-3 rounded-xl border-2 bg-white px-3.5 py-2.5 ${done ? 'border-ink' : 'border-line'} ${editable ? '' : 'opacity-70'}`}
                      >
                        <input
                          type="checkbox"
                          className="h-5 w-5 shrink-0 accent-[var(--color-ink)]"
                          checked={done}
                          disabled={!editable}
                          onChange={() => toggleStep(run.id, i)}
                        />
                        <span className={done ? 'text-ink-soft line-through' : ''}>{s}</span>
                      </label>
                    </li>
                  )
                })}
              </ol>
            </section>
          )}

          <section className="mt-6 border-l-4 pl-3" style={{ borderColor: meta.color }}>
            <h2 className="text-lg font-bold">{t.common.successIf}</h2>
            <p className="mt-1 text-[15px]">{text.successCriterion}</p>
          </section>
        </>
      )}

      <div className="mt-8">
        {run.status === 'accepted' && (
          <button className="btn-sun w-full text-lg" onClick={() => startRun(run.id)}>
            {t.run.start}
          </button>
        )}

        {run.status === 'in_progress' && !finishing && (
          <>
            <p className="mb-3 text-center text-sm text-ink-soft">
              {t.run.startedAgo(elapsed < 1 ? null : formatDuration(elapsed))}
            </p>
            <button className="btn-sun w-full text-lg" onClick={() => setFinishing(true)}>
              {t.run.finished}
            </button>
          </>
        )}

        {run.status === 'in_progress' && finishing && (
          <form
            className="rounded-3xl border-[3px] border-ink bg-white p-5"
            onSubmit={(e) => {
              e.preventDefault()
              if (!quality) return setQualityError(true)
              completeRun(run.id, note, quality)
            }}
          >
            <h2 className="text-xl font-bold">{t.run.result}</h2>
            <label className="label mt-4" htmlFor="note">
              {t.run.whatProduced} <span className="font-normal text-ink-soft">{t.run.noteBonus}</span>
            </label>
            <textarea
              id="note"
              className="field min-h-24"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.run.notePlaceholder}
              maxLength={1000}
            />
            <fieldset className="mt-4">
              <legend className="label">{t.run.selfReview}</legend>
              <div className="grid grid-cols-3 gap-2">
                {([1, 2, 3] as Difficulty[]).map((q) => (
                  <button
                    type="button"
                    key={q}
                    className="chip justify-center"
                    aria-pressed={quality === q}
                    onClick={() => {
                      setQuality(q)
                      setQualityError(false)
                    }}
                  >
                    {t.common.quality[q]}
                  </button>
                ))}
              </div>
              {qualityError && <p className="mt-2 text-sm text-danger">{t.run.pickQuality}</p>}
            </fieldset>
            <button type="submit" className="btn-primary mt-5 w-full">
              {t.run.validate}
            </button>
            <button type="button" className="btn mt-1 w-full text-ink-soft" onClick={() => setFinishing(false)}>
              {t.run.notYet}
            </button>
          </form>
        )}

        {run.status === 'done' && (
          <section className="rounded-3xl border-[3px] border-ink bg-sun p-5">
            <p className="font-display text-4xl font-bold">{t.run.points(run.xp ?? 0)}</p>
            <p className="mt-1 font-semibold">
              {t.run.done(run.quality ? t.common.quality[run.quality] : null)}
            </p>
            {run.resultNote && <p className="mt-3 rounded-xl bg-white/70 p-3 text-[15px]">{run.resultNote}</p>}
            <div className="mt-4 grid gap-2">
              <Link to={`/roues${run.wheel === 'hustle' ? '?w=hustle' : ''}`} className="btn-primary">
                {t.run.backToWheels}
              </Link>
              <Link to="/progression" className="btn border-2 border-ink">
                {t.run.seeProgress}
              </Link>
            </div>
          </section>
        )}

        {run.status === 'skipped' && <p className="text-center text-ink-soft">{t.run.skipped}</p>}

        {editable && (
          <div className="mt-3 grid">
            <ConfirmButton
              label={t.run.abandon}
              confirmLabel={t.run.confirmAbandon}
              className="btn text-ink-soft"
              onConfirm={() => {
                skipRun(run.id)
                navigate('/roues' + (run.wheel === 'hustle' ? '?w=hustle' : ''))
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
