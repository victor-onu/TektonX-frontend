import api from '@/lib/api'

export interface PartnershipInquiryPayload {
  companyName: string
  contactName: string
  email: string
  phone?: string
  partnershipType: 'sponsor' | 'hiring' | 'both'
  message?: string
}

export interface PartnershipInquiry {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string | null
  partnershipType: string
  message: string | null
  createdAt: string
}

const partnershipService = {
  submit: async (payload: PartnershipInquiryPayload): Promise<{ message: string }> => {
    const { data } = await api.post('/partnerships', payload)
    return data
  },
  getAll: async (): Promise<PartnershipInquiry[]> => {
    const { data } = await api.get('/partnerships')
    return data
  },
}

export default partnershipService
