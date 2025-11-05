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
      const mentorDoc = mentor as any
      mentorDoc.specializations = mentorDoc.specializations || ['DSA', 'Data Science']
      mentorDoc.averageRating = mentorDoc.averageRating || (4.0 + Math.random() * 1.0) // Random rating between 4.0-5.0
      mentorDoc.experience = mentorDoc.experience || Math.floor(Math.random() * 8) + 2 // 2-10 years experience
      mentorDoc.company = mentorDoc.company || ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'][Math.floor(Math.random() * 5)]
      mentorDoc.isActive = true
      
      await mentorDoc.save()
      console.log(`✅ Updated mentor: ${mentorDoc.name} - Rating: ${mentorDoc.averageRating}, Experience: ${mentorDoc.experience} years`)
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
