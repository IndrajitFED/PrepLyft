import express from 'express'
import { auth, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'

const router = express.Router()

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  // For MVP, we'll return mock notifications
  // In production, you'd have a Notification model and database
  
  const mockNotifications = [
    {
      id: '1',
      type: 'session_booked',
      title: 'Session Booked',
      message: 'Your DSA interview session has been booked for tomorrow at 3:00 PM',
      isRead: false,
      createdAt: new Date(),
      data: {
        sessionId: 'session123',
        type: 'DSA',
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    },
    {
      id: '2',
      type: 'session_reminder',
      title: 'Session Reminder',
      message: 'Your Data Science interview starts in 30 minutes',
      isRead: false,
      createdAt: new Date(),
      data: {
        sessionId: 'session456',
        type: 'Data Science',
        meetingLink: 'https://meet.google.com/abc-def-ghi'
      }
    }
  ]

  res.json({
    success: true,
    notifications: mockNotifications
  })
}))

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  // In production, you'd update the notification in the database
  
  res.json({
    success: true,
    message: 'Notification marked as read'
  })
}))

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  // In production, you'd delete the notification from the database
  
  res.json({
    success: true,
    message: 'Notification deleted'
  })
}))

export default router 