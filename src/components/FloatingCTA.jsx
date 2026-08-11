import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarCheck } from 'lucide-react'
import { whatsappLink } from '../data/socials'

/** WhatsApp glyph, lucide has no brand icons. */
function WhatsAppIcon({ size = 22, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 15.71c-.25.7-1.44 1.33-2 1.42-.51.08-1.16.11-1.87-.12-.43-.14-.98-.32-1.69-.63-2.98-1.29-4.93-4.29-5.08-4.49-.15-.2-1.21-1.61-1.21-3.07 0-1.46.77-2.18 1.04-2.48.27-.3.59-.37.79-.37h.57c.18.01.43-.07.67.51.25.6.84 2.05.92 2.2.07.15.12.32.02.52-.1.2-.15.33-.3.5-.15.17-.32.39-.45.52-.15.14-.3.3-.13.6.18.3.77 1.27 1.65 2.05 1.13 1.01 2.08 1.32 2.38 1.47.29.14.47.12.64-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.08.12.08.71-.17 1.4z"/>
    </svg>
  )
}

/**
 * Floating CTAs (all breakpoints): WhatsApp always, Get Quote after scrolling
 * past the hero — same pattern on phone and desktop.
 */
export default function FloatingCTA() {
  const [past, setPast] = useState(false)

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const wa = whatsappLink()

  return (
    <div
      className="pointer-events-none fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3
                 sm:bottom-6 sm:right-6"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <AnimatePresence>
        {past && (
          <motion.a
            key="book"
            href="#quote"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-champagne px-4 py-2.5
                       text-sm font-medium text-ink-950 shadow-xl shadow-black/30 transition-all duration-300
                       hover:bg-champagne-light hover:-translate-y-0.5 active:scale-95 cursor-pointer
                       sm:px-5 sm:py-3"
          >
            <CalendarCheck size={17} /> Get Quote
          </motion.a>
        )}
      </AnimatePresence>

      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with BlinkSky on WhatsApp"
        className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]
                   text-white shadow-xl shadow-black/30 transition-transform duration-300
                   hover:scale-110 active:scale-95 cursor-pointer sm:h-14 sm:w-14"
      >
        <WhatsAppIcon size={26} />
      </a>
    </div>
  )
}
