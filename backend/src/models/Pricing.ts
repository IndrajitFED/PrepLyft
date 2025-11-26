import mongoose, { Document, Schema } from 'mongoose'

export interface IPricing extends Document {
  id: string // Unique identifier like 'DSA', 'Data Science', etc.
  name: string
  price: number // Price in rupees
  description: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const pricingSchema = new Schema<IPricing>(
  {
    id: {
      type: String,
      required: [true, 'Pricing ID is required'],
      unique: true,
      trim: true,
      uppercase: false
    },
    name: {
      type: String,
      required: [true, 'Pricing name is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

// Index for faster lookups
pricingSchema.index({ id: 1 })
pricingSchema.index({ isActive: 1 })

const Pricing = mongoose.model<IPricing>('Pricing', pricingSchema)

export default Pricing

