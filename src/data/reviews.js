import { mapsLink } from './socials'

/**
 * Google Business / reviews config.
 *
 * Live sync (optional): set server env GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID
 * and VITE_GOOGLE_REVIEWS_PROXY_URL=/api/google-reviews — see api/google-reviews.js.
 *
 * Without the API, the site shows `fallbackReviews` below. Edit those to match
 * real Google reviews, and set placeId so “Leave a review” / “See all” deep-link
 * to the right Business Profile.
 */
export const googleBusiness = {
  /** Google Place ID (from Google Maps → Share / Place ID finder). */
  placeId: typeof import.meta !== 'undefined'
    ? import.meta.env.VITE_GOOGLE_PLACE_ID || ''
    : '',
  /**
   * Optional direct Maps / GBP URL. When empty we fall back to a search on the
   * studio address (mapsLink).
   */
  profileUrl: '',
  /** Shown when the Places API is unavailable. Keep in sync with Google. */
  rating: 5,
  reviewCount: 8,
}

/** Deep link to leave a review on Google (needs placeId). */
export function writeGoogleReviewUrl() {
  const id = googleBusiness.placeId
  if (id) return `https://search.google.com/local/writereview?placeid=${id}`
  return googleProfileUrl()
}

/** Open the Google Business / Maps listing. */
export function googleProfileUrl() {
  if (googleBusiness.profileUrl) return googleBusiness.profileUrl
  if (googleBusiness.placeId) {
    return `https://www.google.com/maps/place/?q=place_id:${googleBusiness.placeId}`
  }
  return mapsLink()
}

/**
 * Curated Google reviews used when the Places API isn’t configured.
 * Replace with copy from your Google Business Profile as new reviews come in.
 */
export const fallbackReviews = [
  {
    id: 'g1',
    author: 'Ahamed Hamdhan.',
    rating: 5,
    text: 'Perfect wedding photos and videos. Highly recommended.',
  },
  {
    id: 'g2',
    author: 'Praveen dev',
    rating: 5,
    text: 'Had a recent photoshoot and turned out very nice. Appreciate the photographer\'s skill and timeliness.',
  },
  {
    id: 'g3',
    author: 'Thidu Thidushan',
    rating: 5,
    text: 'Good Quality output of our portraits... Highly recommended.',
  },
  {
    id: 'g4',
    author: 'Dewmini Ruston',
    rating: 5,
    text: 'Good quality work',
   
  },
  {
    id: 'g5',
    author: 'master fragrance',
    rating: 5,
    text: 'From engagement to the wedding day, BlinkSky captured every quiet moment and every celebration. Family keeps asking who shot our photos.',
    
  },
  {
    id: 'g6',
    author: 'Sandaruwan Bandara',
    rating: 5,
    text: 'Professional, on time, and genuinely creative. The pre-wedding frames look like a film still. Grateful we found them in Wattala.',
    
  },
]
