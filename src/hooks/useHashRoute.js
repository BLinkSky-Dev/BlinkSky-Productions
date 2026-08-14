import { useEffect, useState } from 'react'

/**
 * Tiny hash-based router.
 *
 * Hash routing (rather than react-router + BrowserRouter) is deliberate: it
 * needs no extra dependency and, critically, no server rewrite rules, so
 * /#quote and /#admin work on any static host without a 404 on refresh.
 * In-page anchors like #services still fall through to 'home'.
 */
export function useHashRoute() {
  const read = () => {
    const hash = window.location.hash
    if (hash === '#quote') return 'quote'
    if (hash === '#admin') return 'admin'
    return 'home'
  }
  const [route, setRoute] = useState(read)

  useEffect(() => {
    const onChange = () => setRoute(read())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}
