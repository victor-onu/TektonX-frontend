import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets scroll to the top of the page whenever the route's pathname
 * changes. React Router does not do this on its own for `<Link>`
 * navigations, so without it a page can render already scrolled to
 * wherever the previous page happened to be scrolled to (most noticeable
 * clicking a footer link — reachable only after scrolling to the bottom —
 * onto a shorter page, landing near its bottom).
 *
 * Skips when the new URL has a hash, deferring to `useScrollToHash` so the
 * two don't fight over where to land.
 */
export function useScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) return
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])
}
