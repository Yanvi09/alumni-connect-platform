import { useEffect, useMemo, useRef, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Video } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/lib/api'
import { motion } from 'framer-motion'

type Mentor = {
  id: string
  name: string
  photo: string
  company: string
  position: string
  industry?: string
  expertise?: string
}

type Session = {
  id: string
  topic: string
  notes: string
  scheduledAt: string
  durationMinutes: number
  meetingUrl: string
  status: 'scheduled' | 'completed' | 'cancelled'
  mentor: Mentor | null
}

const INITIAL_FORM = {
  mentorId: '',
  date: '',
  time: '',
  durationMinutes: '60',
  topic: '',
  notes: '',
}

export function MentorshipPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const bookingSectionRef = useRef<HTMLDivElement | null>(null)
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)

  async function loadData() {
    try {
      setError(null)
      const [mentorRows, sessionRows] = await Promise.all([
        api<Mentor[]>('/api/alumni'),
        api<Session[]>('/api/sessions'),
      ])
      setMentors(mentorRows)
      setSessions(sessionRows)
    } catch (e) {
      console.error('Failed to load mentorship data:', e)
      setError(e instanceof Error ? e.message : 'Failed to load mentorship data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const sortedSessions = useMemo(
    () =>
      [...sessions]
        .filter((s) => s.status === 'scheduled')
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()),
    [sessions]
  )
  const selectedMentorInfo = useMemo(
    () => selectedMentor ?? mentors.find((mentor) => mentor.id === form.mentorId) ?? null,
    [form.mentorId, mentors, selectedMentor]
  )

  function handleBookSession(mentor: Mentor) {
    setSelectedMentor(mentor)
    setForm((prev) => ({ ...prev, mentorId: mentor.id }))
    if (bookingSectionRef.current) {
      bookingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    setError('Booking form is temporarily unavailable. Please try again.')
  }

  async function submitSession(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setError(null)
    if (!form.mentorId || !form.date || !form.time || !form.topic.trim()) {
      setError('Please fill mentor, date, time, and topic.')
      return
    }
    setSaving(true)
    try {
      await api('/api/sessions', {
        method: 'POST',
        body: JSON.stringify({
          mentorId: form.mentorId,
          date: form.date,
          time: form.time,
          durationMinutes: Number(form.durationMinutes),
          topic: form.topic.trim(),
          notes: form.notes.trim(),
        }),
      })
      setMessage('Session booked successfully.')
      setForm(INITIAL_FORM)
      setSelectedMentor(null)
      await loadData()
    } catch (e) {
      console.error('Failed to book session:', e)
      setError(e instanceof Error ? e.message : 'Failed to book session')
    } finally {
      setSaving(false)
    }
  }

  async function handleReschedule(session: Session) {
    const current = new Date(session.scheduledAt)
    const date = window.prompt('Enter new date (YYYY-MM-DD)', current.toISOString().slice(0, 10))
    const time = window.prompt('Enter new time (HH:MM, 24-hour)', current.toTimeString().slice(0, 5))
    if (!date || !time) return
    try {
      await api(`/api/sessions/${session.id}`, {
        method: 'PUT',
        body: JSON.stringify({ date, time }),
      })
      setMessage('Session rescheduled successfully.')
      await loadData()
    } catch (e) {
      console.error('Failed to reschedule:', e)
      setError(e instanceof Error ? e.message : 'Failed to reschedule session')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Mentorship Program</h1>
          <p className="text-muted-foreground">Book sessions, join meetings, and manage upcoming mentorship.</p>
        </div>

        {message && <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">{message}</p>}
        {error && <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading sessions...</p>
            ) : sortedSessions.length > 0 ? (
              <div className="space-y-4">
                {sortedSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    whileHover={{ y: -2 }}
                    className="flex flex-col justify-between gap-4 rounded-lg border border-border p-4 md:flex-row md:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={session.mentor?.photo || '/placeholder.svg'} />
                        <AvatarFallback>{session.mentor?.name?.[0] ?? '?'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{session.mentor?.name || 'Mentor'}</div>
                        <div className="text-sm text-muted-foreground">{session.topic}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(session.scheduledAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(session.scheduledAt).toLocaleTimeString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            {session.durationMinutes} min
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleReschedule(session)}>
                        Reschedule
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          window.open(session.meetingUrl, '_blank', 'noopener,noreferrer')
                        }}
                      >
                        Join Meeting
                      </Button>
                    </div>
                  </motion.div>
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
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading mentors...</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mentors.map((mentor) => (
                  <motion.div
                    key={mentor.id}
                    whileHover={{ y: -2 }}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={mentor.photo || '/placeholder.svg'} />
                        <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                      </Avatar>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600">
                        Available
                      </Badge>
                    </div>
                    <h3 className="mb-1 font-semibold">{mentor.name}</h3>
                    <p className="mb-1 text-sm text-muted-foreground">{mentor.position}</p>
                    <p className="mb-3 text-sm text-muted-foreground">{mentor.company}</p>
                    <Button
                      className="w-full"
                      type="button"
                      disabled={saving}
                      onClick={() => handleBookSession(mentor)}
                    >
                      {selectedMentorInfo?.id === mentor.id ? 'Selected' : 'Book Session'}
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card ref={bookingSectionRef}>
          <CardHeader>
            <CardTitle>Book a Mentorship Session</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={submitSession}>
              {selectedMentorInfo && (
                <div className="rounded-md border border-primary/40 bg-primary/5 p-3 text-sm">
                  <p className="font-semibold">Booking session with {selectedMentorInfo.name}</p>
                  <p className="text-muted-foreground">{selectedMentorInfo.position}</p>
                  <p className="text-muted-foreground">{selectedMentorInfo.company}</p>
                  <p className="text-muted-foreground">
                    Expertise:{' '}
                    {selectedMentorInfo.expertise ||
                      selectedMentorInfo.industry ||
                      selectedMentorInfo.position}
                  </p>
                </div>
              )}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mentor">Select Mentor</Label>
                  <Select value={form.mentorId} onValueChange={(value) => setForm((p) => ({ ...p, mentorId: value }))}>
                    <SelectTrigger id="mentor">
                      <SelectValue placeholder="Choose a mentor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mentors.map((mentor) => (
                        <SelectItem key={mentor.id} value={mentor.id}>
                          {mentor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input id="date" type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time</Label>
                  <Input id="time" type="time" value={form.time} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={form.durationMinutes} onValueChange={(value) => setForm((p) => ({ ...p, durationMinutes: value }))}>
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
                <Input
                  id="topic"
                  placeholder="What would you like to discuss?"
                  value={form.topic}
                  onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <textarea
                  id="notes"
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Any specific questions or topics you'd like to cover..."
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                />
              </div>

              <Button type="submit" size="lg" disabled={saving}>
                {saving ? 'Saving...' : 'Request Session'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
