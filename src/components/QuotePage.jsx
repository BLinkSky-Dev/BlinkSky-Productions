import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Mail, MapPin, MessageCircle, Phone, Send, X } from 'lucide-react'
import { casualPackages, services } from '../data/services'
import { mapsLink, studio, whatsappLink } from '../data/socials'

// ─── Static data ─────────────────────────────────────────────────────────────

const WEDDING_CULTURES = {
  Hindu:     ['Wedding', 'Reception', 'Pre Shoot', 'Other'],
  Sinhala:   ['Wedding', 'Reception', 'Pre Shoot', 'Other'],
  Islamic:   ['Wedding', 'Walima', 'Mehandi', 'Other'],
  Christian: ['Wedding', 'Reception', 'Pre Shoot', 'Other'],
}

const ALBUM_SIZES   = ['8×24', '10×24', '12×30', '12×36', '17×24', '18×24']
const CAMERA_COUNTS = ['2 Cameras', '3 Cameras', '4 Cameras', 'Drone Included']
const VIDEO_TYPES   = [
  'Wedding Highlight Video', 'Wedding Full Video', 'Documentary Video',
  'Free Shoot', 'Save the Date Video', 'Reception Video',
]
const ENL_SIZES = ['10×15', '12×18', '16×24', '20×30']

const BRIDAL_PKGS = [
  { photos: 10, price: 10000 },
  { photos: 15, price: 13500 },
  { photos: 20, price: 18000 },
]

const BIRTHDAY_PKGS = [
  { id: 'cas',   name: 'Casual Shoot',         price: 15000, sub: null,                        items: ['15 edited photos', '1 video'] },
  { id: 'p1',    name: 'Package 1',             price: 35000, sub: 'Shoot + function coverage', items: ['Soft copies only'] },
  { id: 'p2a',   name: 'Package 2 · 8×24',     price: 40000, sub: 'Shoot + function coverage', items: ['Album 8×24 · 30 pages'] },
  { id: 'p2b',   name: 'Package 2 · 10×24',    price: 50000, sub: 'Shoot + function coverage', items: ['Album 10×24 · 30 pages'] },
  { id: 'p2c',   name: 'Package 2 · 12×24',    price: 75000, sub: 'Shoot + function coverage', items: ['Album 12×24 · 40 pages'] },
  { id: 'vid',   name: 'Videography',           price: 35000, sub: 'Shoot + function coverage', items: ['Highlight video'] },
  { id: 'fr1',   name: 'Frame Package 1',       price: 18000, sub: 'Casual shoot',              items: ['15 edited photos', '1 video', '1× 10×15 frame'] },
  { id: 'fr2',   name: 'Frame Package 2',       price: 25000, sub: 'Casual shoot',              items: ['25 edited photos', '1 video', '1× 10×15 frame'] },
  { id: 'fr3',   name: 'Frame Package 3',       price: 35000, sub: 'Casual shoot',              items: ['35 edited photos', '1 video', '1× 10×15 frame'] },
]

const GRAD_PRICES = [7000, 10000, 12000, 15000]

const STEP1_SPAN = {
  wedding:    'lg:col-span-2 lg:row-span-2',
  bridal:     'lg:row-span-2',
  model:      'lg:row-span-2',
  commercial: 'lg:col-span-2 lg:row-span-2',
  birthday:   'lg:row-span-2',
  graduation: 'lg:row-span-2',
  casual:     'lg:col-span-2 lg:row-span-2',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const lkr = (n) => `LKR ${n.toLocaleString('en-LK')}`

function Toggle({ on, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-checked={on}
      role="switch"
      className={`relative h-8 w-14 shrink-0 rounded-full p-1 transition-colors duration-300 cursor-pointer
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne
                  focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950
                  ${on ? 'bg-champagne' : 'bg-ink-700'}`}
    >
      <motion.span
        className="block h-6 w-6 rounded-full bg-white shadow-md"
        animate={{ x: on ? 24 : 0 }}
        transition={{ type: 'spring', stiffness: 520, damping: 34 }}
      />
    </button>
  )
}

function Chip({ on, onClick, children, radio = false }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      role={radio ? 'radio' : 'checkbox'}
      aria-checked={on}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm
                  transition-colors duration-200 cursor-pointer
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne
                  ${on
                    ? 'border-champagne bg-champagne text-ink-950 font-medium shadow-[0_0_22px_rgba(212,175,55,0.28)]'
                    : 'border-ink-600 bg-ink-900/50 text-cloud/65 hover:border-champagne/50 hover:text-cloud'}`}
    >
      <AnimatePresence initial={false}>
        {on && (
          <motion.span
            key="check"
            initial={{ scale: 0, opacity: 0, width: 0 }}
            animate={{ scale: 1, opacity: 1, width: 'auto' }}
            exit={{ scale: 0, opacity: 0, width: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <Check size={12} className="shrink-0" strokeWidth={2.5} />
          </motion.span>
        )}
      </AnimatePresence>
      {children}
    </motion.button>
  )
}

function PkgCard({ selected, onClick, name, price, sub, items }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full rounded-2xl border p-5 text-left transition-all duration-300 cursor-pointer
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne
                  ${selected
                    ? 'border-champagne bg-champagne/10 shadow-[0_0_28px_rgba(212,175,55,0.12)]'
                    : 'border-ink-700 bg-ink-900/50 hover:border-champagne/40 hover:bg-ink-900/80'}`}
    >
      {selected && (
        <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-champagne text-ink-950">
          <Check size={13} />
        </span>
      )}
      <p className="font-serif text-lg leading-snug text-cloud">{name}</p>
      {sub && <p className="mt-0.5 text-xs text-cloud/45">{sub}</p>}
      <p className="mt-2 font-semibold text-champagne">{price}</p>
      {items?.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {items.map((it) => (
            <li key={it} className="flex items-start gap-2 text-sm text-cloud/55">
              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-champagne/60" />
              {it}
            </li>
          ))}
        </ul>
      )}
    </button>
  )
}

// ─── Step config ─────────────────────────────────────────────────────────────

function totalSteps(type) {
  if (!type)                      return 1
  if (type === 'Wedding Photography')  return 5
  if (type === 'Clothing Photography') return 3
  return 4
}

const STEP_TITLES = {
  1: 'What are we shooting?',
  wedding: {
    2: 'Tell us about the wedding',
    3: 'Coverage & options',
    4: 'Details & budget',
    5: 'Your details',
  },
  bridal:  { 2: 'Choose your package', 3: 'Date & location', 4: 'Your details' },
  birthday:{ 2: 'Choose your package', 3: 'Date & location', 4: 'Your details' },
  grad:    { 2: 'Choose your package', 3: 'Date & location', 4: 'Your details' },
  casual:  { 2: 'Choose your package', 3: 'Date & location', 4: 'Your details' },
  commercial: { 2: 'About your project', 3: 'Get in touch' },
}

function stepTitle(type, step) {
  if (step === 1) return STEP_TITLES[1]
  if (type === 'Wedding Photography')     return STEP_TITLES.wedding[step] ?? ''
  if (type === 'Clothing Photography')  return STEP_TITLES.commercial[step] ?? ''
  if (type === 'Bridal Portraits' || type === 'Model Photography') return STEP_TITLES.bridal[step] ?? ''
  if (type === 'Birthday Photography')    return STEP_TITLES.birthday[step] ?? ''
  if (type === 'Graduation Portraits') return STEP_TITLES.grad[step] ?? ''
  if (type === 'Casual Shoots')        return STEP_TITLES.casual[step] ?? ''
  return ''
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function QuotePage() {
  const [step, setStep]   = useState(1)
  const [data, setData]   = useState({
    shootType: '',
    // wedding
    weddingCulture: '',
    weddingEvents: [],
    hasPhoto: false,
    hasVideo: false,
    albumSizes: [],
    cameraCount: '',
    videoTypes: [],
    hasEnlargements: false,
    enlargementCount: '',
    enlargementSizes: [],
    // shared
    package: '',
    location: '',
    date: '',
    budget: 150000,
    // commercial
    commercialBrand: '',
    commercialBrief: '',
    // contact
    name: '', email: '', phone: '', notes: '',
  })
  const headingRef = useRef(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    headingRef.current?.focus()
  }, [step])

  const set    = (k, v) => setData((d) => ({ ...d, [k]: v }))
  const toggle = (k, v) => setData((d) => {
    const arr = Array.isArray(d[k]) ? d[k] : []
    return { ...d, [k]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v] }
  })

  const goHome  = () => { window.location.hash = '' }
  const TOTAL   = totalSteps(data.shootType)

  const canContinue = useMemo(() => {
    if (step === 1) return !!data.shootType
    const t = data.shootType
    if (t === 'Wedding Photography') {
      if (step === 2) return !!data.weddingCulture && data.weddingEvents.length > 0
      if (step === 3) return data.hasPhoto || data.hasVideo
      if (step === 4) return !!data.location && !!data.date
      if (step === 5) return !!data.name && !!data.email
    }
    if (t === 'Clothing Photography') {
      if (step === 2) return !!data.commercialBrief.trim()
      return true
    }
    if (step === 2) return !!data.package
    if (step === 3) return !!data.date
    if (step === 4) return !!data.name && !!data.email
    return true
  }, [step, data])

  const buildSummary = () => {
    const L = [`Shoot: ${data.shootType}`]
    if (data.commercialBrand) L.push(`Brand: ${data.commercialBrand}`)
    if (data.commercialBrief)  L.push(`Project: ${data.commercialBrief}`)
    if (data.weddingCulture) L.push(`Wedding: ${data.weddingCulture} — ${data.weddingEvents.join(', ')}`)
    if (data.hasPhoto) L.push(`Photography — albums: ${data.albumSizes.join(', ') || 'TBD'}`)
    if (data.hasVideo) {
      L.push(`Videography — ${data.cameraCount || 'cameras TBD'}`)
      if (data.videoTypes.length) L.push(`Video: ${data.videoTypes.join(', ')}`)
    }
    if (data.hasEnlargements) L.push(`Enlargements: ${data.enlargementCount || '?'} pcs, ${data.enlargementSizes.join(', ')}`)
    if (data.package)   L.push(`Package: ${data.package}`)
    if (data.location)  L.push(`Location: ${data.location}`)
    if (data.date)      L.push(`Date: ${data.date}`)
    if (data.budget && data.shootType === 'Wedding Photography') L.push(`Budget: ${lkr(data.budget)}`)
    if (data.name)  L.push(`\nName: ${data.name}`)
    if (data.email) L.push(`Email: ${data.email}`)
    if (data.phone) L.push(`Phone: ${data.phone}`)
    if (data.notes) L.push(`Notes: ${data.notes}`)
    return L.join('\n')
  }

  const sendEmail = () => {
    const sub  = encodeURIComponent(`Quote request — ${data.shootType}`)
    const body = encodeURIComponent(`Hi BlinkSky,\n\nI'd like a quote:\n\n${buildSummary()}\n`)
    window.location.href = `mailto:${studio.email}?subject=${sub}&body=${body}`
  }

  const isContact = (
    (step === 5 && data.shootType === 'Wedding Photography') ||
    (step === 4 && data.shootType !== 'Wedding Photography' && data.shootType !== 'Clothing Photography')
  )

  return (
    <div className="min-h-screen bg-ink-950">

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-ink-700 bg-ink-950/95 backdrop-blur-md">
        <div className="container-x flex items-center justify-between py-4">
          <button type="button" onClick={goHome} className="focus:outline-none" aria-label="Back to BlinkSky Productions">
            <img src="/logo-landscape.png" alt="BlinkSky" className="h-9 w-auto" />
          </button>
          <div className="flex items-center gap-5">
            {data.shootType && step > 1 && (
              <span className="hidden text-sm text-cloud/40 sm:block">{data.shootType}</span>
            )}
            <button
              type="button"
              onClick={goHome}
              className="flex items-center gap-2 rounded-full border border-ink-600 px-4 py-2 text-sm
                         text-cloud/70 transition-colors hover:border-champagne hover:text-champagne cursor-pointer"
            >
              <X size={15} /> Close
            </button>
          </div>
        </div>
        {data.shootType && (
          <div className="container-x pb-3">
            <div className="flex gap-1.5">
              {Array.from({ length: TOTAL }, (_, i) => (
                <span key={i} className={`h-1 flex-1 rounded-full transition-all duration-500
                                          ${i < step ? 'bg-champagne' : 'bg-ink-700'}`} />
              ))}
            </div>
            <p className="mt-1.5 text-[11px] uppercase tracking-widest text-cloud/35">
              Step {step} of {TOTAL}
            </p>
          </div>
        )}
      </header>

      {/* ── Body ── */}
      <main className="container-x py-10 md:py-14">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="font-serif text-3xl leading-tight text-cloud outline-none sm:text-4xl md:text-5xl"
        >
          {stepTitle(data.shootType, step)}
        </h1>
        {step === 1 && (
          <p className="mt-2 text-cloud/50">No obligation — this just helps us price it accurately.</p>
        )}

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step === 1 ? 'step-1' : `${data.shootType}-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >

              {/* ══ Step 1 — Shoot type ════════════════════════════════════════ */}
              {step === 1 && (
                <div className="grid auto-rows-[200px] grid-cols-2 gap-3 sm:auto-rows-[240px] lg:grid-cols-4 lg:auto-rows-[190px] lg:grid-flow-dense md:gap-4">
                  {services.map((s, i) => {
                    const Icon = s.icon
                    const on = data.shootType === s.title
                    return (
                      <div key={s.id} className={STEP1_SPAN[s.id] ?? ''}>
                        <motion.button
                          type="button"
                          onClick={() => set('shootType', s.title)}
                          aria-pressed={on}
                          initial="rest"
                          animate="rest"
                          whileHover="hov"
                          className={`group relative flex h-full w-full overflow-hidden rounded-2xl bg-ink-800
                                      cursor-pointer transition-all duration-500 ease-smooth
                                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne
                                      ${on
                                        ? 'ring-2 ring-champagne shadow-[0_0_32px_rgba(212,175,55,0.18)]'
                                        : 'ring-1 ring-ink-700 hover:ring-champagne/60'}`}
                        >
                          <motion.img
                            src={s.image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            variants={{ rest: { scale: 1 }, hov: { scale: 1.1 } }}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                            className={`absolute inset-0 h-full w-full object-cover ${s.objectPosition ?? 'object-center'}`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-ink-950/5
                                         transition-opacity duration-500
                                         group-hover:from-ink-950 group-hover:via-ink-950/65" />
                          <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-5 sm:top-5">
                            <span className="font-sans text-[11px] tabular-nums tracking-widest text-cloud/60">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <Icon size={15} strokeWidth={1.5}
                              className="text-champagne transition-transform duration-500 group-hover:scale-110 sm:w-[17px] sm:h-[17px]" />
                          </div>
                          {on && (
                            <span className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center
                                            rounded-full bg-champagne text-ink-950 sm:right-4 sm:top-4 sm:h-7 sm:w-7">
                              <Check size={13} />
                            </span>
                          )}
                          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6">
                            <h3 className={`font-serif text-lg leading-tight transition-colors duration-300
                                            sm:text-2xl md:text-[1.7rem]
                                            ${on ? 'text-champagne' : 'text-cloud group-hover:text-champagne'}`}>
                              {s.title}
                            </h3>
                            <span className={`mt-2 block h-px transition-all duration-500 ease-smooth bg-champagne
                                             ${on ? 'w-12' : 'w-6 group-hover:w-12'}`} />
                          </div>
                        </motion.button>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* ══ Wedding — Step 2: Culture + events ════════════════════════ */}
              {step === 2 && data.shootType === 'Wedding Photography' && (
                <div className="grid gap-8 lg:grid-cols-2">
                  <div>
                    <p className="mb-4 font-serif text-xl text-cloud">Wedding type</p>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.keys(WEDDING_CULTURES).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => { set('weddingCulture', c); set('weddingEvents', []) }}
                          className={`rounded-2xl border px-5 py-4 text-left transition-all duration-200 cursor-pointer
                                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne
                                      ${data.weddingCulture === c
                                        ? 'border-champagne bg-champagne/10 text-champagne'
                                        : 'border-ink-700 text-cloud/70 hover:border-champagne/40 hover:text-cloud'}`}
                        >
                          <p className="font-semibold">{c}</p>
                          <p className="mt-1 text-xs text-cloud/40">{WEDDING_CULTURES[c].join(' · ')}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {data.weddingCulture && (
                    <div>
                      <p className="mb-2 font-serif text-xl text-cloud">Which events?</p>
                      <p className="mb-4 text-sm text-cloud/45">Select all that apply.</p>
                      <div className="flex flex-wrap gap-2.5">
                        {WEDDING_CULTURES[data.weddingCulture].map((ev) => (
                          <Chip key={ev} on={data.weddingEvents.includes(ev)} onClick={() => toggle('weddingEvents', ev)}>
                            {ev}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ══ Wedding — Step 3: Photo + Video coverage ══════════════════ */}
              {step === 3 && data.shootType === 'Wedding Photography' && (
                <div className="space-y-5 max-w-3xl">
                  {/* Photography */}
                  <div className={`rounded-2xl border p-6 transition-all duration-300
                                  ${data.hasPhoto ? 'border-champagne/50 bg-champagne/5' : 'border-ink-700 bg-ink-900/40'}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-serif text-xl text-cloud">Photography</p>
                        <p className="mt-0.5 text-sm text-cloud/50">Edited photos and printed albums</p>
                      </div>
                      <Toggle on={data.hasPhoto} onClick={() => set('hasPhoto', !data.hasPhoto)} />
                    </div>
                    <AnimatePresence initial={false}>
                      {data.hasPhoto && (
                        <motion.div
                          key="photo-opts"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-5 border-t border-champagne/20 pt-5">
                            <p className="mb-3 text-sm font-medium text-cloud/65">Album size</p>
                            <div className="flex flex-wrap gap-2" role="group" aria-label="Album size">
                              {ALBUM_SIZES.map((sz) => (
                                <Chip key={sz} on={data.albumSizes.includes(sz)} onClick={() => toggle('albumSizes', sz)}>{sz}</Chip>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Videography */}
                  <div className={`rounded-2xl border p-6 transition-all duration-300
                                  ${data.hasVideo ? 'border-champagne/50 bg-champagne/5' : 'border-ink-700 bg-ink-900/40'}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-serif text-xl text-cloud">Videography</p>
                        <p className="mt-0.5 text-sm text-cloud/50">Cinematic films and highlight reels</p>
                      </div>
                      <Toggle on={data.hasVideo} onClick={() => set('hasVideo', !data.hasVideo)} />
                    </div>
                    <AnimatePresence initial={false}>
                      {data.hasVideo && (
                        <motion.div
                          key="video-opts"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-5 space-y-5 border-t border-champagne/20 pt-5">
                            <div>
                              <p className="mb-3 text-sm font-medium text-cloud/65">Cameras</p>
                              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Cameras">
                                {CAMERA_COUNTS.map((c) => (
                                  <Chip key={c} radio on={data.cameraCount === c} onClick={() => set('cameraCount', c)}>{c}</Chip>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="mb-3 text-sm font-medium text-cloud/65">Video packages</p>
                              <div className="flex flex-wrap gap-2" role="group" aria-label="Video packages">
                                {VIDEO_TYPES.map((vt) => (
                                  <Chip key={vt} on={data.videoTypes.includes(vt)} onClick={() => toggle('videoTypes', vt)}>{vt}</Chip>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* ══ Wedding — Step 4: Enlargements + location + date + budget ═ */}
              {step === 4 && data.shootType === 'Wedding Photography' && (
                <div className="grid gap-8 lg:grid-cols-2">
                  {/* Left */}
                  <div className="space-y-6">
                    {/* Enlargements */}
                    <div className={`rounded-2xl border p-6 transition-all duration-300
                                    ${data.hasEnlargements ? 'border-champagne/50 bg-champagne/5' : 'border-ink-700 bg-ink-900/40'}`}>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-serif text-xl text-cloud">Enlargements</p>
                          <p className="mt-0.5 text-sm text-cloud/50">Large printed frames for display</p>
                        </div>
                        <Toggle on={data.hasEnlargements} onClick={() => set('hasEnlargements', !data.hasEnlargements)} />
                      </div>
                      <AnimatePresence initial={false}>
                        {data.hasEnlargements && (
                          <motion.div
                            key="enl-opts"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="mt-5 space-y-4 border-t border-champagne/20 pt-5">
                              <div>
                                <label className="mb-2 block text-sm text-cloud/65">How many?</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={data.enlargementCount}
                                  onChange={(e) => set('enlargementCount', e.target.value)}
                                  placeholder="e.g. 3"
                                  className="w-28 rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-cloud
                                             placeholder:text-cloud/35 focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
                                />
                              </div>
                              <div>
                                <p className="mb-2 text-sm text-cloud/65">Sizes</p>
                                <div className="flex flex-wrap gap-2" role="group" aria-label="Enlargement sizes">
                                  {ENL_SIZES.map((sz) => (
                                    <Chip key={sz} on={data.enlargementSizes.includes(sz)} onClick={() => toggle('enlargementSizes', sz)}>{sz}</Chip>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="mb-2 block font-serif text-xl text-cloud">
                        Location <span className="text-sm text-champagne">*</span>
                      </label>
                      <input
                        type="text"
                        value={data.location}
                        onChange={(e) => set('location', e.target.value)}
                        placeholder="Venue name or area, e.g. Waters Edge, Colombo"
                        className="w-full rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-cloud
                                   placeholder:text-cloud/35 focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
                      />
                    </div>
                  </div>

                  {/* Right */}
                  <div className="space-y-8">
                    <div>
                      <label className="mb-2 block font-serif text-xl text-cloud">
                        Date <span className="text-sm text-champagne">*</span>
                      </label>
                      <input
                        type="date"
                        value={data.date}
                        onChange={(e) => set('date', e.target.value)}
                        className="w-full max-w-xs rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-cloud
                                   focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
                      />
                    </div>

                    <div>
                      <p className="mb-1 font-serif text-xl text-cloud">Budget</p>
                      <p className="mb-4 text-3xl font-semibold text-champagne">{lkr(data.budget)}</p>
                      <input
                        type="range"
                        min={85000}
                        max={400000}
                        step={5000}
                        value={data.budget}
                        onChange={(e) => set('budget', Number(e.target.value))}
                        className="w-full accent-[#D4AF37]"
                      />
                      <div className="mt-1.5 flex justify-between text-xs text-cloud/35">
                        <span>LKR 85,000</span>
                        <span>LKR 400,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ══ Bridal / Model / Casual — Step 2: Packages ═══════════════ */}
              {step === 2 && (data.shootType === 'Bridal Portraits' || data.shootType === 'Model Photography' || data.shootType === 'Casual Shoots') && (
                <div>
                  <p className="mb-5 text-cloud/50">30–60 sec reel included with every package.</p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {(data.shootType === 'Casual Shoots' ? casualPackages : BRIDAL_PKGS).map((p) => {
                      const label = `${p.photos} Photos — ${lkr(p.price)}`
                      return (
                        <PkgCard
                          key={p.photos}
                          selected={data.package === label}
                          onClick={() => set('package', label)}
                          name={`${p.photos} Photos`}
                          price={lkr(p.price)}
                          items={['30–60 sec reel included']}
                        />
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ══ Birthday — Step 2: Packages ═══════════════════════════════ */}
              {step === 2 && data.shootType === 'Birthday Photography' && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {BIRTHDAY_PKGS.map((p) => {
                    const label = `${p.name} — ${lkr(p.price)}`
                    return (
                      <PkgCard
                        key={p.id}
                        selected={data.package === label}
                        onClick={() => set('package', label)}
                        name={p.name}
                        price={lkr(p.price)}
                        sub={p.sub}
                        items={p.items}
                      />
                    )
                  })}
                </div>
              )}

              {/* ══ Graduation — Step 2: Packages ════════════════════════════ */}
              {step === 2 && data.shootType === 'Graduation Portraits' && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {GRAD_PRICES.map((price) => {
                    const label = lkr(price)
                    return (
                      <PkgCard
                        key={price}
                        selected={data.package === label}
                        onClick={() => set('package', label)}
                        name={label}
                        price={label}
                      />
                    )
                  })}
                </div>
              )}

              {/* ══ Commercial — Step 2: Project brief ════════════════════════ */}
              {step === 2 && data.shootType === 'Clothing Photography' && (
                <div className="max-w-2xl space-y-6">
                  <div>
                    <label className="mb-2 block font-serif text-xl text-cloud">
                      Your brand or company
                      <span className="ml-2 text-sm font-sans font-normal text-cloud/40">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={data.commercialBrand}
                      onChange={(e) => set('commercialBrand', e.target.value)}
                      placeholder="e.g. Kayal, Navasthra"
                      className="w-full rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-cloud
                                 placeholder:text-cloud/35 focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-serif text-xl text-cloud">
                      Tell us about the shoot <span className="text-champagne">*</span>
                    </label>
                    <p className="mb-3 text-sm text-cloud/45">
                      Collection, look, campaign goal — whatever helps us picture the clothes.
                    </p>
                    <textarea
                      rows={5}
                      value={data.commercialBrief}
                      onChange={(e) => set('commercialBrief', e.target.value)}
                      placeholder="e.g. We're dropping a new collection and need a lookbook plus a few lifestyle shots for Instagram. Clean studio light, earth tones."
                      className="w-full resize-none rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3
                                 text-cloud placeholder:text-cloud/35 focus:border-champagne
                                 focus:outline-none focus:ring-1 focus:ring-champagne"
                    />
                  </div>
                </div>
              )}

              {/* ══ Commercial — Step 3: Contact details ══════════════════════ */}
              {step === 3 && data.shootType === 'Clothing Photography' && (
                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                  {/* Contact info */}
                  <div>
                    <p className="leading-relaxed text-cloud/60">
                      Every clothing shoot is different. We review each brief personally and come back with a tailored quote — usually within 24 hours.
                    </p>
                    <div className="mt-8 space-y-3">
                      {[
                        { icon: Phone,  label: 'Call / WhatsApp', value: studio.phone,   href: `tel:${studio.phone}`   },
                        { icon: Mail,   label: 'Email',           value: studio.email,   href: `mailto:${studio.email}` },
                        { icon: MapPin, label: 'Studio',          value: studio.address, href: mapsLink()               },
                      ].map(({ icon: Icon, label, value, href }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-4 rounded-2xl border border-ink-700 bg-ink-900/50 px-5 py-4
                                     transition-colors hover:border-champagne/50 hover:bg-ink-900/80"
                        >
                          <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-champagne/10">
                            <Icon size={16} className="text-champagne" />
                          </span>
                          <div>
                            <p className="text-xs uppercase tracking-widest text-cloud/40">{label}</p>
                            <p className="mt-0.5 text-sm text-cloud/85">{value}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Send brief */}
                  <div className="rounded-2xl border border-ink-700 bg-ink-900/50 p-6">
                    <h2 className="font-serif text-xl text-cloud">Send your brief</h2>
                    {data.commercialBrief && (
                      <div className="mt-4 rounded-xl bg-ink-800/60 px-4 py-3 text-sm italic text-cloud/55 line-clamp-4">
                        "{data.commercialBrief}"
                      </div>
                    )}
                    <div className="mt-5 grid gap-3">
                      <a
                        href={whatsappLink(
                          `Hi BlinkSky! I'd like a quote for a clothing shoot.${data.commercialBrand ? `\n\nBrand: ${data.commercialBrand}` : ''}${data.commercialBrief ? `\n\nProject brief:\n${data.commercialBrief}` : ''}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366]
                                   px-6 py-3 text-sm font-semibold text-ink-950 transition-all hover:brightness-110 cursor-pointer"
                      >
                        <MessageCircle size={16} /> Send brief on WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          const sub  = encodeURIComponent('Clothing shoot enquiry — BlinkSky Productions')
                          const body = encodeURIComponent(`Hi BlinkSky,\n\nI'd like to enquire about a clothing shoot.\n\n${buildSummary()}\n`)
                          window.location.href = `mailto:${studio.email}?subject=${sub}&body=${body}`
                        }}
                        className="btn-ghost w-full"
                      >
                        <Mail size={16} /> Send by email
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ══ Shared Step 3 (non-wedding): Date + location ═════════════ */}
              {step === 3 && data.shootType !== 'Wedding Photography' && data.shootType !== 'Clothing Photography' && (
                <div className="grid max-w-xl gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-serif text-xl text-cloud">
                      Date <span className="text-sm text-champagne">*</span>
                    </label>
                    <input
                      type="date"
                      value={data.date}
                      onChange={(e) => set('date', e.target.value)}
                      className="w-full rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-cloud
                                 focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-serif text-xl text-cloud">Location</label>
                    <input
                      type="text"
                      value={data.location}
                      onChange={(e) => set('location', e.target.value)}
                      placeholder="Venue or area"
                      className="w-full rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-cloud
                                 placeholder:text-cloud/35 focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
                    />
                  </div>
                </div>
              )}

              {/* ══ Contact step (last for all except commercial) ═════════════ */}
              {isContact && (
                <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
                  {/* Form */}
                  <div className="grid gap-5">
                    {[
                      { id: 'name',  label: 'Your name',          type: 'text',  req: true,  ph: 'Jane Perera' },
                      { id: 'email', label: 'Email',               type: 'email', req: true,  ph: 'you@email.com' },
                      { id: 'phone', label: 'Phone / WhatsApp',    type: 'tel',   req: false, ph: '+94 77 123 4567' },
                    ].map((f) => (
                      <div key={f.id}>
                        <label htmlFor={f.id} className="mb-2 block text-sm text-cloud/65">
                          {f.label} {f.req && <span className="text-champagne">*</span>}
                        </label>
                        <input
                          id={f.id}
                          type={f.type}
                          required={f.req}
                          value={data[f.id]}
                          placeholder={f.ph}
                          onChange={(e) => set(f.id, e.target.value)}
                          className="w-full rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-cloud
                                     placeholder:text-cloud/35 focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
                        />
                      </div>
                    ))}
                    <div>
                      <label htmlFor="notes" className="mb-2 block text-sm text-cloud/65">
                        Anything else we should know?
                      </label>
                      <textarea
                        id="notes"
                        rows={4}
                        value={data.notes}
                        placeholder="Guest count, venue details, the mood you're after…"
                        onChange={(e) => set('notes', e.target.value)}
                        className="w-full resize-none rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3
                                   text-cloud placeholder:text-cloud/35 focus:border-champagne
                                   focus:outline-none focus:ring-1 focus:ring-champagne"
                      />
                    </div>
                  </div>

                  {/* Summary + send */}
                  <aside className="rounded-2xl border border-ink-700 bg-ink-900/50 p-6">
                    <h2 className="font-serif text-xl text-cloud">Your request</h2>
                    <dl className="mt-4 space-y-2.5 text-sm">
                      {[
                        ['Shoot',         data.shootType],
                        data.weddingCulture ? ['Wedding',    `${data.weddingCulture} — ${data.weddingEvents.join(', ')}`] : null,
                        data.hasPhoto       ? ['Photography', data.albumSizes.join(', ') || 'Yes'] : null,
                        data.hasVideo       ? ['Videography', [data.cameraCount, ...data.videoTypes].filter(Boolean).join(', ') || 'Yes'] : null,
                        data.hasEnlargements ? ['Enlargements', `${data.enlargementCount || '?'} pcs · ${data.enlargementSizes.join(', ')}`] : null,
                        data.package        ? ['Package',     data.package] : null,
                        data.location       ? ['Location',    data.location] : null,
                        data.date           ? ['Date',        data.date] : null,
                        data.budget && data.shootType === 'Wedding Photography' ? ['Budget', lkr(data.budget)] : null,
                      ].filter(Boolean).map(([k, v]) => (
                        <div key={k} className="flex gap-3">
                          <dt className="w-28 flex-shrink-0 text-cloud/40">{k}</dt>
                          <dd className="text-cloud/80">{v}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-6 grid gap-3">
                      <a
                        href={whatsappLink(`Hi BlinkSky! I'd like a quote:\n\n${buildSummary()}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-disabled={!canContinue}
                        onClick={(e) => !canContinue && e.preventDefault()}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3
                                    text-sm font-semibold transition-all duration-300
                                    ${canContinue
                                      ? 'bg-[#25D366] text-ink-950 hover:brightness-110 cursor-pointer'
                                      : 'bg-ink-700 text-cloud/40 cursor-not-allowed'}`}
                      >
                        <Send size={16} /> Send on WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={sendEmail}
                        disabled={!canContinue}
                        className="btn-ghost w-full disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Mail size={16} /> Send by email
                      </button>
                      {!canContinue && (
                        <p className="text-center text-xs text-cloud/40">Add your name and email to send.</p>
                      )}
                    </div>
                  </aside>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Navigation ── */}
        <div className="mt-10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => (step === 1 ? goHome() : setStep((s) => s - 1))}
            className="btn-ghost"
          >
            <ArrowLeft size={16} /> {step === 1 ? 'Back to site' : 'Back'}
          </button>

          {step < TOTAL && (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canContinue}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue <ArrowRight size={16} />
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
