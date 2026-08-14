import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Check, Plus, Trash2, Upload } from 'lucide-react'
import { ICON_NAMES, iconFor } from '../data/serviceIcons'
import { SERVICES_UPDATED } from '../hooks/useServices'

const SESSION_KEY = 'blinksky-admin-pw'

const emptyForm = () => ({
  id: '',
  title: '',
  blurb: '',
  icon: 'Camera',
  quoteFlow: 'packages',
  packageHint: '',
  packages: [{ id: 'pkg-1', name: '', price: '', sub: '', items: '' }],
})

function filesToPayload(fileList) {
  const files = [...fileList]
  return Promise.all(
    files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            const result = String(reader.result || '')
            const data = result.includes(',') ? result.split(',')[1] : result
            resolve({ name: file.name, data })
          }
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(file)
        }),
    ),
  )
}

async function adminFetch(path, password, payload = {}) {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': password,
    },
    body: JSON.stringify({ password, ...payload }),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`)
  return json
}

function toForm(service) {
  return {
    id: service.id,
    title: service.title || '',
    blurb: service.blurb || '',
    icon: service.icon || 'Camera',
    quoteFlow: service.quoteFlow || 'packages',
    packageHint: service.packageHint || '',
    packages: (service.packages || []).length
      ? service.packages.map((p) => ({
          id: p.id,
          name: p.name || '',
          price: p.price ?? '',
          sub: p.sub || '',
          items: Array.isArray(p.items) ? p.items.join('\n') : '',
        }))
      : [{ id: 'pkg-1', name: '', price: '', sub: '', items: '' }],
  }
}

export default function AdminPage() {
  const [password, setPassword] = useState(() => sessionStorage.getItem(SESSION_KEY) || '')
  const [pwInput, setPwInput] = useState('')
  const [authed, setAuthed] = useState(false)
  const [catalog, setCatalog] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [photos, setPhotos] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [health, setHealth] = useState(null)

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  useEffect(() => {
    fetch('/api/admin/health')
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth({ ok: false, writable: false }))
  }, [])

  useEffect(() => {
    if (!password) return
    adminFetch('/api/admin/login', password)
      .then(async () => {
        setAuthed(true)
        sessionStorage.setItem(SESSION_KEY, password)
        const data = await fetch(`/data/services-catalog.json?t=${Date.now()}`, { cache: 'no-store' }).then((r) => r.json())
        setCatalog(Array.isArray(data.services) ? data.services : [])
      })
      .catch((err) => {
        setAuthed(false)
        sessionStorage.removeItem(SESSION_KEY)
        setPassword('')
        setError(err.message)
      })
  }, [password])

  const startCreate = () => {
    setEditing('new')
    setForm(emptyForm())
    setPhotos([])
    setError('')
    setNotice('')
  }

  const startEdit = (service) => {
    setEditing(service.id)
    setForm(toForm(service))
    setPhotos([])
    setError('')
    setNotice('')
  }

  const addPackage = () => {
    setForm((f) => ({
      ...f,
      packages: [...f.packages, { id: `pkg-${f.packages.length + 1}`, name: '', price: '', sub: '', items: '' }],
    }))
  }

  const updatePackage = (i, k, v) => {
    setForm((f) => ({
      ...f,
      packages: f.packages.map((p, idx) => (idx === i ? { ...p, [k]: v } : p)),
    }))
  }

  const removePackage = (i) => {
    setForm((f) => ({ ...f, packages: f.packages.filter((_, idx) => idx !== i) }))
  }

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const json = await adminFetch('/api/admin/service', password, {
        service: form,
        photos,
      })
      setCatalog(json.catalog.services)
      setEditing(null)
      setPhotos([])
      setNotice(`${form.title} is live on Get Quote and What We Shoot.`)
      window.dispatchEvent(new Event(SERVICES_UPDATED))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (service) => {
    if (!window.confirm(`Remove ${service.title}? It will disappear from Get Quote.`)) return
    setBusy(true)
    setError('')
    try {
      const json = await adminFetch('/api/admin/service/delete', password, { id: service.id })
      setCatalog(json.catalog.services)
      if (editing === service.id) setEditing(null)
      setNotice(`${service.title} removed.`)
      window.dispatchEvent(new Event(SERVICES_UPDATED))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setPassword('')
    setAuthed(false)
    setEditing(null)
  }

  const IconPreview = useMemo(() => iconFor(form.icon), [form.icon])

  if (!authed) {
    return (
      <div className="min-h-screen bg-ink-950">
        <header className="border-b border-ink-700">
          <div className="container-x flex items-center justify-between py-4">
            <img src="/logo-landscape.png" alt="BlinkSky" className="h-9 w-auto" />
            <a href="#" className="btn-ghost">Back to site</a>
          </div>
        </header>
        <main className="container-x flex max-w-md flex-col py-16">
          <p className="eyebrow">Studio admin</p>
          <h1 className="mt-3 font-serif text-4xl text-cloud">Sign in</h1>
          <p className="mt-3 text-sm text-cloud/55">
            Add shoot types, photos and packages. New services show up on Get Quote immediately.
          </p>
          {health && !health.writable && (
            <p className="mt-4 rounded-xl border border-champagne/30 bg-champagne/10 px-4 py-3 text-sm text-cloud/80">
              Admin saves only work while <code className="text-champagne">npm run dev</code> is running.
            </p>
          )}
          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              setError('')
              setPassword(pwInput.trim())
            }}
          >
            <label className="block text-sm text-cloud/65" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-cloud
                         focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" className="btn-primary w-full">Enter</button>
          </form>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <header className="sticky top-0 z-30 border-b border-ink-700 bg-ink-950/95 backdrop-blur-md">
        <div className="container-x flex items-center justify-between py-4">
          <div>
            <p className="eyebrow">Studio admin</p>
            <h1 className="font-serif text-2xl text-cloud">Services</h1>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={logout} className="btn-ghost">Log out</button>
            <a href="#" className="btn-ghost">Back to site</a>
          </div>
        </div>
      </header>

      <main className="container-x py-10">
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
        {notice && <p className="mb-4 text-sm text-champagne">{notice}</p>}

        {editing ? (
          <form onSubmit={save} className="mx-auto max-w-3xl space-y-8">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="inline-flex items-center gap-2 text-sm text-cloud/60 hover:text-champagne"
            >
              <ArrowLeft size={16} /> All services
            </button>
            <h2 className="font-serif text-3xl text-cloud">
              {editing === 'new' ? 'New service' : 'Edit service'}
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm text-cloud/65" htmlFor="svc-title">Name</label>
                <input
                  id="svc-title"
                  required
                  value={form.title}
                  onChange={(e) => setField('title', e.target.value)}
                  placeholder="e.g. Puberty Ceremony"
                  className="w-full rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-cloud
                             placeholder:text-cloud/35 focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm text-cloud/65" htmlFor="svc-blurb">Description</label>
                <textarea
                  id="svc-blurb"
                  required
                  rows={4}
                  value={form.blurb}
                  onChange={(e) => setField('blurb', e.target.value)}
                  placeholder="A short line for the What We Shoot accordion."
                  className="w-full resize-none rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-cloud
                             placeholder:text-cloud/35 focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-cloud/65" htmlFor="svc-icon">Icon</label>
                <div className="flex items-center gap-3">
                  <IconPreview size={20} className="text-champagne" />
                  <select
                    id="svc-icon"
                    value={form.icon}
                    onChange={(e) => setField('icon', e.target.value)}
                    className="w-full rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-cloud
                               focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
                  >
                    {ICON_NAMES.map((name) => (
                      <option key={name} value={name} className="bg-ink-900">{name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm text-cloud/65" htmlFor="svc-flow">Quote flow</label>
                <select
                  id="svc-flow"
                  value={form.quoteFlow}
                  onChange={(e) => setField('quoteFlow', e.target.value)}
                  className="w-full rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-cloud
                             focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
                >
                  <option value="packages" className="bg-ink-900">Packages (customers pick a package)</option>
                  <option value="brief" className="bg-ink-900">Project brief (clothing-style)</option>
                  <option value="wedding" className="bg-ink-900">Wedding wizard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-cloud/65">Photos</label>
              <p className="mb-3 text-xs text-cloud/45">JPG, PNG or WebP. First photo becomes the cover.</p>
              <label className="btn-ghost inline-flex cursor-pointer">
                <Upload size={16} />
                Upload photos
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="sr-only"
                  onChange={async (e) => {
                    const next = await filesToPayload(e.target.files)
                    setPhotos((prev) => [...prev, ...next])
                    e.target.value = ''
                  }}
                />
              </label>
              {photos.length > 0 && (
                <p className="mt-3 text-sm text-cloud/60">{photos.length} new photo{photos.length === 1 ? '' : 's'} ready to save.</p>
              )}
            </div>

            {form.quoteFlow === 'packages' && (
              <div>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl text-cloud">Packages</h3>
                    <p className="mt-1 text-sm text-cloud/45">These appear on Get Quote after the customer picks this shoot type.</p>
                  </div>
                  <button type="button" onClick={addPackage} className="btn-ghost">
                    <Plus size={16} /> Add package
                  </button>
                </div>
                <label className="mb-4 block">
                  <span className="mb-2 block text-sm text-cloud/65">Package hint (optional)</span>
                  <input
                    value={form.packageHint}
                    onChange={(e) => setField('packageHint', e.target.value)}
                    placeholder="e.g. 30–60 sec reel included with every package."
                    className="w-full rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-cloud
                               placeholder:text-cloud/35 focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
                  />
                </label>
                <div className="space-y-4">
                  {form.packages.map((p, i) => (
                    <div key={p.id || i} className="rounded-2xl border border-ink-700 bg-ink-900/40 p-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <input
                          required
                          value={p.name}
                          onChange={(e) => updatePackage(i, 'name', e.target.value)}
                          placeholder="Package name, e.g. 10 Photos"
                          className="rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-cloud
                                     placeholder:text-cloud/35 focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
                        />
                        <input
                          required
                          type="number"
                          min="0"
                          step="500"
                          value={p.price}
                          onChange={(e) => updatePackage(i, 'price', e.target.value)}
                          placeholder="Price in LKR"
                          className="rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-cloud
                                     placeholder:text-cloud/35 focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
                        />
                        <input
                          value={p.sub}
                          onChange={(e) => updatePackage(i, 'sub', e.target.value)}
                          placeholder="Subtitle (optional)"
                          className="rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-cloud
                                     placeholder:text-cloud/35 focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne sm:col-span-2"
                        />
                        <textarea
                          rows={3}
                          value={p.items}
                          onChange={(e) => updatePackage(i, 'items', e.target.value)}
                          placeholder={'What’s included, one per line\ne.g. 10 edited photos\n30–60 sec reel'}
                          className="resize-none rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-cloud
                                     placeholder:text-cloud/35 focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne sm:col-span-2"
                        />
                      </div>
                      {form.packages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePackage(i)}
                          className="mt-3 inline-flex min-h-[44px] items-center gap-2 text-sm text-cloud/50 hover:text-red-400"
                        >
                          <Trash2 size={14} /> Remove package
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={busy} className="btn-primary disabled:opacity-40">
                <Check size={16} /> {busy ? 'Saving…' : 'Save service'}
              </button>
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-xl text-cloud/55">
                Each service appears on What We Shoot and as a tile on Get Quote → What are we shooting?
              </p>
              <button type="button" onClick={startCreate} className="btn-primary">
                <Plus size={16} /> Add service
              </button>
            </div>
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {catalog.map((s) => {
                const Icon = iconFor(s.icon)
                return (
                  <li key={s.id} className="rounded-2xl border border-ink-700 bg-ink-900/40 p-5">
                    <div className="flex items-start gap-4">
                      {s.image ? (
                        <img src={s.image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                      ) : (
                        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-ink-800">
                          <Icon size={20} className="text-champagne" />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-xl text-cloud">{s.title}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-cloud/50">{s.blurb}</p>
                        <p className="mt-2 text-xs uppercase tracking-widest text-cloud/35">
                          {s.quoteFlow === 'packages'
                            ? `${s.packages?.length || 0} package${(s.packages?.length || 0) === 1 ? '' : 's'}`
                            : s.quoteFlow}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" onClick={() => startEdit(s)} className="btn-ghost">Edit</button>
                      {!s.locked && (
                        <button type="button" onClick={() => remove(s)} className="btn-ghost">
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}
