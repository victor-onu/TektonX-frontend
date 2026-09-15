import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '@/lib/api'
import logoBlackHorizontal from '@/assets/marketing/logo-black-horizontal.svg'

// Light-theme field styling shared by every input on this form — same shape
// as the shadcn defaults, just re-tinted for a white background (matches
// JoinCommunity.tsx's already-converted fields).
const fieldClassName =
  'bg-white border-[rgba(20,17,24,0.12)] text-[#141118] placeholder:text-[#7A737F] focus-visible:border-[#7C3AED] focus-visible:ring-[#7C3AED]/30'

function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters.'
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.'
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number.'
  return null
}

export default function Activate() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!token) {
    // AuthLayout already centers/backgrounds the page — see Login.tsx for why
    // this no longer duplicates that wrapper.
    return (
      <div className="bg-white border border-[rgba(20,17,24,0.06)] shadow-[0_24px_60px_rgba(20,17,24,0.08)] rounded-2xl p-8 max-w-md w-full flex flex-col gap-4 items-center text-center">
        <p className="text-[#DC2626] text-sm font-medium">Invalid activation link.</p>
        <Link to="/auth/login" className="text-xs text-[#7C3AED] hover:text-[#7C3AED]/80">
          Back to Sign In
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const pwError = validatePassword(password)
    if (pwError) { setError(pwError); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }

    setLoading(true)
    try {
      await api.post('/auth/activate', { token, password })
      toast.success('Account activated! You can now log in.')
      navigate('/auth/login')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Activation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    // AuthLayout already centers/backgrounds the page — see Login.tsx for why
    // this no longer duplicates that wrapper.
    <div className="w-full max-w-md flex flex-col gap-6 py-16">

      {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <Link to="/">
            <img src={logoBlackHorizontal} alt="TektonX" className="h-10 w-auto hover:opacity-80 transition-opacity" />
          </Link>
          <p className="text-xs text-[#7A737F] uppercase tracking-widest">Account Activation</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[rgba(20,17,24,0.06)] shadow-[0_24px_60px_rgba(20,17,24,0.08)] rounded-2xl p-8 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-2xl text-[#141118]">Activate Your Account</h1>
            <p className="text-sm text-[#5C5661]">Set a password to complete your account setup.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-[#413B47]">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
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

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-[#413B47]">Confirm Password</Label>
              <div className="relative">
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className={`${fieldClassName} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A737F] hover:text-[#413B47]"
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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
                  Activating&hellip;
                </span>
              ) : 'Activate Account'}
            </button>
          </form>

          <div className="h-px bg-[rgba(20,17,24,0.08)]" />

          <p className="text-center text-sm text-[#7A737F]">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-[#7C3AED] hover:text-[#7C3AED]/80">
              Sign in
            </Link>
          </p>
        </div>
    </div>
  )
}
