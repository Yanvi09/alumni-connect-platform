import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Video, Clock, CheckCircle2 } from 'lucide-react'
import { api } from '@/lib/api'
import { motion } from 'framer-motion'

type EventRow = {
  id: string
  title: string
  date: string
  time: string
  location: string
  type: string
  category: string
  attendees: number
  capacity: number
  registered: boolean
}

const REGISTERED_EVENTS_KEY = 'alumniconnect-registered-events'

function readRegisteredEvents(): string[] {
  try {
    const raw = localStorage.getItem(REGISTERED_EVENTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

function persistRegisteredEvent(id: string) {
  const ids = new Set(readRegisteredEvents())
  ids.add(id)
  localStorage.setItem(REGISTERED_EVENTS_KEY, JSON.stringify(Array.from(ids)))
}

const TOP_ALUMNI = [
  { id: 1, name: 'Dr. Amanda Stevens', title: 'CEO, TechVentures Inc', achievement: 'Forbes 30 Under 30' },
  { id: 2, name: 'Prof. John Martinez', title: 'Dean, MIT Engineering', achievement: 'Published 50+ Research Papers' },
  { id: 3, name: 'Lisa Chen', title: 'VP Product, Amazon', achievement: 'Led AWS Product Strategy' },
  { id: 4, name: 'Robert Williams', title: 'Founder, GreenTech Solutions', achievement: 'Raised $50M Series B' },
]

export function EventsPage() {
  const navigate = useNavigate()
  const [events, setEvents] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [registeredIds, setRegisteredIds] = useState<string[]>([])

  useEffect(() => {
    setRegisteredIds(readRegisteredEvents())
  }, [])

  const loadEvents = useCallback(async () => {
    try {
      setError(null)
      const rows = await api<EventRow[]>('/api/events')
      setEvents(rows.map((row) => ({ ...row, registered: row.registered || registeredIds.includes(row.id) })))
    } catch (e) {
      console.error('Failed to fetch events:', e)
      setError(e instanceof Error ? e.message : 'Failed to load events')
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [registeredIds])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const registeredEvents = events.filter((event) => event.registered || registeredIds.includes(event.id))

  async function register(id: string) {
    if (registeredIds.includes(id) || events.find((event) => event.id === id)?.registered) return
    setBusyId(id)
    setError(null)
    setSuccess(null)
    try {
      await api(`/api/events/${id}/register`, { method: 'POST' })
      persistRegisteredEvent(id)
      setRegisteredIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
      setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, registered: true } : event)))
      setSuccess('Registration successful.')
    } catch (e) {
      console.error('Registration failed:', e)
      setError(e instanceof Error ? e.message : 'Registration failed')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Alumni Events & Recognition</h1>
          <p className="text-muted-foreground">Discover upcoming events and celebrate distinguished alumni</p>
        </div>

        {error && (
          <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-md border border-emerald-500/50 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">
            {success}
          </p>
        )}

        <div>
          <h2 className="mb-4 text-2xl font-semibold">Upcoming Events</h2>
          {loading ? (
            <p className="text-muted-foreground">Loading events…</p>
          ) : events.length === 0 ? (
            <div className="rounded-md border border-border bg-card p-6 text-sm text-muted-foreground">
              No events found. If this is unexpected, verify your backend seed and `/api/events` response.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {events.map((event) => (
                <motion.div key={event.id} whileHover={{ y: -2 }}>
                <Card className="transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <Badge variant={event.type === 'Webinar' ? 'secondary' : 'default'}>{event.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 shrink-0" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 shrink-0" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {event.type === 'Webinar' ? (
                          <Video className="h-4 w-4 shrink-0" />
                        ) : (
                          <MapPin className="h-4 w-4 shrink-0" />
                        )}
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4 shrink-0" />
                        {event.attendees} registered
                        {event.capacity ? ` / ${event.capacity} capacity` : ''}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        className={`flex-1 ${
                          event.registered || registeredIds.includes(event.id)
                            ? 'bg-emerald-600 hover:bg-emerald-600'
                            : ''
                        }`}
                        disabled={(event.registered || registeredIds.includes(event.id)) || busyId === event.id}
                        onClick={() => register(event.id)}
                      >
                        {event.registered || registeredIds.includes(event.id)
                          ? (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Registered
                            </>
                          )
                          : busyId === event.id
                            ? 'Saving…'
                            : 'Register'}
                      </Button>
                      <Button variant="outline" type="button" onClick={() => navigate(`/events/${event.id}`)}>
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Events ({registeredEvents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {registeredEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No registered events yet.</p>
            ) : (
              <div className="space-y-3">
                {registeredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col justify-between gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.date} • {event.time} • {event.location}
                      </p>
                    </div>
                    <Button variant="outline" type="button" onClick={() => navigate(`/events/${event.id}`)}>
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Webinar schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-col justify-between gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-center">
                <div>
                  <div className="font-semibold">Building your personal brand</div>
                  <div className="text-sm text-muted-foreground">Jan 18, 2026 • 1:00 PM EST</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => window.open('https://meet.jit.si/alumniconnect-webinar-branding', '_blank', 'noopener,noreferrer')}
                >
                  Join Meeting
                </Button>
              </div>
              <div className="flex flex-col justify-between gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-center">
                <div>
                  <div className="font-semibold">Transitioning to leadership roles</div>
                  <div className="text-sm text-muted-foreground">Jan 25, 2026 • 3:00 PM EST</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => window.open('https://meet.jit.si/alumniconnect-webinar-leadership', '_blank', 'noopener,noreferrer')}
                >
                  Join Meeting
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-4 text-2xl font-semibold">Distinguished alumni</h2>
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
            <CardTitle>Alumni recruitment participation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Connect with companies actively hiring alumni for exciting opportunities.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border p-4 text-center">
                  <div className="mb-2 text-3xl font-bold text-primary">45</div>
                  <div className="text-sm text-muted-foreground">Companies hiring</div>
                </div>
                <div className="rounded-lg border border-border p-4 text-center">
                  <div className="mb-2 text-3xl font-bold text-accent">230</div>
                  <div className="text-sm text-muted-foreground">Open positions</div>
                </div>
                <div className="rounded-lg border border-border p-4 text-center">
                  <div className="mb-2 text-3xl font-bold text-chart-3">1,850</div>
                  <div className="text-sm text-muted-foreground">Applications submitted</div>
                </div>
              </div>
              <Button size="lg" className="w-full" type="button" variant="secondary" onClick={() => navigate('/jobs')}>
                Browse jobs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
