import { useCallback, useEffect, useState } from 'react'
import { withIcons } from '../data/serviceIcons'
import { fallbackServices } from '../data/services'

export const SERVICES_UPDATED = 'blinksky-services-updated'

export function useServices() {
  const [services, setServices] = useState(() => withIcons(fallbackServices))
  const [status, setStatus] = useState('loading')

  const reload = useCallback(() => {
    fetch(`/data/services-catalog.json?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        const list = Array.isArray(json) ? json : json.services
        if (!Array.isArray(list) || !list.length) throw new Error('empty catalog')
        setServices(withIcons(list))
        setStatus('ready')
      })
      .catch(() => {
        setServices(withIcons(fallbackServices))
        setStatus('ready')
      })
  }, [])

  useEffect(() => {
    reload()
    const onUpdate = () => reload()
    window.addEventListener(SERVICES_UPDATED, onUpdate)
    return () => window.removeEventListener(SERVICES_UPDATED, onUpdate)
  }, [reload])

  return { services, status, reload }
}
