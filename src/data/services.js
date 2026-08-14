import {
  Camera,
  Heart,
  Gem,
  Cake,
  GraduationCap,
  Shirt,
  Sun,
} from 'lucide-react'

/** Casual Shoots — photos + one 30–60 sec reel. Shared with the quote wizard. */
export const casualPackages = [
  { photos: 10, price: 8000 },
  { photos: 15, price: 11000 },
  { photos: 20, price: 14000 },
]

/**
 * What We Shoot accordion categories.
 *
 * Photos live in per-category folders:
 *   public/gallery/services/<id>/01.jpg, 02.jpg, …
 * Drop files there, then run `npm run gallery:refresh`.
 * `01.jpg` is the accordion thumb / cover (`image` below).
 * Expanded galleries load from each folder’s meta.json.
 */
export const services = [
  {
    id: 'wedding',
    title: 'Wedding Photography',
    icon: Heart,
    image: '/gallery/services/wedding/01.jpg',
    blurb:
      'Full-day coverage of the vows, the tears, the dance floor. Photos and film built to last the distance.',
    tags: [],
  },
  {
    id: 'bridal',
    title: 'Bridal Portraits',
    icon: Gem,
    image: '/gallery/services/bridal/01.jpg',
    blurb:
      'The dress, the details, that quiet moment before it all begins. Portraits with an editorial edge that hold up years later.',
    tags: [],
  },
  {
    id: 'model',
    title: 'Model Photography',
    icon: Camera,
    image: '/gallery/services/model/01.jpg',
    blurb:
      'Portfolio and editorial work that makes the camera pay attention. Studio or location, whatever the look needs.',
    tags: [],
  },
  {
    id: 'casual',
    title: 'Casual Shoots',
    icon: Sun,
    image: '/gallery/services/casual/01.jpg',
    blurb:
      'Casual shoots are a great way to capture your everyday moments. We can shoot at your home, office, or any other location you choose. We can also shoot at our studio if you prefer.',
    tags: [],
  },
  {
    id: 'birthday',
    title: 'Birthday Photography',
    icon: Cake,
    image: '/gallery/services/birthday/01.jpg',
    blurb:
      'Candid, colourful coverage that actually captures the room. The kind you come back to years later.',
    tags: [],
  },
  {
    id: 'commercial',
    title: 'Clothing Photography',
    icon: Shirt,
    image: '/gallery/services/commercial/02.jpg',
    objectPosition: 'object-center',
    blurb:
      'Lookbooks, garments and campaign frames built to sell the clothes. Studio or location, made to look right on every screen.',
    tags: [],
  },
  {
    id: 'graduation',
    title: 'Graduation Portraits',
    icon: GraduationCap,
    image: '/gallery/services/graduation/01.jpg',
    blurb:
      'Cap, gown and the whole day around it. Solo portraits and group shots worth printing.',
    tags: [],
  },
]

/** Public URL base for a service category folder. */
export function serviceGalleryBase(id) {
  return `/gallery/services/${id}`
}
