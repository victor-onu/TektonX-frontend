import { Link } from 'react-router-dom'
import {
  Users,
  Code,
  Trophy,
  Building2,
  Heart,
  Lightbulb,
  Target,
  UsersRound,
  Shield,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '1000+', label: 'Young People Reached' },
  { value: '50+', label: 'Mentors Network' },
  { value: '7', label: 'Tech Tracks' },
  { value: '3', label: 'Months Program' },
]

// ─── Programs ─────────────────────────────────────────────────────────────────

const PROGRAMS = [
  {
    Icon: Users,
    title: 'From Campus to Tech Careers',
    description: 'Outreach and awareness sessions across university campuses, inspiring students in unreached regions.',
    accent: 'text-tekton-purple-bright',
    iconBg: 'bg-tekton-purple-bright/15',
  },
  {
    Icon: Code,
    title: 'Code for Growth',
    description: 'Structured bootcamps in coding, design, product management, and digital skills.',
    accent: 'text-tekton-green',
    iconBg: 'bg-tekton-green/15',
  },
  {
    Icon: Trophy,
    title: 'TektonX Competitions',
    description: 'Inter-school and inter-community hackathons, coding contests, and innovation challenges.',
    accent: 'text-tekton-yellow',
    iconBg: 'bg-tekton-yellow/15',
  },
  {
    Icon: Building2,
    title: 'TektonX Hub',
    description: 'Physical and virtual hub for young innovators with coworking spaces and training programs.',
    accent: 'text-tekton-teal',
    iconBg: 'bg-tekton-teal/15',
  },
  {
    Icon: Heart,
    title: 'Mentorship & Career Support',
    description: 'Pairing participants with experienced tech professionals for career guidance and job support.',
    accent: 'text-tekton-purple-bright',
    iconBg: 'bg-tekton-purple-bright/15',
  },
  {
    Icon: Lightbulb,
    title: 'Tech Pathways Series',
    description: 'Interactive workshops, talks, and competitions introducing young people to tech opportunities.',
    accent: 'text-tekton-blue',
    iconBg: 'bg-tekton-blue/15',
  },
]

// ─── Core Values ──────────────────────────────────────────────────────────────

const VALUES = [
  {
    Icon: Target,
    title: 'ACCESS FOR ALL',
    description: 'We remove barriers to tech education and opportunities.',
  },
  {
    Icon: Users,
    title: 'EMPOWERMENT',
    description: 'We equip young people to build sustainable careers and solutions.',
  },
  {
    Icon: Lightbulb,
    title: 'INNOVATION',
    description: 'We nurture creativity and problem-solving with a future-focused mindset.',
  },
  {
    Icon: UsersRound,
    title: 'COMMUNITY',
    description: 'We foster collaboration, networking, and shared growth.',
  },
  {
    Icon: Shield,
    title: 'INTEGRITY',
    description: 'We remain transparent, ethical, and people-centered in all we do.',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function Index() {
  return (
    <div className="flex flex-col">
      {/* ════════════════════════════════════════════════════════
          Section 1 — Hero
      ════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen pt-16 flex items-center justify-center overflow-hidden bg-black">
        {/* Background image */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <img
            src="https://mgx-backend-cdn.metadl.com/generate/images/902124/2026-01-13/41b32de7-8bae-49dd-953d-e03d6840af7e.png"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>
        {/* Orbs + grid on top of image */}
        <div className="pointer-events-none absolute inset-0 z-[1]">
          <div className="absolute -top-20 -right-20 size-[600px] rounded-full bg-tekton-purple-bright/20 blur-[120px]" />
          <div className="absolute bottom-0 -left-20 size-[400px] rounded-full bg-tekton-teal/15 blur-[100px]" />
          <div className="absolute inset-0 bg-grid opacity-20" />
        </div>

        <div className="relative z-[2] mx-auto max-w-5xl px-4 text-center flex flex-col items-center gap-8">
          {/* Main headline */}
          <h1 className="font-heading text-6xl leading-[0.95] tracking-wide text-white sm:text-7xl lg:text-8xl">
            BUILDING PEOPLE.
            <br />
            <span className="gradient-text">BUILDING PRODUCTS.</span>
            <br />
            BUILDING AFRICA.
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl text-base text-white/55 sm:text-lg leading-relaxed">
            TektonX is a youth-focused tech empowerment and innovation lab dedicated to helping
            young people across Africa discover, learn, and create in technology.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-tekton-purple-bright px-8 text-white hover:bg-tekton-purple-bright/90 glow-purple gap-2 text-base font-semibold"
            >
              <Link to="/mentorship">
                Join Mentorship Program
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 bg-white/5 px-8 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-sm text-base font-medium"
            >
              <Link to="/programs">Explore Programs</Link>
            </Button>
          </div>

          {/* Stats row */}
          <div className="mt-4 flex items-center justify-center divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-4 backdrop-blur-sm">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 px-6 sm:px-10">
                <span className="font-heading text-3xl leading-none gradient-text sm:text-4xl">
                  {value}
                </span>
                <span className="text-xs font-medium text-white/40 uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-[2]" />
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 2 — Our Programs
      ════════════════════════════════════════════════════════ */}
      <section className="py-28 px-4 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-tekton-purple-bright/70">
              What We Offer
            </p>
            <h2 className="font-heading text-5xl text-white sm:text-6xl">
              OUR{' '}
              <span className="gradient-text">PROGRAMS</span>
            </h2>
            <p className="mt-5 text-white/50 max-w-xl mx-auto">
              Comprehensive programs designed to empower young Africans with tech skills and opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROGRAMS.map(({ Icon, title, description, accent, iconBg }) => (
              <div
                key={title}
                className="glass-card rounded-2xl p-7 flex flex-col gap-4 smooth-hover hover:-translate-y-0.5 transition-all hover:border-white/20"
              >
                <div className={`flex size-12 items-center justify-center rounded-xl shrink-0 ${iconBg}`}>
                  <Icon className={`size-6 ${accent}`} />
                </div>
                <h3 className="font-heading text-2xl text-white">{title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-tekton-purple-bright/50 text-tekton-purple-bright hover:bg-tekton-purple-bright hover:text-white gap-2"
            >
              <Link to="/programs">
                View All Programs
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 3 — Our Core Values
      ════════════════════════════════════════════════════════ */}
      <section className="relative py-28 px-4 bg-black bg-grid">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-tekton-teal/70">
              What Drives Us
            </p>
            <h2 className="font-heading text-5xl text-white sm:text-6xl">
              OUR CORE{' '}
              <span className="gradient-text">VALUES</span>
            </h2>
            <p className="mt-5 text-white/50 max-w-xl mx-auto">
              The principles that guide everything we do at TektonX
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {VALUES.map(({ Icon, title, description }) => (
              <div
                key={title}
                className="glass-card rounded-2xl p-6 flex flex-col items-center text-center gap-3 smooth-hover hover:-translate-y-1 transition-all"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-tekton-green/15">
                  <Icon className="size-5 text-tekton-green" />
                </div>
                <h3 className="font-heading text-lg text-white">{title}</h3>
                <p className="text-xs text-white/55 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 4 — CTA Banner
      ════════════════════════════════════════════════════════ */}
      <section className="py-28 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-tekton-purple-bright/20 px-8 py-20 text-center">
            {/* Gradient background */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(76,29,149,0.6) 0%, rgba(124,58,237,0.4) 50%, rgba(20,184,166,0.2) 100%)',
              }}
            />
            {/* Decorative orbs */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 -right-20 size-60 rounded-full bg-tekton-purple-bright/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 size-60 rounded-full bg-tekton-teal/15 blur-3xl" />
            </div>
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-grid opacity-20" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              <h2 className="font-heading text-5xl text-white sm:text-6xl leading-tight">
                READY TO START YOUR
                <br />
                <span className="gradient-text">TECH JOURNEY?</span>
              </h2>
              <p className="max-w-lg text-white/65 leading-relaxed">
                Join our mentorship program and get paired with experienced tech professionals
                who will guide you through your chosen tech track.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-tekton-purple-deep hover:bg-white/90 font-semibold px-10 text-base"
                >
                  <Link to="/auth/register">Register as Mentee</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/40 bg-white/5 px-10 text-white hover:bg-white/10 hover:border-white/60 backdrop-blur-sm font-semibold text-base"
                >
                  <Link to="/auth/register?role=mentor">Become a Mentor</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
