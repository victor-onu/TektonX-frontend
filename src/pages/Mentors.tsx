import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Linkedin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, getInitials } from '@/lib/utils'
import { TECH_TRACKS } from '@/types'
import mentorService from '@/services/mentorService'
import type { TechTrack } from '@/types'

// ─── Track color map ──────────────────────────────────────────────────────────

const TRACK_BADGE_COLORS: Partial<Record<TechTrack, string>> = {
  'Software Development (Frontend & Backend)': 'bg-tekton-purple-bright/15 text-tekton-purple-bright border-tekton-purple-bright/30',
  'UI/UX Design': 'bg-tekton-teal/15 text-tekton-teal border-tekton-teal/30',
  'Mobile App Development': 'bg-tekton-blue/15 text-tekton-blue border-tekton-blue/30',
  'Product/Project Management': 'bg-tekton-yellow/15 text-tekton-yellow border-tekton-yellow/30',
  'Quality Assurance (QA)': 'bg-tekton-green/15 text-tekton-green border-tekton-green/30',
  'Data (Analysis/Science)': 'bg-tekton-purple-bright/15 text-tekton-purple-bright border-tekton-purple-bright/30',
  'Cybersecurity': 'bg-red-500/15 text-red-400 border-red-500/30',
}

const TRACK_BANNER_COLORS: Partial<Record<TechTrack, string>> = {
  'Software Development (Frontend & Backend)': 'from-tekton-purple-bright/20 to-tekton-purple-deep/10',
  'UI/UX Design': 'from-tekton-teal/20 to-tekton-blue/10',
  'Mobile App Development': 'from-tekton-blue/20 to-tekton-teal/10',
  'Product/Project Management': 'from-tekton-yellow/20 to-tekton-green/10',
  'Quality Assurance (QA)': 'from-tekton-green/20 to-tekton-teal/10',
  'Data (Analysis/Science)': 'from-tekton-purple-bright/20 to-tekton-blue/10',
  'Cybersecurity': 'from-red-500/20 to-tekton-purple-deep/10',
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function MentorCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
      {/* Banner */}
      <div className="h-16 bg-white/5" />
      <div className="p-6 flex flex-col items-center gap-4 -mt-8">
        <div className="size-20 rounded-full bg-white/10 ring-4 ring-black" />
        <div className="h-4 w-32 rounded bg-white/10" />
        <div className="h-3 w-24 rounded bg-white/10" />
        <div className="h-5 w-20 rounded-full bg-white/10" />
        <div className="w-full space-y-2">
          <div className="h-3 w-full rounded bg-white/10" />
          <div className="h-3 w-5/6 rounded bg-white/10" />
          <div className="h-3 w-4/6 rounded bg-white/10" />
        </div>
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Mentors() {
  const [selectedTrack, setSelectedTrack] = useState<TechTrack | undefined>(undefined)

  const { data: mentors = [], isLoading, isError } = useQuery({
    queryKey: ['mentors', selectedTrack],
    queryFn: () => mentorService.getPublicMentors(selectedTrack),
  })

  const displayedMentors = selectedTrack
    ? mentors.filter((m) => m.track === selectedTrack)
    : mentors

  const countLabel = selectedTrack
    ? `${displayedMentors.length} mentor${displayedMentors.length !== 1 ? 's' : ''} in ${selectedTrack}`
    : `Showing ${displayedMentors.length} mentor${displayedMentors.length !== 1 ? 's' : ''}`

  return (
    <div className="flex flex-col">
      {/* ════════════════════════════════════════════════════════
          Section 1 — Hero
      ════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[55vh] flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center overflow-hidden bg-black">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 right-0 size-[500px] rounded-full bg-tekton-purple-bright/15 blur-[120px]" />
          <div className="absolute bottom-0 -left-20 size-[300px] rounded-full bg-tekton-teal/10 blur-[100px]" />
          <div className="absolute inset-0 bg-grid opacity-30" />
        </div>

        <div className="relative z-10 max-w-3xl flex flex-col items-center gap-6">
          <span className="inline-flex items-center rounded-full border border-tekton-purple-bright/40 bg-tekton-purple-bright/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-tekton-purple-bright">
            The People Behind the Growth
          </span>

          <h1 className="font-heading text-5xl text-white sm:text-6xl lg:text-7xl leading-tight">
            MEET YOUR{' '}
            <span className="gradient-text">MENTORS</span>
          </h1>

          {/* Stats pill */}
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/60 backdrop-blur-sm">
            <span className="font-heading text-2xl gradient-text">50+</span>
            <span>Expert Mentors across</span>
            <span className="font-semibold text-white">7 Tech Tracks</span>
          </div>

          <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-xl">
            Meet the experienced professionals who dedicate their time and expertise to guide the next
            generation of African tech talent. Each mentor is carefully vetted and matched to their track.
          </p>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 2 — Track Filter
      ════════════════════════════════════════════════════════ */}
      <section className="py-8 px-4 bg-black border-y border-white/[0.06]">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {/* All pill */}
            <button
              onClick={() => setSelectedTrack(undefined)}
              className={cn(
                'inline-flex shrink-0 items-center rounded-full border px-5 py-2 text-sm font-semibold transition-all smooth-hover',
                selectedTrack === undefined
                  ? 'bg-tekton-purple-bright border-tekton-purple-bright text-white glow-purple'
                  : 'glass-card border-white/15 text-white/50 hover:text-white hover:border-white/30',
              )}
            >
              All Mentors
            </button>

            {/* Track pills */}
            {TECH_TRACKS.map((track) => (
              <button
                key={track}
                onClick={() => setSelectedTrack(track)}
                className={cn(
                  'inline-flex shrink-0 items-center rounded-full border px-5 py-2 text-sm font-medium transition-all smooth-hover',
                  selectedTrack === track
                    ? 'bg-tekton-purple-bright border-tekton-purple-bright text-white glow-purple'
                    : 'glass-card border-white/15 text-white/50 hover:text-white hover:border-white/30',
                )}
              >
                {track.split(' (')[0].split('/')[0].trim()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 3 — Mentors Grid
      ════════════════════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-black">
        <div className="mx-auto max-w-7xl">
          {/* Result count */}
          {!isLoading && !isError && (
            <p className="mb-8 text-sm text-white/35 font-mono">{countLabel}</p>
          )}

          {/* Loading skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <MentorCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <p className="text-white/40 text-base">
                We couldn't load the mentors right now. Please try again later.
              </p>
            </div>
          )}

          {/* Mentor cards */}
          {!isLoading && !isError && displayedMentors.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {displayedMentors.map((mentor) => {
                const trackBadge = TRACK_BADGE_COLORS[mentor.track as TechTrack] ?? 'bg-white/10 text-white/60 border-white/20'
                const trackBanner = TRACK_BANNER_COLORS[mentor.track as TechTrack] ?? 'from-white/5 to-white/0'
                return (
                  <div
                    key={mentor.id}
                    className="glass-card rounded-2xl overflow-hidden smooth-hover hover:-translate-y-1
                      hover:border-tekton-purple-bright/30 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)]
                      transition-all flex flex-col"
                  >
                    {/* Gradient banner */}
                    <div className={`h-16 bg-gradient-to-r ${trackBanner}`} />

                    <div className="px-6 pb-6 flex flex-col items-center text-center gap-3 -mt-8 flex-1">
                      {/* Avatar */}
                      {mentor.profilePhotoUrl ? (
                        <img
                          src={mentor.profilePhotoUrl}
                          alt={mentor.name}
                          className="size-20 rounded-full object-cover ring-4 ring-black"
                        />
                      ) : (
                        <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-tekton-purple-bright to-tekton-purple-deep text-white text-xl font-heading ring-4 ring-black">
                          {getInitials(mentor.name)}
                        </div>
                      )}

                      {/* Name & title */}
                      <div className="flex flex-col gap-1 w-full">
                        <p className="font-heading text-xl text-white">{mentor.name}</p>
                        {mentor.title && (
                          <p className="text-sm text-white/50 truncate px-2">{mentor.title}</p>
                        )}
                      </div>

                      {/* Track badge */}
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${trackBadge}`}>
                        {mentor.track.split(' (')[0].split('/')[0].trim()}
                      </span>

                      {/* Bio */}
                      {mentor.bio && (
                        <p className="text-sm text-white/50 leading-relaxed line-clamp-2 text-left w-full flex-1">
                          {mentor.bio}
                        </p>
                      )}

                      {/* LinkedIn */}
                      {mentor.linkedinUrl && (
                        <a
                          href={mentor.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${mentor.name} on LinkedIn`}
                          className="mt-auto flex items-center gap-1.5 text-xs text-white/35 transition-colors hover:text-tekton-blue"
                        >
                          <Linkedin className="size-3.5" />
                          LinkedIn Profile
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && displayedMentors.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <div className="glass-card rounded-2xl px-8 py-10 max-w-md border-white/10">
                <p className="text-white/50 text-sm leading-relaxed">
                  No mentors found for the selected track yet.
                  We're actively recruiting experts in this area — check back soon!
                </p>
                <button
                  onClick={() => setSelectedTrack(undefined)}
                  className="mt-4 text-tekton-purple-bright text-sm hover:text-tekton-purple-bright/80 transition-colors flex items-center gap-1 mx-auto"
                >
                  View all mentors <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 4 — Become a Mentor CTA
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-white/[0.02]">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden glass-card rounded-3xl px-8 py-14 text-center border-glow-teal">
            {/* Decorative */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-10 -right-10 size-40 rounded-full bg-tekton-teal/10 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-tekton-purple-bright/10 blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-5">
              <span className="inline-flex items-center rounded-full border border-tekton-teal/30 bg-tekton-teal/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-tekton-teal">
                Join Our Team
              </span>
              <h2 className="font-heading text-4xl text-white sm:text-5xl">
                BECOME A <span className="gradient-text">MENTOR</span>
              </h2>
              <p className="text-white/55 text-sm sm:text-base leading-relaxed max-w-lg">
                Have 2+ years of industry experience and a passion for teaching? Join our growing network of
                mentors and help shape Africa's next generation of tech leaders.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-tekton-purple-bright px-8 text-white hover:bg-tekton-purple-bright/90 glow-purple font-semibold gap-2"
              >
                <Link to="/auth/register">
                  Apply as a Mentor
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
