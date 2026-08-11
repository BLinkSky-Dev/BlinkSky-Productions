import { useMemo, useState } from 'react'
import { Instagram, ExternalLink, Play } from 'lucide-react'
import { useInstagramFeed } from '../hooks/useInstagramFeed'
import SectionHeading from './SectionHeading'
import Watermark from './Watermark'
import Reveal from './Reveal'
import { studio } from '../data/socials'

const IG_HANDLE = studio.instagramHandle
const IG_URL = studio.instagram

/** Posts shown per view before we hand people off to Instagram. */
const MAX_SHOWN = 10

export default function InstagramFeed() {
  const { posts, status } = useInstagramFeed()
  const [filter, setFilter] = useState('all')

  // Build the filter row from what actually came back, so a category only
  // appears once there's a post for it.
  const present = useMemo(() => {
    const map = new Map()
    posts.forEach((p) => {
      if (p.category) map.set(p.category, p.categoryLabel)
    })
    return [...map].map(([id, label]) => ({ id, label }))
  }, [posts])

  const filtered = useMemo(
    () => (filter === 'all' ? posts : posts.filter((p) => p.category === filter)),
    [posts, filter],
  )

  // A taste of the feed, not the whole feed, Instagram is the archive.
  const shown = useMemo(() => filtered.slice(0, MAX_SHOWN), [filtered])

  return (
    <section id="instagram" className="relative py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Straight From The Studio"
            title="Latest on Instagram"
            intro="Fresh frames as we post them. Follow along for behind-the-scenes, reels and new releases."
          />
          <Reveal delay={0.1}>
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost whitespace-nowrap"
            >
              <Instagram size={16} /> @{IG_HANDLE}
            </a>
          </Reveal>
        </div>

        {/* Categories derived from each post's caption, Instagram itself
            returns no category, so hashtags/keywords are the only signal. */}
        {present.length > 1 && (
          <div
            className="-mx-6 mt-8 flex snap-x gap-2.5 overflow-x-auto px-6 pb-1
                       [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                       sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          >
            {[{ id: 'all', label: 'All' }, ...present].map((c) => {
              const count =
                c.id === 'all'
                  ? posts.length
                  : posts.filter((p) => p.category === c.id).length
              return (
                <button
                  key={c.id}
                  onClick={() => setFilter(c.id)}
                  aria-pressed={filter === c.id}
                  className={`min-h-[44px] shrink-0 snap-start rounded-full px-5 text-sm
                              transition-all duration-300 ease-smooth cursor-pointer active:scale-95 ${
                                filter === c.id
                                  ? 'bg-champagne text-ink-950 font-medium'
                                  : 'border border-ink-600 text-cloud/70 hover:border-champagne/50 hover:text-cloud'
                              }`}
                >
                  {c.label}
                  <span
                    className={`ml-2 text-xs tabular-nums ${
                      filter === c.id ? 'text-ink-950/55' : 'text-cloud/40'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        <div className="mt-8 columns-2 gap-3 sm:columns-3 md:gap-4 lg:columns-4 [column-fill:_balance]">
          {(status === 'loading' ? Array.from({ length: 12 }) : shown).map(
            (post, i) => {
              if (!post) {
                return (
                  <div
                    key={i}
                    className="shimmer mb-3 break-inside-avoid rounded-lg md:mb-4"
                    style={{ height: [180, 240, 200, 280][i % 4] }}
                    aria-hidden="true"
                  />
                )
              }
              // Videos & reels return a still cover in thumbnail_url.
              const isVideo =
                post.media_type === 'VIDEO' ||
                post.media_type === 'REELS' ||
                post.media_product_type === 'REELS'
              const img = post.thumbnail_url || post.media_url
              return (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative mb-3 block break-inside-avoid overflow-hidden rounded-lg bg-ink-800 transition-transform active:scale-[0.97] md:mb-4"
                  aria-label={
                    (isVideo ? 'Play video, ' : '') +
                    (post.caption?.slice(0, 60) || 'View on Instagram')
                  }
                >
                  <img
                    src={img}
                    alt={post.caption?.slice(0, 80) || 'Instagram post'}
                    loading="lazy"
                    decoding="async"
                    className="block w-full h-auto transition-transform duration-700 ease-smooth group-hover:scale-105"
                  />

                  <Watermark size="sm" />

                  {/* Category derived from the caption */}
                  {post.categoryLabel && (
                    <span
                      className="absolute left-2 top-2 rounded-full bg-ink-950/70 px-2.5 py-1
                                 text-[10px] font-medium uppercase tracking-wider text-champagne
                                 backdrop-blur-sm"
                    >
                      {post.categoryLabel}
                    </span>
                  )}

                  {/* Persistent play badge for videos / reels */}
                  {isVideo && (
                    <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink-950/70 text-cloud backdrop-blur-sm">
                      <Play size={14} fill="currentColor" />
                    </span>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-ink-950/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {isVideo ? (
                      <Play className="text-cloud" size={26} fill="currentColor" />
                    ) : (
                      <Instagram className="text-cloud" size={22} />
                    )}
                  </div>
                </a>
              )
            },
          )}
        </div>

        {/* Hand-off to Instagram, where the rest of the feed lives. */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <Instagram size={16} /> See more on Instagram
            </a>
          </div>
        </Reveal>

        
      </div>
    </section>
  )
}
