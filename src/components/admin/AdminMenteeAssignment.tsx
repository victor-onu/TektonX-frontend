import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import adminService from '@/services/adminService'
import cohortService from '@/services/cohortService'
import { useToast } from '@/hooks/useToast'
import { formatDate, getInitials } from '@/lib/utils'
import { TECH_TRACKS } from '@/types'

export default function AdminMenteeAssignment() {
  const { toast } = useToast()

  const [trackFilter, setTrackFilter] = useState<string>('all')
  const [selectedMenteeIds, setSelectedMenteeIds] = useState<string[]>([])
  const [assignTarget, setAssignTarget] = useState<{ menteeId: string; menteeName: string; track: string } | null>(null)
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false)
  const [selectedMentorId, setSelectedMentorId] = useState<string>('')
  const [showAllMentors, setShowAllMentors] = useState(false)
  const [selectedCohortId, setSelectedCohortId] = useState<string>('')
  const [searchAssignments, setSearchAssignments] = useState('')
  const [unassignTarget, setUnassignTarget] = useState<{ id: string; menteeName: string; mentorName: string } | null>(null)

  const { data: unassigned = [], isLoading: unassignedLoading, refetch: refetchUnassigned } = useQuery({
    queryKey: ['admin-unassigned', trackFilter],
    queryFn: () => adminService.getUnassignedMentees(trackFilter !== 'all' ? trackFilter : undefined),
  })

  const { data: assignments = [], isLoading: assignmentsLoading, refetch: refetchAssignments } = useQuery({
    queryKey: ['admin-assignments'],
    queryFn: adminService.getAssignments,
  })

  const { data: approvedMentorsData } = useQuery({
    queryKey: ['admin-users-mentors'],
    queryFn: () => adminService.getUsers({ role: 'mentor', status: 'active', limit: 100 }),
  })
  const approvedMentors = approvedMentorsData?.data ?? []

  const { data: cohorts = [] } = useQuery({
    queryKey: ['cohorts'],
    queryFn: cohortService.getAll,
  })

  // Determine context track for filtering
  const contextTrack = assignTarget?.track ?? null
  const filteredMentors = showAllMentors || !contextTrack
    ? approvedMentors
    : approvedMentors.filter((m) => m.track === contextTrack)

  const selectAll = unassigned.length > 0 && selectedMenteeIds.length === unassigned.length

  function toggleSelectAll() {
    if (selectAll) {
      setSelectedMenteeIds([])
    } else {
      setSelectedMenteeIds(unassigned.map((u) => u.id))
    }
  }

  function toggleMentee(id: string) {
    setSelectedMenteeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  async function handleAssign() {
    if (!selectedMentorId) {
      toast.error('Please select a mentor.')
      return
    }
    if (!selectedCohortId) {
      toast.error('Please select a cohort.')
      return
    }
    const menteeIds = assignTarget ? [assignTarget.menteeId] : selectedMenteeIds
    try {
      await adminService.assignMentees(selectedMentorId, menteeIds, selectedCohortId)
      toast.success('Mentee(s) assigned! Notifications have been sent.')
      await Promise.all([refetchUnassigned(), refetchAssignments()])
      setSelectedMenteeIds([])
      setAssignTarget(null)
      setBulkDialogOpen(false)
      setSelectedMentorId('')
      setSelectedCohortId('')
    } catch {
      toast.error('Failed to assign mentees.')
    }
  }

  async function handleUnassign() {
    if (!unassignTarget) return
    try {
      await adminService.unassignMentee(unassignTarget.id)
      toast.success(`${unassignTarget.menteeName} has been unassigned.`)
      setUnassignTarget(null)
      await Promise.all([refetchUnassigned(), refetchAssignments()])
    } catch {
      toast.error('Failed to unassign mentee.')
    }
  }

  const filteredAssignments = assignments.filter((a) => {
    if (!searchAssignments) return true
    const q = searchAssignments.toLowerCase()
    return (
      (a.mentee?.name ?? '').toLowerCase().includes(q) ||
      (a.mentor?.name ?? '').toLowerCase().includes(q)
    )
  })

  const isAssignDialogOpen = !!assignTarget || bulkDialogOpen
  function closeAssignDialog() {
    setAssignTarget(null)
    setBulkDialogOpen(false)
    setSelectedMentorId('')
    setSelectedCohortId('')
    setShowAllMentors(false)
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Section 1: Unassigned Mentees */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-xl text-white">UNASSIGNED MENTEES</h2>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-tekton-blue/15 border border-tekton-blue/30 px-2.5 py-1 text-xs font-medium text-tekton-blue">
              {unassigned.length} unassigned
            </span>
            <Select value={trackFilter} onValueChange={setTrackFilter}>
              <SelectTrigger className="w-44 bg-black border-white/20 text-white">
                <SelectValue placeholder="Filter by track" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/10">
                <SelectItem value="all">All Tracks</SelectItem>
                {TECH_TRACKS.map((track) => (
                  <SelectItem key={track} value={track}>{track}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="glass-card rounded-xl overflow-x-auto">
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="w-10">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={toggleSelectAll}
                    className="border-white/30 data-[state=checked]:bg-tekton-purple-bright data-[state=checked]:border-tekton-purple-bright"
                  />
                </TableHead>
                <TableHead className="text-white/40 text-xs uppercase">Mentee</TableHead>
                <TableHead className="text-white/40 text-xs uppercase hidden md:table-cell">Track</TableHead>
                <TableHead className="text-white/40 text-xs uppercase hidden sm:table-cell">Joined</TableHead>
                <TableHead className="text-white/40 text-xs uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unassignedLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i} className="border-white/10">
                    <TableCell colSpan={5}>
                      <div className="h-4 rounded bg-white/10 animate-pulse w-2/3" />
                    </TableCell>
                  </TableRow>
                ))
              ) : unassigned.length === 0 ? (
                <TableRow className="border-white/10">
                  <TableCell colSpan={5} className="text-center py-10 text-white/40 text-sm">
                    All mentees are assigned.
                  </TableCell>
                </TableRow>
              ) : (
                unassigned.map((mentee) => (
                  <TableRow key={mentee.id} className="border-white/10 hover:bg-white/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedMenteeIds.includes(mentee.id)}
                        onCheckedChange={() => toggleMentee(mentee.id)}
                        className="border-white/30 data-[state=checked]:bg-tekton-purple-bright data-[state=checked]:border-tekton-purple-bright"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-full bg-gradient-to-br from-tekton-blue to-tekton-teal flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                          {getInitials(mentee.name)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm text-white truncate">{mentee.name}</span>
                          <span className="text-xs text-white/40 truncate">{mentee.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/60 text-xs hidden md:table-cell">
                      <span className="truncate max-w-[140px] block">{mentee.track || '—'}</span>
                    </TableCell>
                    <TableCell className="text-white/40 text-xs hidden sm:table-cell">
                      {formatDate(mentee.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        className="bg-tekton-purple-bright/15 hover:bg-tekton-purple-bright/25 text-tekton-purple-bright border border-tekton-purple-bright/30 text-xs"
                        onClick={() => {
                          setAssignTarget({ menteeId: mentee.id, menteeName: mentee.name, track: mentee.track })
                          setShowAllMentors(false)
                          setSelectedMentorId('')
                        }}
                      >
                        Assign
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Floating action bar */}
      {selectedMenteeIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 glass-card rounded-xl px-6 py-3 flex items-center gap-4 shadow-2xl border-tekton-purple-bright/40">
          <span className="text-sm text-white">{selectedMenteeIds.length} selected</span>
          <Button
            size="sm"
            className="bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90"
            onClick={() => {
              setBulkDialogOpen(true)
              setAssignTarget(null)
              setShowAllMentors(true)
              setSelectedMentorId('')
            }}
          >
            Assign to Mentor
          </Button>
          <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10" onClick={() => setSelectedMenteeIds([])}>
            Clear
          </Button>
        </div>
      )}

      {/* Section 2: Current Assignments */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-xl text-white">CURRENT ASSIGNMENTS</h2>
          <span className="inline-flex items-center rounded-full bg-tekton-green/15 border border-tekton-green/30 px-2.5 py-1 text-xs font-medium text-tekton-green">
            {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30 pointer-events-none" />
          <Input
            placeholder="Search by mentee or mentor name..."
            value={searchAssignments}
            onChange={(e) => setSearchAssignments(e.target.value)}
            className="pl-9 w-full sm:w-72 bg-white/5 border-white/20 text-white placeholder:text-white/30"
          />
        </div>

        <div className="glass-card rounded-xl overflow-x-auto">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/40 text-xs uppercase">Mentee</TableHead>
                <TableHead className="text-white/40 text-xs uppercase">Mentor</TableHead>
                <TableHead className="text-white/40 text-xs uppercase hidden md:table-cell">Track</TableHead>
                <TableHead className="text-white/40 text-xs uppercase hidden sm:table-cell">Assigned</TableHead>
                <TableHead className="text-white/40 text-xs uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignmentsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i} className="border-white/10">
                    <TableCell colSpan={5}>
                      <div className="h-4 rounded bg-white/10 animate-pulse w-2/3" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredAssignments.length === 0 ? (
                <TableRow className="border-white/10">
                  <TableCell colSpan={5} className="text-center py-10 text-white/40 text-sm">
                    No assignments found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id} className="border-white/10 hover:bg-white/5">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-full bg-gradient-to-br from-tekton-blue to-tekton-teal flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                          {getInitials(assignment.mentee?.name ?? '?')}
                        </div>
                        <span className="text-sm text-white">{assignment.mentee?.name ?? '—'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-full bg-gradient-to-br from-tekton-purple-bright to-tekton-teal flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                          {getInitials(assignment.mentor?.name ?? '?')}
                        </div>
                        <span className="text-sm text-white">{assignment.mentor?.name ?? '—'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/60 text-xs hidden md:table-cell">
                      <span className="truncate max-w-[140px] block">{assignment.mentor?.track || '—'}</span>
                    </TableCell>
                    <TableCell className="text-white/40 text-xs hidden sm:table-cell">
                      {formatDate(assignment.assignedAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400 text-xs"
                        onClick={() =>
                          setUnassignTarget({
                            id: assignment.id,
                            menteeName: assignment.mentee?.name ?? 'this mentee',
                            mentorName: assignment.mentor?.name ?? 'this mentor',
                          })
                        }
                      >
                        Unassign
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Assign Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={(o) => { if (!o) closeAssignDialog() }}>
        <DialogContent className="bg-black/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>
              {assignTarget
                ? `Assign ${assignTarget.menteeName} to a Mentor`
                : `Assign ${selectedMenteeIds.length} Mentee${selectedMenteeIds.length !== 1 ? 's' : ''} to a Mentor`}
            </DialogTitle>
            <DialogDescription className="text-white/50">
              {assignTarget
                ? `Track: ${assignTarget.track}`
                : 'Select a mentor for the selected mentees.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Cohort <span className="text-red-400">*</span></label>
              <Select value={selectedCohortId} onValueChange={setSelectedCohortId}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Select a cohort..." />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10 text-white">
                  {cohorts.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-white/40">No cohorts created yet.</div>
                  ) : (
                    cohorts.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Mentor <span className="text-red-400">*</span></label>
              <Select value={selectedMentorId} onValueChange={setSelectedMentorId}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Select a mentor..." />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10 text-white">
                  {filteredMentors.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-white/40">No mentors available.</div>
                  ) : (
                    filteredMentors.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name} — {m.track}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {assignTarget && (
              <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                <Checkbox
                  checked={showAllMentors}
                  onCheckedChange={(checked) => setShowAllMentors(checked === true)}
                  className="border-white/30 data-[state=checked]:bg-tekton-purple-bright data-[state=checked]:border-tekton-purple-bright"
                />
                Show all mentors (not just same track)
              </label>
            )}
          </div>

          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" className="border-white/20 text-white/70" onClick={closeAssignDialog}>
              Cancel
            </Button>
            <Button
              className="bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90"
              disabled={!selectedMentorId || !selectedCohortId}
              onClick={handleAssign}
            >
              Assign
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unassign Confirmation Dialog */}
      <Dialog open={!!unassignTarget} onOpenChange={(o) => { if (!o) setUnassignTarget(null) }}>
        <DialogContent className="bg-black/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Unassign Mentee</DialogTitle>
            <DialogDescription className="text-white/50">
              Are you sure you want to unassign <span className="text-white font-medium">{unassignTarget?.menteeName}</span> from <span className="text-white font-medium">{unassignTarget?.mentorName}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" className="border-white/20 text-white/70" onClick={() => setUnassignTarget(null)}>
              Cancel
            </Button>
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleUnassign}>
              Unassign
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
