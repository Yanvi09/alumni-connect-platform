import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'

type EventDetail = {
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
  description: string
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

export function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadEvent() {
    if (!id) return
    try {
      setError(null)
      const row = await api<EventDetail>(`/api/events/${id}`)
      setEvent({ ...row, registered: row.registered || readRegisteredEvents().includes(row.id) })
    } catch (e) {
      console.error('Failed to load event detail:', e)
      setError(e instanceof Error ? e.message : 'Failed to load event detail')
      setEvent(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvent()
  }, [id])

  async function register() {
    if (!event) return
    setBusy(true)
    setError(null)
    try {
      await api(`/api/events/${event.id}/register`, {
        method: 'POST',
      })
      persistRegisteredEvent(event.id)
      setEvent((prev) => (prev ? { ...prev, registered: true } : prev))
    } catch (e) {
      console.error('Failed to register event:', e)
      setError(e instanceof Error ? e.message : 'Failed to register event')
    } finally {
      setBusy(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate('/events')} type="button">
          Back to events
        </Button>
        {loading ? (
          <p className="text-muted-foreground">Loading event details...</p>
        ) : !event ? (
          <p className="text-destructive">{error || 'Event not found'}</p>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <CardTitle>{event.title}</CardTitle>
                <Badge>{event.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
              <p className="text-muted-foreground">{event.description}</p>
              <div className="space-y-2 text-sm">
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Type:</strong> {event.type}</p>
                <p><strong>Attendees:</strong> {event.attendees} / {event.capacity}</p>
              </div>
              <Button onClick={register} disabled={event.registered || busy} type="button">
                {event.registered ? 'Registered' : busy ? 'Registering...' : 'Register now'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
