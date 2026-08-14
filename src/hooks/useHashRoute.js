import { useEffect, useState } from 'react'

function pathName() {
  return (window.location.pathname.replace(/\/+$/, '') || '/')
}

/**
 * Quote and admin are full pages. Prefer real paths (/quote, /admin) so they
 * work on Vercel after a refresh; keep /#quote and /#admin as aliases.
 * In-page anchors like #services still fall through to the home page.
 */
function read() {
  const path = pathName()
  if (path === '/quote' || path === '/quote.html') return 'quote'
  if (path === '/admin' || path === '/admin.html') return 'admin'
  const hash = window.location.hash
  if (hash === '#quote') return 'quote'
  if (hash === '#admin') return 'admin'
  return 'home'
}

export function useHashRoute() {
  const [route, setRoute] = useState(read)

  useEffect(() => {
    const onChange = () => setRoute(read())
    window.addEventListener('hashchange', onChange)
    window.addEventListener('popstate', onChange)
    return () => {
      window.removeEventListener('hashchange', onChange)
      window.removeEventListener('popstate', onChange)
    }
  }, [])

  return route
}
