import { PageHeader } from '../components/ui'
import { useT } from '../lib/i18n'

function detect() {
  const ua = navigator.userAgent
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const android = /Android/i.test(ua)
  const standalone =
    window.matchMedia?.('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true
  return { ios, android, standalone }
}

function Steps({ title, steps, highlight }: { title: string; steps: string[]; highlight: boolean }) {
  const t = useT()
  return (
    <section className={`rounded-3xl border-2 p-5 ${highlight ? 'border-ink bg-white' : 'border-line'}`}>
      <h2 className="text-xl font-bold">
        {title}
        {highlight && <span className="ml-2 align-middle text-sm font-semibold text-ink-soft">{t.install.yourDevice}</span>}
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
  const t = useT()
  return (
    <div>
      <PageHeader title={t.install.title} back="/reglages" />
      {standalone ? (
        <p className="rounded-xl bg-sun px-4 py-3 font-semibold">{t.install.already}</p>
      ) : (
        <p className="text-[15px] text-ink-soft">{t.install.intro}</p>
      )}
      <div className="mt-5 grid gap-4">
        <Steps
          title="iPhone"
          highlight={ios}
          steps={t.install.ios}
        />
        <Steps
          title="Android"
          highlight={android}
          steps={t.install.android}
        />
      </div>
    </div>
  )
}
