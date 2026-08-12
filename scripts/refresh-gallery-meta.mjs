/**
 * Rebuilds meta.json for local gallery folders from whatever image files
 * are present. Keeps existing caption/permalink/likes when the filename matches.
 *
 * Covers:
 *   public/gallery/instagram/
 *   public/gallery/selected-work/
 *   public/gallery/services/<category>/
 *
 * Usage: node scripts/refresh-gallery-meta.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const IMAGE_RE = /\.(jpe?g|png|webp)$/i

function listFolders() {
  const folders = ['instagram', 'selected-work']
  const servicesRoot = path.join(root, 'public/gallery/services')
  if (fs.existsSync(servicesRoot)) {
    for (const entry of fs.readdirSync(servicesRoot, { withFileTypes: true })) {
      if (entry.isDirectory()) folders.push(path.join('services', entry.name))
    }
  }
  return folders
}

function refresh(folder) {
  const dir = path.join(root, 'public/gallery', folder)
  fs.mkdirSync(dir, { recursive: true })

  let prev = []
  const metaPath = path.join(dir, 'meta.json')
  if (fs.existsSync(metaPath)) {
    try {
      prev = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
    } catch {
      prev = []
    }
  }
  const byFile = new Map(prev.map((m) => [m.file, m]))

  const files = fs
    .readdirSync(dir)
    .filter((f) => IMAGE_RE.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  const meta = files.map((file, i) => {
    const old = byFile.get(file) || {}
    return {
      file,
      id: old.id || `local-${folder.replace(/[\\/]/g, '-')}-${i + 1}`,
      caption: old.caption || '',
      permalink: old.permalink || 'https://instagram.com/',
      media_type: old.media_type || 'IMAGE',
      like_count: old.like_count || 0,
      comments_count: old.comments_count || 0,
    }
  })

  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2))
  console.log(`${folder}: ${meta.length} image(s) → meta.json`)
}

for (const folder of listFolders()) refresh(folder)
