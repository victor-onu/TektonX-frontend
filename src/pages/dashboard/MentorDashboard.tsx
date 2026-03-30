import { useState, useRef } from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { differenceInDays } from 'date-fns'
import { Camera, ChevronDown, ExternalLink, Lightbulb, Mail, Map, MessageSquare, Plus, Trash2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import api from '@/lib/api'
import { calculateProgress, cn, formatDate, getInitials } from '@/lib/utils'
import userService from '@/services/userService'
import resourceService from '@/services/resourceService'
import taskService from '@/services/taskService'
import { toast } from 'sonner'
import type { MentorAssignment } from '@/types'

export default function MentorDashboard() {
  const [sortBy, setSortBy] = useState<'name' | 'progress'>('name')
  const [tipsOpen, setTipsOpen] = useState(false)
  const [addResourceOpen, setAddResourceOpen] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [resourceLinkType, setResourceLinkType] = useState<'task' | 'track'>('track')
  const [resourceForm, setResourceForm] = useState({ title: '', url: '', taskId: '' })
  const [resourceErrors, setResourceErrors] = useState<Record<string, string>>({})
  const queryClient = useQueryClient()

  const { data: mentorUser, isLoading: mentorLoading } = useQuery({
    queryKey: ['me'],
    queryFn: userService.getMe,
  })

  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['my-mentees'],
    queryFn: async (): Promise<MentorAssignment[]> => {
      const { data } = await api.get('/assignments/my')
      return data
    },
  })

  const menteeCount = assignments.length

  const avgProgress =
    menteeCount === 0
      ? 0
      : Math.round(
          assignments.reduce((sum, a) => {
            if (!a.mentee) return sum
            const total =
              a.mentee.milestone1Completed +
              a.mentee.milestone2Completed +
              a.mentee.milestone3Completed
            return sum + calculateProgress(total, 48)
          }, 0) / menteeCount,
        )

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (sortBy === 'name') {
      return (a.mentee?.name ?? '').localeCompare(b.mentee?.name ?? '')
    }
    // sort by progress descending
    const progressA = a.mentee
      ? calculateProgress(
          a.mentee.milestone1Completed + a.mentee.milestone2Completed + a.mentee.milestone3Completed,
          48,
        )
      : 0
    const progressB = b.mentee
      ? calculateProgress(
          b.mentee.milestone1Completed + b.mentee.milestone2Completed + b.mentee.milestone3Completed,
          48,
        )
      : 0
    return progressB - progressA
  })

  const { data: myResources = [], isLoading: resourcesLoading } = useQuery({
    queryKey: ['my-resources'],
    queryFn: resourceService.getMine,
  })

  const { data: taskTemplates = [] } = useQuery({
    queryKey: ['task-templates'],
    queryFn: () => taskService.getTemplates(),
  })

  async function handleAddResource() {
    const errs: Record<string, string> = {}
    if (!resourceForm.title.trim()) errs.title = 'Title is required.'
    if (!resourceForm.url.trim()) errs.url = 'URL is required.'
    else if (!/^https?:\/\/.+/.test(resourceForm.url.trim())) errs.url = 'Must start with http(s)://'
    if (resourceLinkType === 'task' && !resourceForm.taskId.trim()) errs.taskId = 'Task ID is required.'
    setResourceErrors(errs)
    if (Object.keys(errs).length > 0) return
    try {
      await resourceService.create({
        title: resourceForm.title.trim(),
        url: resourceForm.url.trim(),
        ...(resourceLinkType === 'task' ? { taskId: resourceForm.taskId.trim() } : {}),
      })
      toast.success('Resource added.')
      setAddResourceOpen(false)
      setResourceForm({ title: '', url: '', taskId: '' })
      setResourceErrors({})
      queryClient.invalidateQueries({ queryKey: ['my-resources'] })
    } catch {
      toast.error('Failed to add resource.')
    }
  }

  async function handleDeleteResource(id: string) {
    try {
      await resourceService.delete(id)
      toast.success('Resource deleted.')
      queryClient.invalidateQueries({ queryKey: ['my-resources'] })
    } catch {
      toast.error('Failed to delete resource.')
    }
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await api.post<{ url: string }>('/uploads/profile-photo', formData)
      await userService.updateMe({ profilePhotoUrl: data.url })
      queryClient.invalidateQueries({ queryKey: ['me'] })
      toast.success('Profile photo updated.')
    } catch {
      toast.error('Failed to update photo.')
    } finally {
      setPhotoUploading(false)
      e.target.value = ''
    }
  }

  const programStartDate = mentorUser?.createdAt ? new Date(mentorUser.createdAt) : null
  const currentWeek = programStartDate
    ? Math.min(Math.max(Math.ceil(differenceInDays(new Date(), programStartDate) / 7), 1), 12)
    : null

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4">
      <div className="mx-auto max-w-5xl flex flex-col gap-10">

        {/* Section 1 — Welcome Header */}
        <div className="flex items-center gap-5">
          {/* Profile photo */}
          <div className="relative shrink-0 group">
            {mentorUser?.profilePhotoUrl ? (
              <img
                src={mentorUser.profilePhotoUrl}
                alt={mentorUser.name}
                className="size-20 rounded-full object-cover ring-2 ring-white/10"
              />
            ) : (
              <div className="size-20 rounded-full bg-gradient-to-br from-tekton-purple-bright to-tekton-teal flex items-center justify-center text-white text-2xl font-heading ring-2 ring-white/10">
                {mentorUser ? getInitials(mentorUser.name) : '…'}
              </div>
            )}
            {/* Edit overlay */}
            <button
              onClick={() => photoInputRef.current?.click()}
              disabled={photoUploading}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-wait"
              title="Change photo"
            >
              {photoUploading
                ? <span className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Camera className="size-5 text-white" />}
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-4xl text-white sm:text-5xl">
              WELCOME,{' '}
              <span className="gradient-text">
                {mentorUser?.name.split(' ')[0].toUpperCase() ?? 'MENTOR'}!
              </span>
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-tekton-teal/15 border border-tekton-teal/30 px-3 py-1 text-xs font-medium text-tekton-teal">
                {mentorUser?.track ?? '...'}
              </span>
              <span className="text-sm text-white/50">{mentorUser?.title ?? 'Mentor'}</span>
            </div>
            <p className="text-sm text-white/50">Here's how your mentees are progressing.</p>
          </div>
        </div>

        {/* Section 2 — Stats Row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Assigned Mentees */}
          <div className="glass-card rounded-xl p-5 flex flex-col gap-1">
            <p className="text-xs text-white/50 uppercase tracking-wider">Assigned Mentees</p>
            {mentorLoading ? (
              <div className="h-8 w-16 rounded bg-white/10 animate-pulse" />
            ) : (
              <p className="gradient-text font-heading text-3xl">{menteeCount}</p>
            )}
          </div>

          {/* Your Track */}
          <div className="glass-card rounded-xl p-5 flex flex-col gap-1">
            <p className="text-xs text-white/50 uppercase tracking-wider">Your Track</p>
            {mentorLoading ? (
              <div className="h-5 w-24 rounded bg-white/10 animate-pulse mt-1" />
            ) : (
              <p className="text-sm font-medium text-white leading-snug">{mentorUser?.track ?? '—'}</p>
            )}
          </div>

          {/* Avg. Progress */}
          <div className="glass-card rounded-xl p-5 flex flex-col gap-1">
            <p className="text-xs text-white/50 uppercase tracking-wider">Avg. Progress</p>
            {mentorLoading || assignmentsLoading ? (
              <div className="h-8 w-16 rounded bg-white/10 animate-pulse" />
            ) : (
              <>
                <p className="gradient-text font-heading text-3xl">{avgProgress}%</p>
                <Progress value={avgProgress} className="h-1.5 mt-2" />
              </>
            )}
          </div>

          {/* Program Duration */}
          <div className="glass-card rounded-xl p-5 flex flex-col gap-1">
            <p className="text-xs text-white/50 uppercase tracking-wider">Program Duration</p>
            <p className="gradient-text font-heading text-3xl">12</p>
            <p className="text-xs text-white/40">Weeks</p>
          </div>
        </div>

        {/* Section 3 — Assigned Mentees List */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-heading text-2xl text-white">YOUR MENTEES</h2>

            {/* Sort Controls */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-white/40 mr-1">Sort:</span>
              <button
                onClick={() => setSortBy('name')}
                className={cn(
                  'rounded-md border px-3 py-1 text-xs font-medium transition-colors',
                  sortBy === 'name'
                    ? 'border-tekton-purple-bright bg-tekton-purple-bright text-white'
                    : 'border-white/20 bg-transparent text-white/50 hover:text-white hover:border-white/40',
                )}
              >
                Name
              </button>
              <button
                onClick={() => setSortBy('progress')}
                className={cn(
                  'rounded-md border px-3 py-1 text-xs font-medium transition-colors',
                  sortBy === 'progress'
                    ? 'border-tekton-purple-bright bg-tekton-purple-bright text-white'
                    : 'border-white/20 bg-transparent text-white/50 hover:text-white hover:border-white/40',
                )}
              >
                Progress
              </button>
            </div>
          </div>

          {assignmentsLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-xl h-24 animate-pulse" />
              ))}
            </div>
          ) : assignments.length === 0 ? (
            <div className="glass-card rounded-xl p-8 flex flex-col items-center gap-3 text-center">
              <Users className="size-8 text-white/20" />
              <p className="text-sm text-white/50 max-w-sm">
                No mentees have been assigned to you yet. You'll be notified when mentees are assigned.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sortedAssignments.map((assignment) => {
                const mentee = assignment.mentee
                if (!mentee) return null

                const menteeOverallProgress = calculateProgress(
                  mentee.milestone1Completed + mentee.milestone2Completed + mentee.milestone3Completed,
                  48,
                )

                return (
                  <div
                    key={assignment.id}
                    className="glass-card rounded-xl p-5 flex flex-col gap-4 sm:flex-row sm:items-center smooth-hover hover:border-white/20 transition-all"
                  >
                    {/* Avatar */}
                    <div className="shrink-0">
                      {mentee.profilePhotoUrl ? (
                        <img
                          src={mentee.profilePhotoUrl}
                          alt={mentee.name}
                          className="size-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="size-12 rounded-full bg-gradient-to-br from-tekton-purple-bright to-tekton-purple-deep flex items-center justify-center text-white font-semibold">
                          {getInitials(mentee.name)}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-white text-sm">{mentee.name}</p>
                          <p className="text-xs text-white/40">{mentee.email}</p>
                        </div>
                        {/* Last active */}
                        <span className="text-xs text-white/30 shrink-0">
                          Updated {formatDate(mentee.updatedAt)}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="flex flex-col gap-1">
                        <Progress value={menteeOverallProgress} className="h-1.5" />
                        <div className="flex gap-3 text-xs text-white/40">
                          <span>M1: {mentee.milestone1Completed}/16</span>
                          <span>M2: {mentee.milestone2Completed}/16</span>
                          <span>M3: {mentee.milestone3Completed}/16</span>
                        </div>
                      </div>
                    </div>

                    {/* Message button */}
                    <Link
                      to={`/messages/${mentee.id}`}
                      className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-tekton-teal/30 bg-tekton-teal/10 px-3 py-1.5 text-xs font-medium text-tekton-teal smooth-hover hover:bg-tekton-teal/20 transition-colors"
                    >
                      <MessageSquare className="size-3.5" />
                      Message
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Section 4 — My Resources */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-heading text-2xl text-white">MY RESOURCES</h2>
            <Button
              size="sm"
              className="bg-tekton-teal/15 hover:bg-tekton-teal/25 text-tekton-teal border border-tekton-teal/30 text-xs"
              onClick={() => { setResourceForm({ title: '', url: '', taskId: '' }); setResourceErrors({}); setResourceLinkType('track'); setAddResourceOpen(true) }}
            >
              <Plus className="size-3.5 mr-1" />
              Add Resource
            </Button>
          </div>

          {resourcesLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[1, 2].map((i) => <div key={i} className="glass-card rounded-xl h-20 animate-pulse" />)}
            </div>
          ) : myResources.length === 0 ? (
            <div className="glass-card rounded-xl p-6 flex flex-col items-center gap-2 text-center">
              <p className="text-sm text-white/50">No resources yet. Add links to share with your mentees.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {myResources.map((r) => (
                <div key={r.id} className="glass-card rounded-xl p-4 flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{r.title}</p>
                    <span className="inline-flex w-fit items-center rounded-full bg-white/10 border border-white/10 px-2 py-0.5 text-[10px] text-white/50">
                      {r.taskId ? `Task: ${r.taskId}` : 'Track-level'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center size-7 rounded-md text-tekton-blue/60 hover:text-tekton-blue hover:bg-tekton-blue/10 transition-colors">
                      <ExternalLink className="size-3.5" />
                    </a>
                    <button
                      onClick={() => handleDeleteResource(r.id)}
                      className="inline-flex items-center justify-center size-7 rounded-md text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Resource Dialog */}
        <Dialog open={addResourceOpen} onOpenChange={(o) => { if (!o) setAddResourceOpen(false) }}>
          <DialogContent className="bg-black/95 border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Add Resource</DialogTitle>
              <DialogDescription className="text-white/50">
                Add a resource for your mentees. It will be tagged to your track automatically.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <div className="flex rounded-lg border border-white/10 overflow-hidden">
                <button
                  onClick={() => { setResourceLinkType('track'); setResourceForm((f) => ({ ...f, taskId: '' })); setResourceErrors({}) }}
                  className={cn('flex-1 px-3 py-2 text-xs font-medium transition-colors', resourceLinkType === 'track' ? 'bg-tekton-teal text-white' : 'text-white/50 hover:text-white')}
                >
                  Track-level
                </button>
                <button
                  onClick={() => { setResourceLinkType('task'); setResourceErrors({}) }}
                  className={cn('flex-1 px-3 py-2 text-xs font-medium transition-colors', resourceLinkType === 'task' ? 'bg-tekton-teal text-white' : 'text-white/50 hover:text-white')}
                >
                  Link to a task
                </button>
              </div>
              {resourceLinkType === 'task' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/50">Task <span className="text-red-400">*</span></label>
                  <Select
                    value={resourceForm.taskId}
                    onValueChange={(v) => { setResourceForm((f) => ({ ...f, taskId: v })); setResourceErrors((p) => ({ ...p, taskId: '' })) }}
                  >
                    <SelectTrigger className={`bg-white/5 border-white/20 text-white ${resourceErrors.taskId ? 'border-red-500/70' : ''}`}>
                      <SelectValue placeholder="Select a task…" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10 text-white max-h-64">
                      {taskTemplates.map((t) => (
                        <SelectItem key={t.taskId} value={t.taskId}>
                          {`[M${t.milestone} W${t.week}] ${t.title}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {resourceErrors.taskId && <p className="text-xs text-red-400">{resourceErrors.taskId}</p>}
                </div>
              )}
              {mentorUser?.track && (
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <span className="text-xs text-white/40">Track:</span>
                  <span className="text-xs font-medium text-tekton-teal">{mentorUser.track}</span>
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">Title <span className="text-red-400">*</span></label>
                <Input
                  value={resourceForm.title}
                  onChange={(e) => { setResourceForm((f) => ({ ...f, title: e.target.value })); setResourceErrors((p) => ({ ...p, title: '' })) }}
                  placeholder="e.g. React Hooks Guide"
                  className={`bg-white/5 border-white/20 text-white placeholder:text-white/30 ${resourceErrors.title ? 'border-red-500/70' : ''}`}
                />
                {resourceErrors.title && <p className="text-xs text-red-400">{resourceErrors.title}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/50">URL <span className="text-red-400">*</span></label>
                <Input
                  value={resourceForm.url}
                  onChange={(e) => { setResourceForm((f) => ({ ...f, url: e.target.value })); setResourceErrors((p) => ({ ...p, url: '' })) }}
                  placeholder="https://..."
                  className={`bg-white/5 border-white/20 text-white placeholder:text-white/30 ${resourceErrors.url ? 'border-red-500/70' : ''}`}
                />
                {resourceErrors.url && <p className="text-xs text-red-400">{resourceErrors.url}</p>}
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <Button variant="outline" className="border-white/20 text-white/70" onClick={() => setAddResourceOpen(false)}>Cancel</Button>
              <Button className="bg-tekton-teal text-white hover:bg-tekton-teal/90" onClick={handleAddResource}>Add Resource</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Section 5 — Quick Actions */}
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
          </div>
        </div>

        {/* Section 6 — Mentor Tips (collapsible) */}
        <div className="glass-card rounded-xl overflow-hidden">
          <button
            onClick={() => setTipsOpen((o) => !o)}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-tekton-yellow" />
              <span className="text-sm font-semibold text-white">Mentor Tips</span>
            </div>
            <ChevronDown
              className={cn('size-4 text-white/40 transition-transform', tipsOpen && 'rotate-180')}
            />
          </button>

          {tipsOpen && (
            <div className="border-t border-white/10 px-5 py-4">
              <ul className="flex flex-col gap-2.5 text-sm text-white/60">
                <li className="flex items-start gap-2">
                  <span className="text-tekton-teal shrink-0">•</span> Recommended time commitment: 2–3
                  hours per week
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tekton-teal shrink-0">•</span> Share relevant resources with
                  mentees via the roadmap
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tekton-teal shrink-0">•</span> Provide constructive, specific
                  feedback on tasks
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tekton-teal shrink-0">•</span> Check in weekly — even a short
                  message goes a long way
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Section 7 — Program Timeline */}
        <div className="glass-card rounded-xl p-5 flex flex-col gap-4">
          <h2 className="font-heading text-2xl text-white">PROGRAM TIMELINE</h2>
          <div className="flex gap-1">
            {Array.from({ length: 12 }, (_, i) => {
              const week = i + 1
              const isCurrent = week === currentWeek
              const milestoneColor =
                week <= 4 ? 'bg-tekton-purple-bright' : week <= 8 ? 'bg-tekton-teal' : 'bg-tekton-yellow'
              const isCompleted = currentWeek !== null && week < currentWeek
              return (
                <div key={week} className="flex flex-col items-center gap-1 flex-1">
                  {isCurrent ? (
                    <span className="text-[10px] text-white whitespace-nowrap">Wk {week}</span>
                  ) : (
                    <span className="text-[10px] text-transparent">.</span>
                  )}
                  <div
                    className={cn(
                      'h-6 w-full rounded-sm transition-all',
                      isCompleted
                        ? milestoneColor + ' opacity-100'
                        : isCurrent
                          ? milestoneColor + ' ring-2 ring-white ring-offset-1 ring-offset-black'
                          : 'bg-white/10',
                    )}
                  />
                  {(week === 1 || week === 5 || week === 9 || week === 12) && (
                    <span className="text-[9px] text-white/30">
                      M{week <= 4 ? 1 : week <= 8 ? 2 : 3}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2.5 rounded-sm bg-tekton-purple-bright" /> Milestone 1
              (Wks 1–4)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2.5 rounded-sm bg-tekton-teal" /> Milestone 2 (Wks
              5–8)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2.5 rounded-sm bg-tekton-yellow" /> Milestone 3 (Wks
              9–12)
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
