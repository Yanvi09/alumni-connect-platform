import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/auth-context'

export function ProtectedRoute({
  children,
  adminOnly,
}: {
  children: React.ReactNode
  adminOnly?: boolean
}) {
  const { user, loading } = useAuth()
  const loc = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: loc.pathname }} replace />
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
