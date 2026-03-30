import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import adminService from '@/services/adminService'
import { formatDate } from '@/lib/utils'
import type { ApplicationStatus, User } from '@/types'

type FilterTab = 'all' | ApplicationStatus

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'applied', label: 'Applied' },
  { value: 'screened', label: 'Screened' },
  { value: 'approved', label: 'Approved' },
  { value: 'enrolled', label: 'Enrolled' },
]

function statusBadgeClass(status: ApplicationStatus): string {
  switch (status) {
    case 'applied': return 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400'
    case 'screened': return 'bg-tekton-blue/15 border-tekton-blue/30 text-tekton-blue'
    case 'approved': return 'bg-tekton-green/15 border-tekton-green/30 text-tekton-green'
    case 'enrolled': return 'bg-tekton-purple-bright/15 border-tekton-purple-bright/30 text-tekton-purple-bright'
    default: return 'bg-white/10 border-white/20 text-white/60'
  }
}

function getStatusOptions(current: ApplicationStatus): ApplicationStatus[] {
  switch (current) {
    case 'applied': return ['screened', 'approved']
    case 'screened': return ['approved']
    default: return []
  }
}

function StatusCell({ applicant }: { applicant: User }) {
  const qc = useQueryClient()
  const [updating, setUpdating] = useState(false)
  const appStatus = applicant.applicationStatus ?? 'applied'
  const options = getStatusOptions(appStatus)

  if (appStatus === 'enrolled') {
    return <span className="text-xs text-tekton-purple-bright font-medium">Enrolled</span>
  }

  if (options.length === 0) {
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadgeClass(appStatus)}`}>
        {appStatus}
      </span>
    )
  }

  return (
    <Select
      disabled={updating}
      onValueChange={async (val) => {
        setUpdating(true)
        try {
          await adminService.updateMenteeStatus(applicant.id, val as ApplicationStatus)
          toast.success(`Status updated to ${val}`)
          qc.invalidateQueries({ queryKey: ['admin-applicants'] })
        } catch {
          toast.error('Failed to update status.')
        } finally {
          setUpdating(false)
        }
      }}
    >
      <SelectTrigger className="h-7 w-32 text-xs bg-white/5 border-white/10 text-white">
        <SelectValue placeholder={appStatus} />
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 border-white/10">
        {options.map((opt) => (
          <SelectItem key={opt} value={opt} className="text-xs text-white capitalize hover:bg-white/10">
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default function AdminApplicants() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')

  const { data: applicants = [], isLoading } = useQuery({
    queryKey: ['admin-applicants'],
    queryFn: adminService.getApplicants,
  })

  const filtered = activeFilter === 'all'
    ? applicants
    : applicants.filter((a) => a.applicationStatus === activeFilter)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-xl h-14 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              activeFilter === tab.value
                ? 'bg-tekton-purple-bright border-tekton-purple-bright text-white'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30'
            }`}
          >
            {tab.label}
            {tab.value !== 'all' && (
              <span className="ml-1.5 text-[10px] opacity-60">
                ({applicants.filter((a) => a.applicationStatus === tab.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-xl p-8 flex items-center justify-center">
          <p className="text-sm text-white/40">No applicants yet.</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-xs text-white/50 font-medium uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs text-white/50 font-medium uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs text-white/50 font-medium uppercase tracking-wider">Track</th>
                  <th className="px-4 py-3 text-left text-xs text-white/50 font-medium uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs text-white/50 font-medium uppercase tracking-wider">Applied</th>
                  <th className="px-4 py-3 text-left text-xs text-white/50 font-medium uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{applicant.name}</td>
                    <td className="px-4 py-3 text-white/60">{applicant.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-tekton-purple-bright/10 border border-tekton-purple-bright/20 px-2 py-0.5 text-xs text-tekton-purple-bright">
                        {applicant.track}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadgeClass(applicant.applicationStatus ?? 'applied')}`}>
                        {applicant.applicationStatus ?? 'applied'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/50 text-xs">{formatDate(applicant.createdAt)}</td>
                    <td className="px-4 py-3">
                      <StatusCell applicant={applicant} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary */}
      <p className="text-xs text-white/30">
        Showing {filtered.length} of {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
      </p>

    </div>
  )
}
