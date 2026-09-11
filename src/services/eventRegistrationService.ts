import api from '@/lib/api'

export interface EventDetails {
  id: string
  slug: string
  name: string
  startsAt: string
  venue: string
  seatLimit: number
  createdAt: string
}

export interface RegisterPayload {
  name: string
  email: string
  phone: string
  role: string
  organisation?: string
  volunteer?: 'yes' | 'maybe' | 'no'
  question?: string
}

const eventRegistrationService = {
  getEvent: async (slug: string): Promise<EventDetails> => {
    const { data } = await api.get(`/events/${slug}`)
    return data
  },
  register: async (slug: string, payload: RegisterPayload): Promise<{ message: string }> => {
    const { data } = await api.post(`/events/${slug}/register`, payload)
    return data
  },
}

export default eventRegistrationService
