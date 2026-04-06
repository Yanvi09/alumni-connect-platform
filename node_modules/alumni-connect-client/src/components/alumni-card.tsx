import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Building2, MapPin, Mail } from 'lucide-react'

interface AlumniCardProps {
  alumni: {
    id: number | string
    name: string
    photo: string
    company: string
    position: string
    industry: string
    location: string
    graduationYear: number
  }
}

export function AlumniCard({ alumni }: AlumniCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="mb-4 flex flex-col items-center text-center">
          <Avatar className="mb-3 h-20 w-20">
            <AvatarImage src={alumni.photo || "/placeholder.svg"} alt={alumni.name} />
            <AvatarFallback>{alumni.name[0]}</AvatarFallback>
          </Avatar>
          <h3 className="mb-1 text-lg font-semibold">{alumni.name}</h3>
          <p className="mb-2 text-sm text-muted-foreground">{alumni.position}</p>
          <Badge variant="secondary">Class of {alumni.graduationYear}</Badge>
        </div>
        
        <div className="mb-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{alumni.company}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{alumni.location}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button asChild className="flex-1" size="sm">
            <Link to={`/profile/${alumni.id}`}>View Profile</Link>
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
