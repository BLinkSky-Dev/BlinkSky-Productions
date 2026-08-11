import { useEffect, useState } from 'react'
import { categorise } from '../data/instagramCategories'
import { GALLERY, loadLocalPosts } from '../data/localGalleries'

/**
 * useInstagramFeed — fetches media from the Instagram Graph API.
 *
 * Options:
 *   limit   — how many posts to return (default 12)
 *   sortBy  — 'recent' (default) | 'engagement'
 *             'engagement' fetches 50 posts, sorts by likes+comments, returns top `limit`
 *
 * SETUP:
 *   1. Convert IG account to Business/Creator and link to a Facebook Page.
 *   2. Create a Meta app, add Instagram Graph API, generate a long-lived token + user id.
 *   3. Add to .env:
 *          VITE_IG_ACCESS_TOKEN=your_long_lived_token
 *          VITE_IG_USER_ID=17841xxxxxxxxxx
 *   4. Restart `npm run dev`.
 *
 * When the API is missing or fails, loads saved images from:
 *   public/gallery/selected-work/  (sortBy: 'engagement')
 *   public/gallery/instagram/      (sortBy: 'recent')
 */

const BASE_FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count'

function withCategories(list) {
  return list.map((p) => {
    const c = categorise(p.caption, p.media_type)
    return { ...p, category: c.id, categoryLabel: c.label }
  })
}

function engagementScore(post) {
  return post.like_count || 0
}

function fallbackFolder(sortBy) {
  return sortBy === 'engagement' ? GALLERY.selectedWork : GALLERY.instagram
}

async function loadFallback(sortBy, limit) {
  const folder = fallbackFolder(sortBy)
  const local = await loadLocalPosts(folder, limit)
  return withCategories(local)
}

export function useInstagramFeed({ limit = 12, sortBy = 'recent' } = {}) {
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const token = import.meta.env.VITE_IG_ACCESS_TOKEN
    const userId = import.meta.env.VITE_IG_USER_ID
    const proxy = import.meta.env.VITE_IG_PROXY_URL

    const controller = new AbortController()
    // Fetch a larger pool when sorting by engagement so we can pick the best.
    const fetchLimit = sortBy === 'engagement' ? 50 : limit

    async function fetchAllPages(firstUrl) {
      const all = []
      let next = firstUrl
      while (next) {
        const res = await fetch(next, { signal: controller.signal })
        if (!res.ok) throw new Error(`IG ${res.status}`)
        const json = await res.json()
        const page = (json.data || []).filter(
          (m) => m.media_type !== 'VIDEO' || m.thumbnail_url,
        )
        all.push(...page)
        next = json.paging?.next ?? null
      }
      return all
    }

    async function load() {
      const baseUrl = proxy
        ? `${proxy}?limit=${fetchLimit}`
        : token && userId
          ? `https://graph.instagram.com/${userId}/media?fields=${BASE_FIELDS}&limit=${fetchLimit}&access_token=${token}`
          : null

      if (!baseUrl) {
        setPosts(await loadFallback(sortBy, limit))
        setStatus('fallback')
        return
      }

      try {
        let data
        if (sortBy === 'engagement') {
          data = await fetchAllPages(baseUrl)
          data.sort((a, b) => engagementScore(b) - engagementScore(a))
        } else {
          const res = await fetch(baseUrl, { signal: controller.signal })
          if (!res.ok) throw new Error(`IG ${res.status}`)
          const json = await res.json()
          data = (json.data || []).filter(
            (m) => m.media_type !== 'VIDEO' || m.thumbnail_url,
          )
        }

        if (!data.length) throw new Error('no media')
        setPosts(withCategories(data.slice(0, limit)))
        setStatus('ready')
      } catch (err) {
        if (err.name === 'AbortError') return
        console.warn('[Instagram] falling back to local gallery:', err.message)
        setPosts(await loadFallback(sortBy, limit))
        setStatus('fallback')
      }
    }

    load()
    return () => controller.abort()
  }, [limit, sortBy])

  return { posts, status }
}
