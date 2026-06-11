import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import adminService from '@/services/adminService'
import { useToast } from '@/hooks/useToast'
import { formatDate, getInitials } from '@/lib/utils'
import type { User } from '@/types'
import UserProfileDrawer from './UserProfileDrawer'

export default function AdminPendingMentors() {
  const { toast } = useToast()

  const [rejectTarget, setRejectTarget] = useState<User | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [profileTarget, setProfileTarget] = useState<User | null>(null)

  const { data: pendingMentors = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-pending-mentors'],
    queryFn: adminService.getPendingMentors,
  })

  async function handleApprove(mentorId: string) {
    setApprovingId(mentorId)
    try {
      await adminService.approveMentor(mentorId)
      toast.success('Mentor approved! They will receive an email notification.')
      await refetch()
    } catch {
      toast.error('Failed to approve mentor.')
    } finally {
      setApprovingId(null)
    }
  }

  async function handleReject() {
    if (!rejectTarget) return
    setRejectingId(rejectTarget.id)
    try {
      await adminService.rejectMentor(rejectTarget.id, rejectReason || undefined)
      toast.success(`${rejectTarget.name}'s application has been rejected.`)
      setRejectTarget(null)
      setRejectReason('')
      await refetch()
    } catch {
      toast.error('Failed to reject mentor.')
    } finally {
      setRejectingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-5 h-32 animate-pulse bg-white/5" />
        ))}
      </div>
    )
  }

  if (pendingMentors.length === 0) {
    return (
      <div className="glass-card rounded-xl p-12 flex flex-col items-center gap-3 text-center">
        <CheckCircle className="size-10 text-tekton-green" />
        <p className="font-heading text-xl text-white">ALL CAUGHT UP!</p>
        <p className="text-sm text-white/50">No pending mentor applications.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/50">
          <span className="font-medium text-tekton-yellow">{pendingMentors.length}</span> application{pendingMentors.length !== 1 ? 's' : ''} awaiting review
        </p>
      </div>

      {pendingMentors.map((mentor) => (
        <div
          key={mentor.id}
          className="glass-card rounded-xl p-5 flex flex-col gap-4 md:flex-row md:items-start cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setProfileTarget(mentor)}
        >

          {/* Left: Avatar + name + email */}
          <div className="flex items-start gap-3 md:w-48 shrink-0">
            <div className="size-10 rounded-full bg-gradient-to-br from-tekton-purple-bright to-tekton-teal flex items-center justify-center text-white text-sm font-bold shrink-0">
              {getInitials(mentor.name)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white">{mentor.name}</span>
              <span className="text-xs text-white/40 truncate">{mentor.email}</span>
            </div>
          </div>

          {/* Center: Details */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            {/* Track badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-tekton-purple-bright/15 border border-tekton-purple-bright/30 px-2 py-0.5 text-[10px] font-medium text-tekton-purple-bright">
                {mentor.track}
              </span>
              {mentor.experienceYears !== undefined && (
                <span className="text-xs text-white/40">
                  {mentor.experienceYears} yr{mentor.experienceYears !== 1 ? 's' : ''} experience
                </span>
              )}
            </div>

            {/* Bio */}
            {mentor.bio && (
              <p className="text-sm text-white/70 leading-relaxed">{mentor.bio}</p>
            )}

            {/* LinkedIn + Applied date */}
            <div className="flex flex-wrap items-center gap-4 mt-1">
              {mentor.linkedinUrl && (
                <a
                  href={mentor.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-xs text-tekton-blue hover:text-tekton-blue/80 transition-colors"
                >
                  <ExternalLink className="size-3" />
                  LinkedIn
                </a>
              )}
              <span className="text-xs text-white/30">
                Applied {formatDate(mentor.createdAt)}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-stretch gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              className="bg-tekton-green/15 hover:bg-tekton-green/25 text-tekton-green border border-tekton-green/30 flex items-center gap-1.5"
              disabled={approvingId === mentor.id}
              onClick={() => handleApprove(mentor.id)}
            >
              <CheckCircle className="size-3.5" />
              {approvingId === mentor.id ? 'Approving...' : 'Approve'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400 flex items-center gap-1.5"
              onClick={() => {
                setRejectTarget(mentor)
                setRejectReason('')
              }}
            >
              <XCircle className="size-3.5" />
              Reject
            </Button>
          </div>

        </div>
      ))}

      {/* Reject Dialog */}
      <Dialog open={!!rejectTarget} onOpenChange={(o) => { if (!o) { setRejectTarget(null); setRejectReason('') } }}>
        <DialogContent className="bg-black/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Reject Application — {rejectTarget?.name}</DialogTitle>
            <DialogDescription className="text-white/50">
              Optionally provide a reason for rejection. The applicant will be notified.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection (optional)..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
            className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
          />
          <div className="flex gap-2 justify-end mt-2">
            <Button
              variant="outline"
              className="border-white/20 text-white/70"
              onClick={() => { setRejectTarget(null); setRejectReason('') }}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={rejectingId === rejectTarget?.id}
              onClick={handleReject}
            >
              {rejectingId === rejectTarget?.id ? 'Rejecting...' : 'Reject'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UserProfileDrawer user={profileTarget} onClose={() => setProfileTarget(null)} />

    </div>
  )
}
