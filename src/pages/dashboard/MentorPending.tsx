import { Clock, Linkedin, LogOut, Mail, User as UserIcon, XCircle } from 'lucide-react'

import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import type { User } from '@/types'

export default function MentorPending() {
  const { user: rawUser, logout } = useAuth()
  const user = rawUser as User | null

  const isRejected = user?.applicationStatus === 'rejected'

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 pt-24 pb-16">
      {isRejected ? (
        <div className="w-full max-w-lg flex flex-col gap-6 text-center">
          {/* XCircle icon in red */}
          <div className="flex justify-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
              <XCircle className="size-10 text-red-400" />
            </div>
          </div>

          <h1 className="font-heading text-3xl text-white sm:text-4xl">APPLICATION NOT APPROVED</h1>

          <p className="text-sm text-white/60 leading-relaxed max-w-sm mx-auto">
            Unfortunately, your mentor application was not approved at this time. If you believe this was in error
            or would like more information, please reach out to our team.
          </p>

          <div className="flex flex-col items-center gap-3">
            <a
              href="mailto:tektonxlabs@gmail.com"
              className="text-sm text-tekton-blue hover:text-tekton-blue/80 transition-colors"
            >
              Contact tektonxlabs@gmail.com
            </a>
            <button
              onClick={logout}
              className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="size-4" /> Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-lg flex flex-col gap-6">
          {/* Status icon */}
          <div className="flex justify-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-tekton-yellow/15 border border-tekton-yellow/30">
              <Clock className="size-10 text-tekton-yellow" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="font-heading text-3xl text-white sm:text-4xl">APPLICATION UNDER REVIEW</h1>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              Thank you for applying to be a mentor at TektonX. Our team is reviewing your application.
              You'll receive an email notification once a decision has been made.
            </p>
          </div>

          {/* Submitted info summary card */}
          <div className="glass-card rounded-xl p-5 flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Your Submitted Application</p>

            {/* Name */}
            <div className="flex items-start gap-3">
              <UserIcon className="size-4 text-white/30 mt-0.5 shrink-0" />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs text-white/40">Name</span>
                <span className="text-sm text-white">{user?.name ?? '—'}</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="size-4 text-white/30 mt-0.5 shrink-0" />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs text-white/40">Email</span>
                <span className="text-sm text-white break-all">{user?.email ?? '—'}</span>
              </div>
            </div>

            {/* Track */}
            <div className="flex items-start gap-3">
              <div className="size-4 mt-0.5 shrink-0 flex items-center justify-center">
                <span className="text-white/30 text-xs font-bold">T</span>
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs text-white/40">Track</span>
                <span className="text-sm text-white">{user?.track ?? '—'}</span>
              </div>
            </div>

            {/* Bio */}
            <div className="flex items-start gap-3">
              <div className="size-4 mt-0.5 shrink-0 flex items-center justify-center">
                <span className="text-white/30 text-xs font-bold">B</span>
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs text-white/40">Bio</span>
                <span className="text-sm text-white leading-relaxed">{user?.bio ?? '—'}</span>
              </div>
            </div>

            {/* Experience Years */}
            <div className="flex items-start gap-3">
              <div className="size-4 mt-0.5 shrink-0 flex items-center justify-center">
                <span className="text-white/30 text-xs font-bold">Y</span>
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs text-white/40">Years of Experience</span>
                <span className="text-sm text-white">
                  {user?.experienceYears !== undefined ? `${user.experienceYears} years` : '—'}
                </span>
              </div>
            </div>

            {/* LinkedIn */}
            <div className="flex items-start gap-3">
              <Linkedin className="size-4 text-white/30 mt-0.5 shrink-0" />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs text-white/40">LinkedIn</span>
                {user?.linkedinUrl ? (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-tekton-blue hover:text-tekton-blue/80 transition-colors break-all"
                  >
                    {user.linkedinUrl}
                  </a>
                ) : (
                  <span className="text-sm text-white">—</span>
                )}
              </div>
            </div>

            {/* Submitted on */}
            <div className="flex items-start gap-3">
              <Clock className="size-4 text-white/30 mt-0.5 shrink-0" />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs text-white/40">Submitted On</span>
                <span className="text-sm text-white">
                  {user?.createdAt ? formatDate(user.createdAt) : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer links */}
          <div className="flex flex-col items-center gap-3">
            <a
              href="mailto:tektonxlabs@gmail.com"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              Need help? Contact tektonxlabs@gmail.com
            </a>
            <button
              onClick={logout}
              className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="size-4" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
