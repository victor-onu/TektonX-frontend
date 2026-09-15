import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

// Shared building blocks for the Home ("/") and About ("/about") community
// redesign — kept together since both pages reuse the same stat cards,
// buttons and icon-badge treatment from the design handoff. Plain constants
// (e.g. `eyebrowStyle`) live in `./tokens` instead of here so this file only
// exports components (react-refresh requires that for fast refresh).

// Renders a same-page anchor as a plain `<a>` (so the browser's native
// hash-scroll applies) and a cross-page anchor (e.g. `/#programs` from the
// About page) as a router `<Link>` (so it's a client-side transition, with
// `useScrollToHash` landing on the section once the new page has mounted).
export function HashLink({
  href,
  className,
  style,
  children,
}: {
  href: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  if (href.startsWith('#')) {
    return (
      <a href={href} className={className} style={style}>
        {children}
      </a>
    )
  }
  return (
    <Link to={href} className={className} style={style}>
      {children}
    </Link>
  )
}

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(20,17,24,0.06)',
        borderRadius: 18,
        padding: '30px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 54, lineHeight: 0.85, color: '#141118' }}>
        {value}
      </span>
      <span style={{ fontSize: 14, color: '#5C5661', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  )
}

export function DarkButton({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="tx-btn-dark"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        background: '#141118',
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 600,
        padding: '17px 30px',
        borderRadius: 10,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Link>
  )
}

export function IconBadge({
  Icon,
  gradient,
  shadowColor,
  size = 'lg',
}: {
  Icon: LucideIcon
  gradient: string
  shadowColor: string
  size?: 'lg' | 'sm'
}) {
  const outer = size === 'lg' ? 58 : 50
  const back = size === 'lg' ? 45 : 39
  const backTop = size === 'lg' ? 7 : 6
  const front = size === 'lg' ? 50 : 43
  const backRadius = size === 'lg' ? 14 : 12
  const frontRadius = size === 'lg' ? 16 : 14
  const iconSize = size === 'lg' ? 24 : 21
  const blur = size === 'lg' ? '12px 23px' : '10px 20px'

  return (
    <span style={{ position: 'relative', display: 'block', width: outer, height: outer, flexShrink: 0 }}>
      <span
        style={{
          position: 'absolute',
          right: 0,
          top: backTop,
          width: back,
          height: back,
          borderRadius: backRadius,
          background: gradient,
          opacity: 0.38,
          transform: 'rotate(16deg)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: front,
          height: front,
          borderRadius: frontRadius,
          background: gradient,
          boxShadow: `0 ${blur} ${shadowColor}, inset 0 1px 0 rgba(255,255,255,0.5)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={iconSize} color="#FFFFFF" />
      </span>
    </span>
  )
}

// The full-width purple "Join" panel used at the bottom of both pages —
// identical gradient/shape, only the heading, copy and two CTAs differ.
export function JoinPanel({
  heading,
  headingMaxCh,
  body,
  bodyMaxCh,
  align = 'center',
  primary,
  secondary,
}: {
  heading: ReactNode
  headingMaxCh: string
  body: string
  bodyMaxCh: string
  align?: 'center' | 'flex-start'
  primary: { to: string; label: string }
  secondary: { to: string; label: string }
}) {
  return (
    <section id="join" style={{ padding: '120px 28px 0' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 28,
            background: 'linear-gradient(120deg,#4C1D95 0%,#7C3AED 55%,#C026D3 100%)',
            padding: 'clamp(48px,7vw,96px) clamp(28px,5vw,72px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: align,
            textAlign: align === 'center' ? 'center' : 'left',
            gap: 26,
            boxShadow: '0 30px 70px rgba(76,29,149,0.28)',
          }}
        >
          <h2 style={{ fontSize: 'clamp(42px,6vw,86px)', lineHeight: 0.9, color: '#FFFFFF', maxWidth: headingMaxCh }}>
            {heading}
          </h2>
          <p style={{ fontSize: 19, lineHeight: 1.6, color: '#FFFFFF', maxWidth: bodyMaxCh, margin: 0 }}>{body}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
            <Link
              to={primary.to}
              className="tx-btn-white-purple"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: '#FFFFFF',
                color: '#4C1D95',
                fontSize: 16,
                fontWeight: 700,
                padding: '17px 32px',
                borderRadius: 10,
              }}
            >
              {primary.label}
            </Link>
            <Link
              to={secondary.to}
              className="tx-btn-translucent"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(255,255,255,0.12)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.55)',
                fontSize: 16,
                fontWeight: 700,
                padding: '17px 32px',
                borderRadius: 10,
              }}
            >
              {secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
