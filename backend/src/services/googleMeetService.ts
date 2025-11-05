import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { MentorCalendarService } from './mentorCalendar';

export interface GoogleMeetEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: Array<{
    email: string;
    displayName: string;
  }>;
  conferenceData: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
    };
  };
  reminders: {
    useDefault: boolean;
    overrides: Array<{
      method: string;
      minutes: number;
    }>;
  };
}

export class GoogleMeetService {
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
    // No global auth setup - this service uses mentor OAuth tokens passed via mentorId parameter
    // All event creation should use MentorCalendarService.createSessionEvent() which uses mentor OAuth
    // This service is only used as a fallback in join route and requires mentorId to be provided
    this.isAuthenticated = false;
    console.log('ℹ️  GoogleMeetService: No global auth. Requires mentorId parameter for mentor OAuth.');
  }

  /**
   * Create a Google Meet room automatically
   */
  async createGoogleMeetRoom(sessionData: {
    id: string;
    date: string;
    time: string;
    duration: number;
    mentorName: string;
    candidateName: string;
    mentorEmail: string;
    candidateEmail: string;
    type: string;
    mentorId?: string; // optional: use per-mentor OAuth tokens if provided
  }): Promise<{
    meetingLink: string;
    eventId: string;
    joinUrl: string;
  } | null> {
    // Prefer per-mentor OAuth tokens when mentorId is provided
    if (sessionData.mentorId) {
      try {
        const oauth2Client = await MentorCalendarService.setupOAuth2Client(sessionData.mentorId);
        this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        try {
          // Try to populate access token if only refresh token is present
          if (typeof (oauth2Client as any).getAccessToken === 'function') {
            await (oauth2Client as any).getAccessToken().catch(() => null)
          }
        } catch {}
      } catch (e) {
        console.error('❌ Failed to set up mentor OAuth2 client, will fallback to global auth:', e);
      }
    }

    // Fallback to global OAuth2Client if mentor OAuth not available
    if (!this.calendar) {
      this.initializeOAuth2Client(); // This will initialize this.calendar
    }

    try {
      const startDateTime = new Date(`${sessionData.date}T${sessionData.time}`);
      const endDateTime = new Date(startDateTime.getTime() + (sessionData.duration * 60000));

      const event: GoogleMeetEvent = {
        summary: `${sessionData.type} Interview Session`,
        description: `
🎯 Mock Interview Session Details:
• Type: ${sessionData.type}
• Duration: ${sessionData.duration} minutes
• Candidate: ${sessionData.candidateName}
• Mentor: ${sessionData.mentorName}

📋 Interview Guidelines:
• Please join 5 minutes before the scheduled time
• Ensure stable internet connection
• Have your resume and projects ready
• Prepare questions about the company/role

🔗 Meeting Link: Will be provided automatically
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
            requestId: `interview-${sessionData.id}-${Date.now()}`,
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

      console.log('🚀 Creating Google Meet room automatically...');
      console.log('📅 Event details:', {
        summary: event.summary,
        start: event.start.dateTime,
        duration: sessionData.duration,
        attendees: event.attendees.length
      });

      // Guard: ensure we have valid mentor OAuth credentials before inserting
      try {
        const authAny = (this.calendar as any)?._options?.auth as any;
        // Attempt to ensure access token is populated
        if (authAny && typeof authAny.getAccessToken === 'function') {
          await authAny.getAccessToken().catch(() => null)
        }

        const creds = authAny?.credentials;
        const hasAccess = !!creds?.access_token;
        const hasRefresh = !!creds?.refresh_token;
        console.log('🔐 Auth check:', {
          client: authAny?.constructor?.name,
          hasAccess,
          hasRefresh,
          usedMentorId: !!sessionData.mentorId
        })

        // Require mentor OAuth credentials (access token or refresh token)
        if (!hasAccess && !hasRefresh) {
          console.log('⚠️  No valid mentor OAuth credentials available. Mentor must connect calendar first.');
          return null;
        }
      } catch (guardErr) {
        console.log('⚠️  Unable to verify mentor OAuth credentials. Skipping Meet creation.', guardErr);
        return null;
      }

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        conferenceDataVersion: 1,
        sendUpdates: 'all'
      });

      const createdEvent = response.data;
      const meetingLink = createdEvent.conferenceData?.entryPoints?.[0]?.uri || 
                         createdEvent.hangoutLink;

      if (!meetingLink) {
        throw new Error('Google Meet link not generated');
      }

      console.log('✅ Google Meet room created successfully!');
      console.log('🔗 Meeting Link:', meetingLink);
      console.log('📅 Event ID:', createdEvent.id);

      return {
        meetingLink,
        eventId: createdEvent.id,
        joinUrl: meetingLink
      };

    } catch (error) {
      console.error('❌ Failed to create Google Meet room:', error);
      throw new Error(`Google Meet creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing Google Meet event
   */
  async updateGoogleMeetRoom(eventId: string, updates: Partial<GoogleMeetEvent>): Promise<boolean> {
    if (!this.isAuthenticated) {
      console.log('⚠️  Google Meet Service not authenticated');
      return false;
    }

    try {
      await this.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        requestBody: updates
      });

      console.log('✅ Google Meet room updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to update Google Meet room:', error);
      return false;
    }
  }

  /**
   * Delete a Google Meet event
   */
  async deleteGoogleMeetRoom(eventId: string): Promise<boolean> {
    if (!this.isAuthenticated) {
      console.log('⚠️  Google Meet Service not authenticated');
      return false;
    }

    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId
      });

      console.log('✅ Google Meet room deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to delete Google Meet room:', error);
      return false;
    }
  }

  /**
   * Get OAuth2 authorization URL for manual setup
   */
  getAuthUrl(): string {
    const oauth2Client = this.initializeOAuth2Client();
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokensFromCode(code: string): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const oauth2Client = this.initializeOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    return {
      access_token: tokens.access_token || '',
      refresh_token: tokens.refresh_token || ''
    };
  }
}

