import { Link, useParams } from 'react-router-dom'
import { ConfirmButton, PageHeader, Toggle, WHEEL_META, formatDuration } from '../components/ui'
import { removeDemoMissions, setMissionActive, useData } from '../lib/store'
import type { WheelKind } from '../lib/types'

export default function Missions() {
  const { wheel: w } = useParams()
  const wheel: WheelKind = w === 'hustle' ? 'hustle' : 'envies'
  const data = useData()
  const meta = WHEEL_META[wheel]
  const list = data.missions.filter((m) => m.wheel === wheel)
  const activeCount = list.filter((m) => m.active).length
  const hasDemo = list.some((m) => m.demo)

  return (
    <div>
      <PageHeader title={meta.name} back={`/roues${wheel === 'hustle' ? '?w=hustle' : ''}`} />
      <p className="-mt-2 mb-4 text-sm text-ink-soft">
        {activeCount} active{activeCount > 1 ? 's' : ''} sur {list.length}. Seules les missions actives sortent au tirage.
      </p>

      <Link to={`/roues/${wheel}/missions/nouvelle`} className="btn-primary w-full">
        Ajouter une mission
      </Link>

      <ul className="mt-5 divide-y-2 divide-line border-y-2 border-line">
        {list.map((m) => (
          <li key={m.id} className="flex items-center gap-3 py-3">
            <Link to={`/missions/${m.id}`} className="min-w-0 flex-1">
              <span className={`block font-semibold leading-snug ${m.active ? '' : 'text-ink-soft line-through decoration-1'}`}>
                {m.title}
              </span>
              <span className="mt-0.5 block text-sm text-ink-soft">
                {formatDuration(m.durationMin)}
                {m.demo && (
                  <span className="ml-2 rounded-md px-1.5 py-0.5 text-xs font-semibold" style={{ background: meta.color, color: '#fff' }}>
                    Exemple
                  </span>
                )}
              </span>
            </Link>
            <Toggle checked={m.active} onChange={(v) => setMissionActive(m.id, v)} label={`Activer « ${m.title} »`} />
          </li>
        ))}
        {list.length === 0 && <li className="py-6 text-center text-ink-soft">Aucune mission. Ajoute ta première.</li>}
      </ul>

      {hasDemo && (
        <div className="mt-8 grid">
          <p className="mb-2 text-sm text-ink-soft">
            Les missions marquées « Exemple » sont fournies pour tester. Modifie-les ou retire-les.
          </p>
          <ConfirmButton
            label="Retirer tous les exemples"
            confirmLabel="Confirmer : supprimer les exemples"
            onConfirm={() => removeDemoMissions(wheel)}
          />
        </div>
      )}
    </div>
  )
}
