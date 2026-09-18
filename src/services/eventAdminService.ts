import api from '@/lib/api'

export interface EventSummary {
  id: string
  slug: string
  name: string
  startsAt: string
  venue: string
  seatLimit: number
  createdAt: string
}

export interface EventRegistrant {
  id: string
  name: string
  email: string
  phone: string
  role: string
  organisation: string | null
  volunteer: 'yes' | 'maybe' | 'no' | null
  question: string | null
  createdAt: string
}

export type EmailAudience = 'all' | 'volunteers' | 'manual'

export interface EmailRegistrantsResult {
  sent: number
  failed: number
}

const eventAdminService = {
  getEvents: async (): Promise<EventSummary[]> => {
    const { data } = await api.get('/events')
    return data
  },
  getRegistrations: async (slug: string): Promise<EventRegistrant[]> => {
    const { data } = await api.get(`/events/${slug}/registrations`)
    return data
  },
  exportRegistrations: async (slug: string): Promise<Blob> => {
    const { data } = await api.get(`/events/${slug}/registrations/export`, { responseType: 'blob' })
    return data
  },
  emailRegistrants: async (slug: string, formData: FormData): Promise<EmailRegistrantsResult> => {
    const { data } = await api.post(`/events/${slug}/registrations/email`, formData, {
      headers: { 'Content-Type': undefined },
    })
    return data
  },
}

export default eventAdminService
