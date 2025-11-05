import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export class GoogleCalendarService {
  private oauth2Client: OAuth2Client | null = null;
  private calendar: any;
  private isAuthenticated: boolean = false;

  private initializeOAuth2Client() {
    if (!this.oauth2Client) {
      if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in environment variables')
      }
      
      this.oauth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/mentor-calendar/callback'
      );
      
      this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
      this.setupAuth();
    }
    return this.oauth2Client;
  }

  constructor() {
    // Lazy initialization - don't initialize OAuth2Client until actually needed
    // This allows dotenv to load before validation
  }

  private async setupAuth() {
    try {
      // No global auth (no service account, no env refresh token). This helper stays unauthenticated.
      // All real event creation should be done via MentorCalendarService (per-mentor OAuth).
      console.log('ℹ️  GoogleCalendarService: global auth disabled. Using fallback when called.');
      this.isAuthenticated = false;
    } catch (error) {
      console.error('❌ Failed to setup Google Calendar authentication:', error);
      this.isAuthenticated = false;
    }
  }

  // Get mentor's availability for a date range
  async getMentorAvailability(mentorEmail: string, startDate: string, endDate: string) {
    try {
      const response = await this.calendar.freebusy.query({
        requestBody: {
          timeMin: startDate,
          timeMax: endDate,
          items: [{ id: mentorEmail }]
        }
      });

      return response.data.calendars[mentorEmail];
    } catch (error) {
      console.error('Error fetching Google Calendar availability:', error);
      throw new Error('Failed to fetch calendar availability');
    }
  }

  // Get mentor's working hours and blocked times
  async getMentorSchedule(mentorEmail: string, date: string) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const response = await this.calendar.events.list({
        calendarId: mentorEmail,
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching mentor schedule:', error);
      throw new Error('Failed to fetch mentor schedule');
    }
  }

  // Create Google Calendar event with Meet
  async createCalendarEvent(sessionData: any) {
    try {
      // If not authenticated, generate a fallback Google Meet link
      if (!this.isAuthenticated) {
        console.log('⚠️  Google Calendar not authenticated. Generating fallback Google Meet link...');
        return this.generateFallbackMeetLink(sessionData);
      }

      const startDateTime = new Date(`${sessionData.date}T${sessionData.time}`)
      const endDateTime = new Date(startDateTime.getTime() + (sessionData.duration * 60000))

      const event = {
        summary: `${sessionData.type || 'Interview'} Session - ${sessionData.mentorName}`,
        description: `
Mock interview session details:
• Type: ${sessionData.type || 'Interview'}
• Duration: ${sessionData.duration} minutes
• Candidate: ${sessionData.candidateName}
• Mentor: ${sessionData.mentorName}

Please join the session on time and ensure you have a stable internet connection.
        `.trim(),
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'Asia/Kolkata'
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'Asia/Kolkata'
        },
        attendees: [
          { 
            email: sessionData.candidateEmail,
            displayName: sessionData.candidateName
          },
          { 
            email: sessionData.mentorEmail,
            displayName: sessionData.mentorName
          }
        ],
        conferenceData: {
          createRequest: {
            requestId: `meet-${sessionData.id}-${Date.now()}`,
            conferenceSolutionKey: { 
              type: 'hangoutsMeet' 
            }
          }
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 },      // 30 minutes before
            { method: 'popup', minutes: 5 }        // 5 minutes before
          ]
        }
      };
      
      console.log('📅 Creating Google Calendar event:', {
        summary: event.summary,
        start: event.start.dateTime,
        end: event.end.dateTime,
        attendees: event.attendees.length
      })

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
        sendUpdates: 'all'
      });

      const calendarEvent = response.data
      console.log('✅ Google Calendar event created:', {
        eventId: calendarEvent.id,
        hangoutLink: calendarEvent.hangoutLink,
        meetLink: calendarEvent.conferenceData?.entryPoints?.[0]?.uri
      })

      return calendarEvent;
    } catch (error) {
      console.error('❌ Error creating Google Calendar event:', error);
      console.log('🔄 Falling back to manual Google Meet link generation...');
      return this.generateFallbackMeetLink(sessionData);
    }
  }

  // Generate a fallback Google Meet link when API is not available
  private generateFallbackMeetLink(sessionData: any) {
    // Generate a unique meeting identifier for the session
    const sessionId = sessionData.id.toString().slice(-8);
    const meetingId = `interview-${sessionId}`;
    
    // Create a meeting creation link that the mentor can use
    const meetLink = `https://meet.google.com/new`;
    
    console.log('⚠️  Google Calendar API not available. Using fallback meeting setup.');
    console.log('📝 Meeting ID for reference:', meetingId);
    console.log('🔗 Mentor should create Google Meet room and update session with the link.');
    
    return {
      id: `fallback-${sessionData.id}-${Date.now()}`,
      hangoutLink: meetLink,
      meetingId: meetingId, // Store the meeting ID for reference
      conferenceData: {
        entryPoints: [{
          uri: meetLink,
          entryPointType: 'video'
        }]
      },
      summary: `${sessionData.type || 'Interview'} Session - ${sessionData.mentorName}`,
      description: `
Mock interview session details:
• Type: ${sessionData.type || 'Interview'}
• Duration: ${sessionData.duration} minutes
• Candidate: ${sessionData.candidateName}
• Mentor: ${sessionData.mentorName}

SETUP REQUIRED: 
Mentor needs to create a Google Meet room and share the link.
Meeting ID: ${meetingId}
Session ID: ${sessionId}

Steps:
1. Mentor creates Google Meet room
2. Mentor shares the meeting link with candidate
3. Both join at the scheduled time
      `.trim(),
      start: {
        dateTime: new Date(`${sessionData.date}T${sessionData.time}`).toISOString(),
        timeZone: 'Asia/Kolkata'
      },
      end: {
        dateTime: new Date(new Date(`${sessionData.date}T${sessionData.time}`).getTime() + (sessionData.duration * 60000)).toISOString(),
        timeZone: 'Asia/Kolkata'
      }
    };
  }
}
