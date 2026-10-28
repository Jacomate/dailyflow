import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ConfirmButton, DifficultyDots, PageHeader, QUALITY_LABEL, WHEEL_META, formatDuration } from '../components/ui'
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
        <PageHeader title="Mission introuvable" back="/" />
        <p className="text-ink-soft">Cette mission n’existe plus sur cet appareil.</p>
      </div>
    )
  }

  const meta = WHEEL_META[run.wheel]
  const steps = mission?.steps ?? []
  const editable = run.status === 'accepted' || run.status === 'in_progress'

  return (
    <div>
      <PageHeader title={run.missionTitle} back="/" />
      <div className="-mt-2 mb-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
        <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: meta.deep }}>
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} />
          {meta.short}
        </span>
        {mission && <span>{formatDuration(mission.durationMin)}</span>}
        {mission && <DifficultyDots value={mission.difficulty} />}
      </div>

      {!mission && (
        <p className="mb-4 rounded-xl bg-white p-4 text-sm text-ink-soft">
          Le modèle de cette mission a été supprimé. L’historique reste disponible.
        </p>
      )}

      {mission && (
        <>
          <section>
            <h2 className="text-lg font-bold">Objectif</h2>
            <p className="mt-1 text-[15px] leading-relaxed">{mission.objective}</p>
          </section>

          {steps.length > 0 && (
            <section className="mt-6">
              <h2 className="text-lg font-bold">
                Étapes{' '}
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
            <h2 className="text-lg font-bold">Réussi si</h2>
            <p className="mt-1 text-[15px]">{mission.successCriterion}</p>
          </section>
        </>
      )}

      <div className="mt-8">
        {run.status === 'accepted' && (
          <button className="btn-sun w-full text-lg" onClick={() => startRun(run.id)}>
            Commencer
          </button>
        )}

        {run.status === 'in_progress' && !finishing && (
          <>
            <p className="mb-3 text-center text-sm text-ink-soft">
              Commencée il y a {elapsed < 1 ? 'moins d’une minute' : formatDuration(elapsed)}
            </p>
            <button className="btn-sun w-full text-lg" onClick={() => setFinishing(true)}>
              J’ai terminé
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
            <h2 className="text-xl font-bold">Ton résultat</h2>
            <label className="label mt-4" htmlFor="note">
              Qu’as-tu produit ? <span className="font-normal text-ink-soft">(+5 points si tu le notes)</span>
            </label>
            <textarea
              id="note"
              className="field min-h-24"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex. : 10 mots notés dans mon carnet, landing page en ligne…"
              maxLength={1000}
            />
            <fieldset className="mt-4">
              <legend className="label">Ce que tu en penses</legend>
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
                    {QUALITY_LABEL[q]}
                  </button>
                ))}
              </div>
              {qualityError && <p className="mt-2 text-sm text-danger">Choisis une évaluation pour valider.</p>}
            </fieldset>
            <button type="submit" className="btn-primary mt-5 w-full">
              Valider la mission
            </button>
            <button type="button" className="btn mt-1 w-full text-ink-soft" onClick={() => setFinishing(false)}>
              Pas encore fini
            </button>
          </form>
        )}

        {run.status === 'done' && (
          <section className="rounded-3xl border-[3px] border-ink bg-sun p-5">
            <p className="font-display text-4xl font-bold">+{run.xp} points</p>
            <p className="mt-1 font-semibold">
              Mission terminée{run.quality ? `, résultat ${QUALITY_LABEL[run.quality].toLowerCase()}` : ''}
            </p>
            {run.resultNote && <p className="mt-3 rounded-xl bg-white/70 p-3 text-[15px]">{run.resultNote}</p>}
            <div className="mt-4 grid gap-2">
              <Link to={`/roues${run.wheel === 'hustle' ? '?w=hustle' : ''}`} className="btn-primary">
                Retour aux roues
              </Link>
              <Link to="/progression" className="btn border-2 border-ink">
                Voir ma progression
              </Link>
            </div>
          </section>
        )}

        {run.status === 'skipped' && <p className="text-center text-ink-soft">Mission mise de côté. Aucune pénalité.</p>}

        {editable && (
          <div className="mt-3 grid">
            <ConfirmButton
              label="Abandonner cette mission"
              confirmLabel="Confirmer l’abandon (sans pénalité)"
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
