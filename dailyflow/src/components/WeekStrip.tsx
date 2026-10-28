import type { Stats } from '../lib/progress'
import { useT } from '../lib/i18n'

export function WeekStrip({ stats, goal }: { stats: Stats; goal: number }) {
  const t = useT()
  return (
    <div>
      <ol className="grid grid-cols-7 gap-1.5" aria-label={t.week.aria}>
        {stats.week.map((d, i) => (
          <li key={d.key} className="flex flex-col items-center gap-1">
            <span
              className={`grid h-9 w-full place-items-center rounded-lg border-2 text-sm font-bold ${
                d.active ? 'border-ink bg-sun text-ink' : d.isToday ? 'border-ink bg-white text-ink' : 'border-line text-ink-soft'
              } ${d.isFuture ? 'opacity-50' : ''}`}
              aria-label={`${t.week.dayNames[i]}${d.isToday ? `, ${t.week.today}` : ''} : ${d.active ? t.week.active : t.week.notActive}`}
            >
              {d.active ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              ) : (
                t.week.days[i]
              )}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-sm text-ink-soft">
        {stats.weekActiveCount >= goal ? t.week.reached(stats.weekActiveCount) : t.week.progress(stats.weekActiveCount, goal)}
      </p>
    </div>
  )
}
