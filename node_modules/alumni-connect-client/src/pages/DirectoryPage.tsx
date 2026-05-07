import { useEffect, useMemo, useState } from 'react'
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
    name: 'Aarav Mehta',
    photo: '/professional-woman-diverse.png',
    company: 'TCS',
    position: 'Software Engineer',
    industry: 'Software Engineering',
    location: 'Bengaluru',
    graduationYear: 2015,
  },
  {
    id: 2,
    name: 'Nisha Reddy',
    photo: '/professional-man.jpg',
    company: 'Infosys',
    position: 'Product Manager',
    industry: 'Product Management',
    location: 'Hyderabad',
    graduationYear: 2014,
  },
  {
    id: 3,
    name: 'Rahul Iyer',
    photo: '/professional-business-woman.png',
    company: 'Wipro',
    position: 'Senior Data Analyst',
    industry: 'Data Analytics',
    location: 'Pune',
    graduationYear: 2013,
  },
  {
    id: 4,
    name: 'Priya Sharma',
    photo: '/professional-asian-man.png',
    company: 'HCL',
    position: 'Consultant',
    industry: 'Consulting',
    location: 'Noida',
    graduationYear: 2016,
  },
  {
    id: 5,
    name: 'Karan Verma',
    photo: '/professional-woman-executive.png',
    company: 'Razorpay',
    position: 'FinTech Operations Lead',
    industry: 'FinTech',
    location: 'Bengaluru',
    graduationYear: 2017,
  },
  {
    id: 6,
    name: 'Sneha Kulkarni',
    photo: '/professional-man-suit.png',
    company: 'Paytm',
    position: 'Program Manager',
    industry: 'FinTech',
    location: 'Gurugram',
    graduationYear: 2012,
  },
  {
    id: 7,
    name: 'Aditya Narayanan',
    photo: '/professional-woman-doctor.png',
    company: 'Zoho',
    position: 'Engineering Manager',
    industry: 'Software Engineering',
    location: 'Chennai',
    graduationYear: 2011,
  },
  {
    id: 8,
    name: 'Meera Joshi',
    photo: '/professional-man-tech.png',
    company: 'Tech Mahindra',
    position: 'EdTech Solutions Lead',
    industry: 'EdTech',
    location: 'Pune',
    graduationYear: 2015,
  },
]

export function DirectoryPage() {
  const [alumni, setAlumni] = useState<AlumniRow[]>(STATIC_ALUMNI)
  const [searchQuery, setSearchQuery] = useState('')
  const [companyFilter, setCompanyFilter] = useState('all')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')

  useEffect(() => {
    const prefix = import.meta.env.VITE_API_URL ?? ''
    fetch(`${prefix}/api/alumni`)
      .then((r) => r.json())
      .then((data: AlumniRow[]) => {
        if (Array.isArray(data) && data.length > 0) setAlumni(data)
      })
      .catch(() => {})
  }, [])

  const companies = useMemo(
    () => Array.from(new Set(alumni.map((a) => a.company))).sort((a, b) => a.localeCompare(b)),
    [alumni]
  )
  const industries = useMemo(
    () => Array.from(new Set(alumni.map((a) => a.industry))).sort((a, b) => a.localeCompare(b)),
    [alumni]
  )
  const locations = useMemo(
    () => Array.from(new Set(alumni.map((a) => a.location))).sort((a, b) => a.localeCompare(b)),
    [alumni]
  )

  const filteredAlumni = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return alumni.filter((a) => {
      const matchesQuery =
        query.length === 0 ||
        a.name.toLowerCase().includes(query) ||
        a.company.toLowerCase().includes(query) ||
        a.position.toLowerCase().includes(query) ||
        a.location.toLowerCase().includes(query)
      const matchesCompany = companyFilter === 'all' || a.company === companyFilter
      const matchesIndustry = industryFilter === 'all' || a.industry === industryFilter
      const matchesLocation = locationFilter === 'all' || a.location === locationFilter
      return matchesQuery && matchesCompany && matchesIndustry && matchesLocation
    })
  }, [alumni, companyFilter, industryFilter, locationFilter, searchQuery])

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
              placeholder="Search by name, company, role, or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setSearchQuery('')
                setCompanyFilter('all')
                setIndustryFilter('all')
                setLocationFilter('all')
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAlumni.map((a) => (
            <AlumniCard key={String(a.id)} alumni={a} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
