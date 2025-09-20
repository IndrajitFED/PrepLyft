import { User } from '../models/User'
import { Session } from '../models/Session'
import { getSessionConfig } from '../config/pricing'
import { MentorCalendarService } from './mentorCalendar'

export interface MentorAssignment {
  mentorId: string
  mentorName: string
  mentorEmail: string
  availability: {
    date: string
    timeSlots: string[]
  }[]
  currentLoad: number
  specialization: string[]
}

export class MentorAssignmentService {
  /**
   * Get available mentors for a specific field
   */
  static async getAvailableMentors(field: string): Promise<MentorAssignment[]> {
    try {
      // Get mentors who specialize in this field
      const mentors = await User.find({
        role: 'mentor',
        isActive: true,
        specializations: { $in: [field] }
      }).select('name email specializations workingHours')

      if (mentors.length === 0) {
        // If no specialized mentors, get any active mentors
        const fallbackMentors = await User.find({
          role: 'mentor',
          isActive: true
        }).select('name email specializations workingHours')
        
        return this.formatMentorAssignments(fallbackMentors, field)
      }

      return this.formatMentorAssignments(mentors, field)
    } catch (error) {
      console.error('Error getting available mentors:', error)
      throw error
    }
  }

  /**
   * Assign the best mentor for a session
   */
  static async assignMentor(field: string, preferredDate?: string, preferredTime?: string): Promise<MentorAssignment | null> {
    try {
      const availableMentors = await this.getAvailableMentors(field)
      
      if (availableMentors.length === 0) {
        return null
      }

      // If only one mentor, assign them
      if (availableMentors.length === 1) {
        return availableMentors[0]
      }

      // Load balancing: assign to mentor with least current load
      const sortedMentors = availableMentors.sort((a, b) => a.currentLoad - b.currentLoad)
      
      // If preferred date/time is provided, check availability
      if (preferredDate && preferredTime) {
        const availableForTime = sortedMentors.filter(mentor => 
          this.isMentorAvailableAtTime(mentor, preferredDate, preferredTime)
        )
        
        if (availableForTime.length > 0) {
          return availableForTime[0]
        }
      }

      return sortedMentors[0]
    } catch (error) {
      console.error('Error assigning mentor:', error)
      throw error
    }
  }

  /**
   * Check if mentor is available at specific time
   */
  static isMentorAvailableAtTime(mentor: MentorAssignment, date: string, time: string): boolean {
    const availability = mentor.availability.find(avail => avail.date === date)
    if (!availability) return false
    
    return availability.timeSlots.includes(time)
  }

  /**
   * Get mentor's current session load
   */
  static async getMentorLoad(mentorId: string): Promise<number> {
    try {
      const currentSessions = await Session.countDocuments({
        mentor: mentorId,
        status: { $in: ['scheduled', 'in-progress'] }
      })
      
      return currentSessions
    } catch (error) {
      console.error('Error getting mentor load:', error)
      return 0
    }
  }

  /**
   * Get mentor's availability for next 30 days
   */
  static async getMentorAvailability(mentorId: string): Promise<{ date: string; timeSlots: string[] }[]> {
    try {
      const mentor = await User.findById(mentorId)
      if (!mentor) return []

      const availability = []
      const workingHours = mentor.workingHours || { start: 9, end: 17 }
      
      // Generate availability for next 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date()
        date.setDate(date.getDate() + i)
        const dateStr = date.toISOString().split('T')[0]
        
        // Check if mentor has any sessions on this date
        const existingSessions = await Session.find({
          mentor: mentorId,
          $or: [
            { scheduledDate: { $gte: new Date(dateStr), $lt: new Date(dateStr + 'T23:59:59') } },
            { date: dateStr }
          ],
          status: { $in: ['scheduled', 'in-progress'] }
        })

        // Generate time slots (every hour from start to end)
        const timeSlots = []
        for (let hour = workingHours.start; hour < workingHours.end; hour++) {
          const timeSlot = `${hour.toString().padStart(2, '0')}:00`
          
          // Check if this time slot is available
          const isBooked = existingSessions.some(session => {
            const sessionTime = session.time || 
              (session.scheduledDate ? session.scheduledDate.getHours().toString().padStart(2, '0') + ':00' : '')
            return sessionTime === timeSlot
          })
          
          if (!isBooked) {
            timeSlots.push(timeSlot)
          }
        }
        
        if (timeSlots.length > 0) {
          availability.push({ date: dateStr, timeSlots })
        }
      }
      
      return availability
    } catch (error) {
      console.error('Error getting mentor availability:', error)
      return []
    }
  }

  /**
   * Format mentor data for assignment
   */
  private static async formatMentorAssignments(mentors: any[], field: string): Promise<MentorAssignment[]> {
    const assignments: MentorAssignment[] = []
    
    for (const mentor of mentors) {
      const load = await this.getMentorLoad(mentor._id.toString())
      const availability = await this.getMentorAvailability(mentor._id.toString())
      
      assignments.push({
        mentorId: mentor._id.toString(),
        mentorName: mentor.name,
        mentorEmail: mentor.email,
        availability,
        currentLoad: load,
        specialization: mentor.specializations || [field]
      })
    }
    
    return assignments
  }

  /**
   * Update mentor assignment for a session
   */
  static async updateSessionMentor(sessionId: string, mentorId: string): Promise<boolean> {
    try {
      await Session.findByIdAndUpdate(sessionId, {
        mentor: mentorId,
        status: 'scheduled'
      })

      // Try to create calendar event for the mentor
      try {
        await MentorCalendarService.createSessionEvent(mentorId, sessionId)
        console.log('Calendar event created for session:', sessionId)
      } catch (calendarError) {
        console.warn('Failed to create calendar event:', calendarError)
        // Don't fail the assignment if calendar creation fails
      }
      
      return true
    } catch (error) {
      console.error('Error updating session mentor:', error)
      return false
    }
  }
}
