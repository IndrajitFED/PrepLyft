import rateLimit from 'express-rate-limit'

// Stricter rate limiting for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 1000 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health'
  }
})

// Stricter rate limiting for registration
export const registerLimiter = rateLimit({
  windowMs: 1000 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 registrations per hour
  message: {
    success: false,
    message: 'Too many registration attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// General API rate limiting
export const apiLimiter = rateLimit({
  windowMs: 1000 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Rate limiting for password reset
export const passwordResetLimiter = rateLimit({
  windowMs: 1000 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

