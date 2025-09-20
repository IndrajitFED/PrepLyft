import express from 'express'
import { body, validationResult } from 'express-validator'
import { auth, requireRole, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { ResponseHandler } from '../utils/response'
import { MentorAssignmentService } from '../services/mentorAssignment'

const router = express.Router()

// @route   GET /api/mentor-assignment/available/:field
// @desc    Get available mentors for a specific field
// @access  Private
router.get('/available/:field', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { field } = req.params

  try {
    const mentors = await MentorAssignmentService.getAvailableMentors(field)
    
    return ResponseHandler.success(res, { 
      field,
      mentors,
      count: mentors.length
    }, 'Available mentors retrieved successfully')
  } catch (error) {
    console.error('Error getting available mentors:', error)
    return ResponseHandler.error(res, 'Failed to get available mentors', 500)
  }
}))

// @route   POST /api/mentor-assignment/assign
// @desc    Assign a mentor for a session
// @access  Private
router.post('/assign', [
  auth,
  body('field').notEmpty().withMessage('Field is required'),
  body('sessionId').optional().isMongoId().withMessage('Valid session ID is required'),
  body('preferredDate').optional().isISO8601().withMessage('Valid date format is required'),
  body('preferredTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format (HH:MM) is required')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return ResponseHandler.validationError(res, errors.array())
  }

  const { field, sessionId, preferredDate, preferredTime } = req.body

  try {
    const assignedMentor = await MentorAssignmentService.assignMentor(field, preferredDate, preferredTime)
    
    if (!assignedMentor) {
      return ResponseHandler.error(res, 'No mentors available for this field', 404)
    }

    // If sessionId is provided, update the session with the assigned mentor
    if (sessionId) {
      const updated = await MentorAssignmentService.updateSessionMentor(sessionId, assignedMentor.mentorId)
      if (!updated) {
        return ResponseHandler.error(res, 'Failed to update session with assigned mentor', 500)
      }
    }

    return ResponseHandler.success(res, { 
      assignedMentor,
      sessionId: sessionId || null
    }, 'Mentor assigned successfully')
  } catch (error) {
    console.error('Error assigning mentor:', error)
    return ResponseHandler.error(res, 'Failed to assign mentor', 500)
  }
}))

// @route   GET /api/mentor-assignment/mentor/:mentorId/availability
// @desc    Get mentor's availability
// @access  Private
router.get('/mentor/:mentorId/availability', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { mentorId } = req.params

  try {
    const availability = await MentorAssignmentService.getMentorAvailability(mentorId)
    
    return ResponseHandler.success(res, { 
      mentorId,
      availability
    }, 'Mentor availability retrieved successfully')
  } catch (error) {
    console.error('Error getting mentor availability:', error)
    return ResponseHandler.error(res, 'Failed to get mentor availability', 500)
  }
}))

// @route   GET /api/mentor-assignment/mentor/:mentorId/load
// @desc    Get mentor's current session load
// @access  Private
router.get('/mentor/:mentorId/load', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { mentorId } = req.params

  try {
    const load = await MentorAssignmentService.getMentorLoad(mentorId)
    
    return ResponseHandler.success(res, { 
      mentorId,
      currentLoad: load
    }, 'Mentor load retrieved successfully')
  } catch (error) {
    console.error('Error getting mentor load:', error)
    return ResponseHandler.error(res, 'Failed to get mentor load', 500)
  }
}))

// @route   POST /api/mentor-assignment/mentor/:mentorId/toggle-availability
// @desc    Toggle mentor's availability status
// @access  Private (Mentor only)
router.post('/mentor/:mentorId/toggle-availability', [
  auth,
  requireRole(['mentor'])
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { mentorId } = req.params
  const userId = req.user!.userId

  // Check if mentor is trying to update their own availability
  if (mentorId !== userId) {
    return ResponseHandler.error(res, 'You can only update your own availability', 403)
  }

  try {
    const { User } = await import('../models/User')
    const mentor = await User.findById(mentorId)
    
    if (!mentor) {
      return ResponseHandler.notFound(res, 'Mentor not found')
    }

    mentor.isActive = !mentor.isActive
    await mentor.save()

    return ResponseHandler.success(res, { 
      mentorId,
      isActive: mentor.isActive
    }, `Mentor availability ${mentor.isActive ? 'enabled' : 'disabled'} successfully`)
  } catch (error) {
    console.error('Error toggling mentor availability:', error)
    return ResponseHandler.error(res, 'Failed to toggle mentor availability', 500)
  }
}))

export default router
