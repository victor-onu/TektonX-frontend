import api from '@/lib/api'

export interface CommunityMemberPayload {
  name: string
  email: string
  phone?: string
  state: string
}

export interface CommunityMember {
  id: string
  name: string
  email: string
  phone: string | null
  state: string
  createdAt: string
}

const communityMemberService = {
  submit: async (payload: CommunityMemberPayload): Promise<{ message: string }> => {
    const { data } = await api.post('/community-members', payload)
    return data
  },
  getAll: async (): Promise<CommunityMember[]> => {
    const { data } = await api.get('/community-members')
    return data
  },
  export: async (): Promise<Blob> => {
    const { data } = await api.get('/community-members/export', {
      responseType: 'blob',
    })
    return data
  },
}

export default communityMemberService
