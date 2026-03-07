import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, ExternalLink, MessageCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { format, isAfter } from 'date-fns'

import announcementService from '@/services/announcementService'
import sessionService from '@/services/sessionService'
import { cn } from '@/lib/utils'
import { TECH_TRACKS } from '@/types'
import type { AnnouncementType } from '@/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function announcementBadge(type: AnnouncementType) {
  const map = {
    important: 'bg-red-500/15 border-red-500/30 text-red-400',
    event: 'bg-tekton-purple-bright/15 border-tekton-purple-bright/30 text-tekton-purple-bright',
    update: 'bg-tekton-blue/15 border-tekton-blue/30 text-tekton-blue',
  }
  const labels = { important: 'Important', event: 'Event', update: 'Update' }
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium', map[type])}>
      {labels[type]}
    </span>
  )
}

function formatSessionDateTime(date: string, time: string) {
  try {
    const dt = new Date(`${date}T${time}`)
    return format(dt, "MMMM d, yyyy 'at' h:mm a")
  } catch {
    return `${date} ${time}`
  }
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-xl p-5 flex flex-col gap-2">
          <div className="h-4 w-20 rounded bg-white/10" />
          <div className="h-5 w-48 rounded bg-white/10" />
          <div className="h-3 w-full rounded bg-white/10" />
          <div className="h-3 w-3/4 rounded bg-white/10" />
        </div>
      ))}
    </div>
  )
}

// ─── Collapsible Guidelines ───────────────────────────────────────────────────

function GuidelinesCard() {
  const [open, setOpen] = useState(false)
  const guidelines = [
    'Be respectful and professional in all interactions',
    'Share knowledge and resources generously',
    'Ask questions — no question is too basic',
    'Respond to mentor feedback promptly',
    'Keep discussions on-topic in track groups',
  ]

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-white">Communication Guidelines</span>
        {open ? <ChevronUp className="size-4 text-white/40" /> : <ChevronDown className="size-4 text-white/40" />}
      </button>
      {open && (
        <div className="border-t border-white/10 px-5 py-4">
          <ul className="flex flex-col gap-2 text-sm text-white/60">
            {guidelines.map((g, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-tekton-teal shrink-0">•</span>
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Communication() {
  const navigate = useNavigate()
  const { data: announcements = [], isLoading: annLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: announcementService.getAll,
  })

  const { data: allSessions = [], isLoading: sessLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: sessionService.getAll,
  })

  // Filter to future sessions, sorted ascending
  const upcomingSessions = allSessions
    .filter((s) => {
      try {
        return isAfter(new Date(`${s.date}T${s.time}`), new Date())
      } catch {
        return false
      }
    })
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())

  const sortedAnnouncements = [...announcements].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4">
      <div className="mx-auto max-w-7xl flex flex-col gap-8">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 w-fit text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        {/* Page heading */}
        <div>
          <h1 className="font-heading text-4xl text-white sm:text-5xl">
            COMMUNICATION <span className="gradient-text">HUB</span>
          </h1>
          <p className="mt-1 text-sm text-white/50">Stay connected with announcements, sessions, and your community.</p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">

          {/* ── Left Column ── */}
          <div className="flex flex-col gap-8">

            {/* Section 1 — Announcements */}
            <section className="flex flex-col gap-4">
              <h2 className="font-heading text-2xl text-white">ANNOUNCEMENTS</h2>
              {annLoading ? (
                <CardSkeleton count={3} />
              ) : sortedAnnouncements.length === 0 ? (
                <div className="glass-card rounded-xl p-6 text-center text-white/40 text-sm">
                  No announcements yet.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {sortedAnnouncements.map((ann) => (
                    <div key={ann.id} className="glass-card rounded-xl p-5 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        {announcementBadge(ann.type)}
                        <span className="text-xs text-white/40 ml-auto">
                          {format(new Date(ann.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="font-semibold text-white text-sm">{ann.title}</p>
                      <p className="text-sm text-white/60 leading-relaxed">{ann.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Section 2 — Upcoming Sessions */}
            <section className="flex flex-col gap-4">
              <h2 className="font-heading text-2xl text-white">UPCOMING SESSIONS</h2>
              {sessLoading ? (
                <CardSkeleton count={2} />
              ) : upcomingSessions.length === 0 ? (
                <div className="glass-card rounded-xl p-6 text-center text-white/40 text-sm">
                  No upcoming sessions scheduled.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="glass-card rounded-xl p-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-tekton-purple-bright/10 border border-tekton-purple-bright/20 shrink-0">
                        <Calendar className="size-5 text-tekton-purple-bright" />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center rounded-full bg-tekton-teal/15 border border-tekton-teal/30 px-2 py-0.5 text-[11px] font-medium text-tekton-teal">
                            {session.type}
                          </span>
                        </div>
                        <p className="font-semibold text-white text-sm">{session.title}</p>
                        <p className="text-xs text-white/50">{formatSessionDateTime(session.date, session.time)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ── Right Column ── */}
          <div className="flex flex-col gap-6">

            {/* Section 3 — WhatsApp Groups */}
            <div className="glass-card rounded-xl p-5 flex flex-col gap-4">
              <h2 className="font-heading text-xl text-white">WHATSAPP COMMUNITIES</h2>
              <p className="text-xs text-white/50">
                Join your track's WhatsApp group to connect with peers and mentors.
              </p>

              {/* Main group */}
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg border border-tekton-green/20 bg-tekton-green/5 px-4 py-3 text-sm font-medium text-tekton-green smooth-hover hover:bg-tekton-green/10 transition-colors"
              >
                <MessageCircle className="size-4 shrink-0" />
                <span className="flex-1">Main TektonX Community</span>
                <ExternalLink className="size-3.5 text-tekton-green/60" />
              </a>

              {/* Track groups */}
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Track Groups</p>
                {TECH_TRACKS.map((track) => (
                  <a
                    key={track}
                    href="#"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/60 smooth-hover hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <MessageCircle className="size-3 shrink-0 text-white/30" />
                    <span className="flex-1 truncate">{track}</span>
                    <ExternalLink className="size-3 text-white/20" />
                  </a>
                ))}
              </div>
            </div>

            {/* Section 4 — Guidelines */}
            <GuidelinesCard />

            {/* Section 5 — Need Help? */}
            <div className="glass-card rounded-xl p-5 flex flex-col gap-3">
              <h2 className="font-heading text-xl text-white">NEED HELP?</h2>
              <p className="text-sm text-white/60">
                Reach out to our support team or connect with your mentor directly.
              </p>
              <a
                href="mailto:support@tektonxlabs.org"
                className="text-sm text-tekton-blue hover:text-tekton-blue/80 transition-colors"
              >
                support@tektonxlabs.org
              </a>
              <Link
                to="/messages"
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                Or message your mentor directly →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
