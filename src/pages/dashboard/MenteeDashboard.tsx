import { useQuery } from '@tanstack/react-query'
import { differenceInDays, format } from 'date-fns'
import {
  Award,
  CheckCircle2,
  Circle,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Mail,
  Map,
  MessageSquare,
  Share2,
  User as UserIcon,
  UserX,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { Progress } from '@/components/ui/progress'
import { calculateProgress, getInitials } from '@/lib/utils'
import mentorService from '@/services/mentorService'
import taskService from '@/services/taskService'
import userService from '@/services/userService'
import certificateService from '@/services/certificateService'
import resourceService from '@/services/resourceService'
import cohortService from '@/services/cohortService'
import type { User, ApplicationStatus } from '@/types'

// ─── Status step data ────────────────────────────────────────────────────────

const APPLICATION_STEPS: { key: ApplicationStatus | 'assigned'; label: string }[] = [
  { key: 'applied', label: 'Applied' },
  { key: 'screened', label: 'Screened' },
  { key: 'approved', label: 'Approved' },
  { key: 'assigned', label: 'Assigned' },
]

function isStepComplete(stepKey: string, applicationStatus: ApplicationStatus): boolean {
  const order = ['applied', 'screened', 'approved', 'enrolled']
  const statusIndex = order.indexOf(applicationStatus)
  const stepIndex = order.indexOf(stepKey === 'assigned' ? 'enrolled' : stepKey)
  return stepIndex !== -1 && statusIndex >= stepIndex
}

function isStepCurrent(stepKey: string, applicationStatus: ApplicationStatus): boolean {
  const map: Record<ApplicationStatus, string> = {
    applied: 'applied',
    screened: 'screened',
    approved: 'approved',
    enrolled: 'assigned',
    pending_approval: 'applied',
    rejected: 'applied',
  }
  return map[applicationStatus] === stepKey
}

const STATUS_MESSAGES: Partial<Record<ApplicationStatus, string>> = {
  applied: "Your application is under review. We'll be in touch with next steps including a screening quiz.",
  screened: "You've passed the screening stage. Your application is now being reviewed for approval.",
  approved: "Congratulations! You've been approved. You'll be assigned to a cohort and mentor when the next cohort opens.",
}

// ─── MenteeStatusPage ─────────────────────────────────────────────────────────

function MenteeStatusPage({ user }: { user: User }) {
  const appStatus = user.applicationStatus ?? 'applied'

  const { data: cohorts = [] } = useQuery({
    queryKey: ['cohorts'],
    queryFn: cohortService.getAll,
  })

  const now = new Date()
  const nextCohort = cohorts
    .filter((c) => new Date(c.startDate) > now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0]

  const firstName = user.name.split(' ')[0]

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4">
      <div className="mx-auto max-w-2xl flex flex-col gap-10">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-4xl text-white sm:text-5xl">
            WELCOME,{' '}
            <span className="gradient-text">{firstName.toUpperCase()}!</span>
          </h1>
          <p className="text-sm text-white/50">Your journey is underway. Here's where you stand.</p>
        </div>

        {/* Progress stepper */}
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-6">
          <h2 className="font-heading text-xl text-white">APPLICATION STATUS</h2>

          <div className="flex items-start gap-0">
            {APPLICATION_STEPS.map((step, idx) => {
              const complete = isStepComplete(step.key, appStatus as ApplicationStatus)
              const current = isStepCurrent(step.key, appStatus as ApplicationStatus)
              const isLast = idx === APPLICATION_STEPS.length - 1

              return (
                <div key={step.key} className="flex-1 flex flex-col items-center gap-2">
                  {/* Icon + connector row */}
                  <div className="flex items-center w-full">
                    {/* Left connector */}
                    {idx > 0 && (
                      <div
                        className={`flex-1 h-0.5 ${complete ? 'bg-tekton-green' : 'bg-white/10'}`}
                      />
                    )}

                    {/* Circle/icon */}
                    <div
                      className={`size-9 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors ${
                        complete
                          ? 'bg-tekton-green/20 border-tekton-green'
                          : current
                            ? 'bg-tekton-purple-bright/20 border-tekton-purple-bright'
                            : 'bg-white/5 border-white/20'
                      }`}
                    >
                      {complete ? (
                        <CheckCircle2 className="size-4 text-tekton-green" />
                      ) : current ? (
                        <Clock className="size-4 text-tekton-purple-bright" />
                      ) : (
                        <Circle className="size-4 text-white/20" />
                      )}
                    </div>

                    {/* Right connector */}
                    {!isLast && (
                      <div
                        className={`flex-1 h-0.5 ${
                          isStepComplete(APPLICATION_STEPS[idx + 1].key, appStatus as ApplicationStatus)
                            ? 'bg-tekton-green'
                            : 'bg-white/10'
                        }`}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-xs text-center leading-tight ${
                      complete
                        ? 'text-tekton-green'
                        : current
                          ? 'text-tekton-purple-bright font-medium'
                          : 'text-white/30'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Status message */}
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="font-heading text-xl text-white">WHAT'S NEXT</h2>

          {STATUS_MESSAGES[appStatus as ApplicationStatus] && (
            <p className="text-sm text-white/70 leading-relaxed">
              {STATUS_MESSAGES[appStatus as ApplicationStatus]}
            </p>
          )}

          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            {nextCohort ? (
              <p className="text-sm text-white/60">
                Next cohort starts{' '}
                <span className="text-tekton-purple-bright font-medium">
                  {format(new Date(nextCohort.startDate), 'MMMM d, yyyy')}
                </span>
                .
              </p>
            ) : (
              <p className="text-sm text-white/60">
                You'll be notified when your cohort assignment is confirmed.
              </p>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <Link
            to="/profile"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-tekton-purple-bright px-6 py-3 text-sm font-medium text-white smooth-hover hover:bg-tekton-purple-bright/80 transition-colors w-fit"
          >
            <UserIcon className="size-4" />
            Complete Your Profile
          </Link>
        </div>

      </div>
    </div>
  )
}

// ─── MenteeDashboard ──────────────────────────────────────────────────────────

export default function MenteeDashboard() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['me'],
    queryFn: userService.getMe,
  })
  const { data: myTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['my-tasks'],
    queryFn: taskService.getMyTasks,
  })
  const { data: assignment, isLoading: assignmentLoading } = useQuery({
    queryKey: ['my-assignment'],
    queryFn: mentorService.getMyAssignment,
  })

  const allComplete =
    (user?.milestone1Completed ?? 0) >= 16 &&
    (user?.milestone2Completed ?? 0) >= 16 &&
    (user?.milestone3Completed ?? 0) >= 16

  const { data: certificate } = useQuery({
    queryKey: ['my-certificate'],
    queryFn: certificateService.getMyCertificate,
    enabled: allComplete,
  })

  const { data: trackResources = [] } = useQuery({
    queryKey: ['track-resources', user?.track],
    queryFn: () => resourceService.getByTrack(user!.track),
    enabled: !!user?.track,
  })

  const firstName = user?.name.split(' ')[0]
  const completedTasks = myTasks.filter((t) => t.completed).length

  const m1Progress = calculateProgress(user?.milestone1Completed ?? 0, 16)
  const m2Progress = calculateProgress(user?.milestone2Completed ?? 0, 16)
  const m3Progress = calculateProgress(user?.milestone3Completed ?? 0, 16)
  const overallProgress = calculateProgress(
    (user?.milestone1Completed ?? 0) +
      (user?.milestone2Completed ?? 0) +
      (user?.milestone3Completed ?? 0),
    48,
  )

  const daysInProgram = differenceInDays(new Date(), new Date(user?.createdAt ?? new Date()))

  const currentMilestone =
    (user?.milestone1Completed ?? 0) < 16
      ? 1
      : (user?.milestone2Completed ?? 0) < 16
        ? 2
        : 3

  const milestoneCards = [
    {
      id: 1 as const,
      label: 'Foundations',
      weeks: 'Weeks 1–4',
      completed: user?.milestone1Completed ?? 0,
      total: 16,
      progress: m1Progress,
      href: '/roadmap/1',
    },
    {
      id: 2 as const,
      label: 'Building',
      weeks: 'Weeks 5–8',
      completed: user?.milestone2Completed ?? 0,
      total: 16,
      progress: m2Progress,
      href: '/roadmap/2',
    },
    {
      id: 3 as const,
      label: 'Advanced',
      weeks: 'Weeks 9–12',
      completed: user?.milestone3Completed ?? 0,
      total: 16,
      progress: m3Progress,
      href: '/roadmap/3',
    },
  ]

  const checklist = [
    { label: 'Complete Registration', done: true },
    { label: 'Get Assigned a Mentor', done: !!assignment },
    { label: 'Start Milestone 1', done: (user?.milestone1Completed ?? 0) > 0 },
    { label: 'Complete Milestone 1', done: (user?.milestone1Completed ?? 0) >= 16 },
    { label: 'Complete Milestone 2', done: (user?.milestone2Completed ?? 0) >= 16 },
    { label: 'Complete All Milestones', done: (user?.milestone3Completed ?? 0) >= 16 },
  ]

  if (user && user.role === 'mentee' && user.applicationStatus !== 'enrolled') {
    return <MenteeStatusPage user={user} />
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4">
      <div className="mx-auto max-w-5xl flex flex-col gap-10">

        {/* Certificate celebration card */}
        {allComplete && certificate && (
          <div className="relative overflow-hidden rounded-2xl border border-tekton-yellow/30 bg-gradient-to-br from-tekton-yellow/10 to-tekton-purple-bright/10 p-6 flex flex-col gap-4">
            <div className="absolute -top-8 -right-8 size-32 rounded-full bg-tekton-yellow/10 blur-2xl pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-tekton-yellow/15 border border-tekton-yellow/30 shrink-0">
                <Award className="size-7 text-tekton-yellow" />
              </div>
              <div>
                <p className="font-heading text-2xl text-white">CONGRATULATIONS! 🎉</p>
                <p className="text-sm text-white/60 mt-0.5">
                  You've completed all milestones in <span className="text-tekton-yellow font-medium">{user?.track}</span>!
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Verification code */}
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
                <span className="text-xs text-white/40">Code:</span>
                <span className="font-mono text-xs text-tekton-teal">{certificate.verificationCode}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(certificate.verificationCode)
                    toast.success('Verification code copied!')
                  }}
                  className="text-white/30 hover:text-white transition-colors"
                >
                  <Copy className="size-3" />
                </button>
              </div>

              {/* Download */}
              <a
                href={certificate.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-tekton-yellow/30 bg-tekton-yellow/10 px-4 py-2 text-sm font-medium text-tekton-yellow hover:bg-tekton-yellow/20 transition-colors"
              >
                <Download className="size-4" /> Download Certificate
              </a>

              {/* Share */}
              <button
                onClick={() => {
                  const url = `${window.location.origin}/verify/${certificate.verificationCode}`
                  navigator.clipboard.writeText(url)
                  toast.success('Verification link copied to clipboard!')
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Share2 className="size-4" /> Share
              </button>
            </div>
          </div>
        )}

        {/* Section 1 — Welcome Header */}
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-4xl text-white sm:text-5xl">
            WELCOME BACK,{' '}
            <span className="gradient-text">
              {firstName?.toUpperCase() ?? 'MENTEE'}!
            </span>
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-tekton-purple-bright/15 border border-tekton-purple-bright/30 px-3 py-1 text-xs font-medium text-tekton-purple-bright">
              {user?.track ?? 'Loading...'}
            </span>
            <span className="text-sm text-white/50">12-Week Program</span>
          </div>
        </div>

        {/* Section 2 — Stats Row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Overall Progress */}
          <div className="glass-card rounded-xl p-5 flex flex-col gap-1">
            <p className="text-xs text-white/50 uppercase tracking-wider">Overall Progress</p>
            {userLoading ? (
              <div className="h-8 w-16 rounded bg-white/10 animate-pulse" />
            ) : (
              <>
                <p className="gradient-text font-heading text-3xl">{overallProgress}%</p>
                <Progress value={overallProgress} className="h-1.5 mt-2" />
              </>
            )}
          </div>

          {/* Tasks Completed */}
          <div className="glass-card rounded-xl p-5 flex flex-col gap-1">
            <p className="text-xs text-white/50 uppercase tracking-wider">Tasks Completed</p>
            {tasksLoading ? (
              <div className="h-8 w-16 rounded bg-white/10 animate-pulse" />
            ) : (
              <p className="gradient-text font-heading text-3xl">{completedTasks}</p>
            )}
            <p className="text-xs text-white/40">Tasks Completed</p>
          </div>

          {/* Current Milestone */}
          <div className="glass-card rounded-xl p-5 flex flex-col gap-1">
            <p className="text-xs text-white/50 uppercase tracking-wider">Milestone</p>
            {userLoading ? (
              <div className="h-8 w-16 rounded bg-white/10 animate-pulse" />
            ) : (
              <p className="gradient-text font-heading text-3xl">Milestone {currentMilestone}</p>
            )}
            <p className="text-xs text-white/40">Current Milestone</p>
          </div>

          {/* Days in Program */}
          <div className="glass-card rounded-xl p-5 flex flex-col gap-1">
            <p className="text-xs text-white/50 uppercase tracking-wider">Days Active</p>
            {userLoading ? (
              <div className="h-8 w-16 rounded bg-white/10 animate-pulse" />
            ) : (
              <p className="gradient-text font-heading text-3xl">{daysInProgram}</p>
            )}
            <p className="text-xs text-white/40">Days in Program</p>
          </div>
        </div>

        {/* Section 3 — Assigned Mentor Card */}
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-2xl text-white">YOUR MENTOR</h2>
          {assignmentLoading ? (
            <div className="glass-card rounded-xl p-5 animate-pulse flex items-center gap-4">
              <div className="size-14 rounded-full bg-white/10 shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 w-32 rounded bg-white/10" />
                <div className="h-3 w-48 rounded bg-white/10" />
              </div>
            </div>
          ) : assignment?.mentor ? (
            <div className="glass-card rounded-xl p-5 flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Avatar */}
              <div className="shrink-0">
                {assignment.mentor.profilePhotoUrl ? (
                  <img
                    src={assignment.mentor.profilePhotoUrl}
                    alt={assignment.mentor.name}
                    className="size-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-14 rounded-full bg-gradient-to-br from-tekton-purple-bright to-tekton-purple-deep flex items-center justify-center text-white font-semibold text-lg">
                    {getInitials(assignment.mentor.name)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <p className="font-semibold text-white">{assignment.mentor.name}</p>
                {assignment.mentor.title && (
                  <p className="text-sm text-white/50">{assignment.mentor.title}</p>
                )}
                <span className="inline-flex w-fit items-center rounded-full bg-tekton-purple-bright/15 border border-tekton-purple-bright/30 px-2.5 py-0.5 text-xs font-medium text-tekton-purple-bright">
                  {assignment.mentor.track}
                </span>
                {assignment.mentor.bio && (
                  <p className="text-xs text-white/40 leading-relaxed line-clamp-2">
                    {assignment.mentor.bio}
                  </p>
                )}
              </div>

              {/* Action */}
              <div className="shrink-0">
                <Link
                  to={`/messages/${assignment.mentor.id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-tekton-purple-bright px-4 py-2 text-sm font-medium text-white smooth-hover hover:bg-tekton-purple-bright/80 transition-colors"
                >
                  <Mail className="size-4" />
                  Message Mentor
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-xl p-6 flex flex-col items-center gap-3 text-center">
              <UserX className="size-8 text-white/20" />
              <p className="text-sm text-white/50 max-w-sm">
                You haven&apos;t been assigned a mentor yet. Hang tight — our team is working on
                your match!
              </p>
            </div>
          )}
        </div>

        {/* Section 4 — Learning Roadmap Overview */}
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-2xl text-white">YOUR LEARNING ROADMAP</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {milestoneCards.map((card) => {
              const isLocked = card.completed === 0 && card.id > 1
              const barColor =
                card.progress === 100
                  ? 'bg-tekton-green'
                  : card.progress > 0
                    ? 'bg-tekton-purple-bright'
                    : 'bg-white/10'

              return (
                <div key={card.id} className="glass-card rounded-xl p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-md bg-tekton-purple-bright/15 border border-tekton-purple-bright/30 px-2 py-0.5 text-xs font-bold text-tekton-purple-bright">
                      M{card.id}
                    </span>
                    {isLocked && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4 text-white/20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-white">{card.label}</p>
                    <p className="text-xs text-white/40">{card.weeks}</p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${barColor}`}
                        style={{ width: `${card.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/40">
                      {card.completed}/{card.total} tasks
                    </p>
                  </div>

                  <Link
                    to={card.href}
                    className="inline-flex items-center justify-center rounded-md border border-white/20 px-3 py-1.5 text-xs font-medium text-white/70 smooth-hover hover:border-white/40 hover:text-white transition-colors"
                  >
                    View Tasks
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        {/* Section 5 — Track Resources */}
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-2xl text-white">TRACK RESOURCES</h2>
          {trackResources.length === 0 ? (
            <div className="glass-card rounded-xl p-6 flex flex-col items-center gap-2 text-center">
              <p className="text-sm text-white/50">No track resources yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {trackResources.map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card rounded-xl p-4 flex items-center gap-3 smooth-hover hover:border-white/20 transition-all group"
                >
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <p className="text-sm font-medium text-white group-hover:text-tekton-blue transition-colors truncate">{r.title}</p>
                    <p className="text-xs text-white/30 truncate">{r.url}</p>
                  </div>
                  <ExternalLink className="size-4 text-white/30 group-hover:text-tekton-blue shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Section 6 — Quick Actions (was 5) */}
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-2xl text-white">QUICK ACTIONS</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium text-white smooth-hover hover:bg-white/15 transition-colors"
            >
              <Map className="size-4" />
              View Roadmap
            </Link>
            <Link
              to="/communication"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium text-white smooth-hover hover:bg-white/15 transition-colors"
            >
              <MessageSquare className="size-4" />
              Communication Hub
            </Link>
            <Link
              to="/messages"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium text-white smooth-hover hover:bg-white/15 transition-colors"
            >
              <Mail className="size-4" />
              Messages
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium text-white smooth-hover hover:bg-white/15 transition-colors"
            >
              <UserIcon className="size-4" />
              My Profile
            </Link>
          </div>
        </div>

        {/* Section 6 — Next Steps Checklist */}
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-2xl text-white">NEXT STEPS</h2>
          <div className="glass-card rounded-xl p-5 flex flex-col gap-3">
            {checklist.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                {item.done ? (
                  <CheckCircle2 className="size-5 text-tekton-green shrink-0" />
                ) : (
                  <Circle className="size-5 text-white/30 shrink-0" />
                )}
                <span className={item.done ? 'text-sm text-white' : 'text-sm text-white/40'}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
