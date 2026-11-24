import LegalPage, { MINDFULSCROLL_CONTACT } from './LegalPage'

export default function MindfulScroll() {
  return (
    <LegalPage eyebrow="An app by TektonX" title="MindfulScroll: Beat Doomscroll">
      <p style={{ fontSize: 20, lineHeight: 1.5, color: '#141118' }}>
        MindfulScroll gives you a gentle pause when scrolling stops being a choice. Pick the apps that pull you in, set
        a limit, and take a short break when you reach it.
      </p>

      <h2>What it does</h2>
      <ul>
        <li>
          <strong>Limits that hold.</strong> Set a time limit for each app, from 1 minute up. A warning comes first,
          then a short break.
        </li>
        <li>
          <strong>Focus modes.</strong> Work and Sleep modes keep distracting apps closed on your schedule. Premium adds
          Study, Deep Focus and your own custom modes.
        </li>
        <li>
          <strong>Streaks.</strong> Build focus days by taking breaks, staying under your usual time, or finishing a
          focus mode.
        </li>
        <li>
          <strong>Hard to cheat.</strong> A PIN guards your settings and optional uninstall protection stops impulse
          deletes.
        </li>
        <li>
          <strong>Private by design.</strong> No account, no ads. Your usage data stays on your phone.
        </li>
      </ul>

      <h2>Availability</h2>
      <p>MindfulScroll is coming soon to Google Play for Android.</p>

      <h2>Support</h2>
      <p>
        Questions, problems or feedback: <a href={`mailto:${MINDFULSCROLL_CONTACT}`}>{MINDFULSCROLL_CONTACT}</a>.
      </p>
    </LegalPage>
  )
}
