import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Camera, Eye, EyeOff, KeyRound, LogOut, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import userService from '@/services/userService'
import api from '@/lib/api'
import { getInitials } from '@/lib/utils'
import type { EmailNotificationPreferences, User } from '@/types'

// ─── Custom Toggle Switch ─────────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-tekton-purple-bright disabled:opacity-50 disabled:cursor-not-allowed ${
        checked ? 'bg-tekton-purple-bright' : 'bg-white/20'
      }`}
    >
      <span
        className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-lg transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-xl p-6 flex flex-col gap-5">
      <h2 className="font-heading text-xl text-white">{title}</h2>
      {children}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Profile() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: userService.getMe,
  })

  // ── Photo upload ──
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [photoUploading, setPhotoUploading] = useState(false)

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

  // ── Form state ──
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [bio, setBio] = useState('')
  const [experienceYears, setExperienceYears] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setWhatsapp(user.whatsapp ?? '')
      setBio(user.bio ?? '')
      setExperienceYears(user.experienceYears !== undefined ? String(user.experienceYears) : '')
      setLinkedinUrl(user.linkedinUrl ?? '')
    }
  }, [user])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Full name is required.')
      return
    }
    setSaving(true)
    try {
      const payload: Partial<User> = { name, whatsapp: whatsapp || undefined }
      if (user?.role === 'mentor') {
        payload.bio = bio || undefined
        payload.experienceYears = experienceYears ? Number(experienceYears) : undefined
        payload.linkedinUrl = linkedinUrl || undefined
      }
      await userService.updateMe(payload)
      queryClient.invalidateQueries({ queryKey: ['me'] })
      toast.success('Profile updated successfully.')
    } catch {
      toast.error('Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  // ── Notification prefs ──
  const [togglingPref, setTogglingPref] = useState<keyof EmailNotificationPreferences | null>(null)

  async function handleTogglePref(key: keyof EmailNotificationPreferences, value: boolean) {
    if (!user) return
    setTogglingPref(key)
    try {
      await userService.updateNotificationPreferences({ ...user.emailNotifications, [key]: value })
      queryClient.invalidateQueries({ queryKey: ['me'] })
    } catch {
      toast.error('Failed to update notification preferences.')
    } finally {
      setTogglingPref(null)
    }
  }

  // ── Change password dialog ──
  const [pwDialogOpen, setPwDialogOpen] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [changingPw, setChangingPw] = useState(false)

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPw !== confirmPw) {
      toast.error('New passwords do not match.')
      return
    }
    if (newPw.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }
    setChangingPw(true)
    try {
      await api.put('/auth/change-password', { currentPassword: currentPw, newPassword: newPw })
      toast.success('Password changed successfully.')
      setPwDialogOpen(false)
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    } catch {
      toast.error('Failed to change password. Check your current password and try again.')
    } finally {
      setChangingPw(false)
    }
  }

  // ── Delete account dialog ──
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDeleteAccount() {
    setDeleting(true)
    try {
      await api.delete('/auth/account')
      localStorage.clear()
      window.location.href = '/'
    } catch {
      toast.error('Failed to delete account. Please contact support.')
      setDeleting(false)
    }
  }

  // ── Render ──
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16 px-4">
        <div className="mx-auto max-w-2xl flex flex-col gap-6 animate-pulse">
          <div className="h-8 w-48 rounded bg-white/10" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    )
  }

  const isMentor = user.role === 'mentor'
  const isMentee = user.role === 'mentee'
  const roleBadgeColor = user.role === 'admin'
    ? 'bg-tekton-purple-bright/15 border-tekton-purple-bright/30 text-tekton-purple-bright'
    : user.role === 'mentor'
    ? 'bg-tekton-teal/15 border-tekton-teal/30 text-tekton-teal'
    : 'bg-tekton-blue/15 border-tekton-blue/30 text-tekton-blue'

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4">
      <div className="mx-auto max-w-2xl flex flex-col gap-6">

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
            MY <span className="gradient-text">PROFILE</span>
          </h1>
        </div>

        {/* ── Section 1: Header ── */}
        <div className="glass-card rounded-xl p-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-5">
          {/* Avatar with edit overlay */}
          <div className="relative shrink-0 group">
            {user.profilePhotoUrl ? (
              <img
                src={user.profilePhotoUrl}
                alt={user.name}
                className="size-20 rounded-full object-cover ring-2 ring-white/10"
              />
            ) : (
              <div className="size-20 rounded-full bg-gradient-to-br from-tekton-purple-bright to-tekton-purple-deep flex items-center justify-center text-white text-2xl font-semibold">
                {getInitials(user.name)}
              </div>
            )}
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              disabled={photoUploading}
              title="Change photo"
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-wait"
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

          {/* Info */}
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <p className="font-heading text-2xl text-white">{user.name}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${roleBadgeColor}`}>
                {user.role}
              </span>
              {user.track && (
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/60">
                  {user.track}
                </span>
              )}
            </div>
            <p className="text-xs text-white/40">
              Member since {format(new Date(user.createdAt), 'MMMM yyyy')}
            </p>
          </div>
        </div>

        {/* ── Section 2: Personal Information ── */}
        <Section title="PERSONAL INFORMATION">
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-white/60 text-xs">Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-tekton-purple-bright"
              />
            </div>

            {/* Email (read-only) */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-white/60 text-xs">Email</Label>
              <Input
                value={user.email}
                readOnly
                className="bg-white/5 border-white/10 text-white/50 cursor-not-allowed"
              />
            </div>

            {/* WhatsApp */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-white/60 text-xs">WhatsApp Number (optional)</Label>
              <Input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+234..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-tekton-purple-bright"
              />
            </div>

            {/* Track (read-only) */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-white/60 text-xs">Track</Label>
              <Input
                value={user.track}
                readOnly
                className="bg-white/5 border-white/10 text-white/50 cursor-not-allowed"
              />
              <p className="text-[11px] text-white/30">Contact admin to change your track.</p>
            </div>

            {/* Mentor-only fields */}
            {isMentor && (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-white/60 text-xs">Bio</Label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="Tell mentees about yourself..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-tekton-purple-bright resize-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-white/60 text-xs">Years of Experience</Label>
                  <Input
                    type="number"
                    min={0}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="bg-white/5 border-white/10 text-white focus:border-tekton-purple-bright"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-white/60 text-xs">LinkedIn URL</Label>
                  <Input
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-tekton-purple-bright"
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              disabled={saving}
              className="self-start bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </form>
        </Section>

        {/* ── Section 3: Notification Preferences ── */}
        <Section title="EMAIL NOTIFICATION PREFERENCES">
          <div className="flex flex-col gap-4">
            {/* Announcements */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-white">New Announcements</p>
                <p className="text-xs text-white/40">Get notified about platform announcements</p>
              </div>
              <Toggle
                checked={user.emailNotifications.announcements}
                onChange={(v) => handleTogglePref('announcements', v)}
                disabled={togglingPref === 'announcements'}
              />
            </div>

            {/* Session reminders */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-white">Session Reminders</p>
                <p className="text-xs text-white/40">24 hours before scheduled sessions</p>
              </div>
              <Toggle
                checked={user.emailNotifications.sessionReminders}
                onChange={(v) => handleTogglePref('sessionReminders', v)}
                disabled={togglingPref === 'sessionReminders'}
              />
            </div>

            {/* Weekly progress — mentees only */}
            {isMentee && (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white">Weekly Progress Summary</p>
                  <p className="text-xs text-white/40">Your weekly task completion recap</p>
                </div>
                <Toggle
                  checked={user.emailNotifications.weeklyProgress}
                  onChange={(v) => handleTogglePref('weeklyProgress', v)}
                  disabled={togglingPref === 'weeklyProgress'}
                />
              </div>
            )}

            {/* Milestone completions — mentors only */}
            {isMentor && (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white">Mentee Milestone Completions</p>
                  <p className="text-xs text-white/40">When a mentee completes a milestone</p>
                </div>
                <Toggle
                  checked={user.emailNotifications.milestoneCompletions}
                  onChange={(v) => handleTogglePref('milestoneCompletions', v)}
                  disabled={togglingPref === 'milestoneCompletions'}
                />
              </div>
            )}
          </div>
        </Section>

        {/* ── Section 4: Security ── */}
        <Section title="SECURITY">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setPwDialogOpen(true)}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white gap-2"
            >
              <KeyRound className="size-4" />
              Change Password
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                api.post('/auth/logout-all').catch(() => {})
                localStorage.clear()
                window.location.href = '/auth/login'
              }}
              className="border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white gap-2"
            >
              <LogOut className="size-4" />
              Log out of all devices
            </Button>
          </div>
        </Section>

        {/* ── Section 5: Danger Zone ── */}
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 flex flex-col gap-4">
          <h2 className="font-heading text-xl text-red-400">DANGER ZONE</h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Once you delete your account, there is no going back. All your data will be permanently removed.
          </p>
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(true)}
            className="self-start border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 gap-2"
          >
            <Trash2 className="size-4" />
            Delete Account
          </Button>
        </div>

        {/* ── Change Password Dialog ── */}
        <Dialog open={pwDialogOpen} onOpenChange={setPwDialogOpen}>
          <DialogContent className="bg-black/95 border border-white/10 text-white max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">CHANGE PASSWORD</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleChangePassword} className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1.5 relative">
                <Label className="text-white/60 text-xs">Current Password</Label>
                <Input
                  type={showPw ? 'text' : 'password'}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white pr-10"
                />
              </div>
              <div className="flex flex-col gap-1.5 relative">
                <Label className="text-white/60 text-xs">New Password</Label>
                <div className="relative">
                  <Input
                    type={showPw ? 'text' : 'password'}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    required
                    minLength={8}
                    className="bg-white/5 border-white/10 text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                  >
                    {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-white/60 text-xs">Confirm New Password</Label>
                <Input
                  type={showPw ? 'text' : 'password'}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <DialogFooter className="mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setPwDialogOpen(false)}
                  className="text-white/60 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={changingPw}
                  className="bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90"
                >
                  {changingPw ? 'Saving…' : 'Update Password'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ── Delete Account Dialog ── */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="bg-black/95 border border-red-500/30 text-white max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl text-red-400">DELETE ACCOUNT</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-white/60 leading-relaxed mt-2">
              This will permanently delete your account and all associated data.
              <strong className="text-white"> This action cannot be undone.</strong>
            </p>
            <DialogFooter className="mt-4">
              <Button
                variant="ghost"
                onClick={() => setDeleteDialogOpen(false)}
                className="text-white/60 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="bg-red-600 text-white hover:bg-red-700 gap-2"
              >
                <Trash2 className="size-4" />
                {deleting ? 'Deleting…' : 'Yes, Delete My Account'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}
