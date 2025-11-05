import express from 'express'
import { auth, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { ResponseHandler } from '../utils/response'
import { User } from '../models/User'

const router = express.Router()

// @route   GET /api/leaderboard
// @desc    Get leaderboard of candidates sorted by totalScore
// @access  Private
router.get('/', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const limit = parseInt(req.query.limit as string) || 100 // Default top 100

  // Get all candidates sorted by totalScore (descending)
  const candidates = await User.find({ role: 'candidate' })
    .select('name email avatar totalScore completedSessions totalSessions createdAt')
    .sort({ totalScore: -1 }) // Sort by totalScore descending
    .limit(limit)
    .lean()

  // Add rank to each candidate
  const leaderboard = candidates.map((candidate, index) => ({
    rank: index + 1,
    name: candidate.name,
    email: candidate.email,
    avatar: candidate.avatar,
    totalScore: candidate.totalScore || 0,
    completedSessions: candidate.completedSessions || 0,
    totalSessions: candidate.totalSessions || 0,
    createdAt: candidate.createdAt
  }))

  return ResponseHandler.success(res, { leaderboard }, 'Leaderboard retrieved successfully')
}))

// @route   GET /api/leaderboard/my-rank
// @desc    Get current user's rank in leaderboard
// @access  Private
router.get('/my-rank', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const userId = req.user!.userId

  // Get user's score
  const user = await User.findById(userId).select('totalScore')
  if (!user) {
    return ResponseHandler.error(res, 'User not found', 404)
  }

  const userScore = user.totalScore || 0

  // Count how many candidates have a higher score
  const rank = await User.countDocuments({
    role: 'candidate',
    totalScore: { $gt: userScore }
  }) + 1

  // Get total candidates
  const totalCandidates = await User.countDocuments({ role: 'candidate' })

  return ResponseHandler.success(res, {
    rank,
    totalScore: userScore,
    totalCandidates
  }, 'Rank retrieved successfully')
}))

export default router

