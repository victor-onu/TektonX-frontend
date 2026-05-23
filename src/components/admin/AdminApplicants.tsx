import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Search } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
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
  { value: 'graduated', label: 'Graduated' },
]

function statusBadgeClass(status: ApplicationStatus): string {
  switch (status) {
    case 'applied': return 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400'
    case 'screened': return 'bg-tekton-blue/15 border-tekton-blue/30 text-tekton-blue'
    case 'approved': return 'bg-tekton-green/15 border-tekton-green/30 text-tekton-green'
    case 'enrolled': return 'bg-tekton-purple-bright/15 border-tekton-purple-bright/30 text-tekton-purple-bright'
    case 'graduated': return 'bg-tekton-teal/15 border-tekton-teal/30 text-tekton-teal'
    default: return 'bg-white/10 border-white/20 text-white/60'
  }
}

const STATUS_ORDER: ApplicationStatus[] = ['applied', 'screened', 'approved']

function getStatusOptions(current: ApplicationStatus): ApplicationStatus[] {
  // All statuses except current and 'enrolled' (can't manually move to enrolled)
  return STATUS_ORDER.filter((s) => s !== current)
}

function isBackwards(from: ApplicationStatus, to: ApplicationStatus): boolean {
  return STATUS_ORDER.indexOf(to) < STATUS_ORDER.indexOf(from)
}

function StatusCell({ applicant }: { applicant: User }) {
  const qc = useQueryClient()
  const [updating, setUpdating] = useState(false)
  const [pending, setPending] = useState<ApplicationStatus | null>(null)
  const [confirmGraduate, setConfirmGraduate] = useState(false)
  const appStatus = applicant.applicationStatus ?? 'applied'
  const options = getStatusOptions(appStatus)

  if (appStatus === 'graduated') {
    return <span className="text-xs text-tekton-teal font-medium">Graduated</span>
  }

  async function graduate() {
    setUpdating(true)
    setConfirmGraduate(false)
    try {
      await adminService.graduateMentee(applicant.id)
      toast.success(`${applicant.name} marked as graduated`)
      qc.invalidateQueries({ queryKey: ['admin-applicants'] })
    } catch {
      toast.error('Failed to graduate mentee.')
    } finally {
      setUpdating(false)
    }
  }

  if (appStatus === 'enrolled') {
    return (
      <>
        <Button
          size="sm"
          variant="ghost"
          disabled={updating}
          onClick={() => setConfirmGraduate(true)}
          className="h-7 px-2 text-xs text-tekton-teal hover:bg-tekton-teal/15 hover:text-tekton-teal border border-tekton-teal/30"
        >
          Mark Graduated
        </Button>
        <Dialog open={confirmGraduate} onOpenChange={(open) => !open && setConfirmGraduate(false)}>
          <DialogContent className="bg-black/95 border border-white/10 text-white max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-heading text-lg">Mark as Graduated?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-white/60 leading-relaxed">
              <span className="text-white font-medium">{applicant.name}</span> will be moved to graduated status. They will no longer appear in active mentee lists, but their cohort record is preserved.
            </p>
            <DialogFooter className="mt-2 gap-2">
              <Button variant="ghost" onClick={() => setConfirmGraduate(false)} className="text-white/60 hover:text-white">
                Cancel
              </Button>
              <Button
                onClick={graduate}
                className="bg-tekton-teal/20 text-tekton-teal border border-tekton-teal/30 hover:bg-tekton-teal/30"
              >
                Confirm Graduation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  async function applyUpdate(newStatus: ApplicationStatus) {
    setUpdating(true)
    setPending(null)
    try {
      await adminService.updateMenteeStatus(applicant.id, newStatus)
      toast.success(`Status updated to "${newStatus}"`)
      qc.invalidateQueries({ queryKey: ['admin-applicants'] })
    } catch {
      toast.error('Failed to update status.')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <>
      <Select
        disabled={updating}
        onValueChange={(val) => {
          const newStatus = val as ApplicationStatus
          if (isBackwards(appStatus, newStatus)) {
            setPending(newStatus)
          } else {
            applyUpdate(newStatus)
          }
        }}
      >
        <SelectTrigger className="h-7 w-32 text-xs bg-white/5 border-white/10 text-white">
          <SelectValue placeholder={appStatus} />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-white/10">
          {options.map((opt) => (
            <SelectItem
              key={opt}
              value={opt}
              className={`text-xs capitalize ${isBackwards(appStatus, opt) ? 'text-yellow-400' : 'text-white'}`}
            >
              {opt} {isBackwards(appStatus, opt) ? '↩' : '→'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Confirmation dialog for backwards moves */}
      <Dialog open={!!pending} onOpenChange={(open) => !open && setPending(null)}>
        <DialogContent className="bg-black/95 border border-white/10 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">Move Status Back?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-white/60 leading-relaxed">
            You are moving <span className="text-white font-medium">{applicant.name}</span> from{' '}
            <span className="capitalize text-tekton-yellow font-medium">{appStatus}</span> back to{' '}
            <span className="capitalize text-tekton-yellow font-medium">{pending}</span>.
            {appStatus === 'approved' && (
              <span className="block mt-2 text-yellow-400/80">Note: if an approval email was already sent, this will not recall it.</span>
            )}
          </p>
          <DialogFooter className="mt-2 gap-2">
            <Button variant="ghost" onClick={() => setPending(null)} className="text-white/60 hover:text-white">
              Cancel
            </Button>
            <Button
              onClick={() => pending && applyUpdate(pending)}
              className="bg-tekton-yellow/20 text-tekton-yellow border border-tekton-yellow/30 hover:bg-tekton-yellow/30"
            >
              Yes, Move Back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function AdminApplicants() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [search, setSearch] = useState('')

  const { data: applicants = [], isLoading } = useQuery({
    queryKey: ['admin-applicants'],
    queryFn: adminService.getApplicants,
  })

  const q = search.trim().toLowerCase()
  const filtered = applicants
    .filter((a) => activeFilter === 'all' || a.applicationStatus === activeFilter)
    .filter((a) => !q || a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q))

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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/30 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/25"
        />
      </div>

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
                  <th className="px-4 py-3 text-left text-xs text-white/50 font-medium uppercase tracking-wider">Origin</th>
                  <th className="px-4 py-3 text-left text-xs text-white/50 font-medium uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs text-white/50 font-medium uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs text-white/50 font-medium uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((applicant) => {
                  const isPendingActivation = !!applicant.inviteToken
                  const isInvited = !!applicant.invitedAt
                  return (
                  <tr key={applicant.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white font-medium">{applicant.name}</span>
                        {isPendingActivation && (
                          <span className="inline-flex w-fit items-center rounded-full bg-orange-500/15 border border-orange-500/30 px-1.5 py-0 text-[10px] font-medium text-orange-400">
                            Pending Activation
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/60">{applicant.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-tekton-purple-bright/10 border border-tekton-purple-bright/20 px-2 py-0.5 text-xs text-tekton-purple-bright">
                        {applicant.track}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isInvited ? (
                        <span className="inline-flex items-center rounded-full bg-tekton-blue/15 border border-tekton-blue/30 px-2 py-0.5 text-xs font-medium text-tekton-blue">
                          Invited
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-white/5 border border-white/15 px-2 py-0.5 text-xs font-medium text-white/40">
                          Organic
                        </span>
                      )}
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
                  )
                })}
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
