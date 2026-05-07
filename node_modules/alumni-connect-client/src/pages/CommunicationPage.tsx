import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, MoreVertical } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/context/auth-context'
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket'

type Partner = { id: string; name: string; photo: string; email?: string }

type ConversationRow = {
  partner: Partner
  lastMessage: string
  lastAt: string
}

type ThreadMsg = {
  id: string
  body: string
  createdAt: string
  isMine: boolean
  from?: string
  to?: string
}

type SendMessageResponse = {
  userMessage: ThreadMsg
  aiMessage: ThreadMsg
}

export function CommunicationPage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const withParam = searchParams.get('with')

  const [conversations, setConversations] = useState<ConversationRow[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [thread, setThread] = useState<ThreadMsg[]>([])
  const [draft, setDraft] = useState('')
  const [loadingList, setLoadingList] = useState(true)
  const [loadingThread, setLoadingThread] = useState(false)

  const selectedPartner = conversations.find((c) => c.partner.id === selectedId)?.partner

  const loadConversations = useCallback(async () => {
    try {
      const rows = await api<ConversationRow[]>('/api/messages/conversations')
      setConversations(rows)
      return rows
    } catch (error) {
      console.error('Failed to load conversations:', error)
      return []
    }
  }, [])

  useEffect(() => {
    loadConversations().finally(() => setLoadingList(false))
  }, [loadConversations])

  const loadThread = useCallback(async (userId: string) => {
    setLoadingThread(true)
    try {
      const msgs = await api<ThreadMsg[]>(`/api/messages/thread/${userId}`)
      setThread(msgs)
    } catch (error) {
      console.error('Failed to load thread:', error)
      setThread([])
    } finally {
      setLoadingThread(false)
    }
  }, [])

  useEffect(() => {
    if (!withParam) return
    setSelectedId(withParam)
    loadThread(withParam)
  }, [withParam, loadThread])

  function selectPartner(id: string) {
    setSelectedId(id)
    setSearchParams({ with: id })
    loadThread(id)
  }

  useEffect(() => {
    if (!user?.id) return
    const socket = connectSocket(user.id)
    if (!socket) return

    const onReceiveMessage = (incoming: ThreadMsg) => {
      const activePartnerId = selectedId
      const sameThread =
        !!activePartnerId && (incoming.from === activePartnerId || incoming.to === activePartnerId)

      if (sameThread) {
        setThread((prev) => {
          if (prev.some((m) => m.id === incoming.id)) return prev
          return [...prev, incoming]
        })
      }

      loadConversations().catch((error) => {
        console.error('Failed to refresh conversations from socket:', error)
      })
    }

    socket.on('receiveMessage', onReceiveMessage)
    return () => {
      socket.off('receiveMessage', onReceiveMessage)
      disconnectSocket()
    }
  }, [user?.id, selectedId, loadConversations])

  async function sendMessage() {
    if (!selectedId || !draft.trim()) return
    const messageText = draft.trim()
    setDraft('')

    const optimisticMessage: ThreadMsg = {
      id: `tmp-${Date.now()}`,
      body: messageText,
      createdAt: new Date().toISOString(),
      isMine: true,
      from: user?.id,
      to: selectedId,
    }
    setThread((prev) => [...prev, optimisticMessage])

    try {
      const result = await api<SendMessageResponse>('/api/messages', {
        method: 'POST',
        body: JSON.stringify({ toUserId: selectedId, body: messageText }),
      })

      setThread((prev) => {
        const withoutTmp = prev.filter((m) => m.id !== optimisticMessage.id)
        const merged = [result.userMessage, result.aiMessage, ...withoutTmp]
        const deduped = Array.from(new Map(merged.map((m) => [m.id, m])).values())
        return deduped.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      })
      await loadConversations()
    } catch (error) {
      console.error('Failed to send message:', error)
      setThread((prev) => prev.filter((m) => m.id !== optimisticMessage.id))
      setDraft(messageText)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Communication</h1>
          <p className="text-muted-foreground">Connect with alumni through messages</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loadingList ? (
                <p className="px-6 py-8 text-sm text-muted-foreground">Loading conversations…</p>
              ) : conversations.length === 0 ? (
                <p className="px-6 py-8 text-sm text-muted-foreground">
                  No conversations yet. Open someone&apos;s profile from the directory and click &quot;Send
                  message&quot;.
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {conversations.map((row) => (
                    <button
                      key={row.partner.id}
                      type="button"
                      onClick={() => selectPartner(row.partner.id)}
                      className={`flex w-full items-center gap-3 px-6 py-4 text-left hover:bg-accent ${
                        selectedId === row.partner.id ? 'bg-accent/60' : ''
                      }`}
                    >
                      <Avatar>
                        <AvatarImage src={row.partner.photo || '/placeholder.svg'} alt={row.partner.name} />
                        <AvatarFallback>{row.partner.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">{row.partner.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(row.lastAt), { addSuffix: true })}
                          </div>
                        </div>
                        <div className="truncate text-sm text-muted-foreground">{row.lastMessage}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedPartner?.photo || '/placeholder.svg'} />
                    <AvatarFallback>
                      {selectedPartner?.name?.[0] ?? '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{selectedPartner?.name ?? 'Select a conversation'}</div>
                    {selectedPartner && (
                      <Link
                        to={`/profile/${selectedPartner.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View profile
                      </Link>
                    )}
                  </div>
                </div>
                {selectedPartner && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" type="button" disabled title="Coming soon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {!selectedId ? (
                <p className="text-sm text-muted-foreground">Choose a conversation or start one from a profile.</p>
              ) : loadingThread ? (
                <p className="text-sm text-muted-foreground">Loading messages…</p>
              ) : (
                <div className="mb-4 max-h-[420px] space-y-4 overflow-y-auto">
                  {thread.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.isMine
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.body}</p>
                        <p
                          className={`mt-1 text-xs ${
                            message.isMine ? 'text-primary-foreground/80' : 'text-muted-foreground'
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedId && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message…"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                  />
                  <Button size="icon" type="button" onClick={sendMessage} disabled={!draft.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Signed in as <strong className="text-foreground">{user?.name}</strong>. Use the directory to find alumni,
            then open their profile and choose <strong className="text-foreground">Send message</strong> to start a
            thread.
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
