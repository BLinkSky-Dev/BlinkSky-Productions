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
 * and tags up.
 *
 * Layout is the same mosaic at every breakpoint (4 columns):
 *   Row 1: Wedding (2) · Bridal (1) · Model (1)
 *   Row 2: Birthday (1) · Commercial (2) · Graduation (1)
 */
const SPAN = {
  wedding:    'col-span-2 row-span-2',
  bridal:     'row-span-2',
  model:      'row-span-2',
  commercial: 'col-span-2 row-span-2',
  birthday:   'row-span-2',
  graduation: 'row-span-2',
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
          className="mt-14 grid grid-cols-4 grid-flow-dense gap-2
                     auto-rows-[88px] sm:auto-rows-[130px] sm:gap-3
                     md:auto-rows-[160px] md:gap-4
                     lg:auto-rows-[195px]"
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
                aria-expanded={isExpanded}
                initial="rest"
                animate={isExpanded ? 'hov' : 'rest'}
                whileHover="hov"
                onClick={() => setExpandedId(isExpanded ? null : s.id)}
                className={`group relative flex h-full w-full overflow-hidden rounded-xl bg-ink-800
                           ring-1 transition-all duration-500 ease-smooth
                           cursor-pointer sm:rounded-2xl lg:cursor-default
                           ${isExpanded
                             ? 'ring-champagne/60'
                             : 'ring-ink-700 hover:ring-champagne/60'}`}
              >
                {/* Photograph — zoom on desktop hover and on mobile tap. */}
                <motion.img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  decoding="async"
                  variants={{ rest: { scale: 1 }, hov: { scale: 1.1 } }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className={`absolute inset-0 h-full w-full object-cover ${s.objectPosition ?? 'object-center'}`}
                />

                {/* Legibility wash — deepens on hover / tap */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t to-ink-950/5 transition-all duration-500
                             ${isExpanded
                               ? 'from-ink-950 via-ink-950/65'
                               : 'from-ink-950 via-ink-950/45 group-hover:from-ink-950 group-hover:via-ink-950/65'}`}
                />

                {/* Index + icon */}
                <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 sm:left-4 sm:top-4 sm:gap-2 md:left-5 md:top-5 md:gap-2.5">
                  <span className="font-sans text-[9px] tabular-nums tracking-widest text-cloud/60 sm:text-[11px]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Icon
                    size={14}
                    strokeWidth={1.5}
                    className={`text-champagne transition-transform duration-500 sm:h-[17px] sm:w-[17px]
                               ${isExpanded ? 'scale-110' : 'group-hover:scale-110'}`}
                  />
                </div>


                {/* Title + reveal */}
                <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-4 md:p-5 lg:p-6">
                  <h3
                    className={`font-serif text-[0.8rem] leading-tight transition-colors duration-300
                               sm:text-lg md:text-[1.7rem]
                               ${isExpanded ? 'text-champagne' : 'text-cloud group-hover:text-champagne'}`}
                  >
                    {s.title}
                  </h3>

                  {/* champagne rule grows on hover / tap */}
                  <span
                    className={`mt-1.5 block h-px bg-champagne transition-all duration-500 ease-smooth sm:mt-2.5
                               ${isExpanded
                                 ? 'w-10 sm:w-16'
                                 : 'w-5 group-hover:w-10 sm:w-8 sm:group-hover:w-16'}`}
                  />

                  {/* Mobile: shown on tap. Desktop: shown on hover/focus. */}
                  <div
                    className={`grid transition-all duration-500 ease-smooth
                      ${isExpanded ? 'mt-2 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'}
                      lg:mt-0 lg:grid-rows-[0fr] lg:opacity-0
                      lg:group-hover:mt-3 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100
                      lg:group-focus-visible:mt-3 lg:group-focus-visible:grid-rows-[1fr]
                      lg:group-focus-visible:opacity-100`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[11px] leading-relaxed text-cloud/80 line-clamp-2 sm:text-sm sm:line-clamp-3">
                        {s.blurb}
                      </p>
                      <ul className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
                        {s.tags.map((t) => (
                          <li
                            key={t}
                            className="rounded-full border border-cloud/25 bg-ink-950/50 px-2 py-0.5
                                       text-[10px] text-cloud/85 backdrop-blur-sm sm:px-2.5 sm:py-1 sm:text-[11px]"
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
