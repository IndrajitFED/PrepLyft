# Google API Setup for Automatic Google Meet Creation

This guide will help you set up Google Calendar API to automatically create Google Meet rooms for interview sessions.

## 🎯 What This Enables

- ✅ **Automatic Google Meet Room Creation**: Real Google Meet rooms created instantly
- ✅ **Calendar Integration**: Events automatically added to Google Calendar
- ✅ **Email Invitations**: Both mentor and candidate receive calendar invites
- ✅ **Meeting Reminders**: Automatic reminders 1 day, 30 minutes, and 5 minutes before
- ✅ **Professional Experience**: Seamless booking-to-meeting flow

## 🔧 Setup Options

### Option 1: Service Account (Recommended for Production)

**Best for**: Production environments, server-to-server authentication

#### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project" or select existing project
3. Note your Project ID

#### Step 2: Enable APIs

1. Go to "APIs & Services" > "Library"
2. Search and enable:
   - **Google Calendar API**
   - **Google Meet API** (if available)

#### Step 3: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in details:
   - Name: `interview-booking-service`
   - Description: `Service account for interview booking Google Meet creation`
4. Click "Create and Continue"
5. Skip role assignment for now
6. Click "Done"

#### Step 4: Generate Service Account Key

1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the JSON file

#### Step 5: Configure Environment Variables

```bash
# Add to your .env file
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id",...}'
```

**Important**: The entire JSON content should be on one line as a string.

### Option 2: OAuth2 with Refresh Token (Best for Development)

**Best for**: Development, testing, single-user applications

#### Step 1: Create OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Click "Create Credentials" > "OAuth client ID"
4. Choose "Web application"
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - `https://yourdomain.com/api/auth/google/callback`

#### Step 2: Get Authorization Code

Visit this URL (replace `YOUR_CLIENT_ID`):

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:5000/api/auth/google/callback&scope=https://www.googleapis.com/auth/calendar%20https://www.googleapis.com/auth/calendar.events&response_type=code&access_type=offline&prompt=consent
```

#### Step 3: Exchange Code for Tokens

Use the authorization code to get tokens:

```bash
curl -X POST https://oauth2.googleapis.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code=AUTHORIZATION_CODE" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=http://localhost:5000/api/auth/google/callback"
```

#### Step 4: Configure Environment Variables

```bash
# Add to your .env file
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
GOOGLE_REFRESH_TOKEN=your-refresh-token
GOOGLE_ACCESS_TOKEN=your-access-token
```

### Option 3: Application Default Credentials (Google Cloud)

**Best for**: Applications running on Google Cloud

#### Step 1: Set up Application Default Credentials

```bash
# Install Google Cloud CLI
curl https://sdk.cloud.google.com | bash

# Authenticate
gcloud auth application-default login

# Set project
gcloud config set project YOUR_PROJECT_ID
```

#### Step 2: Set Environment Variable

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json
```

## 🧪 Testing the Setup

### Test Google Meet Creation

1. **Start your backend server**
2. **Book a test session**:

```bash
curl -X POST http://localhost:5000/api/smart-booking/book-smart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "field": "DSA",
    "scheduledDate": "2025-09-16",
    "time": "10:00",
    "duration": 60,
    "price": 999
  }'
```

3. **Check the response** - should include a real Google Meet link
4. **Verify in Google Calendar** - event should appear automatically

### Test Endpoint for Google Meet Service

I'll add a test endpoint to verify the setup:

```bash
curl -X GET http://localhost:5000/api/google-meet/test
```

## 📋 Environment Variables Reference

### Required Variables

```bash
# Option 1: Service Account
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'

# Option 2: OAuth2
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
GOOGLE_REFRESH_TOKEN=your-refresh-token
GOOGLE_ACCESS_TOKEN=your-access-token

# Option 3: Application Default Credentials
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

### Optional Variables

```bash
# Default timezone for meetings
GOOGLE_MEET_TIMEZONE=Asia/Kolkata

# Default calendar ID (usually 'primary')
GOOGLE_CALENDAR_ID=primary
```

## 🚀 What Happens After Setup

### Automatic Google Meet Creation Flow

1. **Candidate books session** → Smart booking finds best mentor
2. **Google Meet room created** → Real Google Meet link generated
3. **Calendar event created** → Added to mentor's and candidate's calendars
4. **Email invitations sent** → Both parties receive calendar invites
5. **Notifications sent** → App notifications with meeting link
6. **Reminders scheduled** → Automatic reminders before meeting

### Example Response

```json
{
  "success": true,
  "data": {
    "session": {
      "id": "68c851ca15fecc5389ba136c",
      "meetingLink": "https://meet.google.com/abc-defg-hij",
      "googleEventId": "event_123456789",
      "status": "scheduled",
      "mentorName": "John Doe",
      "scheduledDate": "2025-09-16T10:00:00.000Z"
    }
  },
  "message": "Session booked successfully with Google Meet room"
}
```

## 🔍 Troubleshooting

### Common Issues

**Error: "The caller does not have permission"**
- **Solution**: Ensure Google Calendar API is enabled
- **Check**: Service account has proper permissions

**Error: "Invalid credentials"**
- **Solution**: Verify environment variables are correct
- **Check**: JSON format for service account key

**Error: "Quota exceeded"**
- **Solution**: Check Google Cloud quotas
- **Fix**: Request quota increase if needed

**No Google Meet link generated**
- **Check**: `conferenceDataVersion: 1` is set
- **Verify**: `conferenceSolutionKey.type: 'hangoutsMeet'`

### Debug Commands

```bash
# Test Google Meet service
curl -X GET http://localhost:5000/api/google-meet/test

# Check environment variables
echo $GOOGLE_SERVICE_ACCOUNT_KEY | jq .

# Test calendar API access
curl -X GET "https://www.googleapis.com/calendar/v3/calendars/primary/events" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📈 Production Considerations

### Security
- Store credentials securely (use secret management)
- Rotate service account keys regularly
- Use least privilege principle

### Performance
- Implement rate limiting for API calls
- Cache calendar responses when possible
- Monitor API quota usage

### Monitoring
- Log all Google Meet creation attempts
- Monitor success/failure rates
- Set up alerts for API errors

## 🔮 Advanced Features (Future)

1. **Meeting Recording**: Automatic recording of sessions
2. **Breakout Rooms**: Support for group interviews
3. **Waiting Room**: Control who can join meetings
4. **Analytics**: Track meeting attendance and duration
5. **Integration**: Connect with other calendar systems

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your Google Cloud project setup
3. Test with the provided endpoints
4. Review Google Calendar API documentation

The automated Google Meet creation will significantly improve the user experience by eliminating manual setup steps!

