import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { Users, Building2, TrendingUp, GraduationCap, MapPin, Briefcase } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/auth-context'

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const statCards = [
    {
      title: 'Total Alumni',
      value: '248',
      meta: 'Verified profiles in network',
      icon: Users,
      onClick: () => navigate('/directory'),
    },
    {
      title: 'Active Mentors',
      value: '142',
      meta: 'Available for mentorship sessions',
      icon: GraduationCap,
      onClick: () => navigate('/mentorship'),
    },
    {
      title: 'Partner Companies',
      value: '131',
      meta: 'Hiring and collaborating partners',
      icon: Building2,
      onClick: () => navigate('/directory'),
    },
    {
      title: 'Monthly Engagement',
      value: '67%',
      meta: 'Messages, events, and mentorship activity',
      icon: TrendingUp,
      onClick: () => navigate('/communication'),
    },
  ]

  const topCompanies = [
    { name: 'TCS', count: 148, color: 'bg-chart-1' },
    { name: 'Infosys', count: 139, color: 'bg-chart-2' },
    { name: 'Wipro', count: 132, color: 'bg-chart-3' },
    { name: 'HCL', count: 126, color: 'bg-chart-4' },
    { name: 'Zoho', count: 119, color: 'bg-chart-5' },
    { name: 'Tech Mahindra', count: 113, color: 'bg-chart-1' },
    { name: 'Paytm', count: 108, color: 'bg-chart-2' },
    { name: 'Razorpay', count: 103, color: 'bg-chart-3' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-muted-foreground">Overview of alumni network and engagement metrics</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <button key={stat.title} type="button" onClick={stat.onClick} className="text-left">
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.meta}</p>
                  </CardContent>
                </Card>
              </button>
            )
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCompanies.map((company) => (
                <div key={company.name} className="flex items-center gap-4">
                  <div className="flex min-w-[120px] items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{company.name}</span>
                  </div>
                  <div className="flex flex-1 items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-muted">
                      <div
                        className={`h-2 rounded-full ${company.color}`}
                        style={{ width: `${(company.count / topCompanies[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="min-w-[40px] text-right text-sm text-muted-foreground">
                      {company.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Industry Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Software Engineering', percentage: 34 },
                  { name: 'Data Analytics', percentage: 19 },
                  { name: 'Product Management', percentage: 15 },
                  { name: 'Consulting', percentage: 12 },
                  { name: 'FinTech', percentage: 11 },
                  { name: 'EdTech', percentage: 9 },
                ].map((industry) => (
                  <div key={industry.name} className="flex items-center justify-between">
                    <span className="text-sm">{industry.name}</span>
                    <Badge variant="secondary">{industry.percentage}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Top Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Bengaluru', count: 96 },
                  { name: 'Hyderabad', count: 78 },
                  { name: 'Pune', count: 62 },
                  { name: 'Gurugram', count: 54 },
                  { name: 'Noida', count: 41 },
                  { name: 'Chennai', count: 36 },
                ].map((location) => (
                  <div key={location.name} className="flex items-center justify-between">
                    <span className="text-sm">{location.name}</span>
                    <Badge variant="outline">{location.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {user?.role === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <button type="button" className="rounded-md border border-border p-3 text-left text-sm hover:bg-muted" onClick={() => navigate('/jobs')}>
                Post Jobs
              </button>
              <button type="button" className="rounded-md border border-border p-3 text-left text-sm hover:bg-muted" onClick={() => navigate('/mentorship')}>
                Manage Mentorship Requests
              </button>
              <button type="button" className="rounded-md border border-border p-3 text-left text-sm hover:bg-muted" onClick={() => navigate('/events')}>
                Manage Events
              </button>
              <button type="button" className="rounded-md border border-border p-3 text-left text-sm hover:bg-muted" onClick={() => navigate('/communication')}>
                Moderate Messages/Reports
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
