import { Link } from 'react-router-dom'
import { Twitter, Linkedin, Instagram, Facebook, Mail, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Mentorship', href: '/mentorship' },
] as const

const PROGRAMS = [
  'Campus to Tech Careers',
  'Code for Growth',
  'Competitions',
  'Hub',
  'Mentorship',
  'Tech Pathways',
] as const

const SOCIAL_LINKS = [
  { label: 'Twitter / X', href: 'https://x.com/TektonXLab', Icon: Twitter, hoverColor: 'hover:text-white' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/tektonx-labs', Icon: Linkedin, hoverColor: 'hover:text-[#0A66C2]' },
  { label: 'Instagram', href: 'https://www.instagram.com/tektonxlabs/', Icon: Instagram, hoverColor: 'hover:text-[#E1306C]' },
  { label: 'Facebook', href: 'https://www.facebook.com/tektonXlabs', Icon: Facebook, hoverColor: 'hover:text-[#1877F2]' },
] as const

export default function Footer() {
  return (
    <footer className="relative bg-black border-t-0">
      {/* Gradient top border line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-tekton-purple-bright/60 to-transparent" />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-tekton-teal/30 to-transparent mt-px" />

      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* ── Column 1: Brand ── */}
          <div className="flex flex-col gap-5">
            <Link to="/" className="flex items-baseline gap-1.5 w-fit group">
              <span className="font-heading text-2xl leading-none gradient-text tracking-wider group-hover:opacity-90 transition-opacity">
                TEKTONX
              </span>
              <span className="text-xs font-medium text-white/30 tracking-widest uppercase">LABS</span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-[220px]">
              Building People. Building Products. Building Africa.
            </p>
            <div className="flex items-center gap-2 mt-1">
              {SOCIAL_LINKS.map(({ label, href, Icon, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex size-8 items-center justify-center rounded-lg glass-card text-white/30 transition-all smooth-hover ${hoverColor} hover:border-white/20 hover:-translate-y-0.5`}
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Column 2: Quick Links ── */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-white/30">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="group flex items-center gap-1 text-sm text-white/40 transition-colors hover:text-white"
                  >
                    <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-tekton-teal after:transition-all group-hover:after:w-full">
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Programs ── */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-white/30">
              Programs
            </h4>
            <ul className="flex flex-col gap-3">
              {PROGRAMS.map((program) => (
                <li key={program}>
                  <Link
                    to="/programs"
                    className="group flex items-center gap-1 text-sm text-white/40 transition-colors hover:text-white"
                  >
                    <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-tekton-teal after:transition-all group-hover:after:w-full">
                      {program}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Contact ── */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-white/30">
              Contact
            </h4>
            <div className="flex flex-col gap-5">
              <a
                href="mailto:tektonxlabs@gmail.com"
                className="flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white group"
              >
                <Mail className="size-4 shrink-0 text-tekton-teal/60 group-hover:text-tekton-teal transition-colors" />
                tektonxlabs@gmail.com
              </a>
              <Button
                asChild
                size="sm"
                className="w-fit bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90 glow-purple gap-1.5"
              >
                <Link to="/auth/register">
                  Get Started
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/25">
            &copy; 2026 TektonX. All rights reserved.
          </p>
          <p className="text-xs text-white/20 tracking-wide">
            Built for Africa's Tech Future
          </p>
        </div>
      </div>
    </footer>
  )
}
