import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api, type ApiError } from '@/lib/api'

export type AuthUser = {
  id: string
  email: string
  name: string
  role: 'alumni' | 'admin'
  status: 'pending' | 'approved' | 'rejected'
  photo: string
  company: string
  position: string
  industry: string
  location: string
  graduationYear: number
}

type AuthState = {
  user: AuthUser | null
  loading: boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
}

export type RegisterPayload = {
  email: string
  password: string
  name: string
  graduationYear: number
  company?: string
  position?: string
  industry?: string
  location?: string
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const { user: u } = await api<{ user: AuthUser | null }>('/api/auth/me')
      setUser(u)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback(async (email: string, password: string) => {
    const { user: u } = await api<{ user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setUser(u)
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }, [])

  const logout = useCallback(async () => {
    await api('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, refresh, logout, login, register }),
    [user, loading, refresh, logout, login, register]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof Error && 'status' in e
}
