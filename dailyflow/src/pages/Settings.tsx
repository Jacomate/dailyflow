import { Link } from 'react-router-dom'
import { ConfirmButton, LangSwitch, PageHeader } from '../components/ui'
import { resetAll, updateSettings, useData } from '../lib/store'
import { useT } from '../lib/i18n'

function Stepper({ value, min, max, onChange, label, unit }: { value: number; min: number; max: number; onChange: (v: number) => void; label: string; unit: string }) {
  const t = useT()
  return (
    <div className="flex items-center gap-3">
      <button type="button" className="btn-ghost h-11 w-11 min-h-0 px-0 text-xl" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={t.settings.decrease(label)}>
        −
      </button>
      <span className="min-w-20 text-center font-semibold" aria-live="polite">
        {value} {unit}
      </span>
      <button type="button" className="btn-ghost h-11 w-11 min-h-0 px-0 text-xl" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={t.settings.increase(label)}>
        +
      </button>
    </div>
  )
}

export default function Settings() {
  const { settings } = useData()
  const t = useT()
  return (
    <div>
      <PageHeader title={t.settings.title} back="/" />
      <div className="grid gap-7">
        <div>
          <p className="label">{t.common.language}</p>
          <LangSwitch value={settings.lang} onChange={(l) => updateSettings({ lang: l })} />
        </div>

        <div>
          <label className="label" htmlFor="name">
            {t.settings.name}
          </label>
          <input
            id="name"
            className="field"
            value={settings.displayName}
            maxLength={30}
            onChange={(e) => updateSettings({ displayName: e.target.value })}
            placeholder={t.settings.namePh}
            autoComplete="given-name"
          />
        </div>

        <div>
          <p className="label">{t.settings.weeklyGoal}</p>
          <Stepper value={settings.weeklyGoalDays} min={1} max={7} unit={t.settings.days(settings.weeklyGoalDays)} label={t.settings.weeklyGoal} onChange={(v) => updateSettings({ weeklyGoalDays: v })} />
        </div>

        <div>
          <p className="label">{t.settings.cooldown}</p>
          <p className="-mt-1 mb-2 text-sm text-ink-soft">{t.settings.cooldownHelp}</p>
          <Stepper value={settings.cooldownDays} min={0} max={14} unit={t.settings.days(settings.cooldownDays)} label={t.settings.cooldown} onChange={(v) => updateSettings({ cooldownDays: v })} />
        </div>

        <Link to="/installer" className="flex min-h-14 items-center justify-between rounded-2xl border-2 border-line px-4 font-semibold">
          {t.settings.install}
        </Link>

        <div className="rounded-2xl bg-paper-deep p-4 text-sm">
          <p className="font-semibold">{t.settings.whereData}</p>
          <p className="mt-1 text-ink-soft">{t.settings.whereDataText}</p>
        </div>

        <div className="grid">
          <ConfirmButton label={t.settings.reset} confirmLabel={t.settings.confirmReset} onConfirm={resetAll} />
        </div>
      </div>
    </div>
  )
}
