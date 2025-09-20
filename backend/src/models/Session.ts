import mongoose, { Document, Schema } from 'mongoose'

export interface ISession extends Document {
  candidate: mongoose.Types.ObjectId
  mentor?: mongoose.Types.ObjectId
  assignedMentor?: mongoose.Types.ObjectId // New field for smart assignment
  type: 'DSA' | 'Data Science' | 'Analytics' | 'System Design' | 'Behavioral'
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'rescheduled' | 'pending'
  scheduledDate?: Date // Legacy field
  date?: string // New date field (YYYY-MM-DD)
  time?: string // New time field (HH:MM)
  duration: number // in minutes
  meetingLink?: string
  meetingPlatform: 'google-meet' | 'zoom' | 'teams'
  meetingId?: string
  meetingPassword?: string
  googleEventId?: string // Google Calendar event ID
  notes?: string
  feedback?: {
    technical: number
    communication: number
    problemSolving: number
    overall: number
    comments: string
    mentor: mongoose.Types.ObjectId
    createdAt: Date
  }
  price?: number
  isPaid?: boolean
  paymentId?: string // Razorpay payment ID
  orderId?: string // Razorpay order ID
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded'
  autoAssigned?: boolean // New field to track if session was auto-assigned
  bookingStatus?: 'pending_assignment' | 'assigned' | 'confirmed' | 'completed' // New booking status
  createdAt: Date
  updatedAt: Date
}

const sessionSchema = new Schema<ISession>({
  candidate: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Candidate is required']
  },
  mentor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  assignedMentor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  type: {
    type: String,
    enum: ['DSA', 'Data Science', 'Analytics', 'System Design', 'Behavioral'],
    required: [true, 'Session type is required']
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'rescheduled', 'pending'],
    default: 'scheduled'
  },
  scheduledDate: {
    type: Date,
    required: false
  },
  date: {
    type: String,
    required: false
  },
  time: {
    type: String,
    required: false
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [15, 'Duration must be at least 15 minutes'],
    max: [180, 'Duration cannot exceed 3 hours']
  },
  meetingLink: {
    type: String,
    trim: true
  },
  meetingPlatform: {
    type: String,
    enum: ['google-meet', 'zoom', 'teams'],
    default: 'google-meet'
  },
  meetingId: {
    type: String,
    trim: true
  },
  googleEventId: {
    type: String,
    trim: true
  },
  meetingPassword: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  feedback: {
    technical: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating cannot exceed 10']
    },
    communication: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating cannot exceed 10']
    },
    problemSolving: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating cannot exceed 10']
    },
    overall: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating cannot exceed 10']
    },
    comments: {
      type: String,
      maxlength: [1000, 'Comments cannot exceed 1000 characters']
    },
    mentor: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  price: {
    type: Number,
    required: false,
    min: [0, 'Price cannot be negative']
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentId: {
    type: String,
    trim: true
  },
  orderId: {
    type: String,
    trim: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  autoAssigned: {
    type: Boolean,
    default: false
  },
  bookingStatus: {
    type: String,
    enum: ['pending_assignment', 'assigned', 'confirmed', 'completed'],
    default: 'pending_assignment'
  }
}, {
  timestamps: true
})

// Indexes for better query performance
sessionSchema.index({ candidate: 1, status: 1 })
sessionSchema.index({ mentor: 1, status: 1 }, { sparse: true }) // sparse index for optional mentor
sessionSchema.index({ scheduledDate: 1 })
sessionSchema.index({ type: 1 })
sessionSchema.index({ status: 1, scheduledDate: 1 })

// Virtual for calculating if session is upcoming
sessionSchema.virtual('isUpcoming').get(function() {
  return this.status === 'scheduled' && this.scheduledDate && this.scheduledDate > new Date()
})

// Virtual for calculating if session is past due
sessionSchema.virtual('isPastDue').get(function() {
  return this.status === 'scheduled' && this.scheduledDate && this.scheduledDate < new Date()
})

// Ensure virtual fields are serialized
sessionSchema.set('toJSON', { virtuals: true })
sessionSchema.set('toObject', { virtuals: true })

export const Session = mongoose.model<ISession>('Session', sessionSchema) 