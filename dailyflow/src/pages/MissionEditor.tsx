import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ConfirmButton, DIFFICULTY_LABEL, PageHeader, WHEEL_META } from '../components/ui'
import { deleteMission, saveMission, useData, validateMission, type MissionInput } from '../lib/store'
import type { Difficulty, WheelKind } from '../lib/types'

const PRESETS = [15, 30, 60, 120]

export default function MissionEditor() {
  const { wheel: w, missionId } = useParams()
  const data = useData()
  const navigate = useNavigate()
  const existing = missionId ? data.missions.find((m) => m.id === missionId) : undefined
  const wheel: WheelKind = existing?.wheel ?? (w === 'hustle' ? 'hustle' : 'envies')
  const meta = WHEEL_META[wheel]
  const back = `/roues/${wheel}/missions`

  const [form, setForm] = useState<MissionInput>(() => ({
    wheel,
    title: existing?.title ?? '',
    objective: existing?.objective ?? '',
    successCriterion: existing?.successCriterion ?? '',
    steps: existing?.steps ?? [],
    durationMin: existing?.durationMin ?? 30,
    difficulty: existing?.difficulty ?? 1,
  }))
  const [stepsText, setStepsText] = useState((existing?.steps ?? []).join('\n'))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const custom = !PRESETS.includes(form.durationMin)
  const [showCustom, setShowCustom] = useState(custom)

  if (missionId && !existing) {
    return (
      <div>
        <PageHeader title="Mission introuvable" back="/roues" />
      </div>
    )
  }

  function set<K extends keyof MissionInput>(k: K, v: MissionInput[K]) {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => {
      const { [k as string]: _, ...rest } = e
      return rest
    })
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const input = { ...form, steps: stepsText.split('\n') }
    const errs = validateMission(input)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    saveMission(input, existing?.id)
    navigate(back)
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`e-${k}`} className="mt-1.5 text-sm text-danger">
        {errors[k]}
      </p>
    ) : null

  return (
    <div>
      <PageHeader title={existing ? 'Modifier la mission' : 'Nouvelle mission'} back={back} />
      <p className="-mt-2 mb-5 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: meta.deep }}>
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} />
        Roue {meta.name.toLowerCase()}
      </p>

      <form onSubmit={submit} noValidate className="grid gap-5">
        <div>
          <label className="label" htmlFor="f-title">
            Titre
          </label>
          <input
            id="f-title"
            className="field"
            value={form.title}
            maxLength={80}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Ex. : Analyser 3 pages de vente"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'e-title' : undefined}
          />
          {err('title')}
        </div>

        <div>
          <label className="label" htmlFor="f-objective">
            Ce que tu vas produire
          </label>
          <textarea
            id="f-objective"
            className="field min-h-20"
            value={form.objective}
            onChange={(e) => set('objective', e.target.value)}
            placeholder="Un résultat concret, pas « apprendre le marketing »."
            aria-invalid={!!errors.objective}
            aria-describedby={errors.objective ? 'e-objective' : undefined}
          />
          {err('objective')}
        </div>

        <div>
          <label className="label" htmlFor="f-successCriterion">
            Réussi si
          </label>
          <input
            id="f-successCriterion"
            className="field"
            value={form.successCriterion}
            onChange={(e) => set('successCriterion', e.target.value)}
            placeholder="Ex. : 5 éléments listés et une phrase rédigée"
            aria-invalid={!!errors.successCriterion}
            aria-describedby={errors.successCriterion ? 'e-successCriterion' : undefined}
          />
          {err('successCriterion')}
        </div>

        <fieldset>
          <legend className="label">Durée</legend>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                type="button"
                key={p}
                className="chip"
                aria-pressed={!showCustom && form.durationMin === p}
                onClick={() => {
                  setShowCustom(false)
                  set('durationMin', p)
                }}
              >
                {p < 60 ? `${p} min` : `${p / 60} h`}
              </button>
            ))}
            <button type="button" className="chip" aria-pressed={showCustom} onClick={() => setShowCustom(true)}>
              Autre
            </button>
          </div>
          {showCustom && (
            <div className="mt-2 flex items-center gap-2">
              <input
                id="f-durationMin"
                type="number"
                inputMode="numeric"
                min={5}
                max={480}
                className="field w-28"
                value={form.durationMin || ''}
                onChange={(e) => set('durationMin', Number(e.target.value))}
                aria-label="Durée en minutes"
              />
              <span className="text-ink-soft">minutes</span>
            </div>
          )}
          {err('durationMin')}
        </fieldset>

        <fieldset>
          <legend className="label">Difficulté</legend>
          <div className="grid grid-cols-3 gap-2">
            {([1, 2, 3] as Difficulty[]).map((d) => (
              <button type="button" key={d} className="chip justify-center" aria-pressed={form.difficulty === d} onClick={() => set('difficulty', d)}>
                {DIFFICULTY_LABEL[d]}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="label" htmlFor="f-steps">
            Étapes <span className="font-normal text-ink-soft">(une par ligne, facultatif)</span>
          </label>
          <textarea
            id="f-steps"
            className="field min-h-28"
            value={stepsText}
            onChange={(e) => setStepsText(e.target.value)}
            placeholder={'Choisir la niche\nTrouver 3 pages de vente\n…'}
          />
        </div>

        <button type="submit" className="btn-primary">
          {existing ? 'Enregistrer les modifications' : 'Ajouter la mission'}
        </button>
      </form>

      {existing && (
        <div className="mt-6 grid">
          <ConfirmButton
            label="Supprimer cette mission"
            confirmLabel="Confirmer la suppression"
            onConfirm={() => {
              deleteMission(existing.id)
              navigate(back)
            }}
          />
        </div>
      )}
    </div>
  )
}
