import type { Stats } from '../lib/progress'

export function WeekStrip({ stats, goal }: { stats: Stats; goal: number }) {
  return (
    <div>
      <ol className="grid grid-cols-7 gap-1.5" aria-label="Jours actifs cette semaine">
        {stats.week.map((d) => (
          <li key={d.key} className="flex flex-col items-center gap-1">
            <span
              className={`grid h-9 w-full place-items-center rounded-lg border-2 text-sm font-bold ${
                d.active ? 'border-ink bg-sun text-ink' : d.isToday ? 'border-ink bg-white text-ink' : 'border-line text-ink-soft'
              } ${d.isFuture ? 'opacity-50' : ''}`}
              aria-label={`${d.label}${d.isToday ? ", aujourd'hui" : ''} : ${d.active ? 'actif' : 'pas encore actif'}`}
            >
              {d.active ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              ) : (
                d.label
              )}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-sm text-ink-soft">
        {stats.weekActiveCount >= goal
          ? `Objectif de la semaine atteint : ${stats.weekActiveCount} jours actifs.`
          : `${stats.weekActiveCount} jour${stats.weekActiveCount > 1 ? 's' : ''} actif${stats.weekActiveCount > 1 ? 's' : ''} sur ${goal} visés cette semaine.`}
      </p>
    </div>
  )
}
