import api from '@/lib/api'
import type { User, EmailNotificationPreferences } from '@/types'

const userService = {
  getMe: async (): Promise<User> => {
    const { data } = await api.get('/users/me')
    return data
  },
  updateMe: async (payload: Partial<User>): Promise<User> => {
    const { data } = await api.put('/users/me', payload)
    return data
  },
  updateNotificationPreferences: async (prefs: EmailNotificationPreferences): Promise<User> => {
    const { data } = await api.put('/users/me/notification-preferences', prefs)
    return data
  },
  getUserById: async (id: string): Promise<User> => {
    const { data } = await api.get(`/users/${id}`)
    return data
  },
}

export default userService
