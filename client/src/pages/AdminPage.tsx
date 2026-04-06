import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Filter, Download, CheckCircle, XCircle, BarChart3 } from 'lucide-react'

const PENDING_ALUMNI = [
  { id: 1, name: 'Alex Thompson', email: 'alex.t@example.com', year: 2018, status: 'pending' },
  { id: 2, name: 'Maria Garcia', email: 'maria.g@example.com', year: 2019, status: 'pending' },
  { id: 3, name: 'James Wilson', email: 'james.w@example.com', year: 2020, status: 'pending' },
]

export function AdminPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage alumni profiles, approvals, and platform analytics</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground">Pending Approvals</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-accent">10,247</div>
                <div className="text-sm text-muted-foreground">Total Alumni</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-chart-3">89%</div>
                <div className="text-sm text-muted-foreground">Profile Completion</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-chart-4">324</div>
                <div className="text-sm text-muted-foreground">New This Month</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Profile Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {PENDING_ALUMNI.map((alumni) => (
                <div key={alumni.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`/.jpg?height=40&width=40&query=${alumni.name}`} />
                      <AvatarFallback>{alumni.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{alumni.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {alumni.email} • Class of {alumni.year}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-green-600 hover:text-green-600">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-600">
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>Alumni Database</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                <Button variant="outline" size="sm">
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
                <Input placeholder="Search alumni..." className="pl-10" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left text-sm text-muted-foreground">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Company</th>
                    <th className="pb-3">Year</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { name: 'Sarah Johnson', email: 'sarah.j@example.com', company: 'Google', year: 2015, status: 'active' },
                    { name: 'Michael Chen', email: 'michael.c@example.com', company: 'Microsoft', year: 2014, status: 'active' },
                    { name: 'Emily Rodriguez', email: 'emily.r@example.com', company: 'Amazon', year: 2013, status: 'active' },
                    { name: 'David Kim', email: 'david.k@example.com', company: 'Apple', year: 2016, status: 'active' },
                    { name: 'Jessica Williams', email: 'jessica.w@example.com', company: 'Meta', year: 2017, status: 'active' },
                  ].map((alumni, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/.jpg?height=32&width=32&query=${alumni.name}`} />
                            <AvatarFallback>{alumni.name[0]}</AvatarFallback>
                          </Avatar>
                          {alumni.name}
                        </div>
                      </td>
                      <td className="py-4 text-muted-foreground">{alumni.email}</td>
                      <td className="py-4">{alumni.company}</td>
                      <td className="py-4">{alumni.year}</td>
                      <td className="py-4">
                        <Badge variant={alumni.status === 'active' ? 'default' : 'secondary'}>
                          {alumni.status}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Platform Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Login Activity</div>
                <div className="text-2xl font-bold">8,432</div>
                <div className="text-xs text-green-600">↑ 12% this week</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Messages Sent</div>
                <div className="text-2xl font-bold">15,234</div>
                <div className="text-xs text-green-600">↑ 8% this week</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Events Registered</div>
                <div className="text-2xl font-bold">1,245</div>
                <div className="text-xs text-green-600">↑ 23% this week</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
