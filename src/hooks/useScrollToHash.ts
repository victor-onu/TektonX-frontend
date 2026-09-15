import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls to the element whose id matches the current URL hash whenever the
 * hash changes (including on first mount after a route navigation). Same-page
 * anchor links (`<a href="#section">`) already scroll natively via the
 * browser and don't need this — this hook exists for cross-page anchor links
 * (e.g. an About page CTA linking to `/#programs` on the Home page), where a
 * client-side route change does not trigger the browser's native hash-scroll
 * behavior.
 */
export function useScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return

    const id = location.hash.slice(1)
    const element = document.getElementById(id)
    if (!element) return

    element.scrollIntoView({ block: 'start' })
  }, [location.hash])
}
