import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/**
 * Brief animated logo reveal on first load, a deliberate brand moment so the
 * mark is the first thing a visitor sees.
 *
 * Shown ONCE per browser session (sessionStorage) so returning to the page
 * mid-visit isn't slowed down, and skipped entirely for reduced-motion users.
 * Total on-screen time is ~1.6s, and it never blocks content loading beneath.
 *
 * `show` is decided synchronously on the first render so the overlay paints
 * before Nav/Hero — deciding in useEffect caused a one-frame flash of the site.
 */
const SEEN_KEY = 'blinksky:intro-seen'

function shouldShowIntro() {
  if (typeof window === 'undefined') return false
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return sessionStorage.getItem(SEEN_KEY) !== '1'
  } catch {
    return false // private mode / storage blocked — skip the intro
  }
}

export default function BrandIntro() {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(() => {
    const visible = shouldShowIntro()
    if (visible) document.body.style.overflow = 'hidden'
    return visible
  })

  useEffect(() => {
    if (reduce) {
      if (show) setShow(false)
      return
    }
    if (!show) return

    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => {
      setShow(false)
      try {
        sessionStorage.setItem(SEEN_KEY, '1')
      } catch {
        /* ignore */
      }
    }, 1600)

    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
    }
  }, [reduce, show])

  useEffect(() => {
    if (!show) document.body.style.overflow = ''
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ink-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src="/logo-landscape.png"
            alt="BlinkSky Productions"
            className="h-20 w-auto md:h-28"
            initial={{ opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* champagne sweep under the mark */}
          <motion.span
            className="absolute h-px bg-gradient-to-r from-transparent via-champagne to-transparent"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '18rem', opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginTop: '7rem' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
