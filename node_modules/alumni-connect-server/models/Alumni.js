import mongoose from 'mongoose'

const alumniSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    photo: { type: String, default: '/placeholder.svg' },
    company: { type: String, required: true },
    position: { type: String, required: true },
    industry: { type: String, required: true },
    location: { type: String, required: true },
    graduationYear: { type: Number, required: true },
  },
  { timestamps: true }
)

export const Alumni = mongoose.models.Alumni || mongoose.model('Alumni', alumniSchema)
