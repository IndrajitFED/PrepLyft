import express from 'express'
import { body, validationResult } from 'express-validator'
import { auth, requireRole, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { ResponseHandler } from '../utils/response'
import { Payment } from '../models/Payment'
import { Session } from '../models/Session'
import crypto from 'crypto'
import Razorpay from 'razorpay'
import { getSessionPrice, getSessionConfig } from '../config/pricing'
import { MentorAssignmentService } from '../services/mentorAssignment'

// Map field IDs to Session model enum values
const mapFieldToSessionType = (field: string): 'DSA' | 'Data Science' | 'Analytics' | 'System Design' | 'Behavioral' => {
  const fieldMap: { [key: string]: 'DSA' | 'Data Science' | 'Analytics' | 'System Design' | 'Behavioral' } = {
    'DSA': 'DSA',
    'Data Science': 'Data Science',
    'Analytics': 'Analytics',
    'System Design': 'System Design',
    'Behavioral': 'Behavioral'
  }
  return fieldMap[field] || 'DSA'
}

const router = express.Router()

// Razorpay configuration
const RAZORPAY_KEY_ID = "rzp_test_RCoLR9QellVUtF"
const RAZORPAY_KEY_SECRET = "IGTN9UfkeDMvx3TNKpDYhHuO"

// Validate environment variables
if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error('Razorpay credentials not found in environment variables')
  console.error('RAZORPAY_KEY_ID:', RAZORPAY_KEY_ID ? 'Set' : 'Missing')
  console.error('RAZORPAY_KEY_SECRET:', RAZORPAY_KEY_SECRET ? 'Set' : 'Missing')
}

// Initialize Razorpay instance only if credentials are available
let razorpay: Razorpay | null = null

if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  })
  console.log('Razorpay initialized successfully')
} else {
  console.warn('Razorpay not initialized - missing credentials')
}

// @route   POST /api/payments/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', [
  auth,
  body('currency').equals('INR').withMessage('Currency must be INR'),
  body('field').notEmpty().withMessage('Field is required')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return ResponseHandler.validationError(res, errors.array())
  }

  const { currency, field } = req.body
  const userId = req.user!.userId

  // Get price from backend based on field
  const amount = getSessionPrice(field) * 100 // Convert to paise
  const sessionConfig = getSessionConfig(field)

  console.log('Razorpay initialized:', razorpay);
  console.log("Amount", userId, amount, currency, field);

  try {
    // Check if Razorpay is initialized
    if (!razorpay) {
      return ResponseHandler.error(res, 'Payment service not available. Please contact support.', 503)
    }

    // Create order with Razorpay
    const orderData = {
      amount: amount, // Amount in paise
      currency: currency,
      receipt: `ord_${Date.now().toString().slice(-8)}`, // Short receipt (max 40 chars)
      notes: {
        userId: userId,
        field: field,
        sessionType: 'mentoring',
        sessionName: sessionConfig.name
      }
    }

    // Create actual order with Razorpay
    const order = await razorpay.orders.create(orderData)

    console.log('Razorpay order created:', order)

    // Store order details in database
    await Payment.create({
      orderId: order.id,
      userId,
      amount,
      currency,
      field,
      status: 'created',
      receipt: order.receipt,
      notes: {
        userId,
        field,
        sessionType: 'mentoring'
      }
    })

    return ResponseHandler.created(res, { 
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key: RAZORPAY_KEY_ID,
      sessionConfig: {
        field: field,
        name: sessionConfig.name,
        price: sessionConfig.price,
        description: sessionConfig.description
      }
    }, 'Order created successfully')

  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return ResponseHandler.error(res, 'Failed to create payment order', 500)
  }
}))

// @route   POST /api/payments/verify
// @desc    Verify Razorpay payment
// @access  Private
router.post('/verify', [
  auth,
  body('razorpay_order_id').notEmpty().withMessage('Order ID is required'),
  body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Signature is required')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return ResponseHandler.validationError(res, errors.array())
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
  const userId = req.user!.userId

  try {
    // Check if Razorpay is initialized
    if (!razorpay || !RAZORPAY_KEY_SECRET) {
      return ResponseHandler.error(res, 'Payment service not available. Please contact support.', 503)
    }

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature

    if (!isAuthentic) {
      console.error('Payment signature verification failed')
      return ResponseHandler.error(res, 'Payment verification failed', 400)
    }

    // Fetch payment details from Razorpay to confirm
    const payment = await razorpay.payments.fetch(razorpay_payment_id)
    
    console.log('Payment details from Razorpay:', payment)

    // Verify payment status
    if (payment.status !== 'captured') {
      return ResponseHandler.error(res, 'Payment not captured', 400)
    }

    // Get payment details to extract field information
    const paymentRecord = await Payment.findOne({ orderId: razorpay_order_id, userId })
    
    if (!paymentRecord) {
      return ResponseHandler.error(res, 'Payment record not found', 404)
    }

    // Update payment status in database
    await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id, userId },
      { 
        paymentId: razorpay_payment_id,
        status: 'captured',
        paidAt: new Date(),
        method: payment.method
      }
    )

    // Don't create session here - let smart booking handle it
    // Just mark payment as completed and ready for booking
    console.log('Payment verified, ready for smart booking')

    return ResponseHandler.success(res, {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: 'verified',
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method
    }, 'Payment verified successfully')

  } catch (error) {
    console.error('Error verifying payment:', error)
    return ResponseHandler.error(res, 'Payment verification failed', 500)
  }
}))

// @route   POST /api/payments/webhook
// @desc    Handle Razorpay webhooks
// @access  Public (but should verify webhook signature)
router.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(async (req: express.Request, res: express.Response) => {
  const signature = req.headers['x-razorpay-signature'] as string
  const body = req.body

  try {
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      console.error('Webhook signature verification failed')
      return res.status(400).json({ error: 'Invalid signature' })
    }

    const event = JSON.parse(body.toString())
    console.log('Razorpay webhook event:', event)

    // Handle different event types
    switch (event.event) {
      case 'payment.captured':
        console.log('Payment captured:', event.payload.payment.entity)
        // Update payment status in database
        await Payment.findOneAndUpdate(
          { paymentId: event.payload.payment.entity.id },
          { status: 'captured', paidAt: new Date() }
        )
        break

      case 'payment.failed':
        console.log('Payment failed:', event.payload.payment.entity)
        // Update payment status in database
        await Payment.findOneAndUpdate(
          { paymentId: event.payload.payment.entity.id },
          { status: 'failed' }
        )
        break

      default:
        console.log('Unhandled webhook event:', event.event)
    }

    return res.status(200).json({ status: 'success' })

  } catch (error) {
    console.error('Webhook error:', error)
    return res.status(500).json({ error: 'Webhook processing failed' })
  }
}))

// @route   GET /api/payments/history
// @desc    Get user's payment history
// @access  Private
router.get('/history', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const userId = req.user!.userId

  try {
    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)

    return ResponseHandler.success(res, { payments }, 'Payment history retrieved successfully')

  } catch (error) {
    console.error('Error fetching payment history:', error)
    return ResponseHandler.error(res, 'Failed to fetch payment history', 500)
  }
}))

// @route   GET /api/payments/:paymentId
// @desc    Get payment details
// @access  Private
router.get('/:paymentId', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { paymentId } = req.params
  const userId = req.user!.userId

  try {
    const payment = await Payment.findOne({ 
      $or: [
        { paymentId: paymentId },
        { orderId: paymentId }
      ],
      userId 
    })

    if (!payment) {
      return ResponseHandler.notFound(res, 'Payment not found')
    }

    // Get associated session if exists
    const session = await Session.findOne({ 
      $or: [
        { paymentId: paymentId },
        { orderId: paymentId }
      ]
    }).populate('candidate', 'name email').populate('mentor', 'name email')

    return ResponseHandler.success(res, { 
      payment,
      session: session || null
    }, 'Payment details retrieved successfully')

  } catch (error) {
    console.error('Error fetching payment details:', error)
    return ResponseHandler.error(res, 'Failed to fetch payment details', 500)
  }
}))

// @route   GET /api/payments/admin/all
// @desc    Get all payments (Admin only)
// @access  Private (Admin)
router.get('/admin/all', [
  auth,
  requireRole(['admin'])
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  try {
    const { page = 1, limit = 50, status, field } = req.query
    
    const filter: any = {}
    if (status) filter.status = status
    if (field) filter.field = field

    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .populate('userId', 'name email')

    const total = await Payment.countDocuments(filter)

    return ResponseHandler.success(res, {
      payments,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    }, 'All payments retrieved successfully')

  } catch (error) {
    console.error('Error fetching all payments:', error)
    return ResponseHandler.error(res, 'Failed to fetch payments', 500)
  }
}))

export default router
