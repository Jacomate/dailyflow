import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { WeekStrip } from '../components/WeekStrip'
import { LangSwitch, WHEEL_META, formatDuration, runTitle } from '../components/ui'
import { OPEN, updateSettings, useData } from '../lib/store'
import { computeStats } from '../lib/progress'
import { useT } from '../lib/i18n'
import { missionText } from '../lib/demo'
import type { WheelKind } from '../lib/types'

const TIMES = [15, 30, 60, 120]

export default function Home() {
  const data = useData()
  const t = useT()
  const lang = data.settings.lang
  const navigate = useNavigate()
  const stats = computeStats(data)
  const [time, setTime] = useState(30)
  const open = data.runs.filter((r) => OPEN.includes(r.status) && r.status !== 'drawn')
  const name = data.settings.displayName.trim()
  const h = new Date().getHours()
  const hello = h < 5 || h >= 18 ? t.home.evening : t.home.morning

  function go(w: WheelKind) {
    const q = new URLSearchParams()
    if (w === 'hustle') q.set('w', 'hustle')
    q.set('max', String(time))
    navigate(`/roues?${q}`)
  }

  return (
    <div>
      <div className="flex items-center justify-between pt-4">
        <LangSwitch compact value={lang} onChange={(l) => updateSettings({ lang: l })} />
        <Link to="/reglages" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-line" aria-label={t.home.settings}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
          </svg>
        </Link>
      </div>
      <header className="pb-6 pt-4">
        <h1 className="text-[32px] font-bold leading-[1.05]">
          {hello}
          {name ? `, ${name}` : ''}
        </h1>
        <p className="mt-1 text-ink-soft">{t.home.tagline}</p>
      </header>

      {open.length > 0 ? (
        <section aria-labelledby="today">
          <h2 id="today" className="text-xl font-bold">
            {t.home.current(open.length)}
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
                      {r.status === 'in_progress' ? t.home.inProgress : t.home.todo}
                      {m ? `, ${formatDuration(m.durationMin)}` : ''}
                    </span>
                    <span className="mt-1 block text-xl font-bold leading-snug">{runTitle(r, data, lang)}</span>
                    {m && <span className="mt-2 block text-[15px] text-ink-soft">{missionText(m, lang).objective}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ) : (
        <section aria-labelledby="today" className="rounded-3xl border-[3px] border-ink bg-white p-5">
          <h2 id="today" className="text-xl font-bold">
            {t.home.todayTitle}
          </h2>
          <p className="mt-1 text-[15px] text-ink-soft">{t.home.timeQuestion}</p>
          <div className="mt-3 grid grid-cols-4 gap-2" role="group" aria-label={t.home.timeAvailable}>
            {TIMES.map((m) => (
              <button key={m} className="chip justify-center px-2" aria-pressed={time === m} onClick={() => setTime(m)}>
                {formatDuration(m)}
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {(['envies', 'hustle'] as WheelKind[]).map((w) => (
              <button key={w} className="btn min-h-14 px-3 text-white" style={{ background: WHEEL_META[w].color }} onClick={() => go(w)}>
                {t.wheels[w].short}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8" aria-labelledby="week">
        <div className="flex items-baseline justify-between">
          <h2 id="week" className="text-xl font-bold">
            {t.home.thisWeek}
          </h2>
          <Link to="/progression" className="text-sm font-semibold underline decoration-2 underline-offset-4">
            {t.home.progress}
          </Link>
        </div>
        <div className="mt-3">
          <WeekStrip stats={stats} goal={data.settings.weeklyGoalDays} />
        </div>
        <p className="mt-4 text-[15px]">
          <span className="font-display text-2xl font-bold">{stats.totalXp}</span> {t.home.summary(stats.level, stats.doneCount)}
        </p>
      </section>

      <section className="mt-8 grid gap-2" aria-label={t.home.shortcuts}>
        <Link to="/apprendre" className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border-2 border-line px-4 font-semibold">
          {t.home.toTutorial}
          <span className="shrink-0 text-sm font-normal text-ink-soft">{t.home.soon}</span>
        </Link>
        <Link to="/lab" className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border-2 border-line px-4 font-semibold">
          {t.home.exploreIdea}
          <span className="shrink-0 text-sm font-normal text-ink-soft">{t.home.soon}</span>
        </Link>
      </section>
    </div>
  )
}
