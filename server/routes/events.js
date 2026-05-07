import { Router } from 'express'
import mongoose from 'mongoose'
import { Event } from '../models/Event.js'
import { requireApprovedAlumniOrAdmin } from '../middleware/auth.js'

const router = Router()

router.use(requireApprovedAlumniOrAdmin)

router.get('/', async (req, res) => {
  try {
    const uid = req.user._id
    const list = await Event.find().sort({ createdAt: 1 }).lean()
    const out = list.map((e) => {
      const registered = (e.registeredUserIds || []).some((id) => id.toString() === uid.toString())
      return {
        id: e._id.toString(),
        title: e.title,
        date: e.dateLabel,
        time: e.timeLabel,
        location: e.location,
        type: e.eventType,
        category: e.category,
        capacity: e.capacity,
        attendees: e.registeredUserIds?.length ?? 0,
        registered,
      }
    })
    res.json(out)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to load events' })
  }
})

router.get('/:eventId', async (req, res) => {
  try {
    const eid = req.params.eventId
    if (!mongoose.Types.ObjectId.isValid(eid)) {
      return res.status(400).json({ message: 'Invalid event' })
    }
    const event = await Event.findById(eid).lean()
    if (!event) return res.status(404).json({ message: 'Event not found' })
    const uid = req.user._id
    const registered = (event.registeredUserIds || []).some((id) => id.toString() === uid.toString())
    res.json({
      id: event._id.toString(),
      title: event.title,
      date: event.dateLabel,
      time: event.timeLabel,
      location: event.location,
      type: event.eventType,
      category: event.category,
      capacity: event.capacity,
      attendees: event.registeredUserIds?.length ?? 0,
      registered,
      description:
        event.description ||
        `${event.title} is part of AlumniConnect programming focused on ${event.category.toLowerCase()} opportunities and meaningful alumni engagement.`,
    })
  } catch (err) {
    console.error('Failed to load event detail:', err)
    res.status(500).json({ message: 'Failed to load event detail' })
  }
})

async function registerForEvent(req, res) {
  try {
    const eid = req.params.eventId
    if (!mongoose.Types.ObjectId.isValid(eid)) {
      return res.status(400).json({ message: 'Invalid event' })
    }
    const event = await Event.findById(eid)
    if (!event) return res.status(404).json({ message: 'Event not found' })
    const uid = req.user._id
    const already = event.registeredUserIds.some((id) => id.equals(uid))
    if (already) {
      return res.json({ message: 'Already registered', attendees: event.registeredUserIds.length })
    }
    if (event.registeredUserIds.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' })
    }
    event.registeredUserIds.push(uid)
    await event.save()
    res.json({ message: 'Registered', attendees: event.registeredUserIds.length })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Registration failed' })
  }
}

router.post('/:eventId/register', registerForEvent)
router.post('/register', async (req, res) => {
  req.params.eventId = req.body?.eventId
  return registerForEvent(req, res)
})

export default router
