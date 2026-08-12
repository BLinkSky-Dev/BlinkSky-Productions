import { useEffect, useRef, useState } from 'react'
import { Instagram, Camera, Phone } from 'lucide-react'
import Reveal from './Reveal'
import { studio } from '../data/socials'

const stats = [
  { value: '2+', label: 'Years Behind the Lens' },
  { value: '500+', label: 'Shoots Delivered' },
  { value: '120+', label: 'Weddings Filmed' },
  { value: '100%', label: 'Moments, Never Staged' },
]

const founder = {
  name: 'M G Sandosh',
  title: 'Founder & Creative Director',
  photo: '/Founder.jpeg',
  bio1: 'Sandosh is a generational photographer. Families find him once, for a wedding, and come back years later for the next one. That through-line is what he works toward: images that get framed and passed down, not uploaded and forgotten.',
  bio2: 'He got his start at Sisiras Studio before founding BlinkSky Production, which has since grown into BlinkSky Media and BlinkSky Salon. Eight years in, he still shoots every project himself.',
  tagline: 'Every frame should tell a story.',
  specialties: [
    'Weddings & Engagements',
    'Bridal Photography',
    'Fashion & Model Shoots',
    'Cultural & Religious Events',
    'Portrait Photography',
    'Commercial & Brand Shoots',
    'Cinematic Videography',
  ],
  instagram: 'https://www.instagram.com/mg_sandosh',
  whatsapp: 'https://wa.me/94760047671',
}

const brands = [
  {
    name: 'BlinkSky Productions',
    icon: Camera,
    logo: '/logo-portrait.png',
    logoBg: 'bg-transparent',
    description: 'Photography studio capturing weddings, portraits and commercial work across Sri Lanka.',
  },
  {
    name: 'BlinkSky Media',
    logo: '/logo-media.png',
    logoBg: 'bg-transparent',
    description: 'Creative media production and digital content for brands that want to be seen.',
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
    name: 'JHUMKAS',
    logo: '/logo-jhumkas.png',
    logoBg: 'bg-[#ECE5D3]',
    description: 'Jhumkas and jewellery traditional elegance, made to be worn and kept.',
  },
  {
    name: 'B.dev',
    logo: '/logo-bdev.png',
    logoBg: 'bg-white',
    description:
      'Transforming businesses for the digital age through innovative solutions, custom development, and strategic social media marketing.',
  },
]

function WhatsAppIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 15.71c-.25.7-1.44 1.33-2 1.42-.51.08-1.16.11-1.87-.12-.43-.14-.98-.32-1.69-.63-2.98-1.29-4.93-4.29-5.08-4.49-.15-.2-1.21-1.61-1.21-3.07 0-1.46.77-2.18 1.04-2.48.27-.3.59-.37.79-.37h.57c.18.01.43-.07.67.51.25.6.84 2.05.92 2.2.07.15.12.32.02.52-.1.2-.15.33-.3.5-.15.17-.32.39-.45.52-.15.14-.3.3-.13.6.18.3.77 1.27 1.65 2.05 1.13 1.01 2.08 1.32 2.38 1.47.29.14.47.12.64-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.08.12.08.71-.17 1.4z" />
    </svg>
  )
}

export default function About() {
  const [active, setActive] = useState(0)
  const pausedRef = useRef(false)
  const resumeTimer = useRef(null)
  const selected = brands[active]
  const SelectedIcon = selected.icon

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const desktop = window.matchMedia('(min-width: 1024px)')
    if (reduceMotion) return

    const id = setInterval(() => {
      if (pausedRef.current || document.hidden || desktop.matches) return
      setActive((i) => (i + 1) % brands.length)
    }, 2000)

    return () => clearInterval(id)
  }, [])

  const selectBrand = (i) => {
    setActive(i)
    pausedRef.current = true
    clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => {
      pausedRef.current = false
    }, 8000)
  }

  useEffect(() => () => clearTimeout(resumeTimer.current), [])

  return (
    <section id="about" className="relative py-24 md:py-32 bg-ink-900/40">
      <div className="container-x">

        {/* Studio overview */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-transparent flex items-center justify-center">
              <img
                src="/logo-portrait.png"
                alt="BlinkSky Productions"
                className="w-full max-w-L"
              />
            </div>
          </Reveal>

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
                Whether it's a bridal shoot or a full commercial production, the approach stays the same. We pay attention to the details that would otherwise get missed, and we show up the same way regardless of the size of the job.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={0.1 + i * 0.06}>
                  <div>
                    <p className="font-serif text-4xl text-champagne">{s.value}</p>
                    <p className="mt-1 text-xs leading-snug text-cloud/55">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Founder — open editorial split */}
        <div className="mt-24">
          <Reveal>
            <p className="eyebrow mb-10 text-center">The Founder</p>
          </Reveal>

          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
            {/* Portrait */}
            <Reveal>
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[14rem] overflow-hidden rounded-2xl sm:max-w-[16rem] lg:mx-0 lg:max-w-none">
                <img
                  src={founder.photo}
                  alt={founder.name}
                  className="h-full w-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
              </div>
            </Reveal>

            {/* Details */}
            <Reveal delay={0.08}>
              <div className="text-center lg:text-left">
                <h3 className="font-serif text-4xl leading-tight text-cloud sm:text-5xl">
                  {founder.name}
                </h3>
                <span className="mt-3 inline-block rounded-full bg-champagne/15 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-champagne">
                  {founder.title}
                </span>

                <span className="mx-auto mt-7 block h-px w-10 bg-champagne/50 lg:mx-0" />

                <p className="mt-5 leading-relaxed text-cloud/65">
                  {founder.bio1}
                </p>
                <p className="mt-3 leading-relaxed text-cloud/65">
                  {founder.bio2}
                </p>

                <div className="mt-6 grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-6">
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

                <p className="mt-6 font-serif text-lg italic text-champagne/80">
                  "{founder.tagline}"
                </p>

                <div className="mt-6 flex items-center justify-center gap-3 lg:justify-start">
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
            </Reveal>
          </div>
        </div>

        {/* Our Brands */}
        <div className="mt-24">
          <Reveal>
            <p className="eyebrow mb-4 text-center">Our Family</p>
            <h2 className="font-serif text-center text-3xl text-cloud sm:text-4xl">
              The BlinkSky brands
            </h2>
            <p className="mx-auto mt-4 max-w-md text-center leading-relaxed text-cloud/55">
              Six brands, one standard of work.
              <span className="lg:hidden"> Tap a frame anytime.</span>
            </p>
          </Reveal>

          {/* Mobile / tablet — contact sheet + autoplay */}
          <Reveal delay={0.08} className="lg:hidden">
            <div className="mx-auto mt-10 max-w-lg rounded-sm border border-ink-600/80 bg-ink-950/80 p-2.5 sm:p-3">
              <div
                className="grid grid-cols-2 gap-2 sm:gap-2.5"
                role="tablist"
                aria-label="BlinkSky brands"
              >
                {brands.map((b, i) => {
                  const Icon = b.icon
                  const on = i === active
                  return (
                    <button
                      key={b.name}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      aria-controls="brand-caption"
                      aria-label={b.name}
                      onClick={() => selectBrand(i)}
                      className={`group relative flex aspect-[4/3] items-center justify-center
                                  overflow-hidden rounded-[2px] transition-all duration-300 cursor-pointer
                                  ${on
                                    ? 'ring-2 ring-champagne ring-offset-2 ring-offset-ink-950'
                                    : 'ring-1 ring-ink-700/80 opacity-80 active:opacity-100'}`}
                    >
                      <span className={`absolute inset-0 ${b.logoBg ?? 'bg-ink-800'}`} />
                      <span className="absolute left-1.5 top-1.5 z-20 font-sans text-[9px]
                                       tabular-nums tracking-wider text-cloud/40 mix-blend-difference
                                       sm:text-[10px]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {b.logo ? (
                        <img
                          src={b.logo}
                          alt=""
                          className="relative z-10 h-[70%] w-[70%] object-contain
                                     transition-transform duration-500 group-active:scale-105"
                        />
                      ) : (
                        <Icon size={28} className="relative z-10 text-champagne" strokeWidth={1.3} />
                      )}
                    </button>
                  )
                })}
              </div>

              <div
                id="brand-caption"
                role="tabpanel"
                key={selected.name}
                className="mt-2.5 border-t border-dashed border-ink-600/70 px-3 pb-1 pt-4
                           animate-[fade-up_0.3s_ease-out] sm:px-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden
                                rounded-[2px] ${selected.logoBg ?? 'bg-ink-800'}`}
                  >
                    {selected.logo ? (
                      <img
                        src={selected.logo}
                        alt=""
                        className="h-[72%] w-[72%] object-contain"
                      />
                    ) : (
                      <SelectedIcon size={22} className="text-champagne" strokeWidth={1.3} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-champagne/70">
                      Frame {String(active + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-1 font-serif text-xl leading-tight text-cloud sm:text-2xl">
                      {selected.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-cloud/55">
                      {selected.description}
                    </p>
                  </div>
                </div>
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
                          className="relative z-10 h-44 w-auto max-w-[80%] object-contain
                                     transition-transform duration-500 ease-out group-hover:scale-110"
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
