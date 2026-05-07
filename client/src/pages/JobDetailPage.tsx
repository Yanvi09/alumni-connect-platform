import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

type JobDetail = {
  id: string
  title: string
  company: string
  location: string
  type: string
  summary: string
  description: string
  applyUrl: string
}

export function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    api<JobDetail>(`/api/jobs/${id}`)
      .then(setJob)
      .catch((e) => {
        console.error('Failed to load job detail:', e)
        setError(e instanceof Error ? e.message : 'Failed to load job detail')
      })
      .finally(() => setLoading(false))
  }, [id])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate('/jobs')} type="button">
          Back to jobs
        </Button>
        {loading ? (
          <p className="text-muted-foreground">Loading job...</p>
        ) : !job ? (
          <p className="text-destructive">{error || 'Job not found'}</p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{job.company} • {job.location} • {job.type}</p>
              <p>{job.summary}</p>
              <p className="text-sm text-muted-foreground">{job.description}</p>
              <Button onClick={() => window.open(job.applyUrl, '_blank', 'noopener,noreferrer')} type="button">
                Apply now
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
