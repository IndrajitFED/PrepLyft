import { Request, Response, NextFunction } from 'express'

// Custom error class for application errors
export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

// Error response interface
interface ErrorResponse {
  success: false
  message: string
  errors?: any[]
  stack?: string
}

// Centralized error response function
const sendErrorResponse = (res: Response, error: any, includeStack: boolean = false) => {
  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal Server Error'
  
  const errorResponse: ErrorResponse = {
    success: false,
    message
  }

  // Add validation errors if they exist
  if (error.errors && Array.isArray(error.errors)) {
    errorResponse.errors = error.errors
  }

  // Add stack trace in development
  if (includeStack && process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack
  }

  res.status(statusCode).json(errorResponse)
}

// Main error handling middleware
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let err = { ...error }
  err.message = error.message

  // Log error for debugging
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString()
  })

  // Handle specific error types
  if (error.name === 'CastError') {
    const message = 'Resource not found'
    err = new AppError(message, 404)
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]
    const message = `${field} already exists`
    err = new AppError(message, 409)
  }

  if (error.name === 'ValidationError') {
    const message = 'Validation failed'
    const errors = Object.values(error.errors).map((err: any) => ({
      param: err.path,
      msg: err.message
    }))
    err = new AppError(message, 400)
    err.errors = errors
  }

  if (error.name === 'JsonWebTokenError') {
    const message = 'Invalid token'
    err = new AppError(message, 401)
  }

  if (error.name === 'TokenExpiredError') {
    const message = 'Token expired'
    err = new AppError(message, 401)
  }

  // Handle mongoose errors
  if (error.name === 'MongoError') {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]
      const message = `${field} already exists`
      err = new AppError(message, 409)
    } else {
      const message = 'Database operation failed'
      err = new AppError(message, 500)
    }
  }

  // Handle rate limiting errors
  if (error.type === 'entity.too.large') {
    const message = 'Request entity too large'
    err = new AppError(message, 413)
  }

  // Handle file upload errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large'
    err = new AppError(message, 413)
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected file field'
    err = new AppError(message, 400)
  }

  // Send error response
  sendErrorResponse(res, err, process.env.NODE_ENV === 'development')
}

// Async error wrapper for route handlers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Not found middleware
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404)
  next(error)
}

// Validation error handler
export const handleValidationError = (error: any): AppError => {
  const errors = Object.values(error.errors).map((err: any) => ({
    param: err.path,
    msg: err.message
  }))
  
  return new AppError('Validation failed', 400)
}

// Database error handler
export const handleDatabaseError = (error: any): AppError => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]
    return new AppError(`${field} already exists`, 409)
  }
  
  return new AppError('Database operation failed', 500)
} 