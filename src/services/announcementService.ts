import api from '@/lib/api'
import type { Announcement } from '@/types'

export interface AnnouncementPayload {
  title: string
  content: string
  type: string
  date: string
  flierUrl?: string | null
}

const announcementService = {
  getAll: async (): Promise<Announcement[]> => {
    const { data } = await api.get('/announcements')
    return data
  },

  create: async (payload: AnnouncementPayload): Promise<Announcement> => {
    const { data } = await api.post('/announcements', payload)
    return data
  },

  update: async (id: string, payload: Partial<AnnouncementPayload>): Promise<Announcement> => {
    const { data } = await api.put(`/announcements/${id}`, payload)
    return data
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/announcements/${id}`)
    return data
  },

  uploadFlier: async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post('/announcements/upload-flier', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.url
  },
}

export default announcementService
