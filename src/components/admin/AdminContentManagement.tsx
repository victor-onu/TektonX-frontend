import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Pencil, Trash2, Plus, CalendarIcon, ImageIcon, X } from 'lucide-react'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
import taskService from '@/services/taskService'
import announcementService from '@/services/announcementService'
import sessionService from '@/services/sessionService'
import resourceService from '@/services/resourceService'
import { useToast } from '@/hooks/useToast'
import { cn, formatDate } from '@/lib/utils'
import type { Task, Announcement, MentorshipSession, AnnouncementType, Resource } from '@/types'
import { TECH_TRACKS } from '@/types'

const MAX_FLIER_SIZE_MB = 2

// ─── Tasks Tab ────────────────────────────────────────────────────────────────

type MilestoneFilter = 1 | 2 | 3 | 'all'

interface TaskForm {
  taskId: string
  title: string
  description: string
  milestone: string
  week: string
  completed: boolean
  userId?: string
}

const emptyTaskForm: TaskForm = {
  taskId: '',
  title: '',
  description: '',
  milestone: '1',
  week: '1',
  completed: false,
}

const milestoneBadgeClass: Record<number, string> = {
  1: 'bg-tekton-blue/15 text-tekton-blue border border-tekton-blue/30',
  2: 'bg-tekton-yellow/15 text-tekton-yellow border border-tekton-yellow/30',
  3: 'bg-tekton-green/15 text-tekton-green border border-tekton-green/30',
}

function TasksTab() {
  const { toast } = useToast()

  const [milestoneFilter, setMilestoneFilter] = useState<MilestoneFilter>('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Task | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null)
  const [form, setForm] = useState<TaskForm>(emptyTaskForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-tasks', milestoneFilter],
    queryFn: () =>
      taskService.getTemplates(milestoneFilter !== 'all' ? (milestoneFilter as number) : undefined),
  })

  function openAdd() {
    setForm(emptyTaskForm)
    setAddOpen(true)
  }

  function openEdit(task: Task) {
    setForm({
      taskId: task.taskId,
      title: task.title,
      description: task.description,
      milestone: String(task.milestone),
      week: String(task.week),
      completed: task.completed,
      userId: task.userId,
    })
    setEditTarget(task)
  }

  async function handleSubmit() {
    const errs: Record<string, string> = {}
    if (!form.taskId.trim()) errs.taskId = 'Task ID is required.'
    if (!form.title.trim()) errs.title = 'Title is required.'
    if (!form.description.trim()) errs.description = 'Description is required.'
    if (setErrors(errs), Object.keys(errs).length > 0) return

    const milestone = Number(form.milestone) as 1 | 2 | 3
    const week = Number(form.week) as Task['week']
    const payload = {
      taskId: form.taskId,
      title: form.title,
      description: form.description,
      milestone,
      week,
      completed: form.completed,
      userId: form.userId,
    }

    try {
      if (editTarget) {
        await adminService.updateTask(editTarget.id, payload)
        toast.success('Task updated.')
        setEditTarget(null)
      } else {
        await adminService.createTask(payload)
        toast.success('Task created.')
        setAddOpen(false)
      }
      setForm(emptyTaskForm)
      await refetch()
    } catch {
      toast.error('Failed to save task.')
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await adminService.deleteTask(deleteTarget.id)
      toast.success('Task deleted.')
      setDeleteTarget(null)
      await refetch()
    } catch {
      toast.error('Failed to delete task.')
    }
  }

  const isFormOpen = addOpen || !!editTarget

  function closeForm() {
    setAddOpen(false)
    setEditTarget(null)
    setForm(emptyTaskForm)
    setErrors({})
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select value={String(milestoneFilter)} onValueChange={(v) => setMilestoneFilter(v === 'all' ? 'all' : Number(v) as 1 | 2 | 3)}>
          <SelectTrigger className="w-40 bg-black border-white/20 text-white">
            <SelectValue placeholder="Milestone" />
          </SelectTrigger>
          <SelectContent className="bg-black border-white/10">
            <SelectItem value="all">All Milestones</SelectItem>
            <SelectItem value="1">Milestone 1</SelectItem>
            <SelectItem value="2">Milestone 2</SelectItem>
            <SelectItem value="3">Milestone 3</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" className="bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90" onClick={openAdd}>
          <Plus className="size-4 mr-1.5" />
          Add Task
        </Button>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/40 text-xs uppercase">Title</TableHead>
              <TableHead className="text-white/40 text-xs uppercase">Milestone</TableHead>
              <TableHead className="text-white/40 text-xs uppercase hidden sm:table-cell">Week</TableHead>
              <TableHead className="text-white/40 text-xs uppercase hidden md:table-cell">Description</TableHead>
              <TableHead className="text-white/40 text-xs uppercase w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-white/10">
                  <TableCell colSpan={5}><div className="h-4 rounded bg-white/10 animate-pulse w-2/3" /></TableCell>
                </TableRow>
              ))
            ) : tasks.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={5} className="text-center py-10 text-white/40 text-sm">No tasks found.</TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-sm text-white font-medium">{task.title}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${milestoneBadgeClass[task.milestone] ?? ''}`}>
                      M{task.milestone}
                    </span>
                  </TableCell>
                  <TableCell className="text-white/60 text-sm hidden sm:table-cell">Week {task.week}</TableCell>
                  <TableCell className="text-white/50 text-xs hidden md:table-cell">
                    {task.description.length > 50 ? task.description.slice(0, 50) + '…' : task.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-white/40 hover:text-white hover:bg-white/10"
                        onClick={() => openEdit(task)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => setDeleteTarget(task)}
                      >
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
        <DialogContent className="bg-black/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Task' : 'Add Task'}</DialogTitle>
            <DialogDescription className="text-white/50">
              {editTarget ? 'Update the task details below.' : 'Fill in the details for the new task.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Task ID <span className="text-red-400">*</span></label>
              <Input
                value={form.taskId}
                onChange={(e) => { setForm({ ...form, taskId: e.target.value }); setErrors((p) => ({ ...p, taskId: '' })) }}
                placeholder="e.g. m1-w1-t1"
                className={cn('bg-white/5 border-white/20 text-white placeholder:text-white/30', errors.taskId && 'border-red-500/70')}
              />
              {errors.taskId && <p className="text-xs text-red-400">{errors.taskId}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Title <span className="text-red-400">*</span></label>
              <Input
                value={form.title}
                onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors((p) => ({ ...p, title: '' })) }}
                placeholder="Task title"
                className={cn('bg-white/5 border-white/20 text-white placeholder:text-white/30', errors.title && 'border-red-500/70')}
              />
              {errors.title && <p className="text-xs text-red-400">{errors.title}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Description <span className="text-red-400">*</span></label>
              <Textarea
                value={form.description}
                onChange={(e) => { setForm({ ...form, description: e.target.value }); setErrors((p) => ({ ...p, description: '' })) }}
                placeholder="Task description"
                rows={3}
                className={cn('bg-white/5 border-white/20 text-white placeholder:text-white/30', errors.description && 'border-red-500/70')}
              />
              {errors.description && <p className="text-xs text-red-400">{errors.description}</p>}
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs text-white/50">Milestone</label>
                <Select value={form.milestone} onValueChange={(v) => setForm({ ...form, milestone: v })}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10 text-white">
                    <SelectItem value="1">Milestone 1</SelectItem>
                    <SelectItem value="2">Milestone 2</SelectItem>
                    <SelectItem value="3">Milestone 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs text-white/50">Week (1–12)</label>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  value={form.week}
                  onChange={(e) => setForm({ ...form, week: e.target.value })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" className="border-white/20 text-white/70" onClick={closeForm}>Cancel</Button>
            <Button className="bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90" onClick={handleSubmit}>
              {editTarget ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null) }}>
        <DialogContent className="bg-black/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription className="text-white/50">
              Are you sure you want to delete <span className="text-white font-medium">{deleteTarget?.title}</span>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" className="border-white/20 text-white/70" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Announcements Tab ────────────────────────────────────────────────────────

interface AnnouncementForm {
  title: string
  content: string
  type: AnnouncementType
  date: Date | undefined
  flierUrl: string | null
}

const emptyAnnouncementForm: AnnouncementForm = {
  title: '',
  content: '',
  type: 'update',
  date: new Date(),
  flierUrl: null,
}

const announcementTypeBadge: Record<AnnouncementType, string> = {
  important: 'bg-red-500/15 text-red-400 border border-red-500/30',
  event: 'bg-tekton-blue/15 text-tekton-blue border border-tekton-blue/30',
  update: 'bg-tekton-green/15 text-tekton-green border border-tekton-green/30',
}

function AnnouncementsTab() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Announcement | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null)
  const [form, setForm] = useState<AnnouncementForm>(emptyAnnouncementForm)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [flierFile, setFlierFile] = useState<File | null>(null)
  const [flierPreview, setFlierPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'past'>('all')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: announcements = [], isLoading, refetch } = useQuery({
    queryKey: ['announcements'],
    queryFn: announcementService.getAll,
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const filteredAnnouncements = announcements.filter((a) => {
    if (dateFilter === 'all') return true
    const d = new Date(a.date)
    if (dateFilter === 'upcoming') return d >= today
    return d < today
  })

  function openAdd() {
    setForm(emptyAnnouncementForm)
    setFlierFile(null)
    setFlierPreview(null)
    setAddOpen(true)
  }

  function openEdit(a: Announcement) {
    setForm({
      title: a.title,
      content: a.content,
      type: a.type,
      date: a.date ? new Date(a.date) : new Date(),
      flierUrl: a.flierUrl ?? null,
    })
    setFlierFile(null)
    setFlierPreview(a.flierUrl ?? null)
    setEditTarget(a)
  }

  function handleFlierSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_FLIER_SIZE_MB * 1024 * 1024) {
      toast.error(`Flier must be ${MAX_FLIER_SIZE_MB}MB or less.`)
      return
    }
    setFlierFile(file)
    setFlierPreview(URL.createObjectURL(file))
  }

  function removeFlier() {
    setFlierFile(null)
    setFlierPreview(null)
    setForm((f) => ({ ...f, flierUrl: null }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit() {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'Title is required.'
    if (!form.content.trim()) errs.content = 'Content is required.'
    if (!form.date) errs.date = 'Please select a date.'
    if (setErrors(errs), Object.keys(errs).length > 0) return
    setSaving(true)
    try {
      let flierUrl = form.flierUrl

      // Upload new flier if one was selected
      if (flierFile) {
        setUploading(true)
        flierUrl = await announcementService.uploadFlier(flierFile)
        setUploading(false)
      }

      const payload = {
        title: form.title,
        content: form.content,
        type: form.type,
        date: format(form.date!, 'yyyy-MM-dd'),
        flierUrl: flierUrl ?? undefined,
      }

      if (editTarget) {
        await announcementService.update(editTarget.id, payload)
        toast.success('Announcement updated.')
        setEditTarget(null)
      } else {
        await announcementService.create(payload)
        toast.success('Announcement created.')
        setAddOpen(false)
      }
      setForm(emptyAnnouncementForm)
      setFlierFile(null)
      setFlierPreview(null)
      await refetch()
    } catch {
      toast.error('Failed to save announcement.')
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await announcementService.delete(deleteTarget.id)
      toast.success('Announcement deleted.')
      setDeleteTarget(null)
      await refetch()
    } catch {
      toast.error('Failed to delete announcement.')
    }
  }

  const isFormOpen = addOpen || !!editTarget

  function closeForm() {
    setAddOpen(false)
    setEditTarget(null)
    setForm(emptyAnnouncementForm)
    setFlierFile(null)
    setFlierPreview(null)
    setErrors({})
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
          {(['all', 'upcoming', 'past'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setDateFilter(f)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                dateFilter === f
                  ? 'bg-tekton-purple-bright text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <Button size="sm" className="bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90" onClick={openAdd}>
          <Plus className="size-4 mr-1.5" />
          Add Announcement
        </Button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/40 text-xs uppercase">Title</TableHead>
              <TableHead className="text-white/40 text-xs uppercase">Type</TableHead>
              <TableHead className="text-white/40 text-xs uppercase hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-white/40 text-xs uppercase hidden md:table-cell">Content</TableHead>
              <TableHead className="text-white/40 text-xs uppercase w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i} className="border-white/10">
                  <TableCell colSpan={5}><div className="h-4 rounded bg-white/10 animate-pulse w-2/3" /></TableCell>
                </TableRow>
              ))
            ) : filteredAnnouncements.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={5} className="text-center py-10 text-white/40 text-sm">
                  {dateFilter === 'past' ? 'No past announcements.' : dateFilter === 'upcoming' ? 'No upcoming announcements.' : 'No announcements yet.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredAnnouncements.map((a) => (
                <TableRow key={a.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-sm text-white font-medium flex items-center gap-2">
                    {a.flierUrl && <ImageIcon className="size-3.5 text-white/30 shrink-0" />}
                    {a.title}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${announcementTypeBadge[a.type] ?? ''}`}>
                      {a.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-white/50 text-xs hidden sm:table-cell">{formatDate(a.date)}</TableCell>
                  <TableCell className="text-white/50 text-xs hidden md:table-cell">
                    {a.content.length > 50 ? a.content.slice(0, 50) + '…' : a.content}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="size-7 text-white/40 hover:text-white hover:bg-white/10" onClick={() => openEdit(a)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-7 text-red-400/60 hover:text-red-400 hover:bg-red-500/10" onClick={() => setDeleteTarget(a)}>
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
        <DialogContent className="bg-black/95 border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Announcement' : 'Add Announcement'}</DialogTitle>
            <DialogDescription className="text-white/50">
              {editTarget ? 'Update announcement details.' : 'Create a new announcement.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Title <span className="text-red-400">*</span></label>
              <Input
                value={form.title}
                onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors((p) => ({ ...p, title: '' })) }}
                placeholder="Announcement title"
                className={cn('bg-white/5 border-white/20 text-white placeholder:text-white/30', errors.title && 'border-red-500/70')}
              />
              {errors.title && <p className="text-xs text-red-400">{errors.title}</p>}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Content <span className="text-red-400">*</span></label>
              <Textarea
                value={form.content}
                onChange={(e) => { setForm({ ...form, content: e.target.value }); setErrors((p) => ({ ...p, content: '' })) }}
                placeholder="Announcement content"
                rows={4}
                className={cn('bg-white/5 border-white/20 text-white placeholder:text-white/30', errors.content && 'border-red-500/70')}
              />
              {errors.content && <p className="text-xs text-red-400">{errors.content}</p>}
            </div>

            {/* Type + Date */}
            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs text-white/50">Type</label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as AnnouncementType })}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10 text-white">
                    <SelectItem value="important">Important</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs text-white/50">Date <span className="text-red-400">*</span></label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white',
                        !form.date && 'text-white/30',
                        errors.date && 'border-red-500/70',
                      )}
                    >
                      <CalendarIcon className="mr-2 size-4 text-white/40" />
                      {form.date ? format(form.date, 'MMM d, yyyy') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-black border-white/10" align="start">
                    <Calendar
                      mode="single"
                      selected={form.date}
                      onSelect={(d) => { setForm({ ...form, date: d }); setErrors((p) => ({ ...p, date: '' })); setCalendarOpen(false) }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-xs text-red-400">{errors.date}</p>}
              </div>
            </div>

            {/* Flier Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Event Flier <span className="text-white/30">(optional, max {MAX_FLIER_SIZE_MB}MB)</span></label>
              {flierPreview ? (
                <div className="relative w-full rounded-lg overflow-hidden border border-white/10">
                  <img src={flierPreview} alt="Flier preview" className="w-full max-h-48 object-cover" />
                  <button
                    onClick={removeFlier}
                    className="absolute top-2 right-2 flex items-center justify-center size-6 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-2 w-full rounded-lg border border-dashed border-white/20 px-4 py-6 text-white/40 hover:border-white/40 hover:text-white/60 transition-colors"
                >
                  <ImageIcon className="size-6" />
                  <span className="text-xs">Click to upload flier</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFlierSelect}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" className="border-white/20 text-white/70" onClick={closeForm}>Cancel</Button>
            <Button
              className="bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90"
              onClick={handleSubmit}
              disabled={saving}
            >
              {uploading ? 'Uploading flier…' : saving ? 'Saving…' : editTarget ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null) }}>
        <DialogContent className="bg-black/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
            <DialogDescription className="text-white/50">
              Are you sure you want to delete <span className="text-white font-medium">{deleteTarget?.title}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" className="border-white/20 text-white/70" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Sessions Tab ─────────────────────────────────────────────────────────────

interface SessionForm {
  title: string
  date: string
  time: string
  type: string
  createdBy: string
}

const emptySessionForm: SessionForm = {
  title: '',
  date: new Date().toISOString().split('T')[0],
  time: '10:00',
  type: '',
  createdBy: '',
}

function SessionsTab() {
  const { toast } = useToast()

  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<MentorshipSession | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MentorshipSession | null>(null)
  const [form, setForm] = useState<SessionForm>(emptySessionForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: sessions = [], isLoading, refetch } = useQuery({
    queryKey: ['sessions'],
    queryFn: sessionService.getAll,
  })

  function openAdd() {
    setForm(emptySessionForm)
    setAddOpen(true)
  }

  function openEdit(s: MentorshipSession) {
    setForm({
      title: s.title,
      date: s.date,
      time: s.time,
      type: s.type,
      createdBy: s.createdBy,
    })
    setEditTarget(s)
  }

  async function handleSubmit() {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'Title is required.'
    if (!form.type.trim()) errs.type = 'Session type is required.'
    if (setErrors(errs), Object.keys(errs).length > 0) return
    try {
      if (editTarget) {
        await sessionService.update(editTarget.id, form)
        toast.success('Session updated.')
        setEditTarget(null)
      } else {
        await sessionService.create(form)
        toast.success('Session created.')
        setAddOpen(false)
      }
      setForm(emptySessionForm)
      await refetch()
    } catch {
      toast.error('Failed to save session.')
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await sessionService.delete(deleteTarget.id)
      toast.success('Session deleted.')
      setDeleteTarget(null)
      await refetch()
    } catch {
      toast.error('Failed to delete session.')
    }
  }

  const isFormOpen = addOpen || !!editTarget

  function closeForm() {
    setAddOpen(false)
    setEditTarget(null)
    setForm(emptySessionForm)
    setErrors({})
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" className="bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90" onClick={openAdd}>
          <Plus className="size-4 mr-1.5" />
          Add Session
        </Button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/40 text-xs uppercase">Title</TableHead>
              <TableHead className="text-white/40 text-xs uppercase hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-white/40 text-xs uppercase hidden sm:table-cell">Time</TableHead>
              <TableHead className="text-white/40 text-xs uppercase hidden md:table-cell">Type</TableHead>
              <TableHead className="text-white/40 text-xs uppercase w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i} className="border-white/10">
                  <TableCell colSpan={5}><div className="h-4 rounded bg-white/10 animate-pulse w-2/3" /></TableCell>
                </TableRow>
              ))
            ) : sessions.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={5} className="text-center py-10 text-white/40 text-sm">No sessions yet.</TableCell>
              </TableRow>
            ) : (
              sessions.map((s) => (
                <TableRow key={s.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-sm text-white font-medium">{s.title}</TableCell>
                  <TableCell className="text-white/60 text-sm hidden sm:table-cell">{formatDate(s.date)}</TableCell>
                  <TableCell className="text-white/60 text-sm hidden sm:table-cell">{s.time}</TableCell>
                  <TableCell className="text-white/50 text-xs hidden md:table-cell">{s.type || '—'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="size-7 text-white/40 hover:text-white hover:bg-white/10" onClick={() => openEdit(s)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-7 text-red-400/60 hover:text-red-400 hover:bg-red-500/10" onClick={() => setDeleteTarget(s)}>
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
        <DialogContent className="bg-black/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Session' : 'Add Session'}</DialogTitle>
            <DialogDescription className="text-white/50">
              {editTarget ? 'Update session details.' : 'Create a new mentorship session.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Title <span className="text-red-400">*</span></label>
              <Input
                value={form.title}
                onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors((p) => ({ ...p, title: '' })) }}
                placeholder="Session title"
                className={cn('bg-white/5 border-white/20 text-white placeholder:text-white/30', errors.title && 'border-red-500/70')}
              />
              {errors.title && <p className="text-xs text-red-400">{errors.title}</p>}
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs text-white/50">Date</label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs text-white/50">Time</label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Type <span className="text-red-400">*</span></label>
              <Input
                value={form.type}
                onChange={(e) => { setForm({ ...form, type: e.target.value }); setErrors((p) => ({ ...p, type: '' })) }}
                placeholder="e.g. Group Webinar, 1-on-1, Workshop"
                className={cn('bg-white/5 border-white/20 text-white placeholder:text-white/30', errors.type && 'border-red-500/70')}
              />
              {errors.type && <p className="text-xs text-red-400">{errors.type}</p>}
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" className="border-white/20 text-white/70" onClick={closeForm}>Cancel</Button>
            <Button className="bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90" onClick={handleSubmit}>
              {editTarget ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null) }}>
        <DialogContent className="bg-black/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Delete Session</DialogTitle>
            <DialogDescription className="text-white/50">
              Are you sure you want to delete <span className="text-white font-medium">{deleteTarget?.title}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" className="border-white/20 text-white/70" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Resources Tab ────────────────────────────────────────────────────────────

interface ResourceForm {
  taskId: string
  track: string
  title: string
  url: string
}

const emptyResourceForm: ResourceForm = { taskId: '', track: '', title: '', url: '' }

function ResourcesTab() {
  const { toast } = useToast()

  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Resource | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null)
  const [form, setForm] = useState<ResourceForm>(emptyResourceForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: resources = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-resources'],
    queryFn: resourceService.getAll,
  })

  const { data: templates = [] } = useQuery({
    queryKey: ['task-templates'],
    queryFn: () => taskService.getTemplates(),
  })

  function openAdd() { setForm(emptyResourceForm); setErrors({}); setAddOpen(true) }

  function openEdit(r: Resource) {
    setForm({ taskId: r.taskId ?? '', track: r.track ?? '', title: r.title, url: r.url })
    setErrors({})
    setEditTarget(r)
  }

  function closeForm() { setAddOpen(false); setEditTarget(null); setForm(emptyResourceForm); setErrors({}) }

  async function handleSubmit() {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'Title is required.'
    if (!form.url.trim()) errs.url = 'URL is required.'
    else if (!/^https?:\/\/.+/.test(form.url.trim())) errs.url = 'Must be a valid URL starting with http(s)://'
    if (!form.taskId && !form.track) errs.taskId = 'Either a task or a track is required.'
    if (setErrors(errs), Object.keys(errs).length > 0) return

    const payload = {
      ...(form.taskId ? { taskId: form.taskId } : {}),
      ...(form.track ? { track: form.track } : {}),
      title: form.title,
      url: form.url,
    }
    try {
      if (editTarget) {
        await resourceService.update(editTarget.id, payload)
        toast.success('Resource updated.')
        setEditTarget(null)
      } else {
        await resourceService.create(payload)
        toast.success('Resource added.')
        setAddOpen(false)
      }
      setForm(emptyResourceForm)
      await refetch()
    } catch {
      toast.error('Failed to save resource.')
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await resourceService.delete(deleteTarget.id)
      toast.success('Resource deleted.')
      setDeleteTarget(null)
      await refetch()
    } catch {
      toast.error('Failed to delete resource.')
    }
  }

  const isFormOpen = addOpen || !!editTarget

  // Group resources by taskId for display
  const taskLabelMap = new Map(templates.map((t) => [t.taskId, `[M${t.milestone} W${t.week}] ${t.title}`]))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" className="bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90" onClick={openAdd}>
          <Plus className="size-4 mr-1.5" />
          Add Resource
        </Button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/40 text-xs uppercase">Title</TableHead>
              <TableHead className="text-white/40 text-xs uppercase hidden sm:table-cell">Task</TableHead>
              <TableHead className="text-white/40 text-xs uppercase hidden lg:table-cell">Track</TableHead>
              <TableHead className="text-white/40 text-xs uppercase hidden md:table-cell">URL</TableHead>
              <TableHead className="text-white/40 text-xs uppercase w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i} className="border-white/10">
                  <TableCell colSpan={5}><div className="h-4 rounded bg-white/10 animate-pulse w-2/3" /></TableCell>
                </TableRow>
              ))
            ) : resources.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={5} className="text-center py-10 text-white/40 text-sm">No resources yet. Add your first one.</TableCell>
              </TableRow>
            ) : (
              resources.map((r) => (
                <TableRow key={r.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-sm text-white font-medium">{r.title}</TableCell>
                  <TableCell className="text-white/50 text-xs hidden sm:table-cell max-w-[160px] truncate">
                    {r.taskId ? (taskLabelMap.get(r.taskId) ?? r.taskId) : <span className="text-white/20">—</span>}
                  </TableCell>
                  <TableCell className="text-white/50 text-xs hidden lg:table-cell max-w-[160px] truncate">
                    {r.track ?? <span className="text-white/20">—</span>}
                  </TableCell>
                  <TableCell className="text-xs hidden md:table-cell">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-tekton-blue hover:underline truncate max-w-[200px] block">
                      {r.url}
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="size-7 text-white/40 hover:text-white hover:bg-white/10" onClick={() => openEdit(r)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-7 text-red-400/60 hover:text-red-400 hover:bg-red-500/10" onClick={() => setDeleteTarget(r)}>
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
        <DialogContent className="bg-black/95 border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
            <DialogDescription className="text-white/50">
              Resources can be linked to a task (appear in Roadmap) or a track (appear on Mentee Dashboard).
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <p className="text-xs text-white/40">Fill in a Task, a Track, or both.</p>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Task</label>
              <Select value={form.taskId} onValueChange={(v) => { setForm({ ...form, taskId: v === '__none__' ? '' : v }); setErrors((p) => ({ ...p, taskId: '' })) }}>
                <SelectTrigger className={cn('bg-white/5 border-white/20 text-white', errors.taskId && 'border-red-500/70')}>
                  <SelectValue placeholder="Select a task (optional)…" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10 text-white max-h-64">
                  <SelectItem value="__none__"><span className="text-white/40">None</span></SelectItem>
                  {templates.map((t) => (
                    <SelectItem key={t.taskId} value={t.taskId}>
                      {`[M${t.milestone} W${t.week}] ${t.title}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.taskId && <p className="text-xs text-red-400">{errors.taskId}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Track</label>
              <Select value={form.track} onValueChange={(v) => { setForm({ ...form, track: v === '__none__' ? '' : v }); setErrors((p) => ({ ...p, taskId: '' })) }}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Select a track (optional)…" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10 text-white max-h-64">
                  <SelectItem value="__none__"><span className="text-white/40">None</span></SelectItem>
                  {TECH_TRACKS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Resource Title <span className="text-red-400">*</span></label>
              <Input
                value={form.title}
                onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors((p) => ({ ...p, title: '' })) }}
                placeholder="e.g. MDN Web Docs – HTML Basics"
                className={cn('bg-white/5 border-white/20 text-white placeholder:text-white/30', errors.title && 'border-red-500/70')}
              />
              {errors.title && <p className="text-xs text-red-400">{errors.title}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">URL <span className="text-red-400">*</span></label>
              <Input
                value={form.url}
                onChange={(e) => { setForm({ ...form, url: e.target.value }); setErrors((p) => ({ ...p, url: '' })) }}
                placeholder="https://..."
                className={cn('bg-white/5 border-white/20 text-white placeholder:text-white/30', errors.url && 'border-red-500/70')}
              />
              {errors.url && <p className="text-xs text-red-400">{errors.url}</p>}
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" className="border-white/20 text-white/70" onClick={closeForm}>Cancel</Button>
            <Button className="bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90" onClick={handleSubmit}>
              {editTarget ? 'Save Changes' : 'Add Resource'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null) }}>
        <DialogContent className="bg-black/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
            <DialogDescription className="text-white/50">
              Are you sure you want to delete <span className="text-white font-medium">{deleteTarget?.title}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" className="border-white/20 text-white/70" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminContentManagement() {
  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="h-auto bg-white/5 border border-white/10 p-1 gap-1 rounded-lg flex-wrap">
          <TabsTrigger value="tasks" className="data-[state=active]:bg-tekton-purple-bright/80 data-[state=active]:text-white text-white/60 rounded-md text-xs sm:text-sm">
            Tasks
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-tekton-purple-bright/80 data-[state=active]:text-white text-white/60 rounded-md text-xs sm:text-sm">
            Resources
          </TabsTrigger>
          <TabsTrigger value="announcements" className="data-[state=active]:bg-tekton-purple-bright/80 data-[state=active]:text-white text-white/60 rounded-md text-xs sm:text-sm">
            Announcements
          </TabsTrigger>
          <TabsTrigger value="sessions" className="data-[state=active]:bg-tekton-purple-bright/80 data-[state=active]:text-white text-white/60 rounded-md text-xs sm:text-sm">
            Sessions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-5">
          <TasksTab />
        </TabsContent>
        <TabsContent value="resources" className="mt-5">
          <ResourcesTab />
        </TabsContent>
        <TabsContent value="announcements" className="mt-5">
          <AnnouncementsTab />
        </TabsContent>
        <TabsContent value="sessions" className="mt-5">
          <SessionsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
