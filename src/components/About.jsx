import { Instagram, Camera } from 'lucide-react'
import Reveal from './Reveal'

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
]

function WhatsAppIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 15.71c-.25.7-1.44 1.33-2 1.42-.51.08-1.16.11-1.87-.12-.43-.14-.98-.32-1.69-.63-2.98-1.29-4.93-4.29-5.08-4.49-.15-.2-1.21-1.61-1.21-3.07 0-1.46.77-2.18 1.04-2.48.27-.3.59-.37.79-.37h.57c.18.01.43-.07.67.51.25.6.84 2.05.92 2.2.07.15.12.32.02.52-.1.2-.15.33-.3.5-.15.17-.32.39-.45.52-.15.14-.3.3-.13.6.18.3.77 1.27 1.65 2.05 1.13 1.01 2.08 1.32 2.38 1.47.29.14.47.12.64-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.08.12.08.71-.17 1.4z" />
    </svg>
  )
}

export default function About() {
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

        {/* Founder — editorial split layout */}
        <div className="mt-24">
          <Reveal>
            <p className="eyebrow mb-10 text-center">The Founder</p>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="overflow-hidden rounded-2xl border border-ink-700 lg:grid lg:grid-cols-[4fr_8fr]">

              {/* Portrait photo */}
              <div className="relative aspect-[3/4] lg:aspect-auto">
                <img
                  src={founder.photo}
                  alt={founder.name}
                  className="h-full w-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-ink-950/30" />
              </div>

              {/* Details */}
              <div className="flex flex-col justify-center bg-ink-900/70 px-8 py-10 sm:px-10 lg:px-14 lg:py-12">
                <h3 className="font-serif text-4xl leading-tight text-cloud sm:text-5xl">
                  {founder.name}
                </h3>
                <span className="mt-3 inline-block w-fit rounded-full bg-champagne/15 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-champagne">
                  {founder.title}
                </span>

                <span className="mt-7 block h-px w-10 bg-champagne/50" />

                <p className="mt-5 leading-relaxed text-cloud/65">
                  {founder.bio1}
                </p>
                <p className="mt-3 leading-relaxed text-cloud/65">
                  {founder.bio2}
                </p>

                {/* Specialties */}
                <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2">
                  {founder.specialties.map((s) => (
                    <div key={s} className="flex items-center gap-2 text-sm text-cloud/55">
                      <span className="h-1 w-1 flex-shrink-0 rounded-full bg-champagne/60" />
                      {s}
                    </div>
                  ))}
                </div>

                {/* Tagline */}
                <p className="mt-6 font-serif text-lg italic text-champagne/80">
                  "{founder.tagline}"
                </p>

                <div className="mt-6 flex items-center gap-3">
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

            </div>
          </Reveal>
        </div>

        {/* Our Brands */}
        <div className="mt-24">
          <Reveal>
            <p className="eyebrow mb-4 text-center">Our Family</p>
            <h2 className="font-serif text-center text-3xl text-cloud sm:text-4xl">
              The BlinkSky brands
            </h2>
            <p className="mx-auto mt-4 max-w-md text-center leading-relaxed text-cloud/55">
              Three studios, one standard of work.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((b, i) => {
              const Icon = b.icon
              return (
                <Reveal key={b.name} delay={i * 0.08}>
                  <div className="group relative overflow-hidden rounded-2xl border border-ink-700
                                  transition-all duration-500
                                  hover:border-champagne/50
                                  hover:shadow-[0_0_48px_rgba(212,175,55,0.14)]">

                    {/* Logo showcase area */}
                    <div className={`relative flex h-56 w-full items-center justify-center overflow-hidden ${b.logoBg ?? 'bg-ink-800'}`}>
                      {/* Ambient glow */}
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500
                                      group-hover:opacity-100
                                      bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(212,175,55,0.18),transparent)]" />
                      {b.logo ? (
                        <img
                          src={b.logo}
                          alt={b.name}
                          className="relative z-10 h-44 w-auto max-w-[80%] object-contain
                                     transition-transform duration-500 ease-out group-hover:scale-110"
                        />
                      ) : (
                        <Icon size={40} className="relative z-10 text-champagne transition-transform duration-500 group-hover:scale-110" strokeWidth={1.2} />
                      )}
                    </div>

                    {/* Text */}
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
