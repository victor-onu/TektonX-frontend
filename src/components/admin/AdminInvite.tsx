import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import adminService from '@/services/adminService'
import { TECH_TRACKS } from '@/types'

// ─── Single Invite ─────────────────────────────────────────────────────────────

function SingleInvite() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [track, setTrack] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!track) { toast.error('Please select a track.'); return }
    setLoading(true)
    try {
      await adminService.inviteMentee({ name, email, track })
      toast.success(`Invite sent to ${email}`)
      setName('')
      setEmail('')
      setTrack('')
    } catch {
      toast.error('Failed to send invite.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card rounded-xl p-6 flex flex-col gap-4">
      <h3 className="font-heading text-lg text-white">SINGLE INVITE</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm text-white/60">Full Name</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Jane Doe"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm text-white/60">Email Address</Label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="jane@example.com"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-white/60">Track</Label>
          <Select value={track} onValueChange={setTrack}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select a track" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10">
              {TECH_TRACKS.map((t) => (
                <SelectItem key={t} value={t} className="text-white hover:bg-white/10">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-fit bg-tekton-purple-bright hover:bg-tekton-purple-bright/90"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending&hellip;
            </span>
          ) : 'Send Invite'}
        </Button>
      </form>
    </div>
  )
}

// ─── Bulk Invite ────────────────────────────────────────────────────────────────

function BulkInvite() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number; errors: string[] } | null>(null)
  const [dragging, setDragging] = useState(false)

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.xlsx')) { toast.error('Please upload an Excel (.xlsx) file.'); return }
    setSelectedFile(file)
    setResult(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setLoading(true)
    setResult(null)
    try {
      const res = await adminService.inviteBulk(selectedFile)
      setResult(res)
      if (res.sent > 0) {
        toast.success(`${res.sent} invite${res.sent !== 1 ? 's' : ''} sent successfully`)
      }
      if (res.failed > 0) {
        toast.error(`${res.failed} invite${res.failed !== 1 ? 's' : ''} failed`)
      }
      setSelectedFile(null)
    } catch {
      toast.error('Bulk upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card rounded-xl p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg text-white">BULK INVITE</h3>
        <button
          type="button"
          onClick={() => adminService.downloadSampleXlsx().catch(() => toast.error('Failed to download template.'))}
          className="text-xs text-tekton-blue hover:text-tekton-blue/80 transition-colors"
        >
          Download Template
        </button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
          dragging
            ? 'border-tekton-purple-bright bg-tekton-purple-bright/5'
            : 'border-white/20 hover:border-white/40 bg-white/5'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileSelect(file)
            e.target.value = ''
          }}
        />
        <div className="size-10 rounded-full bg-white/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        {selectedFile ? (
          <p className="text-sm text-white font-medium">{selectedFile.name}</p>
        ) : (
          <p className="text-sm text-white/50 text-center">
            Click to upload Excel file or drag and drop
          </p>
        )}
        <p className="text-xs text-white/30">.xlsx files only</p>
      </div>

      {/* Upload button */}
      {selectedFile && (
        <Button
          onClick={handleUpload}
          disabled={loading}
          className="w-fit bg-tekton-purple-bright hover:bg-tekton-purple-bright/90"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading&hellip;
            </span>
          ) : 'Upload & Send Invites'}
        </Button>
      )}

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-3">
          {result.sent > 0 && (
            <div className="rounded-lg border border-tekton-green/30 bg-tekton-green/10 px-4 py-3">
              <p className="text-sm text-tekton-green font-medium">
                {result.sent} invite{result.sent !== 1 ? 's' : ''} sent successfully
              </p>
            </div>
          )}
          {result.failed > 0 && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 flex flex-col gap-2">
              <p className="text-sm text-red-400 font-medium">
                {result.failed} invite{result.failed !== 1 ? 's' : ''} failed
              </p>
              {result.errors.length > 0 && (
                <ul className="flex flex-col gap-1">
                  {result.errors.map((err, i) => (
                    <li key={i} className="text-xs text-red-400/80">{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── AdminInvite ───────────────────────────────────────────────────────────────

export default function AdminInvite() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-heading text-2xl text-white">INVITE MENTEES</h2>
        <p className="mt-1 text-sm text-white/50">
          Send individual invitations or bulk-import from a CSV file.
        </p>
      </div>
      <SingleInvite />
      <BulkInvite />
    </div>
  )
}
