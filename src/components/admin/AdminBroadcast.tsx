import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { marked } from 'marked'
import { Send, Eye, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import adminService from '@/services/adminService'
import cohortService from '@/services/cohortService'
import { useToast } from '@/hooks/useToast'
import { TECH_TRACKS } from '@/types'
import type { BroadcastRole } from '@/services/adminService'

const ROLE_OPTIONS: { value: BroadcastRole; label: string; description: string }[] = [
  { value: 'mentee', label: 'Mentees', description: 'Active enrolled and applicant mentees' },
  { value: 'mentor', label: 'Mentors', description: 'Active approved mentors' },
  { value: 'admin', label: 'Admins', description: 'All admins' },
]

export default function AdminBroadcast() {
  const { toast } = useToast()

  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [roles, setRoles] = useState<BroadcastRole[]>([])
  const [tracks, setTracks] = useState<string[]>([])
  const [cohortIds, setCohortIds] = useState<string[]>([])
  const [previewCount, setPreviewCount] = useState<number | null>(null)
  const [previewing, setPreviewing] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [sending, setSending] = useState(false)

  const { data: cohorts = [] } = useQuery({
    queryKey: ['cohorts'],
    queryFn: cohortService.getAll,
  })

  // Reset preview count when filters change
  useEffect(() => { setPreviewCount(null) }, [roles, tracks, cohortIds])

  const renderedBody = useMemo(() => {
    try {
      return marked.parse(body || '_Your message will appear here…_', { breaks: true, async: false }) as string
    } catch {
      return ''
    }
  }, [body])

  function toggleRole(role: BroadcastRole) {
    setRoles((prev) => prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role])
  }

  function toggleTrack(track: string) {
    setTracks((prev) => prev.includes(track) ? prev.filter((t) => t !== track) : [...prev, track])
  }

  function toggleCohort(cohortId: string) {
    setCohortIds((prev) => prev.includes(cohortId) ? prev.filter((c) => c !== cohortId) : [...prev, cohortId])
  }

  const cohortFilterEnabled = roles.includes('mentee')

  function getValidationError(): string | null {
    if (!subject.trim()) return 'Subject is required.'
    if (!body.trim()) return 'Message body is required.'
    if (roles.length === 0) return 'Select at least one recipient group.'
    return null
  }

  async function handlePreview() {
    const err = getValidationError()
    if (err) { toast.error(err); return }
    setPreviewing(true)
    try {
      const res = await adminService.previewBroadcast({
        subject,
        body,
        roles,
        tracks: tracks.length ? tracks : undefined,
        cohortIds: cohortFilterEnabled && cohortIds.length ? cohortIds : undefined,
      })
      setPreviewCount(res.count)
    } catch {
      toast.error('Failed to preview recipient count.')
    } finally {
      setPreviewing(false)
    }
  }

  async function handleConfirmSend() {
    setSending(true)
    try {
      const res = await adminService.sendBroadcast({
        subject,
        body,
        roles,
        tracks: tracks.length ? tracks : undefined,
        cohortIds: cohortFilterEnabled && cohortIds.length ? cohortIds : undefined,
      })
      if (res.failed === 0) {
        toast.success(`Broadcast sent to ${res.sent} recipient${res.sent === 1 ? '' : 's'}.`)
      } else {
        toast.success(`Sent ${res.sent}, ${res.failed} failed.`)
      }
      setConfirmOpen(false)
      setSubject('')
      setBody('')
      setRoles([])
      setTracks([])
      setCohortIds([])
      setPreviewCount(null)
    } catch {
      toast.error('Broadcast failed.')
    } finally {
      setSending(false)
    }
  }

  function openConfirm() {
    const err = getValidationError()
    if (err) { toast.error(err); return }
    if (previewCount === null) { toast.error('Please preview the recipient count first.'); return }
    if (previewCount === 0) { toast.error('No recipients match these filters.'); return }
    setConfirmOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-heading text-white">Broadcast Email</h3>
        <p className="text-xs text-white/40">
          Send an email blast to selected groups. Suspended users, alumni, graduated mentees, and inactive invited accounts are excluded automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT: form */}
        <div className="flex flex-col gap-5">

          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-white/60">Subject</Label>
            <Input
              value={subject}
              maxLength={200}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Important update on Cohort 5 schedule"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
            />
          </div>

          {/* Body */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-white/60">
              Message <span className="text-white/30">(Markdown supported — **bold**, *italic*, [links](url), - lists)</span>
            </Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              placeholder={`Hi everyone,\n\nWe wanted to share an important update...\n\n- Point one\n- Point two\n\nThanks,\nTektonX Team`}
              className="bg-white/5 border-white/20 text-white placeholder:text-white/30 font-mono text-sm"
            />
          </div>

          {/* Roles */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-white/60">Recipients</Label>
            <div className="flex flex-col gap-2">
              {ROLE_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-start gap-2.5 cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 hover:border-white/20">
                  <Checkbox
                    checked={roles.includes(opt.value)}
                    onCheckedChange={() => toggleRole(opt.value)}
                    className="mt-0.5"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-medium">{opt.label}</span>
                    <span className="text-xs text-white/40">{opt.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Track filter */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-white/60">
              Filter by track <span className="text-white/30">(optional — leave empty for all)</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {TECH_TRACKS.map((track) => {
                const active = tracks.includes(track)
                return (
                  <button
                    key={track}
                    type="button"
                    onClick={() => toggleTrack(track)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      active
                        ? 'bg-tekton-purple-bright border-tekton-purple-bright text-white'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30'
                    }`}
                  >
                    {track}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Cohort filter (only if mentee selected) */}
          {cohortFilterEnabled && cohorts.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-white/60">
                Filter by cohort <span className="text-white/30">(optional — applies to mentees only)</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {cohorts.map((c) => {
                  const active = cohortIds.includes(c.id)
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCohort(c.id)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        active
                          ? 'bg-tekton-teal border-tekton-teal text-white'
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {c.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Action row */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
            <Button
              variant="outline"
              disabled={previewing}
              onClick={handlePreview}
              className="border-white/20 text-white/80 hover:bg-white/10"
            >
              <Eye className="size-4 mr-1.5" />
              {previewing ? 'Counting…' : 'Preview Recipients'}
            </Button>
            {previewCount !== null && (
              <span className="text-sm text-white/70">
                <span className="text-white font-semibold">{previewCount}</span> recipient{previewCount === 1 ? '' : 's'} match
              </span>
            )}
            <div className="ml-auto">
              <Button
                onClick={openConfirm}
                disabled={previewCount === null || previewCount === 0}
                className="bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90 disabled:opacity-40"
              >
                <Send className="size-4 mr-1.5" />
                Send Broadcast
              </Button>
            </div>
          </div>

        </div>

        {/* RIGHT: live preview */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-white/60">Live preview</Label>
          <div className="rounded-lg border border-white/10 bg-zinc-900 overflow-hidden">
            <div className="bg-zinc-950 border-b border-white/10 px-4 py-2.5">
              <p className="text-[11px] uppercase text-white/30 tracking-wider">Subject</p>
              <p className="text-sm text-white truncate">{subject || 'No subject'}</p>
            </div>
            <div className="bg-white text-zinc-900 p-6 max-h-[500px] overflow-y-auto">
              <p className="text-sm text-zinc-500 mb-3">Hi <span className="text-zinc-900 font-medium">[recipient name]</span>,</p>
              <div
                className="broadcast-preview text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderedBody }}
              />
            </div>
          </div>
          <p className="text-[11px] text-white/30">
            Recipients receive this rendered inside the TektonX email template (with logo and footer).
          </p>
        </div>

      </div>

      {/* Confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={(o) => !o && !sending && setConfirmOpen(false)}>
        <DialogContent className="bg-black/95 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-tekton-yellow" />
              Confirm Broadcast
            </DialogTitle>
            <DialogDescription className="text-white/60">
              This will send an email to <span className="text-white font-semibold">{previewCount}</span> recipient{previewCount === 1 ? '' : 's'}. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/60">
            <p><span className="text-white/40">Subject:</span> <span className="text-white">{subject}</span></p>
            <p className="mt-1"><span className="text-white/40">To:</span> <span className="text-white">{roles.join(', ')}</span></p>
            {tracks.length > 0 && <p className="mt-1"><span className="text-white/40">Tracks:</span> <span className="text-white">{tracks.join(', ')}</span></p>}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" disabled={sending} onClick={() => setConfirmOpen(false)} className="border-white/20 text-white/70">
              Cancel
            </Button>
            <Button disabled={sending} onClick={handleConfirmSend} className="bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90">
              {sending ? 'Sending…' : `Send to ${previewCount}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
