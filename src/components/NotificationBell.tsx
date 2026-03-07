import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Bell,
  Calendar,
  CheckCircle,
  MessageCircle,
  Trophy,
  UserPlus,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import notificationService from '@/services/notificationService'
import { useNotifications } from '@/hooks/useNotifications'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import type { Notification, NotificationType, User } from '@/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function notificationIcon(type: NotificationType) {
  const cls = 'size-4 shrink-0'
  switch (type) {
    case 'announcement':    return <Bell className={cn(cls, 'text-tekton-blue')} />
    case 'session_reminder':return <Calendar className={cn(cls, 'text-tekton-teal')} />
    case 'assignment':      return <UserPlus className={cn(cls, 'text-tekton-purple-bright')} />
    case 'milestone':       return <Trophy className={cn(cls, 'text-tekton-yellow')} />
    case 'message':         return <MessageCircle className={cn(cls, 'text-tekton-green')} />
    case 'approval':        return <CheckCircle className={cn(cls, 'text-tekton-green')} />
  }
}

function notificationPath(notification: Notification, userRole?: string): string {
  switch (notification.type) {
    case 'announcement':
    case 'session_reminder':
      return '/communication'
    case 'assignment':
      return userRole === 'mentor' ? '/dashboard/mentor' : '/dashboard/mentee'
    case 'milestone':
      return '/roadmap'
    case 'message': {
      const senderId = (notification.metadata?.senderId as string | undefined) ?? ''
      return senderId ? `/messages/${senderId}` : '/messages'
    }
    case 'approval':
      return '/dashboard/mentor'
  }
}

function relativeTime(dateString: string) {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  } catch {
    return ''
  }
}

// ─── Notification Item ────────────────────────────────────────────────────────

interface NotificationItemProps {
  notification: Notification
  userRole?: string
  onRead: (id: string) => Promise<void>
  onClose: () => void
}

function NotificationItem({ notification, userRole, onRead, onClose }: NotificationItemProps) {
  const navigate = useNavigate()

  async function handleClick() {
    if (!notification.read) {
      await onRead(notification.id)
    }
    navigate(notificationPath(notification, userRole))
    onClose()
  }

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
    >
      {/* Unread dot */}
      <span
        className={cn(
          'mt-1.5 size-2 rounded-full shrink-0 transition-colors',
          notification.read ? 'bg-transparent' : 'bg-tekton-purple-bright',
        )}
      />

      {/* Icon */}
      <span className="mt-0.5">{notificationIcon(notification.type)}</span>

      {/* Content */}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <p className={cn('text-sm truncate', notification.read ? 'text-white/70' : 'font-semibold text-white')}>
          {notification.title}
        </p>
        <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">{notification.message}</p>
        <p className="text-[10px] text-white/30 mt-0.5">{relativeTime(notification.createdAt)}</p>
      </div>
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const { user: rawUser } = useAuth()
  const currentUser = rawUser as User | null
  const location = useLocation()

  // Close popover on route change
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const { data: notificationsPage } = useQuery({
    queryKey: ['notifications', 1, 10],
    queryFn: () => notificationService.getAll(1, 10),
    enabled: open,
  })

  const notifications = notificationsPage?.data ?? []

  const badgeLabel = unreadCount > 9 ? '9+' : String(unreadCount)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 text-white/70 transition-colors hover:text-white focus:outline-none"
          aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-tekton-purple-bright text-[9px] font-bold text-white">
              {badgeLabel}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 p-0 bg-black/95 border border-white/10 backdrop-blur-xl shadow-xl rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <span className="text-sm font-semibold text-white">Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="text-xs text-white/50 hover:text-white transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 px-4 text-center">
              <Bell className="size-8 text-white/20" />
              <p className="text-sm text-white/40">You're all caught up! 🎉</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  userRole={currentUser?.role}
                  onRead={markAsRead}
                  onClose={() => setOpen(false)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-white/10 px-4 py-2.5">
            <a
              href="/profile"
              onClick={() => setOpen(false)}
              className="text-xs text-white/50 hover:text-white transition-colors"
            >
              View all notifications →
            </a>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
