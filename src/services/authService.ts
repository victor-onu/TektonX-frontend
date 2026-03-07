import api from '@/lib/api'
import type { User, LoginRequest, RegisterRequest } from '@/types'

const ACCESS_TOKEN_KEY = 'tektonx_access_token'
const REFRESH_TOKEN_KEY = 'tektonx_refresh_token'

interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

interface MessageResponse {
  message: string
}

const authService = {
  login: async (dto: LoginRequest): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', dto)
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken)
    return data
  },

  register: async (dto: RegisterRequest): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>('/auth/register', dto)
    return data
  },

  forgotPassword: async (email: string): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>('/auth/forgot-password', { email })
    return data
  },

  resetPassword: async (token: string, newPassword: string): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>('/auth/reset-password', { token, newPassword })
    return data
  },

  logout: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
}

export default authService
