import api from '@/lib/api'
import type { PublicMentor, MentorAssignment } from '@/types'

const mentorService = {
  getPublicMentors: async (track?: string): Promise<PublicMentor[]> => {
    const params = track ? { track } : {}
    const { data } = await api.get('/mentors', { params })
    return data
  },
  getMyAssignment: async (): Promise<MentorAssignment | null> => {
    try {
      const { data } = await api.get('/assignments/my')
      return data
    } catch {
      return null
    }
  },
}

export default mentorService
