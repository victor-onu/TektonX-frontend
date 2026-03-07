import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  requireApproval?: boolean
}

export default function ProtectedRoute({ children, allowedRoles, requireApproval }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="size-10 border-2 border-tekton-purple-bright border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the correct dashboard based on actual role
    if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />
    if (user.role === 'mentor') return <Navigate to="/dashboard/mentor" replace />
    return <Navigate to="/dashboard/mentee" replace />
  }

  // Mentor with pending/rejected status → send to pending page (unless already going there)
  if (user.role === 'mentor' && user.status !== 'active' && requireApproval) {
    return <Navigate to="/dashboard/mentor/pending" replace />
  }

  return <>{children}</>
}
