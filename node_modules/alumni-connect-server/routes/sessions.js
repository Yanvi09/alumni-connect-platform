import { Router } from 'express'
import mongoose from 'mongoose'
import { Session } from '../models/Session.js'
import { User } from '../models/User.js'
import { requireApprovedAlumniOrAdmin } from '../middleware/auth.js'

const router = Router()
router.use(requireApprovedAlumniOrAdmin)

function serializeSession(s, meId) {
  return {
    id: s._id.toString(),
    topic: s.topic,
    notes: s.notes,
    scheduledAt: s.scheduledAt,
    durationMinutes: s.durationMinutes,
    meetingUrl: s.meetingUrl,
    status: s.status,
    mentor: s.mentorId
      ? {
          id: s.mentorId._id.toString(),
          name: s.mentorId.name,
          photo: s.mentorId.photo,
          company: s.mentorId.company,
          position: s.mentorId.position,
        }
      : null,
    isMine: s.userId?._id?.toString?.() === meId.toString(),
  }
}

router.get('/', async (req, res) => {
  try {
    const me = req.user._id
    const sessions = await Session.find({ userId: me })
      .populate('userId', 'name')
      .populate('mentorId', 'name photo company position')
      .sort({ scheduledAt: 1 })
      .lean()

    res.json(sessions.map((s) => serializeSession(s, me)))
  } catch (error) {
    console.error('Failed to fetch sessions:', error)
    res.status(500).json({ message: 'Failed to fetch sessions' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { mentorId, date, time, durationMinutes, topic, notes } = req.body
    if (!mentorId || !date || !time || !durationMinutes || !topic) {
      return res.status(400).json({ message: 'mentorId, date, time, durationMinutes, and topic are required' })
    }
    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({ message: 'Invalid mentor id' })
    }
    const mentor = await User.findById(mentorId)
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' })
    if (mentor.role !== 'alumni' || mentor.status !== 'approved') {
      return res.status(400).json({ message: 'Selected mentor is not available' })
    }
    const safeDuration = Number(durationMinutes)
    if (![30, 60, 90].includes(safeDuration)) {
      return res.status(400).json({ message: 'Duration must be 30, 60, or 90 minutes' })
    }
    const scheduledAt = new Date(`${date}T${time}:00`)
    if (Number.isNaN(scheduledAt.getTime()) || scheduledAt < new Date()) {
      return res.status(400).json({ message: 'Please choose a valid future date/time' })
    }
    const cleanTopic = String(topic).trim()
    if (cleanTopic.length < 3) {
      return res.status(400).json({ message: 'Topic must be at least 3 characters' })
    }

    const session = await Session.create({
      userId: req.user._id,
      mentorId,
      topic: cleanTopic,
      notes: notes ? String(notes).trim() : '',
      scheduledAt,
      durationMinutes: safeDuration,
      meetingUrl: `https://meet.jit.si/alumniconnect-${req.user._id.toString().slice(-6)}-${Date.now()}`,
      status: 'scheduled',
    })
    const populated = await Session.findById(session._id)
      .populate('userId', 'name')
      .populate('mentorId', 'name photo company position')
      .lean()
    res.status(201).json(serializeSession(populated, req.user._id))
  } catch (error) {
    console.error('Failed to book session:', error)
    res.status(500).json({ message: 'Failed to book session' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const sessionId = req.params.id
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: 'Invalid session id' })
    }
    const { date, time } = req.body
    if (!date || !time) {
      return res.status(400).json({ message: 'date and time are required' })
    }
    const scheduledAt = new Date(`${date}T${time}:00`)
    if (Number.isNaN(scheduledAt.getTime()) || scheduledAt < new Date()) {
      return res.status(400).json({ message: 'Please choose a valid future date/time' })
    }
    const session = await Session.findOne({ _id: sessionId, userId: req.user._id })
    if (!session) return res.status(404).json({ message: 'Session not found' })
    session.scheduledAt = scheduledAt
    await session.save()
    const populated = await Session.findById(session._id)
      .populate('userId', 'name')
      .populate('mentorId', 'name photo company position')
      .lean()
    res.json(serializeSession(populated, req.user._id))
  } catch (error) {
    console.error('Failed to reschedule session:', error)
    res.status(500).json({ message: 'Failed to reschedule session' })
  }
})

export default router
