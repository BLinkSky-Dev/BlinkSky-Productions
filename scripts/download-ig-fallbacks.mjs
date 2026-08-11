/**
 * Downloads current Instagram media into local fallback folders:
 *   public/gallery/instagram/      — recent posts
 *   public/gallery/selected-work/  — top by engagement
 *
 * Reads IG credentials from .env (never prints secrets).
 * Usage: node scripts/download-ig-fallbacks.mjs
 */
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function loadEnv(file) {
  if (!fs.existsSync(file)) return {}
  const out = {}
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!m) continue
    let v = m[2].trim()
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1)
    }
    out[m[1]] = v
  }
  return out
}

function get(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    const req = lib.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return get(res.headers.location).then(resolve, reject)
      }
      const chunks = []
      res.on('data', (c) => chunks.push(c))
      res.on('end', () => {
        const buf = Buffer.concat(chunks)
        if (res.statusCode && res.statusCode >= 400) {
          reject(
            new Error(
              `HTTP ${res.statusCode} ${buf.toString('utf8').slice(0, 200)}`,
            ),
          )
        } else {
          resolve({ buf, headers: res.headers, status: res.statusCode })
        }
      })
    })
    req.on('error', reject)
  })
}

function extFrom(url, contentType) {
  const u = (url || '').toLowerCase()
  if (u.includes('.png')) return '.png'
  if (u.includes('.webp')) return '.webp'
  if (contentType?.includes('png')) return '.png'
  if (contentType?.includes('webp')) return '.webp'
  return '.jpg'
}

async function fetchAllPages(firstUrl) {
  const all = []
  let next = firstUrl
  while (next) {
    const { buf } = await get(next)
    const json = JSON.parse(buf.toString('utf8'))
    if (json.error) throw new Error(json.error.message || 'IG API error')
    const page = (json.data || []).filter(
      (m) => m.media_type !== 'VIDEO' || m.thumbnail_url,
    )
    all.push(...page)
    next = json.paging?.next ?? null
    if (all.length >= 50) break
  }
  return all
}

async function saveSet(list, dir) {
  fs.mkdirSync(dir, { recursive: true })
  for (const f of fs.readdirSync(dir)) {
    if (/\.(jpe?g|png|webp)$/i.test(f) || f === 'meta.json') {
      fs.unlinkSync(path.join(dir, f))
    }
  }

  const meta = []
  let i = 0
  for (const post of list) {
    i += 1
    const src =
      post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url
    if (!src) continue
    try {
      const res = await get(src)
      const ext = extFrom(src, res.headers['content-type'])
      const name = `${String(i).padStart(2, '0')}${ext}`
      fs.writeFileSync(path.join(dir, name), res.buf)
      meta.push({
        file: name,
        id: String(post.id || `local-${i}`),
        caption: post.caption || '',
        permalink: post.permalink || 'https://instagram.com/',
        media_type: post.media_type === 'VIDEO' ? 'VIDEO' : 'IMAGE',
        like_count: post.like_count || 0,
        comments_count: post.comments_count || 0,
      })
      console.log(`SAVED ${path.relative(root, path.join(dir, name))}`)
    } catch (e) {
      console.log(`FAIL ${i}: ${e.message}`)
    }
  }
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(meta, null, 2))
  return meta.length
}

const env = { ...loadEnv(path.join(root, '.env')), ...process.env }
const token = env.VITE_IG_ACCESS_TOKEN || env.IG_ACCESS_TOKEN || ''
const userId = env.VITE_IG_USER_ID || env.IG_USER_ID || 'me'
const proxy = env.VITE_IG_PROXY_URL || ''

const fields =
  'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count'

let apiUrl = null
if (proxy && /^https?:\/\//i.test(proxy)) {
  apiUrl = `${proxy}${proxy.includes('?') ? '&' : '?'}limit=50`
} else if (token) {
  apiUrl = `https://graph.instagram.com/${encodeURIComponent(userId)}/media?fields=${fields}&limit=50&access_token=${encodeURIComponent(token)}`
}

if (!apiUrl) {
  console.log('STATUS=no_credentials')
  console.log(
    'Add VITE_IG_ACCESS_TOKEN (+ VITE_IG_USER_ID) to .env, then re-run this script.',
  )
  process.exit(2)
}

console.log('STATUS=fetching')
const data = await fetchAllPages(apiUrl)
console.log(`STATUS=got_posts COUNT=${data.length}`)
if (!data.length) {
  console.log('STATUS=empty')
  process.exit(5)
}

const recent = data.slice(0, 12)
const byEngagement = [...data]
  .sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
  .slice(0, 15)

const igDir = path.join(root, 'public/gallery/instagram')
const swDir = path.join(root, 'public/gallery/selected-work')

const nIg = await saveSet(recent, igDir)
const nSw = await saveSet(byEngagement, swDir)
console.log(`STATUS=done IG=${nIg} SELECTED=${nSw}`)
