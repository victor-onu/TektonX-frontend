import type { CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { HashLink } from '@/components/marketing/ui'
import logoBlackHorizontal from '@/assets/marketing/logo-black-horizontal.svg'

export default function MarketingHeader() {
  const location = useLocation()
  const isAbout = location.pathname === '/about'
  // "Programs" is a same-page anchor-scroll (`#programs`) from the Home page
  // itself, or a cross-page link to `/#programs` from anywhere else.
  const programsHref = location.pathname === '/' ? '#programs' : '/#programs'

  const navLinkStyle: CSSProperties = {
    fontSize: 14,
    fontWeight: 500,
    color: '#413B47',
    whiteSpace: 'nowrap',
    flex: '0 0 auto',
  }

  return (
    <header
      className="tx-marketing"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(20,17,24,0.07)',
      }}
    >
      <div
        className="tx-marketing-head"
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '10px 24px',
          minHeight: 82,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px 18px',
          flexWrap: 'wrap',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <img
            src={logoBlackHorizontal}
            alt="TektonX"
            style={{ width: 92, height: 52, objectFit: 'contain', objectPosition: 'left center', display: 'block' }}
          />
        </Link>

        <nav
          className="tx-marketing-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            minWidth: 0,
            flex: '1 1 auto',
            overflowX: 'auto',
            padding: '4px 0',
          }}
        >
          <Link
            to="/about"
            style={{ ...navLinkStyle, color: isAbout ? '#7C3AED' : '#413B47' }}
            className="tx-hover-accent"
          >
            About
          </Link>
          <HashLink href={programsHref} style={navLinkStyle} className="tx-hover-accent">
            Programs
          </HashLink>
          <Link to="/mentors" style={navLinkStyle} className="tx-hover-accent">
            Our Mentors
          </Link>
          <Link to="/join" style={navLinkStyle} className="tx-hover-accent">
            Join Community
          </Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <Link to="/auth/login" style={navLinkStyle} className="tx-hover-accent">
            Sign in
          </Link>
          <Link
            to="/auth/register"
            className="tx-cta-gradient"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#FFFFFF',
              background: 'linear-gradient(100deg,#7C3AED,#C026D3)',
              padding: '12px 18px',
              whiteSpace: 'nowrap',
              borderRadius: 8,
              boxShadow: '0 6px 18px rgba(124,58,237,0.28)',
              display: 'inline-block',
            }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
