import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Send, Eye, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
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
  DialogFooter,
} from '@/components/ui/dialog'
import adminService, { type DigestRunResult } from '@/services/adminService'
import { useToast } from '@/hooks/useToast'
import { TECH_TRACKS } from '@/types'

const WEEKS = Array.from({ length: 12 }, (_, i) => i + 1)

export default function AdminWeeklyDigest() {
  const { toast } = useToast()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [previewRole, setPreviewRole] = useState<'mentee' | 'mentor'>('mentee')
  const [previewWeek, setPreviewWeek] = useState<number>(1)
  const [previewTrack, setPreviewTrack] = useState<string>(TECH_TRACKS[0])
  const [previewData, setPreviewData] = useState<any>(null)
  const [lastRun, setLastRun] = useState<DigestRunResult | null>(null)

  const runMutation = useMutation({
    mutationFn: () => adminService.runWeeklyDigest(),
    onSuccess: (data) => {
      setLastRun(data)
      setConfirmOpen(false)
      if (data.week === null) {
        toast.error('Cohort has not started or has already ended.')
      } else {
        toast.success(`Week ${data.week} digest sent — ${data.menteesSent} mentees, ${data.mentorsSent} mentors`)
      }
    },
    onError: () => {
      toast.error('Failed to run weekly digest.')
      setConfirmOpen(false)
    },
  })

  const previewMutation = useMutation({
    mutationFn: async () => {
      if (previewRole === 'mentee') {
        return adminService.previewDigestMentee(previewTrack, previewWeek)
      }
      return adminService.previewDigestMentor(previewWeek, [previewTrack])
    },
    onSuccess: (data) => setPreviewData(data),
    onError: () => toast.error('Failed to load preview.'),
  })

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-heading text-white">Weekly Digest</h3>
        <p className="text-xs text-white/40">
          Auto-sends every Monday at 9:00 AM WAT. Each mentee gets their track's week content; each mentor gets a brief on what their mentees are working on.
        </p>
      </div>

      {/* Run now */}
      <div className="glass-card rounded-xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-tekton-purple-bright" />
          <p className="text-sm text-white font-medium">Run digest for the current week now</p>
        </div>
        <p className="text-xs text-white/50">
          Uses the cohort start date to figure out which week we're in. Sends to all enrolled mentees and active mentors. Same as the Monday cron, just on demand.
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-1">
          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={runMutation.isPending}
            className="bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90"
          >
            <Send className="size-4 mr-1.5" />
            {runMutation.isPending ? 'Sending…' : 'Run Now'}
          </Button>
          {lastRun && (
            <div className="flex items-center gap-2 text-xs">
              {lastRun.menteesFailed === 0 && lastRun.mentorsFailed === 0 ? (
                <CheckCircle className="size-4 text-tekton-green" />
              ) : (
                <AlertTriangle className="size-4 text-tekton-yellow" />
              )}
              <span className="text-white/70">
                Last run: Week {lastRun.week ?? '—'} • {lastRun.menteesSent} mentees, {lastRun.mentorsSent} mentors
                {(lastRun.menteesFailed > 0 || lastRun.mentorsFailed > 0) && (
                  <span className="text-tekton-yellow"> • {lastRun.menteesFailed + lastRun.mentorsFailed} failed</span>
                )}
              </span>
            </div>
          )}
        </div>
        {lastRun && lastRun.skipped.length > 0 && (
          <details className="text-xs text-white/40 mt-1">
            <summary className="cursor-pointer hover:text-white/70">{lastRun.skipped.length} skipped</summary>
            <ul className="mt-2 space-y-1 pl-3">
              {lastRun.skipped.map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </details>
        )}
      </div>

      {/* Preview */}
      <div className="glass-card rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Eye className="size-4 text-tekton-teal" />
          <p className="text-sm text-white font-medium">Preview what an email looks like</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-white/60">Role</Label>
            <Select value={previewRole} onValueChange={(v) => setPreviewRole(v as 'mentee' | 'mentor')}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/10 text-white">
                <SelectItem value="mentee">Mentee</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-white/60">Track</Label>
            <Select value={previewTrack} onValueChange={setPreviewTrack}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/10 text-white">
                {TECH_TRACKS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-white/60">Week</Label>
            <Select value={String(previewWeek)} onValueChange={(v) => setPreviewWeek(Number(v))}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/10 text-white">
                {WEEKS.map((w) => <SelectItem key={w} value={String(w)}>Week {w}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => previewMutation.mutate()}
          disabled={previewMutation.isPending}
          className="border-white/20 text-white/80 hover:bg-white/10 self-start"
        >
          <Eye className="size-4 mr-1.5" />
          {previewMutation.isPending ? 'Loading…' : 'Load Preview'}
        </Button>

        {previewData && (
          <div className="rounded-lg border border-white/10 bg-zinc-950 p-4 mt-2">
            <p className="text-[11px] text-white/40 uppercase mb-2">Preview data — this is what gets passed into the email template</p>
            <pre className="text-xs text-white/80 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">{JSON.stringify(previewData, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Confirm */}
      <Dialog open={confirmOpen} onOpenChange={(o) => !o && !runMutation.isPending && setConfirmOpen(false)}>
        <DialogContent className="bg-black/95 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-tekton-yellow" />
              Send Weekly Digest?
            </DialogTitle>
            <DialogDescription className="text-white/60">
              This will send weekly digest emails to all enrolled mentees and active mentors based on the current cohort week. Each recipient gets their track-specific content.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" disabled={runMutation.isPending} onClick={() => setConfirmOpen(false)} className="border-white/20 text-white/70">
              Cancel
            </Button>
            <Button disabled={runMutation.isPending} onClick={() => runMutation.mutate()} className="bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90">
              {runMutation.isPending ? 'Sending…' : 'Send Now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
