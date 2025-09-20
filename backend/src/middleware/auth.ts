import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'

interface JwtPayload {
  userId: string
}

export interface AuthRequest extends Request {
  user?: JwtPayload
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {

    
    const token = req.header('Authorization')?.replace('Bearer ', '')


    if (!token) {

      res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      })
      return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload
    
    const user = await User.findById(decoded.userId)


    if (!user) {

      res.status(401).json({ 
        success: false, 
        message: 'Token is invalid.' 
      })
      return
    }

    req.user = decoded

    next()
  } catch (error: any) {

    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      })
    } else if (error.name === 'TokenExpiredError') {
      res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      })
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Server error during authentication.' 
      })
    }
  }
}

// Optional auth middleware for routes that can work with or without authentication
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload
      const user = await User.findById(decoded.userId)
      
      if (user) {
        req.user = decoded
      }
    }
    
    next()
  } catch (error) {
    // Continue without authentication if token is invalid
    next()
  }
}

// Role-based access control middleware
export const requireRole = (roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ 
          success: false, 
          message: 'Access denied. Authentication required.' 
        })
        return
      }

      const user = await User.findById(req.user.userId)
      if (!user) {
        res.status(401).json({ 
          success: false, 
          message: 'User not found.' 
        })
        return
      }

      if (!roles.includes(user.role)) {
        res.status(403).json({ 
          success: false, 
          message: 'Access denied. Insufficient permissions.' 
        })
        return
      }

      next()
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error during authorization.' 
      })
    }
  }
} 