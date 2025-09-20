import mongoose from 'mongoose'
import { User } from '../models/User'
import bcrypt from 'bcryptjs'

const seedMentors = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/interview-booking'
    await mongoose.connect(mongoURI)
    console.log('✅ Connected to MongoDB')

    // Sample mentors data
    const mentors = [
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'mentor',
        specializations: ['DSA', 'System Design'],
        experience: 8,
        company: 'Google',
        position: 'Senior Software Engineer',
        bio: 'Expert in algorithms and system design with 8+ years of experience',
        workingHours: { start: 9, end: 17 },
        isActive: true,
        isVerified: true,
        rating: 4.8,
        totalSessions: 0,
        completedSessions: 0
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'mentor',
        specializations: ['DSA', 'Data Science'],
        experience: 6,
        company: 'Microsoft',
        position: 'Data Scientist',
        bio: 'Passionate about data science and machine learning',
        workingHours: { start: 10, end: 18 },
        isActive: true,
        isVerified: true,
        rating: 4.6,
        totalSessions: 0,
        completedSessions: 0
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'mentor',
        specializations: ['Data Science', 'Analytics'],
        experience: 5,
        company: 'Amazon',
        position: 'Senior Data Analyst',
        bio: 'Specialized in business analytics and data visualization',
        workingHours: { start: 8, end: 16 },
        isActive: true,
        isVerified: true,
        rating: 4.7,
        totalSessions: 0,
        completedSessions: 0
      },
      {
        name: 'David Kim',
        email: 'david.kim@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'mentor',
        specializations: ['System Design', 'Behavioral'],
        experience: 10,
        company: 'Netflix',
        position: 'Principal Engineer',
        bio: 'Expert in distributed systems and leadership coaching',
        workingHours: { start: 9, end: 17 },
        isActive: true,
        isVerified: true,
        rating: 4.9,
        totalSessions: 0,
        completedSessions: 0
      },
      {
        name: 'Lisa Wang',
        email: 'lisa.wang@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'mentor',
        specializations: ['Analytics', 'Behavioral'],
        experience: 7,
        company: 'Meta',
        position: 'Product Manager',
        bio: 'Experienced in product analytics and team management',
        workingHours: { start: 10, end: 18 },
        isActive: true,
        isVerified: true,
        rating: 4.5,
        totalSessions: 0,
        completedSessions: 0
      },
      {
        name: 'Alex Thompson',
        email: 'alex.thompson@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'mentor',
        specializations: ['DSA'],
        experience: 4,
        company: 'Uber',
        position: 'Software Engineer',
        bio: 'DSA specialist with focus on competitive programming',
        workingHours: { start: 11, end: 19 },
        isActive: true,
        isVerified: true,
        rating: 4.4,
        totalSessions: 0,
        completedSessions: 0
      }
    ]

    // Clear existing mentors
    await User.deleteMany({ role: 'mentor' })
    console.log('🗑️ Cleared existing mentors')

    // Create mentors
    const createdMentors = await User.insertMany(mentors)
    console.log(`✅ Created ${createdMentors.length} mentors`)

    // Display created mentors
    console.log('\n📋 Created Mentors:')
    createdMentors.forEach(mentor => {
      console.log(`- ${mentor.name} (${mentor.email})`)
      console.log(`  Specializations: ${mentor.specializations?.join(', ')}`)
      console.log(`  Working Hours: ${mentor.workingHours?.start}:00 - ${mentor.workingHours?.end}:00`)
      console.log('')
    })

    console.log('🎉 Mentor seeding completed successfully!')
    process.exit(0)

  } catch (error) {
    console.error('❌ Error seeding mentors:', error)
    process.exit(1)
  }
}

// Run the seeding function
seedMentors()
