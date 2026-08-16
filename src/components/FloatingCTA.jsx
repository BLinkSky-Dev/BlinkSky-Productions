import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { CalendarCheck } from 'lucide-react'
import { whatsappLink } from '../data/socials'

const EASE = [0.22, 1, 0.36, 1]
const LOOP = { repeat: Infinity, ease: 'easeInOut' }

/** Greeting → nudge toward the Get Quote button under the character. */
const BUBBLE_LINES = ['Hi!', 'Get a quote ↓', 'Tap me']

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

/** WhatsApp glyph, lucide has no brand icons. */
function WhatsAppIcon({ size = 22, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 15.71c-.25.7-1.44 1.33-2 1.42-.51.08-1.16.11-1.87-.12-.43-.14-.98-.32-1.69-.63-2.98-1.29-4.93-4.29-5.08-4.49-.15-.2-1.21-1.61-1.21-3.07 0-1.46.77-2.18 1.04-2.48.27-.3.59-.37.79-.37h.57c.18.01.43-.07.67.51.25.6.84 2.05.92 2.2.07.15.12.32.02.52-.1.2-.15.33-.3.5-.15.17-.32.39-.45.52-.15.14-.3.3-.13.6.18.3.77 1.27 1.65 2.05 1.13 1.01 2.08 1.32 2.38 1.47.29.14.47.12.64-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.08.12.08.71-.17 1.4z"/>
    </svg>
  )
}

/**
 * Photographer mascot that greets, then points hard at Get Quote.
 * Tap = open the quote page. Desktop eyes follow the cursor.
 */
function PhotographerMascot({ reduce, mood, svgRef }) {
  const pupilX = useSpring(0, { stiffness: 220, damping: 22 })
  const pupilY = useSpring(0, { stiffness: 220, damping: 22 })

  useEffect(() => {
    if (reduce) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const onMove = (e) => {
      const el = svgRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height * 0.32
      pupilX.set(clamp((e.clientX - cx) / 28, -2.6, 2.6))
      pupilY.set(clamp((e.clientY - cy) / 28, -1.8, 2.2))
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, pupilX, pupilY, svgRef])

  const waving = mood === 'wave'
  const going = mood === 'go'
  const excited = waving || going

  return (
    <motion.svg
      ref={svgRef}
      viewBox="0 0 120 176"
      overflow="visible"
      className="h-[7.25rem] w-auto overflow-visible sm:h-36"
      initial={reduce ? false : { opacity: 0, y: 12, scale: 0.9 }}
      animate={
        reduce
          ? { opacity: 1 }
          : {
              opacity: going ? 0 : 1,
              scale: going ? 0.92 : excited ? 1.03 : 1,
              y: going ? 18 : [0, -6, 0],
            }
      }
      transition={
        reduce
          ? { duration: 0 }
          : {
              opacity: { duration: going ? 0.7 : 0.4, ease: EASE },
              scale: { duration: going ? 0.7 : 0.3, ease: EASE },
              y: going
                ? { duration: 0.7, ease: EASE }
                : { duration: 2.6, ...LOOP },
            }
      }
    >
      <motion.ellipse
        cx="58"
        cy="168"
        rx="26"
        ry="5"
        fill="#000"
        animate={
          reduce
            ? { opacity: 0.22 }
            : { opacity: [0.18, 0.3, 0.18], rx: [24, 28, 24] }
        }
        transition={reduce ? { duration: 0 } : { duration: 2.6, ...LOOP }}
      />

      {/* left arm + camera */}
      <path
        d="M44 92 C28 100 24 118 32 128"
        fill="none"
        stroke="#121214"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <circle cx="32" cy="130" r="6.5" fill="#e8d5c4" />
      <g transform="translate(18, 118)">
        <rect x="0" y="4" width="22" height="16" rx="3" fill="#26262b" />
        <rect x="5" y="0" width="8" height="5" rx="1.5" fill="#1b1b1f" />
        <circle cx="12" cy="12" r="5.5" fill="#121214" />
        <circle cx="12" cy="12" r="3.2" fill="#c9a55c" />
        <circle cx="12" cy="12" r="1.4" fill="#050505" />
        <motion.circle
          cx="20"
          cy="7"
          r="2.2"
          fill="#f5f3ee"
          animate={reduce ? { opacity: 0 } : { opacity: [0, 0, 0.9, 0, 0] }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 5, repeat: Infinity, times: [0, 0.75, 0.8, 0.88, 1] }
          }
        />
      </g>

      {/* legs */}
      <rect x="46" y="128" width="10" height="24" rx="5" fill="#1b1b1f" />
      <rect x="62" y="128" width="10" height="24" rx="5" fill="#1b1b1f" />
      <ellipse cx="51" cy="152" rx="8" ry="4" fill="#0a0a0b" />
      <ellipse cx="67" cy="152" rx="8" ry="4" fill="#0a0a0b" />

      {/* torso */}
      <rect x="42" y="78" width="38" height="54" rx="14" fill="#121214" />
      <rect x="50" y="78" width="22" height="10" rx="3" fill="#c9a55c" />
      <circle cx="61" cy="108" r="3" fill="#c9a55c" />

      {/*
        Right arm has two poses: raised and waving hello, or pointing down at
        the Get Quote button. Waving swings the forearm from the elbow so the
        gesture actually reads as a wave rather than a swinging pointer.
      */}
      {waving && !reduce ? (
        <motion.g
          key="wave-arm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {/* upper arm, shoulder → elbow */}
          <path
            d="M78 88 C86 84 90 80 92 74"
            fill="none"
            stroke="#121214"
            strokeWidth="11"
            strokeLinecap="round"
          />
          {/* forearm + open hand, pivots at the elbow */}
          <motion.g
            style={{ transformOrigin: '92px 74px' }}
            animate={{ rotate: [-16, 16, -16] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path
              d="M92 74 C96 66 98 60 99 55"
              fill="none"
              stroke="#121214"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <circle cx="100" cy="49" r="8" fill="#e8d5c4" />
            <rect x="94" y="38" width="4.4" height="9" rx="2.2" fill="#e8d5c4" />
            <rect x="99" y="36" width="4.4" height="11" rx="2.2" fill="#e8d5c4" />
            <rect x="104" y="39" width="4.4" height="9" rx="2.2" fill="#e8d5c4" />
          </motion.g>
        </motion.g>
      ) : (
        <motion.g
          key="point-arm"
          style={{ transformOrigin: '78px 88px' }}
          animate={
            reduce
              ? undefined
              : going
                ? { rotate: [18, 28, 18] }
                : { rotate: [14, 26, 14] }
          }
          transition={reduce ? { duration: 0 } : { duration: 1.05, ...LOOP }}
        >
          <path
            d="M78 88 C92 104 90 128 86 142"
            fill="none"
            stroke="#121214"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <ellipse cx="86" cy="148" rx="7" ry="8" fill="#e8d5c4" />
          <rect x="83.2" y="152" width="5.6" height="16" rx="2.8" fill="#e8d5c4" />
        </motion.g>
      )}

      {/* head */}
      <motion.g
        style={{ transformOrigin: '60px 46px' }}
        animate={reduce ? undefined : { rotate: [-3, 3, -3] }}
        transition={reduce ? { duration: 0 } : { duration: 3.2, ...LOOP }}
      >
        <circle cx="38" cy="48" r="6" fill="#e8d5c4" />
        <circle cx="82" cy="48" r="6" fill="#e8d5c4" />
        <circle cx="60" cy="46" r="24" fill="#e8d5c4" />
        <path
          d="M38 42 C40 18 80 14 84 40 C78 28 62 26 48 32 C44 36 40 40 38 42Z"
          fill="#0a0a0b"
        />
        <path d="M36 38 C34 48 38 52 42 44" fill="#0a0a0b" />
        <ellipse cx="46" cy="54" rx="5" ry="3" fill="#c9a55c" opacity={excited ? 0.55 : 0.35} />
        <ellipse cx="74" cy="54" rx="5" ry="3" fill="#c9a55c" opacity={excited ? 0.55 : 0.35} />

        <motion.g style={reduce ? undefined : { x: pupilX, y: pupilY }}>
          <motion.ellipse
            cx="51"
            cy="48"
            rx="3.2"
            ry="4.2"
            fill="#0a0a0b"
            animate={reduce ? undefined : { ry: [4.2, 4.2, 4.2, 0.35, 4.2] }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 3.4, repeat: Infinity, times: [0, 0.62, 0.84, 0.9, 1] }
            }
          />
          <motion.ellipse
            cx="69"
            cy="48"
            rx="3.2"
            ry="4.2"
            fill="#0a0a0b"
            animate={reduce ? undefined : { ry: [4.2, 4.2, 4.2, 0.35, 4.2] }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 3.4, repeat: Infinity, times: [0, 0.62, 0.84, 0.9, 1] }
            }
          />
          <circle cx="52.2" cy="46.6" r="1.1" fill="#f5f3ee" />
          <circle cx="70.2" cy="46.6" r="1.1" fill="#f5f3ee" />
        </motion.g>

        <motion.path
          d="M54 58 Q60 64 66 58"
          fill="none"
          stroke="#0a0a0b"
          strokeWidth="1.8"
          strokeLinecap="round"
          animate={{
            d: excited ? 'M52 57 Q60 67 68 57' : 'M54 58 Q60 64 66 58',
          }}
          transition={{ duration: 0.25, ease: EASE }}
        />
      </motion.g>
    </motion.svg>
  )
}

/**
 * Greets (“Hi!”), points at Get Quote, and on tap opens /#quote.
 * Decorative twin of the button — keyboard users use Get Quote below.
 */
function QuoteBuddy({ reduce, going, onRequestQuote }) {
  const svgRef = useRef(null)
  const timers = useRef([])
  const [mood, setMood] = useState('wave') // open with a hello wave
  const [line, setLine] = useState('Hi!')

  const after = (fn, ms) => {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
  }

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // After the opening Hi + wave, settle into pointing + cycling copy.
  useEffect(() => {
    after(() => {
      setMood('idle')
      setLine(BUBBLE_LINES[1])
    }, reduce ? 0 : 2600)
  }, [reduce])

  useEffect(() => {
    if (reduce || mood !== 'idle' || going) return
    let i = 1
    const id = setInterval(() => {
      i = i === 1 ? 2 : 1
      setLine(BUBBLE_LINES[i])
    }, 3800)
    return () => clearInterval(id)
  }, [reduce, mood, going])

  useEffect(() => {
    if (!going) return
    setMood('go')
    setLine('Let’s get your quote')
  }, [going])

  const onEnter = () => {
    if (going || mood === 'go') return
    setMood('wave')
    setLine('Tap Get Quote ↓')
  }

  const onLeave = () => {
    if (going || mood === 'go') return
    setMood('idle')
    setLine(BUBBLE_LINES[1])
  }

  return (
    <a
      href="#quote"
      tabIndex={-1}
      aria-hidden="true"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onClick={(e) => {
        if (reduce) return
        e.preventDefault()
        onRequestQuote()
      }}
      className="pointer-events-auto -mb-1 flex cursor-pointer flex-col items-end"
    >
      <div className="relative mb-1 mr-2 h-[1.55rem]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={line}
            initial={reduce ? false : { opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: going ? 0 : 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: going ? 0.55 : 0.28, ease: EASE }}
            className="absolute bottom-0 right-0 whitespace-nowrap rounded-2xl rounded-br-md
                       border border-ink-600 bg-ink-800 px-2.5 py-1 text-[11px] font-medium
                       text-cloud shadow-lg shadow-black/40"
          >
            {line}
            <span
              aria-hidden
              className="absolute -bottom-1.5 right-3 h-2.5 w-2.5 rotate-45 border-b border-r
                         border-ink-600 bg-ink-800"
            />
          </motion.span>
        </AnimatePresence>
      </div>

      <PhotographerMascot reduce={reduce} mood={going ? 'go' : mood} svgRef={svgRef} />
    </a>
  )
}

/**
 * Floating CTAs: WhatsApp always; after the hero, the mascot + Get Quote stack.
 */
export default function FloatingCTA() {
  const reduce = useReducedMotion()
  const [past, setPast] = useState(false)
  const [going, setGoing] = useState(false)
  const leaveTimer = useRef(null)

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => () => clearTimeout(leaveTimer.current), [])

  const openQuote = (e) => {
    if (e) e.preventDefault()
    if (reduce) {
      window.location.hash = 'quote'
      return
    }
    if (going) return
    setGoing(true)
    leaveTimer.current = setTimeout(() => {
      window.location.hash = 'quote'
    }, 900)
  }

  const wa = whatsappLink()

  return (
    <div
      className="pointer-events-none fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3
                 sm:bottom-6 sm:right-6"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <AnimatePresence>
        {past && (
          <motion.div
            key="quote-stack"
            initial={{ opacity: 0, y: 16 }}
            animate={{
              opacity: going ? 0 : 1,
              y: going ? 20 : 0,
              scale: going ? 0.96 : 1,
            }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: going ? 0.75 : 0.4, ease: EASE }}
            className="flex flex-col items-end"
          >
            <QuoteBuddy reduce={reduce} going={going} onRequestQuote={openQuote} />

            <motion.a
              href="#quote"
              onClick={openQuote}
              className="pointer-events-auto inline-flex min-h-[44px] items-center gap-2 rounded-full
                         bg-champagne px-4 py-2.5 text-sm font-medium text-ink-950 shadow-xl
                         shadow-black/30 transition-all duration-300 hover:bg-champagne-light
                         hover:-translate-y-0.5 active:scale-95 cursor-pointer
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne
                         focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950
                         sm:px-5 sm:py-3"
            >
              <CalendarCheck size={17} /> Get Quote
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with BlinkSky on WhatsApp"
        className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]
                   text-white shadow-xl shadow-black/30 transition-transform duration-300
                   hover:scale-110 active:scale-95 cursor-pointer
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
                   focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950
                   sm:h-14 sm:w-14"
      >
        <WhatsAppIcon size={26} />
      </a>
    </div>
  )
}
