import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { services, serviceGalleryBase } from '../data/services'
import SectionHeading from './SectionHeading'
import SmartImage from './SmartImage'
import Lightbox from './Lightbox'
import Watermark from './Watermark'

/**
 * Load image URLs for a service category from its folder meta.json.
 * Falls back to the cover image if meta is missing or empty.
 */
async function loadServiceGallery(service) {
  const base = serviceGalleryBase(service.id)
  try {
    const res = await fetch(`${base}/meta.json`)
    if (res.ok) {
      const meta = await res.json()
      if (Array.isArray(meta) && meta.length) {
        return meta
          .map((m) => (m?.file ? `${base}/${m.file}` : null))
          .filter(Boolean)
      }
    }
  } catch {
    /* use cover */
  }
  return service.image ? [service.image] : []
}

/**
 * What We Shoot — accordion list.
 * One category open at a time; expand reveals a short blurb and related frames
 * from public/gallery/services/<id>/.
 */
export default function Services() {
  const [expandedId, setExpandedId] = useState(services[0]?.id ?? null)
  const [galleries, setGalleries] = useState(() =>
    Object.fromEntries(services.map((s) => [s.id, s.image ? [s.image] : []])),
  )
  const [lightbox, setLightbox] = useState({ items: [], index: null })

  useEffect(() => {
    let alive = true
    Promise.all(services.map(async (s) => [s.id, await loadServiceGallery(s)])).then(
      (entries) => {
        if (!alive) return
        setGalleries(Object.fromEntries(entries))
      },
    )
    return () => {
      alive = false
    }
  }, [])

  const openLightbox = (gallery, title, startIndex) => {
    setLightbox({
      items: gallery.map((src, i) => ({
        id: `${title}-${i}`,
        src,
        title,
        categoryLabel: title,
      })),
      index: startIndex,
    })
  }

  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="What We Shoot"
          title="Whatever the occasion, it deserves a proper frame."
          intro="Six services, one level of care. Open a category to see frames from that world."
          align="center"
        />

        <div className="mx-auto mt-14 max-w-3xl divide-y divide-ink-700 border-y border-ink-700">
          {services.map((s, i) => {
            const Icon = s.icon
            const isOpen = expandedId === s.id
            const panelId = `service-panel-${s.id}`
            const headerId = `service-header-${s.id}`
            const gallery = galleries[s.id] ?? (s.image ? [s.image] : [])

            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <h3>
                  <button
                    type="button"
                    id={headerId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setExpandedId(isOpen ? null : s.id)}
                    className="group flex w-full min-h-[72px] items-center gap-3 py-4 text-left
                               transition-colors duration-300 sm:min-h-[80px] sm:gap-5 sm:py-5
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne
                               focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
                  >
                    {/* <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg sm:h-16 sm:w-16">
                      <img
                        src={s.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className={`h-full w-full object-cover transition-transform duration-700 ease-smooth
                                    ${s.objectPosition ?? 'object-center'}
                                    ${isOpen ? 'scale-110' : 'group-hover:scale-105'}`}
                      />
                      <span className="absolute inset-0 bg-ink-950/25" />
                    </span> */}

                    <span className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
                      <span className="hidden font-sans text-[11px] tabular-nums tracking-widest text-cloud/40 sm:inline">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <Icon
                        size={16}
                        strokeWidth={1.5}
                        className={`shrink-0 transition-colors duration-300
                                   ${isOpen ? 'text-champagne' : 'text-champagne/70 group-hover:text-champagne'}`}
                      />
                      <span
                        className={`truncate font-serif text-xl leading-tight transition-colors duration-300
                                   sm:text-2xl
                                   ${isOpen ? 'text-champagne' : 'text-cloud group-hover:text-champagne'}`}
                      >
                        {s.title}
                      </span>
                    </span>

                    <ChevronDown
                      size={20}
                      strokeWidth={1.5}
                      className={`shrink-0 text-cloud/45 transition-all duration-500 ease-smooth
                                 ${isOpen ? 'rotate-180 text-champagne' : 'group-hover:text-cloud/70'}`}
                      aria-hidden
                    />
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-500 ease-smooth
                             ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`pb-6 transition-opacity duration-500 ease-smooth sm:pb-8
                                 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <p className="max-w-xl text-sm leading-relaxed text-cloud/70 sm:text-base">
                        {s.blurb}
                      </p>

                      {s.tags?.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {s.tags.map((t) => (
                            <li
                              key={t}
                              className="border border-cloud/20 px-2.5 py-1 text-[11px] text-cloud/80"
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                      )}

                      <ul className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-3">
                        {gallery.map((src, gi) => (
                          <li
                            key={src}
                            className={
                              gi === 0
                                ? 'col-span-2 aspect-[16/10] sm:col-span-1 sm:aspect-square'
                                : 'aspect-square'
                            }
                          >
                            <button
                              type="button"
                              tabIndex={isOpen ? 0 : -1}
                              onClick={() => openLightbox(gallery, s.title, gi)}
                              className="group/shot relative block h-full w-full overflow-hidden
                                         rounded-lg ring-1 ring-ink-700 transition-all duration-500
                                         hover:ring-champagne/50
                                         focus-visible:outline-none focus-visible:ring-2
                                         focus-visible:ring-champagne"
                              aria-label={`View ${s.title} photo ${gi + 1}`}
                            >
                              <SmartImage
                                src={src} 
                                alt={`${s.title} — frame ${gi + 1}`}
                                className="transition-transform duration-700 ease-smooth group-hover/shot:scale-105"
                              />
                              <span className="pointer-events-none absolute inset-0 bg-ink-950/0 transition-colors duration-300 group-hover/shot:bg-ink-950/20" />
                              <Watermark size="sm" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <Lightbox
        items={lightbox.items}
        index={lightbox.index}
        onClose={() => setLightbox((prev) => ({ ...prev, index: null }))}
        onNav={(dir) =>
          setLightbox((prev) => {
            if (prev.index === null || !prev.items.length) return prev
            const next =
              (prev.index + dir + prev.items.length) % prev.items.length
            return { ...prev, index: next }
          })
        }
      />
    </section>
  )
}
