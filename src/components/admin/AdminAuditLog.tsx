import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import { formatDistanceToNow, subDays } from 'date-fns'

import adminService from '@/services/adminService'
import { formatDate, cn } from '@/lib/utils'
import type { AuditLogEntry } from '@/types'

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTION_OPTIONS = [
  { value: '', label: 'All Actions' },
  { value: 'role_change', label: 'Role Change' },
  { value: 'mentor_approved', label: 'Mentor Approved' },
  { value: 'mentor_rejected', label: 'Mentor Rejected' },
  { value: 'user_deleted', label: 'User Deleted' },
  { value: 'mentee_assigned', label: 'Mentee Assigned' },
  { value: 'mentee_unassigned', label: 'Mentee Unassigned' },
  { value: 'task_created', label: 'Task Created' },
  { value: 'task_updated', label: 'Task Updated' },
  { value: 'task_deleted', label: 'Task Deleted' },
  { value: 'announcement_created', label: 'Announcement Created' },
  { value: 'session_created', label: 'Session Created' },
]

const DATE_RANGE_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: 'all', label: 'All time' },
]

const LIMIT = 20

// ─── Helpers ─────────────────────────────────────────────────────────────────

function actionBadge(action: string) {
  const green = ['approved', 'created']
  const blue = ['role_change', 'assigned']
  const red = ['deleted', 'rejected', 'unassigned']

  const lower = action.toLowerCase()
  const isGreen = green.some((k) => lower.includes(k))
  const isBlue = blue.some((k) => lower.includes(k))
  const isRed = red.some((k) => lower.includes(k))

  const colorClass = isGreen
    ? 'bg-tekton-green/15 border-tekton-green/30 text-tekton-green'
    : isBlue
    ? 'bg-tekton-blue/15 border-tekton-blue/30 text-tekton-blue'
    : isRed
    ? 'bg-red-500/15 border-red-500/30 text-red-400'
    : 'bg-white/10 border-white/20 text-white/50'

  const label = action.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium', colorClass)}>
      {label}
    </span>
  )
}

function relativeTime(dateString: string) {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  } catch {
    return dateString
  }
}

// ─── Details Expander ─────────────────────────────────────────────────────────

function DetailsCell({ details }: { details: Record<string, unknown> }) {
  const [open, setOpen] = useState(false)
  const hasDetails = Object.keys(details).length > 0

  if (!hasDetails) return <span className="text-white/20 text-xs">—</span>

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
      >
        {open ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
        {open ? 'Hide' : 'Show'} details
      </button>
      {open && (
        <div className="rounded bg-white/5 border border-white/10 p-2 text-[11px] text-white/60 font-mono max-w-xs overflow-x-auto">
          {Object.entries(details).map(([k, v]) => (
            <div key={k} className="flex gap-1.5">
              <span className="text-white/40">{k}:</span>
              <span>{String(v)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Row ─────────────────────────────────────────────────────────────────────

function AuditRow({ entry }: { entry: AuditLogEntry }) {
  const adminName = entry.admin?.name ?? `Admin #${entry.adminId.slice(0, 8)}`
  const target = `${entry.targetType}: ${entry.targetId.slice(0, 12)}`

  return (
    <tr className="border-b border-white/5 hover:bg-white/2 transition-colors group">
      <td className="py-3 pr-4 align-top">
        <div className="relative group/ts">
          <span className="text-xs text-white/50 whitespace-nowrap cursor-default">
            {relativeTime(entry.createdAt)}
          </span>
          <div className="absolute bottom-full mb-1 left-0 hidden group-hover/ts:block z-20 pointer-events-none">
            <div className="bg-black border border-white/20 rounded px-2 py-1 text-[10px] text-white whitespace-nowrap">
              {formatDate(entry.createdAt)}
            </div>
          </div>
        </div>
      </td>
      <td className="py-3 pr-4 align-top">
        <span className="text-sm text-white">{adminName}</span>
      </td>
      <td className="py-3 pr-4 align-top">
        {actionBadge(entry.action)}
      </td>
      <td className="py-3 pr-4 align-top">
        <span className="text-xs text-white/50">{target}</span>
      </td>
      <td className="py-3 align-top">
        <DetailsCell details={entry.details} />
      </td>
    </tr>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-10 rounded bg-white/5" />
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminAuditLog() {
  const [actionFilter, setActionFilter] = useState('')
  const [dateRange, setDateRange] = useState<'7' | '30' | 'all'>('30')
  const [page, setPage] = useState(1)

  function buildParams() {
    const params: Record<string, string | number> = { page, limit: LIMIT }
    if (actionFilter) params.action = actionFilter
    if (dateRange !== 'all') {
      params.after = subDays(new Date(), Number(dateRange)).toISOString()
    }
    return params
  }

  const { data, isLoading } = useQuery({
    queryKey: ['audit-log', actionFilter, dateRange, page],
    queryFn: () => adminService.getAuditLog(buildParams() as Parameters<typeof adminService.getAuditLog>[0]),
  })

  const entries = data?.data ?? []
  const totalPages = data?.totalPages ?? 1

  function handleFilterChange() {
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="glass-card rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); handleFilterChange() }}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-tekton-purple-bright"
        >
          {ACTION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-black">{o.label}</option>
          ))}
        </select>

        <div className="flex rounded-lg border border-white/10 overflow-hidden">
          {DATE_RANGE_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => { setDateRange(o.value as '7' | '30' | 'all'); handleFilterChange() }}
              className={cn(
                'px-3 py-1.5 text-xs font-medium transition-colors',
                dateRange === o.value
                  ? 'bg-tekton-purple-bright text-white'
                  : 'bg-transparent text-white/50 hover:text-white',
              )}
            >
              {o.label}
            </button>
          ))}
        </div>

        {data && (
          <span className="ml-auto text-xs text-white/40">
            {data.total} entries
          </span>
        )}
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl p-4 overflow-hidden">
        {isLoading ? (
          <TableSkeleton />
        ) : entries.length === 0 ? (
          <div className="py-12 text-center text-white/40 text-sm">
            No audit log entries found for the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-2 text-left text-xs font-medium text-white/40 pr-4">Timestamp</th>
                  <th className="pb-2 text-left text-xs font-medium text-white/40 pr-4">Admin</th>
                  <th className="pb-2 text-left text-xs font-medium text-white/40 pr-4">Action</th>
                  <th className="pb-2 text-left text-xs font-medium text-white/40 pr-4">Target</th>
                  <th className="pb-2 text-left text-xs font-medium text-white/40">Details</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <AuditRow key={entry.id} entry={entry} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="size-3.5" /> Previous
          </button>
          <span className="text-xs text-white/40">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next <ChevronRight className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
