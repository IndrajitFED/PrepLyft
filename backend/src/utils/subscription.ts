import { User } from '../models/User'

export interface SubscriptionPlan {
  name: 'basic' | 'standard' | 'premium'
  dsaInterviews: number
  randomInterviews: number
  price: number
  features: string[]
}

// Interview types that count as "random subjects" (not DSA)
export const RANDOM_SUBJECT_TYPES = ['Data Science', 'Analytics', 'System Design', 'Behavioral'] as const
export type RandomSubjectType = typeof RANDOM_SUBJECT_TYPES[number]

export const SUBSCRIPTION_PLANS: { [key: string]: SubscriptionPlan } = {
  basic: {
    name: 'basic',
    dsaInterviews: 1,
    randomInterviews: 0,
    price: 399,
    features: [
      '1 Free DSA Interview',
      'Basic Feedback',
      'Free Resources',
      'Community Access'
    ]
  },
  standard: {
    name: 'standard',
    dsaInterviews: 1,
    randomInterviews: 1,
    price: 999,
    features: [
      '1 Free DSA Interview',
      '1 Free Random Subject Interview',
      'Detailed Feedback',
      'Priority Booking',
      'Community Access'
    ]
  },
  premium: {
    name: 'premium',
    dsaInterviews: 1,
    randomInterviews: 2,
    price: 1999,
    features: [
      '1 Free DSA Interview',
      '2 Free Random Subject Interviews',
      'Detailed Feedback',
      'Priority Booking',
      'Video Recordings',
      'Progress Tracking',
      'Leaderboard Access'
    ]
  }
}

/**
 * Set user subscription plan (one-time payment, no expiration)
 */
export const setUserSubscription = async (
  userId: string,
  planName: 'basic' | 'standard' | 'premium'
): Promise<void> => {
  const plan = SUBSCRIPTION_PLANS[planName]
  
  await User.findByIdAndUpdate(userId, {
    subscriptionPlan: plan.name,
    dsaInterviewsLimit: plan.dsaInterviews,
    dsaInterviewsUsed: 0, // Reset on new subscription
    randomInterviewsLimit: plan.randomInterviews,
    randomInterviewsUsed: 0, // Reset on new subscription
    // Legacy fields (for backward compatibility)
    interviewsLimit: plan.dsaInterviews + plan.randomInterviews,
    interviewsUsed: 0
  })
}

/**
 * Check if user can book an interview
 * @param userId - User ID
 * @param interviewType - Type of interview ('DSA' or random subject)
 * @returns Object with allowed status, reason, and remaining count
 */
export const canBookInterview = async (
  userId: string, 
  interviewType: 'DSA' | 'Data Science' | 'Analytics' | 'System Design' | 'Behavioral'
): Promise<{ allowed: boolean; reason?: string; remainingDSA?: number; remainingRandom?: number }> => {
  const user = await User.findById(userId)
  
  if (!user) {
    return { allowed: false, reason: 'User not found' }
  }

  const isDSA = interviewType === 'DSA'
  const isRandomSubject = RANDOM_SUBJECT_TYPES.includes(interviewType as RandomSubjectType)

  // DSA interviews can be booked without subscription (one-time payment)
  if (isDSA && !user.subscriptionPlan) {
    // Allow DSA booking without subscription (will be paid directly)
    return { 
      allowed: true, 
      remainingDSA: 0,
      remainingRandom: 0
    }
  }

  // Random subject interviews require a subscription plan
  if (isRandomSubject && !user.subscriptionPlan) {
    return { 
      allowed: false, 
      reason: 'Random subject interviews require a subscription plan. Please purchase a plan.',
      remainingDSA: 0,
      remainingRandom: 0
    }
  }

  // Check DSA quota if booking DSA
  if (isDSA && user.subscriptionPlan) {
    const dsaLimit = user.dsaInterviewsLimit || 0
    const dsaUsed = user.dsaInterviewsUsed || 0
    const randomLimit = user.randomInterviewsLimit || 0
    const randomUsed = user.randomInterviewsUsed || 0
    const remainingDSA = dsaLimit - dsaUsed
    
    if (remainingDSA <= 0) {
      return { 
        allowed: false, 
        reason: 'You have used all DSA interviews from your plan. You can still book DSA interviews separately.',
        remainingDSA: 0,
        remainingRandom: randomLimit - randomUsed
      }
    }
    return { 
      allowed: true, 
      remainingDSA,
      remainingRandom: randomLimit - randomUsed
    }
  }

  // Check random subject quota if booking random subject
  if (isRandomSubject && user.subscriptionPlan) {
    const dsaLimit = user.dsaInterviewsLimit || 0
    const dsaUsed = user.dsaInterviewsUsed || 0
    const randomLimit = user.randomInterviewsLimit || 0
    const randomUsed = user.randomInterviewsUsed || 0
    const remainingRandom = randomLimit - randomUsed
    
    if (remainingRandom <= 0) {
      return { 
        allowed: false, 
        reason: 'You have used all random subject interviews from your plan. Please upgrade to premium for more.',
        remainingDSA: dsaLimit - dsaUsed,
        remainingRandom: 0
      }
    }
    return { 
      allowed: true, 
      remainingDSA: dsaLimit - dsaUsed,
      remainingRandom
    }
  }

  return { allowed: false, reason: 'Invalid interview type' }
}

/**
 * Increment interview count after booking
 * @param userId - User ID
 * @param interviewType - Type of interview booked
 * @param usedFromPlan - Whether this interview was used from the plan (true) or paid separately (false)
 */
export const incrementInterviewUsage = async (
  userId: string,
  interviewType: 'DSA' | 'Data Science' | 'Analytics' | 'System Design' | 'Behavioral',
  usedFromPlan: boolean = true
): Promise<void> => {
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('User not found')
  }

  const isDSA = interviewType === 'DSA'
  const isRandomSubject = RANDOM_SUBJECT_TYPES.includes(interviewType as RandomSubjectType)

  const updateData: any = {}

  // Only increment plan usage if usedFromPlan is true
  if (usedFromPlan && user.subscriptionPlan) {
    if (isDSA) {
      updateData.$inc = { dsaInterviewsUsed: 1 }
    } else if (isRandomSubject) {
      updateData.$inc = { randomInterviewsUsed: 1 }
    }
    
    // Also update legacy field for backward compatibility
    if (updateData.$inc) {
      updateData.$inc.interviewsUsed = 1
    }
  }

  // If not used from plan, we still track it but don't count against quota
  // This allows users to book additional interviews beyond their plan

  if (Object.keys(updateData).length > 0) {
    await User.findByIdAndUpdate(userId, updateData)
  }
}

/**
 * Get subscription details for a user
 */
export const getUserSubscription = async (userId: string) => {
  const user = await User.findById(userId)
  
  if (!user) {
    return null
  }

  // If no subscription, return basic info
  if (!user.subscriptionPlan) {
    return {
      plan: null,
      dsaLimit: 0,
      dsaUsed: 0,
      dsaRemaining: 0,
      randomLimit: 0,
      randomUsed: 0,
      randomRemaining: 0,
      planDetails: null
    }
  }

  const plan = SUBSCRIPTION_PLANS[user.subscriptionPlan]
  
  return {
    plan: user.subscriptionPlan,
    dsaLimit: user.dsaInterviewsLimit || 0,
    dsaUsed: user.dsaInterviewsUsed || 0,
    dsaRemaining: Math.max(0, (user.dsaInterviewsLimit || 0) - (user.dsaInterviewsUsed || 0)),
    randomLimit: user.randomInterviewsLimit || 0,
    randomUsed: user.randomInterviewsUsed || 0,
    randomRemaining: Math.max(0, (user.randomInterviewsLimit || 0) - (user.randomInterviewsUsed || 0)),
    // Legacy fields (for backward compatibility)
    limit: (user.dsaInterviewsLimit || 0) + (user.randomInterviewsLimit || 0),
    used: (user.dsaInterviewsUsed || 0) + (user.randomInterviewsUsed || 0),
    remaining: Math.max(0, ((user.dsaInterviewsLimit || 0) - (user.dsaInterviewsUsed || 0)) + ((user.randomInterviewsLimit || 0) - (user.randomInterviewsUsed || 0))),
    planDetails: plan
  }
}

