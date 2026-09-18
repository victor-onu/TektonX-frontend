import { Outlet } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

// Light-themed Nav/Footer, scoped ONLY to the community manager dashboard —
// every other dashboard/page keeps the shared dark PublicLayout untouched.
export default function CommunityManagerLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation variant="light" />
      <main className="flex-1 page-fade-in">
        <Outlet />
      </main>
      <Footer variant="light" />
    </div>
  )
}
