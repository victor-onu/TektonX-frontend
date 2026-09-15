import { Link } from 'react-router-dom'
import {
  CircleCheck,
  Play,
  ArrowUpRight,
  ArrowRight,
  Users,
  Code,
  Trophy,
  Building2,
  Heart,
  Lightbulb,
  Target,
  UsersRound,
  Shield,
} from 'lucide-react'

import { useScrollToHash } from '@/hooks/useScrollToHash'
import { StatCard, DarkButton, IconBadge, JoinPanel } from '@/components/marketing/ui'
import { eyebrowStyle } from '@/components/marketing/tokens'
import heroX from '@/assets/marketing/hero-x.webp'
import tektonxMark from '@/assets/marketing/tektonx-mark.svg'
import p01 from '@/assets/marketing/photos/p01.jpeg'
import p03 from '@/assets/marketing/photos/p03.jpeg'
import p06 from '@/assets/marketing/photos/p06.jpeg'
import s25 from '@/assets/marketing/solex/s25.jpg'
import s75 from '@/assets/marketing/solex/s75.jpg'
import s111 from '@/assets/marketing/solex/s111.jpg'
import s130 from '@/assets/marketing/solex/s130.jpg'
import s145 from '@/assets/marketing/solex/s145.jpg'
import s181 from '@/assets/marketing/solex/s181.jpg'

const FACEBOOK_REEL_URL = 'https://www.facebook.com/share/r/1DSXhKBTbC/?mibextid=wwXIfr'

// ─── Programs ───────────────────────────────────────────────────────────────

const PROGRAMS = [
  {
    Icon: Users,
    title: 'FROM CAMPUS TO TECH CAREERS',
    description: 'Outreach and awareness sessions across university campuses, inspiring students in unreached regions.',
    gradient: 'linear-gradient(150deg,#A855F7,#6D28D9)',
    shadowColor: 'rgba(124,58,237,0.34)',
  },
  {
    Icon: Code,
    title: 'CODE FOR GROWTH',
    description: 'Structured bootcamps in coding, design, product management, and digital skills.',
    gradient: 'linear-gradient(150deg,#34D399,#0F766E)',
    shadowColor: 'rgba(16,185,129,0.32)',
  },
  {
    Icon: Trophy,
    title: 'TEKTONX COMPETITIONS',
    description: 'Inter-school and inter-community hackathons, coding contests, and innovation challenges.',
    gradient: 'linear-gradient(150deg,#F59E0B,#B45309)',
    shadowColor: 'rgba(217,119,6,0.30)',
  },
  {
    Icon: Building2,
    title: 'TEKTONX HUB',
    description: 'Physical and virtual hub for young innovators with coworking spaces and training programs.',
    gradient: 'linear-gradient(150deg,#2DD4BF,#0E7490)',
    shadowColor: 'rgba(14,116,144,0.30)',
  },
  {
    Icon: Heart,
    title: 'MENTORSHIP & CAREER SUPPORT',
    description: 'Pairing participants with experienced tech professionals for career guidance and job support.',
    gradient: 'linear-gradient(150deg,#E879F9,#A21CAF)',
    shadowColor: 'rgba(192,38,211,0.30)',
  },
  {
    Icon: Lightbulb,
    title: 'TECH PATHWAYS SERIES',
    description: 'Interactive workshops, talks, and competitions introducing young people to tech opportunities.',
    gradient: 'linear-gradient(150deg,#60A5FA,#1D4ED8)',
    shadowColor: 'rgba(29,78,216,0.30)',
  },
] as const

// ─── Core values ────────────────────────────────────────────────────────────

const VALUES = [
  {
    Icon: Target,
    title: 'ACCESS FOR ALL',
    description: 'We remove barriers to tech education and opportunities.',
    gradient: 'linear-gradient(150deg,#A855F7,#6D28D9)',
    shadowColor: 'rgba(124,58,237,0.32)',
  },
  {
    Icon: Users,
    title: 'EMPOWERMENT',
    description: 'We equip young people to build sustainable careers and solutions.',
    gradient: 'linear-gradient(150deg,#E879F9,#A21CAF)',
    shadowColor: 'rgba(192,38,211,0.30)',
  },
  {
    Icon: Lightbulb,
    title: 'INNOVATION',
    description: 'We nurture creativity and problem-solving with a future-focused mindset.',
    gradient: 'linear-gradient(150deg,#60A5FA,#4338CA)',
    shadowColor: 'rgba(67,56,202,0.30)',
  },
  {
    Icon: UsersRound,
    title: 'COMMUNITY',
    description: 'We foster collaboration, networking, and shared growth.',
    gradient: 'linear-gradient(150deg,#34D399,#0F766E)',
    shadowColor: 'rgba(16,185,129,0.30)',
  },
  {
    Icon: Shield,
    title: 'INTEGRITY',
    description: 'We remain transparent, ethical, and people-centered in all we do.',
    gradient: 'linear-gradient(150deg,#C084FC,#7C3AED)',
    shadowColor: 'rgba(124,58,237,0.32)',
  },
] as const

const MENTORSHIP_PILLS = ['8 tech tracks', '3-month cycle', '1:1 pairing', 'Career support', 'Certificate on completion']

// ─── Component ──────────────────────────────────────────────────────────────

export default function Index() {
  useScrollToHash()

  return (
    <div className="tx-marketing">
      {/* Hero */}
      <section
        id="top-hero"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background:
            'radial-gradient(70% 62% at 76% 40%, rgba(168,85,247,0.13) 0%, rgba(250,248,246,0) 72%), #FAF8F6',
        }}
      >
        <div
          style={{
            position: 'relative',
            maxWidth: 1440,
            margin: '0 auto',
            padding: '40px 28px 32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))',
            gap: '8px 24px',
            alignItems: 'center',
          }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 26, minWidth: 0 }}
          >
            {/* Each line rises in on its own delay (a cascade) instead of the
                whole block fading in as one piece — pure CSS, so it plays
                immediately regardless of connection speed. */}
            <h1 style={{ fontSize: 'clamp(52px,6.4vw,96px)', lineHeight: 0.86, letterSpacing: '0.005em', color: '#0E0B12' }}>
              <span className="tx-marketing-rise" style={{ display: 'block', animationDelay: '0s' }}>
                BUILDING PEOPLE.
              </span>
              <span className="tx-marketing-rise" style={{ display: 'block', animationDelay: '0.12s' }}>
                BUILDING PRODUCTS.
              </span>
              <span
                className="tx-marketing-rise"
                style={{
                  display: 'block',
                  animationDelay: '0.24s',
                  background: 'linear-gradient(100deg,#7C3AED,#C026D3)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                BUILDING AFRICA.
              </span>
            </h1>
            <p
              className="tx-marketing-rise"
              style={{ animationDelay: '0.4s', fontSize: 18, lineHeight: 1.7, color: '#5C5661', maxWidth: '48ch', margin: 0 }}
            >
              Building communities of young African builders through learning, mentorship, and technology.
            </p>
            <div className="tx-marketing-rise" style={{ animationDelay: '0.52s', display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <DarkButton to="/join">Join the community</DarkButton>
              <a
                href="#programs"
                className="tx-btn-light-a"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  background: '#FFFFFF',
                  color: '#141118',
                  fontSize: 16,
                  fontWeight: 600,
                  padding: '17px 30px',
                  borderRadius: 10,
                  border: '1px solid rgba(20,17,24,0.08)',
                  boxShadow: '0 6px 20px rgba(20,17,24,0.07)',
                  whiteSpace: 'nowrap',
                }}
              >
                See what we run
              </a>
            </div>
          </div>
          <div
            className="tx-marketing-heroimg"
            style={{ position: 'relative', minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: -56 }}
          >
            {/* Blurred radial glow — plain CSS, so it's there instantly even
                before the image file below has finished downloading. */}
            <div
              aria-hidden
              className="tx-hero-glow"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '70%',
                aspectRatio: '1',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle at 50% 50%, rgba(124,58,237,0.28), rgba(192,38,211,0.08) 55%, rgba(124,58,237,0) 72%)',
                pointerEvents: 'none',
              }}
            />
            <img
              src={heroX}
              alt="TektonX mark with community members"
              className="tx-marketing-drift"
              style={{ position: 'relative', width: '100%', maxWidth: 'none', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section style={{ padding: '8px 28px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 19, color: '#413B47', fontWeight: 500 }}>
            A growing community of students, builders and industry speakers
          </span>
          <span style={{ flex: '1 1 120px', height: 1, background: 'rgba(20,17,24,0.12)', minWidth: 60 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex' }}>
              <img
                src={p01}
                alt=""
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  objectFit: 'cover',
                  objectPosition: '50% 26%',
                  border: '2px solid #F5F4F3',
                  display: 'block',
                }}
              />
              <img
                src={s130}
                alt=""
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  objectFit: 'cover',
                  objectPosition: '38% 42%',
                  border: '2px solid #F5F4F3',
                  marginLeft: -14,
                  display: 'block',
                }}
              />
              <img
                src={s25}
                alt=""
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  objectFit: 'cover',
                  objectPosition: '50% 20%',
                  border: '2px solid #F5F4F3',
                  marginLeft: -14,
                  display: 'block',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: '#141118' }}>1000+</span>
              <span style={{ fontSize: 14, color: '#5C5661' }}>builders reached so far</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section style={{ padding: '56px 28px 0' }}>
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(185px,1fr))',
            gap: 20,
          }}
        >
          <StatCard value="1000+" label="Young builders reached" />
          <StatCard value="10+" label="Speakers from industry" />
          <StatCard value="8" label="Tech tracks" />
          <StatCard value="100%" label="Expert mentors" />
        </div>
      </section>

      {/* The Series */}
      <section id="series" style={{ padding: '110px 28px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18, marginBottom: 48 }}>
            <span style={eyebrowStyle}>Where we gather</span>
            <h2 style={{ fontSize: 'clamp(40px,5.4vw,76px)', lineHeight: 0.9, color: '#141118' }}>THE SERIES</h2>
            <p style={{ fontSize: 18, lineHeight: 1.65, color: '#5C5661', maxWidth: '58ch', margin: 0 }}>
              Every edition puts builders, speakers and students in one room for a day. What starts as a talk ends
              as a group chat, a team, and the next thing someone ships.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 22 }}>
            {/* Edition 1.0 */}
            <article
              className="tx-card-hover"
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(20,17,24,0.06)',
                borderRadius: 22,
                padding: '14px 14px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gridTemplateRows: '1fr 1fr',
                  gap: 6,
                  borderRadius: 14,
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  background: '#EDEAF2',
                }}
              >
                <img
                  src={p01}
                  alt="FROM CAMPUS TO TECH CAREERS 1.0"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', gridRow: '1 / span 2' }}
                />
                <img src={p03} alt="FROM CAMPUS TO TECH CAREERS 1.0" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <img src={p06} alt="FROM CAMPUS TO TECH CAREERS 1.0" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignSelf: 'flex-start',
                    background: 'rgba(124,58,237,0.1)',
                    borderRadius: 999,
                    padding: '7px 14px',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#6D28D9',
                  }}
                >
                  Edition 1.0
                </span>
                <h3 style={{ fontSize: 30, lineHeight: 1, color: '#141118' }}>FROM CAMPUS TO TECH CAREERS 1.0</h3>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: '#5C5661', margin: 0 }}>
                  The first room. Talks from people working in the industry, open Q&amp;A, and the first hundreds of
                  builders in the community.
                </p>
              </div>
            </article>

            {/* Edition 2.0 */}
            <article
              className="tx-card-hover"
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(20,17,24,0.06)',
                borderRadius: 22,
                padding: '14px 14px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gridTemplateRows: '1fr 1fr',
                  gap: 6,
                  borderRadius: 14,
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  background: '#EDEAF2',
                }}
              >
                <img
                  src={s145}
                  alt="FROM CAMPUS TO TECH CAREERS 2.0"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: '50% 34%',
                    display: 'block',
                    gridRow: '1 / span 2',
                  }}
                />
                <img src={s111} alt="FROM CAMPUS TO TECH CAREERS 2.0" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <img src={s25} alt="FROM CAMPUS TO TECH CAREERS 2.0" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignSelf: 'flex-start',
                    background: 'rgba(124,58,237,0.1)',
                    borderRadius: 999,
                    padding: '7px 14px',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#6D28D9',
                  }}
                >
                  Edition 2.0
                </span>
                <h3 style={{ fontSize: 30, lineHeight: 1, color: '#141118' }}>FROM CAMPUS TO TECH CAREERS 2.0</h3>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: '#5C5661', margin: 0 }}>
                  Bigger room, more speakers, more tracks. Students mapped a direction and left with people to build
                  alongside.
                </p>
              </div>
            </article>

            {/* Tech. AI. Future. — no stills; Facebook reel link only */}
            <article
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 22,
                background: 'linear-gradient(150deg,#4C1D95 0%,#7C3AED 58%,#C026D3 100%)',
                padding: '14px 14px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                minWidth: 0,
                boxShadow: '0 24px 56px rgba(76,29,149,0.26)',
              }}
            >
              <a
                href={FACEBOOK_REEL_URL}
                target="_blank"
                rel="noopener"
                aria-label="Watch the Tech. AI. Future. recap"
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 14,
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.28)',
                }}
              >
                <img
                  src={tektonxMark}
                  alt=""
                  style={{ position: 'absolute', width: '66%', height: 'auto', opacity: 0.16, filter: 'brightness(0) invert(1)' }}
                />
                <span
                  style={{
                    position: 'relative',
                    width: 74,
                    height: 74,
                    borderRadius: 999,
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 14px 34px rgba(20,17,24,0.3)',
                  }}
                >
                  <Play size={28} color="#4C1D95" fill="#4C1D95" />
                </span>
              </a>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignSelf: 'flex-start',
                    background: 'rgba(255,255,255,0.18)',
                    border: '1px solid rgba(255,255,255,0.45)',
                    borderRadius: 999,
                    padding: '7px 14px',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                  }}
                >
                  Latest edition
                </span>
                <h3 style={{ fontSize: 30, lineHeight: 1, color: '#FFFFFF' }}>TECH. AI. FUTURE.</h3>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: '#FFFFFF', margin: 0 }}>
                  A day on where AI is taking the work, and what builders here should do about it. Watch the whole
                  thing in a minute.
                </p>
                <a
                  href={FACEBOOK_REEL_URL}
                  target="_blank"
                  rel="noopener"
                  className="tx-recap-link"
                  style={{
                    fontSize: 14,
                    color: '#FFFFFF',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    alignSelf: 'flex-start',
                  }}
                >
                  Watch the recap <ArrowUpRight size={15} />
                </a>
              </div>
            </article>
          </div>

          {/* Next edition band */}
          <div
            style={{
              marginTop: 22,
              background: '#FFFFFF',
              border: '1px dashed rgba(124,58,237,0.35)',
              borderRadius: 22,
              padding: '36px 34px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 22,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
              <span style={eyebrowStyle}>Next edition</span>
              <h3 style={{ fontSize: 34, lineHeight: 1, color: '#141118' }}>YOUR CAMPUS, YOUR CITY</h3>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: '#5C5661', margin: 0, maxWidth: '52ch' }}>
                We are opening the next round of editions. Tell us where the builders are and we will bring the room
                to them.
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link
                to="/partnerships"
                className="tx-btn-dark"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  background: '#141118',
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: 600,
                  padding: '16px 28px',
                  borderRadius: 10,
                  whiteSpace: 'nowrap',
                }}
              >
                Host an edition
              </Link>
              <Link
                to="/join"
                className="tx-btn-light-b"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  background: '#FFFFFF',
                  color: '#141118',
                  fontSize: 16,
                  fontWeight: 600,
                  padding: '16px 28px',
                  borderRadius: 10,
                  border: '1px solid rgba(20,17,24,0.1)',
                  whiteSpace: 'nowrap',
                }}
              >
                Get notified
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section id="about" style={{ padding: '110px 28px 0' }}>
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))',
            gap: 64,
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24, minWidth: 0 }}>
            <span style={eyebrowStyle}>Who we are</span>
            <h2 style={{ fontSize: 'clamp(40px,5vw,68px)', lineHeight: 0.92, color: '#141118' }}>
              ON THE GROUND,
              <br />
              NOT ONLINE ONLY
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: '#5C5661', margin: 0, maxWidth: '52ch' }}>
              Tekton is a Greek word meaning builder. The X stands for everything: people and products. We gather
              young builders in the rooms where the opportunity usually stops, lecture halls, hostels and community
              centres, and give them somewhere to keep building afterwards.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, color: '#2C2534' }}>
                <CircleCheck size={20} color="#7C3AED" /> Sessions led by people working in the industry
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, color: '#2C2534' }}>
                <CircleCheck size={20} color="#7C3AED" /> Peer-to-peer building, not a lecture series
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, color: '#2C2534' }}>
                <CircleCheck size={20} color="#7C3AED" /> A community you stay in after the event ends
              </span>
            </div>
            <a
              href="#programs"
              className="tx-btn-dark"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: '#141118',
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 600,
                padding: '16px 28px',
                borderRadius: 10,
                marginTop: 4,
              }}
            >
              See our programs
            </a>
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(20,17,24,0.06)',
                borderRadius: 24,
                padding: 12,
                boxShadow: '0 24px 60px rgba(20,17,24,0.08)',
              }}
            >
              <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '4/5', background: '#EDEAF2' }}>
                <img
                  src={s75}
                  alt="A participant at the From Campus to Tech Careers backdrop, PAAU 2025"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Programs */}
      <section id="programs" style={{ padding: '120px 28px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 18,
              marginBottom: 56,
            }}
          >
            <span style={eyebrowStyle}>What we offer</span>
            <h2 style={{ fontSize: 'clamp(40px,5.4vw,76px)', lineHeight: 0.9, color: '#141118', maxWidth: '22ch' }}>
              OUR PROGRAMS
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.65, color: '#5C5661', maxWidth: '56ch', margin: 0 }}>
              Six programs that carry a young person from first exposure to a paid role.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 22 }}>
            {PROGRAMS.map(({ Icon, title, description, gradient, shadowColor }) => (
              <article
                key={title}
                className="tx-card-hover"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(20,17,24,0.06)',
                  borderRadius: 20,
                  padding: '34px 32px 36px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  minWidth: 0,
                }}
              >
                <IconBadge Icon={Icon} gradient={gradient} shadowColor={shadowColor} size="lg" />
                <h3 style={{ fontSize: 30, lineHeight: 1, color: '#141118' }}>{title}</h3>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: '#5C5661', margin: 0 }}>{description}</p>
              </article>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
            <a
              href="#programs"
              className="tx-btn-light-a"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: '#FFFFFF',
                color: '#141118',
                fontSize: 16,
                fontWeight: 600,
                padding: '16px 30px',
                borderRadius: 10,
                border: '1px solid rgba(20,17,24,0.08)',
                boxShadow: '0 6px 20px rgba(20,17,24,0.06)',
              }}
            >
              View all programs <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Mentorship */}
      <section id="mentorship" style={{ padding: '120px 28px 0' }}>
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))',
            gap: 64,
            alignItems: 'center',
          }}
        >
          <div style={{ minWidth: 0, order: -1 }}>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(20,17,24,0.06)',
                borderRadius: 24,
                padding: 12,
                boxShadow: '0 24px 60px rgba(20,17,24,0.08)',
              }}
            >
              <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '4/5', background: '#EDEAF2' }}>
                <img
                  src={s181}
                  alt="A TektonX mentor speaking at the PAAU outreach"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 32%', display: 'block' }}
                />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24, minWidth: 0 }}>
            <span style={eyebrowStyle}>Mentorship</span>
            <h2 style={{ fontSize: 'clamp(40px,5vw,68px)', lineHeight: 0.92, color: '#141118' }}>
              PAIRED WITH SOMEONE
              <br />
              WHO HAS DONE IT
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: '#5C5661', margin: 0, maxWidth: '52ch' }}>
              Every mentee is matched to a track and an experienced professional working in it, then runs a
              three-month cycle of sessions, feedback and job support — not a one-off webinar.
            </p>
            <a
              href="#join"
              className="tx-btn-dark"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: '#141118',
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 600,
                padding: '16px 28px',
                borderRadius: 10,
              }}
            >
              Learn more
            </a>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 6 }}>
              {MENTORSHIP_PILLS.map((pill) => (
                <span
                  key={pill}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 9,
                    background: '#FFFFFF',
                    border: '1px solid rgba(20,17,24,0.08)',
                    borderRadius: 999,
                    padding: '12px 20px',
                    fontSize: 15,
                    color: '#2C2534',
                  }}
                >
                  <CircleCheck size={17} color="#7C3AED" /> {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section id="values" style={{ padding: '120px 28px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 18,
              marginBottom: 56,
            }}
          >
            <span style={eyebrowStyle}>What drives us</span>
            <h2 style={{ fontSize: 'clamp(40px,5.4vw,76px)', lineHeight: 0.9, color: '#141118', maxWidth: '24ch' }}>
              OUR CORE VALUES
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.65, color: '#5C5661', maxWidth: '56ch', margin: 0 }}>
              The principles that guide everything we do at TektonX.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            {VALUES.map(({ Icon, title, description, gradient, shadowColor }) => (
              <div
                key={title}
                style={{
                  flex: '1 1 210px',
                  background: '#FFFFFF',
                  border: '1px solid rgba(20,17,24,0.06)',
                  borderRadius: 18,
                  padding: '28px 26px 30px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  minWidth: 0,
                }}
              >
                <IconBadge Icon={Icon} gradient={gradient} shadowColor={shadowColor} size="sm" />
                <h3 style={{ fontSize: 24, lineHeight: 1, color: '#141118' }}>{title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: '#5C5661', margin: 0 }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <JoinPanel
        heading="COME BUILD WITH US"
        headingMaxCh="20ch"
        body="Join the community, come to the next event, or bring TektonX to your location."
        bodyMaxCh="56ch"
        align="center"
        primary={{ to: '/join', label: 'Join the community' }}
        secondary={{ to: '/partnerships', label: 'Bring TektonX to your location' }}
      />
    </div>
  )
}
