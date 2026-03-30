// ─── Union Types ─────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'mentor' | 'mentee'

export type UserStatus = 'active' | 'pending_approval' | 'rejected'

export type AnnouncementType = 'important' | 'event' | 'update'

export type NotificationType =
  | 'announcement'
  | 'session_reminder'
  | 'assignment'
  | 'milestone'
  | 'message'
  | 'approval'

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced'

// ─── Tracks ──────────────────────────────────────────────────────────────────

export const TECH_TRACKS = [
  'Software Development (Frontend & Backend)',
  'UI/UX Design',
  'Mobile App Development',
  'Product/Project Management',
  'Quality Assurance (QA)',
  'Data (Analysis/Science)',
  'Cybersecurity',
] as const

export type TechTrack = (typeof TECH_TRACKS)[number]

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface EmailNotificationPreferences {
  announcements: boolean
  sessionReminders: boolean
  weeklyProgress: boolean
  milestoneCompletions: boolean
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  track: string
  cohortId?: string | null
  whatsapp?: string
  bio?: string
  title?: string
  profilePhotoUrl?: string
  experienceYears?: number
  linkedinUrl?: string
  milestone1Completed: number
  milestone2Completed: number
  milestone3Completed: number
  emailNotifications: EmailNotificationPreferences
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: 'mentee' | 'mentor'
  track: string
  whatsapp?: string
  experienceLevel?: ExperienceLevel
  bio?: string
  title?: string
  experienceYears?: number
  linkedinUrl?: string
  profilePhotoUrl?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

// ─── Tasks & Resources ───────────────────────────────────────────────────────

export interface Task {
  id: string
  userId?: string
  taskId: string
  milestone: 1 | 2 | 3
  week: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  title: string
  description: string
  completed: boolean
  createdAt: string
}

export interface Resource {
  id: string
  taskId: string | null
  track: string | null
  title: string
  url: string
  createdBy?: string
  createdAt: string
}

export interface Cohort {
  id: string
  name: string
  number: number
  startDate: string
  endDate: string
  createdAt: string
}

// ─── Announcements & Sessions ────────────────────────────────────────────────

export interface Announcement {
  id: string
  title: string
  content: string
  type: AnnouncementType
  date: string
  createdBy: string
  flierUrl?: string | null
  createdAt: string
}

export interface MentorshipSession {
  id: string
  title: string
  date: string
  time: string
  type: string
  createdBy: string
  createdAt: string
}

// ─── Messaging ───────────────────────────────────────────────────────────────

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  fileUrl?: string
  read: boolean
  createdAt: string
}

export interface Conversation {
  partnerId: string
  partnerName: string
  partnerTrack: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
}

// ─── Notifications ───────────────────────────────────────────────────────────

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  metadata?: Record<string, unknown>
  createdAt: string
}

// ─── Mentorship ──────────────────────────────────────────────────────────────

export interface MentorAssignment {
  id: string
  mentorId: string
  menteeId: string
  assignedBy: string
  cohortId?: string | null
  assignedAt: string
  mentor?: User
  mentee?: User
}

// ─── Certificates & Uploads ──────────────────────────────────────────────────

export interface Certificate {
  id: string
  userId: string
  track: string
  verificationCode: string
  completedAt: string
  pdfUrl: string
  createdAt: string
}

export interface Upload {
  id: string
  userId: string
  taskId?: string
  filename: string
  fileUrl: string
  fileType: string
  fileSize: number
  createdAt: string
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export interface AuditLogEntry {
  id: string
  adminId: string
  action: string
  targetType: string
  targetId: string
  details: Record<string, unknown>
  createdAt: string
  admin?: User
}

export interface PlatformStats {
  totalUsers: number
  totalMentees: number
  totalMentors: number
  totalAdmins: number
  pendingMentors: number
  assignedMentees: number
  unassignedMentees: number
  totalTasks: number
  completedTasks: number
  totalResources: number
  totalAnnouncements: number
  totalSessions: number
}

export interface CompletionRate {
  track: string
  milestone1: number
  milestone2: number
  milestone3: number
  overall: number
}

export interface DropoutData {
  milestone: number
  week: number
  dropoffCount: number
  dropoffPercentage: number
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ─── Public ───────────────────────────────────────────────────────────────────

export interface PublicMentor {
  id: string
  name: string
  track: string
  bio: string
  title: string
  profilePhotoUrl?: string
  linkedinUrl?: string
}
