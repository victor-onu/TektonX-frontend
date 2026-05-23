import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Users, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import cohortService from '@/services/cohortService'
import adminService from '@/services/adminService'
import { useToast } from '@/hooks/useToast'
import { formatDate } from '@/lib/utils'
import type { Cohort } from '@/types'

interface CohortForm {
  name: string
  number: string
  startDate: string
  endDate: string
}

const emptyCohortForm: CohortForm = { name: '', number: '', startDate: '', endDate: '' }

export default function AdminCohortManagement() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Cohort | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Cohort | null>(null)
  const [graduateTarget, setGraduateTarget] = useState<Cohort | null>(null)
  const [graduatingCohort, setGraduatingCohort] = useState(false)
  const [membersTarget, setMembersTarget] = useState<Cohort | null>(null)
  const [form, setForm] = useState<CohortForm>(emptyCohortForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: cohorts = [], isLoading } = useQuery({
    queryKey: ['cohorts'],
    queryFn: cohortService.getAll,
  })

  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ['cohort-members', membersTarget?.id],
    queryFn: () => cohortService.getMembers(membersTarget!.id),
    enabled: !!membersTarget,
  })

  function openAdd() { setForm(emptyCohortForm); setErrors({}); setAddOpen(true) }

  function openEdit(c: Cohort) {
    setForm({ name: c.name, number: String(c.number), startDate: c.startDate, endDate: c.endDate })
    setErrors({})
    setEditTarget(c)
  }

  function closeForm() { setAddOpen(false); setEditTarget(null); setForm(emptyCohortForm); setErrors({}) }

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Name is required.'
    if (!form.number.trim() || isNaN(Number(form.number)) || Number(form.number) < 1) {
      errs.number = 'Number must be a positive integer.'
    }
    if (!form.startDate) errs.startDate = 'Start date is required.'
    if (!form.endDate) errs.endDate = 'End date is required.'
    else if (form.startDate && form.endDate <= form.startDate) {
      errs.endDate = 'End date must be after start date.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    const payload = {
      name: form.name.trim(),
      number: Number(form.number),
      startDate: form.startDate,
      endDate: form.endDate,
    }
    try {
      if (editTarget) {
        await cohortService.update(editTarget.id, payload)
        toast.success('Cohort updated.')
        setEditTarget(null)
      } else {
        await cohortService.create(payload)
        toast.success('Cohort created.')
        setAddOpen(false)
      }
      setForm(emptyCohortForm)
      queryClient.invalidateQueries({ queryKey: ['cohorts'] })
    } catch {
      toast.error('Failed to save cohort.')
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await cohortService.delete(deleteTarget.id)
      toast.success(`${deleteTarget.name} deleted.`)
      setDeleteTarget(null)
      queryClient.invalidateQueries({ queryKey: ['cohorts'] })
    } catch {
      toast.error('Failed to delete cohort.')
    }
  }

  async function handleGraduateCohort() {
    if (!graduateTarget) return
    setGraduatingCohort(true)
    try {
      const result = await adminService.graduateCohort(graduateTarget.id)
      if (result.graduated === 0) {
        toast.success('No enrolled mentees in this cohort.')
      } else {
        toast.success(`Graduated ${result.graduated} mentee${result.graduated === 1 ? '' : 's'} from ${graduateTarget.name}.`)
      }
      setGraduateTarget(null)
      queryClient.invalidateQueries({ queryKey: ['cohort-members', graduateTarget.id] })
      queryClient.invalidateQueries({ queryKey: ['admin-applicants'] })
    } catch {
      toast.error('Failed to graduate cohort.')
    } finally {
      setGraduatingCohort(false)
    }
  }

  const isFormOpen = addOpen || !!editTarget

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" className="bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90" onClick={openAdd}>
          <Plus className="size-4 mr-1.5" />
          New Cohort
        </Button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/40 text-xs uppercase">#</TableHead>
              <TableHead className="text-white/40 text-xs uppercase">Name</TableHead>
              <TableHead className="text-white/40 text-xs uppercase hidden sm:table-cell">Start Date</TableHead>
              <TableHead className="text-white/40 text-xs uppercase hidden sm:table-cell">End Date</TableHead>
              <TableHead className="text-white/40 text-xs uppercase w-28">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i} className="border-white/10">
                  <TableCell colSpan={5}><div className="h-4 rounded bg-white/10 animate-pulse w-2/3" /></TableCell>
                </TableRow>
              ))
            ) : cohorts.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={5} className="text-center py-10 text-white/40 text-sm">
                  No cohorts yet. Create your first one.
                </TableCell>
              </TableRow>
            ) : (
              cohorts.map((c) => (
                <TableRow key={c.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white font-heading text-lg">{c.number}</TableCell>
                  <TableCell className="text-sm text-white font-medium">{c.name}</TableCell>
                  <TableCell className="text-white/50 text-xs hidden sm:table-cell">{formatDate(c.startDate)}</TableCell>
                  <TableCell className="text-white/50 text-xs hidden sm:table-cell">{formatDate(c.endDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-tekton-teal/60 hover:text-tekton-teal hover:bg-tekton-teal/10"
                        onClick={() => setMembersTarget(c)}
                        title="View Members"
                      >
                        <Users className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-tekton-green/60 hover:text-tekton-green hover:bg-tekton-green/10"
                        onClick={() => setGraduateTarget(c)}
                        title="Graduate Cohort"
                      >
                        <GraduationCap className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-7 text-white/40 hover:text-white hover:bg-white/10" onClick={() => openEdit(c)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-7 text-red-400/60 hover:text-red-400 hover:bg-red-500/10" onClick={() => setDeleteTarget(c)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(o) => { if (!o) closeForm() }}>
        <DialogContent className="bg-black/95 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Cohort' : 'New Cohort'}</DialogTitle>
            <DialogDescription className="text-white/50">
              {editTarget ? 'Update cohort details.' : 'Create a new cohort for the mentorship program.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Cohort Name <span className="text-red-400">*</span></label>
              <Input
                value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors((p) => ({ ...p, name: '' })) }}
                placeholder="e.g. Cohort 5"
                className={`bg-white/5 border-white/20 text-white placeholder:text-white/30 ${errors.name ? 'border-red-500/70' : ''}`}
              />
              {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Cohort Number <span className="text-red-400">*</span></label>
              <Input
                type="number"
                min={1}
                value={form.number}
                onChange={(e) => { setForm({ ...form, number: e.target.value }); setErrors((p) => ({ ...p, number: '' })) }}
                placeholder="e.g. 5"
                className={`bg-white/5 border-white/20 text-white placeholder:text-white/30 ${errors.number ? 'border-red-500/70' : ''}`}
              />
              {errors.number && <p className="text-xs text-red-400">{errors.number}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Start Date <span className="text-red-400">*</span></label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => { setForm({ ...form, startDate: e.target.value }); setErrors((p) => ({ ...p, startDate: '' })) }}
                  className={`bg-white/5 border-white/20 text-white ${errors.startDate ? 'border-red-500/70' : ''}`}
                />
                {errors.startDate && <p className="text-xs text-red-400">{errors.startDate}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">End Date <span className="text-red-400">*</span></label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => { setForm({ ...form, endDate: e.target.value }); setErrors((p) => ({ ...p, endDate: '' })) }}
                  className={`bg-white/5 border-white/20 text-white ${errors.endDate ? 'border-red-500/70' : ''}`}
                />
                {errors.endDate && <p className="text-xs text-red-400">{errors.endDate}</p>}
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" className="border-white/20 text-white/70" onClick={closeForm}>Cancel</Button>
            <Button className="bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90" onClick={handleSubmit}>
              {editTarget ? 'Save Changes' : 'Create Cohort'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Graduate Cohort Dialog */}
      <Dialog open={!!graduateTarget} onOpenChange={(o) => { if (!o && !graduatingCohort) setGraduateTarget(null) }}>
        <DialogContent className="bg-black/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Graduate Cohort</DialogTitle>
            <DialogDescription className="text-white/50">
              This will mark every <span className="text-white font-medium">enrolled</span> mentee in <span className="text-white font-medium">{graduateTarget?.name}</span> as graduated. Mentees in other statuses (applied, screened, approved) are not affected. Cohort assignments are preserved for history.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" disabled={graduatingCohort} className="border-white/20 text-white/70" onClick={() => setGraduateTarget(null)}>
              Cancel
            </Button>
            <Button
              disabled={graduatingCohort}
              className="bg-tekton-green/20 text-tekton-green border border-tekton-green/30 hover:bg-tekton-green/30"
              onClick={handleGraduateCohort}
            >
              {graduatingCohort ? 'Graduating…' : 'Graduate Cohort'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null) }}>
        <DialogContent className="bg-black/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Delete Cohort</DialogTitle>
            <DialogDescription className="text-white/50">
              Are you sure you want to delete <span className="text-white font-medium">{deleteTarget?.name}</span>?
              Existing assignments linked to this cohort will retain the cohort ID reference.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" className="border-white/20 text-white/70" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Members Dialog */}
      <Dialog open={!!membersTarget} onOpenChange={(o) => { if (!o) setMembersTarget(null) }}>
        <DialogContent className="bg-black/95 border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Members — {membersTarget?.name}</DialogTitle>
            <DialogDescription className="text-white/50">
              Mentees currently assigned to this cohort.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto flex flex-col gap-2">
            {membersLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 rounded bg-white/10 animate-pulse" />
              ))
            ) : members.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-6">No members in this cohort yet.</p>
            ) : (
              members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
                  <div className="size-8 rounded-full bg-gradient-to-br from-tekton-blue to-tekton-teal flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {m.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-white truncate">{m.name}</span>
                    <span className="text-xs text-white/40 truncate">{m.email}</span>
                  </div>
                  <span className="ml-auto text-xs text-white/30 shrink-0">{m.track}</span>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-end mt-2">
            <Button variant="outline" className="border-white/20 text-white/70" onClick={() => setMembersTarget(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
