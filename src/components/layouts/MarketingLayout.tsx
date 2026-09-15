import { Outlet } from 'react-router-dom'

import MarketingHeader from '@/components/marketing/MarketingHeader'
import MarketingFooter from '@/components/marketing/MarketingFooter'
import '@/components/marketing/marketing.css'

// Layout for the community-led Home ("/") and About ("/about") redesign.
// Deliberately separate from `PublicLayout` (which every other public page
// keeps using) since this pair of pages has its own light-theme header and
// footer, unrelated to the shared dark `Navigation`/`Footer`.
//
// `id="top"` + an explicit opaque background here matter for two reasons:
// the app's global body background is black (see `src/index.css`), so
// without an opaque light background on this wrapper the black body would
// show through/flash on load; and the footer's "Terms" / "Privacy" links
// point at `#top` to jump back to the top of whichever of these two pages
// is currently rendered.
export default function MarketingLayout() {
  return (
    <div id="top" className="tx-marketing flex min-h-screen flex-col" style={{ background: '#F5F4F3' }}>
      <MarketingHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <MarketingFooter />
    </div>
  )
}
