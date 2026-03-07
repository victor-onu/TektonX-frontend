import api from '@/lib/api'
import type { Task } from '@/types'

const taskService = {
  getTemplates: async (milestone?: number): Promise<Task[]> => {
    const params = milestone ? { milestone } : {}
    const { data } = await api.get('/tasks/templates', { params })
    return data
  },
  getMyTasks: async (): Promise<Task[]> => {
    const { data } = await api.get('/tasks/my')
    return data
  },
  createPersonalCopy: async (payload: Omit<Task, 'id' | 'userId' | 'createdAt'>): Promise<Task> => {
    const { data } = await api.post('/tasks', payload)
    return data
  },
  updateTask: async (id: string, payload: { completed: boolean }): Promise<Task> => {
    const { data } = await api.put(`/tasks/${id}`, payload)
    return data
  },
}

export default taskService
