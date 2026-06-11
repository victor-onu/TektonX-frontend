import { Mail, Phone, MessageCircle, Linkedin, Calendar, Briefcase, GraduationCap, Shield, ExternalLink } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { formatDate, getInitials } from '@/lib/utils'
import type { User } from '@/types'

interface Props {
  user: User | null
  onClose: () => void
}

function whatsappLink(phone: string | undefined | null): string | null {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 8) return null
  return `https://wa.me/${digits}`
}

const ROLE_ICON: Record<string, typeof Briefcase> = {
  admin: Shield,
  mentor: Briefcase,
  mentee: GraduationCap,
}

const ROLE_COLOR: Record<string, string> = {
  admin: 'text-tekton-purple-bright',
  mentor: 'text-tekton-green',
  mentee: 'text-tekton-blue',
}

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-tekton-green/15 text-tekton-green border-tekton-green/30',
  inactive: 'bg-white/10 text-white/60 border-white/20',
  suspended: 'bg-red-500/15 text-red-400 border-red-500/30',
  alumni: 'bg-tekton-teal/15 text-tekton-teal border-tekton-teal/30',
}

const APP_STATUS_BADGE: Record<string, string> = {
  applied: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  screened: 'bg-tekton-blue/15 text-tekton-blue border-tekton-blue/30',
  approved: 'bg-tekton-green/15 text-tekton-green border-tekton-green/30',
  enrolled: 'bg-tekton-purple-bright/15 text-tekton-purple-bright border-tekton-purple-bright/30',
  graduated: 'bg-tekton-teal/15 text-tekton-teal border-tekton-teal/30',
  pending_approval: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
}

export default function UserProfileDrawer({ user, onClose }: Props) {
  if (!user) return null

  const RoleIcon = ROLE_ICON[user.role] ?? Briefcase
  const wa = whatsappLink(user.whatsapp)
  const isPendingActivation = !!user.inviteToken
  const isInvited = !!user.invitedAt

  return (
    <Sheet open={!!user} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="bg-zinc-950 border-l border-white/10 text-white w-full sm:max-w-md overflow-y-auto p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>{user.name}</SheetTitle>
          <SheetDescription>User profile details</SheetDescription>
        </SheetHeader>

        {/* HEADER */}
        <div className="bg-gradient-to-br from-tekton-purple-bright/20 to-tekton-teal/10 border-b border-white/10 px-6 pt-12 pb-6">
          <div className="flex items-start gap-4">
            {user.profilePhotoUrl ? (
              <img
                src={user.profilePhotoUrl}
                alt={user.name}
                className="size-16 rounded-full object-cover border-2 border-white/20"
              />
            ) : (
              <div className="size-16 rounded-full bg-gradient-to-br from-tekton-purple-bright to-tekton-teal flex items-center justify-center text-white text-base font-bold shrink-0">
                {getInitials(user.name)}
              </div>
            )}
            <div className="flex flex-col min-w-0 gap-1">
              <h2 className="text-xl font-heading text-white truncate">{user.name}</h2>
              {user.title && <p className="text-xs text-white/60 truncate">{user.title}</p>}
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 text-xs font-medium capitalize ${ROLE_COLOR[user.role] ?? 'text-white/70'}`}>
                  <RoleIcon className="size-3.5" />
                  {user.role}
                </span>
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${STATUS_BADGE[user.status] ?? STATUS_BADGE.inactive}`}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>

          {/* Sub-status pills */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {user.applicationStatus && (
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${APP_STATUS_BADGE[user.applicationStatus] ?? 'bg-white/10 text-white/60 border-white/20'}`}>
                {user.applicationStatus.replace('_', ' ')}
              </span>
            )}
            {isPendingActivation && (
              <span className="inline-flex items-center rounded-full bg-orange-500/15 border border-orange-500/30 px-2 py-0.5 text-[10px] font-medium text-orange-400">
                Pending Activation
              </span>
            )}
            {isInvited && user.role === 'mentee' && (
              <span className="inline-flex items-center rounded-full bg-tekton-blue/15 border border-tekton-blue/30 px-2 py-0.5 text-[10px] font-medium text-tekton-blue">
                Invited
              </span>
            )}
          </div>
        </div>

        {/* BODY */}
        <div className="px-6 py-5 flex flex-col gap-5">

          {/* Track */}
          {user.track && (
            <Section label="Track">
              <span className="inline-flex items-center rounded-full bg-tekton-purple-bright/10 border border-tekton-purple-bright/20 px-2.5 py-1 text-xs text-tekton-purple-bright">
                {user.track}
              </span>
            </Section>
          )}

          {/* Contact */}
          <Section label="Contact">
            <div className="flex flex-col gap-2.5">
              <ContactRow
                icon={<Mail className="size-3.5" />}
                label="Email"
                value={user.email}
                copyable
              />
              {user.whatsapp ? (
                <div className="flex items-start gap-2 text-sm">
                  <Phone className="size-3.5 text-white/40 mt-1 shrink-0" />
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">Phone / WhatsApp</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={`tel:${user.whatsapp}`}
                        className="text-sm text-white hover:text-tekton-purple-bright transition-colors break-all"
                      >
                        {user.whatsapp}
                      </a>
                      {wa && (
                        <a
                          href={wa}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-tekton-green hover:text-tekton-green/80 rounded-full bg-tekton-green/10 border border-tekton-green/30 px-2 py-0.5"
                        >
                          <MessageCircle className="size-3" />
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <ContactRow icon={<Phone className="size-3.5" />} label="Phone / WhatsApp" value={null} />
              )}
              {user.linkedinUrl && (
                <div className="flex items-start gap-2 text-sm">
                  <Linkedin className="size-3.5 text-white/40 mt-1 shrink-0" />
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">LinkedIn</span>
                    <a
                      href={user.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-white hover:text-tekton-purple-bright transition-colors break-all"
                    >
                      {user.linkedinUrl.replace(/^https?:\/\//, '')}
                      <ExternalLink className="size-3 shrink-0" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* Bio */}
          {user.bio && (
            <Section label="Bio">
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{user.bio}</p>
            </Section>
          )}

          {/* Experience */}
          {user.role === 'mentor' && typeof user.experienceYears === 'number' && (
            <Section label="Experience">
              <p className="text-sm text-white/70">{user.experienceYears} year{user.experienceYears === 1 ? '' : 's'}</p>
            </Section>
          )}

          {/* Milestones (mentees) */}
          {user.role === 'mentee' && (
            <Section label="Milestones">
              <div className="grid grid-cols-3 gap-2">
                <Milestone label="M1" value={user.milestone1Completed} />
                <Milestone label="M2" value={user.milestone2Completed} />
                <Milestone label="M3" value={user.milestone3Completed} />
              </div>
            </Section>
          )}

          {/* Dates */}
          <Section label="Joined">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Calendar className="size-3.5 text-white/40" />
              {formatDate(user.createdAt)}
            </div>
          </Section>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium">{label}</p>
      {children}
    </div>
  )
}

function ContactRow({ icon, label, value, copyable }: { icon: React.ReactNode; label: string; value: string | null; copyable?: boolean }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-white/40 mt-1 shrink-0">{icon}</span>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <span className="text-[10px] text-white/40 uppercase tracking-wider">{label}</span>
        {value ? (
          copyable ? (
            <a href={`mailto:${value}`} className="text-sm text-white hover:text-tekton-purple-bright transition-colors break-all">
              {value}
            </a>
          ) : (
            <span className="text-sm text-white break-all">{value}</span>
          )
        ) : (
          <span className="text-sm text-white/30 italic">Not provided</span>
        )}
      </div>
    </div>
  )
}

function Milestone({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center">
      <p className="text-[10px] text-white/40 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-white font-semibold mt-0.5">{value}</p>
    </div>
  )
}
