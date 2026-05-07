import { Router } from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { Message } from '../models/Message.js'
import { User } from '../models/User.js'
import { requireApprovedAlumniOrAdmin } from '../middleware/auth.js'
import { emitToUser } from '../socket.js'
import { generateAiReply } from '../services/aiReply.js'

const router = Router()
const BOT_EMAIL = (process.env.AI_BOT_EMAIL || 'assistant@alumniconnect.local').toLowerCase()
const BOT_NAME = process.env.AI_BOT_NAME || 'Alumni AI Assistant'
const BOT_PASSWORD = process.env.AI_BOT_PASSWORD || 'Assistant#2026'

router.use(requireApprovedAlumniOrAdmin)

async function ensureAssistantUser() {
  let assistant = await User.findOne({ email: BOT_EMAIL })
  if (assistant) return assistant

  const passwordHash = await bcrypt.hash(BOT_PASSWORD, 10)
  assistant = await User.create({
    email: BOT_EMAIL,
    passwordHash,
    name: BOT_NAME,
    role: 'alumni',
    status: 'approved',
    company: 'AlumniConnect',
    position: 'AI Assistant',
    industry: 'Technology',
    location: 'Online',
    photo: '/placeholder.svg',
    graduationYear: new Date().getFullYear(),
  })

  return assistant
}

function toThreadMessage(message, myUserId) {
  return {
    id: message._id.toString(),
    body: message.body,
    createdAt: message.createdAt,
    isMine: message.from.toString() === myUserId.toString(),
    from: message.from.toString(),
    to: message.to.toString(),
  }
}

router.get('/conversations', async (req, res) => {
  try {
    const me = req.user._id
    const msgs = await Message.find({
      $or: [{ from: me }, { to: me }],
    })
      .sort({ createdAt: -1 })
      .populate('from', 'name photo email')
      .populate('to', 'name photo email')
      .lean()

    const byPartner = new Map()
    for (const m of msgs) {
      const fromId = m.from._id.toString()
      const toId = m.to._id.toString()
      const myId = me.toString()
      const partnerId = fromId === myId ? toId : fromId
      const partner = fromId === myId ? m.to : m.from
      if (!byPartner.has(partnerId)) {
        byPartner.set(partnerId, {
          partner: {
            id: partnerId,
            name: partner.name,
            photo: partner.photo,
            email: partner.email,
          },
          lastMessage: m.body,
          lastAt: m.createdAt,
          unread: 0,
        })
      }
    }
    res.json([...byPartner.values()])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to load conversations' })
  }
})

router.get('/thread/:userId', async (req, res) => {
  try {
    const me = req.user._id
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: 'Invalid user id' })
    }
    const other = new mongoose.Types.ObjectId(req.params.userId)
    const list = await Message.find({
      $or: [
        { from: me, to: other },
        { from: other, to: me },
      ],
    })
      .sort({ createdAt: 1 })
      .lean()

    await Message.updateMany({ from: other, to: me, readAt: null }, { readAt: new Date() })

    const messages = list.map((m) => ({
      id: m._id.toString(),
      body: m.body,
      createdAt: m.createdAt,
      isMine: m.from.toString() === me.toString(),
    }))
    res.json(messages)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to load messages' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { toUserId, body } = req.body
    if (!toUserId || !body || !String(body).trim()) {
      return res.status(400).json({ message: 'Recipient and message are required' })
    }
    if (toUserId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot message yourself' })
    }
    const recipient = await User.findById(toUserId)
    if (!recipient) return res.status(404).json({ message: 'User not found' })
    const canMessage =
      recipient.role === 'admin' ||
      (recipient.role === 'alumni' && recipient.status === 'approved')
    if (!canMessage) return res.status(400).json({ message: 'Cannot message this user' })
    const userMessage = await Message.create({
      from: req.user._id,
      to: toUserId,
      body: String(body).trim(),
    })

    const assistant = await ensureAssistantUser()
    const aiText = await generateAiReply(body)
    const aiMessage = await Message.create({
      from: assistant._id,
      to: req.user._id,
      body: aiText,
    })

    const userPayload = toThreadMessage(userMessage, req.user._id)
    const aiPayload = toThreadMessage(aiMessage, req.user._id)

    emitToUser(req.user._id.toString(), 'receiveMessage', userPayload)
    emitToUser(toUserId, 'receiveMessage', userPayload)
    emitToUser(req.user._id.toString(), 'receiveMessage', aiPayload)

    res.status(201).json({
      userMessage: userPayload,
      aiMessage: aiPayload,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to send message' })
  }
})

export default router
