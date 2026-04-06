import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Send, Phone, Video, MoreVertical } from 'lucide-react'

const CHATS = [
  { id: 1, name: 'Sarah Johnson', lastMessage: 'Thanks for the advice!', time: '2m ago', unread: 2, online: true },
  { id: 2, name: 'Michael Chen', lastMessage: "Let's schedule a call", time: '1h ago', unread: 0, online: true },
  { id: 3, name: 'Emily Rodriguez', lastMessage: 'Great to connect!', time: '3h ago', unread: 0, online: false },
  { id: 4, name: 'David Kim', lastMessage: 'See you at the event', time: '1d ago', unread: 0, online: false },
]

const MESSAGES = [
  { id: 1, sender: 'Sarah Johnson', content: 'Hi! I saw your profile and would love to discuss career opportunities in tech.', time: '10:30 AM', isMine: false },
  { id: 2, sender: 'You', content: "Hello Sarah! I'd be happy to chat. What specific areas are you interested in?", time: '10:35 AM', isMine: true },
  { id: 3, sender: 'Sarah Johnson', content: "I'm particularly interested in machine learning and AI. I saw you work at Google in that field.", time: '10:37 AM', isMine: false },
  { id: 4, sender: 'You', content: "That's great! ML is a fascinating field. I'd recommend starting with some online courses and building projects.", time: '10:42 AM', isMine: true },
  { id: 5, sender: 'Sarah Johnson', content: 'Thanks for the advice! Would you be available for a mentorship call sometime?', time: '10:45 AM', isMine: false },
]

export function CommunicationPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Communication</h1>
          <p className="text-muted-foreground">Connect with alumni through messages and calls</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {CHATS.map((chat) => (
                  <button
                    key={chat.id}
                    type="button"
                    className="flex w-full items-center gap-3 px-6 py-4 text-left hover:bg-accent"
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={`/.jpg?height=40&width=40&query=${chat.name}`} />
                        <AvatarFallback>{chat.name[0]}</AvatarFallback>
                      </Avatar>
                      {chat.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{chat.name}</div>
                        <div className="text-xs text-muted-foreground">{chat.time}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="truncate text-sm text-muted-foreground">{chat.lastMessage}</div>
                        {chat.unread > 0 && (
                          <Badge className="ml-2">{chat.unread}</Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/thoughtful-woman-portrait.png" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-sm text-muted-foreground">Online</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4 space-y-4">
                {MESSAGES.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.isMine
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`mt-1 text-xs ${message.isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input placeholder="Type a message..." />
                <Button size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Scheduled Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/diverse-group-meeting.png" />
                    <AvatarFallback>MC</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">Michael Chen</div>
                    <div className="text-sm text-muted-foreground">Tomorrow at 3:00 PM</div>
                  </div>
                </div>
                <Button variant="outline">
                  <Video className="mr-2 h-4 w-4" />
                  Join Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
