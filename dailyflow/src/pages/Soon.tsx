import { Link } from 'react-router-dom'
import { useT } from '../lib/i18n'

interface Props {
  title: string
  intro: string
  steps: string[]
  sprint: number
}

function Soon({ title, intro, steps, sprint }: Props) {
  const t = useT()
  return (
    <div>
      <header className="pb-4 pt-4">
        <h1 className="text-[28px] font-bold leading-none">{title}</h1>
      </header>
      <p className="rounded-xl bg-sun px-4 py-3 text-sm font-semibold">{t.soon.notYet(sprint)}</p>
      <p className="mt-5 text-[15px] leading-relaxed">{intro}</p>
      <h2 className="mt-6 text-lg font-bold">{t.soon.how}</h2>
      <ol className="mt-2 grid gap-2">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 rounded-xl border-2 border-line bg-white px-4 py-3">
            <span className="font-display font-bold text-ink-soft">{i + 1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <Link to="/roues" className="btn-primary mt-6 w-full">
        {t.soon.meanwhile}
      </Link>
    </div>
  )
}

export function Learn() {
  const t = useT()
  return <Soon sprint={3} {...t.soon.learn} />
}

export function Lab() {
  const t = useT()
  return <Soon sprint={4} {...t.soon.lab} />
}
