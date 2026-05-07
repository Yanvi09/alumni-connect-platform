import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true, maxlength: 400 },
    description: { type: String, required: true, trim: true, maxlength: 4000 },
    applyUrl: { type: String, required: true, trim: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export const Job = mongoose.models.Job || mongoose.model('Job', jobSchema)
