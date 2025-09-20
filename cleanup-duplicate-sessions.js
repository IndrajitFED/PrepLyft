const mongoose = require('mongoose')

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/interview-booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const Session = require('./backend/src/models/Session')
const Payment = require('./backend/src/models/Payment')

async function cleanupDuplicateSessions() {
  try {
    console.log('🧹 Starting cleanup of duplicate sessions...')
    
    // Find sessions created through payment flow (have mentor field but no scheduledDate)
    const paymentSessions = await Session.find({
      mentor: { $exists: true },
      scheduledDate: { $exists: false },
      status: 'pending',
      bookingStatus: 'pending_assignment'
    })
    
    console.log(`Found ${paymentSessions.length} sessions created through payment flow`)
    
    // Find sessions created through smart booking (have assignedMentor field)
    const smartBookingSessions = await Session.find({
      assignedMentor: { $exists: true },
      autoAssigned: true
    })
    
    console.log(`Found ${smartBookingSessions.length} sessions created through smart booking`)
    
    // Group by candidate and field to find duplicates
    const candidateFieldGroups = {}
    
    // Process payment sessions
    for (const session of paymentSessions) {
      const key = `${session.candidate}_${session.type}`
      if (!candidateFieldGroups[key]) {
        candidateFieldGroups[key] = { paymentSessions: [], smartBookingSessions: [] }
      }
      candidateFieldGroups[key].paymentSessions.push(session)
    }
    
    // Process smart booking sessions
    for (const session of smartBookingSessions) {
      const key = `${session.candidate}_${session.type}`
      if (!candidateFieldGroups[key]) {
        candidateFieldGroups[key] = { paymentSessions: [], smartBookingSessions: [] }
      }
      candidateFieldGroups[key].smartBookingSessions.push(session)
    }
    
    // Find duplicates and clean up
    let deletedCount = 0
    for (const [key, group] of Object.entries(candidateFieldGroups)) {
      if (group.paymentSessions.length > 0 && group.smartBookingSessions.length > 0) {
        console.log(`\n🔍 Found duplicate for ${key}:`)
        console.log(`  Payment sessions: ${group.paymentSessions.length}`)
        console.log(`  Smart booking sessions: ${group.smartBookingSessions.length}`)
        
        // Keep the smart booking session, delete payment sessions
        for (const paymentSession of group.paymentSessions) {
          console.log(`  🗑️  Deleting payment session: ${paymentSession._id}`)
          await Session.findByIdAndDelete(paymentSession._id)
          deletedCount++
        }
      }
    }
    
    console.log(`\n✅ Cleanup completed! Deleted ${deletedCount} duplicate sessions`)
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  } finally {
    mongoose.connection.close()
  }
}

cleanupDuplicateSessions()
