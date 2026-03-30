import api from '@/lib/api'
import type { User, UserRole, UserStatus, ApplicationStatus, MentorAssignment, PlatformStats, Task, AuditLogEntry, PaginatedResponse } from '@/types'

interface UserFilters {
  role?: UserRole
  status?: UserStatus
  track?: string
  page?: number
  limit?: number
}

interface AuditFilters {
  action?: string
  page?: number
  limit?: number
}

const adminService = {
  // Stats
  getStats: async (): Promise<PlatformStats> => {
    const { data } = await api.get('/admin/stats')
    return data
  },

  // Users
  getUsers: async (filters?: UserFilters): Promise<PaginatedResponse<User>> => {
    const { data } = await api.get('/admin/users', { params: filters })
    return data
  },
  changeUserRole: async (userId: string, newRole: UserRole): Promise<User> => {
    const { data } = await api.put(`/admin/users/${userId}/role`, { role: newRole })
    return data
  },
  deleteUser: async (userId: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/admin/users/${userId}`)
    return data
  },

  // Mentor approval
  getPendingMentors: async (): Promise<User[]> => {
    const { data } = await api.get('/admin/mentors/pending')
    return data
  },
  approveMentor: async (mentorId: string): Promise<User> => {
    const { data } = await api.put(`/admin/mentors/${mentorId}/approve`)
    return data
  },
  rejectMentor: async (mentorId: string, reason?: string): Promise<User> => {
    const { data } = await api.put(`/admin/mentors/${mentorId}/reject`, { reason })
    return data
  },

  // Assignments
  getAssignments: async (): Promise<MentorAssignment[]> => {
    const { data } = await api.get('/admin/assignments')
    return data
  },
  getUnassignedMentees: async (track?: string): Promise<User[]> => {
    const { data } = await api.get('/admin/assignments/unassigned', { params: track ? { track } : {} })
    return data
  },
  assignMentees: async (mentorId: string, menteeIds: string[], cohortId?: string): Promise<MentorAssignment[]> => {
    const { data } = await api.post('/admin/assignments', { mentorId, menteeIds, cohortId })
    return data
  },
  unassignMentee: async (assignmentId: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/admin/assignments/${assignmentId}`)
    return data
  },

  // Content — tasks
  createTask: async (payload: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    const { data } = await api.post('/admin/tasks', payload)
    return data
  },
  updateTask: async (id: string, payload: Partial<Task>): Promise<Task> => {
    const { data } = await api.put(`/admin/tasks/${id}`, payload)
    return data
  },
  deleteTask: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/admin/tasks/${id}`)
    return data
  },

  // Audit log
  getAuditLog: async (filters?: AuditFilters): Promise<PaginatedResponse<AuditLogEntry>> => {
    const { data } = await api.get('/admin/audit-log', { params: filters })
    return data
  },

  // Applicants & invites
  getApplicants: async (): Promise<User[]> => {
    const { data } = await api.get('/admin/applicants')
    return data
  },
  updateMenteeStatus: async (menteeId: string, status: ApplicationStatus): Promise<User> => {
    const { data } = await api.patch(`/admin/mentees/${menteeId}/status`, { status })
    return data
  },
  inviteMentee: async (payload: { name: string; email: string; track: string }): Promise<User> => {
    const { data } = await api.post('/admin/invite', payload)
    return data
  },
  inviteBulk: async (file: File): Promise<{ sent: number; failed: number; errors: string[] }> => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post('/admin/invite/bulk', formData, { headers: { 'Content-Type': undefined } })
    return data
  },
  downloadSampleCsv: (): void => {
    const a = document.createElement('a')
    a.href = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'}/admin/invite/sample-csv`
    a.download = 'tektonx-invite-sample.csv'
    a.click()
  },
}

export default adminService
