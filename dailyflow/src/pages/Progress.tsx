import { Link } from 'react-router-dom'
import { WeekStrip } from '../components/WeekStrip'
import { PageHeader, QUALITY_LABEL, WHEEL_META } from '../components/ui'
import { useData } from '../lib/store'
import { XP_PER_LEVEL, computeStats } from '../lib/progress'

const dateFmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })

export default function Progress() {
  const data = useData()
  const stats = computeStats(data)
  const history = data.runs
    .filter((r) => r.status === 'done' || r.status === 'skipped')
    .sort((a, b) => Date.parse(b.doneAt ?? b.drawnAt) - Date.parse(a.doneAt ?? a.drawnAt))
    .slice(0, 50)

  return (
    <div>
      <PageHeader title="Progression" back="/" />

      <section className="rounded-3xl border-[3px] border-ink bg-white p-5">
        <div className="flex items-end justify-between">
          <p className="font-display text-5xl font-bold leading-none">{stats.totalXp}</p>
          <p className="font-semibold">Niveau {stats.level}</p>
        </div>
        <p className="mt-1 text-ink-soft">points</p>
        <div
          className="mt-4 h-3 overflow-hidden rounded-full bg-paper-deep"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={XP_PER_LEVEL}
          aria-valuenow={stats.totalXp % XP_PER_LEVEL}
          aria-label="Progression vers le niveau suivant"
        >
          <div className="h-full rounded-full bg-ink" style={{ width: `${stats.levelProgress * 100}%` }} />
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          {XP_PER_LEVEL - (stats.totalXp % XP_PER_LEVEL)} points avant le niveau {stats.level + 1}
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-4 border-t-2 border-line pt-4">
          <div>
            <dt className="text-sm text-ink-soft">Missions terminées</dt>
            <dd className="font-display text-2xl font-bold">{stats.doneCount}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-soft">Semaines objectif atteint</dt>
            <dd className="font-display text-2xl font-bold">{stats.weeksGoalMet}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold">Cette semaine</h2>
        <div className="mt-3">
          <WeekStrip stats={stats} goal={data.settings.weeklyGoalDays} />
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          Un jour sans mission ne te fait rien perdre. Seul compte le nombre de jours actifs dans la semaine.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold">Historique</h2>
        {history.length === 0 ? (
          <div className="mt-3 rounded-2xl border-2 border-dashed border-line p-5 text-center">
            <p className="text-ink-soft">Ta première mission terminée apparaîtra ici.</p>
            <Link to="/roues" className="btn-primary mt-4">
              Lancer une roue
            </Link>
          </div>
        ) : (
          <ul className="mt-3 divide-y-2 divide-line border-y-2 border-line">
            {history.map((r) => (
              <li key={r.id}>
                <Link to={`/mission/${r.id}`} className="flex items-start gap-3 py-3">
                  <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full" style={{ background: WHEEL_META[r.wheel].color }} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold leading-snug">{r.missionTitle}</span>
                    <span className="block text-sm text-ink-soft">
                      {dateFmt.format(new Date(r.doneAt ?? r.drawnAt))}
                      {r.status === 'skipped' ? ', mise de côté' : r.quality ? `, ${QUALITY_LABEL[r.quality].toLowerCase()}` : ''}
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
