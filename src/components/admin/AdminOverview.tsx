import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import adminService from '@/services/adminService'
import type { PlatformStats } from '@/types'
import { formatDate, getInitials } from '@/lib/utils'

interface Props {
  stats: PlatformStats | undefined
  statsLoading: boolean
  onTabChange: (tab: string) => void
}

const roleBadgeClass: Record<string, string> = {
  mentee: 'bg-tekton-blue/15 text-tekton-blue border border-tekton-blue/30',
  mentor: 'bg-tekton-green/15 text-tekton-green border border-tekton-green/30',
  admin: 'bg-tekton-purple-bright/15 text-tekton-purple-bright border border-tekton-purple-bright/30',
}

export default function AdminOverview({ stats, statsLoading, onTabChange }: Props) {
  const { data: recentSignups, isLoading: signupsLoading } = useQuery({
    queryKey: ['admin-recent-signups'],
    queryFn: () => adminService.getUsers({ limit: 5, page: 1 }),
  })

  return (
    <div className="flex flex-col gap-6">

      {/* Pending Actions */}
      <div>
        <h2 className="font-heading text-xl text-white mb-3">PENDING ACTIONS</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Mentor Applications */}
          <div className="glass-card rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-tekton-yellow shrink-0" />
                <p className="text-sm font-medium text-white">Mentor Applications to Review</p>
              </div>
              {statsLoading ? (
                <div className="h-6 w-8 rounded bg-white/10 animate-pulse" />
              ) : (
                <span className="inline-flex items-center rounded-full bg-tekton-yellow/15 border border-tekton-yellow/30 px-2 py-0.5 text-xs font-bold text-tekton-yellow">
                  {stats?.pendingMentors ?? 0}
                </span>
              )}
            </div>
            <p className="text-xs text-white/50">
              {stats?.pendingMentors
                ? `${stats.pendingMentors} mentor${stats.pendingMentors === 1 ? '' : 's'} waiting for approval.`
                : 'No pending applications.'}
            </p>
            <Button
              size="sm"
              disabled={!stats?.pendingMentors}
              className="self-start bg-tekton-yellow/10 hover:bg-tekton-yellow/20 text-tekton-yellow border border-tekton-yellow/30 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => onTabChange('pending-mentors')}
            >
              Review Now
            </Button>
          </div>

          {/* Unassigned Mentees */}
          <div className="glass-card rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <UserX className="size-4 text-tekton-blue shrink-0" />
                <p className="text-sm font-medium text-white">Mentees Without Mentors</p>
              </div>
              {statsLoading ? (
                <div className="h-6 w-8 rounded bg-white/10 animate-pulse" />
              ) : (
                <span className="inline-flex items-center rounded-full bg-tekton-blue/15 border border-tekton-blue/30 px-2 py-0.5 text-xs font-bold text-tekton-blue">
                  {stats?.unassignedMentees ?? 0}
                </span>
              )}
            </div>
            <p className="text-xs text-white/50">
              {stats?.unassignedMentees
                ? `${stats.unassignedMentees} mentee${stats.unassignedMentees === 1 ? '' : 's'} not yet assigned to a mentor.`
                : 'All mentees are assigned.'}
            </p>
            <Button
              size="sm"
              disabled={!stats?.unassignedMentees}
              className="self-start bg-tekton-blue/10 hover:bg-tekton-blue/20 text-tekton-blue border border-tekton-blue/30 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => onTabChange('assignments')}
            >
              Assign Now
            </Button>
          </div>

        </div>
      </div>

      {/* Recent Signups */}
      <div>
        <h2 className="font-heading text-xl text-white mb-3">RECENT SIGNUPS</h2>
        <div className="glass-card rounded-xl overflow-hidden">
          {signupsLoading ? (
            <div className="flex flex-col divide-y divide-white/5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className="size-9 rounded-full bg-white/10 animate-pulse shrink-0" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="h-3 w-32 rounded bg-white/10 animate-pulse" />
                    <div className="h-2.5 w-48 rounded bg-white/10 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentSignups?.data.length ? (
            <ul className="divide-y divide-white/5">
              {recentSignups.data.map((user) => (
                <li key={user.id} className="flex items-center gap-3 px-5 py-3">
                  {/* Avatar */}
                  <div className="size-9 rounded-full bg-gradient-to-br from-tekton-purple-bright to-tekton-teal flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {getInitials(user.name)}
                  </div>
                  {/* Name + email */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium text-white truncate">{user.name}</span>
                    <span className="text-xs text-white/40 truncate">{user.email}</span>
                  </div>
                  {/* Role badge */}
                  <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${roleBadgeClass[user.role] ?? ''}`}>
                    {user.role}
                  </span>
                  {/* Joined date */}
                  <span className="shrink-0 text-[11px] text-white/30 hidden sm:block">
                    {formatDate(user.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-10 text-center text-sm text-white/40">No recent signups.</div>
          )}
        </div>
      </div>

    </div>
  )
}
