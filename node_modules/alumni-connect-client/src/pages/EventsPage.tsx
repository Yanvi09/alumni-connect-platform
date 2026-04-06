import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Video, Clock } from 'lucide-react'

const EVENTS = [
  {
    id: 1,
    title: 'Annual Alumni Networking Event',
    date: 'January 15, 2025',
    time: '6:00 PM - 9:00 PM',
    location: 'Grand Hotel, New York',
    type: 'In-Person',
    attendees: 250,
    category: 'Networking',
  },
  {
    id: 2,
    title: 'Tech Career Workshop: AI & Machine Learning',
    date: 'January 22, 2025',
    time: '2:00 PM - 4:00 PM',
    location: 'Online',
    type: 'Webinar',
    attendees: 180,
    category: 'Education',
  },
  {
    id: 3,
    title: 'Startup Pitch Competition',
    date: 'February 5, 2025',
    time: '10:00 AM - 5:00 PM',
    location: 'Innovation Hub, San Francisco',
    type: 'In-Person',
    attendees: 150,
    category: 'Competition',
  },
  {
    id: 4,
    title: 'Leadership Panel Discussion',
    date: 'February 12, 2025',
    time: '7:00 PM - 8:30 PM',
    location: 'Online',
    type: 'Webinar',
    attendees: 320,
    category: 'Panel',
  },
]

const TOP_ALUMNI = [
  { id: 1, name: 'Dr. Amanda Stevens', title: 'CEO, TechVentures Inc', achievement: 'Forbes 30 Under 30' },
  { id: 2, name: 'Prof. John Martinez', title: 'Dean, MIT Engineering', achievement: 'Published 50+ Research Papers' },
  { id: 3, name: 'Lisa Chen', title: 'VP Product, Amazon', achievement: 'Led AWS Product Strategy' },
  { id: 4, name: 'Robert Williams', title: 'Founder, GreenTech Solutions', achievement: 'Raised $50M Series B' },
]

export function EventsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Alumni Events & Recognition</h1>
          <p className="text-muted-foreground">Discover upcoming events and celebrate distinguished alumni</p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-semibold">Upcoming Events</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {EVENTS.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <Badge variant={event.type === 'Webinar' ? 'secondary' : 'default'}>
                      {event.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {event.type === 'Webinar' ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {event.attendees} Registered
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">Register Now</Button>
                    <Button variant="outline">Learn More</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Webinar Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <div className="font-semibold">Building Your Personal Brand</div>
                  <div className="text-sm text-muted-foreground">Jan 18, 2025 • 1:00 PM EST</div>
                </div>
                <Button size="sm">Join Webinar</Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <div className="font-semibold">Transitioning to Leadership Roles</div>
                  <div className="text-sm text-muted-foreground">Jan 25, 2025 • 3:00 PM EST</div>
                </div>
                <Button size="sm">Join Webinar</Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <div className="font-semibold">Entrepreneurship 101</div>
                  <div className="text-sm text-muted-foreground">Feb 1, 2025 • 2:00 PM EST</div>
                </div>
                <Button size="sm">Join Webinar</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-4 text-2xl font-semibold">Distinguished Alumni</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {TOP_ALUMNI.map((alumni) => (
              <Card key={alumni.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                      {alumni.name[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 font-semibold">{alumni.name}</h3>
                      <p className="mb-2 text-sm text-muted-foreground">{alumni.title}</p>
                      <Badge variant="secondary">{alumni.achievement}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Alumni Recruitment Participation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Connect with companies actively hiring alumni for exciting opportunities.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border p-4 text-center">
                  <div className="mb-2 text-3xl font-bold text-primary">45</div>
                  <div className="text-sm text-muted-foreground">Companies Hiring</div>
                </div>
                <div className="rounded-lg border border-border p-4 text-center">
                  <div className="mb-2 text-3xl font-bold text-accent">230</div>
                  <div className="text-sm text-muted-foreground">Open Positions</div>
                </div>
                <div className="rounded-lg border border-border p-4 text-center">
                  <div className="mb-2 text-3xl font-bold text-chart-3">1,850</div>
                  <div className="text-sm text-muted-foreground">Applications Submitted</div>
                </div>
              </div>
              <Button size="lg" className="w-full">Browse Job Opportunities</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
