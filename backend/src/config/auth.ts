import jwt, { Secret } from 'jsonwebtoken'

// Validate JWT_SECRET on startup
export const JWT_SECRET: Secret = (() => {
  const secret = process.env.JWT_SECRET
  
  if (!secret) {
    throw new Error('❌ JWT_SECRET environment variable must be set')
  }
  
  if (secret === 'your-secret-key' || secret.length < 32) {
    throw new Error('❌ JWT_SECRET must be at least 32 characters long and not use the default value')
  }
  
  return secret
})()

export const JWT_EXPIRATION = '7d'

// Generate token with consistent configuration
export const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Verify token
export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET)
}

