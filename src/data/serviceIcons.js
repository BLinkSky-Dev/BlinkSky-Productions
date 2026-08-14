import {
  Aperture,
  Baby,
  Camera,
  Cake,
  Flower2,
  Gem,
  GraduationCap,
  Heart,
  Shirt,
  Sparkles,
  Sun,
  Users,
} from 'lucide-react'

export const SERVICE_ICONS = {
  Heart,
  Gem,
  Camera,
  Sun,
  Cake,
  Shirt,
  GraduationCap,
  Users,
  Sparkles,
  Aperture,
  Flower2,
  Baby,
}

export const ICON_NAMES = Object.keys(SERVICE_ICONS)

export function iconFor(name) {
  return SERVICE_ICONS[name] || Camera
}

export function withIcons(list = []) {
  return list.map((s) => ({ ...s, icon: iconFor(s.icon) }))
}
