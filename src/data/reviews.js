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
    author: 'Abi Shalini.',
    rating: 5,
    text: 'Excellent photography and very professional service. The quality, creativity, and attention to detail were outstanding. Truly happy with the results! Highly recommended. Best of luck santhosh ❤️',
  },
  {
    id: 'g2',
    author: 'Aishwarya Emma',
    rating: 5,
    text: 'I’ve done several shoots with Blink Production, and honestly, they’ve been amazing every single time! ❤️ The team is super friendly, professional, and easy to work with. The photos and videos always turn out so good, and they really know how to capture the best moments. Definitely one of my favourite teams to work with, and I’m looking forward to many more shoots together! ✨',
  },
  {
    id: 'g3',
    author: 'Thidu Thidushan',
    rating: 5,
    text: 'Good Quality output of our portraits... Highly recommended.',
  },
  {
    id: 'g5',
    author: 'Mohan Rajasegaran',
    rating: 5,
    text: 'Excellent photography ❤️',
    
  },
  {
    id: 'g6',
    author: 'Sandaruwan Bandara',
    rating: 5,
    text: 'Professional, on time, and genuinely creative. The pre-wedding frames look like a film still. Grateful we found them in Wattala.',
    
  },
  {
    id: 'g6',
    author: 'Abi Shalini',
    rating: 5,
    text: 'Excellent photography and very professional service. The quality, creativity, and attention to detail were outstanding. Truly happy with the results! Highly recommended. Best of luck santhosh ❤️',
    
  },
]
