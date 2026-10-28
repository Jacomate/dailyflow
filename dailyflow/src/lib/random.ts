/** Entier aléatoire uniforme dans [0, max), via le générateur cryptographique du navigateur. */
export function randomInt(max: number): number {
  if (max <= 0) throw new Error('randomInt: max doit être positif')
  const limit = Math.floor(0x100000000 / max) * max
  const buf = new Uint32Array(1)
  // Rejet pour éviter le biais du modulo.
  do {
    crypto.getRandomValues(buf)
  } while (buf[0] >= limit)
  return buf[0] % max
}

/** Nombre aléatoire dans [0, 1). */
export function randomUnit(): number {
  return randomInt(1_000_000) / 1_000_000
}

export function uid(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `${Date.now().toString(36)}-${randomInt(1e9).toString(36)}`
}
