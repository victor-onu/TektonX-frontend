import { useCallback, useEffect } from 'react'
import { useQueryClient, useQuery } from '@tanstack/react-query'

import notificationService from '@/services/notificationService'
import { useAuth } from '@/hooks/useAuth'
import { useSocket } from '@/hooks/useSocket'

export function useNotifications() {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const socket = useSocket(isAuthenticated)

  const { data, isLoading } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: notificationService.getUnreadCount,
    staleTime: 30 * 1000, // 30 seconds
    enabled: isAuthenticated,
  })

  const unreadCount = data?.count ?? 0

  // Listen for new notifications via socket
  const handleNewNotification = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }, [queryClient])

  useEffect(() => {
    socket.on('new_notification', handleNewNotification)
    return () => socket.off('new_notification', handleNewNotification)
  }, [socket, handleNewNotification])

  const markAsRead = useCallback(
    async (id: string) => {
      // Optimistic update
      queryClient.setQueryData<{ count: number }>(['notifications-unread-count'], (old) => ({
        count: Math.max(0, (old?.count ?? 1) - 1),
      }))
      await notificationService.markAsRead(id)
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    [queryClient],
  )

  const markAllAsRead = useCallback(async () => {
    // Optimistic update
    queryClient.setQueryData<{ count: number }>(['notifications-unread-count'], { count: 0 })
    await notificationService.markAllAsRead()
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
    queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
  }, [queryClient])

  return { unreadCount, markAsRead, markAllAsRead, isLoading }
}
