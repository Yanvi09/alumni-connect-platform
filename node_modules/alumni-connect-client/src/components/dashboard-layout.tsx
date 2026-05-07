import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  Briefcase,
  Settings,
  Menu,
  X,
  GraduationCap,
  Moon,
  Sun,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/auth-context'
import { useTheme } from 'next-themes'

const ALL_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
  { href: '/directory', label: 'Directory', icon: Users, adminOnly: false },
  { href: '/communication', label: 'Messages', icon: MessageSquare, adminOnly: false },
  { href: '/mentorship', label: 'Mentorship', icon: GraduationCap, adminOnly: false },
  { href: '/events', label: 'Events', icon: Calendar, adminOnly: false },
  { href: '/jobs', label: 'Jobs', icon: Briefcase, adminOnly: false },
  { href: '/admin', label: 'Admin', icon: Settings, adminOnly: true },
] as const

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()

  const navItems = ALL_NAV.filter((item) => !item.adminOnly || user?.role === 'admin')

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-sidebar-border p-6">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-sidebar-primary" />
              <span className="text-xl font-semibold">AlumniConnect</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-sidebar-border p-4">
            <Link
              to={user ? `/profile/${user.id}` : '/login'}
              className="mb-3 flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent"
            >
              <Avatar>
                <AvatarImage src={user?.photo || '/user-profile-illustration.png'} alt={user?.name} />
                <AvatarFallback>{user?.name?.[0] ?? '?'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="truncate font-semibold">{user?.name ?? 'Account'}</div>
                <div className="truncate text-xs text-sidebar-foreground/70">View profile</div>
              </div>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-sidebar-border text-sidebar-foreground"
              onClick={() => void logout().then(() => navigate('/'))}
            >
              Log out
            </Button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex flex-1 items-center justify-end gap-4">
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Link to="/">
                <Button variant="outline" size="sm">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
