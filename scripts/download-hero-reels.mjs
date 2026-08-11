/**
 * Downloads landscape Instagram videos for the hero background.
 * Usage: node scripts/download-hero-reels.mjs
 */
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'public/gallery/hero')

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
          reject(new Error(`HTTP ${res.statusCode}`))
        } else {
          resolve({ buf, headers: res.headers })
        }
      })
    })
    req.on('error', reject)
  })
}

/** Read width/height from an MP4 buffer (tkhd atom). */
function mp4Size(buf) {
  const len = buf.length
  let i = 0
  while (i + 8 <= len) {
    let size = buf.readUInt32BE(i)
    const type = buf.toString('ascii', i + 4, i + 8)
    if (size === 1 && i + 16 <= len) {
      size = Number(buf.readBigUInt64BE(i + 8))
    }
    if (size < 8) break
    if (type === 'moov' || type === 'trak' || type === 'mdia' || type === 'minf') {
      // recurse into container — walk children
      const end = Math.min(i + size, len)
      let j = i + 8
      while (j + 8 <= end) {
        let csize = buf.readUInt32BE(j)
        const ctype = buf.toString('ascii', j + 4, j + 8)
        if (csize === 1 && j + 16 <= end) csize = Number(buf.readBigUInt64BE(j + 8))
        if (csize < 8) break
        if (ctype === 'tkhd') {
          const ver = buf[j + 8]
          // v0: width/height at +76/+80; v1: +88/+92 (from atom start +8 for header... actually from after type)
          const base = j + 8
          const off = ver === 1 ? 88 : 76
          if (base + off + 8 <= len) {
            const w = buf.readUInt32BE(base + off) / 65536
            const h = buf.readUInt32BE(base + off + 4) / 65536
            if (w > 1 && h > 1) return { width: Math.round(w), height: Math.round(h) }
          }
        }
        if (ctype === 'moov' || ctype === 'trak' || ctype === 'mdia' || ctype === 'minf' || ctype === 'stbl') {
          // dive: handled by continuing scan of nested — flatten by scanning whole file for tkhd
        }
        j += csize
      }
    }
    if (type === 'tkhd') {
      const ver = buf[i + 8]
      const base = i + 8
      const off = ver === 1 ? 88 : 76
      if (base + off + 8 <= len) {
        const w = buf.readUInt32BE(base + off) / 65536
        const h = buf.readUInt32BE(base + off + 4) / 65536
        if (w > 1 && h > 1) return { width: Math.round(w), height: Math.round(h) }
      }
    }
    i += size
  }
  // brute-force scan for tkhd
  for (let k = 0; k + 12 < len; k++) {
    if (buf.toString('ascii', k, k + 4) === 'tkhd') {
      const ver = buf[k + 4]
      const off = ver === 1 ? 88 : 76
      // tkhd payload starts at k+4 (version), size is before 'tkhd' at k-4
      const base = k + 4
      if (base + off + 8 <= len) {
        const w = buf.readUInt32BE(base + off) / 65536
        const h = buf.readUInt32BE(base + off + 4) / 65536
        if (w > 16 && h > 16) return { width: Math.round(w), height: Math.round(h) }
      }
    }
  }
  return null
}

async function fetchAllPages(firstUrl) {
  const all = []
  let next = firstUrl
  while (next && all.length < 80) {
    const { buf } = await get(next)
    const json = JSON.parse(buf.toString('utf8'))
    if (json.error) throw new Error(json.error.message || 'IG API error')
    all.push(...(json.data || []))
    next = json.paging?.next ?? null
  }
  return all
}

const env = { ...loadEnv(path.join(root, '.env')), ...process.env }
const token = env.VITE_IG_ACCESS_TOKEN || env.IG_ACCESS_TOKEN || ''
const userId = env.VITE_IG_USER_ID || env.IG_USER_ID || 'me'
if (!token) {
  console.log('STATUS=no_credentials')
  process.exit(2)
}

const fields =
  'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,media_product_type'
const apiUrl = `https://graph.instagram.com/${encodeURIComponent(userId)}/media?fields=${fields}&limit=50&access_token=${encodeURIComponent(token)}`

console.log('STATUS=fetching')
const data = await fetchAllPages(apiUrl)
const videos = data.filter(
  (m) =>
    (m.media_type === 'VIDEO' || m.media_product_type === 'REELS') && m.media_url,
)
console.log(`STATUS=videos COUNT=${videos.length}`)

videos.sort(
  (a, b) =>
    (b.like_count || 0) + (b.comments_count || 0) * 2 -
    ((a.like_count || 0) + (a.comments_count || 0) * 2),
)

fs.mkdirSync(outDir, { recursive: true })
for (const f of fs.readdirSync(outDir)) {
  if (/\.(mp4|webm|json)$/i.test(f)) fs.unlinkSync(path.join(outDir, f))
}

const landscape = []
const portrait = []

for (const post of videos.slice(0, 25)) {
  try {
    const res = await get(post.media_url)
    const size = mp4Size(res.buf)
    const ratio = size ? size.width / size.height : null
    const entry = {
      id: post.id,
      likes: post.like_count || 0,
      comments: post.comments_count || 0,
      caption: (post.caption || '').slice(0, 80),
      permalink: post.permalink,
      width: size?.width || null,
      height: size?.height || null,
      bytes: res.buf.length,
      buf: res.buf,
    }
    console.log(
      `PROBE ${post.id} ${size ? `${size.width}x${size.height}` : 'unknown'} likes=${entry.likes} mb=${(res.buf.length / 1e6).toFixed(1)}`,
    )
    if (ratio && ratio >= 1.2) landscape.push(entry)
    else if (ratio && ratio < 1) portrait.push(entry)
    else portrait.push(entry) // unknown → treat carefully later
  } catch (e) {
    console.log(`FAIL ${post.id}: ${e.message}`)
  }
}

const picks = (landscape.length ? landscape : portrait).slice(0, 3)
if (!picks.length) {
  console.log('STATUS=none')
  process.exit(5)
}

const meta = []
let i = 0
for (const p of picks) {
  i += 1
  const name = `${String(i).padStart(2, '0')}.mp4`
  fs.writeFileSync(path.join(outDir, name), p.buf)
  meta.push({
    file: name,
    id: p.id,
    permalink: p.permalink,
    caption: p.caption,
    width: p.width,
    height: p.height,
    like_count: p.likes,
    comments_count: p.comments,
  })
  console.log(`SAVED ${name} ${p.width}x${p.height} likes=${p.likes}`)
}

fs.writeFileSync(path.join(outDir, 'meta.json'), JSON.stringify(meta, null, 2))
console.log(
  `STATUS=done LANDSCAPE=${landscape.length} PORTRAIT=${portrait.length} SAVED=${picks.length} MODE=${landscape.length ? 'landscape' : 'portrait-fallback'}`,
)
