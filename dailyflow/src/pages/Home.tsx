import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { WeekStrip } from '../components/WeekStrip'
import { WHEEL_META, formatDuration } from '../components/ui'
import { OPEN, useData } from '../lib/store'
import { computeStats } from '../lib/progress'
import type { WheelKind } from '../lib/types'

function greeting(d = new Date()) {
  const h = d.getHours()
  return h < 5 || h >= 18 ? 'Bonsoir' : 'Bonjour'
}

const TIMES = [15, 30, 60, 120]

export default function Home() {
  const data = useData()
  const navigate = useNavigate()
  const stats = computeStats(data)
  const [time, setTime] = useState(30)
  const open = data.runs.filter((r) => OPEN.includes(r.status) && r.status !== 'drawn')
  const name = data.settings.displayName.trim()

  function go(w: WheelKind) {
    const q = new URLSearchParams()
    if (w === 'hustle') q.set('w', 'hustle')
    q.set('max', String(time))
    navigate(`/roues?${q}`)
  }

  return (
    <div>
      <header className="flex items-start justify-between pb-6 pt-5">
        <div>
          <h1 className="text-[32px] font-bold leading-[1.05]">
            {greeting()}
            {name ? `, ${name}` : ''}
          </h1>
          <p className="mt-1 text-ink-soft">Une mission concrète, et c’est une bonne journée.</p>
        </div>
        <Link to="/reglages" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-line" aria-label="Réglages">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
          </svg>
        </Link>
      </header>

      {open.length > 0 ? (
        <section aria-labelledby="today">
          <h2 id="today" className="text-xl font-bold">
            {open.length > 1 ? 'Tes missions en cours' : 'Ta mission en cours'}
          </h2>
          <ul className="mt-3 grid gap-3">
            {open.map((r) => {
              const meta = WHEEL_META[r.wheel]
              const m = data.missions.find((x) => x.id === r.missionId)
              return (
                <li key={r.id}>
                  <Link
                    to={`/mission/${r.id}`}
                    className="block rounded-3xl border-[3px] border-ink bg-white p-5"
                    style={{ boxShadow: `6px 6px 0 ${meta.color}` }}
                  >
                    <span className="text-sm font-semibold" style={{ color: meta.deep }}>
                      {r.status === 'in_progress' ? 'En cours' : 'À faire'}
                      {m ? `, ${formatDuration(m.durationMin)}` : ''}
                    </span>
                    <span className="mt-1 block text-xl font-bold leading-snug">{r.missionTitle}</span>
                    {m && <span className="mt-2 block text-[15px] text-ink-soft">{m.objective}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ) : (
        <section aria-labelledby="today" className="rounded-3xl border-[3px] border-ink bg-white p-5">
          <h2 id="today" className="text-xl font-bold">
            Ta mission du jour
          </h2>
          <p className="mt-1 text-[15px] text-ink-soft">Combien de temps as-tu devant toi ?</p>
          <div className="mt-3 grid grid-cols-4 gap-2" role="group" aria-label="Temps disponible">
            {TIMES.map((t) => (
              <button key={t} className="chip justify-center px-2" aria-pressed={time === t} onClick={() => setTime(t)}>
                {formatDuration(t)}
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {(['envies', 'hustle'] as WheelKind[]).map((w) => (
              <button
                key={w}
                className="btn min-h-14 text-white"
                style={{ background: WHEEL_META[w].color }}
                onClick={() => go(w)}
              >
                {WHEEL_META[w].short}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8" aria-labelledby="week">
        <div className="flex items-baseline justify-between">
          <h2 id="week" className="text-xl font-bold">
            Cette semaine
          </h2>
          <Link to="/progression" className="text-sm font-semibold underline decoration-2 underline-offset-4">
            Progression
          </Link>
        </div>
        <div className="mt-3">
          <WeekStrip stats={stats} goal={data.settings.weeklyGoalDays} />
        </div>
        <p className="mt-4 text-[15px]">
          <span className="font-display text-2xl font-bold">{stats.totalXp}</span> points, niveau {stats.level}, {stats.doneCount} mission
          {stats.doneCount > 1 ? 's' : ''} terminée{stats.doneCount > 1 ? 's' : ''}
        </p>
      </section>

      <section className="mt-8 grid gap-2" aria-label="Raccourcis">
        <Link to="/apprendre" className="flex min-h-14 items-center justify-between rounded-2xl border-2 border-line px-4 font-semibold">
          Transformer une vidéo en tutoriel
          <span className="text-sm font-normal text-ink-soft">Bientôt</span>
        </Link>
        <Link to="/lab" className="flex min-h-14 items-center justify-between rounded-2xl border-2 border-line px-4 font-semibold">
          Explorer une idée de side hustle
          <span className="text-sm font-normal text-ink-soft">Bientôt</span>
        </Link>
      </section>
    </div>
  )
}
