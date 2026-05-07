import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true, trim: true, maxlength: 200 },
    notes: { type: String, default: '', trim: true, maxlength: 2000 },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, enum: [30, 60, 90], default: 60 },
    meetingUrl: { type: String, required: true, trim: true },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  },
  { timestamps: true }
)

sessionSchema.index({ userId: 1, scheduledAt: 1 })
sessionSchema.index({ mentorId: 1, scheduledAt: 1 })

export const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema)
