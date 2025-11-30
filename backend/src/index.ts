import express, { type NextFunction, type RequestHandler } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'
import mongoose from 'mongoose'

// Load environment variables FIRST before any other imports
// Explicitly load from backend directory to ensure .env is found
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Import routes (after dotenv is loaded)
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import sessionRoutes from './routes/sessions'
import mentorRoutes from './routes/mentors'
import adminRoutes from './routes/admin'
import notificationRoutes from './routes/notifications'
import paymentRoutes from './routes/payments'
import pricingRoutes from './routes/pricing'
import mentorAssignmentRoutes from './routes/mentorAssignment'
import mentorCalendarRoutes from './routes/mentorCalendar'
import smartBookingRoutes from './routes/smartBooking'
import subscriptionRoutes from './routes/subscriptions'
import leaderboardRoutes from './routes/leaderboard'

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler'
import { connectDB } from './config/database'
import { initializePricing } from './config/pricing'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Connect to MongoDB
connectDB()

// Initialize pricing after MongoDB connection is established
mongoose.connection.once('connected', async () => {
  try {
    await initializePricing()
  } catch (error) {
    console.error('Failed to initialize pricing:', error)
  }
})

// Rate limiting (disabled placeholder)
const limiter: RequestHandler = (_req, _res, next) => next()

// Middleware
app.use(helmet())

// CORS configuration with dynamic origin checking
const allowedOrigins = [
  'http://mockinterview.shop',
  'https://mockinterview.shop',
  'http://www.mockinterview.shop',
  'https://www.mockinterview.shop',
  'http://165.22.218.43',
  'https://165.22.218.43',
  'http://165.22.218.43:4173',
  'https://165.22.218.43:4173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://localhost:4174'
]

// Add FRONTEND_URL from environment if provided
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL)
}

// CORS origin function to handle dynamic origins
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin requests)
    if (!origin) {
      return callback(null, true)
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    // In development, allow localhost with any port
    const isDevelopment = process.env.NODE_ENV !== 'production'
    if (isDevelopment) {
      const localhostRegex = /^https?:\/\/localhost(:\d+)?$/
      const localhostIPv4Regex = /^https?:\/\/127\.0\.0\.1(:\d+)?$/
      const localhostIPv6Regex = /^https?:\/\/\[::1\](:\d+)?$/
      
      if (localhostRegex.test(origin) || localhostIPv4Regex.test(origin) || localhostIPv6Regex.test(origin)) {
        console.log(`✅ Allowing localhost origin: ${origin}`)
        return callback(null, true)
      }

      // Allow any local IP in development (for testing on different devices)
      const localIPRegex = /^https?:\/\/(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)\d+\.\d+(:\d+)?$/
      if (localIPRegex.test(origin)) {
        console.log(`✅ Allowing local IP origin: ${origin}`)
        return callback(null, true)
      }
    }

    // Log blocked origin for debugging
    console.warn(`⚠️  CORS blocked origin: ${origin}`)
    console.log(`📋 Allowed origins: ${allowedOrigins.join(', ')}`)
    
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200,
  maxAge: 86400 // 24 hours
}

app.use(cors(corsOptions))
app.use(compression())
app.use(limiter)
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  
  socket.on('join-session', (sessionId) => {
    socket.join(`session-${sessionId}`)
    console.log(`User joined session: ${sessionId}`)
  })
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Make io available to routes
app.set('io', io)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/mentors', mentorRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/pricing', pricingRoutes)
app.use('/api/mentor-assignment', mentorAssignmentRoutes)
app.use('/api/mentor-calendar', mentorCalendarRoutes)
app.use('/api/smart-booking', smartBookingRoutes)
app.use('/api/subscriptions', subscriptionRoutes)
app.use('/api/leaderboard', leaderboardRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Interview Booking API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  })
})

// 404 handler - must be before error handler
app.use('*', notFound)

// Error handling middleware - must be last
app.use(errorHandler)

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
  console.log(`🔗 API URL: http://localhost:${PORT}/api`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})

export { io } 