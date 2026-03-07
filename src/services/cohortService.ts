import api from '@/lib/api'
import type { Cohort, User } from '@/types'

export interface CohortPayload {
  name: string
  number: number
  startDate: string
  endDate: string
}

const cohortService = {
  getAll: async (): Promise<Cohort[]> => {
    const { data } = await api.get('/cohorts')
    return data
  },
  getOne: async (id: string): Promise<Cohort> => {
    const { data } = await api.get(`/cohorts/${id}`)
    return data
  },
  create: async (payload: CohortPayload): Promise<Cohort> => {
    const { data } = await api.post('/cohorts', payload)
    return data
  },
  update: async (id: string, payload: Partial<CohortPayload>): Promise<Cohort> => {
    const { data } = await api.put(`/cohorts/${id}`, payload)
    return data
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/cohorts/${id}`)
  },
  getMembers: async (id: string): Promise<User[]> => {
    const { data } = await api.get(`/cohorts/${id}/members`)
    return data
  },
}

export default cohortService
