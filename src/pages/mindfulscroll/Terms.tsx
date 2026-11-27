import { Link } from 'react-router-dom'
import LegalPage, { MINDFULSCROLL_CONTACT } from './LegalPage'

const mail = <a href={`mailto:${MINDFULSCROLL_CONTACT}`}>{MINDFULSCROLL_CONTACT}</a>

const TOC = [
  { id: 'what-it-is', label: 'What it is' },
  { id: 'free-and-premium', label: 'Free and Premium' },
  { id: 'using-the-app', label: 'Using the app' },
  { id: 'ownership', label: 'Ownership' },
  { id: 'liability', label: 'Liability' },
  { id: 'changes', label: 'Changes' },
  { id: 'law', label: 'Law' },
  { id: 'contact', label: 'Contact' },
]

export default function MindfulScrollTerms() {
  return (
    <LegalPage
      title="Terms of Use"
      updated="November 27, 2026"
      toc={TOC}
    >
      <p>
        These terms apply to the MindfulScroll app, made by TektonX (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By installing
        or using the app you agree to them. Our <Link to="/mindfulscroll/privacy">Privacy Policy</Link> explains how
        the app handles your information.
      </p>

      <h2 id="what-it-is">What MindfulScroll is</h2>
      <p>
        MindfulScroll helps you set limits on apps you choose, shows breaks when you reach them, and tracks your
        progress. It is a self-help tool. It is not medical, psychological or professional advice, and it is not a
        treatment for any condition. If you are struggling with your wellbeing, please talk to a qualified
        professional.
      </p>
      <p>
        The app depends on Android features and permissions that phone makers can change or restrict. We can&rsquo;t
        promise that every limit or break will work on every device at every moment.
      </p>

      <h2 id="free-and-premium">Free plan and Premium</h2>
      <ul>
        <li>The free plan includes 1 protected app, the Work and Sleep focus modes, and Verse first before 1 app once a day.</li>
        <li>
          MindfulScroll Premium is an auto-renewing subscription, billed monthly or yearly through Google Play. It
          removes the app limits, adds the Study, Deep Focus and Custom focus modes, and lets verses appear more often.
        </li>
        <li>
          Prices are shown in the app and on Google Play before you buy, in your local currency, and include any taxes
          Google Play collects.
        </li>
        <li>
          A free trial, when offered, converts to a paid subscription at the end of the trial unless you cancel before
          then. Each Google account can use a trial once.
        </li>
        <li>
          Subscriptions renew automatically until you cancel. Cancel any time in Google Play &rsaquo; Payments &amp;
          subscriptions; you keep Premium until the end of the period you already paid for.
        </li>
        <li>
          Refunds are handled by Google Play under{' '}
          <a href="https://support.google.com/googleplay/answer/2479637" target="_blank" rel="noreferrer">
            its refund policy
          </a>
          . If something went wrong, email us and we&rsquo;ll help.
        </li>
        <li>
          If we change Premium prices, Google Play notifies existing subscribers in advance as its rules require.
        </li>
      </ul>

      <h2 id="using-the-app">Using the app</h2>
      <p>
        Use MindfulScroll only on devices you own or are allowed to manage, and don&rsquo;t use it to monitor someone
        else without their knowledge. Don&rsquo;t copy, resell, reverse-engineer or tamper with the app, except where
        the law allows it. You are responsible for keeping your PIN safe; if you forget it, you may need to reinstall
        the app, which deletes its data.
      </p>

      <h2 id="ownership">Our app and your content</h2>
      <p>
        We own MindfulScroll, its name and its design. We give you a personal, non-transferable licence to use it
        under these terms. The data the app stores on your phone is yours.
      </p>

      <h2 id="liability">Disclaimers and liability</h2>
      <p>
        The app is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. As far as the law allows, we disclaim
        all implied warranties, and we are not liable for indirect or consequential losses, or for anything that
        happens because a limit or break did or didn&rsquo;t appear. Our total liability for any claim about the app
        is limited to the amount you paid us for Premium in the 12 months before the claim. Nothing here limits rights
        you have under consumer law that can&rsquo;t be excluded.
      </p>

      <h2 id="changes">Changes and ending</h2>
      <p>
        We may update the app and these terms. If a change to the terms is significant, we&rsquo;ll tell you in the
        app or on this page before it takes effect. You can stop using MindfulScroll at any time by uninstalling it
        (and cancelling Premium in Google Play). We may stop offering the app; if we do while you have an active
        subscription, we&rsquo;ll make sure you are not charged for a period you can&rsquo;t use.
      </p>

      <h2 id="law">Law</h2>
      <p>
        These terms are governed by the laws of the Federal Republic of Nigeria, without overriding consumer
        protections where you live.
      </p>

      <h2 id="contact">Contact</h2>
      <p>Questions about these terms: {mail}.</p>
    </LegalPage>
  )
}
