import { Response } from 'express'

// Response status codes
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const

// Response messages
export const MESSAGES = {
  SUCCESS: {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    RETRIEVED: 'Resource retrieved successfully',
    OPERATION_COMPLETED: 'Operation completed successfully'
  },
  ERROR: {
    VALIDATION_FAILED: 'Validation failed',
    NOT_FOUND: 'Resource not found',
    ALREADY_EXISTS: 'Resource already exists',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    INTERNAL_ERROR: 'Internal server error',
    DATABASE_ERROR: 'Database operation failed',
    INVALID_CREDENTIALS: 'Invalid credentials',
    TOKEN_EXPIRED: 'Token expired',
    INVALID_TOKEN: 'Invalid token'
  }
} as const

// Base response interface
interface BaseResponse {
  success: boolean
  message: string
  timestamp: string
}

// Success response interface
interface SuccessResponse<T = any> extends BaseResponse {
  success: true
  data?: T
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Error response interface
interface ErrorResponse extends BaseResponse {
  success: false
  errors?: any[]
  stack?: string
}

// Response utility class
export class ResponseHandler {
  // Send success response
  static success<T>(
    res: Response,
    data?: T,
    message: string = MESSAGES.SUCCESS.OPERATION_COMPLETED,
    statusCode: number = STATUS_CODES.OK
  ): Response<SuccessResponse<T>> {
    const response: SuccessResponse<T> = {
      success: true,
      message,
      timestamp: new Date().toISOString(),
      ...(data && { data })
    }

    return res.status(statusCode).json(response)
  }

  // Send created response
  static created<T>(
    res: Response,
    data: T,
    message: string = MESSAGES.SUCCESS.CREATED
  ): Response<SuccessResponse<T>> {
    return ResponseHandler.success(res, data, message, STATUS_CODES.CREATED)
  }

  // Send updated response
  static updated<T>(
    res: Response,
    data: T,
    message: string = MESSAGES.SUCCESS.UPDATED
  ): Response<SuccessResponse<T>> {
    return ResponseHandler.success(res, data, message)
  }

  // Send deleted response
  static deleted(
    res: Response,
    message: string = MESSAGES.SUCCESS.DELETED
  ): Response<SuccessResponse<null>> {
    return ResponseHandler.success(res, null, message)
  }

  // Send retrieved response
  static retrieved<T>(
    res: Response,
    data: T,
    message: string = MESSAGES.SUCCESS.RETRIEVED
  ): Response<SuccessResponse<T>> {
    return ResponseHandler.success(res, data, message)
  }

  // Send paginated response
  static paginated<T>(
    res: Response,
    data: T[],
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    },
    message: string = MESSAGES.SUCCESS.RETRIEVED
  ): Response<SuccessResponse<T[]>> {
    const response: SuccessResponse<T[]> = {
      success: true,
      message,
      timestamp: new Date().toISOString(),
      data,
      pagination
    }

    return res.status(STATUS_CODES.OK).json(response)
  }

  // Send error response
  static error(
    res: Response,
    message: string = MESSAGES.ERROR.INTERNAL_ERROR,
    statusCode: number = STATUS_CODES.INTERNAL_SERVER_ERROR,
    errors?: any[],
    includeStack: boolean = false
  ): Response<ErrorResponse> {
    const response: ErrorResponse = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
      ...(errors && { errors })
    }

    // Add stack trace in development
    if (includeStack && process.env.NODE_ENV === 'development') {
      response.stack = new Error().stack
    }

    return res.status(statusCode).json(response)
  }

  // Send validation error response
  static validationError(
    res: Response,
    errors: any[],
    message: string = MESSAGES.ERROR.VALIDATION_FAILED
  ): Response<ErrorResponse> {
    return ResponseHandler.error(res, message, STATUS_CODES.BAD_REQUEST, errors)
  }

  // Send not found response
  static notFound(
    res: Response,
    message: string = MESSAGES.ERROR.NOT_FOUND
  ): Response<ErrorResponse> {
    return ResponseHandler.error(res, message, STATUS_CODES.NOT_FOUND)
  }

  // Send unauthorized response
  static unauthorized(
    res: Response,
    message: string = MESSAGES.ERROR.UNAUTHORIZED
  ): Response<ErrorResponse> {
    return ResponseHandler.error(res, message, STATUS_CODES.UNAUTHORIZED)
  }

  // Send forbidden response
  static forbidden(
    res: Response,
    message: string = MESSAGES.ERROR.FORBIDDEN
  ): Response<ErrorResponse> {
    return ResponseHandler.error(res, message, STATUS_CODES.FORBIDDEN)
  }

  // Send conflict response
  static conflict(
    res: Response,
    message: string = MESSAGES.ERROR.ALREADY_EXISTS
  ): Response<ErrorResponse> {
    return ResponseHandler.error(res, message, STATUS_CODES.CONFLICT)
  }

  // Send database error response
  static databaseError(
    res: Response,
    message: string = MESSAGES.ERROR.DATABASE_ERROR
  ): Response<ErrorResponse> {
    return ResponseHandler.error(res, message, STATUS_CODES.INTERNAL_SERVER_ERROR)
  }

  // Send no content response
  static noContent(res: Response): Response {
    return res.status(STATUS_CODES.NO_CONTENT).send()
  }
}

// Convenience functions for common responses
export const sendSuccess = ResponseHandler.success
export const sendCreated = ResponseHandler.created
export const sendUpdated = ResponseHandler.updated
export const sendDeleted = ResponseHandler.deleted
export const sendRetrieved = ResponseHandler.retrieved
export const sendPaginated = ResponseHandler.paginated
export const sendError = ResponseHandler.error
export const sendValidationError = ResponseHandler.validationError
export const sendNotFound = ResponseHandler.notFound
export const sendUnauthorized = ResponseHandler.unauthorized
export const sendForbidden = ResponseHandler.forbidden
export const sendConflict = ResponseHandler.conflict
export const sendDatabaseError = ResponseHandler.databaseError
export const sendNoContent = ResponseHandler.noContent
