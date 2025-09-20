import express from 'express'
import { auth, requireRole, AuthRequest } from '../middleware/auth'
import { User } from '../models/User'
import { Session } from '../models/Session'
import { asyncHandler } from '../middleware/errorHandler'
import { GoogleCalendarService } from '../services/googleCalendar'
import { formatAvailability, generateAvailableTimeSlots } from '../utils/availability'
import { ResponseHandler } from '../utils/response'

const router = express.Router()
const googleCalendar = new GoogleCalendarService()

// @route   GET /api/mentors/dashboard
// @desc    Get mentor dashboard data
// @access  Private (Mentors only)
router.get('/dashboard', auth, requireRole(['mentor']), asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const mentorId = req.user!.userId
  
  // Get today's sessions
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const mentorQuery = {
    $or: [
      { mentor: mentorId },
      { assignedMentor: mentorId }
    ]
  }

  const todaySessions = await Session.find({
    ...mentorQuery,
    scheduledDate: { $gte: today, $lt: tomorrow },
    status: { $in: ['scheduled', 'in-progress'] }
  }).populate('candidate', 'name email avatar')

  // Get upcoming sessions
  const upcomingSessions = await Session.find({
    ...mentorQuery,
    scheduledDate: { $gt: tomorrow },
    status: 'scheduled'
  }).populate('candidate', 'name email avatar')
  .limit(5)

  // Get recent feedback
  const recentSessions = await Session.find({
    ...mentorQuery,
    status: 'completed',
    'feedback.createdAt': { $exists: true }
  })
  .populate('candidate', 'name email avatar')
  .sort({ 'feedback.createdAt': -1 })
  .limit(5)

  // Get statistics
  const totalSessions = await Session.countDocuments(mentorQuery)
  const completedSessions = await Session.countDocuments({ 
    ...mentorQuery,
    status: 'completed' 
  })
  const avgRating = await Session.aggregate([
    { $match: { 
      $or: [
        { mentor: mentorId },
        { assignedMentor: mentorId }
      ],
      'feedback.overall': { $exists: true } 
    }},
    { $group: { _id: null, avgRating: { $avg: '$feedback.overall' } } }
  ])

  res.json({
    success: true,
    data: {
      todaySessions,
      upcomingSessions,
      recentSessions,
      stats: {
        totalSessions,
        completedSessions,
        avgRating: avgRating[0]?.avgRating || 0
      }
    }
  })
}))

// @route   GET /api/mentors/:mentorId/availability
// @desc    Get mentor availability for a date range
// @access  Private
router.get('/:mentorId/availability', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  try {
    const { mentorId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return ResponseHandler.error(res, 'Start date and end date are required', 400);
    }

    // Get mentor details
    const mentor = await User.findById(mentorId);
    if (!mentor) {
      return ResponseHandler.notFound(res, 'Mentor not found');
    }

    // Get Google Calendar availability
    const calendarAvailability = await googleCalendar.getMentorAvailability(
      mentor.email,
      startDate as string,
      endDate as string
    );

    // Get existing bookings from your database
    const existingBookings = await Session.find({
      mentorId,
      date: { $gte: startDate, $lte: endDate },
      status: { $in: ['confirmed', 'pending'] }
    });

    // Combine and format availability
    const availability = formatAvailability(
      calendarAvailability,
      existingBookings,
      { start: 9, end: 17 } // Default working hours: 9 AM to 5 PM
    );

    return ResponseHandler.success(res, { availability });
  } catch (error) {
    console.error('Error fetching mentor availability:', error);
    return ResponseHandler.error(res, 'Failed to fetch availability');
  }
}));

// @route   GET /api/mentors/:mentorId/availability/:date
// @desc    Get available time slots for a specific date
// @access  Private
router.get('/:mentorId/availability/:date', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  try {
    const { mentorId, date } = req.params;

    const mentor = await User.findById(mentorId);
    if (!mentor) {
      return ResponseHandler.notFound(res, 'Mentor not found');
    }

    // Get Google Calendar events for the date
    const calendarEvents = await googleCalendar.getMentorSchedule(mentor.email, date);

    // Get existing bookings for the date
    const existingBookings = await Session.find({
      mentorId,
      date,
      status: { $in: ['confirmed', 'pending'] }
    });

    // Generate available time slots
    const availableSlots = generateAvailableTimeSlots(
      date,
      { start: 9, end: 17 }, // Default working hours: 9 AM to 5 PM
      calendarEvents,
      existingBookings
    );

    return ResponseHandler.success(res, { availableSlots });
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    return ResponseHandler.error(res, 'Failed to fetch available time slots');
  }
}));

export default router 