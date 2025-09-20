import express from 'express'
import { auth, AuthRequest } from '../middleware/auth'
import { Session } from '../models/Session'
import { User } from '../models/User'
import { Payment } from '../models/Payment'
import { ResponseHandler } from '../utils/response'
import { GoogleCalendarService } from '../services/googleCalendar'
import { GoogleMeetService } from '../services/googleMeetService'
import { sendNotification } from '../services/notifications'

const router = express.Router()
const googleCalendar = new GoogleCalendarService()
const googleMeetService = new GoogleMeetService()

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Smart booking route is working!' })
})

// Test Google Meet service endpoint
router.get('/test-google-meet', auth, async (req: AuthRequest, res) => {
  try {
    const testData = {
      id: 'test-' + Date.now(),
      date: '2025-09-16',
      time: '10:00',
      duration: 60,
      mentorName: 'Test Mentor',
      candidateName: 'Test Candidate',
      mentorEmail: 'mentor@example.com',
      candidateEmail: 'candidate@example.com',
      type: 'DSA'
    }

    const result = await googleMeetService.createGoogleMeetRoom(testData)
    
    if (result) {
      return ResponseHandler.success(res, {
        meetingLink: result.meetingLink,
        eventId: result.eventId,
        joinUrl: result.joinUrl,
        testData: testData
      }, 'Google Meet room created successfully!')
    } else {
      return ResponseHandler.error(res, 'Google Meet service not configured or authentication failed')
    }
  } catch (error) {
    console.error('Google Meet test error:', error)
    return ResponseHandler.error(res, `Google Meet test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
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

    // Create session
    const session = new Session({
      candidate: candidateId,
      assignedMentor: assignedMentor._id,
      type: field,
      status: 'scheduled',
      scheduledDate: new Date(`${scheduledDate}T${time}`),
      duration: duration,
      price: price,
      autoAssigned: true,
      bookingStatus: 'confirmed',
      // Mark as paid if there's a completed payment
      isPaid: !!completedPayment,
      paymentId: completedPayment?.paymentId,
      orderId: completedPayment?.orderId,
      paymentStatus: completedPayment ? 'completed' : 'pending'
    })

    console.log('Creating session with candidateId:', candidateId)
    console.log('Session data:', {
      candidate: candidateId,
      assignedMentor: assignedMentor._id,
      type: field,
      status: 'scheduled',
      scheduledDate: new Date(`${scheduledDate}T${time}`),
      duration: duration,
      price: price
    })

    await session.save()

    // Get candidate details for Google Meet creation
    const candidate = await User.findById(candidateId)
    if (!candidate) {
      return ResponseHandler.error(res, 'Candidate not found')
    }

    // Create Google Meet room automatically
    let meetingLink = null
    let googleEventId = null
    
    try {
      console.log('🚀 Creating Google Meet room automatically...')
      const meetRoom = await googleMeetService.createGoogleMeetRoom({
        id: session._id?.toString() || '',
        date: scheduledDate,
        time: time,
        duration: duration,
        mentorName: assignedMentor.name,
        candidateName: candidate.name,
        mentorEmail: assignedMentor.email,
        candidateEmail: candidate.email,
        type: field
      })

      if (meetRoom) {
        meetingLink = meetRoom.meetingLink
        googleEventId = meetRoom.eventId

        // Update session with meeting details
        session.meetingLink = meetingLink
        session.googleEventId = googleEventId
        await session.save()

        console.log('✅ Google Meet room created automatically:', meetingLink)
      } else {
        console.log('⚠️  Google Meet service not available, trying fallback...')
        
        // Fallback to Google Calendar service
        const calendarEvent = await googleCalendar.createCalendarEvent({
          id: session._id?.toString() || '',
          date: scheduledDate,
          time: time,
          duration: duration,
          mentorName: assignedMentor.name,
          candidateName: candidate.name,
          mentorEmail: assignedMentor.email,
          candidateEmail: candidate.email,
          type: field
        })

        meetingLink = calendarEvent.hangoutLink || calendarEvent.conferenceData?.entryPoints?.[0]?.uri
        googleEventId = calendarEvent.id

        // Update session with meeting details
        session.meetingLink = meetingLink
        session.googleEventId = googleEventId
        await session.save()

        console.log('✅ Fallback Google Meet link created:', meetingLink)
      }
    } catch (error) {
      console.error('❌ Failed to create Google Meet room:', error)
      // Continue without Google Meet integration
    }

    // Send notifications to mentor and candidate
    await sendNotification((assignedMentor._id as any).toString(), 'session_booked', {
      sessionId: session._id as string,
      candidateName: candidate.name,
      type: field,
      scheduledDate: session.scheduledDate
    })

    await sendNotification(candidateId, 'session_confirmed', {
      sessionId: session._id as string,
      mentorName: assignedMentor.name,
      type: field,
      scheduledDate: session.scheduledDate,
      meetingLink: meetingLink
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
        meetingLink: meetingLink
      }
    }, 'Session booked successfully with Google Meet link')
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
        rating: mentor.averageRating || 4.5
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
