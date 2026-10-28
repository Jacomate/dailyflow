import { Link } from 'react-router-dom'
import { ConfirmButton, PageHeader } from '../components/ui'
import { resetAll, updateSettings, useData } from '../lib/store'

function Stepper({ value, min, max, onChange, label, unit }: { value: number; min: number; max: number; onChange: (v: number) => void; label: string; unit: string }) {
  return (
    <div className="flex items-center gap-3">
      <button type="button" className="btn-ghost h-11 w-11 min-h-0 px-0 text-xl" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Diminuer : ${label}`}>
        −
      </button>
      <span className="min-w-20 text-center font-semibold" aria-live="polite">
        {value} {unit}
      </span>
      <button type="button" className="btn-ghost h-11 w-11 min-h-0 px-0 text-xl" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Augmenter : ${label}`}>
        +
      </button>
    </div>
  )
}

export default function Settings() {
  const { settings } = useData()
  return (
    <div>
      <PageHeader title="Réglages" back="/" />
      <div className="grid gap-7">
        <div>
          <label className="label" htmlFor="name">
            Ton prénom
          </label>
          <input
            id="name"
            className="field"
            value={settings.displayName}
            maxLength={30}
            onChange={(e) => updateSettings({ displayName: e.target.value })}
            placeholder="Pour la salutation de l’accueil"
            autoComplete="given-name"
          />
        </div>

        <div>
          <p className="label">Objectif de jours actifs par semaine</p>
          <Stepper value={settings.weeklyGoalDays} min={1} max={7} unit={settings.weeklyGoalDays > 1 ? 'jours' : 'jour'} label="objectif hebdomadaire" onChange={(v) => updateSettings({ weeklyGoalDays: v })} />
        </div>

        <div>
          <p className="label">Repos d’une mission terminée</p>
          <p className="-mt-1 mb-2 text-sm text-ink-soft">Une mission faite ne ressort pas au tirage pendant ce délai.</p>
          <Stepper value={settings.cooldownDays} min={0} max={14} unit={settings.cooldownDays > 1 ? 'jours' : 'jour'} label="délai de repos" onChange={(v) => updateSettings({ cooldownDays: v })} />
        </div>

        <Link to="/installer" className="flex min-h-14 items-center justify-between rounded-2xl border-2 border-line px-4 font-semibold">
          Installer l’appli sur ton téléphone
        </Link>

        <div className="rounded-2xl bg-paper-deep p-4 text-sm">
          <p className="font-semibold">Où sont tes données ?</p>
          <p className="mt-1 text-ink-soft">
            Pour l’instant, uniquement sur cet appareil. La sauvegarde en ligne et la synchronisation entre appareils arrivent avec la création de compte.
          </p>
        </div>

        <div className="grid">
          <ConfirmButton label="Tout réinitialiser" confirmLabel="Confirmer : effacer toutes mes données" onConfirm={resetAll} />
        </div>
      </div>
    </div>
  )
}
