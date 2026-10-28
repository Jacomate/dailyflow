import { useEffect, useRef, useState } from 'react'
import { randomUnit } from '../lib/random'

export interface WheelSegment {
  id: string
  label: string
}

interface Props {
  segments: WheelSegment[]
  /** Teintes alternées des parts. */
  palette: string[]
  /** Quand cette valeur change, la roue tourne jusqu'à la part `targetId`. */
  spinKey: number
  targetId?: string
  onSpinEnd?: () => void
}

const SIZE = 320
const R = SIZE / 2

function polar(angleDeg: number, radius: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return [R + radius * Math.cos(a), R + radius * Math.sin(a)]
}

function slicePath(start: number, end: number) {
  const [x1, y1] = polar(start, R - 4)
  const [x2, y2] = polar(end, R - 4)
  const large = end - start > 180 ? 1 : 0
  return `M ${R} ${R} L ${x1} ${y1} A ${R - 4} ${R - 4} 0 ${large} 1 ${x2} ${y2} Z`
}

function shorten(s: string, max: number) {
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

/**
 * Roue SVG. Le résultat est déjà choisi (aléatoirement) avant l'animation :
 * l'animation ne fait que montrer ce résultat.
 */
export function Wheel({ segments, palette, spinKey, targetId, onSpinEnd }: Props) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const rotationRef = useRef(0)
  const endRef = useRef(onSpinEnd)
  endRef.current = onSpinEnd

  const n = Math.max(segments.length, 1)
  const seg = 360 / n

  useEffect(() => {
    if (!spinKey || !targetId) return
    const index = segments.findIndex((s) => s.id === targetId)
    if (index < 0) return
    const center = index * seg + seg / 2
    const jitter = (randomUnit() - 0.5) * seg * 0.6
    const wanted = (((-center - jitter) % 360) + 360) % 360
    const current = ((rotationRef.current % 360) + 360) % 360
    const delta = (wanted - current + 360) % 360
    const reduced = prefersReducedMotion()
    const next = rotationRef.current + delta + (reduced ? 0 : 360 * 5)
    rotationRef.current = next
    setSpinning(true)
    setRotation(next)
    const t = window.setTimeout(
      () => {
        setSpinning(false)
        endRef.current?.()
      },
      reduced ? 50 : 4200,
    )
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinKey])

  const maxChars = n <= 6 ? 20 : n <= 9 ? 17 : 14
  const fontSize = n <= 6 ? 13 : n <= 9 ? 12 : 11

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px]" aria-hidden="true">
      {/* Pointeur */}
      <svg viewBox="0 0 40 44" className="absolute left-1/2 top-[-10px] z-10 h-11 w-10 -translate-x-1/2 drop-shadow-[0_2px_0_var(--color-ink)]">
        <path d="M20 42 L4 8 Q20 -4 36 8 Z" fill="var(--color-sun)" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-full w-full"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? (prefersReducedMotion() ? 'none' : 'transform 4.2s cubic-bezier(0.12, 0.7, 0.08, 1)') : 'none',
        }}
      >
        <circle cx={R} cy={R} r={R - 1} fill="var(--color-ink)" />
        {segments.length === 0 ? (
          <circle cx={R} cy={R} r={R - 4} fill={palette[0]} opacity={0.35} />
        ) : (
          segments.map((s, i) => {
            const start = i * seg
            const mid = start + seg / 2
            const [tx, ty] = polar(mid, R * 0.56)
            const fill = palette[i % palette.length]
            const flip = mid > 180
            return (
              <g key={s.id}>
                {n === 1 ? (
                  <circle cx={R} cy={R} r={R - 4} fill={fill} />
                ) : (
                  <path d={slicePath(start, start + seg)} fill={fill} stroke="var(--color-ink)" strokeWidth={2} />
                )}
                <text
                  x={tx}
                  y={ty}
                  fill="#fff"
                  fontSize={fontSize}
                  fontWeight={600}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${mid + (flip ? 90 : -90)} ${tx} ${ty})`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {shorten(s.label, maxChars)}
                </text>
              </g>
            )
          })
        )}
        <circle cx={R} cy={R} r={26} fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth={3} />
        <circle cx={R} cy={R} r={8} fill="var(--color-ink)" />
      </svg>
    </div>
  )
}
