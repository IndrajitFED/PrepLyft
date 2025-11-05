import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { connectDB } from '../config/database'
import { User } from '../models/User'

dotenv.config()

const indianNames = [
  { name: 'Rajesh Kumar', email: 'rajesh.kumar@example.com', totalScore: 285 },
  { name: 'Priya Sharma', email: 'priya.sharma@example.com', totalScore: 272 },
  { name: 'Amit Patel', email: 'amit.patel@example.com', totalScore: 268 },
  { name: 'Sneha Reddy', email: 'sneha.reddy@example.com', totalScore: 265 },
  { name: 'Vikram Singh', email: 'vikram.singh@example.com', totalScore: 258 },
  { name: 'Anjali Desai', email: 'anjali.desai@example.com', totalScore: 250 },
  { name: 'Arjun Mehta', email: 'arjun.mehta@example.com', totalScore: 245 },
  { name: 'Kavya Iyer', email: 'kavya.iyer@example.com', totalScore: 238 },
  { name: 'Rohan Joshi', email: 'rohan.joshi@example.com', totalScore: 230 },
  { name: 'Divya Nair', email: 'divya.nair@example.com', totalScore: 225 }
]

async function seedLeaderboard() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    for (const candidateData of indianNames) {
      // Check if user already exists
      let user = await User.findOne({ email: candidateData.email })

      if (user) {
        // Update existing user
        user.totalScore = candidateData.totalScore
        user.role = 'candidate'
        // Set some random completed sessions based on score (roughly score / 10)
        user.completedSessions = Math.floor(candidateData.totalScore / 28)
        user.totalSessions = user.completedSessions + 2 // Add some pending
        await user.save()
        console.log(`Updated: ${candidateData.name} (Score: ${candidateData.totalScore})`)
      } else {
        // Create new user
        user = new User({
          name: candidateData.name,
          email: candidateData.email,
          password: 'dummyPassword123', // Dummy password, users should reset
          role: 'candidate',
          totalScore: candidateData.totalScore,
          completedSessions: Math.floor(candidateData.totalScore / 28),
          totalSessions: Math.floor(candidateData.totalScore / 28) + 2,
          credits: 10,
          isVerified: true,
          skills: ['JavaScript', 'React', 'Node.js'],
          avatar: ''
        })
        await user.save()
        console.log(`Created: ${candidateData.name} (Score: ${candidateData.totalScore})`)
      }
    }

    console.log('\n✅ Leaderboard seeding completed!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding leaderboard:', error)
    process.exit(1)
  }
}

// Run the seed function
seedLeaderboard()

