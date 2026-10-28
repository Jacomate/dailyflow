import { PageHeader } from '../components/ui'

function detect() {
  const ua = navigator.userAgent
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const android = /Android/i.test(ua)
  const standalone =
    window.matchMedia?.('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true
  return { ios, android, standalone }
}

function Steps({ title, steps, highlight }: { title: string; steps: string[]; highlight: boolean }) {
  return (
    <section className={`rounded-3xl border-2 p-5 ${highlight ? 'border-ink bg-white' : 'border-line'}`}>
      <h2 className="text-xl font-bold">
        {title}
        {highlight && <span className="ml-2 align-middle text-sm font-semibold text-ink-soft">ton appareil</span>}
      </h2>
      <ol className="mt-3 grid gap-2">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-paper">{i + 1}</span>
            <span className="pt-0.5">{s}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function Install() {
  const { ios, android, standalone } = detect()
  return (
    <div>
      <PageHeader title="Installer DailyFlow" back="/reglages" />
      {standalone ? (
        <p className="rounded-xl bg-sun px-4 py-3 font-semibold">C’est fait : tu utilises déjà l’appli installée.</p>
      ) : (
        <p className="text-[15px] text-ink-soft">
          DailyFlow s’installe depuis le navigateur, sans passer par l’App Store ni Google Play. L’icône apparaît ensuite sur ton écran d’accueil.
        </p>
      )}
      <div className="mt-5 grid gap-4">
        <Steps
          title="iPhone"
          highlight={ios}
          steps={[
            'Ouvre ce lien dans Safari.',
            'Touche le bouton Partager (le carré avec une flèche vers le haut).',
            'Choisis « Sur l’écran d’accueil ».',
            'Touche « Ajouter ».',
          ]}
        />
        <Steps
          title="Android"
          highlight={android}
          steps={[
            'Ouvre ce lien dans Chrome.',
            'Touche le menu ⋮ en haut à droite.',
            'Choisis « Installer l’application » ou « Ajouter à l’écran d’accueil ».',
            'Confirme.',
          ]}
        />
      </div>
    </div>
  )
}
