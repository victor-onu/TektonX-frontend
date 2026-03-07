import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Paperclip, Send } from 'lucide-react'
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns'

import messageService from '@/services/messageService'
import { useAuth } from '@/hooks/useAuth'
import { useSocket } from '@/hooks/useSocket'
import { cn, getInitials } from '@/lib/utils'
import type { Conversation, Message, User } from '@/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function relativeTime(dateString: string) {
  const date = new Date(dateString)
  if (isToday(date)) return formatDistanceToNow(date, { addSuffix: true })
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMM d')
}

function dayLabel(dateString: string) {
  const date = new Date(dateString)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMMM d')
}

function groupByDay(messages: Message[]): Array<{ day: string; messages: Message[] }> {
  const groups: Record<string, Message[]> = {}
  for (const msg of messages) {
    const day = format(new Date(msg.createdAt), 'yyyy-MM-dd')
    if (!groups[day]) groups[day] = []
    groups[day].push(msg)
  }
  return Object.entries(groups).map(([, msgs]) => ({
    day: dayLabel(msgs[0].createdAt),
    messages: msgs,
  }))
}

// ─── Conversation Item ────────────────────────────────────────────────────────

interface ConversationItemProps {
  conv: Conversation
  active: boolean
  onClick: () => void
}

function ConversationItem({ conv, active, onClick }: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 text-left transition-all',
        active
          ? 'bg-white/5 border-l-2 border-tekton-purple-bright'
          : 'border-l-2 border-transparent hover:bg-white/3',
      )}
    >
      {/* Avatar */}
      <div className="size-10 rounded-full bg-gradient-to-br from-tekton-purple-bright to-tekton-purple-deep flex items-center justify-center text-white text-sm font-semibold shrink-0">
        {getInitials(conv.partnerName)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={cn('text-sm truncate', conv.unreadCount > 0 ? 'font-bold text-white' : 'font-medium text-white/80')}>
            {conv.partnerName}
          </span>
          <span className="text-[10px] text-white/30 shrink-0">{relativeTime(conv.lastMessageAt)}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-white/40 truncate max-w-[160px]">{conv.lastMessage}</p>
          {conv.unreadCount > 0 && (
            <span className="inline-flex size-4 items-center justify-center rounded-full bg-tekton-purple-bright text-[10px] font-bold text-white shrink-0">
              {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg, isSelf }: { msg: Message; isSelf: boolean }) {
  return (
    <div className={cn('flex', isSelf ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] rounded-2xl px-4 py-2.5 flex flex-col gap-1',
          isSelf
            ? 'bg-tekton-purple-bright text-white rounded-br-sm'
            : 'bg-white/8 border border-white/10 text-white rounded-bl-sm',
        )}
      >
        <p className="text-sm leading-relaxed">{msg.content}</p>
        {msg.fileUrl && (
          <a
            href={msg.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'text-xs underline underline-offset-2 transition-colors',
              isSelf ? 'text-white/70 hover:text-white' : 'text-tekton-blue hover:text-tekton-blue/80',
            )}
          >
            📎 Attachment
          </a>
        )}
        <span className={cn('text-[10px] self-end', isSelf ? 'text-white/50' : 'text-white/30')}>
          {format(new Date(msg.createdAt), 'h:mm a')}
        </span>
      </div>
    </div>
  )
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────

interface ChatPanelProps {
  partnerId: string
  partnerName: string
  partnerTrack: string
  currentUserId: string
  onBack: () => void
  socket: ReturnType<typeof useSocket>
}

function ChatPanel({ partnerId, partnerName, partnerTrack, currentUserId, onBack, socket }: ChatPanelProps) {
  const queryClient = useQueryClient()
  const [inputValue, setInputValue] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', partnerId],
    queryFn: () => messageService.getMessages(partnerId),
  })

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mark unread messages as read when opening conversation
  useEffect(() => {
    const unread = messages.filter((m) => !m.read && m.senderId !== currentUserId)
    for (const msg of unread) {
      messageService.markAsRead(msg.id).catch(() => {})
    }
  }, [messages, currentUserId])

  // Listen for new messages via socket
  const handleNewMessage = useCallback(
    (msg: unknown) => {
      const newMsg = msg as Message
      if (newMsg.senderId === partnerId || newMsg.receiverId === partnerId) {
        queryClient.setQueryData<Message[]>(['messages', partnerId], (old = []) => [...old, newMsg])
        // Also update conversations list
        queryClient.invalidateQueries({ queryKey: ['conversations'] })
      }
    },
    [partnerId, queryClient],
  )

  useEffect(() => {
    socket.on('new_message', handleNewMessage)
    return () => socket.off('new_message', handleNewMessage)
  }, [socket, handleNewMessage])

  async function handleSend() {
    const content = inputValue.trim()
    if (!content || sending) return
    setSending(true)
    try {
      const newMsg = await messageService.sendMessage(partnerId, content)
      queryClient.setQueryData<Message[]>(['messages', partnerId], (old = []) => [...old, newMsg])
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      setInputValue('')
      if (textareaRef.current) textareaRef.current.style.height = 'auto'
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleTextareaInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 96)}px` // max ~4 lines
  }

  const grouped = groupByDay(messages)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="lg:hidden inline-flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="size-9 rounded-full bg-gradient-to-br from-tekton-purple-bright to-tekton-purple-deep flex items-center justify-center text-white text-sm font-semibold shrink-0">
          {getInitials(partnerName)}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-white truncate">{partnerName}</span>
          <span className="text-xs text-white/40 truncate">{partnerTrack}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col gap-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className={cn('flex', i % 2 === 0 ? 'justify-end' : 'justify-start')}>
                <div className="h-10 w-48 rounded-2xl bg-white/10" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-white/30">
            No messages yet. Start the conversation!
          </div>
        ) : (
          grouped.map(({ day, messages: dayMsgs }) => (
            <div key={day} className="flex flex-col gap-2">
              {/* Day separator */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[11px] text-white/30">{day}</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              {dayMsgs.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} isSelf={msg.senderId === currentUserId} />
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-5 py-3 border-t border-white/10">
        <div className="flex items-end gap-2">
          <button
            className="shrink-0 p-2 rounded-lg text-white/30 hover:text-white/60 transition-colors"
            title="Attach file (coming soon)"
            onClick={() => {}}
          >
            <Paperclip className="size-4" />
          </button>
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-tekton-purple-bright transition-colors overflow-hidden"
            style={{ minHeight: '40px', maxHeight: '96px' }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || sending}
            className="shrink-0 p-2 rounded-xl bg-tekton-purple-bright text-white disabled:opacity-40 hover:bg-tekton-purple-bright/80 transition-colors"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Messages() {
  const { userId: paramUserId } = useParams<{ userId?: string }>()
  const navigate = useNavigate()
  const { user: rawUser, isAuthenticated } = useAuth()
  const currentUser = rawUser as User | null
  const socket = useSocket(isAuthenticated)

  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(paramUserId ?? null)
  const [showChat, setShowChat] = useState(!!paramUserId)

  const queryClient = useQueryClient()

  const { data: conversations = [], isLoading: convLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: messageService.getConversations,
  })

  // Keep URL in sync with selected conversation
  useEffect(() => {
    if (selectedPartnerId) {
      navigate(`/messages/${selectedPartnerId}`, { replace: true })
    } else {
      navigate('/messages', { replace: true })
    }
  }, [selectedPartnerId, navigate])

  // Handle incoming messages to update unread counts in conversation list
  const handleNewMessage = useCallback(
    (msg: unknown) => {
      const newMsg = msg as { senderId: string; receiverId: string }
      if (newMsg.senderId !== currentUser?.id && newMsg.senderId !== selectedPartnerId) {
        // Increment unread for that conversation
        queryClient.invalidateQueries({ queryKey: ['conversations'] })
      }
    },
    [currentUser?.id, selectedPartnerId, queryClient],
  )

  useEffect(() => {
    socket.on('new_message', handleNewMessage)
    return () => socket.off('new_message', handleNewMessage)
  }, [socket, handleNewMessage])

  function selectConversation(partnerId: string) {
    setSelectedPartnerId(partnerId)
    setShowChat(true)
    // Reset unread count optimistically
    queryClient.setQueryData<Conversation[]>(['conversations'], (old = []) =>
      old.map((c) => (c.partnerId === partnerId ? { ...c, unreadCount: 0 } : c)),
    )
  }

  const selectedConversation = conversations.find((c) => c.partnerId === selectedPartnerId)

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="mx-auto max-w-6xl h-[calc(100vh-64px)] flex border-x border-white/5">

        {/* ── Conversations List ── */}
        <div
          className={cn(
            'flex flex-col border-r border-white/10 bg-black',
            'w-full lg:w-80 lg:flex shrink-0',
            showChat ? 'hidden lg:flex' : 'flex',
          )}
        >
          {/* Header */}
          <div className="px-5 py-5 border-b border-white/10 flex flex-col gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 w-fit text-sm text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
            <h1 className="font-heading text-2xl text-white">MESSAGES</h1>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {convLoading ? (
              <div className="flex flex-col gap-0 animate-pulse p-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 py-3">
                    <div className="size-10 rounded-full bg-white/10 shrink-0" />
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="h-3.5 w-32 rounded bg-white/10" />
                      <div className="h-3 w-48 rounded bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-sm text-white/40 text-center leading-relaxed">
                No conversations yet. Messages with your assigned mentor/mentees will appear here.
              </div>
            ) : (
              conversations.map((conv) => (
                <ConversationItem
                  key={conv.partnerId}
                  conv={conv}
                  active={conv.partnerId === selectedPartnerId}
                  onClick={() => selectConversation(conv.partnerId)}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Chat Panel ── */}
        <div
          className={cn(
            'flex-1 bg-black flex flex-col',
            showChat ? 'flex' : 'hidden lg:flex',
          )}
        >
          {selectedPartnerId && selectedConversation ? (
            <ChatPanel
              partnerId={selectedPartnerId}
              partnerName={selectedConversation.partnerName}
              partnerTrack={selectedConversation.partnerTrack}
              currentUserId={currentUser?.id ?? ''}
              onBack={() => { setShowChat(false); setSelectedPartnerId(null) }}
              socket={socket}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
              <div className="size-16 rounded-full bg-white/5 flex items-center justify-center">
                <Send className="size-7 text-white/20" />
              </div>
              <p className="text-sm text-white/40 max-w-xs">
                Select a conversation to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
