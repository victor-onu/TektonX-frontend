import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { format, isAfter, startOfDay } from 'date-fns'
import {
  GraduationCap,
  Code,
  Trophy,
  Building,
  Users,
  Map,
  Calendar,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import announcementService from '@/services/announcementService'
import type { LucideIcon } from 'lucide-react'
import type { Announcement } from '@/types'

// ─── Programs data ────────────────────────────────────────────────────────────

interface Program {
  Icon: LucideIcon
  name: string
  description: string
  href?: string
  features: string[]
}

const PROGRAMS: Program[] = [
  {
    Icon: GraduationCap,
    name: 'Campus to Tech Careers',
    description:
      'A bridge program helping final-year students and recent graduates transition directly into tech jobs through career readiness workshops, employer connections, and portfolio development.',
    features: ['Career workshops', 'Employer connections', 'Portfolio development', 'Job placement support'],
  },
  {
    Icon: Code,
    name: 'Code for Growth',
    description:
      'An intensive coding program for beginners with zero prior experience. From fundamentals to building your first real project — guided every step of the way.',
    features: ['Zero experience needed', 'Step-by-step curriculum', 'Real project build', 'Mentor guidance'],
  },
  {
    Icon: Trophy,
    name: 'Competitions',
    description:
      'Regular hackathons and tech challenges designed to push your skills, foster innovation, and connect you with opportunities from top companies in Africa and beyond.',
    features: ['Hackathons', 'Industry challenges', 'Prizes & recognition', 'Company connections'],
  },
  {
    Icon: Building,
    name: 'Hub',
    description:
      'A physical and virtual co-working community where TektonX members collaborate, build side projects, and access resources in a focused, energizing environment.',
    features: ['Virtual co-working', 'Resource library', 'Collaboration spaces', 'Side project support'],
  },
  {
    Icon: Users,
    name: 'Mentorship',
    description:
      'Our flagship 12-week mentorship program matching aspiring tech professionals with experienced industry mentors across 7 specialized tracks.',
    href: '/mentorship',
    features: ['12-week program', '7 tech tracks', '1-on-1 mentorship', 'Verified certificate'],
  },
  {
    Icon: Map,
    name: 'Tech Pathways',
    description:
      'Self-paced learning roadmaps for every tech track, giving independent learners a structured curriculum with curated resources and milestone checkpoints.',
    features: ['Self-paced learning', '7 track roadmaps', 'Curated resources', 'Milestone checkpoints'],
  },
]

// ─── Event detail modal ───────────────────────────────────────────────────────

function EventModal({ event, onClose }: { event: Announcement; onClose: () => void }) {
  const dateObj = new Date(event.date)
  const fullDate = format(dateObj, 'MMMM d, yyyy')

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="bg-black/98 border-white/10 text-white p-0 max-w-lg overflow-hidden">
        {/* Flier */}
        {event.flierUrl && (
          <div className="w-full max-h-64 overflow-hidden">
            <img
              src={event.flierUrl}
              alt={`${event.title} flier`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 flex flex-col gap-4">
          {/* Type badge */}
          <span className="inline-flex w-fit items-center rounded-full border border-tekton-purple-bright/30 bg-tekton-purple-bright/10 px-3 py-0.5 text-xs font-semibold text-tekton-purple-bright capitalize">
            {event.type}
          </span>

          {/* Title */}
          <h2 className="font-heading text-2xl text-white leading-snug">{event.title}</h2>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Calendar className="size-4 text-tekton-teal shrink-0" />
            <span>{fullDate}</span>
          </div>

          {/* Content */}
          <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{event.content}</p>

          <button
            onClick={onClose}
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Programs() {
  const [selectedEvent, setSelectedEvent] = useState<Announcement | null>(null)

  const { data: allAnnouncements = [] } = useQuery({
    queryKey: ['announcements'],
    queryFn: announcementService.getAll,
  })

  // Show only type=event announcements with today or future dates
  const upcomingEvents = allAnnouncements
    .filter((a) => a.type === 'event' && isAfter(new Date(a.date), startOfDay(new Date())))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <div className="flex flex-col">
      {/* ════════════════════════════════════════════════════════
          Section 1 — Hero
      ════════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-24 pb-8 text-center overflow-hidden bg-black">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 right-0 size-[500px] rounded-full bg-tekton-purple-bright/15 blur-[120px]" />
          <div className="absolute bottom-0 left-0 size-[300px] rounded-full bg-tekton-teal/10 blur-[100px]" />
          <div className="absolute inset-0 bg-grid opacity-30" />
        </div>

        <div className="relative z-10 max-w-3xl flex flex-col items-center gap-6">
          <span className="inline-flex items-center rounded-full border border-tekton-purple-bright/40 bg-tekton-purple-bright/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-tekton-purple-bright">
            What We Offer
          </span>
          <h1 className="font-heading text-5xl text-white sm:text-6xl lg:text-7xl leading-tight">
            OUR <span className="gradient-text">PROGRAMS</span>
          </h1>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 2 — Programs Grid
      ════════════════════════════════════════════════════════ */}
      <section className="py-10 px-4 bg-black">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROGRAMS.map(({ Icon, name, description, href, features }) => (
              <div
                key={name}
                className="glass-card rounded-2xl p-7 flex flex-col gap-5 smooth-hover transition-all hover:-translate-y-0.5 hover:border-white/20"
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl shrink-0 bg-tekton-purple-bright/20">
                    <Icon className="size-6 text-tekton-purple-bright" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="font-heading text-2xl text-white">{name}</h3>
                  <p className="text-sm text-white/55 leading-relaxed flex-1">{description}</p>
                </div>

                {/* Features */}
                <ul className="grid grid-cols-2 gap-1.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-white/40">
                      <span className="size-1 rounded-full shrink-0 bg-tekton-purple-bright" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {href && (
                  <Button
                    asChild
                    size="sm"
                    className="w-fit bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90 glow-purple gap-1.5"
                  >
                    <Link to={href}>
                      Learn More
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 3 — Upcoming Events
      ════════════════════════════════════════════════════════ */}
      {upcomingEvents.length > 0 && (
        <section className="relative py-24 px-4 bg-grid bg-black">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
          <div className="relative z-10 mx-auto max-w-4xl">
            <div className="mb-16 text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-tekton-teal/70">
                Mark Your Calendar
              </p>
              <h2 className="font-heading text-5xl text-white sm:text-6xl">
                UPCOMING <span className="gradient-text">EVENTS</span>
              </h2>
              <p className="mt-5 text-white/50">
                Stay connected with the TektonX community through upcoming sessions and milestones.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {upcomingEvents.map((event) => {
                const dateObj = new Date(event.date)
                const day = format(dateObj, 'd')
                const month = format(dateObj, 'MMM').toUpperCase()

                return (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="glass-card rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 smooth-hover hover:-translate-y-0.5 transition-all hover:border-white/20 text-left w-full group"
                  >
                    {/* Date badge */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex flex-col items-center justify-center size-14 rounded-xl glass-card border-white/15">
                        <span className="font-heading text-2xl leading-none text-white">{day}</span>
                        <span className="text-[10px] font-semibold tracking-widest text-white/40 uppercase">{month}</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden sm:block w-px h-10 bg-white/10 shrink-0" />

                    {/* Flier thumbnail */}
                    {event.flierUrl && (
                      <div className="hidden sm:block size-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                        <img src={event.flierUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Title + hint */}
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-white group-hover:text-tekton-purple-bright transition-colors">{event.title}</p>
                      <p className="text-xs text-white/30 mt-0.5">Click to view details</p>
                    </div>

                    {/* Type badge */}
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-tekton-purple-bright/30 bg-tekton-purple-bright/10 px-3 py-1 text-xs font-semibold text-tekton-purple-bright capitalize shrink-0">
                      <span className="size-1.5 rounded-full bg-tekton-purple-bright" />
                      Event
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  )
}
