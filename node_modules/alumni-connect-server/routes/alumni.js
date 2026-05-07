import { Router } from 'express'
import mongoose from 'mongoose'
import { User } from '../models/User.js'
import { ALUMNI_SEED } from '../seed/alumniSeed.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const fallback = ALUMNI_SEED.map((a, i) => ({ id: String(i + 1), ...a }))
      return res.json(fallback)
    }

    const list = await User.find({
      role: 'alumni',
      status: 'approved',
    })
      .sort({ name: 1 })
      .lean()

    const withId = list.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      photo: doc.photo,
      company: doc.company,
      position: doc.position,
      industry: doc.industry,
      location: doc.location,
      graduationYear: doc.graduationYear,
    }))
    res.json(withId)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to load alumni' })
  }
})

export default router
