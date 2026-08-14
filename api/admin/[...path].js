/**
 * Live (Vercel) stand-in for the Vite admin plugin.
 * Login works so /admin does not 404; saving files only works with `npm run dev`.
 */
const ADMIN_PASSWORD = '1234'

function routeOf(req) {
  const parts = [].concat(req.query?.path || [])
  return parts.filter(Boolean).join('/')
}

export default async function handler(req, res) {
  const route = routeOf(req)

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method === 'GET' && route === 'health') {
    res.status(200).json({ ok: true, writable: false })
    return
  }

  const submitted = req.body?.password || req.headers['x-admin-password']
  if (String(submitted ?? '').trim() !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Wrong password.' })
    return
  }

  if (req.method === 'POST' && route === 'login') {
    res.status(200).json({ ok: true })
    return
  }

  res.status(400).json({
    error: 'Saving services only works on your computer with npm run dev.',
  })
}
