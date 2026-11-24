import Layout, { MINDFULSCROLL_CONTACT } from './Layout'

const FEATURES = [
  {
    title: 'Limits that hold',
    body: 'Set a time limit for each app, from 1 minute up. A warning comes first, then a short break.',
  },
  {
    title: 'Focus modes',
    body: 'Work and Sleep modes keep distracting apps closed on your schedule. Premium adds Study, Deep Focus and your own modes.',
  },
  {
    title: 'Streaks',
    body: 'Build focus days by taking breaks, staying under your usual time, or finishing a focus mode.',
  },
  {
    title: 'Hard to cheat',
    body: 'A PIN guards your settings, and optional uninstall protection stops impulse deletes.',
  },
  {
    title: 'Private by design',
    body: 'No account and no ads. Your usage data stays on your phone.',
  },
] as const

export default function MindfulScroll() {
  return (
    <Layout title="MindfulScroll: Break free from doomscrolling">
      <section className="ms-wrap ms-hero">
        <div>
          <span className="ms-badge">Android app</span>
          <h1>
            Break free from <span>doomscrolling.</span>
          </h1>
          <p className="ms-lede">
            A gentle pause when scrolling stops being a choice. Pick the apps that pull you in, set a limit, and take
            a short break when you reach it.
          </p>
          <p style={{ marginTop: 28 }}>
            <span className="ms-pill">Coming soon to Google Play</span>
          </p>
        </div>

        {/* The app's break screen, drawn rather than screenshotted. */}
        <div className="ms-phone" role="img" aria-label="MindfulScroll break screen: Instagram is resting for 10 minutes">
          <div className="ms-phone-screen">
            <svg width="96" height="48" viewBox="10 20 85 60" aria-hidden="true">
              <path
                d="M12 50 C17 26 25 26 29 50 S41 72 45 50 S55 34 59 50 S69 60 73 50 S83 47 90 50"
                fill="none"
                stroke="#35608A"
                strokeWidth="6.5"
                strokeLinecap="round"
              />
            </svg>
            <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22 }}>Time for a breath</span>
            <span style={{ fontSize: 14, color: '#4A5451', lineHeight: 1.5 }}>Instagram is resting for 10 minutes</span>
          </div>
        </div>
      </section>

      <section className="ms-wrap ms-features" aria-label="Features">
        {FEATURES.map((f) => (
          <div key={f.title} className="ms-card">
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </div>
        ))}
      </section>

      <section className="ms-wrap" style={{ paddingBottom: 72 }}>
        <p style={{ margin: 0, fontSize: 16, color: '#4A5451' }}>
          Questions or feedback? Write to <a href={`mailto:${MINDFULSCROLL_CONTACT}`}>{MINDFULSCROLL_CONTACT}</a>.
        </p>
      </section>
    </Layout>
  )
}
