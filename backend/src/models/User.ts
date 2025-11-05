import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: 'candidate' | 'mentor' | 'admin'
  googleId?: string // For Google OAuth
  avatar?: string
  phone?: string
  bio?: string
  skills: string[]
  specializations?: string[] // For mentors: ['DSA', 'Data Science', etc.]
  experience?: number
  company?: string
  position?: string
  workingHours?: {
    start: number
    end: number
  }
  isActive?: boolean // For mentors: whether they're accepting new sessions
  googleCalendarCredentials?: {
    accessToken: string
    refreshToken: string
    calendarId: string
    isConnected: boolean
  }
  isVerified: boolean
  credits: number
  averageRating?: number // For mentors: average rating
  totalSessions: number
  completedSessions: number
  totalScore?: number // Total score for leaderboard (sum of all feedback scores)
  // Subscription plan fields
  subscriptionPlan?: 'basic' | 'standard' | 'premium' | null
  // Track DSA and random subject interviews separately
  dsaInterviewsUsed?: number
  dsaInterviewsLimit?: number
  randomInterviewsUsed?: number
  randomInterviewsLimit?: number
  // Legacy fields (deprecated)
  subscriptionExpiresAt?: Date
  interviewsUsed: number // Track how many interviews have been used
  interviewsLimit: number // Total interviews allowed based on plan
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: function(this: IUser) {
      return !this.googleId // Password not required if Google OAuth
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  googleId: {
    type: String,
    sparse: true, // Allows multiple null values but only one non-null
    unique: true
  },
  role: {
    type: String,
    enum: ['candidate', 'mentor', 'admin'],
    default: 'candidate'
  },
  avatar: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  skills: [{
    type: String,
    trim: true
  }],
  specializations: [{
    type: String,
    enum: ['DSA', 'Data Science', 'Analytics', 'System Design', 'Behavioral'],
    trim: true
  }],
  experience: {
    type: Number,
    min: [0, 'Experience cannot be negative']
  },
  company: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  workingHours: {
    start: {
      type: Number,
      min: 0,
      max: 23,
      default: 9
    },
    end: {
      type: Number,
      min: 0,
      max: 23,
      default: 17
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  googleCalendarCredentials: {
    accessToken: {
      type: String,
      select: false // Don't include in default queries for security
    },
    refreshToken: {
      type: String,
      select: false // Don't include in default queries for security
    },
    calendarId: {
      type: String,
      default: 'primary'
    },
    isConnected: {
      type: Boolean,
      default: false
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  credits: {
    type: Number,
    default: 0,
    min: [0, 'Credits cannot be negative']
  },
  averageRating: {
    type: Number,
    default: 4.5,
    min: [0, 'Average rating cannot be negative'],
    max: [5, 'Average rating cannot be more than 5']
  },
  totalSessions: {
    type: Number,
    default: 0,
    min: [0, 'Total sessions cannot be negative']
  },
  completedSessions: {
    type: Number,
    default: 0,
    min: [0, 'Completed sessions cannot be negative']
  },
  totalScore: {
    type: Number,
    default: 0,
    min: [0, 'Total score cannot be negative']
  },
  subscriptionPlan: {
    type: String,
    enum: ['basic', 'standard', 'premium'],
    default: null
  },
  // Track DSA and random subject interviews separately
  dsaInterviewsUsed: {
    type: Number,
    default: 0,
    min: [0, 'DSA interviews used cannot be negative']
  },
  dsaInterviewsLimit: {
    type: Number,
    default: 0,
    min: [0, 'DSA interview limit cannot be negative']
  },
  randomInterviewsUsed: {
    type: Number,
    default: 0,
    min: [0, 'Random interviews used cannot be negative']
  },
  randomInterviewsLimit: {
    type: Number,
    default: 0,
    min: [0, 'Random interview limit cannot be negative']
  },
  // Legacy fields (kept for backward compatibility, but deprecated)
  interviewsUsed: {
    type: Number,
    default: 0,
    min: [0, 'Interviews used cannot be negative']
  },
  interviewsLimit: {
    type: Number,
    default: 0,
    min: [0, 'Interview limit cannot be negative']
  }
}, {
  timestamps: true
})

// Index for better query performance
userSchema.index({ email: 1 })
userSchema.index({ role: 1 })
userSchema.index({ skills: 1 })

// Hash password before saving
userSchema.pre('save', async function(next) {
  const doc = this as any
  if (!doc.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    doc.password = await bcrypt.hash(doc.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, (this as any).password)
}

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject()
  delete userObject.password
  return userObject
}

export const User = mongoose.model<IUser>('User', userSchema) 