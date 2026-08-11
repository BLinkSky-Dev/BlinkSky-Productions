import { useState } from 'react'
import { motion } from 'framer-motion'
import { services } from '../data/services'
import SectionHeading from './SectionHeading'

/**
 * Services showcase, a bento grid where every tile IS a photograph.
 *
 * Image-first by design: for a photo studio the work has to do the selling, so
 * each service is a full-bleed frame with the title over it. Hovering (or
 * keyboard-focusing) zooms the image, deepens the gradient and slides the copy
 * and tags up. Every tile links to the contact section, so the section doubles
 * as eight entry points into an enquiry.
 *
 * Tile sizes vary to create rhythm; `grid-flow-dense` backfills any gaps so the
 * mosaic stays solid no matter how the spans are tweaked.
 */
const SPAN = {
  wedding:    'lg:col-span-2 lg:row-span-2',
  bridal:     'lg:row-span-2',
  model:      'lg:row-span-2',
  commercial: 'lg:col-span-2 lg:row-span-2',
  birthday:   'lg:row-span-2',
  graduation: 'lg:row-span-2',
}

export default function Services() {
  const [expandedId, setExpandedId] = useState(null)

  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="What We Shoot"
          title="Whatever the occasion, it deserves a proper frame."
          intro="Six services, one level of care. Whatever brings you here, the approach stays the same."
          align="center"
        />

        <div
          className="mt-14 grid auto-rows-[310px] grid-cols-1 gap-3 sm:grid-cols-2
                     sm:auto-rows-[280px] lg:grid-cols-4 lg:auto-rows-[195px]
                     lg:grid-flow-dense md:gap-4"
        >
          {services.map((s, i) => {
            const Icon = s.icon
            const isExpanded = expandedId === s.id
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.6,
                  delay: (i % 4) * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={SPAN[s.id] ?? ''}
              >
              <motion.div
                aria-label={s.title}
                initial="rest"
                animate="rest"
                whileHover="hov"
                onClick={() => setExpandedId(isExpanded ? null : s.id)}
                className="group relative flex h-full w-full overflow-hidden rounded-2xl bg-ink-800
                           ring-1 ring-ink-700 transition-all duration-500 ease-smooth
                           hover:ring-champagne/60 cursor-pointer lg:cursor-default"
              >
                {/* Photograph, zoom driven by Framer so it can't be lost to a
                    CSS transform-composition quirk. */}
                <motion.img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  decoding="async"
                  variants={{ rest: { scale: 1 }, hov: { scale: 1.1 } }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className={`absolute inset-0 h-full w-full object-cover ${s.objectPosition ?? 'object-center'}`}
                />

                {/* Legibility wash, deepens on hover */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-ink-950/5
                             transition-opacity duration-500 group-hover:from-ink-950
                             group-hover:via-ink-950/65"
                />

                {/* Index + icon */}
                <div className="absolute left-5 top-5 flex items-center gap-2.5">
                  <span className="font-sans text-[11px] tabular-nums tracking-widest text-cloud/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Icon
                    size={17}
                    strokeWidth={1.5}
                    className="text-champagne transition-transform duration-500 group-hover:scale-110"
                  />
                </div>


                {/* Title + reveal */}
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <h3
                    className="font-serif text-2xl leading-tight text-cloud transition-colors
                               duration-300 group-hover:text-champagne md:text-[1.7rem]"
                  >
                    {s.title}
                  </h3>

                  {/* champagne rule grows on hover */}
                  <span className="mt-2.5 block h-px w-8 bg-champagne transition-all duration-500 ease-smooth group-hover:w-16" />

                  {/* Mobile: hidden by default, shown on tap via expandedId state.
                      Desktop: hidden until hovered/focused. */}
                  <div
                    className={`grid transition-all duration-500 ease-smooth
                      ${isExpanded ? 'mt-3 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'}
                      lg:mt-0 lg:grid-rows-[0fr] lg:opacity-0
                      lg:group-hover:mt-3 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100
                      lg:group-focus-visible:mt-3 lg:group-focus-visible:grid-rows-[1fr]
                      lg:group-focus-visible:opacity-100`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm leading-relaxed text-cloud/80 line-clamp-3">
                        {s.blurb}
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {s.tags.map((t) => (
                          <li
                            key={t}
                            className="rounded-full border border-cloud/25 bg-ink-950/50 px-2.5 py-1
                                       text-[11px] text-cloud/85 backdrop-blur-sm"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
