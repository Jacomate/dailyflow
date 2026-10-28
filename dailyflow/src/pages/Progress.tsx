import { Link } from 'react-router-dom'
import { WeekStrip } from '../components/WeekStrip'
import { PageHeader, WHEEL_META, runTitle } from '../components/ui'
import { useT } from '../lib/i18n'
import { useData } from '../lib/store'
import { XP_PER_LEVEL, computeStats } from '../lib/progress'

export default function Progress() {
  const data = useData()
  const t = useT()
  const lang = data.settings.lang
  const dateFmt = new Intl.DateTimeFormat(t.locale, { weekday: 'short', day: 'numeric', month: 'short' })
  const stats = computeStats(data)
  const history = data.runs
    .filter((r) => r.status === 'done' || r.status === 'skipped')
    .sort((a, b) => Date.parse(b.doneAt ?? b.drawnAt) - Date.parse(a.doneAt ?? a.drawnAt))
    .slice(0, 50)

  return (
    <div>
      <PageHeader title={t.progress.title} back="/" />

      <section className="rounded-3xl border-[3px] border-ink bg-white p-5">
        <div className="flex items-end justify-between">
          <p className="font-display text-5xl font-bold leading-none">{stats.totalXp}</p>
          <p className="font-semibold">{t.progress.level(stats.level)}</p>
        </div>
        <p className="mt-1 text-ink-soft">{t.progress.points}</p>
        <div
          className="mt-4 h-3 overflow-hidden rounded-full bg-paper-deep"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={XP_PER_LEVEL}
          aria-valuenow={stats.totalXp % XP_PER_LEVEL}
          aria-label={t.progress.toNext}
        >
          <div className="h-full rounded-full bg-ink" style={{ width: `${stats.levelProgress * 100}%` }} />
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          {t.progress.before(XP_PER_LEVEL - (stats.totalXp % XP_PER_LEVEL), stats.level + 1)}
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-4 border-t-2 border-line pt-4">
          <div>
            <dt className="text-sm text-ink-soft">{t.progress.done}</dt>
            <dd className="font-display text-2xl font-bold">{stats.doneCount}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-soft">{t.progress.weeksMet}</dt>
            <dd className="font-display text-2xl font-bold">{stats.weeksGoalMet}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold">{t.home.thisWeek}</h2>
        <div className="mt-3">
          <WeekStrip stats={stats} goal={data.settings.weeklyGoalDays} />
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          {t.progress.noPenalty}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold">{t.progress.history}</h2>
        {history.length === 0 ? (
          <div className="mt-3 rounded-2xl border-2 border-dashed border-line p-5 text-center">
            <p className="text-ink-soft">{t.progress.empty}</p>
            <Link to="/roues" className="btn-primary mt-4">
              {t.progress.launch}
            </Link>
          </div>
        ) : (
          <ul className="mt-3 divide-y-2 divide-line border-y-2 border-line">
            {history.map((r) => (
              <li key={r.id}>
                <Link to={`/mission/${r.id}`} className="flex items-start gap-3 py-3">
                  <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full" style={{ background: WHEEL_META[r.wheel].color }} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold leading-snug">{runTitle(r, data, lang)}</span>
                    <span className="block text-sm text-ink-soft">
                      {dateFmt.format(new Date(r.doneAt ?? r.drawnAt))}
                      {r.status === 'skipped' ? `, ${t.progress.skipped}` : r.quality ? `, ${t.common.quality[r.quality].toLowerCase()}` : ''}
                    </span>
                    {r.resultNote && <span className="mt-1 block line-clamp-2 text-sm">{r.resultNote}</span>}
                  </span>
                  {r.status === 'done' && <span className="shrink-0 font-display font-bold">+{r.xp}</span>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
