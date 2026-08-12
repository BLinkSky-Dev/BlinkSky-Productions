import {
  Camera,
  Heart,
  Gem,
  Building2,
  Cake,
  GraduationCap,
} from 'lucide-react'

/**
 * Each service powers the What We Shoot accordion.
 * `image` is the header thumb; `gallery` opens under the panel when expanded.
 */
export const services = [
  {
    id: 'wedding',
    title: 'Wedding Photography',
    icon: Heart,
    image: '/gallery/services/wedding.jpg',
    blurb:
      'Full-day coverage of the vows, the tears, the dance floor. Photos and film built to last the distance.',
    tags: [],
    gallery: [
      '/gallery/services/wedding.jpg',
      '/gallery/selected-work/01.jpg',
      '/gallery/selected-work/10.jpg',
      '/gallery/selected-work/13.jpg',
      '/gallery/selected-work/15.jpg',
    ],
  },
  {
    id: 'bridal',
    title: 'Bridal Portraits',
    icon: Gem,
    image: '/gallery/services/bridal.jpg',
    blurb:
      'The dress, the details, that quiet moment before it all begins. Portraits with an editorial edge that hold up years later.',
    tags: [],
    gallery: [
      '/gallery/services/bridal.jpg',
      '/gallery/selected-work/02.jpg',
      '/gallery/selected-work/04.jpg',
      '/gallery/selected-work/07.jpg',
      '/gallery/selected-work/11.jpg',
      '/gallery/selected-work/12.jpg',
    ],
  },
  {
    id: 'model',
    title: 'Model Photography',
    icon: Camera,
    image: '/gallery/services/model.jpg',
    blurb:
      'Portfolio and editorial work that makes the camera pay attention. Studio or location, whatever the look needs.',
    tags: [],
    gallery: [
      '/gallery/services/model.jpg',
      '/gallery/selected-work/06.jpg',
      '/gallery/selected-work/09.jpg',
      '/gallery/selected-work/14.jpg',
    ],
  },
  {
    id: 'birthday',
    title: 'Birthday Photography',
    icon: Cake,
    image: '/gallery/services/birthday.jpg',
    blurb:
      'Candid, colourful coverage that actually captures the room. The kind you come back to years later.',
    tags: [],
    gallery: [
      '/gallery/services/birthday.jpg',
      '/gallery/selected-work/03.jpg',
      '/gallery/selected-work/08.jpg',
      '/gallery/instagram/03.jpg',
    ],
  },
  {
    id: 'commercial',
    title: 'Commercial Photography & Events',
    icon: Building2,
    image: '/gallery/services/commercial.jpg',
    objectPosition: 'object-center',
    blurb:
      'Product, brand and campaign photography built to sell. Clean, considered, and made to look right on every screen.',
    tags: [],
    gallery: [
      '/gallery/services/commercial.jpg',
      '/gallery/selected-work/05.jpg',
      '/gallery/instagram/05.jpg',
      '/gallery/instagram/10.jpg',
    ],
  },
  {
    id: 'graduation',
    title: 'Graduation Portraits',
    icon: GraduationCap,
    image: '/gallery/services/graduation.jpg',
    blurb:
      'Cap, gown and the whole day around it. Solo portraits and group shots worth printing.',
    tags: [],
    gallery: [
      '/gallery/services/graduation.jpg',
      '/gallery/instagram/01.jpg',
      '/gallery/instagram/07.jpg',
      '/gallery/instagram/11.jpg',
    ],
  },
]
