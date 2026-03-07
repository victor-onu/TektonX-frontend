import { useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  Trash2,
  UploadCloud,
} from 'lucide-react'

import uploadService from '@/services/uploadService'
import { cn } from '@/lib/utils'
import type { Upload } from '@/types'

// ─── FileUpload (drop zone) ───────────────────────────────────────────────────

interface FileUploadProps {
  onUploadComplete: (upload: Upload) => void
  taskId?: string
  accept?: string
  maxSizeMB?: number
  label?: string
}

export function FileUpload({
  onUploadComplete,
  taskId,
  accept,
  maxSizeMB = 10,
  label = 'Upload File',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [pendingFile, setPendingFile] = useState<string | null>(null)

  async function processFile(file: File) {
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File too large. Maximum size is ${maxSizeMB} MB.`)
      return
    }
    setPendingFile(file.name)
    setUploading(true)
    try {
      const upload = await uploadService.upload(file, taskId)
      toast.success(`"${file.name}" uploaded successfully.`)
      onUploadComplete(upload)
    } catch {
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      setPendingFile(null)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div
      onClick={() => !uploading && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 cursor-pointer transition-colors',
        dragOver
          ? 'border-tekton-purple-bright bg-tekton-purple-bright/5'
          : 'border-white/20 bg-white/2 hover:border-white/40 hover:bg-white/5',
        uploading && 'cursor-not-allowed opacity-70',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
        disabled={uploading}
      />

      {uploading ? (
        <>
          <Loader2 className="size-8 text-tekton-purple-bright animate-spin" />
          <p className="text-sm text-white/60">Uploading <span className="text-white">{pendingFile}</span>…</p>
        </>
      ) : (
        <>
          <UploadCloud className="size-8 text-white/30" />
          <div className="text-center">
            <p className="text-sm text-white/70">
              <span className="text-tekton-purple-bright font-medium">Click to browse</span>
              {' '}or drag and drop
            </p>
            <p className="text-xs text-white/40 mt-0.5">{label}</p>
            {accept && (
              <p className="text-[11px] text-white/30 mt-1">Accepted: {accept}</p>
            )}
            <p className="text-[11px] text-white/30">Max size: {maxSizeMB} MB</p>
          </div>
        </>
      )}
    </div>
  )
}

// ─── FileAttachment (display) ─────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileIcon(fileType: string) {
  if (fileType.startsWith('image/')) return <ImageIcon className="size-4 text-tekton-blue shrink-0" />
  return <FileText className="size-4 text-tekton-teal shrink-0" />
}

interface FileAttachmentProps {
  upload: Upload
  currentUserId?: string
  onDelete?: (id: string) => void
}

export function FileAttachment({ upload, currentUserId, onDelete }: FileAttachmentProps) {
  const [deleting, setDeleting] = useState(false)
  const isOwner = currentUserId === upload.userId

  async function handleDelete() {
    if (!onDelete) return
    setDeleting(true)
    try {
      await uploadService.deleteUpload(upload.id)
      toast.success('File deleted.')
      onDelete(upload.id)
    } catch {
      toast.error('Failed to delete file.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      {fileIcon(upload.fileType)}

      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-xs font-medium text-white truncate">{upload.filename}</span>
        <span className="text-[10px] text-white/30">{formatBytes(upload.fileSize)}</span>
      </div>

      {/* Download */}
      <a
        href={upload.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        title="Download"
      >
        <Download className="size-3.5" />
      </a>

      {/* Delete (owner only) */}
      {isOwner && onDelete && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="shrink-0 p-1.5 rounded-md text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
          title="Delete"
        >
          {deleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
        </button>
      )}
    </div>
  )
}
