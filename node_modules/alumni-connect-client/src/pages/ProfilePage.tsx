import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Mail, MapPin, Briefcase, GraduationCap } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/context/auth-context'

type ProfileData = {
  id: string
  name: string
  photo: string
  company: string
  position: string
  industry: string
  location: string
  graduationYear: number
  email?: string
}

export function ProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { user: me } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const isSelf = me?.id === id

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api<ProfileData>(`/api/users/${id}`)
      .then(setProfile)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load profile'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">Loading profile…</p>
      </DashboardLayout>
    )
  }

  if (error || !profile) {
    return (
      <DashboardLayout>
        <p className="text-destructive">{error ?? 'Profile not found'}</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-start gap-6 md:flex-row">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.photo || '/placeholder.svg'} alt={profile.name} />
                <AvatarFallback>{profile.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                  <p className="text-lg text-muted-foreground">
                    {profile.position}
                    {profile.company ? ` at ${profile.company}` : ''}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.industry ? <Badge variant="secondary">{profile.industry}</Badge> : null}
                  <Badge variant="secondary">Class of {profile.graduationYear}</Badge>
                </div>

                <div className="flex flex-wrap gap-4">
                  {!isSelf && (
                    <Button size="sm" asChild>
                      <Link to={`/communication?with=${profile.id}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Send message
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Graduation year {profile.graduationYear}. Detailed education history can be added when profile editing is
              enabled.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact &amp; location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isSelf && profile.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.email}</span>
                </div>
              )}
              {profile.location ? (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.location}</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No location listed.</p>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional summary
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {profile.company || profile.position || profile.industry ? (
                <p>
                  {profile.industry && <span>Industry: {profile.industry}. </span>}
                  {profile.position && profile.company && (
                    <span>
                      Works as {profile.position} at {profile.company}.
                    </span>
                  )}
                </p>
              ) : (
                <p>No additional professional details yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
