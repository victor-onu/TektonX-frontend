import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Users, GraduationCap, UserCheck, Shield, Link as LinkIcon, CheckCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import adminService from '@/services/adminService'
import { calculateProgress } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import type { User } from '@/types'
import AdminOverview from '@/components/admin/AdminOverview'
import AdminUserManagement from '@/components/admin/AdminUserManagement'
import AdminPendingMentors from '@/components/admin/AdminPendingMentors'
import AdminMenteeAssignment from '@/components/admin/AdminMenteeAssignment'
import AdminContentManagement from '@/components/admin/AdminContentManagement'
import AdminCohortManagement from '@/components/admin/AdminCohortManagement'
import AdminAnalytics from '@/components/admin/AdminAnalytics'
import AdminAuditLog from '@/components/admin/AdminAuditLog'
import AdminApplicants from '@/components/admin/AdminApplicants'
import AdminInvite from '@/components/admin/AdminInvite'
import AdminPartnerships from '@/components/admin/AdminPartnerships'
import AdminBroadcast from '@/components/admin/AdminBroadcast'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { user: rawUser } = useAuth()
  const currentUser = rawUser as User | null

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getStats,
  })

  const { data: pendingMentors = [] } = useQuery({
    queryKey: ['admin-pending-mentors'],
    queryFn: adminService.getPendingMentors,
  })

  const assignmentCoverage = stats
    ? calculateProgress(stats.assignedMentees, stats.totalMentees)
    : 0

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers, Icon: Users, color: 'text-white' },
    { label: 'Mentees', value: stats?.totalMentees, Icon: GraduationCap, color: 'text-tekton-blue' },
    {
      label: 'Mentors',
      value: stats?.totalMentors,
      Icon: UserCheck,
      color: 'text-tekton-green',
      badge: stats?.pendingMentors && stats.pendingMentors > 0 ? `${stats.pendingMentors} pending` : undefined,
    },
    { label: 'Admins', value: stats?.totalAdmins, Icon: Shield, color: 'text-tekton-purple-bright' },
    { label: 'Assignment Coverage', value: `${assignmentCoverage}%`, Icon: LinkIcon, color: 'text-tekton-teal' },
    { label: 'Tasks Completed', value: stats?.completedTasks, Icon: CheckCircle, color: 'text-tekton-yellow' },
  ]

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4">
      <div className="mx-auto max-w-7xl flex flex-col gap-8">

        {/* Page heading */}
        <div>
          <h1 className="font-heading text-4xl text-white sm:text-5xl">
            ADMIN <span className="gradient-text">DASHBOARD</span>
          </h1>
          {currentUser && (
            <p className="mt-1 text-sm text-white/50">Logged in as {currentUser.name}</p>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {statCards.map(({ label, value, Icon, color, badge }) => (
            <div key={label} className="glass-card rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Icon className={`size-4 ${color}`} />
                {badge && (
                  <span className="inline-flex items-center rounded-full bg-tekton-yellow/15 border border-tekton-yellow/30 px-1.5 py-0.5 text-[10px] font-medium text-tekton-yellow">
                    {badge}
                  </span>
                )}
              </div>
              {statsLoading ? (
                <div className="h-7 w-12 rounded bg-white/10 animate-pulse" />
              ) : (
                <p className={`font-heading text-2xl leading-none ${color}`}>{value ?? '—'}</p>
              )}
              <p className="text-[11px] text-white/40 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-auto flex-wrap bg-white/5 border border-white/10 p-1 gap-1 rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-tekton-purple-bright data-[state=active]:text-white text-white/60 rounded-md text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-tekton-purple-bright data-[state=active]:text-white text-white/60 rounded-md text-xs sm:text-sm">
              User Management
            </TabsTrigger>
            <TabsTrigger value="pending-mentors" className="data-[state=active]:bg-tekton-purple-bright data-[state=active]:text-white text-white/60 rounded-md text-xs sm:text-sm">
              Pending Mentors
              {pendingMentors.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-tekton-yellow text-black text-[10px] font-bold size-4">
                  {pendingMentors.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-tekton-purple-bright data-[state=active]:text-white text-white/60 rounded-md text-xs sm:text-sm">
              Mentee Assignment
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-tekton-purple-bright data-[state=active]:text-white text-white/60 rounded-md text-xs sm:text-sm">
              Content Management
            </TabsTrigger>
            <TabsTrigger value="cohorts" className="data-[state=active]:bg-tekton-purple-bright data-[state=active]:text-white text-white/60 rounded-md text-xs sm:text-sm">
              Cohorts
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-tekton-purple-bright data-[state=active]:text-white text-white/60 rounded-md text-xs sm:text-sm">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-tekton-purple-bright data-[state=active]:text-white text-white/60 rounded-md text-xs sm:text-sm">
              Audit Log
            </TabsTrigger>
            <TabsTrigger value="applicants" className="data-[state=active]:bg-tekton-purple-bright data-[state=active]:text-white text-white/60 rounded-md text-xs sm:text-sm">
              Applicants
            </TabsTrigger>
            <TabsTrigger value="invite" className="data-[state=active]:bg-tekton-purple-bright data-[state=active]:text-white text-white/60 rounded-md text-xs sm:text-sm">
              Invite
            </TabsTrigger>
            <TabsTrigger value="partnerships" className="data-[state=active]:bg-tekton-purple-bright data-[state=active]:text-white text-white/60 rounded-md text-xs sm:text-sm">
              Partnerships
            </TabsTrigger>
            <TabsTrigger value="broadcast" className="data-[state=active]:bg-tekton-purple-bright data-[state=active]:text-white text-white/60 rounded-md text-xs sm:text-sm">
              Broadcast
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <AdminOverview stats={stats} statsLoading={statsLoading} onTabChange={setActiveTab} />
          </TabsContent>
          <TabsContent value="users" className="mt-6">
            <AdminUserManagement currentUserId={currentUser?.id} />
          </TabsContent>
          <TabsContent value="pending-mentors" className="mt-6">
            <AdminPendingMentors />
          </TabsContent>
          <TabsContent value="assignments" className="mt-6">
            <AdminMenteeAssignment />
          </TabsContent>
          <TabsContent value="content" className="mt-6">
            <AdminContentManagement />
          </TabsContent>
          <TabsContent value="cohorts" className="mt-6">
            <AdminCohortManagement />
          </TabsContent>
          <TabsContent value="analytics" className="mt-6">
            <AdminAnalytics />
          </TabsContent>
          <TabsContent value="audit" className="mt-6">
            <AdminAuditLog />
          </TabsContent>
          <TabsContent value="applicants" className="mt-6">
            <AdminApplicants />
          </TabsContent>
          <TabsContent value="invite" className="mt-6">
            <AdminInvite />
          </TabsContent>
          <TabsContent value="partnerships" className="mt-6">
            <AdminPartnerships />
          </TabsContent>
          <TabsContent value="broadcast" className="mt-6">
            <AdminBroadcast />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  )
}
