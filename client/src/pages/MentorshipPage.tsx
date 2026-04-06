import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Video } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const MENTORS = [
  { id: 1, name: 'Sarah Johnson', role: 'Senior Software Engineer', company: 'Google', expertise: ['AI/ML', 'Career Development'], available: true },
  { id: 2, name: 'Michael Chen', role: 'Product Manager', company: 'Microsoft', expertise: ['Product Strategy', 'Leadership'], available: true },
  { id: 3, name: 'Emily Rodriguez', role: 'Engineering Manager', company: 'Amazon', expertise: ['Team Management', 'System Design'], available: false },
]

const UPCOMING = [
  { id: 1, mentor: 'Sarah Johnson', date: 'Dec 18, 2024', time: '3:00 PM - 4:00 PM', type: 'Video Call' },
  { id: 2, mentor: 'Robert Taylor', date: 'Dec 20, 2024', time: '2:00 PM - 3:00 PM', type: 'Video Call' },
]

export function MentorshipPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Mentorship Program</h1>
          <p className="text-muted-foreground">Connect with experienced alumni for guidance and career advice</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {UPCOMING.length > 0 ? (
              <div className="space-y-4">
                {UPCOMING.map((session) => (
                  <div key={session.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={`/.jpg?height=48&width=48&query=${session.mentor}`} />
                        <AvatarFallback>{session.mentor[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{session.mentor}</div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {session.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            {session.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Reschedule</Button>
                      <Button size="sm">Join Meeting</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No upcoming sessions</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Mentors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {MENTORS.map((mentor) => (
                <div key={mentor.id} className="rounded-lg border border-border p-4">
                  <div className="mb-4 flex items-start justify-between">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`/.jpg?height=64&width=64&query=${mentor.name}`} />
                      <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                    </Avatar>
                    {mentor.available && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-600">
                        Available
                      </Badge>
                    )}
                  </div>
                  <h3 className="mb-1 font-semibold">{mentor.name}</h3>
                  <p className="mb-1 text-sm text-muted-foreground">{mentor.role}</p>
                  <p className="mb-3 text-sm text-muted-foreground">{mentor.company}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {mentor.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                  <Button className="w-full" disabled={!mentor.available}>
                    Book Session
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Book a Mentorship Session</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mentor">Select Mentor</Label>
                  <Select>
                    <SelectTrigger id="mentor">
                      <SelectValue placeholder="Choose a mentor" />
                    </SelectTrigger>
                    <SelectContent>
                      {MENTORS.filter((m) => m.available).map((mentor) => (
                        <SelectItem key={mentor.id} value={mentor.id.toString()}>
                          {mentor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input id="date" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time</Label>
                  <Input id="time" type="time" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select>
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Session Topic</Label>
                <Input id="topic" placeholder="What would you like to discuss?" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <textarea
                  id="notes"
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Any specific questions or topics you'd like to cover..."
                />
              </div>

              <Button type="submit" size="lg">Request Session</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
