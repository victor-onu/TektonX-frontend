import LegalPage, { MINDFULSCROLL_CONTACT } from './LegalPage'

const mail = <a href={`mailto:${MINDFULSCROLL_CONTACT}`}>{MINDFULSCROLL_CONTACT}</a>

const TOC = [
  { id: 'what-we-store', label: 'What we store' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'purchases', label: 'Purchases' },
  { id: 'what-we-dont-do', label: 'What we don’t do' },
  { id: 'backups', label: 'Backups' },
  { id: 'your-choices', label: 'Your choices' },
  { id: 'children', label: 'Children' },
  { id: 'changes', label: 'Changes' },
  { id: 'contact', label: 'Contact' },
]

export default function MindfulScrollPrivacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="November 24, 2026"
      toc={TOC}
      summary="The short version: your usage data stays on your phone, we never see it, and we don't sell anything about you."
    >
      <p>
        MindfulScroll is an Android app that helps you notice and interrupt doomscrolling. It is made by TektonX
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;). This policy explains what the app does with your information.
      </p>

      <h2 id="what-we-store">What MindfulScroll stores on your phone</h2>
      <p>To set limits, show breaks and track your progress, the app keeps the following in a database on your device:</p>
      <ul>
        <li>The apps you choose to protect (their names and package names) and the limits you set for them.</li>
        <li>When you open and leave those apps and how long each visit lasts.</li>
        <li>Breaks the app shows, whether you completed them, and any extra time you asked for, including an optional reason you type.</li>
        <li>Your focus modes and their schedules, daily summaries, and your focus streaks.</li>
        <li>Your settings, and your PIN as a salted one-way hash. The PIN itself is never stored.</li>
      </ul>
      <p>
        Some short-term signals used to spot long scrolling sessions are deleted automatically after 90 days. None of
        this is sent to us or to anyone else, and there is no MindfulScroll account.
      </p>

      <h2 id="permissions">Permissions and why we ask for them</h2>
      <ul>
        <li>
          <strong>Usage access</strong> lets the app see how long you spend in the apps you chose to protect.
        </li>
        <li>
          <strong>Accessibility service (&ldquo;App Intervention&rdquo;)</strong> tells the app which app is in front,
          so it can show a break the moment a limit is reached. It only receives the name of the app that comes to the
          front. It cannot read what is on your screen, what you type, your messages or your passwords. It is optional;
          without it the app runs in a lighter mode.
        </li>
        <li>
          <strong>Display over other apps and notifications</strong> are used to show break screens and warnings before
          a limit is reached.
        </li>
        <li>
          <strong>Device admin (uninstall protection)</strong> is optional and only makes it harder to uninstall the app
          on impulse. It uses no other device-admin powers: it cannot wipe, lock or read your phone.
        </li>
        <li>
          <strong>Fingerprint or face unlock</strong> is optional and handled by Android. The app only learns whether
          the check passed; it never receives your biometric data.
        </li>
      </ul>

      <h2 id="purchases">Purchases</h2>
      <p>
        If you subscribe to MindfulScroll Premium, Google Play handles the payment. We never see your card or payment
        details. To confirm your subscription, the app uses RevenueCat, a subscription service. RevenueCat receives a
        random identifier created for your install, your purchase details from Google Play (such as the plan, price,
        currency and renewal dates) and basic technical details such as your device&rsquo;s operating system version
        and country. It does not receive your app usage data. You can read{' '}
        <a href="https://www.revenuecat.com/privacy" target="_blank" rel="noreferrer">
          RevenueCat&rsquo;s privacy policy
        </a>{' '}
        and{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
          Google&rsquo;s privacy policy
        </a>
        .
      </p>

      <h2 id="what-we-dont-do">What we don&rsquo;t do</h2>
      <ul>
        <li>We don&rsquo;t show ads, and we don&rsquo;t use advertising or analytics SDKs.</li>
        <li>We don&rsquo;t sell, rent or share your information for advertising.</li>
        <li>We don&rsquo;t read the content of other apps.</li>
      </ul>

      <h2 id="backups">Backups</h2>
      <p>
        If Android backup is turned on, Android may include MindfulScroll&rsquo;s data in your own Google account
        backup, so it can be restored on a new phone. That backup belongs to you and is managed by Google; we
        can&rsquo;t access it. You can turn backup off in your phone&rsquo;s settings.
      </p>

      <h2 id="your-choices">Your choices</h2>
      <ul>
        <li>
          <strong>See your data:</strong> Settings &rsaquo; Export data saves a copy of everything the app stores.
        </li>
        <li>
          <strong>Delete your data:</strong> use Settings &rsaquo; Delete all data in the app, uninstall it, or clear
          its storage in Android settings. Because we
          don&rsquo;t hold your usage data, there is nothing more to delete on our side. For purchase records held by
          RevenueCat, email us and we&rsquo;ll ask for them to be deleted.
        </li>
        <li>
          <strong>Turn permissions off</strong> at any time in Android settings. Some features stop working without
          them.
        </li>
      </ul>
      <p>
        Depending on where you live, laws such as the Nigeria Data Protection Act 2023 or the GDPR give you rights to
        access, correct or delete personal data and to object to its use. Email {mail} to use them.
      </p>

      <h2 id="children">Children</h2>
      <p>
        MindfulScroll is not directed at children under 13, and we don&rsquo;t knowingly collect personal information
        from them.
      </p>

      <h2 id="changes">Changes</h2>
      <p>
        If we change how the app handles information, we will update this page and the date above. If a change is
        significant, such as starting to collect new information, we&rsquo;ll also tell you in the app before it takes
        effect.
      </p>

      <h2 id="contact">Contact</h2>
      <p>Questions about privacy or this policy: {mail}.</p>
    </LegalPage>
  )
}
