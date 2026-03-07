import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Award, CheckCircle, XCircle } from 'lucide-react'

import certificateService from '@/services/certificateService'
import { formatDate } from '@/lib/utils'

export default function VerifyCertificate() {
  const { code } = useParams<{ code: string }>()

  const { data: certificate, isLoading, isError } = useQuery({
    queryKey: ['verify-certificate', code],
    queryFn: () => certificateService.verifyCertificate(code!),
    enabled: !!code,
    retry: false,
  })

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md flex flex-col gap-6">

        {/* Brand */}
        <div className="text-center">
          <span className="font-heading text-3xl gradient-text">TEKTONX</span>
          <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">Certificate Verification</p>
        </div>

        {isLoading ? (
          <div className="glass-card rounded-2xl p-10 flex flex-col items-center gap-4 animate-pulse">
            <div className="size-16 rounded-full bg-white/10" />
            <div className="h-5 w-40 rounded bg-white/10" />
            <div className="h-4 w-56 rounded bg-white/10" />
            <div className="h-4 w-32 rounded bg-white/10" />
          </div>
        ) : isError || !certificate ? (
          /* ── Not Found ── */
          <div className="glass-card rounded-2xl p-10 flex flex-col items-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
              <XCircle className="size-8 text-red-400" />
            </div>
            <div>
              <p className="font-heading text-2xl text-white">CERTIFICATE NOT FOUND</p>
              <p className="mt-2 text-sm text-white/50 leading-relaxed">
                No certificate was found for code <span className="text-white font-mono">{code}</span>.
                It may be invalid or have been revoked.
              </p>
            </div>
            <Link to="/" className="text-sm text-tekton-blue hover:text-tekton-blue/80 transition-colors">
              ← Back to TektonX
            </Link>
          </div>
        ) : (
          /* ── Verified ── */
          <div className="glass-card rounded-2xl p-8 flex flex-col gap-6 relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute -top-10 -right-10 size-40 rounded-full bg-tekton-purple-bright/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-tekton-teal/10 blur-3xl pointer-events-none" />

            {/* Status */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-tekton-green/10 border border-tekton-green/30">
                <CheckCircle className="size-8 text-tekton-green" />
              </div>
              <div>
                <p className="font-heading text-2xl text-tekton-green">CERTIFICATE VERIFIED</p>
                <p className="text-xs text-white/40 mt-0.5 uppercase tracking-wider">✅ Authentic TektonX Certificate</p>
              </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* Certificate details */}
            <div className="flex flex-col gap-4">
              {/* Award icon + holder name */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-tekton-yellow/10 border border-tekton-yellow/20 shrink-0">
                  <Award className="size-5 text-tekton-yellow" />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Certificate Holder</p>
                  <p className="font-semibold text-white text-lg">{certificate.user?.name ?? '—'}</p>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-white/40 uppercase tracking-wider">Track Completed</span>
                  <span className="text-sm text-white">{certificate.track}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-white/40 uppercase tracking-wider">Completion Date</span>
                  <span className="text-sm text-white">{formatDate(certificate.completedAt)}</span>
                </div>
              </div>

              {/* Verification code */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-white/40 uppercase tracking-wider">Verification Code</span>
                <span className="font-mono text-sm text-tekton-teal bg-tekton-teal/5 border border-tekton-teal/20 rounded-lg px-3 py-2 tracking-widest">
                  {certificate.verificationCode}
                </span>
              </div>
            </div>

            <div className="h-px bg-white/10" />

            <p className="text-xs text-white/30 text-center leading-relaxed">
              This certificate was issued by TektonX upon successful completion of all
              3 milestones in the 12-week mentorship program.
            </p>

            <Link to="/" className="text-center text-xs text-white/40 hover:text-white transition-colors">
              ← Back to TektonX
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
