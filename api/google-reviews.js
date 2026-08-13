// Serverless proxy for Google Place Details (reviews).
//
// Keeps GOOGLE_PLACES_API_KEY on the server. The browser calls
// /api/google-reviews; this function calls Google Places.
//
// Server env (Vercel / Netlify — no VITE_ prefix):
//   GOOGLE_PLACES_API_KEY  — Places API key with Place Details enabled
//   GOOGLE_PLACE_ID        — e.g. ChIJ… from Google Maps / Place ID finder
//
// Frontend:
//   VITE_GOOGLE_REVIEWS_PROXY_URL=/api/google-reviews
//   VITE_GOOGLE_PLACE_ID=…   (optional; used for “Leave a review” links)
//
// Google returns at most 5 reviews per Place Details request.

export default async function handler(req, res) {
  const key = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID || process.env.VITE_GOOGLE_PLACE_ID

  if (!key) {
    res.status(500).json({ error: 'GOOGLE_PLACES_API_KEY not configured' })
    return
  }
  if (!placeId) {
    res.status(500).json({ error: 'GOOGLE_PLACE_ID not configured' })
    return
  }

  const fields = 'name,rating,user_ratings_total,reviews,url'
  const params = new URLSearchParams({
    place_id: placeId,
    fields,
    reviews_sort: 'newest',
    key,
  })
  const url = `https://maps.googleapis.com/maps/api/place/details/json?${params}`

  try {
    const r = await fetch(url)
    const json = await r.json()

    if (json.status && json.status !== 'OK') {
      res.status(502).json({
        error: json.error_message || json.status || 'Google Places error',
      })
      return
    }

    const result = json.result || {}
    const reviews = (result.reviews || []).map((rev, i) => ({
      id: `google-${rev.time || i}`,
      author: rev.author_name || 'Google reviewer',
      rating: Number(rev.rating) || 0,
      text: rev.text || '',
      relativeTime: rev.relative_time_description || '',
      profilePhotoUrl: rev.profile_photo_url || '',
      authorUrl: rev.author_url || '',
    }))

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    res.status(200).json({
      name: result.name || 'BlinkSky Productions',
      rating: result.rating ?? null,
      reviewCount: result.user_ratings_total ?? reviews.length,
      profileUrl: result.url || null,
      reviews,
      source: 'google',
    })
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
}
