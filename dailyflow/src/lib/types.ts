// Modèle de données de DailyFlow.
// Ces types serviront tels quels au sprint 2 pour les tables Supabase.

export type WheelKind = 'envies' | 'hustle'

export type Difficulty = 1 | 2 | 3

/** Un modèle de mission, rangé dans une roue. */
export interface Mission {
  id: string
  wheel: WheelKind
  title: string
  /** Ce qu'on doit produire concrètement. */
  objective: string
  /** Comment savoir que c'est réussi. */
  successCriterion: string
  steps: string[]
  durationMin: number
  difficulty: Difficulty
  active: boolean
  /** Donnée d'exemple fournie par l'appli. */
  demo: boolean
  createdAt: string
}

export type RunStatus = 'drawn' | 'accepted' | 'in_progress' | 'done' | 'skipped'

/** Une mission tirée au sort et son déroulement. */
export interface Run {
  id: string
  missionId: string
  wheel: WheelKind
  /** Copie du titre au moment du tirage, pour l'historique. */
  missionTitle: string
  status: RunStatus
  rerollUsed: boolean
  drawnAt: string
  startedAt?: string
  doneAt?: string
  stepsDone: number[]
  resultNote?: string
  /** Auto-évaluation : 1 brouillon, 2 correct, 3 solide. */
  quality?: Difficulty
  xp?: number
}

export interface Settings {
  displayName: string
  /** Nombre de jours actifs visés par semaine. */
  weeklyGoalDays: number
  /** Ne pas retirer une mission terminée depuis moins de N jours. */
  cooldownDays: number
}

export interface AppData {
  version: 1
  missions: Mission[]
  runs: Run[]
  settings: Settings
}
