import type { AppData, Difficulty, Run } from './types'

/**
 * Points d'expérience d'une mission terminée.
 * La durée donne la base ; la qualité et le fait d'avoir noté le résultat comptent aussi,
 * pour ne pas récompenser seulement la quantité.
 */
export function xpFor(durationMin: number, quality: Difficulty, hasNote: boolean): number {
  const base = durationMin <= 15 ? 10 : durationMin <= 30 ? 20 : durationMin <= 60 ? 35 : 60
  const qualityBonus = quality === 3 ? 10 : quality === 2 ? 5 : 0
  return base + qualityBonus + (hasNote ? 5 : 0)
}

export const XP_PER_LEVEL = 150

/** Date locale au format AAAA-MM-JJ. */
export function dayKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Lundi de la semaine de la date donnée, à minuit local. */
export function weekStart(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const shift = (x.getDay() + 6) % 7
  x.setDate(x.getDate() - shift)
  return x
}

export interface Stats {
  totalXp: number
  level: number
  levelProgress: number
  doneCount: number
  activeDays: Set<string>
  week: { key: string; label: string; active: boolean; isToday: boolean; isFuture: boolean }[]
  weekActiveCount: number
  weeksGoalMet: number
  done: Run[]
}

const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export function computeStats(data: AppData, now = new Date()): Stats {
  const done = data.runs
    .filter((r) => r.status === 'done' && r.doneAt)
    .sort((a, b) => Date.parse(b.doneAt!) - Date.parse(a.doneAt!))
  const totalXp = done.reduce((s, r) => s + (r.xp ?? 0), 0)
  const activeDays = new Set(done.map((r) => dayKey(new Date(r.doneAt!))))

  const start = weekStart(now)
  const todayKey = dayKey(now)
  const week = DAY_LABELS.map((label, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const key = dayKey(d)
    return { key, label, active: activeDays.has(key), isToday: key === todayKey, isFuture: key > todayKey }
  })

  // Semaines où l'objectif de jours actifs a été atteint (semaine en cours comprise si atteint).
  const perWeek = new Map<string, number>()
  activeDays.forEach((k) => {
    const [y, m, d] = k.split('-').map(Number)
    const wk = dayKey(weekStart(new Date(y, m - 1, d)))
    perWeek.set(wk, (perWeek.get(wk) ?? 0) + 1)
  })
  let weeksGoalMet = 0
  perWeek.forEach((n) => {
    if (n >= data.settings.weeklyGoalDays) weeksGoalMet++
  })

  return {
    totalXp,
    level: Math.floor(totalXp / XP_PER_LEVEL) + 1,
    levelProgress: (totalXp % XP_PER_LEVEL) / XP_PER_LEVEL,
    doneCount: done.length,
    activeDays,
    week,
    weekActiveCount: week.filter((d) => d.active).length,
    weeksGoalMet,
    done,
  }
}
