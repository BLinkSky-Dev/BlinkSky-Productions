import { useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Watermark from './Watermark'

export default function Lightbox({ items, index, onClose, onNav }) {
  const open = index !== null && index >= 0
  const item = open ? items[index] : null
  const swipe = useRef(null)

  const handleKey = useCallback(
    (e) => {
      if (!open) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav(1)
      if (e.key === 'ArrowLeft') onNav(-1)
    },
    [open, onClose, onNav],
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, handleKey])

  return createPortal(
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/95 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={item.title || 'Image preview'}
        >
          <button
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 text-cloud/80 hover:text-champagne hover:border-champagne cursor-pointer"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <button
            className="absolute left-4 hidden h-12 w-12 sm:flex items-center justify-center rounded-full border border-ink-600 text-cloud/80 hover:text-champagne hover:border-champagne cursor-pointer md:left-8"
            onClick={(e) => {
              e.stopPropagation()
              onNav(-1)
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Draggable on touch: swipe left/right to move between photos,
              swipe down to dismiss, the gestures people expect from a phone
              gallery. Arrows remain for pointer and keyboard users. */}
          <motion.figure
            key={item.id}
            className="max-h-[85vh] max-w-5xl touch-none"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            /* Swipe is handled with plain pointer events rather than framer's
               `drag`. With `drag` enabled the element never finishes its exit
               animation, so AnimatePresence keeps the dialog mounted at
               opacity 0, an invisible full-screen layer that eats every tap. */
            onPointerDown={(e) => {
              swipe.current = { x: e.clientX, y: e.clientY, t: Date.now() }
            }}
            onPointerUp={(e) => {
              const s = swipe.current
              if (!s) return
              swipe.current = null
              const dx = e.clientX - s.x
              const dy = e.clientY - s.y
              const dt = Date.now() - s.t
              if (dt > 800) return // a slow drag isn't a swipe
              if (dy > 110 && Math.abs(dy) > Math.abs(dx)) return onClose()
              if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
                onNav(dx < 0 ? 1 : -1)
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="relative block"
              onContextMenu={(e) => e.preventDefault()}
            >
              {item.videoSrc ? (
                <video
                  key={item.id}
                  src={item.videoSrc}
                  poster={item.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                  className="max-h-[78vh] w-auto select-none rounded-lg object-contain pointer-events-none"
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.title || ''}
                  draggable={false}
                  className="max-h-[78vh] w-auto select-none rounded-lg object-contain"
                />
              )}
              <Watermark size="lg" />
            </span>
            {(item.title || item.categoryLabel) && (
              <figcaption className="mt-4 text-center">
                {item.categoryLabel && (
                  <span className="block text-[11px] uppercase tracking-widest2 text-champagne">
                    {item.categoryLabel}
                  </span>
                )}
                {item.title && (
                  <span className="mt-1 block font-serif text-lg text-cloud/85">
                    {item.title}
                  </span>
                )}
              </figcaption>
            )}
            <p className="mt-1 text-center text-xs text-cloud/35 sm:hidden">
              Swipe to browse · swipe down to close
            </p>
          </motion.figure>

          <button
            className="absolute right-4 hidden h-12 w-12 sm:flex items-center justify-center rounded-full border border-ink-600 text-cloud/80 hover:text-champagne hover:border-champagne cursor-pointer md:right-8"
            onClick={(e) => {
              e.stopPropagation()
              onNav(1)
            }}
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
