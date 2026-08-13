import { useEffect, useState } from 'react'
import {
  fallbackReviews,
  googleBusiness,
  googleProfileUrl,
} from '../data/reviews'

/**
 * Loads Google reviews via the serverless proxy when configured;
 * otherwise uses curated fallbacks from src/data/reviews.js.
 */
export function useGoogleReviews() {
  const hasProxy = Boolean(import.meta.env.VITE_GOOGLE_REVIEWS_PROXY_URL)
  const [state, setState] = useState({
    status: hasProxy ? 'loading' : 'ready',
    rating: googleBusiness.rating,
    reviewCount: googleBusiness.reviewCount || fallbackReviews.length,
    profileUrl: googleProfileUrl(),
    reviews: fallbackReviews,
    source: 'fallback',
  })

  useEffect(() => {
    let alive = true
    const proxy = import.meta.env.VITE_GOOGLE_REVIEWS_PROXY_URL

    async function load() {
      if (!proxy) return

      try {
        const res = await fetch(proxy)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (json.error) throw new Error(json.error)
        if (!alive) return

        const reviews = Array.isArray(json.reviews) ? json.reviews : []
        setState({
          status: 'ready',
          rating: json.rating ?? googleBusiness.rating,
          reviewCount: json.reviewCount ?? reviews.length,
          profileUrl: json.profileUrl || googleProfileUrl(),
          reviews: reviews.length ? reviews : fallbackReviews,
          source: reviews.length ? 'google' : 'fallback',
        })
      } catch {
        if (!alive) return
        setState((prev) => ({ ...prev, status: 'ready', source: 'fallback' }))
      }
    }

    load()
    return () => {
      alive = false
    }
  }, [])

  return state
}
