import express from 'express'
import { auth, requireRole, AuthRequest } from '../middleware/auth'
import { User } from '../models/User'
import { Session } from '../models/Session'
import { asyncHandler } from '../middleware/errorHandler'

const router = express.Router()

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin only)
router.get('/dashboard', auth, requireRole(['admin']), asyncHandler(async (req: AuthRequest, res: express.Response) => {
  // Get user statistics
  const totalUsers = await User.countDocuments()
  const totalCandidates = await User.countDocuments({ role: 'candidate' })
  const totalMentors = await User.countDocuments({ role: 'mentor' })
  
  // Get session statistics
  const totalSessions = await Session.countDocuments()
  const activeSessions = await Session.countDocuments({ 
    status: { $in: ['scheduled', 'in-progress'] } 
  })
  const completedSessions = await Session.countDocuments({ status: 'completed' })
  
  // Get recent sessions
  const recentSessions = await Session.find()
    .populate('candidate', 'name email')
    .populate('mentor', 'name email')
    .sort({ createdAt: -1 })
    .limit(10)

  // Get recent users
  const recentUsers = await User.find()
    .select('name email role createdAt')
    .sort({ createdAt: -1 })
    .limit(10)

  res.json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalCandidates,
        totalMentors,
        totalSessions,
        activeSessions,
        completedSessions
      },
      recentSessions,
      recentUsers
    }
  })
}))

export default router 