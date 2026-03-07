import { Outlet } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 page-fade-in">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
