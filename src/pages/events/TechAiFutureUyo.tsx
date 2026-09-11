import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { ArrowRight } from 'lucide-react'

import eventRegistrationService from '@/services/eventRegistrationService'
import type { RegisterPayload } from '@/services/eventRegistrationService'
import { initMetaPixel, trackMetaPixelEvent } from '@/lib/metaPixel'

import heroGlobe from '@/assets/events/tech-ai-future-uyo/hero-globe.png'
import heroGroup from '@/assets/events/tech-ai-future-uyo/hero-group.jpg'
import logoWhite from '@/assets/events/tech-ai-future-uyo/logo-white.png'
import logoEdgenexus from '@/assets/events/tech-ai-future-uyo/logo-edgenexus.png'
import logoReenite from '@/assets/events/tech-ai-future-uyo/logo-reenite.png'
import logoApexTechForge from '@/assets/events/tech-ai-future-uyo/logo-apex-tech-forge.png'

import './TechAiFutureUyo.css'

// ─── Event constants ──────────────────────────────────────────────────────────

const EVENT_SLUG = 'tech-ai-future-uyo'

// Set in .env / Vercel project env as VITE_META_PIXEL_ID. Undefined in
// environments where it isn't configured — initMetaPixel() no-ops then.
const META_PIXEL_ID: string | undefined = import.meta.env.VITE_META_PIXEL_ID

// Static fallbacks — used while the event fetch is loading, or if it fails,
// so the page always renders correctly (per design handoff).
const FALLBACK_STARTS_AT = '2026-10-17T10:00:00+01:00'
const FALLBACK_DATE = 'Sat 17 Oct 2026'
const FALLBACK_TIME = '10:00 AM · 3 hours'
const FALLBACK_VENUE = 'Reenite Space, 162 Oron Road, Uyo'
const FALLBACK_SEAT_LIMIT = 50

// ─── Copy data ────────────────────────────────────────────────────────────────

const DAY_INCLUDES = [
  {
    n: '01',
    title: 'Tech insights',
    body: 'Where technology is actually heading, from people building with it rather than writing about it.',
  },
  {
    n: '02',
    title: 'Interactive sessions',
    body: 'You are not sitting through slides. Every session works through real examples from the room.',
  },
  {
    n: '03',
    title: 'Networking',
    body: 'Grouped by sector at the break, so you meet the people whose work looks like yours.',
  },
  {
    n: '04',
    title: 'Fun and games',
    body: 'A team quiz and a short logic challenge on what has been covered, with small prizes.',
  },
  {
    n: '05',
    title: 'Giveaways',
    body: 'Prizes and TektonX merch handed out through the day.',
  },
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

const ATTENDEE_ROWS = [
  {
    title: 'Young professionals',
    body: 'People who want to stay relevant and competitive as technology reshapes the work they already do.',
  },
  {
    title: 'Tech enthusiasts',
    body: 'People who follow where technology is heading and want to work out how to position themselves in it.',
  },
  {
    title: 'Students',
    body: 'Anyone who wants to make better career decisions in a job market that is changing while they study.',
  },
  {
    title: 'Entrepreneurs and business owners',
    body: 'Founders and traders looking for what AI and technology can do for their operations and their customers.',
  },
]

const PANEL_QUESTIONS = [
  { n: '01', body: 'Will AI take our jobs, or change our jobs?' },
  { n: '02', body: 'What skills should a student start developing today?' },
  { n: '03', body: 'Should everyone learn to code?' },
  { n: '04', body: 'What should someone do if they are not studying technology?' },
  { n: '05', body: 'Are university degrees still enough?' },
  { n: '06', body: 'What should a young person build before graduating?' },
  { n: '07', body: 'What is one thing every young person here should start doing tomorrow?' },
]

const FAQ_ROWS = [
  {
    q: 'Is it free?',
    a: 'Yes. Completely free. There is no fee at the door. The only limit is the 50 seats, which is why we ask you to apply.',
    emphasis: true,
  },
  {
    q: 'Do I need a tech background?',
    a: 'No. The room is deliberately mixed: students, professionals in non-tech roles, business owners, creators and developers. Nothing assumes you can code.',
  },
  {
    q: 'Do I need a laptop?',
    a: 'Not required. Bring one if you want to follow the live build, and a notebook either way.',
  },
  {
    q: 'Why do I have to apply?',
    a: 'Fifty seats and a mixed room are the whole point. The short form lets us keep the balance and prepare for who is actually coming.',
  },
  {
    q: 'How will I know if I got a seat?',
    a: 'By email, with the venue details and directions. Check the address before the day, and arrive by 10:00.',
  },
  {
    q: 'Will it be recorded?',
    a: 'Photography and filming happen throughout, and highlights go out afterwards. Tell the team on the day if you would rather not appear.',
  },
]

// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown(targetIso: string) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const target = new Date(targetIso).getTime()
  const diff = Math.max(0, target - now)
  const pad = (n: number) => String(n).padStart(2, '0')

  return {
    days: pad(Math.floor(diff / 86400000)),
    hours: pad(Math.floor((diff % 86400000) / 3600000)),
    minutes: pad(Math.floor((diff % 3600000) / 60000)),
    seconds: pad(Math.floor((diff % 60000) / 1000)),
  }
}

// ─── Shared style fragments ───────────────────────────────────────────────────

const kickerClass =
  'text-[11px] font-bold uppercase tracking-[0.22em] text-[#4A12BC]'

const sectionH2Class =
  'mt-3 text-[clamp(28px,7vw,44px)] font-extrabold leading-[1.02] tracking-[-0.03em]'

const fieldLabelClass =
  'text-[10px] font-bold uppercase tracking-[0.16em] text-[#06051D]'

const fieldControlClass =
  'w-full min-h-[48px] border-2 border-[#06051D] bg-white px-[14px] py-[12px] text-[16px] text-[#06051D] outline-none'

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
  const { data: event } = useQuery({
    queryKey: ['event', EVENT_SLUG],
    queryFn: () => eventRegistrationService.getEvent(EVENT_SLUG),
    retry: 1,
  })

  const startsAt = event?.startsAt ?? FALLBACK_STARTS_AT
  const { days, hours, minutes, seconds } = useCountdown(startsAt)

  const dateLabel = event?.startsAt ? format(new Date(event.startsAt), 'EEE d MMM yyyy') : FALLBACK_DATE
  const timeLabel = event?.startsAt
    ? `${format(new Date(event.startsAt), 'h:mm a')} · 3 hours`
    : FALLBACK_TIME
  const venueLabel = event?.venue ?? FALLBACK_VENUE
  const seatLimit = event?.seatLimit ?? FALLBACK_SEAT_LIMIT

  useEffect(() => {
    initMetaPixel(META_PIXEL_ID)
  }, [])

  // ─── Form state ───────────────────────────────────────────────────────────

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [volunteer, setVolunteer] = useState('')
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload: RegisterPayload = { name, email, phone, role }
      if (organisation.trim()) payload.organisation = organisation.trim()
      if (volunteer) payload.volunteer = volunteer as RegisterPayload['volunteer']
      if (question.trim()) payload.question = question.trim()

      await eventRegistrationService.register(EVENT_SLUG, payload)
      setSubmitted(true)
      trackMetaPixelEvent('Lead')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message
      toast.error(
        Array.isArray(msg)
          ? msg[0]
          : (msg ?? 'Something went wrong submitting your application. Please try again.'),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tafu">
      {/* No noscript PageView pixel here on purpose — this pixel only tracks
          completed applications (Lead, fired on successful submit below),
          not page visits, so there's no PageView to mirror for non-JS
          visitors either. */}
      {/* ════════════════════════════════════════════════════════
          1. Header (sticky)
      ════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-20 border-b-2 border-[#5E17EB] bg-[#06051D] text-[#F7F4EF]">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-3">
          <img src={logoWhite} alt="TektonX Labs" className="block h-[30px] w-auto" />
          <a
            href="#apply"
            onClick={(e) => handleAnchorClick(e, 'apply')}
            className="block min-h-[44px] bg-[#5E17EB] px-[18px] py-3 text-[12px] font-bold uppercase leading-5 tracking-[0.1em] text-white no-underline hover:bg-[#4A12BC]"
          >
            Apply for a seat
          </a>
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

          {/* Body copy — lead paragraph, CTAs, seat note */}
          <div className="tafu-hero-body">
            <p
              className="tafu-hero-anim m-0 max-w-[38ch] text-[clamp(17px,3.4vw,22px)] leading-[1.45] text-[#1C1B2E] [animation-delay:0.62s]"
              style={{ textWrap: 'pretty' }}
            >
              Learn what is changing, explore emerging technology, and discover how to use it to learn, build, and innovate.
            </p>
            <div className="tafu-hero-anim mt-7 flex flex-wrap gap-3 [animation-delay:0.74s]">
              <a
                href="#apply"
                onClick={(e) => handleAnchorClick(e, 'apply')}
                className="flex min-h-[54px] items-center gap-4 bg-[#5E17EB] px-6 py-4 text-[14px] font-bold uppercase tracking-[0.08em] text-white no-underline hover:bg-[#4A12BC]"
              >
                Apply for a seat <ArrowRight className="size-[17px]" />
              </a>
              <a
                href="#learn"
                onClick={(e) => handleAnchorClick(e, 'learn')}
                className="flex min-h-[54px] items-center gap-4 border-2 border-[#06051D] px-6 py-4 text-[14px] font-bold uppercase tracking-[0.08em] text-[#06051D] no-underline hover:bg-[#F1EBFF]"
              >
                See what is covered <ArrowRight className="size-[17px]" />
              </a>
            </div>
            <div className="tafu-hero-anim mt-4 text-[13px] text-[#4A4B5E] [animation-delay:0.86s]">
              50 seats, by application.
            </div>
          </div>
        </div>

        {/* Fact strip */}
        <div className="border-t-2 border-[#06051D] bg-[#06051D]">
          <div className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
            <div className="border-r border-[rgba(247,244,239,0.18)] p-5">
              <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9A9CB0]">Date</div>
              <div className="mt-1.5 text-[16px] font-bold leading-[1.3] text-[#F7F4EF]">{dateLabel}</div>
            </div>
            <div className="border-r border-[rgba(247,244,239,0.18)] p-5">
              <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9A9CB0]">Time</div>
              <div className="mt-1.5 text-[16px] font-bold leading-[1.3] text-[#F7F4EF]">{timeLabel}</div>
            </div>
            <div className="border-r border-[rgba(247,244,239,0.18)] p-5">
              <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9A9CB0]">Venue</div>
              <div className="mt-1.5 text-[15px] font-semibold leading-[1.35] text-[#F7F4EF]">{venueLabel}</div>
            </div>
            <div className="p-5">
              <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9A9CB0]">Seats</div>
              <div className="mt-1.5 text-[16px] font-bold leading-[1.3] text-[#F7F4EF]">{seatLimit} · by application</div>
            </div>
          </div>
        </div>

        {/* Countdown band */}
        <div className="border-t-2 border-[#06051D] bg-[#5E17EB] text-white">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-7 gap-y-3.5 px-5 py-[18px]">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E0D3FF]">
              Applications close when the seats fill
            </div>
            <div className="flex gap-5 tabular-nums">
              <div>
                <div className="text-[clamp(24px,7vw,34px)] font-extrabold leading-none tracking-[-0.02em]">{days}</div>
                <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#E0D3FF]">Days</div>
              </div>
              <div>
                <div className="text-[clamp(24px,7vw,34px)] font-extrabold leading-none tracking-[-0.02em]">{hours}</div>
                <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#E0D3FF]">Hours</div>
              </div>
              <div>
                <div className="text-[clamp(24px,7vw,34px)] font-extrabold leading-none tracking-[-0.02em]">{minutes}</div>
                <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#E0D3FF]">Minutes</div>
              </div>
              <div>
                <div className="text-[clamp(24px,7vw,34px)] font-extrabold leading-none tracking-[-0.02em]">{seconds}</div>
                <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#E0D3FF]">Seconds</div>
              </div>
            </div>
          </div>
        </div>

        {/* Photo band */}
        <div className="h-[clamp(220px,44vw,420px)] overflow-hidden border-t-2 border-[#06051D]">
          <img
            src={heroGroup}
            alt="Participants at the maiden edition in Anyigba"
            className="block h-full w-full object-cover"
            style={{ objectPosition: '50% 42%' }}
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          3. What the day includes
      ════════════════════════════════════════════════════════ */}
      <section className="border-b-2 border-[#06051D]">
        <div className="mx-auto max-w-[1180px] px-5 py-[clamp(32px,6vw,64px)]">
          <div className={kickerClass}>In the room</div>
          <h2 className={`${sectionH2Class} max-w-[24ch]`}>What the day includes</h2>
          {/* minmax raised from 250 to 300: with 5 items (was 6) this resolves
              to a balanced 3+2 layout at desktop widths instead of 4+1, which
              left a lone trailing item stranded with a big empty gap beside it. */}
          <div className="mt-[26px] grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-x-[clamp(20px,4vw,36px)] gap-y-0 border-t-2 border-[#06051D]">
            {DAY_INCLUDES.map((item) => (
              <div key={item.n} className="border-b border-[#DCDBE2] py-[22px]">
                <div className="text-[10px] font-bold tracking-[0.16em] text-[#4A12BC]">{item.n}</div>
                <div className="mt-2 text-[clamp(17px,4vw,19px)] font-bold tracking-[-0.015em]">{item.title}</div>
                <div className="mt-1.5 text-[15px] leading-[1.5] text-[#4A4B5E]">{item.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          4. Six things you leave with
      ════════════════════════════════════════════════════════ */}
      <section id="learn" className="border-b-2 border-[#06051D] bg-[#F7F4EF]">
        <div className="mx-auto max-w-[1180px] px-5 py-[clamp(32px,6vw,64px)]">
          <div className={kickerClass}>What you will learn</div>
          <h2 className={`${sectionH2Class} max-w-[22ch]`}>Six things you leave with</h2>
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
          5. Is this for you?
      ════════════════════════════════════════════════════════ */}
      <section className="border-b-2 border-[#06051D]">
        <div className="mx-auto max-w-[1180px] px-5 py-[clamp(32px,6vw,64px)]">
          <div className={kickerClass}>Who should attend</div>
          <h2 className={`${sectionH2Class} max-w-[20ch]`}>Is this for you?</h2>
          <div className="mt-6 border-t-2 border-[#06051D]">
            {ATTENDEE_ROWS.map((row) => (
              <div key={row.title} className="grid grid-cols-1 gap-1.5 border-b border-[#DCDBE2] py-5">
                <div className="text-[clamp(17px,4.2vw,20px)] font-bold tracking-[-0.015em]">{row.title}</div>
                <div className="max-w-[70ch] text-[15px] leading-[1.55] text-[#4A4B5E]">{row.body}</div>
              </div>
            ))}
            <div className="grid grid-cols-1 gap-1.5 border-b-2 border-[#06051D] py-5">
              <div className="text-[clamp(17px,4.2vw,20px)] font-bold tracking-[-0.015em]">Anyone asking</div>
              <div className="max-w-[60ch] text-[clamp(16px,4vw,18px)] font-semibold leading-[1.45] text-[#1C1B2E]">
                &ldquo;What does the future of work look like, and how do I prepare for it?&rdquo;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          6. Panel block
      ════════════════════════════════════════════════════════ */}
      <section className="border-b-2 border-[#06051D]">
        <div className="mx-auto max-w-[1180px] px-5 py-[clamp(32px,6vw,64px)]">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-[clamp(24px,5vw,44px)]">
            <div>
              <div className={kickerClass}>The panel</div>
              <h2
                className="mt-3 text-[clamp(26px,6.4vw,40px)] font-extrabold leading-[1.05] tracking-[-0.03em]"
                style={{ textWrap: 'pretty' }}
              >
                The Future Is Coming. Are Young People Ready?
              </h2>
              <p className="mt-3.5 max-w-[46ch] text-[15px] leading-[1.55] text-[#4A4B5E]">
                Twenty minutes of open questions, taken from the floor and from the cards collected at registration. Bring yours.
              </p>
            </div>
            <div className="border-t-2 border-[#06051D]">
              {PANEL_QUESTIONS.map((item, i) => (
                <div
                  key={item.n}
                  className={`flex gap-3.5 py-3.5 ${
                    i === PANEL_QUESTIONS.length - 1 ? 'border-b-2 border-[#06051D]' : 'border-b border-[#DCDBE2]'
                  }`}
                >
                  <div className="min-w-[20px] pt-[3px] text-[10px] font-bold text-[#4A12BC]">{item.n}</div>
                  <div className="text-[15px] leading-[1.45]">{item.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          7. Application form
      ════════════════════════════════════════════════════════ */}
      <section id="apply" className="border-b-2 border-[#06051D]">
        <div className="mx-auto max-w-[1180px] px-5 py-[clamp(32px,6vw,64px)]">
          <div className={kickerClass}>Apply</div>
          <h2 className="mt-3 max-w-[20ch] text-[clamp(28px,7vw,48px)] font-extrabold leading-[1.0] tracking-[-0.035em]">
            Apply for one of 50 seats
          </h2>
          <p className="mt-3.5 max-w-[52ch] text-[clamp(15px,3.6vw,17px)] leading-[1.55] text-[#1C1B2E]">
            We read every application and confirm by email, so tell us what you actually want out of the day.
          </p>

          {submitted ? (
            <div className="mt-[26px] bg-[#06051D] p-[clamp(24px,5vw,36px)] text-[#F7F4EF]">
              <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#A97BFF]">
                Application received
              </div>
              <div className="mt-3 max-w-[26ch] text-[clamp(22px,5.4vw,30px)] font-extrabold leading-[1.2] tracking-[-0.025em]">
                Thank you. Watch your email for the confirmation.
              </div>
              <p className="mt-3.5 max-w-[50ch] text-[15px] leading-[1.55] text-[#B9BACB]">
                Seats are confirmed in the order applications are reviewed. If you are offered a seat you will get the venue details and a short pre-read.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-[26px] border-t-2 border-[#06051D]">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[clamp(16px,3vw,24px)] pt-6">
                <label className="flex flex-col gap-2">
                  <span className={fieldLabelClass}>Full name</span>
                  <input
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={fieldControlClass}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={fieldLabelClass}>Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldControlClass}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={fieldLabelClass}>Phone or WhatsApp</span>
                  <input
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="080…"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={fieldControlClass}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={fieldLabelClass}>What do you do</span>
                  <input
                    name="role"
                    type="text"
                    required
                    placeholder="Job title, course or trade"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={fieldControlClass}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={fieldLabelClass}>Organisation or school</span>
                  <input
                    name="organisation"
                    type="text"
                    placeholder="Where you work or study"
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                    className={fieldControlClass}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={fieldLabelClass}>Would you volunteer with TektonX?</span>
                  <select
                    name="volunteer"
                    value={volunteer}
                    onChange={(e) => setVolunteer(e.target.value)}
                    className={`${fieldControlClass} appearance-none`}
                  >
                    <option value="">Choose one</option>
                    <option value="yes">Yes, tell me more</option>
                    <option value="maybe">Maybe, depends on the role</option>
                    <option value="no">No, just attending</option>
                  </select>
                </label>
              </div>

              <div className="pb-6">
                <label className="mt-[clamp(16px,3vw,24px)] flex flex-col gap-2">
                  <span className={fieldLabelClass}>One question you want answered on the day</span>
                  <textarea
                    name="question"
                    rows={3}
                    placeholder="Optional, but it helps us shape the panel"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className={`${fieldControlClass} resize-y leading-[1.5]`}
                  />
                </label>

                <div className="mt-[22px] flex flex-wrap items-center gap-3.5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="min-h-[54px] cursor-pointer bg-[#5E17EB] px-[30px] py-4 text-[15px] font-bold uppercase tracking-[0.08em] text-white hover:bg-[#4A12BC] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? 'Submitting…' : 'Submit application'}
                  </button>
                  <div className="max-w-[44ch] text-[13px] leading-[1.45] text-[#4A4B5E]">
                    We reply by email within a few days.
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          8. FAQ
      ════════════════════════════════════════════════════════ */}
      <section className="border-b-2 border-[#06051D] bg-[#F7F4EF]">
        <div className="mx-auto max-w-[1180px] px-5 py-[clamp(32px,6vw,64px)]">
          <div className={kickerClass}>Questions</div>
          <h2 className={sectionH2Class}>Before you ask</h2>
          <div className="mt-6 border-t-2 border-[#06051D]">
            {FAQ_ROWS.map((row, i) => (
              <div
                key={row.q}
                className={`grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-[clamp(20px,4vw,40px)] gap-y-2 py-5 ${
                  i === FAQ_ROWS.length - 1 ? 'border-b-2 border-[#06051D]' : 'border-b border-[#D5D2CC]'
                }`}
              >
                <div className="text-[clamp(17px,4.2vw,19px)] font-bold tracking-[-0.015em]">{row.q}</div>
                <div className={`text-[15px] leading-[1.55] ${row.emphasis ? 'text-[#1C1B2E]' : 'text-[#4A4B5E]'}`}>
                  {row.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          9. Partners strip
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
              Backing the Road to Buildverse, or want your brand in the room in Uyo? We are taking partner conversations now.
            </p>
            <a
              href="mailto:partners@tektonxlabs.com?subject=Partnership%20%E2%80%94%20Tech%2C%20AI%20and%20the%20Future%20Uyo"
              className="mt-4 inline-flex min-h-[48px] items-center border-2 border-[#06051D] px-[22px] py-3.5 text-[13px] font-bold uppercase tracking-[0.08em] text-[#06051D] no-underline hover:bg-[#F1EBFF]"
            >
              Enquire about partnering
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          10. Footer
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
            <span>Sat 17 Oct 2026 · 10:00 AM · Reenite Space, Uyo</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
