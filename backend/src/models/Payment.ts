import mongoose, { Document, Schema } from 'mongoose'

export interface IPayment extends Document {
  orderId: string
  paymentId?: string
  userId: string
  amount: number
  currency: string
  field: string
  status: 'created' | 'captured' | 'failed' | 'refunded'
  method?: string
  receipt: string
  notes?: {
    userId: string
    field: string
    sessionType: string
  }
  paidAt?: Date
  refundedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const paymentSchema = new Schema<IPayment>({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  paymentId: {
    type: String,
    unique: true,
    sparse: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'INR'
  },
  field: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['created', 'captured', 'failed', 'refunded'],
    default: 'created'
  },
  method: {
    type: String
  },
  receipt: {
    type: String,
    required: true
  },
  notes: {
    userId: String,
    field: String,
    sessionType: String
  },
  paidAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  }
}, {
  timestamps: true
})

// Index for efficient queries
paymentSchema.index({ userId: 1, status: 1 })
paymentSchema.index({ orderId: 1 })
paymentSchema.index({ paymentId: 1 })

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema)
