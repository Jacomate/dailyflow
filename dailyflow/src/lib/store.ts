import { useSyncExternalStore } from 'react'
import type { AppData, Difficulty, Mission, Run, Settings, WheelKind } from './types'
import { demoMissions } from './demo'
import { randomInt, uid } from './random'
import { xpFor } from './progress'

// Stockage local pour le sprint 1. Au sprint 2, ce module sera branché sur Supabase
// sans changer les écrans : ils n'utilisent que les fonctions exportées ici.

const KEY = 'dailyflow:v1'

const defaultSettings: Settings = {
  displayName: '',
  weeklyGoalDays: 4,
  cooldownDays: 2,
}

function fresh(): AppData {
  return { version: 1, missions: demoMissions(), runs: [], settings: { ...defaultSettings } }
}

let storageOk = true

function load(): AppData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return fresh()
    const parsed = JSON.parse(raw) as AppData
    if (parsed?.version !== 1 || !Array.isArray(parsed.missions)) return fresh()
    return { ...parsed, settings: { ...defaultSettings, ...parsed.settings } }
  } catch {
    storageOk = false
    return fresh()
  }
}

let state: AppData = load()
const listeners = new Set<() => void>()

function commit(next: AppData) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
    storageOk = true
  } catch {
    storageOk = false
  }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useData(): AppData {
  return useSyncExternalStore(subscribe, () => state)
}

export function isStoragePersistent() {
  return storageOk
}

// ---------- Missions ----------

export type MissionInput = Omit<Mission, 'id' | 'createdAt' | 'demo' | 'active'> & { active?: boolean }

export function validateMission(m: Partial<MissionInput>): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!m.title?.trim()) errors.title = 'Donne un titre à la mission.'
  else if (m.title.trim().length > 80) errors.title = '80 caractères maximum.'
  if (!m.objective?.trim()) errors.objective = 'Décris ce que tu vas produire.'
  if (!m.successCriterion?.trim()) errors.successCriterion = 'Précise comment savoir que c’est réussi.'
  if (!m.durationMin || m.durationMin < 5 || m.durationMin > 480) errors.durationMin = 'Entre 5 et 480 minutes.'
  return errors
}

export function saveMission(input: MissionInput, id?: string): string {
  const clean = {
    ...input,
    title: input.title.trim(),
    objective: input.objective.trim(),
    successCriterion: input.successCriterion.trim(),
    steps: input.steps.map((s) => s.trim()).filter(Boolean),
  }
  if (id) {
    commit({
      ...state,
      missions: state.missions.map((m) => (m.id === id ? { ...m, ...clean, demo: false } : m)),
    })
    return id
  }
  const mission: Mission = {
    ...clean,
    id: uid(),
    active: input.active ?? true,
    demo: false,
    createdAt: new Date().toISOString(),
  }
  commit({ ...state, missions: [...state.missions, mission] })
  return mission.id
}

export function setMissionActive(id: string, active: boolean) {
  commit({ ...state, missions: state.missions.map((m) => (m.id === id ? { ...m, active } : m)) })
}

export function deleteMission(id: string) {
  commit({ ...state, missions: state.missions.filter((m) => m.id !== id) })
}

export function removeDemoMissions(wheel: WheelKind) {
  commit({ ...state, missions: state.missions.filter((m) => !(m.demo && m.wheel === wheel)) })
}

// ---------- Tirage ----------

export const OPEN: Run['status'][] = ['drawn', 'accepted', 'in_progress']

export function openRun(data: AppData, wheel: WheelKind): Run | undefined {
  return data.runs.find((r) => r.wheel === wheel && OPEN.includes(r.status))
}

/** Missions qui peuvent sortir au tirage. */
export function eligibleMissions(data: AppData, wheel: WheelKind, maxDuration?: number): Mission[] {
  const base = data.missions.filter(
    (m) => m.wheel === wheel && m.active && (!maxDuration || m.durationMin <= maxDuration),
  )
  const cutoff = Date.now() - data.settings.cooldownDays * 86_400_000
  const recent = new Set(
    data.runs
      .filter((r) => r.status === 'done' && r.doneAt && Date.parse(r.doneAt) > cutoff)
      .map((r) => r.missionId),
  )
  const rested = base.filter((m) => !recent.has(m.id))
  // Si tout a été fait récemment, on ne bloque pas l'utilisateur.
  return rested.length > 0 ? rested : base
}

export type DrawResult = { ok: true; run: Run } | { ok: false; reason: string }

export function draw(wheel: WheelKind, maxDuration?: number): DrawResult {
  if (openRun(state, wheel)) return { ok: false, reason: 'Termine ou abandonne la mission en cours avant de relancer.' }
  const pool = eligibleMissions(state, wheel, maxDuration)
  if (pool.length === 0) {
    return {
      ok: false,
      reason: maxDuration
        ? `Aucune mission active de ${maxDuration} min ou moins dans cette roue.`
        : 'Aucune mission active dans cette roue. Ajoutes-en une.',
    }
  }
  const mission = pool[randomInt(pool.length)]
  const run: Run = {
    id: uid(),
    missionId: mission.id,
    wheel,
    missionTitle: mission.title,
    status: 'drawn',
    rerollUsed: false,
    drawnAt: new Date().toISOString(),
    stepsDone: [],
  }
  commit({ ...state, runs: [run, ...state.runs] })
  return { ok: true, run }
}

/** Une seule relance par tirage, pour éviter l'effet machine à sous. */
export function reroll(runId: string, maxDuration?: number): DrawResult {
  const run = state.runs.find((r) => r.id === runId)
  if (!run || run.status !== 'drawn') return { ok: false, reason: 'Ce tirage ne peut plus être relancé.' }
  if (run.rerollUsed) return { ok: false, reason: 'Tu as déjà utilisé ta relance.' }
  const pool = eligibleMissions(state, run.wheel, maxDuration).filter((m) => m.id !== run.missionId)
  if (pool.length === 0) return { ok: false, reason: 'Aucune autre mission disponible pour une relance.' }
  const mission = pool[randomInt(pool.length)]
  const next: Run = { ...run, missionId: mission.id, missionTitle: mission.title, rerollUsed: true, drawnAt: new Date().toISOString() }
  commit({ ...state, runs: state.runs.map((r) => (r.id === runId ? next : r)) })
  return { ok: true, run: next }
}

function patchRun(runId: string, patch: Partial<Run>) {
  commit({ ...state, runs: state.runs.map((r) => (r.id === runId ? { ...r, ...patch } : r)) })
}

export function acceptRun(runId: string) {
  patchRun(runId, { status: 'accepted' })
}

export function startRun(runId: string) {
  patchRun(runId, { status: 'in_progress', startedAt: new Date().toISOString() })
}

export function toggleStep(runId: string, index: number) {
  const run = state.runs.find((r) => r.id === runId)
  if (!run) return
  const has = run.stepsDone.includes(index)
  patchRun(runId, { stepsDone: has ? run.stepsDone.filter((i) => i !== index) : [...run.stepsDone, index] })
}

export function completeRun(runId: string, resultNote: string, quality: Difficulty) {
  const run = state.runs.find((r) => r.id === runId)
  const mission = state.missions.find((m) => m.id === run?.missionId)
  if (!run) return
  const note = resultNote.trim()
  patchRun(runId, {
    status: 'done',
    doneAt: new Date().toISOString(),
    resultNote: note || undefined,
    quality,
    xp: xpFor(mission?.durationMin ?? 30, quality, note.length > 0),
  })
}

export function skipRun(runId: string) {
  patchRun(runId, { status: 'skipped' })
}

// ---------- Réglages ----------

export function updateSettings(patch: Partial<Settings>) {
  commit({ ...state, settings: { ...state.settings, ...patch } })
}

export function resetAll() {
  commit(fresh())
}
