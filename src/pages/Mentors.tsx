import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Linkedin, ArrowRight } from 'lucide-react'
import { DarkButton } from '@/components/marketing/ui'
import { eyebrowStyle } from '@/components/marketing/tokens'
import { getInitials } from '@/lib/utils'
import { TECH_TRACKS } from '@/types'
import mentorService from '@/services/mentorService'
import type { TechTrack } from '@/types'

// ─── Track color map ──────────────────────────────────────────────────────────
// Reuses the exact gradient/shadow pairs already established for icon badges
// on Home/About (see PROGRAMS/VALUES in `Index.tsx`) rather than introducing
// new hues — there happen to be exactly 8 distinct pairs across those two
// arrays, one per tech track.

const TRACK_STYLES: Record<TechTrack, { gradient: string; shadowColor: string; badgeText: string; badgeBg: string }> = {
  'Software Development (Frontend & Backend)': {
    gradient: 'linear-gradient(150deg,#A855F7,#6D28D9)',
    shadowColor: 'rgba(124,58,237,0.34)',
    badgeText: '#6D28D9',
    badgeBg: 'rgba(124,58,237,0.1)',
  },
  'UI/UX Design': {
    gradient: 'linear-gradient(150deg,#2DD4BF,#0E7490)',
    shadowColor: 'rgba(14,116,144,0.30)',
    badgeText: '#0E7490',
    badgeBg: 'rgba(14,116,144,0.1)',
  },
  'Mobile App Development': {
    gradient: 'linear-gradient(150deg,#60A5FA,#1D4ED8)',
    shadowColor: 'rgba(29,78,216,0.30)',
    badgeText: '#1D4ED8',
    badgeBg: 'rgba(29,78,216,0.1)',
  },
  'Product/Project Management': {
    gradient: 'linear-gradient(150deg,#F59E0B,#B45309)',
    shadowColor: 'rgba(217,119,6,0.30)',
    badgeText: '#B45309',
    badgeBg: 'rgba(217,119,6,0.1)',
  },
  'Quality Assurance (QA)': {
    gradient: 'linear-gradient(150deg,#34D399,#0F766E)',
    shadowColor: 'rgba(16,185,129,0.32)',
    badgeText: '#0F766E',
    badgeBg: 'rgba(16,185,129,0.1)',
  },
  'Data (Analysis/Science)': {
    gradient: 'linear-gradient(150deg,#C084FC,#7C3AED)',
    shadowColor: 'rgba(124,58,237,0.32)',
    badgeText: '#7C3AED',
    badgeBg: 'rgba(124,58,237,0.1)',
  },
  'Cybersecurity': {
    gradient: 'linear-gradient(150deg,#E879F9,#A21CAF)',
    shadowColor: 'rgba(192,38,211,0.30)',
    badgeText: '#A21CAF',
    badgeBg: 'rgba(192,38,211,0.1)',
  },
  'Web3': {
    gradient: 'linear-gradient(150deg,#60A5FA,#4338CA)',
    shadowColor: 'rgba(67,56,202,0.30)',
    badgeText: '#4338CA',
    badgeBg: 'rgba(67,56,202,0.1)',
  },
}

const FALLBACK_STYLE = { gradient: 'linear-gradient(150deg,#A3A3A3,#525252)', shadowColor: 'rgba(20,17,24,0.2)', badgeText: '#413B47', badgeBg: 'rgba(20,17,24,0.06)' }

function trackLabel(track: string) {
  return track.split(' (')[0].split('/')[0].trim()
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function MentorCardSkeleton() {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid rgba(20,17,24,0.06)', borderRadius: 22, overflow: 'hidden' }}>
      <div className="tx-skeleton" style={{ height: 64, borderRadius: 0 }} />
      <div style={{ padding: '0 24px 24px', marginTop: -32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div className="tx-skeleton" style={{ width: 80, height: 80, borderRadius: 999, border: '4px solid #FFFFFF' }} />
        <div className="tx-skeleton" style={{ width: 130, height: 16 }} />
        <div className="tx-skeleton" style={{ width: 90, height: 12 }} />
        <div className="tx-skeleton" style={{ width: 80, height: 20, borderRadius: 999 }} />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="tx-skeleton" style={{ width: '100%', height: 12 }} />
          <div className="tx-skeleton" style={{ width: '85%', height: 12 }} />
          <div className="tx-skeleton" style={{ width: '65%', height: 12 }} />
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

  // Independent of the track filter above — always the full unfiltered list,
  // used solely to show an accurate total in the hero stat.
  const { data: totalMentors = [], isLoading: isLoadingTotal, isError: isErrorTotal } = useQuery({
    queryKey: ['mentors', 'all'],
    queryFn: () => mentorService.getPublicMentors(),
  })

  const displayedMentors = selectedTrack
    ? mentors.filter((m) => m.track === selectedTrack)
    : mentors

  const countLabel = selectedTrack
    ? `${displayedMentors.length} mentor${displayedMentors.length !== 1 ? 's' : ''} in ${selectedTrack}`
    : `Showing ${displayedMentors.length} mentor${displayedMentors.length !== 1 ? 's' : ''}`

  return (
    <div className="tx-marketing">
      {/* ════════════════════════════════════════════════════════
          Section 1 — Hero
      ════════════════════════════════════════════════════════ */}
      <section
        id="mentors-hero"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(70% 62% at 50% 32%, rgba(168,85,247,0.14) 0%, rgba(250,248,246,0) 72%), #FAF8F6',
        }}
      >
        <div
          className="tx-marketing-rise"
          style={{
            maxWidth: 900,
            margin: '0 auto',
            padding: '100px 28px 72px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 26,
          }}
        >
          <span style={eyebrowStyle}>The People Behind the Growth</span>

          <h1 style={{ fontSize: 'clamp(52px,7vw,96px)', lineHeight: 0.9, color: '#0E0B12' }}>
            MEET YOUR{' '}
            <span
              style={{
                background: 'linear-gradient(100deg,#7C3AED,#C026D3)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              MENTORS
            </span>
          </h1>

          {/* Stats pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: '#FFFFFF',
              border: '1px solid rgba(20,17,24,0.08)',
              borderRadius: 999,
              padding: '13px 22px',
              boxShadow: '0 6px 20px rgba(20,17,24,0.06)',
            }}
          >
            {isLoadingTotal ? (
              <span className="tx-skeleton" style={{ display: 'inline-block', width: 28, height: 24 }} />
            ) : (
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 24,
                  lineHeight: 1,
                  background: 'linear-gradient(100deg,#7C3AED,#C026D3)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {isErrorTotal ? '—' : totalMentors.length}
              </span>
            )}
            <span style={{ fontSize: 15, color: '#5C5661' }}>Expert Mentors across</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#141118' }}>8 Tech Tracks</span>
          </div>

          <p style={{ fontSize: 18, lineHeight: 1.7, color: '#5C5661', maxWidth: '58ch', margin: 0 }}>
            Meet the experienced professionals who dedicate their time and expertise to guide the next generation
            of African tech talent. Each mentor is carefully vetted and matched to their track.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 2 — Track Filter
      ════════════════════════════════════════════════════════ */}
      <section style={{ background: '#FFFFFF', borderTop: '1px solid rgba(20,17,24,0.07)', borderBottom: '1px solid rgba(20,17,24,0.07)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '20px 28px' }}>
          <div className="tx-marketing-nav" style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
            {/* All pill */}
            <button
              onClick={() => setSelectedTrack(undefined)}
              style={{
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: 999,
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                border: selectedTrack === undefined ? 'none' : '1px solid rgba(20,17,24,0.1)',
                background: selectedTrack === undefined ? 'linear-gradient(100deg,#7C3AED,#C026D3)' : '#FFFFFF',
                color: selectedTrack === undefined ? '#FFFFFF' : '#413B47',
                boxShadow: selectedTrack === undefined ? '0 6px 18px rgba(124,58,237,0.28)' : 'none',
              }}
            >
              All Mentors
            </button>

            {/* Track pills */}
            {TECH_TRACKS.map((track) => {
              const active = selectedTrack === track
              return (
                <button
                  key={track}
                  onClick={() => setSelectedTrack(track)}
                  style={{
                    flexShrink: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    borderRadius: 999,
                    padding: '10px 20px',
                    fontSize: 14,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    border: active ? 'none' : '1px solid rgba(20,17,24,0.1)',
                    background: active ? 'linear-gradient(100deg,#7C3AED,#C026D3)' : '#FFFFFF',
                    color: active ? '#FFFFFF' : '#413B47',
                    boxShadow: active ? '0 6px 18px rgba(124,58,237,0.28)' : 'none',
                  }}
                >
                  {trackLabel(track)}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 3 — Mentors Grid
      ════════════════════════════════════════════════════════ */}
      <section style={{ padding: '72px 28px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          {/* Result count */}
          {!isLoading && !isError && (
            <p style={{ marginBottom: 32, fontSize: 14, color: '#7A737F', fontFamily: 'monospace' }}>{countLabel}</p>
          )}

          {/* Loading skeletons */}
          {isLoading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 22 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <MentorCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '80px 0', textAlign: 'center' }}>
              <p style={{ fontSize: 16, color: '#7A737F' }}>
                We couldn&apos;t load the mentors right now. Please try again later.
              </p>
            </div>
          )}

          {/* Mentor cards */}
          {!isLoading && !isError && displayedMentors.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 22 }}>
              {displayedMentors.map((mentor) => {
                const style = TRACK_STYLES[mentor.track as TechTrack] ?? FALLBACK_STYLE
                return (
                  <article
                    key={mentor.id}
                    className="tx-card-hover"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(20,17,24,0.06)',
                      borderRadius: 22,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: 0,
                    }}
                  >
                    {/* Gradient banner */}
                    <div style={{ height: 64, background: style.gradient }} />

                    <div style={{ padding: '0 24px 28px', marginTop: -32, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, flex: '1 1 auto' }}>
                      {/* Avatar */}
                      {mentor.profilePhotoUrl ? (
                        <img
                          src={mentor.profilePhotoUrl}
                          alt={mentor.name}
                          style={{ width: 80, height: 80, borderRadius: 999, objectFit: 'cover', border: '4px solid #FFFFFF', boxShadow: '0 6px 18px rgba(20,17,24,0.12)' }}
                        />
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 80,
                            height: 80,
                            borderRadius: 999,
                            border: '4px solid #FFFFFF',
                            boxShadow: '0 6px 18px rgba(20,17,24,0.12)',
                            background: style.gradient,
                            color: '#FFFFFF',
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: 22,
                          }}
                        >
                          {getInitials(mentor.name)}
                        </div>
                      )}

                      {/* Name & title */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: '0.02em', color: '#141118' }}>{mentor.name}</p>
                        {mentor.title && (
                          <p style={{ fontSize: 14, color: '#7A737F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 8px' }}>{mentor.title}</p>
                        )}
                      </div>

                      {/* Track badge */}
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          borderRadius: 999,
                          padding: '5px 14px',
                          fontSize: 12,
                          fontWeight: 700,
                          background: style.badgeBg,
                          color: style.badgeText,
                        }}
                      >
                        {trackLabel(mentor.track)}
                      </span>

                      {/* Bio */}
                      {mentor.bio && (
                        <p
                          style={{
                            fontSize: 14,
                            lineHeight: 1.6,
                            color: '#5C5661',
                            textAlign: 'left',
                            width: '100%',
                            flex: '1 1 auto',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
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
                          className="tx-hover-accent"
                          style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#7A737F' }}
                        >
                          <Linkedin size={14} />
                          LinkedIn Profile
                        </a>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && displayedMentors.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '80px 0', textAlign: 'center' }}>
              <div style={{ background: '#FFFFFF', border: '1px solid rgba(20,17,24,0.06)', borderRadius: 22, padding: '40px 32px', maxWidth: 440 }}>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: '#5C5661', margin: 0 }}>
                  No mentors found for the selected track yet. We&apos;re actively recruiting experts in this area
                  — check back soon!
                </p>
                <button
                  onClick={() => setSelectedTrack(undefined)}
                  className="tx-hover-accent"
                  style={{
                    marginTop: 16,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 14,
                    color: '#7C3AED',
                    fontWeight: 600,
                  }}
                >
                  View all mentors <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 4 — Become a Mentor CTA
      ════════════════════════════════════════════════════════ */}
      <section style={{ padding: '48px 28px 120px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(20,17,24,0.06)',
              borderRadius: 28,
              padding: 'clamp(40px,6vw,72px) clamp(28px,5vw,56px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 20,
              boxShadow: '0 24px 60px rgba(20,17,24,0.08)',
            }}
          >
            <span style={eyebrowStyle}>Join Our Team</span>
            <h2 style={{ fontSize: 'clamp(38px,4.6vw,58px)', lineHeight: 0.95, color: '#141118' }}>
              BECOME A{' '}
              <span
                style={{
                  background: 'linear-gradient(100deg,#7C3AED,#C026D3)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                MENTOR
              </span>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: '#5C5661', maxWidth: '52ch', margin: 0 }}>
              Have 2+ years of industry experience and a passion for teaching? Join our growing network of mentors
              and help shape Africa&apos;s next generation of tech leaders.
            </p>
            <DarkButton to="/auth/register">
              Apply as a Mentor <ArrowRight size={16} />
            </DarkButton>
          </div>
        </div>
      </section>
    </div>
  )
}
