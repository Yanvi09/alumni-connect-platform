import { Router } from 'express'
import { User } from '../models/User.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()
router.use(requireAdmin)

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
    createdAt: u.createdAt,
  }
}

router.get('/stats', async (req, res) => {
  try {
    const pending = await User.countDocuments({ role: 'alumni', status: 'pending' })
    const totalAlumni = await User.countDocuments({ role: 'alumni', status: 'approved' })
    const totalUsers = await User.countDocuments()
    res.json({ pendingCount: pending, totalAlumni, totalUsers })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to load stats' })
  }
})

router.get('/pending', async (req, res) => {
  try {
    const list = await User.find({ role: 'alumni', status: 'pending' })
      .sort({ createdAt: -1 })
      .lean()
    res.json(list.map((u) => userPublic(u)))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to load pending users' })
  }
})

router.post('/users/:id/approve', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || user.role !== 'alumni') {
      return res.status(404).json({ message: 'User not found' })
    }
    user.status = 'approved'
    await user.save()
    res.json({ user: userPublic(user) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Approve failed' })
  }
})

router.post('/users/:id/reject', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || user.role !== 'alumni') {
      return res.status(404).json({ message: 'User not found' })
    }
    user.status = 'rejected'
    await user.save()
    res.json({ user: userPublic(user) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Reject failed' })
  }
})

export default router
