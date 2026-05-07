import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    dateLabel: { type: String, required: true },
    timeLabel: { type: String, required: true },
    location: { type: String, required: true },
    eventType: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, default: '' },
    capacity: { type: Number, default: 500 },
    registeredUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
)

export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema)
