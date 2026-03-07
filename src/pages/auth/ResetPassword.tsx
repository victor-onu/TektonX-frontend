import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import authService from '@/services/authService'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!token) { setError('Invalid or missing reset token.'); return }
    setLoading(true)
    try {
      await authService.resetPassword(token, password)
      toast.success('Password reset successfully!')
      navigate('/auth/login')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Reset failed. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <Link to="/">
            <img src="/logo-gradient-horizontal.svg" alt="TektonX" className="h-10 w-auto hover:opacity-80 transition-opacity" />
          </Link>
          <p className="text-xs text-white/40 uppercase tracking-widest">Set New Password</p>
        </div>

        <div className="glass-card rounded-2xl p-8 flex flex-col gap-5">
          {!token ? (
            <div className="text-center flex flex-col gap-4">
              <p className="text-red-400">Invalid reset link.</p>
              <Link to="/auth/forgot-password" className="text-tekton-blue hover:text-tekton-blue/80 text-sm">
                Request a new link
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <p className="text-white font-medium">Set a new password</p>
                <p className="text-sm text-white/50">Min 8 characters, 1 uppercase letter, 1 number.</p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-white/60">New password</Label>
                  <div className="relative">
                    <Input type={showPassword ? 'text' : 'password'} value={password}
                      onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-10" />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <Button type="submit" disabled={loading}
                  className="w-full bg-tekton-purple-bright hover:bg-tekton-purple-bright/90">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Resetting&hellip;
                    </span>
                  ) : 'Reset Password'}
                </Button>
              </form>
              <div className="h-px bg-white/10" />
              <Link to="/auth/login" className="text-center text-sm text-white/50 hover:text-white transition-colors">
                &larr; Back to login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
