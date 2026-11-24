import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { PUBLIC_PAGES } from './pages'

/** Keeps the browser tab's title in step when moving between pages without a
 *  reload. MindfulScroll's layout already sets its own title. */
export default function PageTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname.startsWith('/mindfulscroll')) return
    const page = PUBLIC_PAGES.find((p) => p.path === pathname)
    document.title = page ? page.title : 'TektonX'
  }, [pathname])

  return null
}
