import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import SectionHeading from './SectionHeading'

// AUTO-UPDATING BRAND WALL.
// Every image dropped into src/assets/brands/ is picked up automatically here
// no code changes needed. Just add the file and it appears (name = filename).
const modules = import.meta.glob(
  '../assets/brands/*.{png,jpg,jpeg,PNG,JPG,JPEG,webp,svg}',
  { eager: true, query: '?url', import: 'default' },
)

const brands = Object.entries(modules)
  .map(([path, src]) => {
    const file = path.split('/').pop().replace(/\.[^.]+$/, '')
    const name = file
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase())
    return { name, src }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

const BLACK = 'rgb(0, 0, 0)'

/**
 * Per-logo zoom. Some artwork has a lot of built-in padding (so it looks small)
 * while others are tight to the edges (so they look oversized). Tweak the number
 * to taste: > 1 zooms in, < 1 zooms out. Keys are the display names derived from
 * the filenames. Anything not listed renders at 1 (unchanged).
 */
const LOGO_SCALE = {
  'SHA LOOK': 1.3, // 1.33 is the max before the left edge clips
  DARKOD: 1.35,
  LALAAZ: 1.35,
  'MISTER FRAGRANCE': 1.2, // 1.22 is the max before the mark clips
  Aara: 1.7,
  THAARAI: 1.3,
  DURDANS: 0.72,
}

/**
 * Optional chip-colour overrides. Normally the chip colour is sampled from the
 * logo's own background (see measureChip). Use this to pin a specific colour
 * e.g. a logo whose background was cleaned up and should sit on plain white.
 */
const LOGO_CHIP = {
  'MISTER FRAGRANCE': 'rgb(255, 255, 255)',
}

/**
 * Works out the chip colour for a logo:
 *   • Transparent logo (PNG with alpha)  → black backdrop.
 *   • Opaque logo (baked-in background)  → that logo's OWN background colour,
 *     sampled from its corners, so the chip blends invisibly into the artwork.
 *
 * Measured off a detached Image so it never depends on lazy-loading or an
 * onLoad that a cached <img> may never fire. Cached per src, so the duplicated
 * carousel items reuse one measurement.
 */
const chipCache = new Map()
const pending = new Map()

function measureChip(src) {
  if (chipCache.has(src)) return Promise.resolve(chipCache.get(src))
  if (pending.has(src)) return pending.get(src)

  const p = new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      let colour = BLACK
      try {
        const c = document.createElement('canvas')
        const w = (c.width = 48)
        const h = (c.height = 48)
        const ctx = c.getContext('2d', { willReadFrequently: true })
        ctx.clearRect(0, 0, w, h)
        ctx.drawImage(img, 0, 0, w, h)
        const d = ctx.getImageData(0, 0, w, h).data
        const at = (x, y) => (y * w + x) * 4

        // Transparent artwork ⇒ sit it on black.
        let clear = 0
        for (let i = 3; i < d.length; i += 4) if (d[i] < 40) clear++
        const transparent = clear / (w * h) > 0.08

        if (!transparent) {
          // Opaque ⇒ take the median of the four corners as the artwork's bg.
          const corners = [
            at(0, 0),
            at(w - 1, 0),
            at(0, h - 1),
            at(w - 1, h - 1),
          ]
          const med = (vals) => vals.sort((a, b) => a - b)[1]
          const r = med(corners.map((o) => d[o]))
          const g = med(corners.map((o) => d[o + 1]))
          const b = med(corners.map((o) => d[o + 2]))
          colour = `rgb(${r}, ${g}, ${b})`
        }
      } catch {
        colour = BLACK
      }
      chipCache.set(src, colour)
      resolve(colour)
    }
    img.onerror = () => {
      chipCache.set(src, BLACK)
      resolve(BLACK)
    }
    img.src = src
  })

  pending.set(src, p)
  return p
}

function BrandChip({ brand }) {
  const override = LOGO_CHIP[brand.name]
  // Default to black so a logo is never hidden while measuring.
  const [bg, setBg] = useState(
    () => override ?? chipCache.get(brand.src) ?? BLACK,
  )

  useEffect(() => {
    if (override) {
      setBg(override)
      return
    }
    let alive = true
    measureChip(brand.src).then((c) => {
      if (alive) setBg(c)
    })
    return () => {
      alive = false
    }
  }, [brand.src, override])

  return (
    <div
      title={brand.name}
      style={{ backgroundColor: bg }}
      className="flex h-24 w-44 shrink-0 items-center justify-center overflow-hidden
                 rounded-2xl transition-transform duration-300 ease-smooth
                 hover:scale-[1.03] md:h-28 md:w-52"
    >
      <img
        src={brand.src}
        alt={brand.name}
        loading="lazy"
        style={{ transform: `scale(${LOGO_SCALE[brand.name] ?? 1})` }}
        className="h-full w-full object-contain"
      />
    </div>
  )
}

export default function Brands() {
  const reduce = useReducedMotion()
  if (!brands.length) return null

  const loop = [...brands, ...brands]
  const duration = `${Math.max(30, brands.length * 3)}s`

  return (
    <section id="brands" className="relative overflow-hidden py-24 md:py-28 bg-ink-900/40">
      <div className="container-x">
        <SectionHeading
          eyebrow="Trusted By"
          title="Brands we've worked with."
          intro="Clothing, branding and commercial clients who've trusted BlinkSky Media behind the lens."
          align="center"
        />
      </div>

      {reduce ? (
        <div className="container-x mt-14 flex flex-wrap items-center justify-center gap-4">
          {brands.map((b) => (
            <BrandChip key={b.name} brand={b} />
          ))}
        </div>
      ) : (
        <div className="marquee-mask marquee-pause mt-14">
          <div
            className="marquee-track items-center gap-5"
            style={{ '--marquee-duration': duration }}
          >
            {loop.map((b, i) => (
              <BrandChip key={`${b.name}-${i}`} brand={b} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
