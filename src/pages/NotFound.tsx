import { Link } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import type { User, UserRole } from '@/types'

function getDashboardPath(role: UserRole): string {
  if (role === 'admin') return '/dashboard/admin'
  if (role === 'mentor') return '/dashboard/mentor'
  return '/dashboard/mentee'
}

export default function NotFound() {
  const { isAuthenticated, user: rawUser } = useAuth()
  const user = rawUser as User | null

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Large 404 */}
        <p className="font-heading text-[8rem] sm:text-[10rem] leading-none gradient-text select-none">
          404
        </p>

        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl text-white sm:text-4xl">PAGE NOT FOUND</h1>
          <p className="text-sm text-white/50 max-w-sm leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
          >
            ← Back to Home
          </Link>

          {isAuthenticated && user && (
            <Link
              to={getDashboardPath(user.role)}
              className="inline-flex items-center gap-2 rounded-lg bg-tekton-purple-bright px-5 py-2.5 text-sm font-medium text-white hover:bg-tekton-purple-bright/90 transition-colors"
            >
              <LayoutDashboard className="size-4" />
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
