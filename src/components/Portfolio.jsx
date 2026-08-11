import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Instagram, Play } from 'lucide-react'
import { useInstagramFeed } from '../hooks/useInstagramFeed'
import { studio } from '../data/socials'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import SmartImage from './SmartImage'
import Watermark from './Watermark'

const SPAN_PATTERN = [
  'col-span-2 row-span-2',
  'row-span-2',
  '',
  '',
  'row-span-2',
  '',
  'row-span-2',
  'col-span-2',
  '',
  '',
  'row-span-2',
  '',
]

function spanForItem(index, ratio) {
  if (ratio && ratio > 1.15) return 'col-span-2'
  return SPAN_PATTERN[index % SPAN_PATTERN.length]
}

function SkeletonGrid() {
  return (
    <div className="mt-10 grid auto-rows-[220px] grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse rounded-xl bg-ink-800/60 ${
            i === 0 || i === 5 ? 'row-span-2' : i === 2 ? 'col-span-2' : ''
          }`}
        />
      ))}
    </div>
  )
}

export default function Portfolio() {
  const { posts, status } = useInstagramFeed({ limit: 15, sortBy: 'engagement' })
  const [ratios, setRatios] = useState({})

  useEffect(() => {
    if (!posts.length) return
    let alive = true
    // Only probe the first few for mosaic spans — measuring every remote
    // Instagram URL raced the grid and burned bandwidth on the critical path.
    posts.slice(0, 8).forEach((p) => {
      const src = p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url
      if (!src) return
      const img = new Image()
      img.onload = () => {
        if (!alive) return
        setRatios((prev) => ({ ...prev, [p.id]: img.naturalWidth / img.naturalHeight }))
      }
      img.onerror = () => {
        if (!alive) return
        setRatios((prev) => ({ ...prev, [p.id]: 1 }))
      }
      img.src = src
    })
    return () => { alive = false }
  }, [posts])

  const items = useMemo(
    () =>
      posts.map((p) => ({
        id: p.id,
        src: p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url,
        isVideo: p.media_type === 'VIDEO',
        title: (p.caption?.split('\n')[0] || 'BlinkSky Productions').replace(/#\S+/g, '').trim().slice(0, 60) || 'BlinkSky Productions',
        permalink: p.permalink,
        likes: p.like_count,
        comments: p.comments_count,
      })),
    [posts],
  )

  return (
    <section id="work" className="relative py-24 md:py-32 bg-ink-900/40">
      <div className="container-x">
        <SectionHeading
          eyebrow="Selected Work"
          title="A gallery of frames we're proud of."
          intro="Sorted by what our audience loved most."
        />

        {status === 'loading' ? (
          <SkeletonGrid />
        ) : (
          <>
            <motion.div
              layout
              className="mt-10 grid auto-rows-[220px] grid-cols-2 gap-3 [grid-auto-flow:dense] md:grid-cols-3 md:gap-4 lg:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {items.map((item, i) => {
                  const spanClass = spanForItem(i, ratios[item.id])
                  return (
                    <motion.a
                      layout
                      key={item.id}
                      href={item.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.4, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      className={`group relative overflow-hidden rounded-xl cursor-pointer transition-transform active:scale-[0.97] ${spanClass}`}
                      aria-label={`View on Instagram: ${item.title}`}
                    >
                      <SmartImage
                        src={item.src}
                        alt={item.title}
                        className="transition-transform duration-700 ease-smooth group-hover:scale-105"
                      />
                      <Watermark size="sm" />

                      {/* Reel badge */}
                      {item.isVideo && (
                        <div className="absolute left-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-ink-950/70 backdrop-blur-sm md:left-3 md:top-3">
                          <Play size={11} className="fill-cloud text-cloud ml-0.5" />
                        </div>
                      )}

                      {/* Likes badge */}
                      {item.likes > 0 && (
                        <div className="absolute right-2.5 top-2.5 flex items-center gap-2 rounded-full bg-ink-950/70 px-2.5 py-1 backdrop-blur-sm md:right-3 md:top-3">
                          <span className="flex items-center gap-1 text-[10px] font-medium text-champagne">
                            <Heart size={10} className="fill-champagne" />
                            {item.likes >= 1000 ? `${(item.likes / 1000).toFixed(1)}k` : item.likes}
                          </span>
                          {item.comments > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-medium text-cloud/70">
                              <MessageCircle size={10} />
                              {item.comments}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100" />
                      <div className="absolute inset-x-0 bottom-0 p-3 transition-all duration-300 md:p-4 md:opacity-0 md:group-hover:opacity-100">
                        <span className="font-serif text-base leading-tight text-cloud md:text-lg line-clamp-2">
                          {item.title}
                        </span>
                      </div>
                    </motion.a>
                  )
                })}
              </AnimatePresence>
            </motion.div>

          </>
        )}

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <a
              href={studio.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <Instagram size={16} /> See more of our work on Instagram
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}


