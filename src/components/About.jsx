import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Instagram, Camera, ChevronDown, Phone } from 'lucide-react'
import Reveal from './Reveal'
import { studio } from '../data/socials'

const stats = [
  { to: 3, suffix: '+', label: 'Years Behind the Lens' },
  { to: 120, suffix: '+', label: 'Weddings Filmed' },
  { to: 100, suffix: '%', label: 'True to the Moment' },
]

const founder = {
  name: 'M G Sandosh',
  title: 'Founder ',
  photo: '/Founder.jpeg',
  bio: [
    'BlinkSky Production was founded by M G Sandosh, a passionate creative professional and generational photographer with a vision to turn moments, ideas, and stories into powerful visual experiences.',
    'For Sandosh, photography has always been about more than simply capturing a beautiful image. Families find him once for a wedding, and years later, return to him for the next chapter of their story. That lasting connection is what he works toward with every project — creating photographs that are framed, cherished, and passed down through generations, rather than simply uploaded and forgotten.',
    'His journey began at Sisiras Studio, where he developed his foundation in photography and visual storytelling. He later founded BlinkSky Production, transforming his passion into a creative production house built around authentic storytelling, cinematic visuals, and meaningful experiences.',
    'Today, Sandosh is the founder of 8+ brands and brings experience across photography, videography, creative direction, graphic design, digital content, and marketing. Even after eight years in the industry, he continues to personally shoot every project, maintaining the creative quality and personal touch that have become central to his work.',
    'From intimate wedding moments to large-scale commercial productions, his approach remains the same: understand the story, capture the emotion, and create something that lasts.',
  ],
  specialties: [
    'Weddings & Engagements',
    'Bridal Photography',
    'Fashion & Model Shoots',
    'Cultural & Religious Events',
    'Portrait Photography',
    'Commercial & Brand Shoots',
    'Cinematic Videography',
  ],
  closing:
    'At BlinkSky Production, the goal is simple — to create more than visuals; to preserve stories, emotions, and memories that can be felt today and remembered for generations.',
  instagram: 'https://www.instagram.com/mg_sandosh',
  whatsapp: 'https://wa.me/94760047671',
}

const brands = [
  {
    name: 'BlinkSky Productions',
    icon: Camera,
    logo: '/logo-portrait.png',
    logoBg: 'bg-transparent',
    description: 'Photography studio capturing weddings, portraits and events across Sri Lanka.',
  },
  {
    name: 'BlinkSky Media',
    logo: '/logo-media.png',
    logoBg: 'bg-transparent',
    description: 'Clothing shoots, branding shoots and commercial product photography.',
  },
  {
    name: 'BlinkSky Salon',
    logo: '/logo-salon.png',
    logoBg: 'bg-white',
    description: 'Beauty and grooming studio where style meets precision.',
  },
  {
    name: 'Sisiras Studio',
    logo: '/logo-sisiras.png',
    logoBg: 'bg-white',
    description: 'Wedding photography studio capturing bridal moments with a fine art touch.',
  },
  {
    name: 'Assura Solutions',
    logo: '/logo-AssuraS.png',
    logoBg: 'bg-white',
    description:
      'Transforming businesses for the digital age through innovative solutions, custom development, and strategic social media marketing.',
  },
  {
    name: 'JHUMKAS',
    logo: '/logo-jhumkas.png',
    logoBg: 'bg-[#ECE5D3]',
    description: 'Jhumkas and jewellery traditional elegance, made to be worn and kept.',
  },
 
  {
    name: 'SISIRAS Digital Advertising',
    logo: '/logo-sisiras-digital.png',
    logoBg: 'bg-[#ddddf7]',
    description:
      'Photo restore, printing, digital banners, framing, creative print & digital for every brief.',
  },
  {
    name: 'Bridal Dressing By Kawshalya',
    logo: '/logo-awshalya.png',
    logoBg:
      'bg-[linear-gradient(135deg,#051820_0%,#07232f_35%,#061f2b_50%,#07232f_65%,#051820_100%)]',
    description: 'Bridal dressings styled for your day elegance from fitting to final look.',
  },
]

/** Triple the list so we can loop seamlessly in either direction. */
const loopBrands = [...brands, ...brands, ...brands]
const BRAND_COUNT = brands.length
const LOOP_START = BRAND_COUNT // middle copy

function WhatsAppIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 15.71c-.25.7-1.44 1.33-2 1.42-.51.08-1.16.11-1.87-.12-.43-.14-.98-.32-1.69-.63-2.98-1.29-4.93-4.29-5.08-4.49-.15-.2-1.21-1.61-1.21-3.07 0-1.46.77-2.18 1.04-2.48.27-.3.59-.37.79-.37h.57c.18.01.43-.07.67.51.25.6.84 2.05.92 2.2.07.15.12.32.02.52-.1.2-.15.33-.3.5-.15.17-.32.39-.45.52-.15.14-.3.3-.13.6.18.3.77 1.27 1.65 2.05 1.13 1.01 2.08 1.32 2.38 1.47.29.14.47.12.64-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.08.12.08.71-.17 1.4z" />
    </svg>
  )
}

function FounderProfile() {
  const reduce = useReducedMotion()
  const photoRef = useRef(null)
  const copyRef = useRef(null)
  const canAnimate = useRef(false)
  const closing = useRef(false)
  const [expanded, setExpanded] = useState(false)
  const [limit, setLimit] = useState(0)
  const [clipped, setClipped] = useState(true)

  useLayoutEffect(() => {
    const el = photoRef.current
    if (!el) return
    const measure = () => setLimit(Math.round(el.getBoundingClientRect().height))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = copyRef.current
    if (!el || !limit) return
    setClipped(el.scrollHeight > limit + 1)
  }, [limit, expanded])

  const ease = [0.22, 1, 0.36, 1]
  const duration = reduce || !canAnimate.current ? 0 : 0.65

  const open = () => {
    canAnimate.current = true
    setExpanded(true)
  }

  const close = () => {
    canAnimate.current = true
    closing.current = true
    setExpanded(false)
  }

  return (
    <div
      id="founder"
      className="grid scroll-mt-28 items-start gap-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]"
    >
      <Reveal>
        <div
          ref={photoRef}
          className="relative mx-auto aspect-[3/4] w-full max-w-[14rem] overflow-hidden rounded-2xl sm:max-w-[16rem] lg:mx-0 lg:max-w-none"
        >
          <img
            src={founder.photo}
            alt={founder.name}
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
        </div>
      </Reveal>

      <Reveal delay={0.08} className="min-w-0">
        <motion.div
          ref={copyRef}
          initial={false}
          animate={{ height: expanded || !limit ? 'auto' : limit }}
          transition={{ height: { duration, ease } }}
          onAnimationComplete={() => {
            if (!closing.current) return
            closing.current = false
            document.getElementById('founder')?.scrollIntoView({
              behavior: reduce ? 'auto' : 'smooth',
              block: 'start',
            })
          }}
          className="relative overflow-hidden text-center lg:text-left"
        >
          <div className={!expanded && clipped ? 'pb-14' : ''}>
            <h3 className="font-serif text-4xl leading-tight text-cloud sm:text-5xl">
              {founder.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-champagne sm:text-[15px]">
              {founder.title}
            </p>

            <span className="mx-auto mt-7 block h-px w-10 bg-champagne/50 lg:mx-0" />

            <div className="mt-5 space-y-4">
              {founder.bio.map((para) => (
                <p key={para.slice(0, 40)} className="leading-relaxed text-cloud/65">
                  {para}
                </p>
              ))}
            </div>

            <h4 className="mt-10 font-serif text-2xl text-cloud">
              Our Creative Expertise
            </h4>
            <div className="mt-5 grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-6">
              {founder.specialties.map((s) => (
                <div
                  key={s}
                  className="flex items-center justify-center gap-2 text-sm text-cloud/55 lg:justify-start"
                >
                  <span className="h-1 w-1 flex-shrink-0 rounded-full bg-champagne/60" />
                  {s}
                </div>
              ))}
            </div>

            <p className="mt-8 leading-relaxed text-cloud/65">{founder.closing}</p>

            <div className="mt-8 flex items-center justify-center gap-3 lg:justify-start">
              <a
                href={`tel:${studio.phone.replace(/\s/g, '')}`}
                aria-label={`Call ${founder.name} at ${studio.phone}`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600
                           text-cloud/60 transition-all hover:border-champagne hover:text-champagne"
              >
                <Phone size={17} />
              </a>
              <a
                href={founder.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MG Sandosh on Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600
                           text-cloud/60 transition-all hover:border-champagne hover:text-champagne"
              >
                <Instagram size={17} />
              </a>
              <a
                href={founder.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Message MG Sandosh on WhatsApp"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600
                           text-cloud/60 transition-all hover:border-[#25D366] hover:text-[#25D366]"
              >
                <WhatsAppIcon size={17} />
              </a>
            </div>
          </div>

          <AnimatePresence>
            {!expanded && clipped && (
              <motion.div
                key="read-more-fade"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: reduce ? 0 : 0.35, delay: reduce ? 0 : 0.2, ease },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: reduce ? 0 : 0.25, ease },
                }}
                className="absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t
                           from-ink-950 via-ink-950/85 to-transparent pt-16"
              >
                <button
                  type="button"
                  aria-expanded={false}
                  onClick={open}
                  className="mx-auto inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium
                             text-champagne transition-colors hover:text-champagne-light lg:mx-0"
                >
                  Read more
                  <ChevronDown size={16} strokeWidth={1.75} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {expanded && clipped && (
            <motion.button
              key="read-less"
              type="button"
              aria-expanded={true}
              onClick={close}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.15, ease }}
              className="mx-auto mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium
                         text-champagne transition-colors hover:text-champagne-light lg:mx-0"
            >
              Read less
              <ChevronDown size={16} strokeWidth={1.75} className="rotate-180" />
            </motion.button>
          )}
        </AnimatePresence>
      </Reveal>
    </div>
  )
}

function CountStat({ to, suffix, duration = 1200 }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const [n, setN] = useState(reduce ? to : 0)

  useEffect(() => {
    if (reduce) {
      setN(to)
      return
    }
    const el = ref.current
    if (!el) return
    let raf = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf)
        if (!entry.isIntersecting) {
          setN(0)
          return
        }
        const t0 = performance.now()
        const tick = (now) => {
          const t = Math.min(1, (now - t0) / duration)
          const eased = 1 - (1 - t) ** 3
          setN(Math.round(eased * to))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to, duration, reduce])

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  )
}

function scrollCardIntoView(scroller, index, behavior = 'smooth') {
  const card = scroller.querySelectorAll('[data-brand-card]')[index]
  if (!card) return
  const left = Math.max(0, card.offsetLeft - (scroller.clientWidth - card.offsetWidth) / 2)

  if (behavior === 'auto') {
    scroller.scrollTo({ left, behavior: 'auto' })
    return
  }

  // Faster than native `smooth` (~280ms ease-out).
  const start = scroller.scrollLeft
  const delta = left - start
  if (Math.abs(delta) < 1) return

  const duration = 280
  const t0 = performance.now()
  const step = (now) => {
    const t = Math.min(1, (now - t0) / duration)
    const ease = 1 - (1 - t) ** 3
    scroller.scrollLeft = start + delta * ease
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

function nearestCardIndex(scroller) {
  const cards = scroller.querySelectorAll('[data-brand-card]')
  if (!cards.length) return 0
  const mid = scroller.scrollLeft + scroller.clientWidth / 2
  let best = 0
  let bestDist = Infinity
  cards.forEach((card, i) => {
    const center = card.offsetLeft + card.offsetWidth / 2
    const dist = Math.abs(center - mid)
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  })
  return best
}

export default function About() {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const scrollerRef = useRef(null)
  const indexRef = useRef(LOOP_START)
  const pausedRef = useRef(false)
  const resumeTimer = useRef(null)
  const jumpingRef = useRef(false)

  const pauseAuto = () => {
    pausedRef.current = true
    clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => {
      pausedRef.current = false
    }, 5000)
  }

  const goToLoopIndex = (loopIndex, behavior = 'smooth') => {
    const el = scrollerRef.current
    if (!el) return
    indexRef.current = loopIndex
    setActive(((loopIndex % BRAND_COUNT) + BRAND_COUNT) % BRAND_COUNT)
    scrollCardIntoView(el, loopIndex, behavior)
  }

  // Land on the middle copy once cards are measured.
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const id = requestAnimationFrame(() => goToLoopIndex(LOOP_START, 'auto'))
    return () => cancelAnimationFrame(id)
  }, [])

  // Track scroll → active dot; teleport when we leave the middle copy.
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    let settleTimer = null

    const onScroll = () => {
      if (jumpingRef.current) return
      const i = nearestCardIndex(el)
      indexRef.current = i
      setActive(i % BRAND_COUNT)

      clearTimeout(settleTimer)
      settleTimer = setTimeout(() => {
        // Jump back into the middle set without a visible flash.
        if (i < BRAND_COUNT || i >= BRAND_COUNT * 2) {
          const mid = BRAND_COUNT + (i % BRAND_COUNT)
          jumpingRef.current = true
          scrollCardIntoView(el, mid, 'auto')
          indexRef.current = mid
          requestAnimationFrame(() => {
            jumpingRef.current = false
          })
        }
      }, 120)
    }

    const onInteract = () => pauseAuto()

    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('pointerdown', onInteract, { passive: true })
    el.addEventListener('touchstart', onInteract, { passive: true })
    el.addEventListener('wheel', onInteract, { passive: true })

    return () => {
      clearTimeout(settleTimer)
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('pointerdown', onInteract)
      el.removeEventListener('touchstart', onInteract)
      el.removeEventListener('wheel', onInteract)
    }
  }, [])

  // Auto-advance with seamless loop.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const desktop = window.matchMedia('(min-width: 1024px)')
    if (reduceMotion) return

    const id = setInterval(() => {
      if (pausedRef.current || document.hidden || desktop.matches) return
      goToLoopIndex(indexRef.current + 1, 'smooth')
    }, 2500)

    return () => clearInterval(id)
  }, [])

  useEffect(() => () => clearTimeout(resumeTimer.current), [])

  const goTo = (brandIndex) => {
    pauseAuto()
    // Prefer the middle-copy equivalent so looping stays continuous.
    goToLoopIndex(LOOP_START + brandIndex, 'smooth')
  }

  return (
    <section id="about" className="relative py-24 md:py-32 bg-ink-900/40">
      <div className="container-x">

        {/* Studio overview */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 flex flex-col items-center justify-center lg:order-1">
            <motion.img
              src="/logo-portrait.png"
              alt="BlinkSky Productions"
              className="w-full max-w-sm"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
            {!reduceMotion && (
              <motion.span
                aria-hidden
                className="mt-2 h-px bg-gradient-to-r from-transparent via-champagne to-transparent"
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: '18rem', opacity: 1 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </div>

          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="eyebrow mb-4">The Studio</p>
              <h2 className="font-serif text-4xl leading-tight text-cloud sm:text-5xl">
                We take photos that keep time.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 leading-relaxed text-cloud/65">
                BlinkSky Productions is a photography studio with one idea at its centre: a great image feels like a memory, not a pose. We read the light, the room and the people in it. Every frame should carry the feeling of the moment it came from.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-4 leading-relaxed text-cloud/65">
                Weddings and portraits sit with BlinkSky Productions. Clothing, branding and commercial product work sits with BlinkSky Media. Either way, we pay attention to the details that would otherwise get missed, and we show up the same way regardless of the size of the job.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-3 gap-6">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={0.1 + i * 0.06}>
                  <div>
                    <p className="font-serif text-4xl text-champagne">
                      <CountStat to={s.to} suffix={s.suffix} />
                    </p>
                    <p className="mt-1 text-xs leading-snug text-cloud/55">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Founder — Meet the Founder */}
        <div className="mt-24">
          <Reveal>
            <p className="eyebrow mb-10 text-center">Meet the Founder</p>
          </Reveal>
          <FounderProfile />
        </div>

        {/* Our Brands */}
        <div className="mt-24">
          <Reveal>
            <p className="eyebrow mb-4 text-center">Our Family</p>
            <h2 className="font-serif text-center text-3xl text-cloud sm:text-4xl">
              The BlinkSky brands
            </h2>
            <p className="mx-auto mt-4 max-w-md text-center leading-relaxed text-cloud/55">
              Eight brands, one standard of work.
              <span className="lg:hidden"> Swipes on its own — or swipe yourself.</span>
            </p>
          </Reveal>

          {/* Mobile / tablet — looping autoplay carousel */}
          <Reveal delay={0.08} className="lg:hidden">
            <div className="mt-10">
              <div
                ref={scrollerRef}
                className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-2 snap-x snap-mandatory
                           [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                aria-label="BlinkSky brands"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {loopBrands.map((b, i) => {
                  const Icon = b.icon
                  return (
                    <article
                      key={`${b.name}-${i}`}
                      data-brand-card
                      className="w-[82%] max-w-sm shrink-0 snap-center overflow-hidden rounded-2xl
                                 border border-ink-700 bg-ink-950/60 sm:w-[70%]"
                    >
                      <div
                        className={`flex h-44 items-center justify-center overflow-hidden sm:h-52
                                    ${b.logoBg ?? 'bg-ink-800'}`}
                      >
                        {b.logo ? (
                          <img
                            src={b.logo}
                            alt=""
                            className={
                              b.name === 'Bridal Dressing By Awshalya'
                                ? 'h-full w-full object-cover'
                                : b.name === 'SISIRAS Digital Advertising'
                                  ? 'h-full w-full scale-[1.08] object-cover'
                                  : b.name === 'JHUMKAS' || b.name === 'B.dev'
                                    ? 'h-[92%] w-auto max-w-[92%] scale-100 object-contain'
                                    : 'h-[92%] w-auto max-w-[92%] scale-125 object-contain'
                            }
                          />
                        ) : (
                          <Icon size={48} className="text-champagne" strokeWidth={1.2} />
                        )}
                      </div>
                      <div className="border-t border-ink-700/60 px-5 py-5 text-center">
                        <h3 className="font-serif text-2xl text-cloud">{b.name}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-cloud/55">
                          {b.description}
                        </p>
                      </div>
                    </article>
                  )
                })}
              </div>

              <div className="mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Brand slides">
                {brands.map((b, i) => (
                  <button
                    key={b.name}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    aria-label={b.name}
                    onClick={() => goTo(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer
                                ${i === active
                                  ? 'w-6 bg-champagne'
                                  : 'w-2.5 bg-ink-600 active:bg-champagne/60'}`}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          {/* Desktop — original card grid */}
          <div className="mt-12 hidden gap-5 lg:grid lg:grid-cols-3">
            {brands.map((b, i) => {
              const Icon = b.icon
              return (
                <Reveal key={b.name} delay={i * 0.08}>
                  <div
                    className="group relative overflow-hidden rounded-2xl border border-ink-700
                               transition-all duration-500
                               hover:border-champagne/50
                               hover:shadow-[0_0_48px_rgba(212,175,55,0.14)]"
                  >
                    <div
                      className={`relative flex h-56 w-full items-center justify-center overflow-hidden
                                  ${b.logoBg ?? 'bg-ink-800'}`}
                    >
                      <div
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500
                                   group-hover:opacity-100
                                   bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(212,175,55,0.18),transparent)]"
                      />
                      {b.logo ? (
                        <img
                          src={b.logo}
                          alt={b.name}
                          className={
                            b.name === 'Bridal Dressing By Awshalya'
                              ? 'relative z-10 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105'
                              : b.name === 'SISIRAS Digital Advertising'
                                ? 'relative z-10 h-full w-full scale-[1.05] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.1]'
                                : 'relative z-10 h-44 w-auto max-w-[80%] object-contain transition-transform duration-500 ease-out group-hover:scale-110'
                          }
                        />
                      ) : (
                        <Icon
                          size={40}
                          className="relative z-10 text-champagne transition-transform duration-500
                                     group-hover:scale-110"
                          strokeWidth={1.2}
                        />
                      )}
                    </div>

                    <div className="border-t border-ink-700/60 bg-ink-900/80 px-6 py-5 text-center">
                      <h3 className="font-serif text-xl text-cloud">{b.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-cloud/50">{b.description}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
