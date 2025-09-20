import express from 'express'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import { User } from '../models/User'
import { auth, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { registerValidation, loginValidation } from '../utils/validation'
import { ResponseHandler } from '../utils/response'

const router = express.Router()

// Types
interface RegisterData {
  name: string
  email: string
  password: string
  role: 'candidate' | 'mentor'
  specializations?: string[]
  averageRating?: number
  experience?: number
  company?: string
  isActive?: boolean
}

interface LoginData {
  email: string
  password: string
}

// Utility functions
const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  )
}

const handleValidationErrors = (req: express.Request, res: express.Response): boolean => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    ResponseHandler.validationError(res, errors.array())
    return false
  }
  return true
}

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerValidation, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  // Check for validation errors
  if (!handleValidationErrors(req, res)) return

  const { name, email, password, role, specializations, averageRating, experience, company, isActive }: RegisterData = req.body


  
  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return ResponseHandler.conflict(res, 'User with this email already exists')
  }

  // Create new user with role-specific defaults
  const userDefaults = {
    name,
    email,
    password,
    role,
    credits: role === 'candidate' ? 2 : 0, // Give candidates 2 free credits
    skills: [],
    isVerified: false,
    rating: 0,
    totalSessions: 0,
    completedSessions: 0,
    // Mentor-specific fields
    ...(role === 'mentor' && {
      specializations: specializations || [],
      averageRating: averageRating || 4.5,
      experience: experience || 2,
      company: company || '',
      isActive: isActive !== undefined ? isActive : true
    })
  }

  const user = new User(userDefaults)
  await user.save()

  // Generate token
  const token = generateToken(user._id as string)

  // Remove password from response
  const userResponse = user.toJSON()



  return ResponseHandler.created(res, { token, user: userResponse }, 'User registered successfully')
}))

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  // Check for validation errors
  if (!handleValidationErrors(req, res)) return

  const { email, password }: LoginData = req.body

  // Find user by email
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return ResponseHandler.error(res, 'Invalid credentials', 401)
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password)
  if (!isPasswordValid) {
    return ResponseHandler.error(res, 'Invalid credentials', 401)
  }

  // Generate token
  const token = generateToken(user._id as string)

  // Remove password from response
  const userResponse = user.toJSON()

  return ResponseHandler.success(res, { token, user: userResponse }, 'Login successful')
}))

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  if (!req.user) {
    return ResponseHandler.error(res, 'Authentication required', 401)
  }

  const user = await User.findById(req.user.userId)
  if (!user) {
    return ResponseHandler.error(res, 'User not found', 404)
  }

  return ResponseHandler.success(res, { user: user.toJSON() }, 'User retrieved successfully')
}))

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  if (!req.user) {
    return ResponseHandler.error(res, 'Authentication required', 401)
  }

  const user = await User.findById(req.user.userId)
  if (!user) {
    return ResponseHandler.error(res, 'User not found', 404)
  }

  // Generate new token
  const token = generateToken(user._id as string)

  return ResponseHandler.success(res, { token }, 'Token refreshed successfully')
}))

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, (req: AuthRequest, res: express.Response) => {
  return ResponseHandler.success(res, {}, 'Logout successful')
})

export default router 