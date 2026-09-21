import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import authService from '@/services/authService'
import { useAuth } from '@/hooks/useAuth'
import type { User } from '@/types'
import logoBlackHorizontal from '@/assets/marketing/logo-black-horizontal.svg'

// Light-theme field styling shared by every input on this form — same shape
// as the shadcn defaults, just re-tinted for a white background (matches
// JoinCommunity.tsx's already-converted fields).
const fieldClassName =
  'bg-white border-[rgba(20,17,24,0.12)] text-[#141118] placeholder:text-[#7A737F] focus-visible:border-[#7C3AED] focus-visible:ring-[#7C3AED]/30'

export default function Login() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const redirectByRole = (user: User) => {
    if (user.role === 'admin') return navigate('/dashboard/admin')
    if (user.role === 'community_manager') return navigate('/dashboard/community-manager')
    if (user.role === 'mentor') {
      if (user.status === 'active') return navigate('/dashboard/mentor')
      return navigate('/dashboard/mentor/pending')
    }
    return navigate('/dashboard/mentee')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user } = await authService.login({ email, password })
      setUser(user)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      redirectByRole(user)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    // AuthLayout already centers/backgrounds the page (min-h-screen, flex,
    // items-center, justify-center, px-4) — no need to repeat that here. A
    // duplicate wrapper used to make this card size unreliably (narrower at
    // 1440px than at 375px, since a nested flex-center shrinks to fit).
    <div className="w-full max-w-md flex flex-col gap-6 py-16">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <Link to="/">
            <img src={logoBlackHorizontal} alt="TektonX" className="h-10 w-auto hover:opacity-80 transition-opacity" />
          </Link>
          <p className="text-xs text-[#7A737F] uppercase tracking-widest">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[rgba(20,17,24,0.06)] shadow-[0_24px_60px_rgba(20,17,24,0.08)] rounded-2xl p-8 flex flex-col gap-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-[#413B47]">Email address</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className={fieldClassName}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-[#413B47]">Password</Label>
                <Link to="/auth/forgot-password" className="text-xs text-[#7C3AED] hover:text-[#7C3AED]/80">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className={`${fieldClassName} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A737F] hover:text-[#413B47]"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-[#DC2626] text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="tx-cta-gradient mt-1 w-full inline-flex items-center justify-center gap-2 rounded-md text-white text-sm font-medium"
              style={{
                background: 'linear-gradient(100deg,#7C3AED,#C026D3)',
                padding: '17px 30px',
                borderRadius: 10,
                boxShadow: '0 6px 18px rgba(124,58,237,0.28)',
                opacity: loading ? 0.75 : 1,
                cursor: loading ? 'default' : 'pointer',
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in&hellip;
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="h-px bg-[rgba(20,17,24,0.08)]" />

          <p className="text-center text-sm text-[#7A737F]">
            Don&apos;t have an account?{' '}
            <Link to="/auth/register" className="text-[#7C3AED] hover:text-[#7C3AED]/80">
              Create one
            </Link>
          </p>
        </div>
    </div>
  )
}
