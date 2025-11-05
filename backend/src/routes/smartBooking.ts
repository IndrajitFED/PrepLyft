import express from 'express'
import { auth, AuthRequest } from '../middleware/auth'
import { Session } from '../models/Session'
import { User } from '../models/User'
import { Payment } from '../models/Payment'
import { ResponseHandler } from '../utils/response'
import { sendNotification } from '../services/notifications'
import { canBookInterview, incrementInterviewUsage } from '../utils/subscription'

const router = express.Router()

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Smart booking route is working!' })
})

// Get available slots for a field and date
router.get('/available-slots', auth, async (req: AuthRequest, res) => {
  try {
    const { field, date } = req.query

    if (!field || !date) {
      return ResponseHandler.validationError(res, [], 'Field and date are required')
    }

    // Get all mentors who specialize in this field
    console.log('🔍 Searching for mentors with field:', field)
    const mentors = await User.find({
      role: 'mentor',
      isActive: true,
      specializations: { $in: [field] }
    })

    console.log('👥 Found mentors:', mentors.length)
    console.log('📋 Mentor details:', mentors.map(m => ({ name: m.name, specializations: m.specializations, isActive: m.isActive })))

    if (mentors.length === 0) {
      // Let's also check if there are any mentors at all
      const allMentors = await User.find({ role: 'mentor' })
      console.log('👥 All mentors in database:', allMentors.length)
      console.log('📋 All mentor details:', allMentors.map(m => ({ name: m.name, specializations: m.specializations, isActive: m.isActive })))
      
      return ResponseHandler.notFound(res, 'No mentors available for this field')
    }

    // Generate available time slots (without mentor details)
    const availableTimeSlots = new Set<string>()
    const requestedDate = new Date(date as string)
    const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()

    // Collect all available time slots from all mentors
    for (const mentor of mentors) {
      // Check mentor's availability for this day
      const mentorAvailability = await getMentorAvailability(mentor._id as string, dayOfWeek)
      
      if (!mentorAvailability || !mentorAvailability.isActive) {
        continue
      }

      // Get mentor's existing sessions for this date
      const startOfDay = new Date(requestedDate)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(requestedDate)
      endOfDay.setHours(23, 59, 59, 999)
      
      const existingSessions = await Session.find({
        assignedMentor: mentor._id,
        scheduledDate: {
          $gte: startOfDay,
          $lt: endOfDay
        },
        status: { $in: ['scheduled', 'pending'] }
      })

      // Generate time slots based on mentor's availability
      const timeSlots = generateTimeSlots(
        mentorAvailability.startTime,
        mentorAvailability.endTime,
        mentorAvailability.slotDuration || 60
      )

      // Filter out booked slots and add to available slots
      const mentorAvailableSlots = timeSlots.filter(slot => {
        const slotTime = new Date(requestedDate)
        slotTime.setHours(parseInt(slot.split(':')[0]), parseInt(slot.split(':')[1]))
        
        return !existingSessions.some(session => {
          if (!session.scheduledDate) return false
          const sessionTime = new Date(session.scheduledDate)
          return sessionTime.getHours() === slotTime.getHours() && 
                 sessionTime.getMinutes() === slotTime.getMinutes()
        })
      })

      // Add available slots to the set (automatically removes duplicates)
      mentorAvailableSlots.forEach(slot => availableTimeSlots.add(slot))
    }

    // Convert to array and sort by time
    const availableSlots = Array.from(availableTimeSlots)
      .sort()
      .map(time => ({
        id: `${date}_${time}`,
        date: date,
        time: time
      }))

    return ResponseHandler.success(res, { slots: availableSlots }, 'Available slots retrieved successfully')
  } catch (error) {
    console.error('Error fetching available slots:', error)
    return ResponseHandler.error(res, 'Failed to fetch available slots')
  }
})

// Book a session with smart assignment
router.post('/book-smart', auth, async (req: AuthRequest, res) => {
  try {
    const { field, scheduledDate, time, duration, price } = req.body
    const candidateId = req.user?.userId

    console.log('🔍 User from auth middleware:', req.user)
    console.log('🔍 Candidate ID:', candidateId)

    if (!field || !scheduledDate || !time || !duration || !price) {
      return ResponseHandler.validationError(res, [], 'All fields are required')
    }

    if (!candidateId) {
      return ResponseHandler.unauthorized(res, 'User not authenticated')
    }

    // Check subscription limits (pass interview type)
    const subscriptionCheck = await canBookInterview(candidateId, field)
    if (!subscriptionCheck.allowed) {
      return ResponseHandler.error(res, subscriptionCheck.reason || 'Cannot book interview', 400)
    }

    // Get candidate to check quota
    const candidate = await User.findById(candidateId)
    if (!candidate) {
      return ResponseHandler.error(res, 'Candidate not found', 404)
    }

    // Determine if this interview is from plan or separate payment
    let usedFromPlan = false
    if (candidate.subscriptionPlan) {
      const dsaLimit = candidate.dsaInterviewsLimit || 0
      const dsaUsed = candidate.dsaInterviewsUsed || 0
      const randomLimit = candidate.randomInterviewsLimit || 0
      const randomUsed = candidate.randomInterviewsUsed || 0
      
      if (field === 'DSA' && dsaLimit > dsaUsed) {
        usedFromPlan = true
      } else if (['Data Science', 'Analytics', 'System Design', 'Behavioral'].includes(field)) {
        if (randomLimit > randomUsed) {
          usedFromPlan = true
        }
      }
    }

    // Find the best available mentor for this time slot
    const assignedMentor = await findBestMentorForSlot(field, scheduledDate, time)
    
    if (!assignedMentor) {
      return ResponseHandler.conflict(res, 'This time slot is no longer available')
    }

    // Check if there's a completed payment for this field
    const completedPayment = await Payment.findOne({
      userId: candidateId,
      field: field,
      status: 'captured'
    }).sort({ createdAt: -1 }) // Get the most recent payment

    // Create session (pending - wait for mentor approval)
    const session = new Session({
      candidate: candidateId,
      assignedMentor: assignedMentor._id,
      type: field,
      status: 'pending',
      scheduledDate: new Date(`${scheduledDate}T${time}`),
      duration: duration,
      price: price,
      autoAssigned: true,
      bookingStatus: 'assigned', // Valid enum: pending_assignment | assigned | confirmed | completed
      // Mark as paid if there's a completed payment
      isPaid: !!completedPayment,
      paymentId: completedPayment?.paymentId,
      orderId: completedPayment?.orderId,
      paymentStatus: completedPayment ? 'completed' : 'pending'
    })

    await session.save()

    // Increment interview usage (with type and whether used from plan)
    await incrementInterviewUsage(candidateId, field, usedFromPlan)

    // Send notifications to mentor and candidate
    await sendNotification((assignedMentor._id as any).toString(), 'session_booked', {
      sessionId: session._id as string,
      candidateName: candidate.name,
      type: field,
      scheduledDate: session.scheduledDate
    })

    // Notify candidate that session is pending mentor approval
    await sendNotification(candidateId, 'session_booked', {
      sessionId: session._id as string,
      mentorName: assignedMentor.name,
      type: field,
      scheduledDate: session.scheduledDate
    })

    return ResponseHandler.success(res, {
      sessionId: session._id,
      session: {
        id: session._id,
        mentorName: assignedMentor.name,
        mentorEmail: assignedMentor.email,
        scheduledDate: session.scheduledDate,
        time: time,
        field: field,
        status: 'pending'
      }
    }, 'Session booked successfully. Waiting for mentor approval.')
  } catch (error) {
    console.error('Error booking session:', error)
    return ResponseHandler.error(res, 'Failed to book session')
  }
})

// Helper function to get mentor availability
async function getMentorAvailability(mentorId: string, dayOfWeek: string) {
  // This would typically come from a mentor availability table
  // For now, return a default availability
  return {
    isActive: true,
    startTime: '09:00',
    endTime: '18:00',
    slotDuration: 60,
    maxSessionsPerDay: 8
  }
}

// Helper function to find the best mentor for a specific time slot
async function findBestMentorForSlot(field: string, scheduledDate: string, time: string) {
  // Get all mentors who specialize in this field
  const mentors = await User.find({
    role: 'mentor',
    isActive: true,
    specializations: { $in: [field] }
  })

  if (mentors.length === 0) {
    return null
  }

  const requestedDate = new Date(scheduledDate)
  const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const slotDateTime = new Date(`${scheduledDate}T${time}`)

  // Find available mentors for this specific time slot
  const availableMentors = []

  for (const mentor of mentors) {
    // Check mentor's availability for this day
    const mentorAvailability = await getMentorAvailability(mentor._id as string, dayOfWeek)
    
    if (!mentorAvailability || !mentorAvailability.isActive) {
      continue
    }

    // Check if mentor is available at this specific time
    const slotTime = new Date(`2000-01-01T${time}`)
    const startTime = new Date(`2000-01-01T${mentorAvailability.startTime}`)
    const endTime = new Date(`2000-01-01T${mentorAvailability.endTime}`)
    
    if (slotTime < startTime || slotTime >= endTime) {
      continue
    }

    // Check if mentor has any existing sessions at this time
    const startOfDay = new Date(requestedDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(requestedDate)
    endOfDay.setHours(23, 59, 59, 999)
    
    const existingSessions = await Session.find({
      assignedMentor: mentor._id,
      scheduledDate: {
        $gte: startOfDay,
        $lt: endOfDay
      },
      status: { $in: ['scheduled', 'pending'] }
    })

    // Check if this specific time slot is already booked
    const isSlotBooked = existingSessions.some(session => {
      if (!session.scheduledDate) return false
      const sessionTime = new Date(session.scheduledDate)
      return sessionTime.getHours() === slotDateTime.getHours() && 
             sessionTime.getMinutes() === slotDateTime.getMinutes()
    })

    if (!isSlotBooked) {
      availableMentors.push({
        mentor,
        currentLoad: existingSessions.length,
        maxLoad: mentorAvailability.maxSessionsPerDay || 8,
        rating: (mentor as any).averageRating || 4.5
      })
    }
  }

  if (availableMentors.length === 0) {
    return null
  }

  // Sort mentors by best criteria (rating, then load, then experience)
  availableMentors.sort((a, b) => {
    // First by rating (higher is better)
    if (b.rating !== a.rating) {
      return b.rating - a.rating
    }
    // Then by current load (lower is better)
    if (a.currentLoad !== b.currentLoad) {
      return a.currentLoad - b.currentLoad
    }
    // Finally by experience (higher is better)
    return (b.mentor.experience || 0) - (a.mentor.experience || 0)
  })

  return availableMentors[0].mentor
}

// Helper function to generate time slots
function generateTimeSlots(startTime: string, endTime: string, slotDuration: number): string[] {
  const slots = []
  const start = new Date(`2000-01-01T${startTime}`)
  const end = new Date(`2000-01-01T${endTime}`)
  
  let current = new Date(start)
  
  while (current < end) {
    const timeString = current.toTimeString().slice(0, 5)
    slots.push(timeString)
    current.setMinutes(current.getMinutes() + slotDuration)
  }
  
  return slots
}

export default router
