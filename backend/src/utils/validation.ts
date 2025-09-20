import { body } from 'express-validator'

// Common validation patterns
export const VALIDATION_PATTERNS = {
  NAME: /^[a-zA-Z\s]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  URL: /^https?:\/\/.+/
}

// Common validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters`,
  MAX_LENGTH: (field: string, max: number) => `${field} cannot be more than ${max} characters`,
  INVALID_FORMAT: (field: string) => `Please provide a valid ${field}`,
  ALREADY_EXISTS: (field: string) => `${field} already exists`,
  INVALID_ROLE: 'Role must be either candidate or mentor',
  PASSWORD_REQUIREMENTS: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
}

// User validation schemas
export const userValidation = {
  name: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.REQUIRED('Name'))
      .isLength({ min: 2, max: 50 })
      .withMessage(VALIDATION_MESSAGES.MIN_LENGTH('Name', 2))
      .matches(VALIDATION_PATTERNS.NAME)
      .withMessage('Name can only contain letters and spaces')
  ],

  email: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.REQUIRED('Email'))
      .isEmail()
      .normalizeEmail()
      .withMessage(VALIDATION_MESSAGES.INVALID_FORMAT('email'))
  ],

  password: [
    body('password')
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.REQUIRED('Password'))
      .isLength({ min: 8 })
      .withMessage(VALIDATION_MESSAGES.MIN_LENGTH('Password', 8))
      .matches(VALIDATION_PATTERNS.PASSWORD)
      .withMessage(VALIDATION_MESSAGES.PASSWORD_REQUIREMENTS)
  ],

  role: [
    body('role')
      .isIn(['candidate', 'mentor'])
      .withMessage(VALIDATION_MESSAGES.INVALID_ROLE)
  ],

  phone: [
    body('phone')
      .optional()
      .trim()
      .matches(VALIDATION_PATTERNS.PHONE)
      .withMessage(VALIDATION_MESSAGES.INVALID_FORMAT('phone number'))
  ],

  bio: [
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage(VALIDATION_MESSAGES.MAX_LENGTH('Bio', 500))
  ],

  skills: [
    body('skills')
      .optional()
      .isArray()
      .withMessage('Skills must be an array')
  ],

  experience: [
    body('experience')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Experience must be a non-negative integer')
  ],

  company: [
    body('company')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage(VALIDATION_MESSAGES.MAX_LENGTH('Company', 100))
  ],

  position: [
    body('position')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage(VALIDATION_MESSAGES.MAX_LENGTH('Position', 100))
  ]
}

// Session validation schemas
export const sessionValidation = {
  mentorId: [
    body('mentorId')
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.REQUIRED('Mentor ID'))
      .isMongoId()
      .withMessage('Invalid mentor ID format')
  ],

  date: [
    body('date')
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.REQUIRED('Date'))
      .isISO8601()
      .withMessage('Invalid date format')
  ],

  time: [
    body('time')
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.REQUIRED('Time'))
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Invalid time format (HH:MM)')
  ],

  duration: [
    body('duration')
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.REQUIRED('Duration'))
      .isInt({ min: 30, max: 180 })
      .withMessage('Duration must be between 30 and 180 minutes')
  ],

  skills: [
    body('skills')
      .optional()
      .isArray()
      .withMessage('Skills must be an array')
  ],

  notes: [
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage(VALIDATION_MESSAGES.MAX_LENGTH('Notes', 1000))
  ]
}

// Combined validation schemas
export const registerValidation = [
  ...userValidation.name,
  ...userValidation.email,
  ...userValidation.password,
  ...userValidation.role
]

export const loginValidation = [
  ...userValidation.email,
  body('password')
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.REQUIRED('Password'))
]

export const updateProfileValidation = [
  ...userValidation.name,
  ...userValidation.phone,
  ...userValidation.bio,
  ...userValidation.skills,
  ...userValidation.experience,
  ...userValidation.company,
  ...userValidation.position
]

export const bookSessionValidation = [
  ...sessionValidation.mentorId,
  ...sessionValidation.date,
  ...sessionValidation.time,
  ...sessionValidation.duration,
  ...sessionValidation.skills,
  ...sessionValidation.notes
]

// Custom validation functions
export const validateObjectId = (id: string): boolean => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/
  return objectIdPattern.test(id)
}

export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 8 && VALIDATION_PATTERNS.PASSWORD.test(password)
}

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

export const validateDateRange = (startDate: Date, endDate: Date): boolean => {
  return startDate < endDate && startDate > new Date()
}
