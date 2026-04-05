import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import queryClient from '@/lib/queryClient'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import PublicLayout from '@/components/layouts/PublicLayout'
import AuthLayout from '@/components/layouts/AuthLayout'

// Public pages
import Index from '@/pages/Index'
import About from '@/pages/About'
import Programs from '@/pages/Programs'
import Mentorship from '@/pages/Mentorship'
import Mentors from '@/pages/Mentors'
import VerifyCertificate from '@/pages/VerifyCertificate'
import Partnerships from '@/pages/Partnerships'
import NotFound from '@/pages/NotFound'

// Auth pages
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import ResetPassword from '@/pages/auth/ResetPassword'
import Activate from '@/pages/auth/Activate'

// Protected pages
import MenteeDashboard from '@/pages/dashboard/MenteeDashboard'
import MentorDashboard from '@/pages/dashboard/MentorDashboard'
import MentorPending from '@/pages/dashboard/MentorPending'
import AdminDashboard from '@/pages/dashboard/AdminDashboard'
import Roadmap from '@/pages/Roadmap'
import Communication from '@/pages/Communication'
import Messages from '@/pages/Messages'
import Profile from '@/pages/Profile'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Auth layout (no Nav/Footer, centered) ── */}
            <Route element={<AuthLayout />}>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/auth/activate" element={<Activate />} />
            </Route>

            {/* ── Public layout (Nav + Footer) ── */}
            <Route element={<PublicLayout />}>
              {/* Public */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/mentorship" element={<Mentorship />} />
              <Route path="/mentors" element={<Mentors />} />
              <Route path="/verify/:code" element={<VerifyCertificate />} />
              <Route path="/partnerships" element={<Partnerships />} />

              {/* Protected — mentee only */}
              <Route
                path="/dashboard/mentee"
                element={
                  <ProtectedRoute allowedRoles={['mentee']}>
                    <MenteeDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected — mentor (approved) */}
              <Route
                path="/dashboard/mentor"
                element={
                  <ProtectedRoute allowedRoles={['mentor']} requireApproval>
                    <MentorDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected — mentor (pending, no approval required) */}
              <Route
                path="/dashboard/mentor/pending"
                element={
                  <ProtectedRoute allowedRoles={['mentor']}>
                    <MentorPending />
                  </ProtectedRoute>
                }
              />

              {/* Protected — admin only */}
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected — mentee & mentor */}
              <Route
                path="/roadmap"
                element={
                  <ProtectedRoute allowedRoles={['mentee', 'mentor']}>
                    <Roadmap />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roadmap/:milestoneId"
                element={
                  <ProtectedRoute allowedRoles={['mentee', 'mentor']}>
                    <Roadmap />
                  </ProtectedRoute>
                }
              />

              {/* Protected — any authenticated user */}
              <Route
                path="/communication"
                element={
                  <ProtectedRoute>
                    <Communication />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Protected — mentee & mentor */}
              <Route
                path="/messages"
                element={
                  <ProtectedRoute allowedRoles={['mentee', 'mentor']}>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages/:userId"
                element={
                  <ProtectedRoute allowedRoles={['mentee', 'mentor']}>
                    <Messages />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* ── Catch-all ── */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Toaster richColors position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
