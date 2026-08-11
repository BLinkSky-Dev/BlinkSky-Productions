import { useEffect, useState } from 'react'
import { categorise } from '../data/instagramCategories'
import { GALLERY, loadLocalPosts } from '../data/localGalleries'

/**
 * useInstagramFeed — fetches media from the Instagram Graph API.
 *
 * Options:
 *   limit   — how many posts to return (default 12)
 *   sortBy  — 'recent' (default) | 'engagement'
 *             'engagement' fetches one page (~50 posts), sorts by likes+comments,
 *             returns top `limit`. Never paginates the whole account history.
 *
 * Performance:
 *   1. Paint local gallery immediately (no multi-second skeleton).
 *   2. Upgrade to live Instagram when the API responds.
 *   3. Abort the live request after API_TIMEOUT_MS and keep local.
 *   4. Cache the last good live response in sessionStorage for instant revisits.
 *
 * SETUP:
 *   1. Convert IG account to Business/Creator and link to a Facebook Page.
 *   2. Create a Meta app, add Instagram Graph API, generate a long-lived token + user id.
 *   3. Prefer the serverless proxy (VITE_IG_PROXY_URL=/api/instagram) so the token
 *      never ships to the browser. Or for local dev:
 *          VITE_IG_ACCESS_TOKEN=your_long_lived_token
 *          VITE_IG_USER_ID=17841xxxxxxxxxx
 *   4. Restart `npm run dev`.
 *
 * When the API is missing or fails, loads saved images from:
 *   public/gallery/selected-work/  (sortBy: 'engagement')
 *   public/gallery/instagram/      (sortBy: 'recent')
 */

const BASE_FIELDS =
  'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count'

/** Give up on live Instagram and keep local gallery after this. */
const API_TIMEOUT_MS = 4000

/** One page is enough to pick top posts — do not walk paging.next. */
const ENGAGEMENT_POOL = 50

/** Reuse a successful live fetch within the same browser tab. */
const CACHE_TTL_MS = 5 * 60 * 1000

function withCategories(list) {
  return list.map((p) => {
    const c = categorise(p.caption, p.media_type)
    return { ...p, category: c.id, categoryLabel: c.label }
  })
}

function engagementScore(post) {
  return (post.like_count || 0) + (post.comments_count || 0)
}

function fallbackFolder(sortBy) {
  return sortBy === 'engagement' ? GALLERY.selectedWork : GALLERY.instagram
}

async function loadFallback(sortBy, limit) {
  const folder = fallbackFolder(sortBy)
  const local = await loadLocalPosts(folder, limit)
  return withCategories(local)
}

function cacheKey(sortBy, limit) {
  return `blinksky:ig-feed:${sortBy}:${limit}`
}

function readCache(sortBy, limit) {
  try {
    const raw = sessionStorage.getItem(cacheKey(sortBy, limit))
    if (!raw) return null
    const { at, posts } = JSON.parse(raw)
    if (!Array.isArray(posts) || Date.now() - at > CACHE_TTL_MS) return null
    return posts
  } catch {
    return null
  }
}

function writeCache(sortBy, limit, posts) {
  try {
    sessionStorage.setItem(
      cacheKey(sortBy, limit),
      JSON.stringify({ at: Date.now(), posts }),
    )
  } catch {
    /* private mode / quota — ignore */
  }
}

function usableMedia(list) {
  return (list || []).filter((m) => m.media_type !== 'VIDEO' || m.thumbnail_url)
}

export function useInstagramFeed({ limit = 12, sortBy = 'recent' } = {}) {
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const token = import.meta.env.VITE_IG_ACCESS_TOKEN
    const userId = import.meta.env.VITE_IG_USER_ID
    const proxy = import.meta.env.VITE_IG_PROXY_URL

    const controller = new AbortController()
    const fetchLimit = sortBy === 'engagement' ? ENGAGEMENT_POOL : limit
    let timedOut = false

    async function load() {
      // Instant paint from a fresh in-tab cache, then local files.
      const cached = readCache(sortBy, limit)
      if (cached?.length) {
        setPosts(cached)
        setStatus('ready')
      } else {
        const local = await loadFallback(sortBy, limit)
        if (controller.signal.aborted) return
        if (local.length) {
          setPosts(local)
          setStatus('fallback')
        }
      }

      const baseUrl = proxy
        ? `${proxy}?limit=${fetchLimit}`
        : token && userId
          ? `https://graph.instagram.com/${userId}/media?fields=${BASE_FIELDS}&limit=${fetchLimit}&access_token=${token}`
          : null

      if (!baseUrl) {
        if (!cached?.length) {
          // Local already applied above; if nothing local either, leave empty fallback.
          setStatus((s) => (s === 'loading' ? 'fallback' : s))
        }
        return
      }

      const timeoutId = setTimeout(() => {
        timedOut = true
        controller.abort()
      }, API_TIMEOUT_MS)

      try {
        // Single request only — never follow paging.next (that was the ~12s stall).
        const res = await fetch(baseUrl, { signal: controller.signal })
        if (!res.ok) throw new Error(`IG ${res.status}`)
        const json = await res.json()
        if (json.error) throw new Error(json.error.message || 'Instagram error')

        let data = usableMedia(json.data)
        if (sortBy === 'engagement') {
          data = [...data].sort((a, b) => engagementScore(b) - engagementScore(a))
        }
        if (!data.length) throw new Error('no media')

        const next = withCategories(data.slice(0, limit))
        setPosts(next)
        setStatus('ready')
        writeCache(sortBy, limit, next)
      } catch (err) {
        if (err.name === 'AbortError') {
          if (timedOut) {
            console.warn('[Instagram] timed out — keeping local / cached gallery')
            setStatus((s) => (s === 'loading' ? 'fallback' : s))
          }
          return
        }
        console.warn('[Instagram] falling back to local gallery:', err.message)
        setStatus((s) => (s === 'ready' ? s : 'fallback'))
        // Local/cache usually already painted; only fetch local if still empty.
        setPosts((prev) => {
          if (prev.length) return prev
          loadFallback(sortBy, limit).then((local) => {
            if (!controller.signal.aborted && local.length) setPosts(local)
          })
          return prev
        })
      } finally {
        clearTimeout(timeoutId)
      }
    }

    load()
    return () => controller.abort()
  }, [limit, sortBy])

  return { posts, status }
}
