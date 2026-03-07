import { Link } from 'react-router-dom'
import {
  Star,
  Users,
  Zap,
  Lightbulb,
  Globe,
  Rocket,
  Eye,
  Target,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'

// ─── Core Values ─────────────────────────────────────────────────────────────

interface CoreValue {
  Icon: LucideIcon
  title: string
  description: string
  color: string
  iconBg: string
  num: string
  borderColor: string
}

const CORE_VALUES: CoreValue[] = [
  {
    Icon: Star,
    title: 'Excellence',
    description: 'We hold ourselves and our mentees to the highest standard in everything we produce.',
    color: 'text-tekton-yellow',
    iconBg: 'bg-tekton-yellow/15',
    num: '01',
    borderColor: 'border-l-tekton-yellow',
  },
  {
    Icon: Users,
    title: 'Community',
    description: 'We believe the best growth happens together — in a supportive, collaborative community.',
    color: 'text-tekton-teal',
    iconBg: 'bg-tekton-teal/15',
    num: '02',
    borderColor: 'border-l-tekton-teal',
  },
  {
    Icon: Zap,
    title: 'Impact',
    description: 'Every line of code, every design, every decision is measured by the lives it changes.',
    color: 'text-tekton-purple-bright',
    iconBg: 'bg-tekton-purple-bright/15',
    num: '03',
    borderColor: 'border-l-tekton-purple-bright',
  },
  {
    Icon: Lightbulb,
    title: 'Innovation',
    description: 'We encourage creative problem-solving and bold thinking across every tech track.',
    color: 'text-tekton-yellow',
    iconBg: 'bg-tekton-yellow/15',
    num: '04',
    borderColor: 'border-l-tekton-yellow',
  },
  {
    Icon: Globe,
    title: 'Accessibility',
    description: 'World-class tech education should be within reach of every African, regardless of background.',
    color: 'text-tekton-green',
    iconBg: 'bg-tekton-green/15',
    num: '05',
    borderColor: 'border-l-tekton-green',
  },
  {
    Icon: Rocket,
    title: 'Empowerment',
    description: 'We equip individuals with not just skills, but the confidence to build and lead.',
    color: 'text-tekton-blue',
    iconBg: 'bg-tekton-blue/15',
    num: '06',
    borderColor: 'border-l-tekton-blue',
  },
]

// ─── Growth Roadmap ───────────────────────────────────────────────────────────

const ROADMAP_PHASES = [
  {
    phase: 'Phase 1',
    title: 'Foundation',
    period: '2024 – Q1 2025',
    description:
      'Launch the mentorship program, onboard the first cohort of mentors and mentees, and validate the 12-week curriculum across 7 tech tracks.',
    color: 'border-tekton-purple-bright',
    dot: 'bg-tekton-purple-bright',
    label: 'text-tekton-purple-bright',
  },
  {
    phase: 'Phase 2',
    title: 'Growth',
    period: 'Q2 – Q4 2025',
    description:
      'Scale mentee enrollment, introduce the Hub and Competitions programs, and expand mentor network across West Africa.',
    color: 'border-tekton-teal',
    dot: 'bg-tekton-teal',
    label: 'text-tekton-teal',
  },
  {
    phase: 'Phase 3',
    title: 'Pan-African Expansion',
    period: '2026',
    description:
      'Launch Campus to Tech Careers and Code for Growth programs, partnering with universities and NGOs across the continent.',
    color: 'border-tekton-yellow',
    dot: 'bg-tekton-yellow',
    label: 'text-tekton-yellow',
  },
  {
    phase: 'Phase 4',
    title: 'Global Impact',
    period: '2027+',
    description:
      'Establish TektonX as the leading tech talent development platform in Africa, creating a verified talent pipeline for global employers.',
    color: 'border-tekton-green',
    dot: 'bg-tekton-green',
    label: 'text-tekton-green',
  },
]

// ─── Target Audience ─────────────────────────────────────────────────────────

const AUDIENCES = [
  {
    label: 'Primary',
    title: 'Aspiring Tech Professionals',
    description:
      'Students and early-career individuals aged 18–30 across Africa who want to break into tech with structured guidance, real projects, and industry mentorship.',
    border: 'border-glow-purple',
    badge: 'bg-tekton-purple-bright/15 text-tekton-purple-bright border-tekton-purple-bright/30',
  },
  {
    label: 'Secondary',
    title: 'Experienced Tech Professionals',
    description:
      'Mid-career professionals looking to give back, share expertise, and shape the next generation of African tech talent by becoming mentors.',
    border: 'border-glow-teal',
    badge: 'bg-tekton-teal/15 text-tekton-teal border-tekton-teal/30',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function About() {
  return (
    <div className="flex flex-col">
      {/* ════════════════════════════════════════════════════════
          Section 1 — Hero
      ════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[65vh] flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center overflow-hidden bg-black">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -right-40 size-[500px] rounded-full bg-tekton-purple-bright/15 blur-[120px]" />
          <div className="absolute bottom-0 -left-20 size-[300px] rounded-full bg-tekton-teal/10 blur-[100px]" />
          <div className="absolute inset-0 bg-grid opacity-30" />
        </div>

        <div className="relative z-10 max-w-3xl flex flex-col items-center gap-6">
          <span className="inline-flex items-center rounded-full border border-tekton-purple-bright/40 bg-tekton-purple-bright/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-tekton-purple-bright">
            Our Story
          </span>

          <h1 className="font-heading text-5xl text-white sm:text-6xl lg:text-7xl leading-tight">
            BUILDING AFRICA'S
            <br />
            <span className="gradient-text">TECH FUTURE</span>
          </h1>

        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 2 — Meaning of Our Name
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-black">
        <div className="mx-auto max-w-4xl">
          <div className="glass-card rounded-2xl p-8 sm:p-12 flex flex-col gap-6">
            <h2 className="font-heading text-3xl sm:text-4xl text-white text-center">
              THE MEANING OF OUR NAME
            </h2>
            <div className="flex flex-col gap-4 text-white/80 leading-relaxed">
              <p className="text-base sm:text-lg">
                <span className="text-tekton-purple-bright font-semibold">Tekton</span> is a Greek word meaning{' '}
                <span className="text-tekton-green font-semibold">builder</span> — representing our commitment to
                raising builders of technology, solutions, and impact.
              </p>
              <p className="text-base sm:text-lg">
                The <span className="text-tekton-yellow font-semibold">"X"</span> stands for{' '}
                <span className="text-tekton-teal font-semibold">everything</span>: people and products.
                It symbolizes the limitless possibilities when builders come together.
              </p>
              <p className="text-base sm:text-lg text-center pt-2">
                Together, <span className="gradient-text font-bold text-xl">TektonX</span> represents a movement of{' '}
                <span className="text-white font-semibold">builders of everything</span> — people, communities,
                and products that shape Africa's future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 3 — Vision & Mission
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-black">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Vision */}
            <div className="glass-card rounded-2xl p-8 border-glow-purple smooth-hover hover:-translate-y-0.5 transition-all">
              <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-tekton-purple-bright/15">
                <Eye className="size-6 text-tekton-purple-bright" />
              </div>
              <p className="font-heading text-4xl text-gradient-purple mb-4">VISION</p>
              <p className="text-white/60 leading-relaxed">
                A continent where every African with talent and drive can access world-class tech mentorship,
                build real products, and compete in the global digital economy — regardless of where they start.
              </p>
            </div>

            {/* Mission */}
            <div className="glass-card rounded-2xl p-8 border-glow-teal smooth-hover hover:-translate-y-0.5 transition-all">
              <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-tekton-teal/15">
                <Target className="size-6 text-tekton-teal" />
              </div>
              <p className="font-heading text-4xl text-gradient-teal mb-4">MISSION</p>
              <p className="text-white/60 leading-relaxed">
                To equip aspiring tech professionals with structured mentorship, hands-on projects, and verified
                credentials through a 12-week program that builds both technical expertise and professional readiness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 4 — Core Values
      ════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-4 bg-grid bg-black">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-tekton-purple-bright/70">
              What We Stand For
            </p>
            <h2 className="font-heading text-5xl text-white sm:text-6xl">
              CORE <span className="gradient-text">VALUES</span>
            </h2>
            <p className="mt-5 text-white/50 max-w-xl mx-auto">
              The principles that guide everything we build and every life we shape.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_VALUES.map(({ Icon, title, description, color, iconBg, num, borderColor }) => (
              <div
                key={title}
                className={`glass-card rounded-xl p-6 border-l-2 ${borderColor} smooth-hover hover:-translate-y-0.5 transition-all`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className={`flex size-10 items-center justify-center rounded-lg ${iconBg}`}>
                    <Icon className={`size-5 ${color}`} />
                  </div>
                  <span className={`font-heading text-3xl ${color} opacity-30`}>{num}</span>
                </div>
                <h3 className={`mb-2 font-heading text-xl ${color}`}>{title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 4 — Who We Serve
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-white/[0.02]">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-tekton-teal/70">
              Our Community
            </p>
            <h2 className="font-heading text-5xl text-white sm:text-6xl">
              WHO WE <span className="gradient-text">SERVE</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {AUDIENCES.map(({ label, title, description, border, badge }) => (
              <div
                key={label}
                className={`glass-card rounded-2xl p-8 smooth-hover hover:-translate-y-0.5 transition-all ${border}`}
              >
                <span className={`mb-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badge}`}>
                  {label}
                </span>
                <h3 className="mb-3 font-heading text-2xl text-white">{title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 5 — Growth Roadmap
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-black">
        <div className="mx-auto max-w-3xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-tekton-purple-bright/70">
              Our Journey
            </p>
            <h2 className="font-heading text-5xl text-white sm:text-6xl">
              GROWTH <span className="gradient-text">ROADMAP</span>
            </h2>
            <p className="mt-5 text-white/50">From launch to continental impact.</p>
          </div>

          <div className="relative flex flex-col gap-0">
            {/* Vertical timeline line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-tekton-purple-bright/60 via-tekton-teal/40 to-tekton-green/20" />

            {ROADMAP_PHASES.map(({ phase, title, period, description, dot, label: labelColor }) => (
              <div key={phase} className="relative flex gap-8 pb-12 last:pb-0">
                {/* Dot */}
                <div className={`relative z-10 mt-1 flex size-8 shrink-0 items-center justify-center rounded-full ${dot} shadow-lg`}>
                  <div className="size-3 rounded-full bg-black" />
                </div>

                {/* Content */}
                <div className="glass-card rounded-xl p-6 flex-1 smooth-hover hover:-translate-y-0.5 transition-all">
                  <div className="mb-2 flex items-center gap-3 flex-wrap">
                    <span className={`font-heading text-lg ${labelColor}`}>{phase}</span>
                    <span className="text-xs text-white/30 font-mono">{period}</span>
                  </div>
                  <h3 className="mb-2 font-heading text-2xl text-white">{title}</h3>
                  <p className="text-sm text-white/55 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 6 — CTA
      ════════════════════════════════════════════════════════ */}
      <section className="py-28 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-tekton-purple-bright/20 px-8 py-20 text-center">
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(76,29,149,0.6) 0%, rgba(124,58,237,0.4) 50%, rgba(20,184,166,0.2) 100%)',
              }}
            />
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 -right-20 size-60 rounded-full bg-tekton-purple-bright/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 size-60 rounded-full bg-tekton-teal/15 blur-3xl" />
            </div>
            <div className="absolute inset-0 bg-grid opacity-20" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              <h2 className="font-heading text-5xl text-white sm:text-6xl leading-tight">
                JOIN US IN BUILDING
                <br />
                <span className="gradient-text">AFRICA'S TECH FUTURE</span>
              </h2>
              <p className="max-w-lg text-white/60 leading-relaxed">
                Whether you're ready to learn or ready to give back, there's a place for you at TektonX.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-tekton-purple-bright px-10 text-white hover:bg-tekton-purple-bright/90 glow-purple font-semibold gap-2"
                >
                  <Link to="/auth/register">
                    Get Started Today
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
