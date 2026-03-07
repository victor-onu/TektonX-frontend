import api from '@/lib/api'
import type { Resource } from '@/types'

export interface ResourcePayload {
  taskId?: string
  track?: string
  title: string
  url: string
}

const resourceService = {
  getAll: async (): Promise<Resource[]> => {
    const { data } = await api.get('/resources')
    return data
  },
  getByTaskId: async (taskId: string): Promise<Resource[]> => {
    const { data } = await api.get('/resources', { params: { taskId } })
    return data
  },
  getByTrack: async (track: string): Promise<Resource[]> => {
    const { data } = await api.get('/resources', { params: { track } })
    return data
  },
  getMine: async (): Promise<Resource[]> => {
    const { data } = await api.get('/resources/mine')
    return data
  },
  create: async (payload: ResourcePayload): Promise<Resource> => {
    const { data } = await api.post('/resources', payload)
    return data
  },
  update: async (id: string, payload: Partial<ResourcePayload>): Promise<Resource> => {
    const { data } = await api.put(`/resources/${id}`, payload)
    return data
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/resources/${id}`)
  },
}

export default resourceService
