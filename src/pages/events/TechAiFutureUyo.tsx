import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

import heroGlobe from '@/assets/events/tech-ai-future-uyo/hero-globe.webp'
import recapRoom from '@/assets/events/tech-ai-future-uyo/recap-room.jpg'
import recapSpeaker from '@/assets/events/tech-ai-future-uyo/recap-speaker.jpg'
import recapQuestion from '@/assets/events/tech-ai-future-uyo/recap-question.jpg'
import recapBags from '@/assets/events/tech-ai-future-uyo/recap-bags.jpg'
import logoWhite from '@/assets/events/tech-ai-future-uyo/logo-white.png'
import logoEdgenexus from '@/assets/events/tech-ai-future-uyo/logo-edgenexus.png'
import logoReenite from '@/assets/events/tech-ai-future-uyo/logo-reenite.png'
import logoApexTechForge from '@/assets/events/tech-ai-future-uyo/logo-apex-tech-forge.png'

import './TechAiFutureUyo.css'

// The event took place on 17 October 2026, so this page is now its recap. The
// registration version (form, countdown, Meta Pixel, WhatsApp redirect) is in
// git history before this change, for reuse on the next event's page.

// ─── Copy data ────────────────────────────────────────────────────────────────

const SESSIONS = [
  {
    n: '01',
    title: 'AI and the Future of Work',
    people: 'Emmanuel Ani',
  },
  {
    n: '02',
    title: 'Building with AI in Akwa Ibom',
    people: 'Elisha Ukpong',
  },
  {
    n: '03',
    title: 'Panel: How to Navigate the AI Era',
    people:
      'Elisha Ukpong, Emmanuel Ani, Chibueze Amuchie, Chinonye Abonyi and Victor Onu. Moderated by IfiokAbasi Okop.',
  },
]

const PHOTOS = [
  { src: recapSpeaker, alt: 'A speaker addressing the room in front of the event backdrop' },
  { src: recapQuestion, alt: 'A participant asking a question from the audience' },
  { src: recapBags, alt: 'A TektonX team member holding the bags prepared for participants' },
]

const LEAVE_WITH = [
  {
    n: '01',
    title: 'AI and the future of work',
    body: 'How AI is changing jobs, careers and whole industries, and which parts of that change are already here.',
  },
  {
    n: '02',
    title: 'Beyond "learn AI"',
    body: "What learning AI should actually mean for your profession, rather than for someone else's.",
  },
  {
    n: '03',
    title: 'The skills that matter',
    body: 'Adaptability, problem solving, communication, technical literacy, and learning how to learn.',
  },
  {
    n: '04',
    title: 'Human plus AI',
    body: 'Using AI as a tool that extends what you can do, instead of treating it as something to fear.',
  },
  {
    n: '05',
    title: 'From learning to building',
    body: 'Moving past courses and certificates to making things, solving problems and showing what you can do.',
  },
  {
    n: '06',
    title: 'Preparing for the future',
    body: 'Building a career that can change as the tools, the industries and the work itself change.',
  },
]

// ─── Shared style fragments ───────────────────────────────────────────────────

const kickerClass =
  'text-[11px] font-bold uppercase tracking-[0.22em] text-[#4A12BC]'

const sectionH2Class =
  'mt-3 text-[clamp(28px,7vw,44px)] font-extrabold leading-[1.02] tracking-[-0.03em]'

// Smooth-scrolls to an in-page anchor, accounting for the sticky header via
// the `scroll-margin-top` set on every `[id]` in TechAiFutureUyo.css, and
// respecting prefers-reduced-motion.
function handleAnchorClick(e: React.MouseEvent<HTMLAnchorElement>, targetId: string) {
  const el = document.getElementById(targetId)
  if (!el) return
  e.preventDefault()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TechAiFutureUyo() {
  return (
    <div className="tafu">
      {/* ════════════════════════════════════════════════════════
          1. Header (sticky)
      ════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-20 border-b-2 border-[#5E17EB] bg-[#06051D] text-[#F7F4EF]">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-3">
          <img src={logoWhite} alt="TektonX Labs" className="block h-[30px] w-auto" />
          <Link
            to="/join"
            className="block min-h-[44px] bg-[#5E17EB] px-[18px] py-3 text-[12px] font-bold uppercase leading-5 tracking-[0.1em] text-white no-underline hover:bg-[#4A12BC]"
          >
            Join us
          </Link>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          2. Hero
      ════════════════════════════════════════════════════════ */}
      <section className="border-b-2 border-[#06051D]">
        <div className="tafu-hero-grid mx-auto max-w-[1180px] gap-[clamp(24px,4vw,48px)] px-5 pb-[clamp(20px,4vw,40px)] pt-[clamp(24px,5vw,56px)]">
          {/* Headline — kept separate from the body copy so the visual can sit
              between them on mobile (stacked order: headline, visual, body)
              while still landing beside the headline as its own column on
              wider screens. See .tafu-hero-grid in TechAiFutureUyo.css. */}
          <div className="tafu-hero-headline">
            <div className="tafu-hero-anim text-[clamp(10px,2.6vw,12px)] font-bold uppercase tracking-[0.22em] text-[#4A12BC]">
              Road to Buildverse · Uyo
            </div>
            <div className="tafu-hero-rule mt-[14px] h-[3px] w-[56px] bg-[#5E17EB]" />
            <h1 className="mt-[18px] text-[clamp(46px,11vw,96px)] font-extrabold uppercase leading-[0.86] tracking-[-0.045em]">
              <span className="tafu-hero-anim block [animation-delay:0.2s]">
                <span className="tafu-shimmer [animation-delay:1.65s]">Tech</span>
                <span className="text-[#5E17EB]">.</span>
              </span>
              <span className="tafu-hero-anim block [animation-delay:0.33s]">
                <span className="tafu-shimmer [animation-delay:1.78s]">AI</span>
                <span className="text-[#5E17EB]">.</span>
              </span>
              <span className="tafu-hero-anim block [animation-delay:0.46s]">
                <span className="tafu-shimmer [animation-delay:1.91s]">Future</span>
                <span className="text-[#5E17EB]">.</span>
              </span>
            </h1>
          </div>

      {/* Visual */}
          <div className="tafu-hero-visual relative flex min-w-0 items-center justify-center px-0 py-0 sm:px-5">
            <div
              aria-hidden
              className="tafu-glow absolute left-1/2 top-1/2 aspect-square w-[74%] -translate-y-1/2"
              style={{
                marginLeft: '-37%',
                background:
                  'radial-gradient(circle at 50% 50%, rgba(94,23,235,0.22), rgba(94,23,235,0.06) 55%, rgba(94,23,235,0) 72%)',
              }}
            />
            <div
              aria-hidden
              className="tafu-orbit-inner absolute left-1/2 top-1/2 aspect-square w-[min(430px,68%)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed"
              style={{ borderColor: 'rgba(94,23,235,0.28)' }}
            />
            <div
              aria-hidden
              className="tafu-orbit-outer absolute left-1/2 top-1/2 aspect-square w-[min(540px,88%)] -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{ borderColor: 'rgba(94,23,235,0.14)' }}
            />
            <img
              src={heroGlobe}
              alt="Emerging technology, illustrated as a networked sphere"
              className="tafu-float relative block h-auto w-full max-w-[600px]"
              style={{ mixBlendMode: 'multiply', filter: 'saturate(1.12) contrast(1.06)' }}
            />
          </div>

          {/* Body copy — lead paragraph, CTAs, closing note */}
          <div className="tafu-hero-body">
            <p
              className="tafu-hero-anim m-0 max-w-[38ch] text-[clamp(17px,3.4vw,22px)] leading-[1.45] text-[#1C1B2E] [animation-delay:0.62s]"
              style={{ textWrap: 'pretty' }}
            >
              Thank you, Uyo. 100 of you came together at Reenite Space for a free half-day on AI, work and what to build next.
            </p>
            <div className="tafu-hero-anim mt-7 flex flex-wrap gap-3 [animation-delay:0.74s]">
              <Link
                to="/join"
                className="flex min-h-[54px] items-center gap-4 bg-[#5E17EB] px-6 py-4 text-[14px] font-bold uppercase tracking-[0.08em] text-white no-underline hover:bg-[#4A12BC]"
              >
                Join the community <ArrowRight className="size-[17px]" />
              </Link>
              <a
                href="#sessions"
                onClick={(e) => handleAnchorClick(e, 'sessions')}
                className="flex min-h-[54px] items-center gap-4 border-2 border-[#06051D] px-6 py-4 text-[14px] font-bold uppercase tracking-[0.08em] text-[#06051D] no-underline hover:bg-[#F1EBFF]"
              >
                See how the day went <ArrowRight className="size-[17px]" />
              </a>
            </div>
            <div className="tafu-hero-anim mt-4 text-[13px] text-[#4A4B5E] [animation-delay:0.86s]">
              This event has ended and registration is closed. Join the community to hear about the next one.
            </div>
          </div>
        </div>

        {/* Fact strip */}
        <div className="border-t-2 border-[#06051D] bg-[#06051D]">
          <div className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
            <div className="border-r border-[rgba(247,244,239,0.18)] p-5">
              <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9A9CB0]">Date</div>
              <div className="mt-1.5 text-[16px] font-bold leading-[1.3] text-[#F7F4EF]">Sat 17 Oct 2026</div>
            </div>
            <div className="border-r border-[rgba(247,244,239,0.18)] p-5">
              <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9A9CB0]">Venue</div>
              <div className="mt-1.5 text-[16px] font-bold leading-[1.3] text-[#F7F4EF]">Reenite Space, Uyo</div>
            </div>
            <div className="border-r border-[rgba(247,244,239,0.18)] p-5">
              <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9A9CB0]">Registered</div>
              <div className="mt-1.5 text-[16px] font-bold leading-[1.3] text-[#F7F4EF]">239 in nine days</div>
            </div>
            <div className="p-5">
              <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9A9CB0]">In the room</div>
              <div className="mt-1.5 text-[16px] font-bold leading-[1.3] text-[#F7F4EF]">100 people</div>
            </div>
          </div>
        </div>

        {/* Photo band */}
        <div className="h-[clamp(220px,44vw,420px)] overflow-hidden border-t-2 border-[#06051D]">
          <img
            src={recapRoom}
            alt="The audience at Tech, AI and the Future in Uyo"
            className="block h-full w-full object-cover"
            style={{ objectPosition: '50% 62%' }}
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          3. The sessions
      ════════════════════════════════════════════════════════ */}
      <section id="sessions" className="border-b-2 border-[#06051D]">
        <div className="mx-auto max-w-[1180px] px-5 py-[clamp(32px,6vw,64px)]">
          <div className={kickerClass}>On the day</div>
          <h2 className={`${sectionH2Class} max-w-[24ch]`}>Talks, a panel and the people behind them</h2>
          <div className="mt-[26px] grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-x-[clamp(20px,4vw,36px)] gap-y-0 border-t-2 border-[#06051D]">
            {SESSIONS.map((item) => (
              <div key={item.n} className="border-b border-[#DCDBE2] py-[22px]">
                <div className="text-[10px] font-bold tracking-[0.16em] text-[#4A12BC]">{item.n}</div>
                <div className="mt-2 text-[clamp(17px,4vw,19px)] font-bold tracking-[-0.015em]">{item.title}</div>
                <div className="mt-1.5 text-[15px] leading-[1.5] text-[#4A4B5E]">{item.people}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-[62ch] text-[15px] leading-[1.55] text-[#4A4B5E]">
            Hosted by Chris Eminence and convened by Victor Onu. Everyone who came got food, a branded paper bag, a jotter and a pen,
            and game winners took home gifts. Thank you to every speaker, and to the 10 volunteers who helped run it.
          </p>
          <div className="mt-[26px] grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[clamp(12px,2vw,20px)]">
            {PHOTOS.map((photo) => (
              <img
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="block aspect-[3/2] w-full border-2 border-[#06051D] object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          4. The ideas behind the day
      ════════════════════════════════════════════════════════ */}
      <section id="learn" className="border-b-2 border-[#06051D] bg-[#F7F4EF]">
        <div className="mx-auto max-w-[1180px] px-5 py-[clamp(32px,6vw,64px)]">
          <div className={kickerClass}>What it was about</div>
          <h2 className={`${sectionH2Class} max-w-[22ch]`}>Six ideas behind the day</h2>
          <div className="mt-[26px] grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-[clamp(20px,4vw,36px)] gap-y-0 border-t-2 border-[#06051D]">
            {LEAVE_WITH.map((item) => (
              <div key={item.n} className="border-b border-[#D5D2CC] py-[22px]">
                <div className="text-[10px] font-bold tracking-[0.16em] text-[#4A12BC]">{item.n}</div>
                <div className="mt-2 text-[clamp(17px,4vw,19px)] font-bold tracking-[-0.015em]">{item.title}</div>
                <div className="mt-1.5 text-[15px] leading-[1.5] text-[#4A4B5E]">{item.body}</div>
              </div>
            ))}
          </div>
          <div className="mt-[clamp(24px,4vw,36px)] bg-[#5E17EB] p-[clamp(24px,5vw,36px)] text-white">
            <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#E0D3FF]">The core message</div>
            <div className="mt-3 max-w-[24ch] text-[clamp(26px,7vw,40px)] font-extrabold leading-[1.1] tracking-[-0.03em]">
              Don&apos;t just learn AI. Learn how AI applies to you.
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          5. Partners strip
      ════════════════════════════════════════════════════════ */}
      <section className="border-b-2 border-[#06051D]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-start gap-[clamp(24px,4vw,40px)] px-5 py-[clamp(28px,5vw,52px)]">
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6E7186]">
              In partnership with
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-[22px]">
              <img src={logoEdgenexus} alt="Edgenexus Global" className="block h-[30px] w-auto" />
              <img src={logoReenite} alt="Reenite" className="block h-[36px] w-auto" />
              {/* Own dark backing (unlike the two flat logos above) — its wordmark
                  is white, so it needs a dark ground to stay legible; kept as its
                  own small badge rather than forcing it transparent. */}
              <img src={logoApexTechForge} alt="Apex Tech Forge Academy" className="block h-[48px] w-auto" />
            </div>
          </div>
          <div className="border-l-2 border-[#DCDBE2] pl-[clamp(16px,3vw,28px)]">
            <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6E7186]">
              Partners and sponsors
            </div>
            <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.55] text-[#1C1B2E]">
              Want to back the next TektonX event? We are taking partner conversations now.
            </p>
            <a
              href="mailto:info@tektonxlabs.com?subject=Partnership%20with%20TektonX"
              className="mt-4 inline-flex min-h-[48px] items-center border-2 border-[#06051D] px-[22px] py-3.5 text-[13px] font-bold uppercase tracking-[0.08em] text-[#06051D] no-underline hover:bg-[#F1EBFF]"
            >
              Enquire about partnering
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          6. Footer
      ════════════════════════════════════════════════════════ */}
      <footer className="bg-[#06051D] text-[#F7F4EF]">
        <div className="mx-auto max-w-[1180px] px-5 py-[clamp(28px,5vw,52px)]">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[clamp(22px,4vw,40px)]">
            <div>
              <img src={logoWhite} alt="TektonX Labs" className="block h-[44px] w-auto" />
              <p className="mt-4 max-w-[34ch] text-[14px] leading-[1.55] text-[#B9BACB]">
                Road to Buildverse. Uyo, Akwa Ibom State.
              </p>
              <a
                href="tel:+2349071372853"
                className="mt-3 block min-h-6 text-[15px] text-[#F7F4EF] no-underline hover:text-[#A97BFF]"
              >
                Call or WhatsApp: 0907 137 2853
              </a>
              <a
                href="mailto:info@tektonxlabs.com"
                className="mt-1.5 block min-h-6 text-[15px] text-[#F7F4EF] no-underline hover:text-[#A97BFF]"
              >
                info@tektonxlabs.com
              </a>
            </div>
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8B5CF6]">Follow</div>
              <div className="mt-3.5 flex flex-col gap-2.5">
                <a
                  href="https://www.instagram.com/tektonxlabs/"
                  className="min-h-6 text-[15px] text-[#F7F4EF] no-underline hover:text-[#A97BFF]"
                >
                  Instagram · tektonxlabs
                </a>
                <a
                  href="https://www.facebook.com/tektonXlabs"
                  className="min-h-6 text-[15px] text-[#F7F4EF] no-underline hover:text-[#A97BFF]"
                >
                  Facebook · tektonXlabs
                </a>
                <a
                  href="https://www.linkedin.com/company/tektonx-labs"
                  className="min-h-6 text-[15px] text-[#F7F4EF] no-underline hover:text-[#A97BFF]"
                >
                  LinkedIn · TektonX Labs
                </a>
              </div>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap justify-between gap-x-6 gap-y-2.5 border-t border-[rgba(247,244,239,0.22)] pt-4 text-[11px] uppercase tracking-[0.12em] text-[#8B8FA3]">
            <span>TektonX Labs</span>
            <span>Sat 17 Oct 2026 · Reenite Space, Uyo</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
