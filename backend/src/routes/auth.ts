import express from 'express'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import { OAuth2Client } from 'google-auth-library'
import { User } from '../models/User'
import { auth, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { registerValidation, loginValidation } from '../utils/validation'
import { ResponseHandler } from '../utils/response'

const router = express.Router()

// Initialize Google OAuth2Client (lazy initialization)
let oauth2Client: OAuth2Client | null = null

const getOAuth2Client = (): OAuth2Client => {
  if (!oauth2Client) {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error('GOOGLE_CLIENT_ID must be set in environment variables')
    }
    oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  }
  return oauth2Client
}

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
    process.env.JWT_SECRET as string,
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

// @route   POST /api/auth/google
// @desc    Google OAuth authentication
// @access  Public
router.post('/google', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { credential} = req.body

  if (!credential) {
    return ResponseHandler.error(res, 'Google credential is required', 400)
  }

  // Need to Fix
  // if (!oauth2Client) {
  //   return ResponseHandler.error(res, 'Google OAuth is not configured', 500)
  // }

  try {
    // Verify the Google ID token
    const ticket = await getOAuth2Client().verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID!,
    })
    
    const payload = ticket.getPayload()
    
    if (!payload) {
      return ResponseHandler.error(res, 'Invalid Google token', 400)
    }

    const { sub: googleId, email, name, picture } = payload

    if (!email || !name) {
      return ResponseHandler.error(res, 'Email and name are required from Google', 400)
    }

    // Find or create user
    let user = await User.findOne({ email })

    if (!user) {
      // Create new user with Google info
      const [firstName, ...lastNameParts] = name.split(' ')
      
      user = new User({
        email,
        name,
        password: '', // No password for Google OAuth users
        role: 'candidate', // Default role
        googleId,
        avatar: picture,
        credits: 2, // Give 2 free credits
        skills: [],
        isVerified: true, // Google accounts are pre-verified
        rating: 0,
        totalSessions: 0,
        completedSessions: 0,
        firstName: firstName || name,
        lastName: lastNameParts.join(' ') || '',
      })

      await user.save()
    } else {
      // Update existing user with Google info if not already set
      if (!user.googleId) {
        user.googleId = googleId
      }
      if (!user.avatar && picture) {
        user.avatar = picture
      }
      await user.save()
    }

    // Generate JWT token
    const token = generateToken(user._id as string)

    // Remove password from response
    const userResponse = user.toJSON()

    return ResponseHandler.success(res, {
      token,
      user: userResponse
    }, 'Google authentication successful')

  } catch (error) {
    console.error('Google OAuth error:', error)
    return ResponseHandler.error(res, 'Google authentication failed', 500)
  }
}))

export default router 