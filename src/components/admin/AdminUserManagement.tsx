import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import adminService from '@/services/adminService'
import { useToast } from '@/hooks/useToast'
import { formatDate, getInitials } from '@/lib/utils'
import { TECH_TRACKS } from '@/types'
import type { User, UserRole } from '@/types'
import UserProfileDrawer from './UserProfileDrawer'

interface Props {
  currentUserId?: string
}

const roleBadgeClass: Record<string, string> = {
  mentee: 'bg-tekton-blue/15 text-tekton-blue border border-tekton-blue/30',
  mentor: 'bg-tekton-green/15 text-tekton-green border border-tekton-green/30',
  admin: 'bg-tekton-purple-bright/15 text-tekton-purple-bright border border-tekton-purple-bright/30',
}

const statusBadgeClass: Record<string, string> = {
  active: 'bg-tekton-green/15 text-tekton-green border border-tekton-green/30',
  pending_approval: 'bg-tekton-yellow/15 text-tekton-yellow border border-tekton-yellow/30',
  rejected: 'bg-red-500/15 text-red-400 border border-red-500/30',
  alumni: 'bg-tekton-teal/15 text-tekton-teal border border-tekton-teal/30',
  inactive: 'bg-white/10 text-white/50 border border-white/20',
  suspended: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
}

export default function AdminUserManagement({ currentUserId }: Props) {
  const { toast } = useToast()

  const [page, setPage] = useState(1)
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [trackFilter, setTrackFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [changeRoleTarget, setChangeRoleTarget] = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [alumniTarget, setAlumniTarget] = useState<User | null>(null)
  const [markingAlumni, setMarkingAlumni] = useState(false)
  const [newRole, setNewRole] = useState<UserRole>('mentee')
  const [profileTarget, setProfileTarget] = useState<User | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [roleFilter, trackFilter, debouncedSearch])

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-users', page, roleFilter, trackFilter, debouncedSearch],
    queryFn: () =>
      adminService.getUsers({
        page,
        limit: 10,
        role: roleFilter !== 'all' ? (roleFilter as UserRole) : undefined,
        track: trackFilter !== 'all' ? trackFilter : undefined,
      }),
  })

  const filteredUsers = (data?.data ?? []).filter((user) => {
    if (!debouncedSearch) return true
    const q = debouncedSearch.toLowerCase()
    return user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q)
  })

  const totalPages = data?.totalPages ?? 1

  async function handleChangeRole() {
    if (!changeRoleTarget) return
    try {
      await adminService.changeUserRole(changeRoleTarget.id, newRole)
      toast.success(`Role updated to ${newRole} for ${changeRoleTarget.name}.`)
      setChangeRoleTarget(null)
      await refetch()
    } catch {
      toast.error('Failed to change user role.')
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await adminService.deleteUser(deleteTarget.id)
      toast.success(`${deleteTarget.name} has been deleted.`)
      setDeleteTarget(null)
      await refetch()
    } catch {
      toast.error('Failed to delete user.')
    }
  }

  async function handleMarkAlumni() {
    if (!alumniTarget) return
    setMarkingAlumni(true)
    try {
      await adminService.markMentorAlumni(alumniTarget.id)
      toast.success(`${alumniTarget.name} marked as alumni.`)
      setAlumniTarget(null)
      await refetch()
    } catch {
      toast.error('Failed to mark mentor as alumni.')
    } finally {
      setMarkingAlumni(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 bg-white/5 border-white/20 text-white placeholder:text-white/30"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-36 bg-black border-white/20 text-white">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent className="bg-black border-white/10">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="mentee">Mentee</SelectItem>
            <SelectItem value="mentor">Mentor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={trackFilter} onValueChange={setTrackFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-black border-white/20 text-white">
            <SelectValue placeholder="Track" />
          </SelectTrigger>
          <SelectContent className="bg-black border-white/10">
            <SelectItem value="all">All Tracks</SelectItem>
            {TECH_TRACKS.map((track) => (
              <SelectItem key={track} value={track}>{track}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-x-auto">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/40 text-xs uppercase">User</TableHead>
              <TableHead className="text-white/40 text-xs uppercase">Role</TableHead>
              <TableHead className="text-white/40 text-xs uppercase hidden md:table-cell">Track</TableHead>
              <TableHead className="text-white/40 text-xs uppercase hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-white/40 text-xs uppercase hidden lg:table-cell">Joined</TableHead>
              <TableHead className="text-white/40 text-xs uppercase w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-white/10">
                  <TableCell colSpan={6}>
                    <div className="h-4 rounded bg-white/10 animate-pulse w-3/4" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredUsers.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={6} className="text-center py-10 text-white/40 text-sm">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-white/10 hover:bg-white/5 cursor-pointer"
                  onClick={() => setProfileTarget(user)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-gradient-to-br from-tekton-purple-bright to-tekton-teal flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {getInitials(user.name)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm text-white truncate">{user.name}</span>
                        <span className="text-xs text-white/40 truncate">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${roleBadgeClass[user.role] ?? ''}`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-white/70 text-sm hidden md:table-cell">
                    <span className="truncate max-w-[160px] block">{user.track || '—'}</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadgeClass[user.status] ?? ''}`}>
                      {user.status.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell className="text-white/40 text-xs hidden lg:table-cell">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-7 text-white/40 hover:text-white hover:bg-white/10">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-black border-white/10 text-white">
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-white/10"
                          onClick={() => {
                            setNewRole(user.role)
                            setChangeRoleTarget(user)
                          }}
                        >
                          Change Role
                        </DropdownMenuItem>
                        {user.role === 'mentor' && user.status === 'active' && (
                          <DropdownMenuItem
                            className="cursor-pointer text-tekton-teal hover:bg-tekton-teal/10 hover:text-tekton-teal"
                            onClick={() => setAlumniTarget(user)}
                          >
                            Mark as Alumni
                          </DropdownMenuItem>
                        )}
                        {user.id !== currentUserId && (
                          <DropdownMenuItem
                            className="cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-400"
                            onClick={() => setDeleteTarget(user)}
                          >
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-white/50">
        <span>Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white/70 hover:bg-white/10 disabled:opacity-30"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="size-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white/70 hover:bg-white/10 disabled:opacity-30"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="size-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Change Role Dialog */}
      <Dialog open={!!changeRoleTarget} onOpenChange={(o) => !o && setChangeRoleTarget(null)}>
        <DialogContent className="bg-black/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Change Role — {changeRoleTarget?.name}</DialogTitle>
            <DialogDescription className="text-white/50">
              Select a new role for this user.
            </DialogDescription>
          </DialogHeader>
          <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10 text-white">
              <SelectItem value="mentee">Mentee</SelectItem>
              <SelectItem value="mentor">Mentor</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" className="border-white/20 text-white/70" onClick={() => setChangeRoleTarget(null)}>
              Cancel
            </Button>
            <Button onClick={handleChangeRole} className="bg-tekton-purple-bright text-white hover:bg-tekton-purple-bright/90">
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mark Alumni Dialog */}
      <Dialog open={!!alumniTarget} onOpenChange={(o) => !o && !markingAlumni && setAlumniTarget(null)}>
        <DialogContent className="bg-black/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Mark as Alumni</DialogTitle>
            <DialogDescription className="text-white/50">
              <span className="text-white font-medium">{alumniTarget?.name}</span> will be moved to alumni status. They will no longer appear on the public mentors page or be available for new assignments. Their existing assignment history is preserved.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" disabled={markingAlumni} className="border-white/20 text-white/70" onClick={() => setAlumniTarget(null)}>
              Cancel
            </Button>
            <Button
              disabled={markingAlumni}
              onClick={handleMarkAlumni}
              className="bg-tekton-teal/20 text-tekton-teal border border-tekton-teal/30 hover:bg-tekton-teal/30"
            >
              {markingAlumni ? 'Marking…' : 'Confirm'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="bg-black/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription className="text-white/50">
              Are you sure you want to delete <span className="text-white font-medium">{deleteTarget?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" className="border-white/20 text-white/70" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UserProfileDrawer user={profileTarget} onClose={() => setProfileTarget(null)} />

    </div>
  )
}
