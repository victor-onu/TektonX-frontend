import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import api from '@/lib/api'
import authService from '@/services/authService'
import { TECH_TRACKS, type ExperienceLevel } from '@/types'

const EXPERIENCE_LEVELS: ExperienceLevel[] = ['Beginner', 'Intermediate', 'Advanced']

export default function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Form state
  const [role, setRole] = useState<'mentee' | 'mentor'>(
    searchParams.get('role') === 'mentor' ? 'mentor' : 'mentee'
  )
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [track, setTrack] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | ''>('')
  const [bio, setBio] = useState('')
  const [title, setTitle] = useState('')
  const [experienceYears, setExperienceYears] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoUploading, setPhotoUploading] = useState(false)

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    setPhotoUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await api.post<{ url: string }>('/uploads/profile-photo', formData, {
        headers: { 'Content-Type': undefined },
      })
      setPhotoUrl(data.url)
    } catch {
      toast.error('Photo upload failed')
      setPhotoFile(null)
      setPhotoPreview('')
      setPhotoUrl('')
    } finally {
      setPhotoUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload: Parameters<typeof authService.register>[0] = {
        name, email, password, role, track,
        ...(whatsapp && { whatsapp }),
        ...(role === 'mentee' && experienceLevel && { experienceLevel }),
        ...(role === 'mentor' && { bio, title }),
        ...(role === 'mentor' && experienceYears && { experienceYears: parseInt(experienceYears) }),
        ...(role === 'mentor' && linkedinUrl && { linkedinUrl }),
        ...(role === 'mentor' && photoUrl && { profilePhotoUrl: photoUrl }),
      }
      const { message } = await authService.register(payload)
      toast.success(message)
      navigate('/auth/login')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message
      setError(Array.isArray(msg) ? msg[0] : (msg ?? 'Registration failed. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <Link to="/">
            <img src="/logo-gradient-horizontal.svg" alt="TektonX" className="h-10 w-auto hover:opacity-80 transition-opacity" />
          </Link>
          <p className="text-xs text-white/40 uppercase tracking-widest">Create your account</p>
        </div>

        <div className="glass-card rounded-2xl p-8 flex flex-col gap-5">
          {/* Role toggle */}
          <div className="flex rounded-lg bg-white/5 p-1 gap-1">
            {(['mentee', 'mentor'] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                  role === r
                    ? 'bg-tekton-purple-bright text-white'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {r === 'mentee' ? 'Join as Mentee' : 'Apply as Mentor'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-white/60">Full name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} required placeholder="Your full name"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-white/60">Email address</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-white/60">Password</Label>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-10" />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Track */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-white/60">Track</Label>
              <Select value={track} onValueChange={setTrack} required>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select your track" className="text-white/30" />
                </SelectTrigger>
                <SelectContent>
                  {TECH_TRACKS.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* WhatsApp */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-white/60">WhatsApp number <span className="text-white/30">(optional)</span></Label>
              <Input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+234..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
            </div>

            {/* Mentee-specific */}
            {role === 'mentee' && (
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-white/60">Experience level</Label>
                <Select value={experienceLevel} onValueChange={v => setExperienceLevel(v as ExperienceLevel)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Mentor-specific */}
            {role === 'mentor' && (
              <>
                {/* Profile photo */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-white/60">Profile photo <span className="text-white/30">(optional)</span></Label>
                  <div className="flex items-center gap-4">
                    <div className="relative size-[60px] shrink-0 rounded-full bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Profile preview" className="size-full object-cover" />
                      ) : (
                        <Camera className="size-5 text-white/30" />
                      )}
                      {photoUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                          <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <label className="cursor-pointer">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-white/60 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white/80 transition-colors">
                        <Camera className="size-3.5" />
                        {photoFile ? 'Change photo' : 'Upload photo'}
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="sr-only"
                        onChange={handlePhotoChange}
                        disabled={photoUploading}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-white/60">Professional title</Label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior Engineer at Google"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-white/60">Years of experience</Label>
                  <Input type="number" min={1} value={experienceYears} onChange={e => setExperienceYears(e.target.value)}
                    placeholder="e.g. 5"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-white/60">LinkedIn URL <span className="text-white/30">(optional)</span></Label>
                  <Input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-white/60">Bio <span className="text-white/30">(max 500 chars)</span></Label>
                  <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." maxLength={500} rows={3}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none" />
                </div>
              </>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button type="submit" disabled={loading || photoUploading || !track}
              className="w-full bg-tekton-purple-bright hover:bg-tekton-purple-bright/90 mt-1">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {role === 'mentor' ? 'Submitting application\u2026' : 'Creating account\u2026'}
                </span>
              ) : role === 'mentor' ? 'Submit Application' : 'Create Account'}
            </Button>
          </form>

          <div className="h-px bg-white/10" />
          <p className="text-center text-sm text-white/50">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-tekton-blue hover:text-tekton-blue/80">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
