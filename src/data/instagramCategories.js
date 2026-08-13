/**
 * Turning Instagram posts into categories.
 *
 * IMPORTANT: the Instagram Graph API returns no category, tag or album field
 * only the caption text. So the only thing we can classify on is what you write
 * in the caption (hashtags or plain words).
 *
 * That means categorisation is only as good as your captioning habit: post a
 * bridal shoot with #bridal (or just the word "bridal") and it lands in Bridal.
 * A post matching nothing falls back to `fallback` below.
 *
 * Rules are matched case-insensitively against the whole caption, with or
 * without a leading '#'. First category with a hit wins, so order matters
 * put the more specific ones first (bridal before wedding).
 */

export const categoryRules = [
  {
    id: 'bridal',
    label: 'Bridal',
    keywords: ['bridal', 'bride', 'bridalshoot', 'gettingready', 'bridalportrait'],
  },
  {
    id: 'wedding',
    label: 'Wedding',
    keywords: ['wedding', 'weddingday', 'weddingshoot', 'nikah', 'homecoming', 'engagement', 'vows'],
  },
  {
    id: 'casual',
    label: 'Casual',
    keywords: ['casual', 'casualshoot', 'lifestyle', 'everyday'],
  },
  {
    id: 'model',
    label: 'Model',
    keywords: ['model', 'modelshoot', 'portfolio', 'editorial', 'fashion', 'portrait'],
  },
  {
    id: 'commercial',
    label: 'Commercial',
    keywords: ['commercial', 'brand', 'product', 'campaign', 'advertising', 'corporate'],
  },
  {
    id: 'birthday',
    label: 'Birthday',
    keywords: ['birthday', 'bday', 'firstbirthday', 'cakesmash', 'party'],
  },
  {
    id: 'comingofage',
    label: 'Coming of Age',
    keywords: ['pubertyceremony', 'puberty', 'comingofage', 'samayasadangu', 'ritual', 'ceremony'],
  },
  {
    id: 'video',
    label: 'Film',
    keywords: ['reel', 'film', 'cinematic', 'video', 'videography', 'teaser', 'highlight'],
  },
]

/** Posts that match nothing still need a home. */
export const fallback = { id: 'other', label: 'More Work' }

/**
 * FEATURE FLAG.
 *
 * false (current): sort posts only by media type, Reels vs Posts. Use this
 *   until captions carry hashtags, since there's nothing else to sort on.
 * true (future): once posts are captioned with tags like #wedding / #bridal,
 *   flip this to sort into the shoot-type categories defined in categoryRules
 *   above. Nothing else needs changing.
 */
export const USE_CAPTION_CATEGORIES = false

/**
 * Work out a category. Returns { id, label }, never null, so the UI always
 * has something to show.
 */
export function categorise(caption = '', mediaType = '') {
  // Simple mode: just Reels vs Posts, by media type.
  if (!USE_CAPTION_CATEGORIES) {
    return mediaType === 'VIDEO'
      ? { id: 'reel', label: 'Reels' }
      : { id: 'post', label: 'Posts' }
  }

  // Caption mode (for when hashtags are in use).
  const text = (caption || '').toLowerCase()
  for (const rule of categoryRules) {
    const hit = rule.keywords.some((k) => {
      // Match '#keyword' or the bare word on a word boundary.
      const re = new RegExp(`(^|[^a-z0-9])#?${k}([^a-z0-9]|$)`, 'i')
      return re.test(text)
    })
    if (hit) return { id: rule.id, label: rule.label }
  }
  if (mediaType === 'VIDEO') return { id: 'video', label: 'Film' }
  return fallback
}
