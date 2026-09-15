import type { CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Linkedin, Twitter, Instagram, Facebook, Mail, ArrowUpRight } from 'lucide-react'

import { HashLink } from '@/components/marketing/ui'
import logoBlackHorizontal from '@/assets/marketing/logo-black-horizontal.svg'

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/tektonx-labs', Icon: Linkedin },
  { label: 'Twitter', href: 'https://x.com/TektonXLab', Icon: Twitter },
  { label: 'Instagram', href: 'https://www.instagram.com/tektonxlabs/', Icon: Instagram },
  { label: 'Facebook', href: 'https://www.facebook.com/tektonXlabs', Icon: Facebook },
] as const

const PROGRAM_LABELS = [
  'Campus to Tech Careers',
  'Code for Growth',
  'Competitions',
  'TektonX Hub',
  'Tech Pathways',
] as const

const footerLinkStyle: CSSProperties = { fontSize: 15, color: '#5C5661' }
const columnHeadingStyle: CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 17,
  fontWeight: 600,
  color: '#141118',
  letterSpacing: 0,
}

export default function MarketingFooter() {
  const location = useLocation()
  const onHome = location.pathname === '/'
  const programsHref = onHome ? '#programs' : '/#programs'
  const aboutHref = onHome ? '#about' : '#story'

  return (
    <footer style={{ marginTop: 120, borderTop: '1px solid rgba(20,17,24,0.07)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '72px 28px 40px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(178px,1fr))',
            gap: 40,
          }}
        >
          {/* Column 1 — Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
            <img
              src={logoBlackHorizontal}
              alt="TektonX"
              style={{ width: 104, height: 58, objectFit: 'contain', objectPosition: 'left center', display: 'block' }}
            />
            <p style={{ fontSize: 16, lineHeight: 1.65, color: '#5C5661', margin: 0, maxWidth: '34ch' }}>
              Building People. Building Products. Building Africa.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tx-social"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    border: '1px solid rgba(20,17,24,0.1)',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#413B47',
                  }}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Programs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
            <h4 style={columnHeadingStyle}>Programs</h4>
            {PROGRAM_LABELS.map((label) => (
              <HashLink key={label} href={programsHref} style={footerLinkStyle} className="tx-footer-link">
                {label}
              </HashLink>
            ))}
          </div>

          {/* Column 3 — Company */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
            <h4 style={columnHeadingStyle}>Company</h4>
            <HashLink href={aboutHref} style={footerLinkStyle} className="tx-footer-link">
              About us
            </HashLink>
            <Link to="/mentors" style={footerLinkStyle} className="tx-footer-link">
              Our Mentors
            </Link>
            <Link to="/partnerships" style={footerLinkStyle} className="tx-footer-link">
              Partners
            </Link>
            <Link to="/join" style={footerLinkStyle} className="tx-footer-link">
              Join Community
            </Link>
            <a href="mailto:tektonxlabs@gmail.com" style={footerLinkStyle} className="tx-footer-link">
              Contact
            </a>
          </div>

          {/* Column 4 — Join the community (no newsletter backend exists; this
              is a reframed "join" CTA, not a subscribe form) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
            <h4 style={columnHeadingStyle}>Join the community</h4>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: '#5C5661', margin: 0 }}>
              Event dates, competitions and community news — shared inside the community you join, not another
              inbox subscription.
            </p>
            <Link
              to="/join"
              className="tx-cta-gradient"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                alignSelf: 'flex-start',
                background: 'linear-gradient(100deg,#7C3AED,#C026D3)',
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 600,
                padding: '14px 24px',
                borderRadius: 10,
                boxShadow: '0 6px 18px rgba(124,58,237,0.28)',
              }}
            >
              Join the community <ArrowUpRight size={16} />
            </Link>
            <a
              href="mailto:tektonxlabs@gmail.com"
              style={{ fontSize: 15, color: '#5C5661', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              className="tx-footer-link"
            >
              <Mail size={16} /> tektonxlabs@gmail.com
            </a>
          </div>
        </div>

        <div
          style={{
            marginTop: 56,
            paddingTop: 24,
            borderTop: '1px solid rgba(20,17,24,0.07)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
          }}
        >
          <span style={{ fontSize: 14, color: '#7A737F' }}>&copy; 2026 TektonX. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 18 }}>
            <a href="#top" style={{ fontSize: 14, color: '#7A737F' }} className="tx-footer-link">
              Terms &amp; Conditions
            </a>
            <a href="#top" style={{ fontSize: 14, color: '#7A737F' }} className="tx-footer-link">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px', overflow: 'hidden' }}>
        <svg viewBox="0 0 1000 150" role="presentation" style={{ display: 'block', width: '100%', height: 'auto', userSelect: 'none' }}>
          <defs>
            <linearGradient id="tx-footer-wordmark-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7C3AED" stopOpacity="0.24" />
              <stop offset="1" stopColor="#C026D3" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <text
            x="500"
            y="128"
            textAnchor="middle"
            fontFamily="Bebas Neue, sans-serif"
            fontSize="165"
            letterSpacing="6"
            fill="url(#tx-footer-wordmark-gradient)"
          >
            TEKTONX
          </text>
        </svg>
      </div>
    </footer>
  )
}
