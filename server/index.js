import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { createServer } from 'http'

import authRoutes from './routes/auth.js'
import alumniRoutes from './routes/alumni.js'
import messagesRoutes from './routes/messages.js'
import eventsRoutes from './routes/events.js'
import adminRoutes from './routes/admin.js'
import usersRoutes from './routes/users.js'
import sessionsRoutes from './routes/sessions.js'
import jobsRoutes from './routes/jobs.js'

import { seedDatabase } from './seed/seedDatabase.js'
import { initSocket } from './socket.js'
import { rateLimit, sanitizeBody } from './middleware/security.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config()

const app = express()

app.set('trust proxy', 1)

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://taupe-florentine-8544f4.netlify.app',
  'https://alumni-connect-platform-2.onrender.com'
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`))
      }
    },
    credentials: true,
  })
)

const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI

const httpServer = createServer(app)

app.use(cookieParser())
app.use(express.json())

app.use(rateLimit)
app.use(sanitizeBody)

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'alumni-connect-api',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/alumni', alumniRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/events', eventsRoutes)
app.use('/api/sessions', sessionsRoutes)
app.use('/api/jobs', jobsRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/users', usersRoutes)

const clientDist = path.join(__dirname, '../client/dist')
const clientIndex = path.join(clientDist, 'index.html')

if (fs.existsSync(clientIndex)) {
  app.use(express.static(clientDist))

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({
        message: 'Not found',
      })
    }

    res.sendFile(clientIndex)
  })
}

async function start() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI missing in .env')
    }

    await mongoose.connect(MONGODB_URI)

    console.log('MongoDB connected')

    await seedDatabase()

    initSocket(httpServer, allowedOrigins[0])

    httpServer.listen(PORT, () => {
      console.log(`API server listening on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message)
    process.exit(1)
  }
}

start()
