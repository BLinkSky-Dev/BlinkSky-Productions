import { motion } from 'framer-motion'
import { ArrowDown, Instagram } from 'lucide-react'
import { whatsappLink } from '../data/socials'

// Local hero still — swap the file in public/gallery/selected-work/ (or change this path).
const heroImg = '/gallery/selected-work/01.jpg'

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Background image with cinematic wash */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: '50% 0%' }}
      >
        <img
          src={heroImg}
          alt="A couple photographed at golden hour by BlinkSky Productions"
          className="h-full w-full object-cover object-top"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/50 to-ink-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/80 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="container-x relative flex min-h-[100svh] flex-col justify-center pt-28 pb-16">
        <motion.div
          className="mb-6 flex items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="h-px w-8 bg-champagne" />
          <span className="eyebrow">Photography &amp; Videography Studio</span>
        </motion.div>

        <motion.h1
          className="max-w-4xl font-serif text-5xl leading-[1.02] text-cloud sm:text-6xl md:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          We frame the moments
          <span className="block italic text-champagne">worth keeping.</span>
        </motion.h1>

        <motion.p
          className="mt-8 max-w-xl text-base leading-relaxed text-cloud/70 md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9 }}
        >
          BlinkSky Productions shoots weddings, bridal portraits, model portfolios, commercial campaigns and birthdays. Every image is made to be worth holding onto.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9 }}
        >
          <a href="#quote" className="btn-primary">
            Get Quote
          </a>
          <a href="#work" className="btn-ghost">
            View Our Work
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm text-cloud/70 underline-offset-4
                       transition-colors hover:text-champagne hover:underline"
          >
            <Instagram size={16} /> or message us directly
          </a>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <a
        href="#services"
        className="absolute bottom-6 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center animate-bounce text-cloud/50 transition-colors hover:text-champagne"
        aria-label="Scroll to content"
      >
        <ArrowDown size={22} />
      </a>
    </section>
  )
}

