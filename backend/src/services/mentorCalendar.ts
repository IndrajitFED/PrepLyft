import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { User } from '../models/User'
import { Session } from '../models/Session'

export interface CalendarEvent {
  id?: string
  summary: string
  description: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  attendees?: Array<{
    email: string
    displayName: string
  }>
  conferenceData?: {
    createRequest: {
      requestId: string
      conferenceSolutionKey: {
        type: string
      }
    }
  }
}

export class MentorCalendarService {
  private static oauth2Client: OAuth2Client | null = null

  private static getOAuth2Client(): OAuth2Client {
    if (!MentorCalendarService.oauth2Client) {
      if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in environment variables')
      }
      
      MentorCalendarService.oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/mentor-calendar/callback'
      )
    }
    return MentorCalendarService.oauth2Client
  }

  /**
   * Get mentor's Google Calendar credentials
   */
  static async getMentorCredentials(mentorId: string) {
    try {
      const mentor = await User.findById(mentorId).select(
        '+googleCalendarCredentials.accessToken +googleCalendarCredentials.refreshToken +googleCalendarCredentials.isConnected +googleCalendarCredentials.calendarId'
      )
      
      if (!mentor || !mentor.googleCalendarCredentials) return null

      const creds: any = mentor.googleCalendarCredentials
      const treatedConnected = !!creds.isConnected || !!creds.refreshToken
      if (!treatedConnected) return null

      return mentor.googleCalendarCredentials
    } catch (error) {
      console.error('Error getting mentor credentials:', error)
      return null
    }
  }

  /**
   * Set up OAuth2 client with mentor's credentials
   */
  static async setupOAuth2Client(mentorId: string) {
    const credentials = await this.getMentorCredentials(mentorId)
    
    if (!credentials) {
      throw new Error('Mentor calendar not connected')
    }

    const hasAccess = !!credentials.accessToken
    const hasRefresh = !!credentials.refreshToken
    console.log('🔑 Mentor OAuth tokens present:', { hasAccess, hasRefresh })

    const oauth2Client = this.getOAuth2Client()
    oauth2Client.setCredentials({
      access_token: credentials.accessToken || undefined,
      refresh_token: credentials.refreshToken || undefined
    })

    return oauth2Client
  }

  /**
   * Create a calendar event for a session
   */
  static async createSessionEvent(mentorId: string, sessionId: string): Promise<CalendarEvent | null> {
    try {
      const session = await Session.findById(sessionId)
        .populate('candidate', 'name email')
        .populate('mentor', 'name email')

      if (!session || !session.mentor) {
        throw new Error('Session or mentor not found')
      }

      // Type assertion for populated fields
      const candidate = session.candidate as any
      const mentor = session.mentor as any

      const oauth2Client = await this.setupOAuth2Client(mentorId)
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

      // Generate Google Meet link
      const meetLink = await this.generateGoogleMeetLink(calendar, sessionId)

      const event: CalendarEvent = {
        summary: `${session.type} Session - ${candidate.name}`,
        description: `
            Session Details:
            - Type: ${session.type}
            - Duration: ${session.duration} minutes
            - Candidate: ${candidate.name} (${candidate.email})
            - Mentor: ${mentor.name} (${mentor.email})
            - Price: ₹${session.price}

            Please join the session on time and ensure you have a stable internet connection.
        `.trim(),
        start: {
          dateTime: session.scheduledDate?.toISOString() || new Date().toISOString(),
          timeZone: 'Asia/Kolkata'
        },
        end: {
          dateTime: new Date(
            (session.scheduledDate?.getTime() || Date.now()) + (session.duration * 60000)
          ).toISOString(),
          timeZone: 'Asia/Kolkata'
        },
        attendees: [
          {
            email: candidate.email,
            displayName: candidate.name
          },
          {
            email: mentor.email,
            displayName: mentor.name
          }
        ],
        conferenceData: {
          createRequest: {
            requestId: `meet-${sessionId}-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        }
      }

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        conferenceDataVersion: 1,
        sendUpdates: 'all'
      })

      // Update session with Google Calendar event ID
      await Session.findByIdAndUpdate(sessionId, {
        googleEventId: response.data.id,
        meetingLink: meetLink
      })

      return response.data as CalendarEvent
    } catch (error) {
      console.error('Error creating calendar event:', error)
      return null
    }
  }

  /**
   * Generate Google Meet link for the session
   */
  private static async generateGoogleMeetLink(calendar: any, sessionId: string): Promise<string> {
    try {
      // For now, return a placeholder. In production, this would generate actual Meet links
      return `https://meet.google.com/session-${sessionId}`
    } catch (error) {
      console.error('Error generating Meet link:', error)
      return `https://meet.google.com/session-${sessionId}`
    }
  }

  /**
   * Get mentor's calendar availability
   */
  static async getMentorAvailability(mentorId: string, startDate: Date, endDate: Date) {
    try {
      const oauth2Client = await this.setupOAuth2Client(mentorId)
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

      const response = await calendar.freebusy.query({
        requestBody: {
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          items: [{ id: 'primary' }]
        }
      })

      return response.data.calendars?.primary?.busy || []
    } catch (error) {
      console.error('Error getting mentor availability:', error)
      return []
    }
  }

  /**
   * Update a calendar event
   */
  static async updateSessionEvent(mentorId: string, sessionId: string): Promise<CalendarEvent | null> {
    try {
      const session = await Session.findById(sessionId)
        .populate('candidate', 'name email')
        .populate('mentor', 'name email')

      if (!session || !session.googleEventId) {
        throw new Error('Session or event not found')
      }

      // Type assertion for populated fields
      const candidate = session.candidate as any
      const mentor = session.mentor as any

      const oauth2Client = await this.setupOAuth2Client(mentorId)
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

      const event: Partial<CalendarEvent> = {
        summary: `${session.type} Session - ${candidate.name}`,
        description: `
Session Details:
- Type: ${session.type}
- Duration: ${session.duration} minutes
- Candidate: ${candidate.name} (${candidate.email})
- Mentor: ${mentor.name} (${mentor.email})
- Price: ₹${session.price}
- Status: ${session.status}

Please join the session on time and ensure you have a stable internet connection.
        `.trim(),
        start: {
          dateTime: session.scheduledDate?.toISOString() || new Date().toISOString(),
          timeZone: 'Asia/Kolkata'
        },
        end: {
          dateTime: new Date(
            (session.scheduledDate?.getTime() || Date.now()) + (session.duration * 60000)
          ).toISOString(),
          timeZone: 'Asia/Kolkata'
        }
      }

      const response = await calendar.events.update({
        calendarId: 'primary',
        eventId: session.googleEventId,
        requestBody: event
      })

      return response.data as CalendarEvent
    } catch (error) {
      console.error('Error updating calendar event:', error)
      return null
    }
  }

  /**
   * Delete a calendar event
   */
  static async deleteSessionEvent(mentorId: string, sessionId: string): Promise<boolean> {
    try {
      const session = await Session.findById(sessionId)

      if (!session || !session.googleEventId) {
        return false
      }

      const oauth2Client = await this.setupOAuth2Client(mentorId)
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

      await calendar.events.delete({
        calendarId: 'primary',
        eventId: session.googleEventId
      })

      // Clear the event ID from session
      await Session.findByIdAndUpdate(sessionId, {
        $unset: { googleEventId: 1 }
      })

      return true
    } catch (error) {
      console.error('Error deleting calendar event:', error)
      return false
    }
  }

  /**
   * Get Google Calendar authorization URL for mentor
   */
  static getAuthorizationUrl(mentorId: string): string {
    // Validate environment variables
    // if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'your-google-client-id') {
    //   throw new Error('Google OAuth not configured. Please set GOOGLE_CLIENT_ID environment variable.')
    // }
    
    if (!process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET === 'your-google-client-secret') {
      throw new Error('Google OAuth not configured. Please set GOOGLE_CLIENT_SECRET environment variable.')
    }

    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ]

    const oauth2Client = this.getOAuth2Client()
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: mentorId, // Pass mentor ID in state for callback
      prompt: 'consent',
      include_granted_scopes: true as any
    })
  }

  /**
   * Handle Google Calendar OAuth callback
   */
  static async handleCallback(code: string, mentorId: string): Promise<boolean> {
    try {
      const oauth2Client = this.getOAuth2Client()
      const { tokens } = await oauth2Client.getToken(code)
      const hasAccess = !!tokens.access_token
      const hasRefresh = !!tokens.refresh_token
      console.log('🔄 OAuth callback tokens:', { hasAccess, hasRefresh })

      const existing = await User.findById(mentorId).select(
        '+googleCalendarCredentials.accessToken +googleCalendarCredentials.refreshToken +googleCalendarCredentials.isConnected'
      ) as any

      const existingAccess = existing?.googleCalendarCredentials?.accessToken
      const existingRefresh = existing?.googleCalendarCredentials?.refreshToken

      const accessToSave = tokens.access_token || existingAccess || ''
      const refreshToSave = tokens.refresh_token || existingRefresh || ''
      const connected = !!refreshToSave

      if (!connected) {
        console.warn('⚠️  No refresh token available after OAuth callback. User may need to re-consent.')
      }

      await User.findByIdAndUpdate(mentorId, {
        'googleCalendarCredentials.accessToken': accessToSave,
        'googleCalendarCredentials.refreshToken': refreshToSave,
        'googleCalendarCredentials.isConnected': connected
      })

      return connected
    } catch (error) {
      console.error('Error handling calendar callback:', error)
      return false
    }
  }

  /**
   * Disconnect mentor's Google Calendar
   */
  static async disconnectCalendar(mentorId: string): Promise<boolean> {
    try {
      await User.findByIdAndUpdate(mentorId, {
        $unset: { googleCalendarCredentials: 1 }
      })

      return true
    } catch (error) {
      console.error('Error disconnecting calendar:', error)
      return false
    }
  }
}
