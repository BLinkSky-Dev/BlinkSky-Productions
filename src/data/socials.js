// Single source of truth for the studio's contact + social links.
// Update these and every section (nav, feed, contact, footer, CTAs) follows.
export const studio = {
  email: 'blinkskyproduction@gmail.com',
  phone: '+94 76 004 7671',
  // Digits only, with country code and no +, spaces or dashes, used for wa.me links.
  // 0760047671 → drop the leading 0, prefix 94 (Sri Lanka).
  whatsapp: '94760047671',
  // Short label for tight spaces, the cities covered, and the main studio address.
  location: 'Wattala, Sri Lanka',
  locations: ['Wattala', 'Bibila', 'Dehiwela', 'Badulla'],
  address: 'Palliyawatta Rd, Wattala 11300, Sri Lanka',
  /** Branch studios. `maps` is optional — when set, the name links out to Google Maps. */
  branches: [
    {
      name: 'Wattala',
      main: true,
      address: 'Palliyawatta Rd, Wattala 11300, Sri Lanka',
      maps: null, // resolved via mapsLink() from address
    },
    {
      name: 'Bibila',
      main: false,
      address: 'Main Street, Bibile, Sri Lanka, 91500',
      maps: 'https://maps.app.goo.gl/oRX9pbibKrvcSF3d7?g_st=awb',
    },
    { name: 'Dehiwela', main: false, maps: null },
    { name: 'Badulla', main: false, maps: null },
  ],
  instagramHandle: 'blink_sky_production',
  instagram: 'https://www.instagram.com/blink_sky_production',
  facebook: 'https://www.facebook.com/share/19CaU4mRox/',
  tiktok: 'https://www.tiktok.com/@blinkskyproduction',
  youtube: 'https://www.youtube.com/@BLINKSKYProduction',
}

/** Build a WhatsApp deep link with a pre-filled message. */
export function whatsappLink(message = "Hi BlinkSky! I'd like to enquire about a shoot.") {
  return `https://wa.me/${studio.whatsapp}?text=${encodeURIComponent(message)}`
}

/** Google Maps link for the main studio address. */
export function mapsLink() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(studio.address)}`
}

// Who built the website (footer credit). WhatsApp digits: 0760484612 → 94760484612.
export const developer = {
  name: 'B.Dev & BlinkSky Media',
  whatsapp: '94760484612',
}

/** WhatsApp link to the website's developer. */
export function developerWhatsappLink(
  message = "Hi! I saw the BlinkSky website and I'd like to enquire about a website.",
) {
  return `https://wa.me/${developer.whatsapp}?text=${encodeURIComponent(message)}`
}
