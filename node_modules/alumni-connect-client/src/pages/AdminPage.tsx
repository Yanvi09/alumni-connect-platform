import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Filter, Download, CheckCircle, XCircle, BarChart3 } from 'lucide-react'
import { api } from '@/lib/api'

type PendingUser = {
  id: string
  name: string
  email: string
  graduationYear: number
  company?: string
}

type Stats = {
  pendingCount: number
  totalAlumni: number
  totalUsers: number
}

export function AdminPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats | null>(null)
  const [pending, setPending] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const [s, p] = await Promise.all([
      api<Stats>('/api/admin/stats'),
      api<PendingUser[]>('/api/admin/pending'),
    ])
    setStats(s)
    setPending(p)
  }, [])

  useEffect(() => {
    refresh()
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load admin data'))
      .finally(() => setLoading(false))
  }, [refresh])

  async function approve(id: string) {
    setBusyId(id)
    setError(null)
    try {
      await api(`/api/admin/users/${id}/approve`, { method: 'POST' })
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Approve failed')
    } finally {
      setBusyId(null)
    }
  }

  async function reject(id: string) {
    setBusyId(id)
    setError(null)
    try {
      await api(`/api/admin/users/${id}/reject`, { method: 'POST' })
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Reject failed')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin panel</h1>
          <p className="text-muted-foreground">Manage alumni approvals and view platform metrics</p>
        </div>

        {error && (
          <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-primary">
                  {loading ? '—' : stats?.pendingCount ?? 0}
                </div>
                <div className="text-sm text-muted-foreground">Pending approvals</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-accent">
                  {loading ? '—' : stats?.totalAlumni ?? 0}
                </div>
                <div className="text-sm text-muted-foreground">Approved alumni</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-chart-3">
                  {loading ? '—' : stats?.totalUsers ?? 0}
                </div>
                <div className="text-sm text-muted-foreground">Total accounts</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-chart-4">—</div>
                <div className="text-sm text-muted-foreground">Reports (soon)</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Button type="button" variant="outline" onClick={() => navigate('/jobs')}>
                Post Jobs
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/mentorship')}>
                Manage Mentorship Requests
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/events')}>
                Manage Events
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/communication')}>
                Moderate Messages/Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending registrations</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : pending.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending requests.</p>
            ) : (
              <div className="space-y-4">
                {pending.map((u) => (
                  <div
                    key={u.id}
                    className="flex flex-col justify-between gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{u.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{u.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {u.email} • Class of {u.graduationYear}
                          {u.company ? ` • ${u.company}` : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-600"
                        disabled={busyId === u.id}
                        onClick={() => approve(u.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-600"
                        disabled={busyId === u.id}
                        onClick={() => reject(u.id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>Alumni database</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" type="button" disabled>
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                <Button variant="outline" size="sm" type="button" disabled>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search alumni…" className="pl-10" disabled />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Use the directory as an alumni to browse approved profiles. Full admin table export can be added in a
              future iteration.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Platform analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Pending queue</div>
                <div className="text-2xl font-bold">{stats?.pendingCount ?? '—'}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Approved alumni</div>
                <div className="text-2xl font-bold">{stats?.totalAlumni ?? '—'}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">All accounts</div>
                <div className="text-2xl font-bold">{stats?.totalUsers ?? '—'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
