// Génère les icônes PNG de l'appli à partir d'un SVG (via le Chromium préinstallé).
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')
import { writeFileSync } from 'node:fs'

function svg({ pad = 0, bg = '#1E1B3A' } = {}) {
  const s = 512, c = s / 2, r = 170 - pad
  const colors = ['#E0457B', '#14906F', '#A82D5A', '#0E6E55', '#C93A6C', '#1A7F64']
  const n = 6
  let slices = ''
  for (let i = 0; i < n; i++) {
    const a0 = (i * 360 / n - 90) * Math.PI / 180, a1 = ((i + 1) * 360 / n - 90) * Math.PI / 180
    slices += `<path d="M${c} ${c+18} L${c + r*Math.cos(a0)} ${c+18 + r*Math.sin(a0)} A${r} ${r} 0 0 1 ${c + r*Math.cos(a1)} ${c+18 + r*Math.sin(a1)} Z" fill="${colors[i]}" stroke="#1E1B3A" stroke-width="10" stroke-linejoin="round"/>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" width="${s}" height="${s}">
  <rect width="${s}" height="${s}" fill="${bg}"/>
  <circle cx="${c}" cy="${c+18}" r="${r+10}" fill="#F2F0F9"/>
  ${slices}
  <circle cx="${c}" cy="${c+18}" r="34" fill="#F2F0F9" stroke="#1E1B3A" stroke-width="10"/>
  <path d="M${c} ${c-r+50} L${c-38} ${c-r-34} Q${c} ${c-r-62} ${c+38} ${c-r-34} Z" fill="#FFC83D" stroke="#F2F0F9" stroke-width="12" stroke-linejoin="round"/>
</svg>`
}

const browser = await chromium.launch()
const page = await browser.newPage()
async function png(markup, size, file) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(`<html><body style="margin:0">${markup.replace('width="512" height="512"', `width="${size}" height="${size}"`)}</body></html>`)
  writeFileSync(file, await page.screenshot({ clip: { x: 0, y: 0, width: size, height: size } }))
}
await png(svg(), 512, 'public/icon-512.png')
await png(svg(), 192, 'public/icon-192.png')
await png(svg(), 180, 'public/apple-touch-icon.png')
await png(svg({ pad: 40 }), 512, 'public/icon-maskable-512.png')
writeFileSync('public/favicon.svg', svg())
await browser.close()
console.log('ok')
