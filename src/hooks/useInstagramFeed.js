import { useEffect, useState } from 'react'
import { categorise } from '../data/instagramCategories'
import { GALLERY, loadLocalPosts } from '../data/localGalleries'

/**
 * useInstagramFeed — fetches media from the Instagram Graph API.
 *
 * Options:
 *   limit   — how many posts to return (default 12)
 *   sortBy  — 'recent' (default) | 'engagement'
 *
 * Engagement flow (Selected Work):
 *   1. Paint local / cached gallery immediately.
 *   2. Fetch the first ~50 live posts, sort by likes+comments, swap in top `limit`.
 *   3. Keep paginating the rest of the account in the background.
 *   4. When every page is in, re-sort the full set and swap again.
 *
 * Recent flow (Instagram section):
 *   Single page of `limit` posts — no full-account walk.
 *
 * SETUP:
 *   Prefer the serverless proxy (VITE_IG_PROXY_URL=/api/instagram) so the token
 *   never ships to the browser. Or for local dev:
 *     VITE_IG_ACCESS_TOKEN=…
 *     VITE_IG_USER_ID=…
 */

const BASE_FIELDS =
  'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count'

/** First live page size for engagement sort — shown while the full crawl runs. */
const ENGAGEMENT_POOL = 50

/** Soft cap so a huge archive cannot hammer the API forever. */
const MAX_ENGAGEMENT_PAGES = 40

/** How long to wait for the *first* live page before keeping local/cache. */
const FIRST_PAGE_TIMEOUT_MS = 5000

/** Reuse a successful full engagement result within the same browser tab. */
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

function byEngagement(a, b) {
  return engagementScore(b) - engagementScore(a)
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

function topEngagement(list, limit) {
  return withCategories([...list].sort(byEngagement).slice(0, limit))
}

/**
 * Build the first-page URL and a helper that follows cursors without leaking
 * the access token when using the proxy.
 */
function createPager({ proxy, token, userId, pageSize, signal }) {
  if (proxy) {
    const firstUrl = `${proxy}?limit=${pageSize}`
    async function fetchPage(url) {
      const res = await fetch(url, { signal })
      if (!res.ok) throw new Error(`IG ${res.status}`)
      const json = await res.json()
      if (json.error) throw new Error(json.error.message || 'Instagram error')
      const after = json.paging?.cursors?.after || null
      const nextUrl = after ? `${proxy}?limit=${pageSize}&after=${encodeURIComponent(after)}` : null
      return { data: usableMedia(json.data), nextUrl }
    }
    return { firstUrl, fetchPage }
  }

  if (token && userId) {
    const firstUrl =
      `https://graph.instagram.com/${userId}/media` +
      `?fields=${BASE_FIELDS}&limit=${pageSize}&access_token=${token}`
    async function fetchPage(url) {
      const res = await fetch(url, { signal })
      if (!res.ok) throw new Error(`IG ${res.status}`)
      const json = await res.json()
      if (json.error) throw new Error(json.error.message || 'Instagram error')
      // Direct Graph calls may expose the token inside paging.next — only used
      // when the token is already in the client (local/dev). Prefer the proxy in prod.
      return { data: usableMedia(json.data), nextUrl: json.paging?.next ?? null }
    }
    return { firstUrl, fetchPage }
  }

  return null
}

export function useInstagramFeed({ limit = 12, sortBy = 'recent' } = {}) {
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const token = import.meta.env.VITE_IG_ACCESS_TOKEN
    const userId = import.meta.env.VITE_IG_USER_ID
    const proxy = import.meta.env.VITE_IG_PROXY_URL

    const controller = new AbortController()
    const { signal } = controller

    async function load() {
      // 1) Instant paint from cache, else local files.
      const cached = readCache(sortBy, limit)
      if (cached?.length) {
        setPosts(cached)
        setStatus('ready')
      } else {
        const local = await loadFallback(sortBy, limit)
        if (signal.aborted) return
        if (local.length) {
          setPosts(local)
          setStatus('fallback')
        }
      }

      const pageSize = sortBy === 'engagement' ? ENGAGEMENT_POOL : limit
      const pager = createPager({ proxy, token, userId, pageSize, signal })

      if (!pager) {
        setStatus((s) => (s === 'loading' ? 'fallback' : s))
        return
      }

      // 2) First page — soft timeout so a dead API does not block forever.
      const firstCtrl = new AbortController()
      const onAbort = () => firstCtrl.abort()
      signal.addEventListener('abort', onAbort)
      const firstTimeout = setTimeout(() => firstCtrl.abort(), FIRST_PAGE_TIMEOUT_MS)

      let first
      try {
        // Temporary signal for first page only
        const firstPager = createPager({
          proxy,
          token,
          userId,
          pageSize,
          signal: firstCtrl.signal,
        })
        first = await firstPager.fetchPage(firstPager.firstUrl)
      } catch (err) {
        if (err.name === 'AbortError') {
          if (!signal.aborted) {
            console.warn('[Instagram] first page timed out — keeping local / cached gallery')
            setStatus((s) => (s === 'loading' ? 'fallback' : s))
          }
          return
        }
        console.warn('[Instagram] falling back to local gallery:', err.message)
        setStatus((s) => (s === 'ready' ? s : 'fallback'))
        return
      } finally {
        clearTimeout(firstTimeout)
        signal.removeEventListener('abort', onAbort)
      }

      if (signal.aborted) return
      if (!first.data.length) {
        setStatus((s) => (s === 'ready' ? s : 'fallback'))
        return
      }

      // Provisional top from the first ~50 (or recent page).
      const provisional =
        sortBy === 'engagement'
          ? topEngagement(first.data, limit)
          : withCategories(first.data.slice(0, limit))

      setPosts(provisional)
      setStatus('ready')

      // Recent feed: one page is enough.
      if (sortBy !== 'engagement') {
        writeCache(sortBy, limit, provisional)
        return
      }

      // Cache the provisional result so revisits are fast even if the crawl is mid-flight.
      writeCache(sortBy, limit, provisional)

      // 3) Background crawl — walk the rest of the account, then swap true tops.
      if (!first.nextUrl) return

      const all = [...first.data]
      let nextUrl = first.nextUrl
      let pages = 1

      try {
        while (nextUrl && pages < MAX_ENGAGEMENT_PAGES && !signal.aborted) {
          const page = await pager.fetchPage(nextUrl)
          all.push(...page.data)
          nextUrl = page.nextUrl
          pages += 1
        }

        if (signal.aborted) return

        const final = topEngagement(all, limit)
        setPosts(final)
        setStatus('ready')
        writeCache(sortBy, limit, final)
      } catch (err) {
        if (err.name === 'AbortError') return
        // Keep the provisional top-50 result — still useful.
        console.warn('[Instagram] full engagement crawl failed — keeping first-page tops:', err.message)
      }
    }

    load()
    return () => controller.abort()
  }, [limit, sortBy])

  return { posts, status }
}
