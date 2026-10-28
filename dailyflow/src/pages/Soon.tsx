import { Link } from 'react-router-dom'

interface Props {
  title: string
  intro: string
  steps: string[]
  sprint: string
}

function Soon({ title, intro, steps, sprint }: Props) {
  return (
    <div>
      <header className="pb-4 pt-4">
        <h1 className="text-[28px] font-bold leading-none">{title}</h1>
      </header>
      <p className="rounded-xl bg-sun px-4 py-3 text-sm font-semibold">Pas encore disponible : ce module arrive au {sprint}.</p>
      <p className="mt-5 text-[15px] leading-relaxed">{intro}</p>
      <h2 className="mt-6 text-lg font-bold">Comment ça marchera</h2>
      <ol className="mt-2 grid gap-2">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 rounded-xl border-2 border-line bg-white px-4 py-3">
            <span className="font-display font-bold text-ink-soft">{i + 1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <Link to="/roues" className="btn-primary mt-6 w-full">
        En attendant, lancer une roue
      </Link>
    </div>
  )
}

export function Learn() {
  return (
    <Soon
      title="Apprendre"
      sprint="sprint 3"
      intro="Colle une vidéo, un article ou un texte. DailyFlow prépare la demande pour Claude, tu la lances avec ton abonnement, puis tu récupères un tutoriel avec des étapes à cocher."
      steps={[
        'Ajouter une ressource : lien YouTube, article ou texte collé.',
        'Copier la demande préparée et ouvrir Claude.',
        'Coller la réponse de Claude dans DailyFlow.',
        'Suivre le tutoriel étape par étape, et en faire une mission.',
      ]}
    />
  )
}

export function Lab() {
  return (
    <Soon
      title="Side Hustle Lab"
      sprint="sprint 4"
      intro="Des fiches d’opportunités avec coûts, risques et sources datées. Claude t’aide à trouver des idées, à les analyser et à prévoir le test le plus simple avant de construire."
      steps={[
        'Trouver des idées adaptées à ton budget et ton temps.',
        'Analyser une idée : coûts, risques, concurrence, sources.',
        'Préparer un plan de test minimal.',
        'Transformer le test en missions dans la roue Side hustles.',
      ]}
    />
  )
}
