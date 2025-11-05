import express from 'express'
import { body, validationResult } from 'express-validator'
import { auth, requireRole, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { ResponseHandler } from '../utils/response'
import { User } from '../models/User'
import { getUserSubscription, setUserSubscription, canBookInterview, SUBSCRIPTION_PLANS } from '../utils/subscription'
import { Payment } from '../models/Payment'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const router = express.Router()

// Razorpay configuration from environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

let razorpay: Razorpay | null = null

if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  })
} else {
  console.warn('⚠️  Razorpay credentials not found in environment variables. Payment features will be disabled.')
}

// @route   GET /api/subscriptions/my
// @desc    Get user's subscription details
// @access  Private
router.get('/my', auth, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const userId = req.user!.userId
  
  const subscription = await getUserSubscription(userId)
  
  return ResponseHandler.success(res, { subscription }, 'Subscription details retrieved successfully')
}))

// @route   POST /api/subscriptions/create-order
// @desc    Create order for subscription payment
// @access  Private
router.post('/create-order', [
  auth,
  body('plan').isIn(['basic', 'standard', 'premium']).withMessage('Valid plan is required')
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return ResponseHandler.validationError(res, errors.array())
  }

  const { plan } = req.body
  const userId = req.user!.userId

  const planDetails = SUBSCRIPTION_PLANS[plan]
  if (!planDetails) {
    return ResponseHandler.error(res, 'Invalid subscription plan', 400)
  }

  if (!razorpay) {
    return ResponseHandler.error(res, 'Payment service not available', 503)
  }

  const amount = planDetails.price * 100 // Convert to paise

  try {
    const orderData = {
      amount: amount,
      currency: 'INR',
      receipt: `sub_${Date.now().toString().slice(-8)}`,
      notes: {
        userId,
        plan,
        type: 'subscription'
      }
    }

    const order = await razorpay.orders.create(orderData)

    await Payment.create({
      orderId: order.id,
      userId,
      amount,
      currency: 'INR',
      field: plan,
      status: 'created',
      receipt: order.receipt,
      notes: {
        userId,
        plan,
        type: 'subscription'
      }
    })

    return ResponseHandler.created(res, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key: RAZORPAY_KEY_ID,
      plan: planDetails
    }, 'Order created successfully')

  } catch (error) {
    console.error('Error creating subscription order:', error)
    return ResponseHandler.error(res, 'Failed to create subscription order', 500)
  }
}))

// @route   POST /api/subscriptions/verify
// @desc    Verify subscription payment and activate subscription
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

  if (!razorpay || !RAZORPAY_KEY_SECRET) {
    return ResponseHandler.error(res, 'Payment service not available', 503)
  }

  // Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex')

  const isAuthentic = expectedSignature === razorpay_signature

  if (!isAuthentic) {
    return ResponseHandler.error(res, 'Payment verification failed', 400)
  }

  // Fetch payment details
  const payment = await razorpay.payments.fetch(razorpay_payment_id)

  if (payment.status !== 'captured') {
    return ResponseHandler.error(res, 'Payment not captured', 400)
  }

  // Get payment record
  const paymentRecord = await Payment.findOne({ orderId: razorpay_order_id, userId })

  if (!paymentRecord) {
    return ResponseHandler.error(res, 'Payment record not found', 404)
  }

  // Extract plan from payment notes
  const plan = (paymentRecord.notes as any)?.plan || paymentRecord.field

  if (!plan || !SUBSCRIPTION_PLANS[plan]) {
    return ResponseHandler.error(res, 'Invalid plan in payment record', 400)
  }

  // Activate subscription
  await setUserSubscription(userId, plan as 'basic' | 'standard' | 'premium')

  // Update payment status
  await Payment.findOneAndUpdate(
    { orderId: razorpay_order_id, userId },
    {
      paymentId: razorpay_payment_id,
      status: 'captured',
      paidAt: new Date(),
      method: payment.method
    }
  )

  const subscription = await getUserSubscription(userId)

  return ResponseHandler.success(res, {
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    status: 'verified',
    amount: payment.amount,
    subscription
  }, 'Subscription activated successfully')

}))

export default router

