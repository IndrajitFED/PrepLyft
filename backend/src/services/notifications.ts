import { User } from '../models/User'

export interface NotificationData {
  sessionId?: string
  candidateName?: string
  mentorName?: string
  type?: string
  scheduledDate?: Date
  meetingLink?: string
  oldDate?: Date
  newDate?: Date
  feedback?: any
}

export const sendNotification = async (
  userId: string, 
  type: string, 
  data: NotificationData
): Promise<void> => {
  try {
    // In a production environment, you would:
    // 1. Save notification to database
    // 2. Send email notification
    // 3. Send push notification
    // 4. Send SMS (if configured)
    
    console.log(`📧 Notification sent to user ${userId}:`, {
      type,
      data,
      timestamp: new Date().toISOString()
    })

    // For MVP, we'll just log the notification
    // Later you can integrate with:
    // - Email service (SendGrid, AWS SES)
    // - Push notifications (Firebase, OneSignal)
    // - SMS service (Twilio, AWS SNS)
    
    switch (type) {
      case 'session_booked':
        console.log(`🔔 Mentor ${data.mentorName} has a new session booked with ${data.candidateName}`)
        break
        
      case 'session_confirmed':
        console.log(`✅ Session confirmed for ${data.candidateName} with ${data.mentorName}`)
        if (data.meetingLink) {
          console.log(`🔗 Google Meet link: ${data.meetingLink}`)
        }
        break
        
      case 'session_approved':
        console.log(`✅ Session approved by ${data.mentorName} for ${data.candidateName}`)
        if (data.meetingLink) {
          console.log(`🔗 Google Meet link: ${data.meetingLink}`)
        }
        break
        
      case 'meeting_link_updated':
        console.log(`🔗 Meeting link updated by ${data.mentorName} for ${data.candidateName}`)
        console.log(`🔗 New Google Meet link: ${data.meetingLink}`)
        break
        
      case 'session_started':
        console.log(`🚀 Session started: ${data.type} interview`)
        console.log(`🔗 Meeting link: ${data.meetingLink}`)
        break
        
      case 'session_rescheduled':
        console.log(`📅 Session rescheduled from ${data.oldDate} to ${data.newDate}`)
        break
        
      case 'session_completed':
        console.log(`🏁 Session completed! Feedback submitted for ${data.type} interview`)
        break
        
      default:
        console.log(`📢 Unknown notification type: ${type}`)
    }

  } catch (error) {
    console.error('❌ Error sending notification:', error)
    // Don't throw error - notifications shouldn't break the main flow
  }
}

// Send bulk notifications to multiple users
export const sendBulkNotifications = async (
  userIds: string[],
  type: string,
  data: NotificationData
): Promise<void> => {
  try {
    const promises = userIds.map(userId => sendNotification(userId, type, data))
    await Promise.all(promises)
    
    console.log(`📧 Bulk notifications sent to ${userIds.length} users`)
  } catch (error) {
    console.error('❌ Error sending bulk notifications:', error)
  }
}

// Send reminder notifications for upcoming sessions
export const sendSessionReminders = async (): Promise<void> => {
  try {
    // This would typically be a cron job that runs every hour
    // For MVP, we'll just log the concept
    
    console.log('⏰ Session reminder system ready')
    console.log('📅 Would check for sessions starting in the next 24 hours')
    console.log('📧 Would send reminder emails to candidates and mentors')
    
    // In production, you would:
    // 1. Query database for sessions starting in next 24 hours
    // 2. Send personalized reminder emails
    // 3. Send push notifications
    // 4. Update notification preferences based on user settings
    
  } catch (error) {
    console.error('❌ Error sending session reminders:', error)
  }
}

// Send welcome notification to new users
export const sendWelcomeNotification = async (userId: string, userRole: string): Promise<void> => {
  try {
    const welcomeData: NotificationData = {
      type: 'welcome',
      candidateName: userRole === 'candidate' ? 'New Candidate' : 'New Mentor'
    }
    
    await sendNotification(userId, 'welcome', welcomeData)
    
    console.log(`🎉 Welcome notification sent to new ${userRole}`)
    
  } catch (error) {
    console.error('❌ Error sending welcome notification:', error)
  }
}

// Send credit purchase notification
export const sendCreditPurchaseNotification = async (
  userId: string, 
  credits: number, 
  amount: number
): Promise<void> => {
  try {
    const purchaseData: NotificationData = {
      type: 'credit_purchase',
      sessionId: `credits-${Date.now()}`
    }
    
    await sendNotification(userId, 'credit_purchase', purchaseData)
    
    console.log(`💰 Credit purchase notification sent: ${credits} credits for $${amount}`)
    
  } catch (error) {
    console.error('❌ Error sending credit purchase notification:', error)
  }
}

// Send feedback notification
export const sendFeedbackNotification = async (
  userId: string,
  sessionType: string,
  rating: number
): Promise<void> => {
  try {
    const feedbackData: NotificationData = {
      type: sessionType,
      feedback: { overall: rating }
    }
    
    await sendNotification(userId, 'feedback_received', feedbackData)
    
    console.log(`⭐ Feedback notification sent for ${sessionType} session (Rating: ${rating}/10)`)
    
  } catch (error) {
    console.error('❌ Error sending feedback notification:', error)
  }
} 