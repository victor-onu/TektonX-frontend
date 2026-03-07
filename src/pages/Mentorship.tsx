import { Link } from 'react-router-dom'
import {
  Code,
  Palette,
  Smartphone,
  Briefcase,
  ShieldCheck,
  BarChart3,
  Lock,
  CheckCircle,
  Users,
  BookOpen,
  Award,
  MessageSquare,
  FileText,
  Video,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TECH_TRACKS } from '@/types'
import type { LucideIcon } from 'lucide-react'
import type { ExperienceLevel } from '@/types'

// ─── Track data ───────────────────────────────────────────────────────────────

const TRACK_ICONS: LucideIcon[] = [
  Code,
  Palette,
  Smartphone,
  Briefcase,
  ShieldCheck,
  BarChart3,
  Lock,
]

interface TrackDetail {
  description: string
  learnings: [string, string, string]
  level: ExperienceLevel
  accentColor: string
  borderColor: string
  iconBg: string
  iconColor: string
}

const TRACK_DETAILS: Record<string, TrackDetail> = {
  'Software Development (Frontend & Backend)': {
    description: 'Master the full web development stack — from crafting pixel-perfect UIs to building robust server-side APIs and databases.',
    learnings: [
      'Modern frontend frameworks (React, Vue) & backend (Node.js, Express)',
      'Database design (SQL & NoSQL) and RESTful API development',
      'Deployment, CI/CD pipelines, and web performance optimization',
    ],
    level: 'Beginner',
    accentColor: 'text-tekton-purple-bright',
    borderColor: 'border-l-tekton-purple-bright',
    iconBg: 'bg-tekton-purple-bright/15',
    iconColor: 'text-tekton-purple-bright',
  },
  'UI/UX Design': {
    description: 'Learn to research, wireframe, prototype, and deliver exceptional digital experiences that are both beautiful and accessible.',
    learnings: [
      'User research methodologies and journey mapping',
      'Figma prototyping, design systems, and component libraries',
      'Usability testing, accessibility standards, and design handoff',
    ],
    level: 'Beginner',
    accentColor: 'text-tekton-teal',
    borderColor: 'border-l-tekton-teal',
    iconBg: 'bg-tekton-teal/15',
    iconColor: 'text-tekton-teal',
  },
  'Mobile App Development': {
    description: 'Build production-grade cross-platform mobile applications for iOS and Android using modern frameworks.',
    learnings: [
      'React Native / Flutter fundamentals and advanced patterns',
      'State management, native APIs, and offline-first architecture',
      'App Store deployment, performance profiling, and monetization',
    ],
    level: 'Intermediate',
    accentColor: 'text-tekton-blue',
    borderColor: 'border-l-tekton-blue',
    iconBg: 'bg-tekton-blue/15',
    iconColor: 'text-tekton-blue',
  },
  'Product/Project Management': {
    description: 'Develop the skills to lead cross-functional teams, define product strategy, and deliver software on time and on target.',
    learnings: [
      'Agile methodologies: Scrum, Kanban, and sprint planning',
      'Product roadmapping, stakeholder management, and OKRs',
      'Data-driven decision making and user story writing',
    ],
    level: 'Intermediate',
    accentColor: 'text-tekton-yellow',
    borderColor: 'border-l-tekton-yellow',
    iconBg: 'bg-tekton-yellow/15',
    iconColor: 'text-tekton-yellow',
  },
  'Quality Assurance (QA)': {
    description: 'Ensure software reliability through systematic testing strategies, automation frameworks, and continuous quality processes.',
    learnings: [
      'Manual testing techniques: functional, regression, and exploratory',
      'Test automation with Selenium, Playwright, or Cypress',
      'CI/CD integration, bug reporting, and quality metrics',
    ],
    level: 'Beginner',
    accentColor: 'text-tekton-green',
    borderColor: 'border-l-tekton-green',
    iconBg: 'bg-tekton-green/15',
    iconColor: 'text-tekton-green',
  },
  'Data (Analysis/Science)': {
    description: 'Harness the power of data — from cleaning and analyzing datasets to building predictive models and visualizing insights.',
    learnings: [
      'Python/R for data analysis: pandas, NumPy, and visualization libraries',
      'Statistical analysis, hypothesis testing, and exploratory data analysis',
      'Machine learning fundamentals with scikit-learn and model deployment',
    ],
    level: 'Intermediate',
    accentColor: 'text-tekton-purple-bright',
    borderColor: 'border-l-tekton-purple-bright',
    iconBg: 'bg-tekton-purple-bright/15',
    iconColor: 'text-tekton-purple-bright',
  },
  'Cybersecurity': {
    description: 'Understand attack vectors, defense mechanisms, and best practices to protect systems and data in an increasingly hostile digital world.',
    learnings: [
      'Network security fundamentals, firewalls, and VPN configuration',
      'Ethical hacking, penetration testing, and OWASP Top 10',
      'Incident response, security auditing, and compliance frameworks',
    ],
    level: 'Advanced',
    accentColor: 'text-red-400',
    borderColor: 'border-l-red-500',
    iconBg: 'bg-red-500/15',
    iconColor: 'text-red-400',
  },
}

const LEVEL_COLORS: Record<ExperienceLevel, string> = {
  Beginner: 'bg-tekton-green/15 text-tekton-green border-tekton-green/30',
  Intermediate: 'bg-tekton-yellow/15 text-tekton-yellow border-tekton-yellow/30',
  Advanced: 'bg-red-500/15 text-red-400 border-red-500/30',
}

// ─── Milestones ───────────────────────────────────────────────────────────────

const MILESTONES = [
  {
    id: 'M1',
    weeks: 'Weeks 1–4',
    label: 'FOUNDATIONS',
    description: 'Build your technical base, set up your environment, and complete your first guided project.',
    headerBg: 'bg-gradient-to-r from-tekton-purple-deep to-tekton-purple-bright',
    accentColor: 'text-tekton-purple-bright',
    borderColor: 'border-tekton-purple-bright/30',
  },
  {
    id: 'M2',
    weeks: 'Weeks 5–8',
    label: 'BUILDING',
    description: 'Deepen your skills, tackle more complex challenges, and start your capstone project.',
    headerBg: 'bg-gradient-to-r from-tekton-teal to-tekton-blue',
    accentColor: 'text-tekton-teal',
    borderColor: 'border-tekton-teal/30',
  },
  {
    id: 'M3',
    weeks: 'Weeks 9–12',
    label: 'ADVANCED',
    description: 'Polish your capstone, present to peers, and demonstrate professional-level competency.',
    headerBg: 'bg-gradient-to-r from-tekton-yellow to-tekton-green',
    accentColor: 'text-tekton-yellow',
    borderColor: 'border-tekton-yellow/30',
  },
]

// ─── Program Features ─────────────────────────────────────────────────────────

interface Feature {
  Icon: LucideIcon
  title: string
  description: string
  accent: string
  iconBg: string
}

const FEATURES: Feature[] = [
  { Icon: Users, title: '1-on-1 Mentorship', description: 'Weekly sessions with a dedicated industry mentor aligned to your track.', accent: 'text-tekton-teal', iconBg: 'bg-tekton-teal/15' },
  { Icon: BookOpen, title: 'Structured Curriculum', description: 'A curated weekly roadmap with tasks, resources, and clear objectives.', accent: 'text-tekton-purple-bright', iconBg: 'bg-tekton-purple-bright/15' },
  { Icon: FileText, title: 'Real Projects', description: 'Build a portfolio of tangible work you can show employers.', accent: 'text-tekton-yellow', iconBg: 'bg-tekton-yellow/15' },
  { Icon: MessageSquare, title: 'Community Access', description: 'Join a cohort of peers and collaborate in our dedicated community channels.', accent: 'text-tekton-blue', iconBg: 'bg-tekton-blue/15' },
  { Icon: Video, title: 'Live Group Sessions', description: 'Monthly group calls with industry panels, Q&As, and skill workshops.', accent: 'text-tekton-green', iconBg: 'bg-tekton-green/15' },
  { Icon: Award, title: 'Verified Certificate', description: 'Earn a TektonX certificate upon completing all 3 milestones.', accent: 'text-tekton-yellow', iconBg: 'bg-tekton-yellow/15' },
]

// ─── How It Works steps ───────────────────────────────────────────────────────

const HOW_STEPS = [
  { step: '01', title: 'Apply Online', description: 'Fill in our short registration form and select your preferred track.' },
  { step: '02', title: 'Profile Review', description: 'Our team reviews your profile and matches you with the best mentor.' },
  { step: '03', title: 'Onboarding Call', description: 'Meet your mentor, align on goals, and kick off Week 1 together.' },
  { step: '04', title: 'Weekly Sessions', description: 'Meet your mentor weekly, complete tasks, and hit milestone checkpoints.' },
  { step: '05', title: 'Build Your Capstone', description: "Create a real project that showcases everything you've learned." },
  { step: '06', title: 'Graduate & Get Certified', description: 'Complete the program, receive your certificate, and join the alumni network.' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function Mentorship() {
  return (
    <div className="flex flex-col">
      {/* ════════════════════════════════════════════════════════
          Section 1 — Hero
      ════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[65vh] flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center overflow-hidden bg-black">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 right-0 size-[500px] rounded-full bg-tekton-purple-bright/15 blur-[120px]" />
          <div className="absolute bottom-0 -left-20 size-[300px] rounded-full bg-tekton-teal/10 blur-[100px]" />
          <div className="absolute inset-0 bg-grid opacity-30" />
        </div>

        <div className="relative z-10 max-w-4xl flex flex-col items-center gap-7">
          <span className="inline-flex items-center rounded-full border border-tekton-purple-bright/40 bg-tekton-purple-bright/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-tekton-purple-bright">
            Flagship Program
          </span>

          <h1 className="font-heading text-5xl text-white sm:text-6xl lg:text-7xl leading-[0.95]">
            MENTORSHIP{' '}
            <span className="gradient-text">PROGRAM</span>
          </h1>

          <p className="max-w-2xl text-white/55 text-base sm:text-lg leading-relaxed">
            Get paired with experienced tech professionals who will guide you through your chosen tech track over 3 months.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-tekton-purple-bright px-8 text-white hover:bg-tekton-purple-bright/90 glow-purple gap-2 font-semibold"
            >
              <Link to="/auth/register">
                Join as Mentee
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-tekton-green/60 text-tekton-green bg-tekton-green/5 px-8 hover:bg-tekton-green/10 hover:border-tekton-green"
            >
              <Link to="/auth/register?role=mentor">Apply as Mentor</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 bg-white/5 px-8 text-white hover:bg-white/10 hover:border-white/30"
            >
              <Link to="/mentors">Meet the Mentors</Link>
            </Button>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 2 — Program Features
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-tekton-teal/70">
              Everything Included
            </p>
            <h2 className="font-heading text-5xl text-white sm:text-6xl">
              PROGRAM <span className="gradient-text">FEATURES</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ Icon, title, description, accent, iconBg }) => (
              <div
                key={title}
                className="glass-card rounded-2xl p-6 smooth-hover hover:-translate-y-0.5 transition-all hover:border-white/20"
              >
                <div className={`mb-4 flex size-11 items-center justify-center rounded-xl ${iconBg}`}>
                  <Icon className={`size-5 ${accent}`} />
                </div>
                <h3 className={`mb-2 font-heading text-xl ${accent}`}>{title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 3 — Choose Your Track
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-black">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="font-heading text-5xl text-white sm:text-6xl">
              CHOOSE YOUR <span className="gradient-text">TRACK</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {TECH_TRACKS.map((track, i) => {
              const Icon = TRACK_ICONS[i] ?? Code
              const detail = TRACK_DETAILS[track]
              if (!detail) return null
              return (
                <div
                  key={track}
                  className={`glass-card rounded-2xl p-7 border-l-2 ${detail.borderColor} smooth-hover hover:-translate-y-0.5 transition-all`}
                >
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`flex size-12 items-center justify-center rounded-xl ${detail.iconBg} shrink-0`}>
                      <Icon className={`size-6 ${detail.iconColor}`} />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-heading text-xl leading-tight ${detail.accentColor}`}>{track}</h3>
                        <span
                          className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${LEVEL_COLORS[detail.level]}`}
                        >
                          {detail.level}
                        </span>
                      </div>
                      <p className="text-sm text-white/55 leading-relaxed">{detail.description}</p>
                    </div>
                  </div>

                  <ul className="flex flex-col gap-2.5 pl-1">
                    {detail.learnings.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-white/60">
                        <CheckCircle className={`size-4 shrink-0 mt-0.5 ${detail.iconColor}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 4 — 12 Weeks, 3 Milestones
      ════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-4 bg-grid bg-black">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-tekton-purple-bright/70">
              Program Structure
            </p>
            <h2 className="font-heading text-5xl text-white sm:text-6xl">
              12 WEEKS · <span className="gradient-text">3 MILESTONES</span>
            </h2>
            <p className="mt-5 text-white/50 max-w-xl mx-auto">
              The program is divided into three clear phases, each building on the last.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {MILESTONES.map(({ id, weeks, label, description, headerBg, accentColor, borderColor }) => (
              <div
                key={id}
                className={`glass-card rounded-2xl overflow-hidden border ${borderColor} smooth-hover hover:-translate-y-1 transition-all`}
              >
                <div className={`${headerBg} px-6 py-5 flex items-center justify-between`}>
                  <span className="font-heading text-3xl text-white">{id}</span>
                  <span className="text-xs font-semibold text-white/70">{weeks}</span>
                </div>
                <div className="p-6">
                  <h3 className={`font-heading text-2xl mb-3 ${accentColor}`}>{label}</h3>
                  <p className="text-sm text-white/55 leading-relaxed mb-5">{description}</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((w) => (
                      <div
                        key={w}
                        className={`rounded-md h-7 flex items-center justify-center text-xs font-semibold ${headerBg} text-white/70`}
                      >
                        W{w}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 5 — How It Works
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-black">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-tekton-purple-bright/70">
              Step by Step
            </p>
            <h2 className="font-heading text-5xl text-white sm:text-6xl">
              HOW IT <span className="gradient-text">WORKS</span>
            </h2>
            <p className="mt-5 text-white/50">Six steps from application to graduation.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HOW_STEPS.map(({ step, title, description }) => (
              <div
                key={step}
                className="glass-card rounded-2xl p-6 smooth-hover hover:-translate-y-0.5 transition-all hover:border-tekton-purple-bright/25"
              >
                <div className="mb-4 font-heading text-4xl text-gradient-purple opacity-60">{step}</div>
                <h3 className="mb-2 font-heading text-xl text-white">{title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{description}</p>
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
                READY TO BEGIN YOUR
                <br />
                <span className="gradient-text">JOURNEY?</span>
              </h2>
              <p className="max-w-lg text-white/60 leading-relaxed">
                Apply today and take the first step toward a tech career guided by the best in the industry.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-tekton-purple-bright px-8 text-white hover:bg-tekton-purple-bright/90 glow-purple font-semibold gap-2"
                >
                  <Link to="/auth/register">
                    Register as Mentee
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/25 bg-white/5 px-8 text-white hover:bg-white/10 hover:border-white/40"
                >
                  <Link to="/auth/register">Apply as Mentor</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
