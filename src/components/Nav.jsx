import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Instagram, Facebook, Youtube, ArrowUpRight } from 'lucide-react'
import Logo from './Logo'
import TikTok from './icons/TikTok'
import { studio } from '../data/socials'

const links = [
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#instagram', label: 'Instagram' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

const socials = [
  { icon: Instagram, href: studio.instagram, label: 'Instagram' },
  { icon: Facebook, href: studio.facebook, label: 'Facebook' },
  { icon: TikTok, href: studio.tiktok, label: 'TikTok' },
  { icon: Youtube, href: studio.youtube, label: 'YouTube' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock the page behind the full-screen menu, and let Esc close it.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-smooth ${
          scrolled && !open ? 'py-3' : 'py-4 md:py-5'
        }`}
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        {/* The blurred bar lives on its own layer so its soft lower edge can be
            masked without fading the logo and menu button with it. A hard
            border-b here would read as a crisp grey seam over the dark hero
            this fades out instead, so there's no line in either state. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 -z-10 backdrop-blur-md
                      transition-opacity duration-500 ease-smooth ${
                        scrolled && !open
                          ? 'bg-ink-950/85 opacity-100'
                          : 'bg-transparent opacity-0'
                      }`}
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, #000 55%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, #000 55%, transparent 100%)',
          }}
        />
        <nav className="container-x flex items-center justify-between">
          <Logo size="md" className="-translate-x-8 sm:-translate-x-4 md:translate-x-0" />

          <div className="hidden items-center gap-9 md:flex">
            {links.slice(0, 4).map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative text-sm text-cloud/80 transition-colors duration-300 hover:text-cloud
                           after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-champagne
                           after:transition-all after:duration-300 hover:after:w-full"
              >
                {l.label}
              </a>
            ))}
            <a href="#quote" className="btn-primary">
              Get Quote
            </a>
          </div>

          {/* 48px touch target */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative z-[70] flex h-12 w-12 items-center justify-center rounded-full
                       border border-ink-600 bg-ink-950/60 text-cloud backdrop-blur-sm
                       transition-transform duration-200 active:scale-90 md:hidden cursor-pointer"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* ── Full-screen mobile menu ─────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-ink-950 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Close button inside the overlay */}
            <motion.button
              onClick={() => setOpen(false)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center
                         rounded-full border border-ink-600 text-cloud/70
                         transition-colors active:scale-90 active:text-champagne cursor-pointer"
              style={{ marginTop: 'env(safe-area-inset-top)' }}
              aria-label="Close menu"
            >
              <X size={22} />
            </motion.button>

            <nav
              className="flex flex-1 flex-col justify-center px-7"
              style={{ paddingTop: 'env(safe-area-inset-top)' }}
            >
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.08 + i * 0.06,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group flex items-center justify-between border-b border-ink-800 py-5
                             transition-colors active:text-champagne"
                >
                  <span className="font-serif text-4xl leading-none text-cloud">
                    {l.label}
                  </span>
                  <ArrowUpRight size={22} className="text-champagne/70" />
                </motion.a>
              ))}

              <motion.a
                href="#quote"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.44, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="btn-primary mt-9 w-full py-4 text-base active:scale-95"
              >
                Get Quote
              </motion.a>
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="px-7 pb-10"
              style={{ paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom))' }}
            >
              <div className="flex gap-3">
                {socials.map((s) => {
                  const Icon = s.icon
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-12 w-12 items-center justify-center rounded-full border
                                 border-ink-600 text-cloud/75 transition-transform active:scale-90"
                    >
                      <Icon size={19} />
                    </a>
                  )
                })}
              </div>
              <p className="mt-5 text-xs text-cloud/40">
                {studio.location} · {studio.email}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
