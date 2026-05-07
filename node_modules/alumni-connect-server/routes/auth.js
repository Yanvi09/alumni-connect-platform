import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { signToken, loadUserFromCookie } from '../middleware/auth.js'

const router = Router()
const SALT_ROUNDS = 10

function userPublic(u) {
  return {
    id: u._id.toString(),
    email: u.email,
    name: u.name,
    role: u.role,
    status: u.status,
    photo: u.photo,
    company: u.company,
    position: u.position,
    industry: u.industry,
    location: u.location,
    graduationYear: u.graduationYear,
  }
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, graduationYear, company, position, industry, location } = req.body
    if (!email || !password || !name || graduationYear == null) {
      return res.status(400).json({ message: 'Email, password, name, and graduation year are required' })
    }
    if (String(password).length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }
    const exists = await User.findOne({ email: String(email).toLowerCase().trim() })
    if (exists) return res.status(409).json({ message: 'Email already registered' })
    const passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS)
    const user = await User.create({
      email: String(email).toLowerCase().trim(),
      passwordHash,
      name: String(name).trim(),
      graduationYear: Number(graduationYear),
      company: company ? String(company) : '',
      position: position ? String(position) : '',
      industry: industry ? String(industry) : '',
      location: location ? String(location) : '',
      role: 'alumni',
      status: 'pending',
    })
    res.status(201).json({
      message: 'Registration successful. An administrator will review your account.',
      user: userPublic(user),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })
    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+passwordHash')
    if (!user || !(await bcrypt.compare(String(password), user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    if (user.status === 'pending') {
      return res.status(403).json({ code: 'PENDING', message: 'Your account is pending admin approval.' })
    }
    if (user.status === 'rejected') {
      return res.status(403).json({ code: 'REJECTED', message: 'Your registration was not approved.' })
    }
    const token = signToken(user)
    res.cookie('ac_token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      path: '/',
    })
    res.json({ user: userPublic(user) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Login failed' })
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie('ac_token', { path: '/' })
  res.json({ ok: true })
})

router.get('/me', async (req, res) => {
  try {
    const user = await loadUserFromCookie(req)
    if (!user) return res.json({ user: null })
    res.json({ user: userPublic(user) })
  } catch {
    res.json({ user: null })
  }
})

export default router
