import express from 'express'
import { body, validationResult } from 'express-validator'
import { auth, requireRole, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { ResponseHandler } from '../utils/response'
import { MentorCalendarService } from '../services/mentorCalendar'

const router = express.Router()

// @route   GET /api/mentor-calendar/connect
// @desc    Get Google Calendar authorization URL for mentor
// @access  Private (Mentor only)
router.get('/connect', [
  auth,
  requireRole(['mentor'])
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const mentorId = req.user!.userId

  try {
    const authUrl = MentorCalendarService.getAuthorizationUrl(mentorId)
    
    return ResponseHandler.success(res, { 
      authUrl,
      mentorId
    }, 'Authorization URL generated successfully')
  } catch (error) {
    console.error('Error generating auth URL:', error)
    return ResponseHandler.error(res, 'Failed to generate authorization URL', 500)
  }
}))

// @route   GET /api/mentor-calendar/callback
// @desc    Handle Google Calendar OAuth callback (GET request from Google)
// @access  Public (OAuth callback)
router.get('/callback', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { code, state } = req.query

  if (!code) {
    return ResponseHandler.error(res, 'Authorization code is required', 400)
  }

  if (!state) {
    return ResponseHandler.error(res, 'State parameter is required', 400)
  }

  try {
    // The state parameter contains the mentorId
    const mentorId = state as string
    const success = await MentorCalendarService.handleCallback(code as string, mentorId)
    
    if (!success) {
      return ResponseHandler.error(res, 'Failed to connect Google Calendar', 500)
    }

    // Redirect to frontend with success message
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    return res.redirect(`${frontendUrl}/mentor?calendar=connected`)
  } catch (error) {
    console.error('Error handling callback:', error)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    return res.redirect(`${frontendUrl}/mentor?calendar=error`)
  }
}))

// @route   POST /api/mentor-calendar/callback
// @desc    Handle Google Calendar OAuth callback (POST request for manual testing)
// @access  Private (Mentor only)
router.post('/callback', [
  auth,
  requireRole(['mentor']),
  body('code').notEmpty().withMessage('Authorization code is required')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return ResponseHandler.validationError(res, errors.array())
  }

  const { code } = req.body
  const mentorId = req.user!.userId

  try {
    const success = await MentorCalendarService.handleCallback(code, mentorId)
    
    if (!success) {
      return ResponseHandler.error(res, 'Failed to connect Google Calendar', 500)
    }

    return ResponseHandler.success(res, { 
      connected: true,
      mentorId
    }, 'Google Calendar connected successfully')
  } catch (error) {
    console.error('Error handling callback:', error)
    return ResponseHandler.error(res, 'Failed to connect Google Calendar', 500)
  }
}))

// @route   DELETE /api/mentor-calendar/disconnect
// @desc    Disconnect mentor's Google Calendar
// @access  Private (Mentor only)
router.delete('/disconnect', [
  auth,
  requireRole(['mentor'])
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const mentorId = req.user!.userId

  try {
    const success = await MentorCalendarService.disconnectCalendar(mentorId)
    
    if (!success) {
      return ResponseHandler.error(res, 'Failed to disconnect Google Calendar', 500)
    }

    return ResponseHandler.success(res, { 
      connected: false,
      mentorId
    }, 'Google Calendar disconnected successfully')
  } catch (error) {
    console.error('Error disconnecting calendar:', error)
    return ResponseHandler.error(res, 'Failed to disconnect Google Calendar', 500)
  }
}))

// @route   GET /api/mentor-calendar/status
// @desc    Get mentor's calendar connection status
// @access  Private (Mentor only)
router.get('/status', [
  auth,
  requireRole(['mentor'])
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const mentorId = req.user!.userId

  try {
    const credentials = await MentorCalendarService.getMentorCredentials(mentorId)
    
    return ResponseHandler.success(res, { 
      isConnected: !!credentials?.isConnected,
      calendarId: credentials?.calendarId || 'primary'
    }, 'Calendar status retrieved successfully')
  } catch (error) {
    console.error('Error getting calendar status:', error)
    return ResponseHandler.error(res, 'Failed to get calendar status', 500)
  }
}))

// @route   POST /api/mentor-calendar/session/:sessionId/create-event
// @desc    Create calendar event for a session
// @access  Private (Mentor only)
router.post('/session/:sessionId/create-event', [
  auth,
  requireRole(['mentor'])
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { sessionId } = req.params
  const mentorId = req.user!.userId

  try {
    const event = await MentorCalendarService.createSessionEvent(mentorId, sessionId)
    
    if (!event) {
      return ResponseHandler.error(res, 'Failed to create calendar event', 500)
    }

    return ResponseHandler.success(res, { 
      event,
      sessionId
    }, 'Calendar event created successfully')
  } catch (error) {
    console.error('Error creating calendar event:', error)
    return ResponseHandler.error(res, 'Failed to create calendar event', 500)
  }
}))

// @route   PUT /api/mentor-calendar/session/:sessionId/update-event
// @desc    Update calendar event for a session
// @access  Private (Mentor only)
router.put('/session/:sessionId/update-event', [
  auth,
  requireRole(['mentor'])
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { sessionId } = req.params
  const mentorId = req.user!.userId

  try {
    const event = await MentorCalendarService.updateSessionEvent(mentorId, sessionId)
    
    if (!event) {
      return ResponseHandler.error(res, 'Failed to update calendar event', 500)
    }

    return ResponseHandler.success(res, { 
      event,
      sessionId
    }, 'Calendar event updated successfully')
  } catch (error) {
    console.error('Error updating calendar event:', error)
    return ResponseHandler.error(res, 'Failed to update calendar event', 500)
  }
}))

// @route   DELETE /api/mentor-calendar/session/:sessionId/delete-event
// @desc    Delete calendar event for a session
// @access  Private (Mentor only)
router.delete('/session/:sessionId/delete-event', [
  auth,
  requireRole(['mentor'])
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { sessionId } = req.params
  const mentorId = req.user!.userId

  try {
    const success = await MentorCalendarService.deleteSessionEvent(mentorId, sessionId)
    
    if (!success) {
      return ResponseHandler.error(res, 'Failed to delete calendar event', 500)
    }

    return ResponseHandler.success(res, { 
      deleted: true,
      sessionId
    }, 'Calendar event deleted successfully')
  } catch (error) {
    console.error('Error deleting calendar event:', error)
    return ResponseHandler.error(res, 'Failed to delete calendar event', 500)
  }
}))

// @route   GET /api/mentor-calendar/availability
// @desc    Get mentor's calendar availability
// @access  Private (Mentor only)
router.get('/availability', [
  auth,
  requireRole(['mentor'])
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const mentorId = req.user!.userId
  const { startDate, endDate } = req.query

  if (!startDate || !endDate) {
    return ResponseHandler.error(res, 'Start date and end date are required', 400)
  }

  try {
    const start = new Date(startDate as string)
    const end = new Date(endDate as string)
    
    const availability = await MentorCalendarService.getMentorAvailability(mentorId, start, end)
    
    return ResponseHandler.success(res, { 
      availability,
      startDate: start,
      endDate: end
    }, 'Calendar availability retrieved successfully')
  } catch (error) {
    console.error('Error getting calendar availability:', error)
    return ResponseHandler.error(res, 'Failed to get calendar availability', 500)
  }
}))

export default router
