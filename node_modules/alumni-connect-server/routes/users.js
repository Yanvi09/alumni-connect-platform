import { Router } from 'express'
import { User } from '../models/User.js'
import { requireApprovedAlumniOrAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/:id', requireApprovedAlumniOrAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean()
    if (!user) return res.status(404).json({ message: 'Profile not found' })
    const isSelf = user._id.toString() === req.user._id.toString()
    if (user.role === 'admin' && !isSelf) {
      return res.status(404).json({ message: 'Profile not found' })
    }
    if (user.role === 'alumni' && user.status !== 'approved' && !isSelf) {
      return res.status(404).json({ message: 'Profile not found' })
    }
    res.json({
      id: user._id.toString(),
      name: user.name,
      photo: user.photo,
      company: user.company,
      position: user.position,
      industry: user.industry,
      location: user.location,
      graduationYear: user.graduationYear,
      email: isSelf ? user.email : undefined,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to load profile' })
  }
})

export default router
