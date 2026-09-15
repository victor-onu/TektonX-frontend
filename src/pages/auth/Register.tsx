import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff, Camera } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import api from '@/lib/api'
import authService from '@/services/authService'
import { TECH_TRACKS, type ExperienceLevel } from '@/types'
import logoBlackHorizontal from '@/assets/marketing/logo-black-horizontal.svg'

const EXPERIENCE_LEVELS: ExperienceLevel[] = ['Beginner', 'Intermediate', 'Advanced']

// Light-theme field styling shared by every input/select/textarea on this
// form — same shape as the shadcn defaults, just re-tinted for a white
// background (matches JoinCommunity.tsx's already-converted fields).
const fieldClassName =
  'bg-white border-[rgba(20,17,24,0.12)] text-[#141118] placeholder:text-[#7A737F] focus-visible:border-[#7C3AED] focus-visible:ring-[#7C3AED]/30'

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
    // AuthLayout already centers/backgrounds the page — see Login.tsx for why
    // this no longer duplicates that wrapper. This was also the direct cause
    // of the "Apply As Mentor" toggle label wrapping to two lines at 1440px
    // (the card was sizing narrower there than at 375px).
    <div className="w-full max-w-md flex flex-col gap-6 py-16">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <Link to="/">
            <img src={logoBlackHorizontal} alt="TektonX" className="h-10 w-auto hover:opacity-80 transition-opacity" />
          </Link>
          <p className="text-xs text-[#7A737F] uppercase tracking-widest">Create your account</p>
        </div>

        <div className="bg-white border border-[rgba(20,17,24,0.06)] shadow-[0_24px_60px_rgba(20,17,24,0.08)] rounded-2xl p-8 flex flex-col gap-5">
          {/* Role toggle */}
          <div className="flex rounded-lg bg-[rgba(20,17,24,0.04)] p-1 gap-1">
            {(['mentee', 'mentor'] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                  role === r
                    ? 'bg-[#7C3AED] text-white'
                    : 'text-[#7A737F] hover:text-[#141118]'
                }`}
              >
                {r === 'mentee' ? 'Join as Mentee' : 'Apply as Mentor'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-[#413B47]">Full name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} required placeholder="Your full name"
                className={fieldClassName} />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-[#413B47]">Email address</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                className={fieldClassName} />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-[#413B47]">Password</Label>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  className={`${fieldClassName} pr-10`} />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A737F] hover:text-[#413B47]">
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Track */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-[#413B47]">Track</Label>
              <Select value={track} onValueChange={setTrack} required>
                <SelectTrigger className={fieldClassName}>
                  <SelectValue placeholder="Select your track" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[rgba(20,17,24,0.1)]">
                  {TECH_TRACKS.map(t => (
                    <SelectItem key={t} value={t} className="text-[#141118] focus:bg-[#7C3AED]/10">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* WhatsApp */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-[#413B47]">WhatsApp number <span className="text-[#7A737F]">(optional)</span></Label>
              <Input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+234..."
                className={fieldClassName} />
            </div>

            {/* Mentee-specific */}
            {role === 'mentee' && (
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-[#413B47]">Experience level</Label>
                <Select value={experienceLevel} onValueChange={v => setExperienceLevel(v as ExperienceLevel)}>
                  <SelectTrigger className={fieldClassName}>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[rgba(20,17,24,0.1)]">
                    {EXPERIENCE_LEVELS.map(l => (
                      <SelectItem key={l} value={l} className="text-[#141118] focus:bg-[#7C3AED]/10">{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Mentor-specific */}
            {role === 'mentor' && (
              <>
                {/* Profile photo */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-[#413B47]">Profile photo <span className="text-[#7A737F]">(optional)</span></Label>
                  <div className="flex items-center gap-4">
                    <div className="relative size-[60px] shrink-0 rounded-full bg-[rgba(20,17,24,0.04)] border border-[rgba(20,17,24,0.1)] overflow-hidden flex items-center justify-center">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Profile preview" className="size-full object-cover" />
                      ) : (
                        <Camera className="size-5 text-[#7A737F]" />
                      )}
                      {photoUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                          <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <label className="cursor-pointer">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-[#413B47] bg-[rgba(20,17,24,0.04)] border border-[rgba(20,17,24,0.12)] hover:bg-[rgba(20,17,24,0.08)] hover:text-[#141118] transition-colors">
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
                  <Label className="text-sm text-[#413B47]">Professional title</Label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior Engineer at Google"
                    className={fieldClassName} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-[#413B47]">Years of experience</Label>
                  <Input type="number" min={1} value={experienceYears} onChange={e => setExperienceYears(e.target.value)}
                    placeholder="e.g. 5"
                    className={fieldClassName} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-[#413B47]">LinkedIn URL <span className="text-[#7A737F]">(optional)</span></Label>
                  <Input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..."
                    className={fieldClassName} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm text-[#413B47]">Bio <span className="text-[#7A737F]">(max 500 chars)</span></Label>
                  <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." maxLength={500} rows={3}
                    className={`${fieldClassName} resize-none`} />
                </div>
              </>
            )}

            {error && <p className="text-[#DC2626] text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading || photoUploading || !track}
              className="tx-cta-gradient mt-1 w-full inline-flex items-center justify-center gap-2 rounded-md text-white text-sm font-medium"
              style={{
                background: 'linear-gradient(100deg,#7C3AED,#C026D3)',
                padding: '17px 30px',
                borderRadius: 10,
                boxShadow: '0 6px 18px rgba(124,58,237,0.28)',
                opacity: (loading || photoUploading || !track) ? 0.75 : 1,
                cursor: (loading || photoUploading || !track) ? 'default' : 'pointer',
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {role === 'mentor' ? 'Submitting application…' : 'Creating account…'}
                </span>
              ) : role === 'mentor' ? 'Submit Application' : 'Create Account'}
            </button>
          </form>

          <div className="h-px bg-[rgba(20,17,24,0.08)]" />
          <p className="text-center text-sm text-[#7A737F]">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-[#7C3AED] hover:text-[#7C3AED]/80">Sign in</Link>
          </p>
        </div>
    </div>
  )
}
