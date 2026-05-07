import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { Event } from '../models/Event.js'
import { Job } from '../models/Job.js'
import { ALUMNI_SEED } from './alumniSeed.js'

const DEMO_PASSWORD = process.env.DEMO_ALUMNI_PASSWORD || 'AlumniDemo123!'
const SALT = 10

const EVENTS_SEED = [
  {
    title: 'Annual Alumni Networking Event',
    dateLabel: 'January 15, 2026',
    timeLabel: '6:00 PM - 9:00 PM',
    location: 'Grand Hotel, New York',
    eventType: 'In-Person',
    category: 'Networking',
    description:
      'Build meaningful relationships with alumni leaders through guided networking circles and live discussion rounds.',
    capacity: 300,
  },
  {
    title: 'Tech Career Workshop: AI & Machine Learning',
    dateLabel: 'January 22, 2026',
    timeLabel: '2:00 PM - 4:00 PM',
    location: 'Online',
    eventType: 'Webinar',
    category: 'Education',
    description:
      'A practical webinar covering AI fundamentals, career opportunities, and portfolio guidance from industry experts.',
    capacity: 500,
  },
  {
    title: 'Startup Pitch Competition',
    dateLabel: 'February 5, 2026',
    timeLabel: '10:00 AM - 5:00 PM',
    location: 'Innovation Hub, San Francisco',
    eventType: 'In-Person',
    category: 'Competition',
    description:
      'Pitch your startup idea to experienced alumni founders and investors with structured feedback sessions.',
    capacity: 200,
  },
  {
    title: 'Leadership Panel Discussion',
    dateLabel: 'February 12, 2026',
    timeLabel: '7:00 PM - 8:30 PM',
    location: 'Online',
    eventType: 'Webinar',
    category: 'Panel',
    description:
      'Hear from senior alumni leaders on career progression, resilience, and leadership transitions.',
    capacity: 400,
  },
]

const JOBS_SEED = [
  {
    title: 'Senior Frontend Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    type: 'Full-time',
    summary: 'Build scalable React interfaces for core product experiences.',
    description:
      'Own frontend architecture, collaborate with product/design, and deliver reliable high-performance UI for millions of users.',
    applyUrl: 'https://careers.google.com/',
  },
  {
    title: 'Product Manager, Growth',
    company: 'Microsoft',
    location: 'Seattle, WA',
    type: 'Full-time',
    summary: 'Drive activation and retention strategy for cloud products.',
    description:
      'Lead roadmap definition, partner with engineering and data science, and run experiments to improve customer adoption.',
    applyUrl: 'https://careers.microsoft.com/',
  },
  {
    title: 'Data Analyst (Alumni Insights)',
    company: 'AlumniConnect',
    location: 'Remote',
    type: 'Contract',
    summary: 'Analyze alumni engagement data and present actionable insights.',
    description:
      'Create dashboards, investigate trends, and support leadership decision-making with clean and reliable analytics.',
    applyUrl: 'https://www.linkedin.com/jobs/',
  },
]

export async function seedDatabase() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@alumniconnect.local').toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!'

  const userCount = await User.countDocuments()
  if (userCount === 0) {
    const hash = await bcrypt.hash(adminPassword, SALT)
    await User.create({
      email: adminEmail,
      passwordHash: hash,
      name: 'Platform Admin',
      role: 'admin',
      status: 'approved',
      company: 'AlumniConnect',
      position: 'Administrator',
      industry: 'Education',
      location: 'Global',
      graduationYear: 2010,
    })
    console.log(`Seeded admin: ${adminEmail} (change ADMIN_PASSWORD in production)`)

    const demoHash = await bcrypt.hash(DEMO_PASSWORD, SALT)
    for (let i = 0; i < ALUMNI_SEED.length; i++) {
      const row = ALUMNI_SEED[i]
      const email = `demo.alumni.${i + 1}@alumniconnect.local`
      await User.create({
        email,
        passwordHash: demoHash,
        name: row.name,
        role: 'alumni',
        status: 'approved',
        photo: row.photo,
        company: row.company,
        position: row.position,
        industry: row.industry,
        location: row.location,
        graduationYear: row.graduationYear,
      })
    }
    console.log(`Seeded ${ALUMNI_SEED.length} demo alumni accounts (password: ${DEMO_PASSWORD})`)
  }

  const evCount = await Event.countDocuments()
  if (evCount === 0) {
    await Event.insertMany(
      EVENTS_SEED.map((e) => ({
        ...e,
        registeredUserIds: [],
      }))
    )
    console.log('Seeded events')
  }

  const jobCount = await Job.countDocuments()
  if (jobCount === 0) {
    await Job.insertMany(JOBS_SEED)
    console.log('Seeded jobs')
  }
}
