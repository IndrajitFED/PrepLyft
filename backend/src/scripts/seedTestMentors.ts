import mongoose from 'mongoose'
import { User } from '../models/User'
import { connectDB } from '../config/database'
import bcrypt from 'bcryptjs'

// Connect to database
connectDB()

// Seed test mentors
const seedTestMentors = async () => {
  try {
    console.log('🌱 Seeding test mentors...')

    // Clear existing mentors
    await User.deleteMany({ role: 'mentor' })
    console.log('🗑️ Cleared existing mentors')

    // Create test mentors
    const mentors = [
      {
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'mentor',
        specializations: ['DSA', 'System Design'],
        averageRating: 4.8,
        experience: 5,
        company: 'Google',
        isActive: true,
        isVerified: true
      },
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'mentor',
        specializations: ['Data Science', 'Analytics'],
        averageRating: 4.6,
        experience: 7,
        company: 'Microsoft',
        isActive: true,
        isVerified: true
      },
      {
        name: 'Emily Johnson',
        email: 'emily.johnson@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'mentor',
        specializations: ['DSA', 'Behavioral'],
        averageRating: 4.9,
        experience: 4,
        company: 'Amazon',
        isActive: true,
        isVerified: true
      }
    ]

    for (const mentorData of mentors) {
      const mentor = new User(mentorData)
      await mentor.save()
      console.log(`✅ Created mentor: ${mentor.name} - ${mentor.specializations?.join(', ') || 'No specializations'}`)
    }

    console.log(`🎉 Successfully seeded ${mentors.length} test mentors`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding mentors:', error)
    process.exit(1)
  }
}

// Run the seeder
seedTestMentors()
