import { useState } from 'react'
import { toast } from 'sonner'
import { Users, MessageCircle, Calendar, Briefcase, CheckCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IconBadge } from '@/components/marketing/ui'
import { eyebrowStyle } from '@/components/marketing/tokens'
import communityMemberService from '@/services/communityMemberService'
import type { CommunityMemberPayload } from '@/services/communityMemberService'
import { NIGERIAN_STATES } from '@/lib/nigerian-states'

// ─── What you get data ────────────────────────────────────────────────────────
// Gradient/shadow pairs are the same ones already established for card icon
// badges on Home/About (see PROGRAMS/VALUES in `Index.tsx`) — reused here
// rather than introducing new hues.

const COMMUNITY_PERKS = [
  {
    Icon: Users,
    title: 'Connect With People',
    description: 'Meet mentors, mentees, alumni, and other builders in the TektonX network.',
    gradient: 'linear-gradient(150deg,#A855F7,#6D28D9)',
    shadowColor: 'rgba(124,58,237,0.34)',
  },
  {
    Icon: Calendar,
    title: 'Events & Meetups',
    description: 'Get invited to workshops, webinars, and meetups happening across Nigeria and online.',
    gradient: 'linear-gradient(150deg,#2DD4BF,#0E7490)',
    shadowColor: 'rgba(14,116,144,0.30)',
  },
  {
    Icon: Briefcase,
    title: 'Opportunities',
    description: 'Hear about jobs, gigs, scholarships, and other opportunities as they come up.',
    gradient: 'linear-gradient(150deg,#34D399,#0F766E)',
    shadowColor: 'rgba(16,185,129,0.32)',
  },
  {
    Icon: MessageCircle,
    title: 'Community Updates',
    description: 'Stay updated on our programs and everything else happening at TektonX.',
    gradient: 'linear-gradient(150deg,#60A5FA,#1D4ED8)',
    shadowColor: 'rgba(29,78,216,0.30)',
  },
] as const

// Light-theme field styling shared by every input/select on this form —
// same shape as the shadcn defaults, just re-tinted for a white background.
const fieldClassName =
  'bg-white border-[rgba(20,17,24,0.12)] text-[#141118] placeholder:text-[#7A737F] focus-visible:border-[#7C3AED] focus-visible:ring-[#7C3AED]/30'

export default function JoinCommunity() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [state, setState] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!state) {
      toast.error('Please select your state.')
      return
    }

    setLoading(true)
    try {
      const payload: CommunityMemberPayload = { name, email, state }
      if (phone.trim()) payload.phone = phone.trim()

      await communityMemberService.submit(payload)
      setSubmitted(true)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message
      toast.error(Array.isArray(msg) ? msg[0] : (msg ?? 'Failed to join the community. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tx-marketing">
      {/* ════════════════════════════════════════════════════════
          Section 1 — Hero
      ════════════════════════════════════════════════════════ */}
      <section
        id="join-hero"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(70% 62% at 50% 32%, rgba(168,85,247,0.14) 0%, rgba(250,248,246,0) 72%), #FAF8F6',
        }}
      >
        <div
          className="tx-marketing-rise"
          style={{
            maxWidth: 900,
            margin: '0 auto',
            padding: '100px 28px 80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 26,
          }}
        >
          <span style={eyebrowStyle}>For Builders</span>

          <h1 style={{ fontSize: 'clamp(52px,7vw,96px)', lineHeight: 0.9, color: '#0E0B12' }}>
            JOIN THE
            <br />
            <span
              style={{
                background: 'linear-gradient(100deg,#7C3AED,#C026D3)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TEKTONX COMMUNITY
            </span>
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.7, color: '#5C5661', maxWidth: '54ch', margin: 0 }}>
            For builders using tech to shape the future. Join to stay in touch, meet other members, and hear about
            our programs, events, and opportunities first.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 2 — What You Get
      ════════════════════════════════════════════════════════ */}
      <section id="perks" style={{ padding: '110px 28px 0' }}>
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
            <span style={eyebrowStyle}>Why Join</span>
            <h2 style={{ fontSize: 'clamp(40px,5.4vw,76px)', lineHeight: 0.9, color: '#141118' }}>
              WHAT YOU{' '}
              <span
                style={{
                  background: 'linear-gradient(100deg,#7C3AED,#C026D3)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                GET
              </span>
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.65, color: '#5C5661', maxWidth: '56ch', margin: 0 }}>
              It&apos;s free, and you don&apos;t have to be an enrolled mentee or mentor to join.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))', gap: 22 }}>
            {COMMUNITY_PERKS.map(({ Icon, title, description, gradient, shadowColor }) => (
              <article
                key={title}
                className="tx-card-hover"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(20,17,24,0.06)',
                  borderRadius: 20,
                  padding: '30px 28px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  minWidth: 0,
                }}
              >
                <IconBadge Icon={Icon} gradient={gradient} shadowColor={shadowColor} size="sm" />
                <h3 style={{ fontSize: 24, lineHeight: 1, color: '#141118' }}>{title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: '#5C5661', margin: 0 }}>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          Section 3 — Join Form
      ════════════════════════════════════════════════════════ */}
      <section id="join-form" style={{ padding: '110px 28px 120px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(20,17,24,0.06)',
              borderRadius: 24,
              padding: 'clamp(32px,4.5vw,48px)',
              boxShadow: '0 24px 60px rgba(20,17,24,0.08)',
            }}
          >
            {submitted ? (
              /* Success state */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 22, padding: '24px 0' }}>
                <IconBadge
                  Icon={CheckCircle}
                  gradient="linear-gradient(150deg,#34D399,#0F766E)"
                  shadowColor="rgba(16,185,129,0.32)"
                  size="lg"
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <h2 style={{ fontSize: 32, lineHeight: 1, color: '#141118' }}>WELCOME TO THE COMMUNITY!</h2>
                  <p style={{ fontSize: 16, lineHeight: 1.65, color: '#5C5661', margin: 0, maxWidth: '42ch' }}>
                    Thank you for signing up. Keep an eye on your inbox for updates, events, and opportunities from
                    TektonX.
                  </p>
                </div>
              </div>
            ) : (
              /* Form */
              <>
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ fontSize: 32, lineHeight: 1, color: '#141118' }}>SIGN UP</h2>
                  <p style={{ marginTop: 6, fontSize: 14, color: '#7A737F' }}>
                    Fill out the form below to join the TektonX community.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label style={{ fontSize: 14, color: '#413B47' }}>
                        Full Name <span style={{ color: '#7C3AED' }}>*</span>
                      </Label>
                      <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        placeholder="Jane Doe"
                        className={fieldClassName}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label style={{ fontSize: 14, color: '#413B47' }}>
                        Email <span style={{ color: '#7C3AED' }}>*</span>
                      </Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="jane@example.com"
                        className={fieldClassName}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label style={{ fontSize: 14, color: '#413B47' }}>Phone Number</Label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+234..."
                        className={fieldClassName}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label style={{ fontSize: 14, color: '#413B47' }}>
                        State <span style={{ color: '#7C3AED' }}>*</span>
                      </Label>
                      <Select value={state} onValueChange={setState}>
                        <SelectTrigger className={fieldClassName}>
                          <SelectValue placeholder="Select your state" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[rgba(20,17,24,0.1)] max-h-64">
                          {NIGERIAN_STATES.map((s) => (
                            <SelectItem key={s} value={s} className="text-[#141118] focus:bg-[#7C3AED]/10">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="tx-cta-gradient"
                    style={{
                      marginTop: 4,
                      width: '100%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      background: 'linear-gradient(100deg,#7C3AED,#C026D3)',
                      color: '#FFFFFF',
                      fontSize: 16,
                      fontWeight: 600,
                      padding: '17px 30px',
                      borderRadius: 10,
                      border: 'none',
                      boxShadow: '0 6px 18px rgba(124,58,237,0.28)',
                      opacity: loading ? 0.75 : 1,
                      cursor: loading ? 'default' : 'pointer',
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Joining&hellip;
                      </span>
                    ) : 'Join the Community'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
