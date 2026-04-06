import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { AlumniCard } from '@/components/alumni-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'

type AlumniRow = {
  id: number | string
  name: string
  photo: string
  company: string
  position: string
  industry: string
  location: string
  graduationYear: number
}

const STATIC_ALUMNI: AlumniRow[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    photo: '/professional-woman-diverse.png',
    company: 'Google',
    position: 'Senior Software Engineer',
    industry: 'Technology',
    location: 'San Francisco, USA',
    graduationYear: 2015,
  },
  {
    id: 2,
    name: 'Michael Chen',
    photo: '/professional-man.jpg',
    company: 'Microsoft',
    position: 'Product Manager',
    industry: 'Technology',
    location: 'Seattle, USA',
    graduationYear: 2014,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    photo: '/professional-business-woman.png',
    company: 'Amazon',
    position: 'Engineering Manager',
    industry: 'Technology',
    location: 'Seattle, USA',
    graduationYear: 2013,
  },
  {
    id: 4,
    name: 'David Kim',
    photo: '/professional-asian-man.png',
    company: 'Apple',
    position: 'Design Lead',
    industry: 'Technology',
    location: 'Cupertino, USA',
    graduationYear: 2016,
  },
  {
    id: 5,
    name: 'Jessica Williams',
    photo: '/professional-woman-executive.png',
    company: 'Meta',
    position: 'Data Scientist',
    industry: 'Technology',
    location: 'Menlo Park, USA',
    graduationYear: 2017,
  },
  {
    id: 6,
    name: 'Robert Taylor',
    photo: '/professional-man-suit.png',
    company: 'Goldman Sachs',
    position: 'Investment Banker',
    industry: 'Finance',
    location: 'New York, USA',
    graduationYear: 2012,
  },
  {
    id: 7,
    name: 'Lisa Anderson',
    photo: '/professional-woman-doctor.png',
    company: 'Johns Hopkins',
    position: 'Medical Researcher',
    industry: 'Healthcare',
    location: 'Baltimore, USA',
    graduationYear: 2011,
  },
  {
    id: 8,
    name: 'James Martinez',
    photo: '/professional-man-tech.png',
    company: 'Tesla',
    position: 'Mechanical Engineer',
    industry: 'Technology',
    location: 'Austin, USA',
    graduationYear: 2015,
  },
]

export function DirectoryPage() {
  const [alumni, setAlumni] = useState<AlumniRow[]>(STATIC_ALUMNI)

  useEffect(() => {
    const prefix = import.meta.env.VITE_API_URL ?? ''
    fetch(`${prefix}/api/alumni`)
      .then((r) => r.json())
      .then((data: AlumniRow[]) => {
        if (Array.isArray(data) && data.length > 0) setAlumni(data)
      })
      .catch(() => {})
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Alumni Directory</h1>
          <p className="text-muted-foreground">Search and connect with alumni across the globe</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, company, or location..."
              className="pl-10"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="microsoft">Microsoft</SelectItem>
                <SelectItem value="amazon">Amazon</SelectItem>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="meta">Meta</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sf">San Francisco</SelectItem>
                <SelectItem value="ny">New York</SelectItem>
                <SelectItem value="seattle">Seattle</SelectItem>
                <SelectItem value="london">London</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">Clear Filters</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {alumni.map((a) => (
            <AlumniCard key={String(a.id)} alumni={a} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
