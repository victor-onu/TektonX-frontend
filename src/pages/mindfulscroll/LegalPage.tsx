import type { ReactNode } from 'react'
import Layout from './Layout'

export { MINDFULSCROLL_CONTACT } from './Layout'

/** A section of a legal page: its anchor id and its "On this page" label. */
export type TocEntry = { id: string; label: string }

// Privacy policy and terms share this page: title, date, an optional
// plain-English summary, and an "On this page" list on wide screens. Google
// Play links to the privacy page, so its URL must stay stable.
export default function LegalPage({
  title,
  updated,
  summary,
  toc,
  children,
}: {
  title: string
  updated: string
  summary?: ReactNode
  toc: TocEntry[]
  children: ReactNode
}) {
  return (
    <Layout title={`${title} · MindfulScroll`}>
      <div className="ms-wrap ms-doc">
        <nav className="ms-toc" aria-label="On this page">
          <p>On this page</p>
          {toc.map((entry) => (
            <a key={entry.id} href={`#${entry.id}`}>
              {entry.label}
            </a>
          ))}
        </nav>
        <article>
          <h1>{title}</h1>
          <p className="ms-updated">Last updated {updated}</p>
          {summary && <div className="ms-summary">{summary}</div>}
          <div className="ms-prose">{children}</div>
        </article>
      </div>
    </Layout>
  )
}
