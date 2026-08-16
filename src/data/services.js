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
      'Full-day photo and film for the ceremony, reception and everything in between.',
    tags: [],
  },
  {
    id: 'bridal',
    title: 'Bridal Portraits',
    icon: Gem,
    image: '/gallery/services/bridal/01.jpg',
    blurb:
      'Quiet portraits of the dress, jewellery and the hour before the ceremony.',
    tags: [],
  },
  {
    id: 'model',
    title: 'Model Photography',
    icon: Camera,
    image: '/gallery/services/model/01.jpg',
    blurb:
      'Portfolio and editorial work for models and brands — studio or on location.',
    tags: [],
  },
  {
    id: 'casual',
    title: 'Casual Shoots',
    icon: Sun,
    image: '/gallery/services/casual/01.jpg',
    blurb:
      'Relaxed portraits at home, at the office or in studio — plus a short reel if you want one.',
    tags: [],
  },
  {
    id: 'birthday',
    title: 'Birthday Photography',
    icon: Cake,
    image: '/gallery/services/birthday/01.jpg',
    blurb:
      'Candid coverage of the party — the people, the cake, the room.',
    tags: [],
  },
  {
    id: 'commercial',
    title: 'Clothing Photography',
    icon: Shirt,
    image: '/gallery/services/commercial/02.jpg',
    objectPosition: 'object-center',
    blurb:
      'Lookbooks, garments and campaign shots for clothing brands — studio or location.',
    tags: [],
  },
  {
    id: 'graduation',
    title: 'Graduation Portraits',
    icon: GraduationCap,
    image: '/gallery/services/graduation/01.jpg',
    blurb:
      'Cap, gown and the day around it — solo portraits and group shots ready to print.',
    tags: [],
  },
]

/** Public URL base for a service category folder. */
export function serviceGalleryBase(id) {
  return `/gallery/services/${id}`
}
