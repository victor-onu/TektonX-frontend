import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import authService from '@/services/authService'
import { useAuth } from '@/hooks/useAuth'
import type { User } from '@/types'

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
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <Link to="/">
            <img src="/logo-gradient-horizontal.svg" alt="TektonX" className="h-10 w-auto hover:opacity-80 transition-opacity" />
          </Link>
          <p className="text-xs text-white/40 uppercase tracking-widest">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 flex flex-col gap-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-white/60">Email address</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-white/60">Password</Label>
                <Link to="/auth/forgot-password" className="text-xs text-tekton-blue hover:text-tekton-blue/80">
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
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-tekton-purple-bright hover:bg-tekton-purple-bright/90 mt-1"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in&hellip;
                </span>
              ) : 'Sign In'}
            </Button>
          </form>

          <div className="h-px bg-white/10" />

          <p className="text-center text-sm text-white/50">
            Don&apos;t have an account?{' '}
            <Link to="/auth/register" className="text-tekton-blue hover:text-tekton-blue/80">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
