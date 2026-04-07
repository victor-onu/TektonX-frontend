import { useState } from 'react'
import { toast } from 'sonner'
import { Users, Briefcase, Handshake, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import partnershipService from '@/services/partnershipService'
import type { PartnershipInquiryPayload } from '@/services/partnershipService'

// ─── Partnership type data ────────────────────────────────────────────────────

const PARTNERSHIP_TYPES = [
  {
    Icon: Users,
    title: 'Program Sponsor',
    description:
      'Support our mentorship program financially or in-kind. Your brand reaches motivated tech learners and their networks across Africa.',
    accent: 'text-tekton-purple-bright',
    iconBg: 'bg-tekton-purple-bright/15',
    borderColor: 'border-l-tekton-purple-bright',
  },
  {
    Icon: Briefcase,
    title: 'Hiring Partner',
    description:
      'Get early access to TektonX graduates across 7 tech tracks. Hire talent that has been trained, mentored, and verified.',
    accent: 'text-tekton-blue',
    iconBg: 'bg-tekton-blue/15',
    borderColor: 'border-l-tekton-blue',
  },
  {
    Icon: Handshake,
    title: 'Both',
    description:
      'Join as a full partner — sponsor the program and build your hiring pipeline at the same time.',
    accent: 'text-tekton-teal',
    iconBg: 'bg-tekton-teal/15',
    borderColor: 'border-l-tekton-teal',
  },
]

const PARTNERSHIP_LABEL_TO_TYPE: Record<string, PartnershipInquiryPayload['partnershipType']> = {
  'Program Sponsor': 'sponsor',
  'Hiring Partner': 'hiring',
  'Both': 'both',
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Partnerships() {
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [partnershipLabel, setPartnershipLabel] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!partnershipLabel) {
      toast.error('Please select a partnership type.')
      return
    }

    const partnershipType = PARTNERSHIP_LABEL_TO_TYPE[partnershipLabel]

    setLoading(true)
    try {
      const payload: PartnershipInquiryPayload = {
        companyName,
        contactName,
        email,
        partnershipType,
      }
      if (phone.trim()) payload.phone = phone.trim()
      if (message.trim()) payload.message = message.trim()

      await partnershipService.submit(payload)
      setSubmitted(true)
    } catch {
      toast.error('Failed to send inquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
            Partner With Us
          </span>

          <h1 className="font-heading text-5xl text-white sm:text-6xl lg:text-7xl leading-tight">
            INVEST IN AFRICA'S
            <br />
            <span className="gradient-text">TECH FUTURE</span>
          </h1>

          <p className="text-base text-white/55 sm:text-lg leading-relaxed max-w-2xl">
            Partner with TektonX to support the next generation of African tech talent. Whether
            you're looking to sponsor the program or hire our graduates, we'd love to hear from you.
          </p>

          {/* Stat cards */}
          <div className="mt-2 flex items-center justify-center divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-4 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-1 px-8 sm:px-12">
              <span className="font-heading text-3xl leading-none gradient-text sm:text-4xl">100+</span>
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Mentees Trained</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-8 sm:px-12">
              <span className="font-heading text-3xl leading-none gradient-text sm:text-4xl">7</span>
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Tech Tracks</span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 2 — What Partnership Means
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-tekton-teal/70">
              How You Can Partner
            </p>
            <h2 className="font-heading text-5xl text-white sm:text-6xl">
              WHAT{' '}
              <span className="gradient-text">PARTNERSHIP MEANS</span>
            </h2>
            <p className="mt-5 text-white/50 max-w-xl mx-auto">
              Choose the partnership model that fits your goals — or go all in as a full partner.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNERSHIP_TYPES.map(({ Icon, title, description, accent, iconBg, borderColor }) => (
              <div
                key={title}
                className={`glass-card rounded-xl p-7 border-l-2 ${borderColor} flex flex-col gap-4 smooth-hover hover:-translate-y-0.5 transition-all`}
              >
                <div className={`flex size-12 items-center justify-center rounded-xl shrink-0 ${iconBg}`}>
                  <Icon className={`size-6 ${accent}`} />
                </div>
                <h3 className={`font-heading text-2xl ${accent}`}>{title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 3 — Inquiry Form
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-black">
        <div className="mx-auto max-w-2xl">
          <div className="glass-card rounded-2xl p-8 sm:p-10">
            {submitted ? (
              /* Success state */
              <div className="flex flex-col items-center gap-6 text-center py-8">
                <div className="flex size-16 items-center justify-center rounded-full bg-tekton-green/15">
                  <CheckCircle className="size-8 text-tekton-green" />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="font-heading text-3xl text-white">INQUIRY SENT</h2>
                  <p className="text-white/60 leading-relaxed">
                    Thank you! We'll be in touch within 3&ndash;5 business days.
                  </p>
                </div>
              </div>
            ) : (
              /* Form */
              <>
                <div className="mb-8">
                  <h2 className="font-heading text-3xl text-white">GET IN TOUCH</h2>
                  <p className="mt-1 text-sm text-white/50">
                    Fill out the form below and our partnerships team will reach out to you.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-white/60">
                        Company Name <span className="text-tekton-purple-bright">*</span>
                      </Label>
                      <Input
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        required
                        placeholder="Acme Corp"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-white/60">
                        Contact Person Name <span className="text-tekton-purple-bright">*</span>
                      </Label>
                      <Input
                        value={contactName}
                        onChange={e => setContactName(e.target.value)}
                        required
                        placeholder="Jane Doe"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-white/60">
                        Work Email <span className="text-tekton-purple-bright">*</span>
                      </Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="jane@company.com"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm text-white/60">Phone Number</Label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+234..."
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm text-white/60">
                      Partnership Interest <span className="text-tekton-purple-bright">*</span>
                    </Label>
                    <Select value={partnershipLabel} onValueChange={setPartnershipLabel}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select partnership type" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10">
                        <SelectItem value="Program Sponsor" className="text-white hover:bg-white/10">
                          Program Sponsor
                        </SelectItem>
                        <SelectItem value="Hiring Partner" className="text-white hover:bg-white/10">
                          Hiring Partner
                        </SelectItem>
                        <SelectItem value="Both" className="text-white hover:bg-white/10">
                          Both
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm text-white/60">Message</Label>
                    <Textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Tell us more about your company and how you'd like to partner..."
                      rows={4}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90 glow-purple font-semibold mt-1"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending&hellip;
                      </span>
                    ) : 'Send Inquiry'}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
