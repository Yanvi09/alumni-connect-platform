import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, Globe, TrendingUp, MapPin, Briefcase } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Alumni Dashboard</h1>
          <p className="text-muted-foreground">Overview of alumni network and engagement metrics</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alumni</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10,247</div>
              <p className="text-xs text-muted-foreground">+12% from last year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Companies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">523</div>
              <p className="text-xs text-muted-foreground">Across all industries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Countries</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">52</div>
              <p className="text-xs text-muted-foreground">Global presence</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">+5% this month</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Google', count: 324, color: 'bg-chart-1' },
                { name: 'Microsoft', count: 298, color: 'bg-chart-2' },
                { name: 'Amazon', count: 276, color: 'bg-chart-3' },
                { name: 'Apple', count: 245, color: 'bg-chart-4' },
                { name: 'Meta', count: 198, color: 'bg-chart-5' },
              ].map((company) => (
                <div key={company.name} className="flex items-center gap-4">
                  <div className="flex min-w-[120px] items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{company.name}</span>
                  </div>
                  <div className="flex flex-1 items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-muted">
                      <div
                        className={`h-2 rounded-full ${company.color}`}
                        style={{ width: `${(company.count / 324) * 100}%` }}
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
                  { name: 'Technology', percentage: 42 },
                  { name: 'Finance', percentage: 18 },
                  { name: 'Healthcare', percentage: 15 },
                  { name: 'Education', percentage: 12 },
                  { name: 'Manufacturing', percentage: 8 },
                  { name: 'Other', percentage: 5 },
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
                  { name: 'San Francisco, USA', count: 1842 },
                  { name: 'New York, USA', count: 1523 },
                  { name: 'London, UK', count: 987 },
                  { name: 'Singapore', count: 765 },
                  { name: 'Toronto, Canada', count: 654 },
                  { name: 'Sydney, Australia', count: 543 },
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
      </div>
    </DashboardLayout>
  )
}
