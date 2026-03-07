import api from '@/lib/api'
import type { User, UserRole, UserStatus, MentorAssignment, PlatformStats, Task, AuditLogEntry, PaginatedResponse } from '@/types'

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
}

export default adminService
