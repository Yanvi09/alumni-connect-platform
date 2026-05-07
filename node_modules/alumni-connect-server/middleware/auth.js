import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'alumni-connect-dev-secret-change-in-production'

export function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, status: user.status },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

async function loadUserFromCookie(req) {
  const token = req.cookies?.ac_token
  if (!token) return null
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(payload.sub).select('+passwordHash')
    return user
  } catch {
    return null
  }
}

export async function requireAuth(req, res, next) {
  const user = await loadUserFromCookie(req)
  if (!user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }
  req.user = user
  next()
}

export async function requireApprovedAlumniOrAdmin(req, res, next) {
  const user = await loadUserFromCookie(req)
  if (!user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }
  req.user = user
  if (user.role === 'admin') return next()
  if (user.status !== 'approved') {
    return res.status(403).json({ message: 'Account must be approved to use this feature' })
  }
  next()
}

export async function requireAdmin(req, res, next) {
  const user = await loadUserFromCookie(req)
  if (!user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }
  req.user = user
  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

export { loadUserFromCookie }
