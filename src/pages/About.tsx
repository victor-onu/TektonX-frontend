import { useScrollToHash } from '@/hooks/useScrollToHash'
import { StatCard, DarkButton, JoinPanel } from '@/components/marketing/ui'
import { eyebrowStyle } from '@/components/marketing/tokens'
import heroX from '@/assets/marketing/hero-x.png'
import p02 from '@/assets/marketing/photos/p02.jpeg'
import p08 from '@/assets/marketing/photos/p08.jpeg'
import s25 from '@/assets/marketing/solex/s25.jpg'
import s75 from '@/assets/marketing/solex/s75.jpg'
import s100 from '@/assets/marketing/solex/s100.jpg'
import s145 from '@/assets/marketing/solex/s145.jpg'

const HERO_STRIP = [
  { src: s25, alt: 'TektonX community event' },
  { src: p02, alt: 'Builders at a TektonX session' },
  { src: s100, alt: 'A speaker addressing the room' },
  { src: p08, alt: 'Attendees at a TektonX event' },
  { src: s145, alt: 'Group photo from a TektonX event' },
] as const

const CORE_VALUES = [
  {
    num: '01',
    title: 'EXCELLENCE',
    description: 'We hold ourselves and our community to the highest standard in everything we build and create.',
  },
  {
    num: '02',
    title: 'COMMUNITY',
    description:
      'We believe the best growth happens together, in a supportive, collaborative ecosystem that thrives on the ground, not just online.',
  },
  {
    num: '03',
    title: 'IMPACT',
    description: 'Every line of code, every design, and every local event is measured by the lives it changes.',
  },
  {
    num: '04',
    title: 'INNOVATION',
    description: 'We encourage creative problem-solving and bold thinking across every technology discipline.',
  },
  {
    num: '05',
    title: 'ACCESSIBILITY',
    description:
      'World-class tech networks and collaborative spaces should be within reach of every African, regardless of background or region.',
  },
  {
    num: '06',
    title: 'EMPOWERMENT',
    description: 'We equip individuals with not just skills, but the confidence to build real solutions and lead local tech chapters.',
  },
] as const

export default function About() {
  useScrollToHash()

  return (
    <div className="tx-marketing">
      {/* Hero */}
      <section
        id="story"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background:
            'radial-gradient(64% 58% at 72% 34%, rgba(168,85,247,0.14) 0%, rgba(250,248,246,0) 72%), #FAF8F6',
        }}
      >
        <div
          className="tx-marketing-rise"
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: '88px 28px 64px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 26,
          }}
        >
          <span style={eyebrowStyle}>Our Story</span>
          <h1 style={{ fontSize: 'clamp(52px,7vw,104px)', lineHeight: 0.86, color: '#0E0B12', maxWidth: '16ch' }}>
            BUILDING AFRICA&apos;S
            <br />
            <span
              style={{
                background: 'linear-gradient(100deg,#7C3AED,#C026D3)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TECH FUTURE
            </span>
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 2 }}>
            <DarkButton to="/join">Join the community</DarkButton>
            <a
              href="#serve"
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
              Who we serve
            </a>
          </div>
        </div>
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: '0 28px 72px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
            gap: 14,
          }}
        >
          {HERO_STRIP.map(({ src, alt }) => (
            <div key={alt} style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '3/4', background: '#EDEAF2' }}>
              <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '72px 28px 0' }}>
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
          <StatCard value="18–30" label="Who we build with" />
          <StatCard value="8" label="Tech tracks" />
        </div>
      </section>

      {/* The meaning of our name */}
      <section id="name" style={{ padding: '110px 28px 0' }}>
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))',
            gap: 64,
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 22, minWidth: 0 }}>
            <span style={eyebrowStyle}>The meaning of our name</span>
            <h2 style={{ fontSize: 'clamp(40px,5vw,68px)', lineHeight: 0.92, color: '#141118' }}>
              A MOVEMENT
              <br />
              OF BUILDERS
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: '#5C5661', margin: 0, maxWidth: '54ch' }}>
              Tekton is a Greek word meaning builder, representing our commitment to raising builders of technology,
              solutions, and impact.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: '#5C5661', margin: 0, maxWidth: '54ch' }}>
              The &quot;X&quot; stands for everything: people and products. It symbolizes the limitless possibilities
              when builders come together.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: '#5C5661', margin: 0, maxWidth: '54ch' }}>
              Together, TektonX represents a movement of builders of everything: people, communities, and products
              that shape Africa&apos;s future.
            </p>
          </div>
          <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={heroX} alt="The TektonX mark" style={{ width: '100%', maxWidth: 520, height: 'auto', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* Vision / Mission */}
      <section id="vision" style={{ padding: '110px 28px 0' }}>
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))',
            gap: 22,
          }}
        >
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 24,
              background: 'linear-gradient(120deg,#4C1D95 0%,#7C3AED 60%,#C026D3 100%)',
              padding: 'clamp(38px,4.5vw,60px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              boxShadow: '0 30px 70px rgba(76,29,149,0.24)',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#FFFFFF' }}>
              Vision
            </span>
            <h3 style={{ fontSize: 'clamp(38px,4.4vw,60px)', lineHeight: 0.92, color: '#FFFFFF' }}>
              BUILDING PEOPLE.
              <br />
              BUILDING PRODUCTS.
              <br />
              BUILDING AFRICA.
            </h3>
          </div>
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(20,17,24,0.06)',
              borderRadius: 24,
              padding: 'clamp(38px,4.5vw,60px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            <span style={eyebrowStyle}>Mission</span>
            <p style={{ fontSize: 'clamp(19px,1.7vw,23px)', lineHeight: 1.6, color: '#2C2534', margin: 0 }}>
              To foster a vibrant, collaborative ecosystem where young African builders can connect, access shared
              spaces, and shape the digital landscape through community-driven tech events, hackathons, and
              peer-to-peer innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section id="values" style={{ padding: '110px 28px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18, marginBottom: 48 }}>
            <span style={eyebrowStyle}>What We Stand For</span>
            <h2 style={{ fontSize: 'clamp(40px,5.4vw,76px)', lineHeight: 0.9, color: '#141118' }}>CORE VALUES</h2>
            <p style={{ fontSize: 18, lineHeight: 1.65, color: '#5C5661', maxWidth: '56ch', margin: 0 }}>
              The principles that guide everything we build and every life we shape.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 22 }}>
            {CORE_VALUES.map(({ num, title, description }) => (
              <div
                key={num}
                className="tx-card-hover"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(20,17,24,0.06)',
                  borderRadius: 20,
                  padding: '32px 30px 34px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 34,
                    lineHeight: 0.9,
                    background: 'linear-gradient(100deg,#7C3AED,#C026D3)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {num}
                </span>
                <h3 style={{ fontSize: 28, lineHeight: 1, color: '#141118' }}>{title}</h3>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: '#5C5661', margin: 0 }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section id="serve" style={{ padding: '110px 28px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18, marginBottom: 48 }}>
            <span style={eyebrowStyle}>Our Community</span>
            <h2 style={{ fontSize: 'clamp(40px,5.4vw,76px)', lineHeight: 0.9, color: '#141118' }}>WHO WE SERVE</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 22, alignItems: 'stretch' }}>
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(20,17,24,0.06)',
                  borderRadius: 24,
                  padding: '36px 34px 38px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 9,
                    alignSelf: 'flex-start',
                    background: 'rgba(124,58,237,0.1)',
                    borderRadius: 999,
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#6D28D9',
                  }}
                >
                  Primary
                </span>
                <h3 style={{ fontSize: 34, lineHeight: 1, color: '#141118' }}>YOUNG BUILDERS &amp; CREATORS</h3>
                <p style={{ fontSize: 17, lineHeight: 1.7, color: '#5C5661', margin: 0 }}>
                  Students, campus innovators, and early-career individuals age across Africa who want to connect,
                  collaborate, and build tech products alongside ambitious peers through active community
                  engagement.
                </p>
              </div>
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(20,17,24,0.06)',
                  borderRadius: 24,
                  padding: '36px 34px 38px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 9,
                    alignSelf: 'flex-start',
                    background: 'rgba(20,17,24,0.06)',
                    borderRadius: 999,
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#413B47',
                  }}
                >
                  Secondary
                </span>
                <h3 style={{ fontSize: 34, lineHeight: 1, color: '#141118' }}>ECOSYSTEM LEADERS &amp; INDUSTRY EXPERTS</h3>
                <p style={{ fontSize: 17, lineHeight: 1.7, color: '#5C5661', margin: 0 }}>
                  Experienced professionals and community advocates looking to share knowledge at our events,
                  sponsor regional hubs, and help shape the next generation of African tech talent by speaking,
                  collaborating, and guiding on the ground.
                </p>
              </div>
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(20,17,24,0.06)',
                  borderRadius: 24,
                  padding: 12,
                  boxShadow: '0 24px 60px rgba(20,17,24,0.08)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ borderRadius: 16, overflow: 'hidden', flex: '1 1 auto', minHeight: 420, background: '#EDEAF2' }}>
                  <img
                    src={s75}
                    alt="A TektonX community member at the From Campus to Tech Careers backdrop"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <span style={{ fontSize: 14, lineHeight: 1.5, color: '#7A737F', padding: '0 10px 10px' }}>
                  One of the builders in our community, at From Campus to Tech Careers.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <JoinPanel
        heading="JOIN US IN BUILDING AFRICA'S TECH FUTURE"
        headingMaxCh="18ch"
        body="Come to the next event, build alongside people your age, and help lead what comes after it."
        bodyMaxCh="54ch"
        align="flex-start"
        primary={{ to: '/join', label: 'Join the community' }}
        secondary={{ to: '/partnerships', label: 'Speak or partner with us' }}
      />
    </div>
  )
}
