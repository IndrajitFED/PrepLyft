import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

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
  private oauth2Client: OAuth2Client;
  private calendar: any;
  private isAuthenticated: boolean = false;

  constructor() {
    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    this.setupAuth();
  }

  private async setupAuth() {
    try {
      // Method 1: Service Account (Best for server-to-server)
      if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
        const auth = new google.auth.GoogleAuth({
          credentials: serviceAccount,
          scopes: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events'
          ]
        });
        
        this.calendar = google.calendar({ version: 'v3', auth });
        this.isAuthenticated = true;
        console.log('✅ Google Meet Service authenticated with service account');
        return;
      }

      // Method 2: OAuth2 with Refresh Token
      if (process.env.GOOGLE_REFRESH_TOKEN && process.env.GOOGLE_ACCESS_TOKEN) {
        this.oauth2Client.setCredentials({
          refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
          access_token: process.env.GOOGLE_ACCESS_TOKEN
        });
        this.isAuthenticated = true;
        console.log('✅ Google Meet Service authenticated with OAuth2 tokens');
        return;
      }

      // Method 3: Application Default Credentials (for Google Cloud)
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        const auth = new google.auth.GoogleAuth({
          scopes: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events'
          ]
        });
        
        this.calendar = google.calendar({ version: 'v3', auth });
        this.isAuthenticated = true;
        console.log('✅ Google Meet Service authenticated with application default credentials');
        return;
      }

      console.log('⚠️  Google Meet Service authentication not configured');
      this.isAuthenticated = false;
    } catch (error) {
      console.error('❌ Failed to setup Google Meet Service authentication:', error);
      this.isAuthenticated = false;
    }
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
  }): Promise<{
    meetingLink: string;
    eventId: string;
    joinUrl: string;
  } | null> {
    
    if (!this.isAuthenticated) {
      console.log('⚠️  Google Meet Service not authenticated. Cannot create automatic meeting room.');
      return null;
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

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        conferenceDataVersion: 1
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
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    return this.oauth2Client.generateAuthUrl({
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
    const { tokens } = await this.oauth2Client.getAccessToken(code);
    return {
      access_token: tokens.access_token || '',
      refresh_token: tokens.refresh_token || ''
    };
  }
}

