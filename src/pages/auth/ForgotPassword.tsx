import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import authService from '@/services/authService'

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
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <Link to="/">
            <img src="/logo-gradient-horizontal.svg" alt="TektonX" className="h-10 w-auto hover:opacity-80 transition-opacity" />
          </Link>
          <p className="text-xs text-white/40 uppercase tracking-widest">Password Reset</p>
        </div>

        <div className="glass-card rounded-2xl p-8 flex flex-col gap-5">
          {sent ? (
            <div className="text-center flex flex-col gap-4">
              <p className="text-white font-medium">Check your email</p>
              <p className="text-sm text-white/50 leading-relaxed">
                If an account exists for <span className="text-white">{email}</span>, we sent a reset link. Check your inbox.
              </p>
              <Link to="/auth/login" className="text-tekton-blue hover:text-tekton-blue/80 text-sm">
                &larr; Back to login
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <p className="text-white font-medium">Forgot your password?</p>
                <p className="text-sm text-white/50">Enter your email and we&apos;ll send you a reset link.</p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-white/60">Email address</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="you@example.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                </div>
                <Button type="submit" disabled={loading}
                  className="w-full bg-tekton-purple-bright hover:bg-tekton-purple-bright/90">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending&hellip;
                    </span>
                  ) : 'Send Reset Link'}
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
