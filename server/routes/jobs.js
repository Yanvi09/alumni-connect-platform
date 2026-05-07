import { Router } from 'express'
import mongoose from 'mongoose'
import { Job } from '../models/Job.js'
import { requireApprovedAlumniOrAdmin } from '../middleware/auth.js'

const router = Router()
router.use(requireApprovedAlumniOrAdmin)

function toJobPayload(job) {
  return {
    id: job._id.toString(),
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.type,
    summary: job.summary,
    description: job.description,
    applyUrl: job.applyUrl,
    createdAt: job.createdAt,
  }
}

router.get('/', async (_req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).lean()
    res.json(jobs.map(toJobPayload))
  } catch (error) {
    console.error('Failed to fetch jobs:', error)
    res.status(500).json({ message: 'Failed to fetch jobs' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid job id' })
    }
    const job = await Job.findById(id).lean()
    if (!job) return res.status(404).json({ message: 'Job not found' })
    res.json(toJobPayload(job))
  } catch (error) {
    console.error('Failed to fetch job detail:', error)
    res.status(500).json({ message: 'Failed to fetch job detail' })
  }
})

export default router
