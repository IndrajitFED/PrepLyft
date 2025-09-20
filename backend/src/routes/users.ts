import express from 'express'
import { auth, requireRole, AuthRequest } from '../middleware/auth'
import { User } from '../models/User'
import { asyncHandler } from '../middleware/errorHandler'

const router = express.Router()

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const user = await User.findById(req.user!.userId)
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }

  return res.json({
    success: true,
    user: user.toJSON()
  })
}))

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { name, bio, phone, skills, company, position } = req.body
  
  const user = await User.findByIdAndUpdate(
    req.user!.userId,
    { name, bio, phone, skills, company, position },
    { new: true, runValidators: true }
  )

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }

  return res.json({
    success: true,
    message: 'Profile updated successfully',
    user: user.toJSON()
  })
}))

// @route   GET /api/users/mentors
// @desc    Get available mentors
// @access  Public
router.get('/mentors', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { skills, type } = req.query
  
  let query: any = { role: 'mentor', isVerified: true }
  
  if (skills) {
    query.skills = { $in: (skills as string).split(',') }
  }

  const mentors = await User.find(query)
    .select('name avatar bio skills experience company position rating totalSessions')
    .sort({ rating: -1, totalSessions: -1 })

  res.json({
    success: true,
    mentors: mentors.map(mentor => mentor.toJSON())
  })
}))

export default router 