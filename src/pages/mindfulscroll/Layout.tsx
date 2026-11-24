import { useEffect, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './mindfulscroll.css'

export const MINDFULSCROLL_CONTACT = 'admin@tektonxlabs.com'

/** The app icon: the calm wave on blue, from the app's assets/brand. */
export function MindfulScrollMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <rect width="100" height="100" rx="22" fill="#35608A" />
      <g transform="translate(50 50) scale(0.74) translate(-51 -50)">
        <path
          d="M12 50 C17 26 25 26 29 50 S41 72 45 50 S55 34 59 50 S69 60 73 50 S83 47 90 50"
          fill="none"
          stroke="#F6F1E7"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

// Standalone shell for the MindfulScroll app's pages: the app's own brand up
// top, with TektonX credited only in the footer. Rendered outside the TektonX
// layouts in App.tsx.
export default function Layout({ title, children }: { title: string; children: ReactNode }) {
  useEffect(() => {
    document.title = title
  }, [title])

  return (
    <div className="ms-site">
      <header className="ms-header">
        <div className="ms-wrap">
          <Link to="/mindfulscroll" className="ms-brand">
            <MindfulScrollMark />
            MindfulScroll
          </Link>
          <nav className="ms-nav" aria-label="MindfulScroll">
            <NavLink to="/mindfulscroll" end className="ms-nav-text">
              Features
            </NavLink>
            <NavLink to="/mindfulscroll/privacy">Privacy</NavLink>
            <NavLink to="/mindfulscroll/terms">Terms</NavLink>
          </nav>
        </div>
      </header>

      <main className="ms-main">{children}</main>

      <footer className="ms-footer">
        <div className="ms-wrap">
          <div className="ms-footer-links">
            <Link to="/mindfulscroll/privacy">Privacy Policy</Link>
            <Link to="/mindfulscroll/terms">Terms of Use</Link>
            <a href={`mailto:${MINDFULSCROLL_CONTACT}`}>{MINDFULSCROLL_CONTACT}</a>
          </div>
          <div className="ms-credit">
            A product of
            <a href="https://www.tektonxlabs.com">
              <img src="/logo-purple-mark.svg" alt="" width={16} height={16} />
              TektonX
            </a>
            · © 2026
          </div>
        </div>
      </footer>
    </div>
  )
}
