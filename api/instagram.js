// Serverless proxy (Vercel / Netlify Functions).
//
// WHY THIS EXISTS: it keeps the Instagram access token on the SERVER. The
// browser calls /api/instagram (this function), and this function calls
// Instagram with the secret token. The token is never sent to, or visible in,
// the website itself — so no visitor can see or steal it.
//
// Server-side env vars (set them in your host's dashboard, WITHOUT the VITE_
// prefix so they never reach the browser):
//   IG_ACCESS_TOKEN = <long-lived token>   (required)
//   IG_USER_ID      = me                    (optional, defaults to "me")
//
// Then point the frontend at this proxy with a build env var:
//   VITE_IG_PROXY_URL = /api/instagram
// and DO NOT set VITE_IG_ACCESS_TOKEN in production (that would expose it).
//
// Query:
//   limit  — page size (1–50, default 12)
//   after  — pagination cursor from a previous response (optional)
//
// Response always includes `paging.cursors.after` when more media exists, so
// the client can walk the whole account without ever seeing the access token.

export default async function handler(req, res) {
  const token = process.env.IG_ACCESS_TOKEN
  const userId = process.env.IG_USER_ID || 'me'
  const limit = Math.min(Math.max(Number(req.query?.limit) || 12, 1), 50)
  const after = typeof req.query?.after === 'string' ? req.query.after : ''

  if (!token) {
    res.status(500).json({ error: 'IG_ACCESS_TOKEN not configured' })
    return
  }

  // like_count / comments_count power Selected Work's engagement sort.
  const fields =
    'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count'

  const params = new URLSearchParams({
    fields,
    limit: String(limit),
    access_token: token,
  })
  if (after) params.set('after', after)

  const url = `https://graph.instagram.com/${userId}/media?${params}`

  try {
    const r = await fetch(url)
    const json = await r.json()
    // Surface a real Instagram error (e.g. an expired token) rather than
    // returning an empty feed silently.
    if (json.error) {
      res.status(502).json({ error: json.error.message || 'Instagram error' })
      return
    }

    const nextAfter = json.paging?.cursors?.after || null
    const hasMore = Boolean(json.paging?.next && nextAfter)

    // Live feed: cache briefly at the edge so new posts appear within a
    // minute, while still shielding the API from every single page view.
    // Cursor pages vary — keep cache short so pagination stays fresh.
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=600')
    res.status(200).json({
      data: json.data || [],
      paging: hasMore ? { cursors: { after: nextAfter } } : {},
    })
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
}
