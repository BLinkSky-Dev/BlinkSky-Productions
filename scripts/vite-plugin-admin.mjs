/**
 * Local admin API for creating services, packages and gallery photos.
 * Writes into public/ so the quote page and accordion pick changes up immediately.
 * Only available while `npm run dev` is running — not on the static Vercel host.
 */
import fs from 'fs'
import path from 'path'

const ID_RE = /^[a-z0-9-]{1,40}$/
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const MAX_PHOTO_BYTES = 8 * 1024 * 1024

function catalogPath(root) {
  return path.join(root, 'public/data/services-catalog.json')
}

function readCatalog(root) {
  const file = catalogPath(root)
  if (!fs.existsSync(file)) return { services: [] }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return { services: [] }
  }
}

function writeCatalog(root, data) {
  const file = catalogPath(root)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
}

function writeMeta(dir) {
  const files = fs
    .readdirSync(dir)
    .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  const folder = path.basename(dir)
  const meta = files.map((file, i) => ({
    file,
    id: `local-services-${folder}-${i + 1}`,
    caption: '',
    permalink: 'https://instagram.com/',
    media_type: 'IMAGE',
    like_count: 0,
    comments_count: 0,
  }))
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(meta, null, 2))
  return files
}

function unlinkServicePhoto(dir, id, url) {
  let pathname = String(url || '').split('?')[0]
  try {
    if (/^https?:\/\//i.test(pathname)) pathname = new URL(pathname).pathname
  } catch {
    return
  }
  const prefix = `/gallery/services/${id}/`
  if (!pathname.startsWith(prefix)) return
  const filename = path.basename(pathname)
  if (!IMAGE_EXT.has(path.extname(filename).toLowerCase())) return
  const resolvedDir = path.resolve(dir)
  const resolved = path.resolve(dir, filename)
  if (resolved !== resolvedDir && !resolved.startsWith(`${resolvedDir}${path.sep}`)) return
  if (fs.existsSync(resolved)) fs.unlinkSync(resolved)
}

function slugify(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'service'
}

function send(res, status, body) {
  const json = JSON.stringify(body)
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(json)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (c) => {
      size += c.length
      if (size > 32 * 1024 * 1024) {
        reject(new Error('Payload too large'))
        return
      }
      chunks.push(c)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

const ADMIN_PASSWORD = '1234'

function checkAuth(password) {
  return String(password ?? '').trim() === ADMIN_PASSWORD
}

function attachRoutes(server, { root }) {
  server.middlewares.use(async (req, res, next) => {
    const url = req.url?.split('?')[0] || ''
    if (!url.startsWith('/api/admin')) return next()

    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      res.end()
      return
    }

    try {
      if (req.method === 'GET' && url === '/api/admin/health') {
        send(res, 200, { ok: true, writable: true })
        return
      }

      const raw = req.method === 'GET' || req.method === 'HEAD' ? '{}' : await readBody(req)
      const body = raw ? JSON.parse(raw) : {}
      const submitted = body.password || req.headers['x-admin-password']
      if (!checkAuth(submitted)) {
        send(res, 401, { error: 'Wrong password.' })
        return
      }

      if (req.method === 'POST' && url === '/api/admin/login') {
        send(res, 200, { ok: true })
        return
      }

      if (req.method === 'GET' && url === '/api/admin/catalog') {
        send(res, 200, readCatalog(root))
        return
      }

      if (req.method === 'POST' && url === '/api/admin/service') {
        const incoming = body.service || {}
        const title = String(incoming.title || '').trim()
        if (!title) {
          send(res, 400, { error: 'Service name is required.' })
          return
        }
        let id = String(incoming.id || slugify(title))
        if (!ID_RE.test(id)) id = slugify(title)

        const catalog = readCatalog(root)
        const existing = catalog.services.find((s) => s.id === id)
        const packages = Array.isArray(incoming.packages)
          ? incoming.packages
              .filter((p) => p && String(p.name || '').trim() && Number(p.price) >= 0)
              .map((p, i) => ({
                id: String(p.id || `pkg-${i + 1}`),
                name: String(p.name).trim(),
                price: Number(p.price) || 0,
                sub: p.sub ? String(p.sub) : null,
                items: String(p.items || '')
                  .split('\n')
                  .map((x) => x.trim())
                  .filter(Boolean),
              }))
          : existing?.packages || []

        const dir = path.join(root, 'public/gallery/services', id)
        fs.mkdirSync(dir, { recursive: true })

        const removePhotos = Array.isArray(body.removePhotos) ? body.removePhotos : []
        for (const url of removePhotos) unlinkServicePhoto(dir, id, url)

        const photos = Array.isArray(body.photos) ? body.photos : []
        for (const photo of photos) {
          const ext = path.extname(String(photo.name || '')).toLowerCase() || '.jpg'
          if (!IMAGE_EXT.has(ext)) continue
          const buf = Buffer.from(String(photo.data || ''), 'base64')
          if (!buf.length || buf.length > MAX_PHOTO_BYTES) continue
          const used = new Set(fs.readdirSync(dir))
          let n = used.size + 1
          let filename = `${String(n).padStart(2, '0')}${ext === '.jpeg' ? '.jpg' : ext}`
          while (used.has(filename)) {
            n += 1
            filename = `${String(n).padStart(2, '0')}${ext === '.jpeg' ? '.jpg' : ext}`
          }
          fs.writeFileSync(path.join(dir, filename), buf)
        }

        const files = writeMeta(dir)
        const remaining = files.map((file) => `/gallery/services/${id}/${file}`)
        const cover = remaining.includes(incoming.image)
          ? incoming.image
          : remaining[0] || ''

        const saved = {
          id,
          title,
          icon: incoming.icon || existing?.icon || 'Camera',
          image: cover,
          blurb: String(incoming.blurb || '').trim(),
          quoteFlow: incoming.quoteFlow === 'brief' || incoming.quoteFlow === 'wedding'
            ? incoming.quoteFlow
            : 'packages',
          span: existing?.span || 'lg:row-span-2',
          locked: Boolean(existing?.locked),
          packageHint: incoming.packageHint != null
            ? String(incoming.packageHint)
            : (existing?.packageHint || ''),
          packages,
        }

        const idx = catalog.services.findIndex((s) => s.id === id)
        if (idx >= 0) catalog.services[idx] = { ...existing, ...saved, locked: existing.locked }
        else catalog.services.push(saved)

        writeCatalog(root, catalog)
        send(res, 200, { ok: true, service: saved, catalog })
        return
      }

      if (req.method === 'POST' && url === '/api/admin/service/delete') {
        const id = String(body.id || '')
        if (!ID_RE.test(id)) {
          send(res, 400, { error: 'Invalid service.' })
          return
        }
        const catalog = readCatalog(root)
        const existing = catalog.services.find((s) => s.id === id)
        if (!existing) {
          send(res, 404, { error: 'Service not found.' })
          return
        }
        catalog.services = catalog.services.filter((s) => s.id !== id)
        writeCatalog(root, catalog)
        send(res, 200, { ok: true, catalog })
        return
      }

      send(res, 404, { error: 'Unknown admin route.' })
    } catch (err) {
      send(res, 500, { error: err.message || 'Admin API failed.' })
    }
  })
}

export function adminApiPlugin({ root }) {
  return {
    name: 'blinksky-admin-api',
    configureServer(server) {
      attachRoutes(server, { root })
    },
    configurePreviewServer(server) {
      attachRoutes(server, { root })
    },
  }
}
