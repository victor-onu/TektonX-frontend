import api from '@/lib/api'
import type { MentorshipSession } from '@/types'

const sessionService = {
  getAll: async (): Promise<MentorshipSession[]> => {
    const { data } = await api.get('/sessions')
    return data
  },
  create: async (payload: Omit<MentorshipSession, 'id' | 'createdAt'>): Promise<MentorshipSession> => {
    const { data } = await api.post('/sessions', payload)
    return data
  },
  update: async (id: string, payload: Partial<MentorshipSession>): Promise<MentorshipSession> => {
    const { data } = await api.put(`/sessions/${id}`, payload)
    return data
  },
  delete: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/sessions/${id}`)
    return data
  },
}

export default sessionService
