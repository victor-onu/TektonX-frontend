import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import authService from '@/services/authService'
import logoBlackHorizontal from '@/assets/marketing/logo-black-horizontal.svg'

// Light-theme field styling shared by every input on this form — same shape
// as the shadcn defaults, just re-tinted for a white background (matches
// JoinCommunity.tsx's already-converted fields).
const fieldClassName =
  'bg-white border-[rgba(20,17,24,0.12)] text-[#141118] placeholder:text-[#7A737F] focus-visible:border-[#7C3AED] focus-visible:ring-[#7C3AED]/30'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    // AuthLayout already centers/backgrounds the page — see Login.tsx for why
    // this no longer duplicates that wrapper.
    <div className="w-full max-w-md flex flex-col gap-6 py-16">
        <div className="flex flex-col items-center gap-3">
          <Link to="/">
            <img src={logoBlackHorizontal} alt="TektonX" className="h-10 w-auto hover:opacity-80 transition-opacity" />
          </Link>
          <p className="text-xs text-[#7A737F] uppercase tracking-widest">Password Reset</p>
        </div>

        <div className="bg-white border border-[rgba(20,17,24,0.06)] shadow-[0_24px_60px_rgba(20,17,24,0.08)] rounded-2xl p-8 flex flex-col gap-5">
          {sent ? (
            <div className="text-center flex flex-col gap-4">
              <p className="text-[#141118] font-medium">Check your email</p>
              <p className="text-sm text-[#5C5661] leading-relaxed">
                If an account exists for <span className="text-[#141118]">{email}</span>, we sent a reset link. Check your inbox.
              </p>
              <Link to="/auth/login" className="text-[#7C3AED] hover:text-[#7C3AED]/80 text-sm">
                &larr; Back to login
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <p className="text-[#141118] font-medium">Forgot your password?</p>
                <p className="text-sm text-[#5C5661]">Enter your email and we&apos;ll send you a reset link.</p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-[#413B47]">Email address</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="you@example.com"
                    className={fieldClassName} />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="tx-cta-gradient w-full inline-flex items-center justify-center gap-2 rounded-md text-white text-sm font-medium"
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
                      Sending&hellip;
                    </span>
                  ) : 'Send Reset Link'}
                </button>
              </form>
              <div className="h-px bg-[rgba(20,17,24,0.08)]" />
              <Link to="/auth/login" className="text-center text-sm text-[#7A737F] hover:text-[#141118] transition-colors">
                &larr; Back to login
              </Link>
            </>
          )}
        </div>
    </div>
  )
}
