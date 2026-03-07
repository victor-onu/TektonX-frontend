import api from '@/lib/api'
import type { CompletionRate, DropoutData } from '@/types'

const analyticsService = {
  getCompletionRates: async (): Promise<CompletionRate[]> => {
    const { data } = await api.get('/analytics/completion-rates')
    return data
  },

  getDropoutData: async (): Promise<DropoutData[]> => {
    const { data } = await api.get('/analytics/dropout')
    return data
  },

  getCohortComparison: async (): Promise<unknown> => {
    const { data } = await api.get('/analytics/cohort-comparison')
    return data
  },

  getMentorEffectiveness: async (): Promise<unknown> => {
    const { data } = await api.get('/analytics/mentor-effectiveness')
    return data
  },

  exportData: async (format: 'csv' | 'pdf'): Promise<Blob> => {
    const { data } = await api.get('/analytics/export', {
      params: { format },
      responseType: 'blob',
    })
    return data
  },
}

export default analyticsService
