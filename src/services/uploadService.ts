import api from '@/lib/api'
import type { Upload } from '@/types'

const uploadService = {
  upload: async (file: File, taskId?: string): Promise<Upload> => {
    const formData = new FormData()
    formData.append('file', file)
    if (taskId) formData.append('taskId', taskId)
    const { data } = await api.post('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  getByTaskId: async (taskId: string): Promise<Upload[]> => {
    const { data } = await api.get('/uploads', { params: { taskId } })
    return data
  },

  deleteUpload: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/uploads/${id}`)
    return data
  },
}

export default uploadService
