import api from '@/lib/api'
import type { Certificate } from '@/types'

interface CertificateWithUser extends Certificate {
  user?: {
    name: string
    track: string
  }
}

const certificateService = {
  getMyCertificate: async (): Promise<Certificate | null> => {
    try {
      const { data } = await api.get('/certificates/me')
      return data
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 404) return null
      throw err
    }
  },

  verifyCertificate: async (code: string): Promise<CertificateWithUser> => {
    const { data } = await api.get(`/certificates/verify/${code}`)
    return data
  },
}

export default certificateService
