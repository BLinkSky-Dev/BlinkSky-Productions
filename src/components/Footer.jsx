import { Instagram, Facebook, Youtube, Phone } from 'lucide-react'
import TikTok from './icons/TikTok'
import Logo from './Logo'
import { studio, developer, developerWhatsappLink } from '../data/socials'

const nav = [
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#instagram', label: 'Instagram' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

const socials = [
  {
    icon: Phone,
    href: `tel:${studio.phone.replace(/\s/g, '')}`,
    label: `Call ${studio.phone}`,
    external: false,
  },
  { icon: Instagram, href: studio.instagram, label: 'Instagram', external: true },
  { icon: Facebook, href: studio.facebook, label: 'Facebook', external: true },
  { icon: TikTok, href: studio.tiktok, label: 'TikTok', external: true },
  { icon: Youtube, href: studio.youtube, label: 'YouTube', external: true },
]

export default function Footer() {
  return (
    <footer className="border-t border-ink-700 bg-ink-950 py-14">
      <div className="container-x">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:items-center">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Logo size="lg" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cloud/50">
              Photography &amp; videography studio. We frame the moments worth
              keeping.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6">
            {nav.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="inline-flex min-h-[44px] items-center text-sm text-cloud/60
                           transition-colors hover:text-champagne active:text-champagne"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex gap-3">
            {socials.map((s) => {
              const Icon = s.icon
              return (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  {...(s.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 text-cloud/70 transition-all hover:border-champagne hover:text-champagne"
                >
                  <Icon size={18} />
                </a>
              )
            })}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-ink-800 pt-6 text-xs text-cloud/40 sm:flex-row">
          <p>© {new Date().getFullYear()} BlinkSky Productions. All rights reserved.</p>
          <p>
            Developed by{' '}
            <a
              href={developerWhatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cloud/60 underline-offset-4 transition-colors hover:text-champagne hover:underline"
            >
              {developer.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
