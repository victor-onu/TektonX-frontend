import api from '@/lib/api'
import type { Notification, PaginatedResponse } from '@/types'

const notificationService = {
  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<Notification>> => {
    const { data } = await api.get('/notifications', { params: { page, limit } })
    return data
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const { data } = await api.get('/notifications/unread-count')
    return data
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const { data } = await api.put(`/notifications/${id}/read`)
    return data
  },

  markAllAsRead: async (): Promise<{ message: string }> => {
    const { data } = await api.put('/notifications/read-all')
    return data
  },
}

export default notificationService
