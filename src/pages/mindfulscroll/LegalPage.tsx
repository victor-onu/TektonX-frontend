import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { eyebrowStyle } from '@/components/marketing/tokens'

export const MINDFULSCROLL_CONTACT = 'admin@tektonxlabs.com'

// Shared shell for the MindfulScroll app's public pages (product, privacy,
// terms). Google Play links to the privacy page, so it must stay a plain,
// readable document at a stable URL.
export default function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string
  title: string
  updated?: string
  children: ReactNode
}) {
  return (
    <div className="tx-marketing">
      <section
        style={{
          background:
            'radial-gradient(64% 58% at 72% 34%, rgba(168,85,247,0.10) 0%, rgba(250,248,246,0) 72%), #FAF8F6',
        }}
      >
        <div
          className="tx-marketing-rise"
          style={{ maxWidth: 820, margin: '0 auto', padding: '72px 24px 32px' }}
        >
          <span style={eyebrowStyle}>{eyebrow}</span>
          <h1 style={{ fontSize: 'clamp(44px,6vw,76px)', lineHeight: 0.95, color: '#0E0B12', marginTop: 14 }}>
            {title}
          </h1>
          {updated && (
            <p style={{ marginTop: 16, fontSize: 15, color: '#5B5563' }}>Last updated {updated}</p>
          )}
        </div>
      </section>
      <article className="tx-legal" style={{ maxWidth: 820, margin: '0 auto', padding: '16px 24px 96px' }}>
        {children}
        <nav
          aria-label="MindfulScroll pages"
          style={{
            marginTop: 56,
            paddingTop: 24,
            borderTop: '1px solid rgba(20,17,24,0.10)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 20,
            fontSize: 15,
          }}
        >
          <Link to="/mindfulscroll">MindfulScroll</Link>
          <Link to="/mindfulscroll/privacy">Privacy Policy</Link>
          <Link to="/mindfulscroll/terms">Terms of Use</Link>
          <a href={`mailto:${MINDFULSCROLL_CONTACT}`}>{MINDFULSCROLL_CONTACT}</a>
        </nav>
      </article>
    </div>
  )
}
