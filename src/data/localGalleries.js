/**
 * Local gallery fallbacks for when the Instagram API is unavailable.
 *
 * Drop images into:
 *   public/gallery/selected-work/   → Selected Work section
 *   public/gallery/instagram/       → Latest on Instagram section
 *
 * Prefer numbered files (01.jpg, 02.jpg, …). Optional meta.json (written by
 * `node scripts/download-ig-fallbacks.mjs` or `node scripts/refresh-gallery-meta.mjs`)
 * carries captions, permalinks and engagement counts.
 */

export const GALLERY = {
  selectedWork: 'selected-work',
  instagram: 'instagram',
}

/**
 * @param {'selected-work' | 'instagram'} folder
 * @param {number} [limit]
 * @returns {Promise<Array<object>>}
 */
export async function loadLocalPosts(folder, limit = 12) {
  const base = `/gallery/${folder}`
  try {
    const res = await fetch(`${base}/meta.json`, { cache: 'no-store' })
    if (!res.ok) return []
    const meta = await res.json()
    if (!Array.isArray(meta) || !meta.length) return []

    return meta.slice(0, limit).map((m, i) => {
      const file = m.file
      const src = `${base}/${file}`
      const isVideo = m.media_type === 'VIDEO' || m.media_type === 'REELS'
      return {
        id: String(m.id || `local-${folder}-${i}`),
        media_type: isVideo ? 'VIDEO' : 'IMAGE',
        media_url: src,
        thumbnail_url: isVideo ? src : undefined,
        permalink: m.permalink || 'https://instagram.com/',
        caption: m.caption || '',
        like_count: m.like_count || 0,
        comments_count: m.comments_count || 0,
      }
    })
  } catch {
    return []
  }
}
