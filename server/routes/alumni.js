import { Router } from 'express'
import mongoose from 'mongoose'
import { Alumni } from '../models/Alumni.js'
import { ALUMNI_SEED } from '../seed/alumniSeed.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const fallback = ALUMNI_SEED.map((a, i) => ({ id: i + 1, ...a }))
      return res.json(fallback)
    }

    const list = await Alumni.find().sort({ name: 1 }).lean()
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

export async function seedAlumniIfEmpty() {
  const count = await Alumni.countDocuments()
  if (count === 0) {
    await Alumni.insertMany(ALUMNI_SEED)
    console.log('Seeded alumni collection with demo data')
  }
}

export default router
