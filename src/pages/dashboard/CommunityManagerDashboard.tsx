import { useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { marked } from 'marked'
import { toast } from 'sonner'
import { AlertTriangle, Check, Download, Paperclip, Send, X } from 'lucide-react'
import '@/components/marketing/marketing.css'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import eventAdminService, { type EmailAudience, type EventRegistrant } from '@/services/eventAdminService'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/lib/utils'
import type { User } from '@/types'

const MAX_ATTACHMENTS = 5
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024 // 10MB

const AUDIENCE_OPTIONS: { value: EmailAudience; label: string; description: string }[] = [
  { value: 'all', label: 'All registrants', description: 'Everyone who registered for this event' },
  { value: 'volunteers', label: 'Volunteers only', description: 'Registrants who answered "Yes" to volunteering' },
  { value: 'manual', label: 'Manual list', description: 'Type or paste email addresses — not limited to registrants' },
]

const volunteerLabel: Record<string, string> = {
  yes: 'Yes',
  maybe: 'Maybe',
  no: 'No',
}

// Light-theme field styling shared by inputs/selects on this page — same
// pattern as JoinCommunity.tsx's `fieldClassName`, re-tinted for a white
// background instead of this dashboard's old dark-theme fields.
const fieldClassName =
  'bg-white border-[rgba(20,17,24,0.12)] text-[#141118] placeholder:text-[#7A737F] focus-visible:border-[#7C3AED] focus-visible:ring-[#7C3AED]/30'

// ─── Registrants table ──────────────────────────────────────────────────────

function RegistrantsTable({
  registrants,
  isLoading,
  slug,
}: {
  registrants: EventRegistrant[]
  isLoading: boolean
  slug: string | null
}) {
  const [search, setSearch] = useState('')
  const [exporting, setExporting] = useState(false)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return registrants
    return registrants.filter((r) =>
      r.name.toLowerCase().includes(query) ||
      r.email.toLowerCase().includes(query) ||
      (r.organisation ?? '').toLowerCase().includes(query),
    )
  }, [registrants, search])

  async function handleExport() {
    if (!slug) return
    setExporting(true)
    try {
      const blob = await eventAdminService.exportRegistrations(slug)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tektonx-${slug}-registrants.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Registrants exported as CSV.')
    } catch {
      toast.error('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl text-[#141118]">REGISTRANTS</h2>
        <button
          onClick={handleExport}
          disabled={exporting || !slug || registrants.length === 0}
          className="inline-flex items-center gap-2 rounded-lg border border-[rgba(20,17,24,0.12)] bg-white px-4 py-2.5 text-sm font-medium text-[#141118] transition-colors hover:border-[#7C3AED]/40 hover:text-[#7C3AED] disabled:opacity-50"
        >
          <Download className="size-4" />
          {exporting ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email, or organisation..."
        className={`${fieldClassName} sm:max-w-xs`}
      />

      <div className="rounded-xl border border-[rgba(20,17,24,0.06)] bg-white overflow-x-auto tx-card-hover">
        {isLoading ? (
          <div className="flex flex-col divide-y divide-[rgba(20,17,24,0.06)]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="h-4 w-32 rounded tx-skeleton" />
                <div className="h-4 w-40 rounded tx-skeleton" />
                <div className="h-4 w-24 rounded tx-skeleton" />
                <div className="h-4 w-24 rounded tx-skeleton ml-auto" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-[#7A737F]">
              {registrants.length === 0 ? 'No registrants yet for this event.' : 'No registrants match your search.'}
            </p>
          </div>
        ) : (
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className="border-[rgba(20,17,24,0.06)] hover:bg-transparent">
                <TableHead className="text-[#7A737F] text-xs uppercase tracking-wider">Name</TableHead>
                <TableHead className="text-[#7A737F] text-xs uppercase tracking-wider">Email</TableHead>
                <TableHead className="text-[#7A737F] text-xs uppercase tracking-wider">Phone</TableHead>
                <TableHead className="text-[#7A737F] text-xs uppercase tracking-wider">Role</TableHead>
                <TableHead className="text-[#7A737F] text-xs uppercase tracking-wider">Organisation</TableHead>
                <TableHead className="text-[#7A737F] text-xs uppercase tracking-wider">Volunteer</TableHead>
                <TableHead className="text-[#7A737F] text-xs uppercase tracking-wider">Question</TableHead>
                <TableHead className="text-[#7A737F] text-xs uppercase tracking-wider">Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id} className="border-[rgba(20,17,24,0.06)] hover:bg-[rgba(124,58,237,0.04)]">
                  <TableCell className="font-medium text-[#141118]">{r.name}</TableCell>
                  <TableCell className="text-[#5C5661]">{r.email}</TableCell>
                  <TableCell className="text-[#5C5661]">{r.phone}</TableCell>
                  <TableCell className="text-[#5C5661]">{r.role}</TableCell>
                  <TableCell className="text-[#5C5661]">{r.organisation ?? '—'}</TableCell>
                  <TableCell className="text-[#5C5661]">
                    {r.volunteer ? volunteerLabel[r.volunteer] ?? r.volunteer : '—'}
                  </TableCell>
                  <TableCell className="text-[#5C5661] max-w-[240px] truncate" title={r.question ?? undefined}>
                    {r.question ?? '—'}
                  </TableCell>
                  <TableCell className="text-[#7A737F] text-sm">{formatDate(r.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

// ─── Email composer ─────────────────────────────────────────────────────────

function EmailComposer({ registrants, slug }: { registrants: EventRegistrant[]; slug: string | null }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState<EmailAudience>('all')
  const [manualEmails, setManualEmails] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [sending, setSending] = useState(false)

  const allCount = registrants.length
  const volunteerCount = registrants.filter((r) => r.volunteer === 'yes').length

  const renderedBody = useMemo(() => {
    try {
      return marked.parse(body || '_Your message will appear here…_', { breaks: true, async: false }) as string
    } catch {
      return ''
    }
  }, [body])

  function addFiles(files: FileList | File[]) {
    const incoming = Array.from(files)
    const oversized = incoming.find((f) => f.size > MAX_ATTACHMENT_SIZE)
    if (oversized) {
      toast.error(`"${oversized.name}" is larger than 10MB.`)
      return
    }
    setAttachments((prev) => {
      const combined = [...prev, ...incoming]
      if (combined.length > MAX_ATTACHMENTS) {
        toast.error(`You can attach up to ${MAX_ATTACHMENTS} files.`)
        return prev
      }
      return combined
    })
  }

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  function getValidationError(): string | null {
    if (!slug) return 'Select an event first.'
    if (!subject.trim()) return 'Subject is required.'
    if (!body.trim()) return 'Message body is required.'
    if (audience === 'manual' && !manualEmails.trim()) return 'Enter at least one email address for the manual list.'
    if (audience === 'volunteers' && volunteerCount === 0) return 'No volunteers found for this event.'
    return null
  }

  function openConfirm() {
    const err = getValidationError()
    if (err) { toast.error(err); return }
    setConfirmOpen(true)
  }

  async function handleConfirmSend() {
    if (!slug) return
    setSending(true)
    try {
      const formData = new FormData()
      formData.append('subject', subject)
      formData.append('body', body)
      formData.append('audience', audience)
      if (audience === 'manual') formData.append('manualEmails', manualEmails)
      attachments.forEach((file) => formData.append('attachments', file))

      const res = await eventAdminService.emailRegistrants(slug, formData)
      if (res.failed === 0) {
        toast.success(`Email sent to ${res.sent} recipient${res.sent === 1 ? '' : 's'}.`)
      } else {
        toast.success(`Sent ${res.sent}, ${res.failed} failed.`)
      }
      setConfirmOpen(false)
      setSubject('')
      setBody('')
      setAudience('all')
      setManualEmails('')
      setAttachments([])
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg ?? 'Failed to send email.')
    } finally {
      setSending(false)
    }
  }

  const recipientSummary =
    audience === 'all' ? `${allCount} registrant${allCount === 1 ? '' : 's'}`
      : audience === 'volunteers' ? `${volunteerCount} volunteer${volunteerCount === 1 ? '' : 's'}`
        : 'the manual list below'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl text-[#141118]">EMAIL REGISTRANTS</h2>
        <p className="text-xs text-[#7A737F]">
          Compose a Markdown email and send it to this event&apos;s registrants, with optional attachments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT: form */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-[#413B47]">Subject</Label>
            <Input
              value={subject}
              maxLength={200}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Important details for Saturday's event"
              className={fieldClassName}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-[#413B47]">
              Message <span className="text-[#7A737F]">(Markdown supported — **bold**, *italic*, [links](url), - lists)</span>
            </Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder={`Hi everyone,\n\nHere's an update on the event...\n\nThanks,\nTektonX Team`}
              className={`${fieldClassName} font-mono text-sm min-h-32 sm:min-h-64`}
            />
          </div>

          {/* Audience */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-[#413B47]">Audience</Label>
            <div className="flex flex-col gap-2">
              {AUDIENCE_OPTIONS.map((opt) => {
                const active = audience === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAudience(opt.value)}
                    className={`flex items-start gap-2.5 text-left rounded-lg border px-3 py-2 transition-colors ${
                      active
                        ? 'border-[#7C3AED] bg-[rgba(124,58,237,0.08)]'
                        : 'border-[rgba(20,17,24,0.12)] bg-white hover:border-[rgba(20,17,24,0.24)]'
                    }`}
                  >
                    <div className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${
                      active ? 'border-[#7C3AED] bg-[#7C3AED]' : 'border-[rgba(20,17,24,0.24)]'
                    }`}>
                      {active && <Check className="size-3 text-white" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-[#141118] font-medium flex items-center gap-2">
                        {opt.label}
                        {opt.value === 'all' && <span className="text-xs text-[#7A737F]">({allCount})</span>}
                        {opt.value === 'volunteers' && <span className="text-xs text-[#7A737F]">({volunteerCount})</span>}
                      </span>
                      <span className="text-xs text-[#7A737F]">{opt.description}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {audience === 'manual' && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-[#413B47]">
                Email addresses <span className="text-[#7A737F]">(comma or newline separated)</span>
              </Label>
              <Textarea
                value={manualEmails}
                onChange={(e) => setManualEmails(e.target.value)}
                rows={4}
                placeholder={'speaker@example.com\npartner@example.com'}
                className={`${fieldClassName} text-sm`}
              />
            </div>
          )}

          {/* Attachments */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-[#413B47]">
              Attachments <span className="text-[#7A737F]">(optional — up to {MAX_ATTACHMENTS} files, 10MB each)</span>
            </Label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files) }}
              onClick={() => fileInputRef.current?.click()}
              className="relative rounded-xl border-2 border-dashed border-[rgba(20,17,24,0.15)] hover:border-[#7C3AED]/40 bg-white p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) addFiles(e.target.files)
                  e.target.value = ''
                }}
              />
              <Paperclip className="size-5 text-[#7A737F]" />
              <p className="text-sm text-[#5C5661] text-center">Click to attach files or drag and drop</p>
            </div>

            {attachments.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {attachments.map((file, i) => (
                  <li key={`${file.name}-${i}`} className="flex items-center justify-between gap-2 rounded-lg border border-[rgba(20,17,24,0.08)] bg-white px-3 py-2">
                    <span className="text-xs text-[#5C5661] truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(i)}
                      className="text-[#7A737F] hover:text-[#DC2626] transition-colors shrink-0"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pt-2 border-t border-[rgba(20,17,24,0.08)]">
            <Button
              onClick={openConfirm}
              disabled={!slug}
              className="tx-cta-gradient bg-[linear-gradient(100deg,#7C3AED,#C026D3)] text-white border-0 shadow-[0_6px_18px_rgba(124,58,237,0.28)] hover:opacity-95 disabled:opacity-40"
            >
              <Send className="size-4 mr-1.5" />
              Send Email
            </Button>
          </div>
        </div>

        {/* RIGHT: live preview */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-[#413B47]">Live preview</Label>
          <div className="rounded-lg border border-[rgba(20,17,24,0.08)] overflow-hidden">
            <div className="bg-[#FAF8F6] border-b border-[rgba(20,17,24,0.08)] px-4 py-2.5">
              <p className="text-[11px] uppercase text-[#7A737F] tracking-wider">Subject</p>
              <p className="text-sm text-[#141118] truncate">{subject || 'No subject'}</p>
            </div>
            <div className="bg-white text-zinc-900 p-6 max-h-[500px] overflow-y-auto">
              <p className="text-sm text-zinc-500 mb-3">Hi <span className="text-zinc-900 font-medium">[recipient name]</span>,</p>
              <div
                className="broadcast-preview text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderedBody }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={(o) => !o && !sending && setConfirmOpen(false)}>
        <DialogContent className="bg-white border-[rgba(20,17,24,0.08)] text-[#141118] max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-tekton-yellow" />
              Confirm Email
            </DialogTitle>
            <DialogDescription className="text-[#5C5661]">
              This will send an email to <span className="text-[#141118] font-semibold">{recipientSummary}</span>. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-[rgba(20,17,24,0.08)] bg-[#FAF8F6] p-3 text-xs text-[#5C5661]">
            <p><span className="text-[#7A737F]">Subject:</span> <span className="text-[#141118]">{subject}</span></p>
            <p className="mt-1">
              <span className="text-[#7A737F]">Audience:</span>{' '}
              <span className="text-[#141118]">{AUDIENCE_OPTIONS.find((o) => o.value === audience)?.label}</span>
            </p>
            {attachments.length > 0 && (
              <p className="mt-1">
                <span className="text-[#7A737F]">Attachments:</span>{' '}
                <span className="text-[#141118]">{attachments.length} file{attachments.length === 1 ? '' : 's'}</span>
              </p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" disabled={sending} onClick={() => setConfirmOpen(false)} className="border-[rgba(20,17,24,0.12)] text-[#5C5661]">
              Cancel
            </Button>
            <Button
              disabled={sending}
              onClick={handleConfirmSend}
              className="tx-cta-gradient bg-[linear-gradient(100deg,#7C3AED,#C026D3)] text-white border-0 shadow-[0_6px_18px_rgba(124,58,237,0.28)] hover:opacity-95"
            >
              {sending ? 'Sending…' : 'Confirm & Send'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CommunityManagerDashboard() {
  const { user: rawUser } = useAuth()
  const currentUser = rawUser as User | null
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

  const { data: events = [], isLoading: eventsLoading, isError: eventsError } = useQuery({
    queryKey: ['cm-events'],
    queryFn: eventAdminService.getEvents,
  })

  // Default to the first event once the list loads, unless the user has already picked one.
  const effectiveSlug = selectedSlug ?? events[0]?.slug ?? null

  const { data: registrants = [], isLoading: registrantsLoading, isError: registrantsError } = useQuery({
    queryKey: ['cm-registrations', effectiveSlug],
    queryFn: () => eventAdminService.getRegistrations(effectiveSlug as string),
    enabled: !!effectiveSlug,
  })

  const selectedEvent = events.find((e) => e.slug === effectiveSlug) ?? null

  return (
    <div className="tx-marketing min-h-screen bg-[#F5F4F3] pt-24 pb-16 px-4">
      <div className="mx-auto max-w-7xl flex flex-col gap-8">

        {/* Page heading */}
        <div>
          <h1 className="text-4xl sm:text-5xl" style={{ color: '#141118' }}>
            COMMUNITY{' '}
            <span
              style={{
                background: 'linear-gradient(100deg,#7C3AED,#C026D3)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              MANAGER
            </span>
          </h1>
          {currentUser && (
            <p className="mt-1 text-sm text-[#7A737F]">Logged in as {currentUser.name}</p>
          )}
        </div>

        {/* Event picker */}
        <div className="rounded-xl border border-[rgba(20,17,24,0.06)] bg-white p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between tx-card-hover">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-[#413B47]">Event</Label>
            {eventsLoading ? (
              <div className="h-9 w-64 rounded tx-skeleton" />
            ) : eventsError ? (
              <p className="text-sm text-[#DC2626]">Failed to load events. Is the API running?</p>
            ) : events.length === 0 ? (
              <p className="text-sm text-[#7A737F]">No events found.</p>
            ) : (
              <Select value={effectiveSlug ?? undefined} onValueChange={setSelectedSlug}>
                <SelectTrigger className="w-full sm:w-80 bg-white border-[rgba(20,17,24,0.12)] text-[#141118]">
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[rgba(20,17,24,0.1)] text-[#141118]">
                  {events.map((e) => (
                    <SelectItem key={e.id} value={e.slug} className="text-[#141118] focus:bg-[#7C3AED]/10">
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          {selectedEvent && (
            <div className="flex flex-col gap-0.5 text-xs text-[#7A737F] sm:text-right">
              <span>{formatDate(selectedEvent.startsAt)}</span>
              <span>{selectedEvent.venue} · {selectedEvent.seatLimit} seats</span>
            </div>
          )}
        </div>

        {!eventsLoading && !eventsError && events.length === 0 ? (
          <div className="rounded-xl border border-[rgba(20,17,24,0.06)] bg-white p-10 flex items-center justify-center">
            <p className="text-sm text-[#7A737F]">There are no events to manage yet.</p>
          </div>
        ) : (
          <>
            {registrantsError ? (
              <div className="rounded-xl border border-[rgba(20,17,24,0.06)] bg-white p-10 flex items-center justify-center">
                <p className="text-sm text-[#DC2626]">Failed to load registrants. Is the API running?</p>
              </div>
            ) : (
              <RegistrantsTable registrants={registrants} isLoading={registrantsLoading} slug={effectiveSlug} />
            )}

            <EmailComposer registrants={registrants} slug={effectiveSlug} />
          </>
        )}

      </div>
    </div>
  )
}
