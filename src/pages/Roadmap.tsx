import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, CheckCircle2, Circle, ExternalLink, Info, Lock } from 'lucide-react'

import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { cn, calculateProgress } from '@/lib/utils'
import resourceService from '@/services/resourceService'
import taskService from '@/services/taskService'
import type { Task, User } from '@/types'

// ─── ResourcesButton ─────────────────────────────────────────────────────────

function ResourcesButton({ taskId }: { taskId: string }) {
  const [open, setOpen] = useState(false)
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['resources', taskId],
    queryFn: () => resourceService.getByTaskId(taskId),
    enabled: open,
  })

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md border border-white/15 px-2.5 py-1 text-xs text-white/50 transition-colors hover:border-white/30 hover:text-white"
      >
        <ExternalLink className="size-3" />
        Resources
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-56 rounded-lg border border-white/10 bg-black/95 p-3 shadow-xl right-0">
          {isLoading && <div className="h-3 w-full rounded bg-white/10 animate-pulse" />}
          {!isLoading && resources.length === 0 && (
            <p className="text-xs text-white/40">No resources for this task.</p>
          )}
          {resources.map((r) => (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-1.5 text-xs text-tekton-blue hover:text-tekton-blue/80 truncate"
            >
              <ExternalLink className="size-3 shrink-0" />
              {r.title}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── TaskSkeleton ─────────────────────────────────────────────────────────────

function TaskSkeleton() {
  return (
    <div className="glass-card rounded-xl p-5 flex items-start gap-4 animate-pulse">
      <div className="size-5 rounded-full bg-white/10 shrink-0 mt-0.5" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-4 w-2/3 rounded bg-white/10" />
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-4/5 rounded bg-white/10" />
      </div>
    </div>
  )
}

// ─── Milestone tab config ─────────────────────────────────────────────────────

const MILESTONE_TABS = [
  { id: 1 as const, label: 'Milestone 1', sublabel: 'Foundations' },
  { id: 2 as const, label: 'Milestone 2', sublabel: 'Building' },
  { id: 3 as const, label: 'Milestone 3', sublabel: 'Advanced' },
]

// ─── Roadmap page ─────────────────────────────────────────────────────────────

export default function Roadmap() {
  const { milestoneId } = useParams<{ milestoneId: string }>()
  const activeMilestone = Number(milestoneId ?? '1') as 1 | 2 | 3
  const navigate = useNavigate()
  const { user: rawUser } = useAuth()
  const user = rawUser as User | null
  const isReadOnly = user?.role === 'mentor'
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ['task-templates', activeMilestone],
    queryFn: () => taskService.getTemplates(activeMilestone),
  })

  const { data: myTasks = [], isLoading: myTasksLoading } = useQuery({
    queryKey: ['my-tasks'],
    queryFn: taskService.getMyTasks,
    enabled: !isReadOnly,
  })

  // Map personal task copies by their taskId for quick lookup
  const myTaskMap = new Map(myTasks.map((t) => [t.taskId, t]))

  // Per-milestone completion counts (used for locking)
  const milestone1Completed = isReadOnly ? 16 : myTasks.filter((t) => t.milestone === 1 && t.completed).length
  const milestone2Completed = isReadOnly ? 16 : myTasks.filter((t) => t.milestone === 2 && t.completed).length
  const m2Locked = milestone1Completed < 16
  const m3Locked = milestone2Completed < 16

  // Redirect to M1 if a locked milestone is accessed directly
  useEffect(() => {
    if (!isReadOnly && !myTasksLoading) {
      if ((activeMilestone === 2 && m2Locked) || (activeMilestone === 3 && (m2Locked || m3Locked))) {
        navigate('/roadmap/1', { replace: true })
      }
    }
  }, [activeMilestone, m2Locked, m3Locked, isReadOnly, myTasksLoading, navigate])

  // Completed count for current milestone
  const completedCount = isReadOnly
    ? 0
    : myTasks.filter((t) => t.milestone === activeMilestone && t.completed).length
  const totalCount = templates.length
  const milestoneProgress = calculateProgress(completedCount, totalCount)

  // Group templates by week
  const tasksByWeek = templates.reduce<Record<number, Task[]>>((acc, task) => {
    ;(acc[task.week] ??= []).push(task)
    return acc
  }, {})
  const weeks = Object.keys(tasksByWeek)
    .map(Number)
    .sort((a, b) => a - b)

  async function handleToggleTask(template: Task) {
    const personal = myTaskMap.get(template.taskId)
    const newCompleted = personal ? !personal.completed : true

    // Optimistic update
    queryClient.setQueryData<Task[]>(['my-tasks'], (old = []) => {
      if (personal) {
        return old.map((t) => (t.id === personal.id ? { ...t, completed: newCompleted } : t))
      }
      return [...old, { ...template, id: 'temp', completed: true }]
    })

    try {
      if (personal) {
        await taskService.updateTask(personal.id, { completed: newCompleted })
      } else {
        await taskService.createPersonalCopy({
          taskId: template.taskId,
          milestone: template.milestone,
          week: template.week,
          title: template.title,
          description: template.description,
          completed: true,
        })
      }
      await queryClient.invalidateQueries({ queryKey: ['my-tasks'] })
      await queryClient.invalidateQueries({ queryKey: ['me'] })
      toast.success(newCompleted ? 'Task completed! 🎉' : 'Task marked incomplete')
    } catch {
      // Revert optimistic update
      await queryClient.invalidateQueries({ queryKey: ['my-tasks'] })
      toast.error('Failed to update task. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4">
      <div className="mx-auto max-w-4xl flex flex-col gap-8">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 w-fit text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        {/* Page heading */}
        <div>
          <h1 className="font-heading text-4xl text-white sm:text-5xl">
            LEARNING <span className="gradient-text">ROADMAP</span>
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Track your progress through the 12-week program
          </p>
        </div>

        {/* Milestone tabs */}
        <div>
          <div className="flex border-b border-white/10">
            {MILESTONE_TABS.map((tab) => {
              const isLocked = (tab.id === 2 && m2Locked) || (tab.id === 3 && m3Locked)
              return (
                <button
                  key={tab.id}
                  onClick={() => !isLocked && navigate(`/roadmap/${tab.id}`)}
                  disabled={isLocked}
                  title={isLocked ? `Complete Milestone ${tab.id - 1} first` : undefined}
                  className={cn(
                    'flex flex-col items-start px-5 py-3 text-sm transition-colors border-b-2 -mb-px',
                    isLocked
                      ? 'border-transparent text-white/20 cursor-not-allowed'
                      : activeMilestone === tab.id
                        ? 'border-tekton-purple-bright text-white'
                        : 'border-transparent text-white/40 hover:text-white',
                  )}
                >
                  <span className="flex items-center gap-1.5 font-semibold">
                    {tab.label}
                    {isLocked && <Lock className="size-3 opacity-60" />}
                  </span>
                  <span className="text-xs opacity-70">{tab.sublabel}</span>
                </button>
              )
            })}
          </div>

          {/* Progress bar row */}
          <div className="mt-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>
                {completedCount} of {totalCount} tasks completed
              </span>
              <span>{milestoneProgress}%</span>
            </div>
            <Progress value={milestoneProgress} className="h-2" />
          </div>
        </div>

        {/* Read-only banner (mentor only) */}
        {isReadOnly && (
          <div className="flex items-center gap-3 rounded-lg border border-tekton-yellow/30 bg-tekton-yellow/10 px-4 py-3 text-sm text-tekton-yellow">
            <Info className="size-4 shrink-0" /> This is a read-only view of the learning roadmap.
          </div>
        )}

        {/* Task list by week */}
        {templatesLoading || (!isReadOnly && myTasksLoading) ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <TaskSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {weeks.map((week) => (
              <div key={week}>
                <div className="mb-3 flex items-center gap-3">
                  <h3 className="font-heading text-xl text-white">WEEK {week}</h3>
                  <span className="text-sm text-white/40">
                    {tasksByWeek[week].filter((t) => myTaskMap.get(t.taskId)?.completed).length} /{' '}
                    {tasksByWeek[week].length} done
                  </span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <div className="flex flex-col gap-3">
                  {tasksByWeek[week].map((template) => {
                    const personal = myTaskMap.get(template.taskId)
                    const isChecked = personal?.completed ?? false

                    return (
                      <div key={template.taskId} className="relative">
                        <div
                          className={cn(
                            'glass-card rounded-xl p-5 flex items-start gap-4 transition-all',
                            isChecked && !isReadOnly && 'border-tekton-green/30 bg-tekton-green/5',
                          )}
                        >
                          {/* Checkbox (mentees only) */}
                          {!isReadOnly && (
                            <button
                              onClick={() => handleToggleTask(template)}
                              className="mt-0.5 shrink-0"
                              aria-label={isChecked ? 'Mark incomplete' : 'Mark complete'}
                            >
                              {isChecked ? (
                                <CheckCircle2 className="size-5 text-tekton-green" />
                              ) : (
                                <Circle className="size-5 text-white/30 hover:text-white/60 transition-colors" />
                              )}
                            </button>
                          )}

                          {/* Task content */}
                          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                            <p
                              className={cn(
                                'text-sm font-semibold leading-snug',
                                isChecked && !isReadOnly
                                  ? 'text-white/50 line-through'
                                  : 'text-white',
                              )}
                            >
                              {template.title}
                            </p>
                            <p className="text-xs text-white/50 leading-relaxed">
                              {template.description}
                            </p>
                          </div>

                          {/* Resources button */}
                          <ResourcesButton taskId={template.taskId} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
