import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  GraduationCap,
  Users,
  TrendingUp,
  Globe,
  BookOpen,
  Target,
  HeartHandshake,
  ShieldCheck,
} from 'lucide-react'

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold">AlumniConnect</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </a>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          Digital Platform for Centralized Alumni Data Management
        </h1>
        <p className="mx-auto mb-10 max-w-3xl text-pretty text-lg text-muted-foreground leading-relaxed md:text-xl">
          Connect, engage, and empower your alumni network with our comprehensive platform for seamless data management and meaningful engagement.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="px-8">
            <Link to="/dashboard">View Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8">
            <Link to="/login">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8">
            <Link to="/directory">Alumni Directory</Link>
          </Button>
        </div>
      </section>

      <section id="features" className="container mx-auto px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Platform Features</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Everything you need to manage and engage with your alumni community
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <Users className="mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Alumni Directory</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive database of all alumni with advanced search and filtering capabilities.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <TrendingUp className="mb-4 h-10 w-10 text-accent" />
            <h3 className="mb-2 text-xl font-semibold">Analytics Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Real-time insights into alumni engagement, distribution, and trends.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <Globe className="mb-4 h-10 w-10 text-chart-3" />
            <h3 className="mb-2 text-xl font-semibold">Global Network</h3>
            <p className="text-sm text-muted-foreground">
              Connect alumni across industries, locations, and graduating classes.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <GraduationCap className="mb-4 h-10 w-10 text-chart-4" />
            <h3 className="mb-2 text-xl font-semibold">Mentorship Program</h3>
            <p className="text-sm text-muted-foreground">
              Facilitate connections between alumni mentors and students or recent graduates.
            </p>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="scroll-mt-24 border-t border-border bg-background"
      >
        <div className="container mx-auto px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">About AlumniConnect</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Built for institutions that want one trusted place to grow alumni relationships—not scattered spreadsheets and inbox threads.
            </p>
          </div>

          <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
            <p className="text-pretty text-muted-foreground leading-relaxed">
              AlumniConnect helps universities and alumni associations keep profiles accurate, run engagement programs, and measure impact over time. Whether you are scaling a global network or starting fresh after graduation, the same tools support discovery, communication, and mentorship in one cohesive experience.
            </p>
            <p className="text-pretty text-muted-foreground leading-relaxed">
              Our team partners with advancement offices and volunteer leaders to prioritize privacy, clarity, and ease of use—so alumni spend less time figuring out the platform and more time staying connected.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <BookOpen className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Our mission</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empower every institution to steward its alumni community with reliable data, purposeful outreach, and programs that create lasting value for graduates and students alike.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <Target className="mb-4 h-10 w-10 text-accent" />
              <h3 className="mb-2 text-xl font-semibold">Our vision</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A world where every alumnus can find the right people, events, and opportunities through a single, institution-backed platform—without compromising trust or control of personal information.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <HeartHandshake className="mb-4 h-10 w-10 text-chart-3" />
              <h3 className="mb-2 text-xl font-semibold">Community first</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We design around real workflows: directory search, messaging, events, and mentorship. Feedback from alumni offices shapes what we build next.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <ShieldCheck className="mb-4 h-10 w-10 text-chart-4" />
              <h3 className="mb-2 text-xl font-semibold">Trust & privacy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Role-based access, transparent data practices, and security-minded defaults help institutions meet expectations for compliance and alumni confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card py-16">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">10,000+</div>
              <div className="text-sm text-muted-foreground">Active Alumni</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-accent">500+</div>
              <div className="text-sm text-muted-foreground">Companies</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-chart-3">50+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-chart-4">1,200+</div>
              <div className="text-sm text-muted-foreground">Events Hosted</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 AlumniConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
