// Input sanitization utility functions

/**
 * Remove potentially dangerous characters from input
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return input
  }
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

/**
 * Sanitize email input
 */
export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim()
}

/**
 * Sanitize an object recursively
 */
export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  const sanitized = { ...obj } as any
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key])
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      if (Array.isArray(sanitized[key])) {
        sanitized[key] = sanitized[key].map((item: any) => 
          typeof item === 'string' ? sanitizeInput(item) : item
        )
      } else {
        sanitized[key] = sanitizeObject(sanitized[key])
      }
    }
  }
  
  return sanitized as T
}

/**
 * Validate and sanitize user input
 */
export const validateAndSanitize = {
  name: (name: string): string => {
    return sanitizeInput(name).slice(0, 50)
  },
  
  bio: (bio: string): string => {
    return sanitizeInput(bio).slice(0, 500)
  },
  
  email: (email: string): string => {
    return sanitizeEmail(email)
  }
}

