import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/auth-context'

type JobRow = {
  id: string
  companyName?: string
  title: string
  company: string
  roleType?: string
  experienceRequired?: string
  salaryRange?: string
  location: string
  type: string
  summary: string
  description?: string
  skillsRequired?: string
  applicationDeadline?: string
  applyLink?: string
  applyUrl?: string
}

const ADMIN_JOBS_KEY = 'alumniconnect-admin-jobs'

const INITIAL_JOB_FORM = {
  companyName: '',
  jobTitle: '',
  roleType: '',
  experienceRequired: '',
  salaryRange: '',
  location: '',
  jobDescription: '',
  skillsRequired: '',
  applicationDeadline: '',
  applyLink: '',
}

export function JobsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [jobs, setJobs] = useState<JobRow[]>([])
  const [adminJobs, setAdminJobs] = useState<JobRow[]>([])
  const [jobForm, setJobForm] = useState(INITIAL_JOB_FORM)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  function loadAdminJobs() {
    try {
      const raw = localStorage.getItem(ADMIN_JOBS_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? (parsed as JobRow[]) : []
    } catch {
      return []
    }
  }

  useEffect(() => {
    const localJobs = loadAdminJobs()
    setAdminJobs(localJobs)
    api<JobRow[]>('/api/jobs')
      .then(setJobs)
      .catch((e) => {
        console.error('Failed to load jobs:', e)
        setError(e instanceof Error ? e.message : 'Failed to load jobs')
      })
      .finally(() => setLoading(false))
  }, [])

  const allJobs = useMemo(() => [...adminJobs, ...jobs], [adminJobs, jobs])

  function submitJob(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(null)
    if (Object.values(jobForm).some((v) => !v.trim())) {
      setFormError('Please fill all job fields before posting.')
      return
    }
    const nextJob: JobRow = {
      id: `local-${Date.now()}`,
      title: jobForm.jobTitle.trim(),
      company: jobForm.companyName.trim(),
      companyName: jobForm.companyName.trim(),
      roleType: jobForm.roleType.trim(),
      experienceRequired: jobForm.experienceRequired.trim(),
      salaryRange: jobForm.salaryRange.trim(),
      location: jobForm.location.trim(),
      type: jobForm.roleType.trim(),
      summary: jobForm.jobDescription.trim().slice(0, 120),
      description: jobForm.jobDescription.trim(),
      skillsRequired: jobForm.skillsRequired.trim(),
      applicationDeadline: jobForm.applicationDeadline.trim(),
      applyLink: jobForm.applyLink.trim(),
      applyUrl: jobForm.applyLink.trim(),
    }
    const updated = [nextJob, ...adminJobs]
    setAdminJobs(updated)
    localStorage.setItem(ADMIN_JOBS_KEY, JSON.stringify(updated))
    setJobForm(INITIAL_JOB_FORM)
    setFormSuccess('Job posted successfully.')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Jobs</h1>
          <p className="text-muted-foreground">Browse alumni-focused job opportunities.</p>
        </div>
        {error && (
          <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        {user?.role === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle>Post Job</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={submitJob}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" value={jobForm.companyName} onChange={(e) => setJobForm((p) => ({ ...p, companyName: e.target.value }))} placeholder="TCS / Infosys / Wipro" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" value={jobForm.jobTitle} onChange={(e) => setJobForm((p) => ({ ...p, jobTitle: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roleType">Role Type</Label>
                    <Input id="roleType" value={jobForm.roleType} onChange={(e) => setJobForm((p) => ({ ...p, roleType: e.target.value }))} placeholder="Full-time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experienceRequired">Experience Required</Label>
                    <Input id="experienceRequired" value={jobForm.experienceRequired} onChange={(e) => setJobForm((p) => ({ ...p, experienceRequired: e.target.value }))} placeholder="3-5 years" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaryRange">Salary Range</Label>
                    <Input id="salaryRange" value={jobForm.salaryRange} onChange={(e) => setJobForm((p) => ({ ...p, salaryRange: e.target.value }))} placeholder="12-18 LPA" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={jobForm.location} onChange={(e) => setJobForm((p) => ({ ...p, location: e.target.value }))} placeholder="Bengaluru" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skillsRequired">Skills Required</Label>
                    <Input id="skillsRequired" value={jobForm.skillsRequired} onChange={(e) => setJobForm((p) => ({ ...p, skillsRequired: e.target.value }))} placeholder="React, Node.js, SQL" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="applicationDeadline">Application Deadline</Label>
                    <Input id="applicationDeadline" type="date" value={jobForm.applicationDeadline} onChange={(e) => setJobForm((p) => ({ ...p, applicationDeadline: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobDescription">Job Description</Label>
                  <textarea id="jobDescription" className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={jobForm.jobDescription} onChange={(e) => setJobForm((p) => ({ ...p, jobDescription: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applyLink">Apply Link</Label>
                  <Input id="applyLink" value={jobForm.applyLink} onChange={(e) => setJobForm((p) => ({ ...p, applyLink: e.target.value }))} placeholder="https://company.com/careers/apply" />
                </div>
                {formError && <p className="text-sm text-destructive">{formError}</p>}
                {formSuccess && <p className="text-sm text-emerald-600">{formSuccess}</p>}
                <Button type="submit">Post Job</Button>
              </form>
            </CardContent>
          </Card>
        )}
        {loading ? (
          <p className="text-muted-foreground">Loading jobs...</p>
        ) : (
          <div className="grid gap-4">
            {allJobs.map((job) => (
              <motion.div key={job.id} whileHover={{ y: -2 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>{job.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{job.company} • {job.location} • {job.type}</p>
                    <p className="text-sm">{job.summary}</p>
                    <Button variant="outline" onClick={() => navigate(`/jobs/${job.id}`)} type="button">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
