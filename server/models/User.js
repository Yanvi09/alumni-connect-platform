import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['alumni', 'admin'], default: 'alumni' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    photo: { type: String, default: '/placeholder.svg' },
    company: { type: String, default: '' },
    position: { type: String, default: '' },
    industry: { type: String, default: '' },
    location: { type: String, default: '' },
    graduationYear: { type: Number, default: () => new Date().getFullYear() - 4 },
  },
  { timestamps: true }
)

export const User = mongoose.models.User || mongoose.model('User', userSchema)
