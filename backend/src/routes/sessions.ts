import express from 'express'
import mongoose from 'mongoose'
import { body, validationResult } from 'express-validator'
import { Session } from '../models/Session'
import { User } from '../models/User'
import { auth, requireRole, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { sendNotification } from '../services/notifications'
import { MentorCalendarService } from '../services/mentorCalendar'
import { GoogleMeetService } from '../services/googleMeetService'
import { checkSessionAvailability } from '../utils/availability'
import { ResponseHandler } from '../utils/response'
import { canBookInterview, incrementInterviewUsage, getUserSubscription } from '../utils/subscription'

const router = express.Router()
const googleMeetService = new GoogleMeetService()

// @route   GET /api/sessions/mentor
// @desc    Get mentor's assigned sessions
// @access  Private (Mentor only)
router.get('/mentor', [
  auth,
  requireRole(['mentor'])
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const mentorId = req.user!.userId

  try {
    const sessions = await Session.find({ 
      $or: [
        { mentor: mentorId },
        { assignedMentor: mentorId }
      ]
    })
      .populate('candidate', 'name email')
      .populate('assignedMentor', 'name email')
      .sort({ createdAt: -1 })

    return ResponseHandler.success(res, { sessions }, 'Mentor sessions retrieved successfully')
  } catch (error) {
    console.error('Error fetching mentor sessions:', error)
    return ResponseHandler.error(res, 'Failed to fetch mentor sessions', 500)
  }
}))

// @route   POST /api/sessions/book
// @desc    Book a new interview session
// @access  Private (Candidates only)
router.post('/book', [
  auth,
  requireRole(['candidate']),
  body('mentorId').isMongoId().withMessage('Valid mentor ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format (HH:MM) is required'),
  body('duration').isInt({ min: 15, max: 180 }).withMessage('Duration must be between 15 and 180 minutes'),
  body('type').isIn(['DSA', 'Data Science', 'Analytics', 'System Design', 'Behavioral']).withMessage('Valid session type is required')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return ResponseHandler.validationError(res, errors.array())
  }

  const { mentorId, date, time, duration, type, notes } = req.body
  const candidateId = req.user!.userId

  // Check if candidate exists
  const candidate = await User.findById(candidateId)
  if (!candidate) {
    return ResponseHandler.notFound(res, 'Candidate not found')
  }

  // Check subscription limits (pass interview type)
  const subscriptionCheck = await canBookInterview(candidateId, type)
  if (!subscriptionCheck.allowed) {
    return ResponseHandler.error(res, subscriptionCheck.reason || 'Cannot book interview', 400)
  }

  // Determine if this interview is from plan or separate payment
  // If user has subscription and has quota remaining, use from plan
  let usedFromPlan = false
  if (candidate.subscriptionPlan) {
    const dsaLimit = candidate.dsaInterviewsLimit || 0
    const dsaUsed = candidate.dsaInterviewsUsed || 0
    const randomLimit = candidate.randomInterviewsLimit || 0
    const randomUsed = candidate.randomInterviewsUsed || 0
    
    if (type === 'DSA' && dsaLimit > dsaUsed) {
      usedFromPlan = true
    } else if (['Data Science', 'Analytics', 'System Design', 'Behavioral'].includes(type)) {
      if (randomLimit > randomUsed) {
        usedFromPlan = true
      }
    }
  }

  // Check if mentor exists
  const mentor = await User.findById(mentorId)
  if (!mentor || mentor.role !== 'mentor') {
    return ResponseHandler.notFound(res, 'Mentor not found')
  }

  // Check if the time slot is available
  const isAvailable = await checkSessionAvailability(Session, {
    mentorId,
    date,
    time
  })

  if (!isAvailable) {
    return ResponseHandler.conflict(res, 'This time slot is already booked. Please choose another time.')
  }

  // Create session (pending; do NOT create calendar event here)
  const session = new Session({
    candidate: candidateId,
    mentor: mentorId,
    type,
    date,
    time,
    duration,
    notes,
    status: 'pending',
    meetingPlatform: 'google-meet'
  })

  await session.save()

  // Increment interview usage (with type and whether used from plan)
  await incrementInterviewUsage(candidateId, type, usedFromPlan)

  // Send notifications
  await sendNotification(mentorId, 'session_booked', {
    sessionId: session._id as string,
    candidateName: candidate.name,
    type,
    scheduledDate: session.scheduledDate || (session.date && session.time ? new Date(`${session.date}T${session.time}`) : new Date())
  })

  // Notify candidate that session is pending mentor approval
  await sendNotification(candidateId, 'session_booked', {
    sessionId: session._id as string,
    mentorName: mentor.name,
    type,
    scheduledDate: session.scheduledDate || (session.date && session.time ? new Date(`${session.date}T${session.time}`) : new Date())
  })

  // Populate user details
  await session.populate([
    { path: 'candidate', select: 'name email avatar' },
    { path: 'mentor', select: 'name email avatar company position' }
  ])

  return ResponseHandler.created(res, { session: session.toJSON() }, 'Session booked successfully!')
}))

// @route   GET /api/sessions/my-sessions
// @desc    Get user's sessions (candidate or mentor)
// @access  Private
router.get('/my-sessions', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const userId = req.user!.userId
  const user = await User.findById(userId)
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }

  const query = user.role === 'candidate' 
    ? { candidate: userId }
    : { 
        $or: [
          { mentor: userId },
          { assignedMentor: userId }
        ]
      }

  const sessions = await Session.find(query)
    .populate('candidate', 'name email avatar')
    .populate('mentor', 'name email avatar company position')
    .populate('assignedMentor', 'name email avatar company position')
    .sort({ scheduledDate: 1 })

  return res.json({
    success: true,
    sessions: sessions.map(session => session.toJSON())
  })
}))

// @route   GET /api/sessions/:id
// @desc    Get session details
// @access  Private
router.get('/:id', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const session = await Session.findById(req.params.id)
    .populate('candidate', 'name email avatar')
    .populate('mentor', 'name email avatar company position')

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found'
    })
  }

  // Check if user has access to this session
  const userId = req.user!.userId
  if (session.candidate.toString() !== userId && (session.mentor && session.mentor.toString() !== userId)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    })
  }

  return res.json({
    success: true,
    session: session.toJSON()
  })
}))

// @route   PUT /api/sessions/:id/join
// @desc    Join a session (generate meeting link)
// @access  Private
router.put('/:id/join', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const session = await Session.findById(req.params.id)
    .populate('candidate', 'name email')
    .populate('mentor', 'name email')

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found'
    })
  }

  // Check if user has access to this session
  const userId = req.user!.userId
  if (session.candidate.toString() !== userId && (session.mentor && session.mentor.toString() !== userId)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    })
  }

  // Check if session is scheduled and it's time to join
  const now = new Date()
  const sessionTime = session.scheduledDate || (session.date && session.time ? new Date(`${session.date}T${session.time}`) : new Date())
  const timeDiff = sessionTime.getTime() - now.getTime()
  const minutesUntilSession = Math.floor(timeDiff / (1000 * 60))

  if (session.status !== 'scheduled') {
    return res.status(400).json({
      success: false,
      message: 'Session is not in scheduled status'
    })
  }

  if (minutesUntilSession > 30) {
    return res.status(400).json({
      success: false,
      message: 'Session starts in more than 30 minutes. Please wait until closer to the start time.'
    })
  }

  // Ensure meeting link exists; try Google Meet service first, then Google Calendar, then fallback
  if (!session.meetingLink) {
    let meetingLink: string | null = null
    let googleEventId: string | null = null

    try {
      // Attempt Google Meet direct creation (service account or OAuth configured)
      const meetRoom = await googleMeetService.createGoogleMeetRoom({
        id: session._id?.toString() || '',
        date: session.date || sessionTime.toISOString().slice(0,10),
        time: session.time || sessionTime.toTimeString().slice(0,5),
        duration: session.duration,
        mentorName: (session.mentor as any)?.name || 'Mentor',
        candidateName: (session.candidate as any)?.name || 'Candidate',
        mentorEmail: (session.mentor as any)?.email || '',
        candidateEmail: (session.candidate as any)?.email || '',
        type: session.type,
        mentorId: (session.mentor as any)?._id?.toString?.() || session.mentor?.toString() || undefined
      })
      if (meetRoom) {
        meetingLink = meetRoom.meetingLink
        googleEventId = meetRoom.eventId
      }
    } catch (err) {
      console.error('Google Meet direct creation failed, using generated link:', err)
    }

    // Fallback to generated link if Meet service unavailable
    if (!meetingLink) {
      const meetingId = `meet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      meetingLink = `https://meet.google.com/${meetingId}`
      session.meetingId = meetingId
    }

    // Persist
    session.meetingLink = meetingLink
    if (googleEventId) session.googleEventId = googleEventId
    session.status = 'in-progress'
    await session.save()

    // Notify both parties
    await sendNotification(session.candidate.toString(), 'session_started', {
      sessionId: session._id as string,
      meetingLink: session.meetingLink,
      type: session.type
    })

    if (session.mentor) {
      await sendNotification(session.mentor.toString(), 'session_started', {
        sessionId: session._id as string,
        meetingLink: session.meetingLink,
        type: session.type
      })
    }
  }

  return res.json({
    success: true,
    message: 'Session joined successfully',
    session: session.toJSON()
  })
}))

// @route   PUT /api/sessions/:id/reschedule
// @desc    Reschedule a session
// @access  Private
router.put('/:id/reschedule', [
  auth,
  body('scheduledDate').isISO8601().withMessage('Valid date is required')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }

  const { scheduledDate } = req.body
  const session = await Session.findById(req.params.id)

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found'
    })
  }

  // Check if user has access to this session
  const userId = req.user!.userId
  if (session.candidate.toString() !== userId && (session.mentor && session.mentor.toString() !== userId)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    })
  }

  if (session.status !== 'scheduled') {
    return res.status(400).json({
      success: false,
      message: 'Only scheduled sessions can be rescheduled'
    })
  }

  // Check if new time is available (only if mentor is assigned)
  if (session.mentor) {
    const conflictingSession = await Session.findOne({
      mentor: session.mentor,
      scheduledDate: {
        $gte: new Date(scheduledDate),
        $lt: new Date(new Date(scheduledDate).getTime() + session.duration * 60000)
      },
      status: { $in: ['scheduled', 'in-progress'] },
      _id: { $ne: session._id }
    })

    if (conflictingSession) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is not available. Please choose another time.'
      })
    }
  }

  const oldDate = session.scheduledDate
  session.scheduledDate = new Date(scheduledDate)
  session.status = 'rescheduled'
  await session.save()

  // Send notifications
  await sendNotification(session.candidate.toString(), 'session_rescheduled', {
    sessionId: session._id as string,
    oldDate,
    newDate: session.scheduledDate
  })

  if (session.mentor) {
    await sendNotification(session.mentor.toString(), 'session_rescheduled', {
      sessionId: session._id as string,
      oldDate,
      newDate: session.scheduledDate
    })
  }

  return res.json({
    success: true,
    message: 'Session rescheduled successfully',
    session: session.toJSON()
  })
}))

// @route   PUT /api/sessions/:id/complete
// @desc    Mark session as completed
// @access  Private (Mentors only)
router.put('/:id/complete', [
  auth,
  requireRole(['mentor']),
  body('feedback.communication').isInt({ min: 1, max: 10 }).withMessage('Communication rating must be between 1-10'),
  body('feedback.problemSolving').isInt({ min: 1, max: 10 }).withMessage('Problem solving rating must be between 1-10'),
  body('feedback.codeQuality').isInt({ min: 1, max: 10 }).withMessage('Code quality rating must be between 1-10'),
  body('feedback.domain').notEmpty().withMessage('Domain is required'),
  body('feedback.comments').optional().isString().withMessage('Comments must be a string'),
  body('feedback.codeSnippet').optional().isString().isLength({ max: 20000 }).withMessage('Code snippet must be a string up to 20000 characters'),
  body('feedback.codeLanguage').optional().isString().isLength({ max: 50 }).withMessage('Code language must be a string up to 50 characters')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }

  const { feedback } = req.body
  const session = await Session.findById(req.params.id)

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found'
    })
  }

  // Check if user is the mentor for this session
  const mentorId = session.mentor?.toString() || session.assignedMentor?.toString()
  if (!mentorId || mentorId !== req.user!.userId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only the assigned mentor can complete this session.'
    })
  }

  if (!['in-progress', 'scheduled', 'completed'].includes(session.status)) {
    return res.status(400).json({
      success: false,
      message: 'Only scheduled, in-progress, or completed sessions can accept feedback'
    })
  }

  // Calculate total score for this feedback
  const sessionScore = feedback.communication + feedback.problemSolving + feedback.codeQuality

  // Add feedback
  const feedbackData: any = {
    communication: feedback.communication,
    problemSolving: feedback.problemSolving,
    codeQuality: feedback.codeQuality,
    domain: feedback.domain,
    comments: feedback.comments || '',
    mentor: new mongoose.Types.ObjectId(req.user!.userId),
    createdAt: new Date()
  }
  if (feedback.codeSnippet) {
    feedbackData.codeSnippet = feedback.codeSnippet
  }
  if (feedback.codeLanguage) {
    feedbackData.codeLanguage = feedback.codeLanguage
  }

  session.feedback = feedbackData
  session.status = 'completed'
  await session.save()

  // Update candidate statistics and totalScore
  await User.findByIdAndUpdate(session.candidate, {
    $inc: { 
      completedSessions: 1,
      totalSessions: 1,
      totalScore: sessionScore
    }
  })

  if (session.mentor || session.assignedMentor) {
    await User.findByIdAndUpdate(session.mentor || session.assignedMentor, {
      $inc: { totalSessions: 1 }
    })
  }

  // Send notification to candidate
  await sendNotification(session.candidate.toString(), 'session_completed', {
    sessionId: session._id as string,
    type: session.type,
    feedback: session.feedback
  })

  return res.json({
    success: true,
    message: 'Session completed successfully',
    session: session.toJSON()
  })
}))

// @route   POST /api/sessions/test-create
// @desc    Create a test session for development (remove in production)
// @access  Private (Mentor only)
router.post('/test-create', [
  auth,
  requireRole(['mentor'])
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const mentorId = req.user!.userId
  const { type = 'DSA', candidateId } = req.body

  try {
    let candidate
    if (candidateId) {
      // Use provided candidate ID
      candidate = await User.findById(candidateId)
      if (!candidate) {
        return ResponseHandler.error(res, 'Candidate not found', 404)
      }
    } else {
      // Create a test candidate if no ID provided
      const candidateEmail = 'test@example.com'
      candidate = await User.findOne({ email: candidateEmail })
      if (!candidate) {
        candidate = new User({
          name: 'Test Candidate',
          email: candidateEmail,
          password: 'test123', // This is just for testing
          role: 'candidate',
          credits: 5
        })
        await candidate.save()
      }
    }

    // Create a test session
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(14, 0, 0, 0) // 2 PM tomorrow
    
    const session = new Session({
      candidate: candidate._id,
      mentor: mentorId,
      type: type,
      status: 'scheduled',
      scheduledDate: tomorrow, // Tomorrow at 2 PM
      date: tomorrow.toISOString().split('T')[0], // Date string
      time: '14:00', // Time string
      duration: 60,
      meetingPlatform: 'google-meet',
      price: 999,
      isPaid: true,
      paymentStatus: 'completed'
    })

    await session.save()
    await session.populate([
      { path: 'candidate', select: 'name email avatar' },
      { path: 'mentor', select: 'name email avatar company position' }
    ])

    return ResponseHandler.created(res, { session: session.toJSON() }, 'Test session created successfully!')
  } catch (error) {
    console.error('Error creating test session:', error)
    return ResponseHandler.error(res, 'Failed to create test session', 500)
  }
}))

// @route   POST /api/sessions/test-create-candidate
// @desc    Create a test session for current candidate (development only)
// @access  Private (Candidate only)
router.post('/test-create-candidate', [
  auth,
  requireRole(['candidate'])
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const candidateId = req.user!.userId
  const { type = 'DSA' } = req.body

  try {
    // Find any active mentor
    const mentor = await User.findOne({ 
      role: 'mentor', 
      isActive: true 
    }).select('_id name email')

    if (!mentor) {
      return ResponseHandler.error(res, 'No active mentors found', 404)
    }

    // Create a test session for the current candidate
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(14, 0, 0, 0) // 2 PM tomorrow
    
    const session = new Session({
      candidate: candidateId,
      mentor: mentor._id,
      type: type,
      status: 'scheduled',
      scheduledDate: tomorrow, // Tomorrow at 2 PM
      date: tomorrow.toISOString().split('T')[0], // Date string
      time: '14:00', // Time string
      duration: 60,
      meetingPlatform: 'google-meet',
      price: 999,
      isPaid: true,
      paymentStatus: 'completed'
    })

    await session.save()
    await session.populate([
      { path: 'candidate', select: 'name email avatar' },
      { path: 'mentor', select: 'name email avatar company position' }
    ])

    return ResponseHandler.created(res, { session: session.toJSON() }, 'Test session created successfully!')
  } catch (error) {
    console.error('Error creating test session:', error)
    return ResponseHandler.error(res, 'Failed to create test session', 500)
  }
}))

// @route   PUT /api/sessions/:id/approve
// @desc    Approve a pending session
// @access  Private (Mentor only)
router.put('/:id/approve', [
  auth,
  requireRole(['mentor']),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format (HH:MM) is required')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return ResponseHandler.validationError(res, errors.array())
  }

  const { id } = req.params
  const { date, time } = req.body
  const mentorId = req.user!.userId

  try {
    const session = await Session.findById(id)
    
    if (!session) {
      return ResponseHandler.notFound(res, 'Session not found')
    }

    // Check both mentor and assignedMentor fields (smart booking uses assignedMentor)
    const sessionMentorId = session.mentor?.toString() || session.assignedMentor?.toString()
    
    if (!sessionMentorId || sessionMentorId !== mentorId) {
      console.log('❌ Mentor mismatch:', {
        sessionMentor: session.mentor?.toString(),
        sessionAssignedMentor: session.assignedMentor?.toString(),
        loggedInMentorId: mentorId,
        sessionId: session._id
      })
      return ResponseHandler.error(res, 'You can only approve your own sessions', 403)
    }

    if (session.status !== 'pending') {
      return ResponseHandler.error(res, 'Only pending sessions can be approved', 400)
    }

    // Create scheduled date
    const scheduledDate = new Date(`${date}T${time}`)
    
    // Update session
    session.status = 'scheduled'
    session.scheduledDate = scheduledDate
    session.date = date
    session.time = time
    
    // Ensure mentor field is set (in case session only had assignedMentor from smart booking)
    if (!session.mentor && session.assignedMentor) {
      session.mentor = session.assignedMentor
    }

    await session.save()
    await session.populate([
      { path: 'candidate', select: 'name email avatar' },
      { path: 'mentor', select: 'name email avatar company position' }
    ])

    // Create Google Calendar event with Google Meet using mentor's OAuth
    let meetingLink = null
    try {
      console.log('📅 Creating Google Calendar event (mentor OAuth) for approved session...')
      const event = await MentorCalendarService.createSessionEvent(mentorId, (session._id as any).toString())

      if (!event) {
        throw new Error('Mentor calendar event creation failed')
      }

      meetingLink = (event as any)?.conferenceData?.entryPoints?.[0]?.uri || (event as any)?.hangoutLink || null
      
      // Update session with meeting details
      session.meetingLink = meetingLink || session.meetingLink
      session.googleEventId = (event as any)?.id || session.googleEventId
      await session.save()

      console.log('✅ Google Meet invite sent from mentor calendar:', meetingLink)
    } catch (error) {
      console.error('❌ Failed to create Google event from mentor calendar:', error)
      // Continue without Google Calendar integration
    }

    // Send notification to candidate
    await sendNotification(session.candidate.toString(), 'session_approved', {
      sessionId: session._id as string,
      mentorName: (session.mentor as any)?.name || 'Your mentor',
      type: session.type,
      scheduledDate: session.scheduledDate,
      meetingLink: meetingLink
    })

    // Notify mentor with the final Meet link as well
    await sendNotification(session.mentor!.toString(), 'session_approved', {
      sessionId: session._id as string,
      mentorName: (session.mentor as any)?.name || 'You',
      type: session.type,
      scheduledDate: session.scheduledDate,
      meetingLink: meetingLink
    })

    return ResponseHandler.success(res, { session: session.toJSON() }, 'Session approved successfully')
  } catch (error) {
    console.error('Error approving session:', error)
    return ResponseHandler.error(res, 'Failed to approve session', 500)
  }
}))

// @route   PUT /api/sessions/:id/update-meeting-link
// @desc    Update meeting link for a session
// @access  Private (Mentor only)
router.put('/:id/update-meeting-link', [
  auth,
  requireRole(['mentor']),
  body('meetingLink').isURL().withMessage('Valid meeting link is required')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return ResponseHandler.validationError(res, errors.array())
  }

  const { id } = req.params
  const { meetingLink } = req.body
  const mentorId = req.user!.userId

  try {
    const session = await Session.findById(id)
    
    if (!session) {
      return ResponseHandler.notFound(res, 'Session not found')
    }

    // Check if mentor is assigned to this session
    const isMentor = session.mentor?.toString() === mentorId || 
                     session.assignedMentor?.toString() === mentorId

    if (!isMentor) {
      return ResponseHandler.error(res, 'You can only update meeting links for your own sessions', 403)
    }

    // Update session with meeting link
    session.meetingLink = meetingLink
    await session.save()

    // Send notification to candidate about updated meeting link
    await sendNotification(session.candidate.toString(), 'meeting_link_updated', {
      sessionId: session._id as string,
      mentorName: (session.mentor || session.assignedMentor) as any,
      type: session.type,
      scheduledDate: session.scheduledDate,
      meetingLink: meetingLink
    })

    return ResponseHandler.success(res, { 
      session: session.toJSON() 
    }, 'Meeting link updated successfully')
  } catch (error) {
    console.error('Error updating meeting link:', error)
    return ResponseHandler.error(res, 'Failed to update meeting link', 500)
  }
}))

// @route   PUT /api/sessions/:id/cancel
// @desc    Cancel a session
// @access  Private (Mentor only)
router.put('/:id/cancel', [
  auth,
  requireRole(['mentor'])
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { id } = req.params
  const mentorId = req.user!.userId

  try {
    const session = await Session.findById(id)
    
    if (!session) {
      return ResponseHandler.notFound(res, 'Session not found')
    }

    // Check both mentor and assignedMentor fields (smart booking uses assignedMentor)
    const sessionMentorId = session.mentor?.toString() || session.assignedMentor?.toString()
    
    if (!sessionMentorId || sessionMentorId !== mentorId) {
      return ResponseHandler.error(res, 'You can only cancel your own sessions', 403)
    }

    if (session.status === 'completed') {
      return ResponseHandler.error(res, 'Completed sessions cannot be cancelled', 400)
    }

    // Update session status
    session.status = 'cancelled'
    await session.save()
    await session.populate([
      { path: 'candidate', select: 'name email avatar' },
      { path: 'mentor', select: 'name email avatar company position' }
    ])

    // Send notification to candidate
    await sendNotification(session.candidate.toString(), 'session_cancelled', {
      sessionId: session._id as string,
      mentorName: (session.mentor as any)?.name || 'Your mentor',
      type: session.type,
      scheduledDate: session.scheduledDate
    })

    return ResponseHandler.success(res, { session: session.toJSON() }, 'Session cancelled successfully')
  } catch (error) {
    console.error('Error cancelling session:', error)
    return ResponseHandler.error(res, 'Failed to cancel session', 500)
  }
}))

export default router 