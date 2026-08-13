import { motion } from 'framer-motion'
import { ArrowUpRight, Star } from 'lucide-react'
import { useGoogleReviews } from '../hooks/useGoogleReviews'
import { writeGoogleReviewUrl } from '../data/reviews'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

function GoogleG({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function Stars({ value = 5, size = 16 }) {
  const full = Math.round(Math.min(5, Math.max(0, value)))
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.5}
          className={i < full ? 'fill-champagne text-champagne' : 'text-ink-600'}
        />
      ))}
    </span>
  )
}

function ReviewSkeleton() {
  return (
    <ul className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="animate-pulse border-t border-ink-700 pt-6">
          <div className="h-4 w-28 rounded bg-ink-800" />
          <div className="mt-4 h-3 w-full rounded bg-ink-800" />
          <div className="mt-2 h-3 w-5/6 rounded bg-ink-800" />
          <div className="mt-2 h-3 w-2/3 rounded bg-ink-800" />
        </li>
      ))}
    </ul>
  )
}

/**
 * Google reviews — live from Places API when configured, otherwise curated
 * fallbacks from src/data/reviews.js.
 */
export default function Reviews() {
  const { status, rating, profileUrl, reviews } = useGoogleReviews()

  return (
    <section id="reviews" className="relative py-24 md:py-32 bg-ink-900/40">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Google Reviews"
            title="Words from people we've framed."
            intro="Real client feedback from Google. Honest notes from weddings, portraits and everything in between."
          />

          <Reveal delay={0.08}>
            <div className="flex items-center gap-3">
              <GoogleG className="h-7 w-7 shrink-0" />
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-4xl leading-none text-champagne">
                  {Number(rating).toFixed(1)}
                </span>
                <Stars value={rating} size={15} />
              </div>
            </div>
          </Reveal>
        </div>

        {status === 'loading' ? (
          <ReviewSkeleton />
        ) : (
          <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((rev, i) => (
              <motion.li
                key={rev.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.5,
                  delay: (i % 3) * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="border-t border-ink-700 pt-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <Stars value={rev.rating} size={14} />
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest2 text-cloud/40">
                    <GoogleG className="h-3 w-3" />
                    Google
                  </span>
                </div>
                <blockquote className="mt-4 font-serif text-lg leading-relaxed text-cloud/85 sm:text-xl">
                  “{rev.text}”
                </blockquote>
                <footer className="mt-5 flex items-baseline justify-between gap-3">
                  <cite className="not-italic text-sm font-medium text-cloud">
                    {rev.author}
                  </cite>
                  {/* {rev.relativeTime && (
                    <time className="text-xs text-cloud/40">{rev.relativeTime}</time>
                  )} */}
                </footer>
              </motion.li>
            ))}
          </ul>
        )}

        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <a
              href={writeGoogleReviewUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Leave a Google review
              <ArrowUpRight size={16} />
            </a>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <GoogleG className="h-4 w-4" />
              See all on Google
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
