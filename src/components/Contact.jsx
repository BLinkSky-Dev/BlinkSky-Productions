import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Instagram, Facebook, Youtube, Check, Pencil } from 'lucide-react'
import TikTok from './icons/TikTok'
import Reveal from './Reveal'
import { services } from '../data/services'
import { studio as STUDIO, whatsappLink, mapsLink } from '../data/socials'

/** WhatsApp glyph (lucide has no brand icons). */
function WhatsAppIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 15.71c-.25.7-1.44 1.33-2 1.42-.51.08-1.16.11-1.87-.12-.43-.14-.98-.32-1.69-.63-2.98-1.29-4.93-4.29-5.08-4.49-.15-.2-1.21-1.61-1.21-3.07 0-1.46.77-2.18 1.04-2.48.27-.3.59-.37.79-.37h.57c.18.01.43-.07.67.51.25.6.84 2.05.92 2.2.07.15.12.32.02.52-.1.2-.15.33-.3.5-.15.17-.32.39-.45.52-.15.14-.3.3-.13.6.18.3.77 1.27 1.65 2.05 1.13 1.01 2.08 1.32 2.38 1.47.29.14.47.12.64-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.08.12.08.71-.17 1.4z" />
    </svg>
  )
}

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    service: services[0].title,
    message: '',
  })
  const [ready, setReady] = useState(false) // show channel picker after submit
  const [igCopied, setIgCopied] = useState(false)

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  // One well-structured message, reused for every channel.
  const buildMessage = () =>
    `Hi BlinkSky Productions! I'd like to enquire about a shoot.\n\n` +
    `Name: ${form.name}\n` +
    `Service: ${form.service}\n` +
    `Email: ${form.email}\n\n` +
    `${form.message}`

  const handleSubmit = (e) => {
    e.preventDefault() // required fields are already validated by the browser
    setIgCopied(false)
    setReady(true)
  }

  const sendEmail = () => {
    const subject = encodeURIComponent(`Shoot enquiry: ${form.service}`)
    const body = encodeURIComponent(buildMessage())
    window.location.href = `mailto:${STUDIO.email}?subject=${subject}&body=${body}`
  }

  // Instagram can't pre-fill a DM, so copy the message and open the chat.
  const messageOnInstagram = async () => {
    try {
      await navigator.clipboard.writeText(buildMessage())
      setIgCopied(true)
    } catch {
      /* clipboard blocked â€” the DM still opens, they can type it */
    }
  }

  const inputBase =
    'w-full rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-cloud placeholder:text-cloud/35 ' +
    'transition-colors duration-300 focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne'

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Left: pitch + details */}
        <div>
          <Reveal>
            <p className="eyebrow mb-4">Let&apos;s Create</p>
            <h2 className="font-serif text-4xl leading-tight text-cloud sm:text-5xl">
              Have a moment worth keeping? Let&apos;s talk.
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-cloud/65">
              Tell us about your shoot: the date, the setting, what you're after. We'll get back within 24 hours with availability and a quote.
            </p>

            {/* Branches */}
            <div className="mt-6 space-y-3">
              {/* Main branch */}
              <div className="flex items-start gap-2.5">
                <MapPin size={18} className="mt-0.5 shrink-0 text-champagne" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-cloud font-medium">Wattala</span>
                    <span className="rounded-full bg-champagne/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-champagne">
                      Main
                    </span>
                  </div>
                  <a
                    href={mapsLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-block text-sm text-cloud/50 underline-offset-4
                               transition-colors hover:text-champagne hover:underline"
                  >
                    {STUDIO.address}
                  </a>
                </div>
              </div>

              {/* Other branches */}
              {['Dehiwela', 'Badulla', 'Bibila'].map((branch) => (
                <div key={branch} className="flex items-center gap-2.5">
                  <MapPin size={18} className="shrink-0 text-cloud/30" />
                  <span className="text-cloud/65">{branch}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Contact channels â€” icons; labels live in aria-label/title. */}
          <Reveal delay={0.1}>
            <ul className="mt-6 flex flex-wrap gap-3">
              {[
                { icon: Mail, href: `mailto:${STUDIO.email}`, label: STUDIO.email },
                {
                  icon: Instagram,
                  href: STUDIO.instagram,
                  label: `@${STUDIO.instagramHandle} on Instagram`,
                  external: true,
                },
                {
                  icon: Facebook,
                  href: STUDIO.facebook,
                  label: 'BlinkSky Productions on Facebook',
                  external: true,
                },
                {
                  icon: TikTok,
                  href: STUDIO.tiktok,
                  label: '@blinkskyproduction on TikTok',
                  external: true,
                },
                {
                  icon: Youtube,
                  href: STUDIO.youtube,
                  label: 'BLINKSKY Production on YouTube',
                  external: true,
                },
              ].map(({ icon: Icon, href, label, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    title={label}
                    aria-label={label}
                    {...(external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="flex h-12 w-12 items-center justify-center rounded-full border
                               border-ink-600 text-cloud/75 transition-all duration-300 ease-smooth
                               hover:border-champagne hover:text-champagne active:scale-90"
                  >
                    <Icon size={19} />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Right: form â†’ channel picker */}
        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-ink-700 bg-ink-900/50 p-6 sm:p-8">
            {!ready ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-5"
                >
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm text-cloud/70">
                      Your name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={update('name')}
                      placeholder="Jane Perera"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm text-cloud/70">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={update('email')}
                      placeholder="you@email.com"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="mb-2 block text-sm text-cloud/70">
                      What are you after?
                    </label>
                    <select
                      id="service"
                      value={form.service}
                      onChange={update('service')}
                      className={inputBase}
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.title} className="bg-ink-900">
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm text-cloud/70">
                      Tell us about it
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      value={form.message}
                      onChange={update('message')}
                      placeholder="Date, location, and the story you want to capture."
                      className={`${inputBase} resize-none`}
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    Contact Us
                  </button>
                  <p className="text-center text-xs text-cloud/40">
                    Next, pick how to send it: WhatsApp, Instagram or email.
                  </p>
                </motion.form>
              ) : (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-1 flex items-center gap-2 text-champagne">
                    <Check size={18} />
                    <span className="font-serif text-xl text-cloud">
                      Your enquiry is ready
                    </span>
                  </div>
                  <p className="mb-5 text-sm text-cloud/55">
                    Send it whichever way suits you, {form.name.split(' ')[0] || 'there'}.
                    It&apos;s already written for you.
                  </p>

                  {/* Message preview */}
                  <pre className="mb-5 max-h-40 overflow-auto whitespace-pre-wrap rounded-xl border border-ink-700 bg-ink-950/50 p-4 font-sans text-xs leading-relaxed text-cloud/70">
                    {buildMessage()}
                  </pre>

                  <div className="grid gap-3">
                    <a
                      href={whatsappLink(buildMessage())}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full
                                 bg-[#25D366] px-6 text-sm font-semibold text-ink-950
                                 transition-all duration-300 hover:brightness-110 active:scale-95 cursor-pointer"
                    >
                      <WhatsAppIcon size={18} /> Send on WhatsApp
                    </a>

                    <button
                      type="button"
                      onClick={sendEmail}
                      className="btn-ghost w-full"
                    >
                      <Mail size={16} /> Send by Email
                    </button>

                    <a
                      href={`https://ig.me/m/${STUDIO.instagramHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={messageOnInstagram}
                      className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full
                                 border border-champagne/50 px-6 text-sm font-medium text-champagne
                                 transition-all duration-300 hover:bg-champagne hover:text-ink-950
                                 active:scale-95 cursor-pointer"
                    >
                      <Instagram size={17} /> Message on Instagram
                    </a>
                  </div>

                  {igCopied && (
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-[#25D366]">
                      <Check size={13} /> Message copied â€” paste it into the Instagram
                      chat.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setReady(false)}
                    className="mt-5 inline-flex items-center gap-1.5 text-xs text-cloud/50 underline-offset-4 hover:text-cloud hover:underline"
                  >
                    <Pencil size={12} /> Edit details
                  </button>
                </motion.div>
              )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}


