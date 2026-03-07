import api from '@/lib/api'
import type { Conversation, Message } from '@/types'

const messageService = {
  getConversations: async (): Promise<Conversation[]> => {
    const { data } = await api.get('/messages')
    return data
  },

  getMessages: async (partnerId: string): Promise<Message[]> => {
    const { data } = await api.get(`/messages/${partnerId}`)
    return data
  },

  sendMessage: async (
    receiverId: string,
    content: string,
    fileUrl?: string,
  ): Promise<Message> => {
    const { data } = await api.post('/messages', { receiverId, content, fileUrl })
    return data
  },

  markAsRead: async (messageId: string): Promise<Message> => {
    const { data } = await api.put(`/messages/${messageId}/read`)
    return data
  },
}

export default messageService
