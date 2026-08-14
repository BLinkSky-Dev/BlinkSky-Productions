/**
 * Fallback catalog if /data/services-catalog.json cannot be loaded.
 * The live list lives in public/data/services-catalog.json and is edited
 * from the admin panel (/#admin) while `npm run dev` is running.
 */
export const fallbackServices = [
  {
    id: 'wedding',
    title: 'Wedding Photography',
    icon: 'Heart',
    image: '/gallery/services/wedding/01.jpg',
    blurb:
      'Full-day coverage of the vows, the tears, the dance floor. Photos and film built to last the distance.',
    quoteFlow: 'wedding',
    span: 'lg:col-span-2 lg:row-span-2',
    packages: [],
  },
  {
    id: 'bridal',
    title: 'Bridal Portraits',
    icon: 'Gem',
    image: '/gallery/services/bridal/01.jpg',
    blurb:
      'The dress, the details, that quiet moment before it all begins. Portraits with an editorial edge that hold up years later.',
    quoteFlow: 'packages',
    span: 'lg:row-span-2',
    packageHint: '30–60 sec reel included with every package.',
    packages: [
      { id: '10', name: '10 Photos', price: 10000, items: ['30–60 sec reel included'] },
      { id: '15', name: '15 Photos', price: 13500, items: ['30–60 sec reel included'] },
      { id: '20', name: '20 Photos', price: 18000, items: ['30–60 sec reel included'] },
    ],
  },
  {
    id: 'model',
    title: 'Model Photography',
    icon: 'Camera',
    image: '/gallery/services/model/01.jpg',
    blurb:
      'Portfolio and editorial work that makes the camera pay attention. Studio or location, whatever the look needs.',
    quoteFlow: 'packages',
    span: 'lg:row-span-2',
    packageHint: '30–60 sec reel included with every package.',
    packages: [
      { id: '10', name: '10 Photos', price: 10000, items: ['30–60 sec reel included'] },
      { id: '15', name: '15 Photos', price: 13500, items: ['30–60 sec reel included'] },
      { id: '20', name: '20 Photos', price: 18000, items: ['30–60 sec reel included'] },
    ],
  },
  {
    id: 'casual',
    title: 'Casual Shoots',
    icon: 'Sun',
    image: '/gallery/services/casual/01.jpg',
    blurb:
      'Casual shoots are a great way to capture your everyday moments. We can shoot at your home, office, or any other location you choose. We can also shoot at our studio if you prefer.',
    quoteFlow: 'packages',
    span: 'lg:col-span-2 lg:row-span-2',
    packageHint: '30–60 sec reel included with every package.',
    packages: [
      { id: '10', name: '10 Photos', price: 8000, items: ['30–60 sec reel included'] },
      { id: '15', name: '15 Photos', price: 11000, items: ['30–60 sec reel included'] },
      { id: '20', name: '20 Photos', price: 14000, items: ['30–60 sec reel included'] },
    ],
  },
  {
    id: 'birthday',
    title: 'Birthday Photography',
    icon: 'Cake',
    image: '/gallery/services/birthday/01.jpg',
    blurb:
      'Candid, colourful coverage that actually captures the room. The kind you come back to years later.',
    quoteFlow: 'packages',
    span: 'lg:row-span-2',
    packages: [],
  },
  {
    id: 'commercial',
    title: 'Clothing Photography',
    icon: 'Shirt',
    image: '/gallery/services/commercial/02.jpg',
    objectPosition: 'object-center',
    blurb:
      'Lookbooks, garments and campaign frames built to sell the clothes. Studio or location, made to look right on every screen.',
    quoteFlow: 'brief',
    span: 'lg:col-span-2 lg:row-span-2',
    packages: [],
  },
  {
    id: 'graduation',
    title: 'Graduation Portraits',
    icon: 'GraduationCap',
    image: '/gallery/services/graduation/01.jpg',
    blurb:
      'Cap, gown and the whole day around it. Solo portraits and group shots worth printing.',
    quoteFlow: 'packages',
    span: 'lg:row-span-2',
    packages: [
      { id: 'g7', name: 'LKR 7,000', price: 7000, items: [] },
      { id: 'g10', name: 'LKR 10,000', price: 10000, items: [] },
      { id: 'g12', name: 'LKR 12,000', price: 12000, items: [] },
      { id: 'g15', name: 'LKR 15,000', price: 15000, items: [] },
    ],
  },
]

/** Public URL base for a service category folder. */
export function serviceGalleryBase(id) {
  return `/gallery/services/${id}`
}
