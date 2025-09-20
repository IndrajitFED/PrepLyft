import mongoose from 'mongoose'
import { User } from '../models/User'
import { connectDB } from '../config/database'

// Connect to database
connectDB()

// Seed mentor availability data
const seedMentorAvailability = async () => {
  try {
    console.log('🌱 Seeding mentor availability...')

    // Update existing mentors with availability data
    const mentors = await User.find({ role: 'mentor' })
    
    for (const mentor of mentors) {
      // Add availability fields to mentor
      mentor.specializations = mentor.specializations || ['DSA', 'Data Science']
      mentor.averageRating = mentor.averageRating || (4.0 + Math.random() * 1.0) // Random rating between 4.0-5.0
      mentor.experience = mentor.experience || Math.floor(Math.random() * 8) + 2 // 2-10 years experience
      mentor.company = mentor.company || ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'][Math.floor(Math.random() * 5)]
      mentor.isActive = true
      
      await mentor.save()
      console.log(`✅ Updated mentor: ${mentor.name} - Rating: ${mentor.averageRating}, Experience: ${mentor.experience} years`)
    }

    console.log(`🎉 Successfully seeded availability for ${mentors.length} mentors`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding mentor availability:', error)
    process.exit(1)
  }
}

// Run the seeder
seedMentorAvailability()
