import { Outlet } from 'react-router-dom'

import '@/components/marketing/marketing.css'

// Re-skinned to the light "marketing" design system (see MarketingLayout for
// the same pattern). `tx-marketing` scopes the shared heading-font-override,
// `:focus-visible`, and `::selection` rules from marketing.css to this
// layout; the explicit background prevents the app's global black body
// background from flashing through on load. This layout is only used by the
// 5 `/auth/*` routes (no header/footer — a deliberate "stay focused" pattern
// for auth screens), so it's safe to re-skin directly in place.
export default function AuthLayout() {
  return (
    <div className="tx-marketing flex min-h-screen items-center justify-center bg-[#F5F4F3] px-4">
      <Outlet />
    </div>
  )
}
