# Google Meet Integration Setup

This document explains how to set up Google Meet integration for the Interview Booking application.

## 🎯 Overview

The application now automatically creates Google Meet links when:
1. **Smart Booking**: A session is booked through smart booking (auto-confirmed)
2. **Manual Booking**: A mentor approves a pending session

## 🔧 Current Implementation

### ✅ What's Working
- **Fallback Google Meet Links**: When Google Calendar API is not configured, the system generates fallback Google Meet links
- **Session Storage**: Google Meet links are stored in the session model
- **Notifications**: Candidates receive notifications with Google Meet links
- **Frontend Integration**: The candidate dashboard displays Google Meet links

### ⚠️ What Needs Setup (Optional)
- **Google Calendar API Integration**: For automatic calendar events and real Google Meet rooms

## 🚀 Quick Start (Development Mode)

The system works out-of-the-box with fallback Google Meet links. No additional setup required!

### Testing the Integration

1. **Book a Session**:
   ```bash
   # Use smart booking or regular booking
   POST /api/smart-booking/book-smart
   # or
   POST /api/sessions/book
   ```

2. **Check Session Response**:
   ```json
   {
     "success": true,
     "data": {
       "session": {
         "meetingLink": "https://meet.google.com/meet-123-456789",
         "googleEventId": "fallback-123-456789",
         "status": "scheduled"
       }
     }
   }
   ```

3. **Verify in Candidate Dashboard**:
   - Login as candidate
   - Check "Next Session" or "Upcoming Sessions"
   - Google Meet link should be visible

## 🔐 Google Calendar API Setup (Production)

For production use with real Google Calendar integration:

### Option 1: Service Account (Recommended)

1. **Create Service Account**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google Calendar API
   - Create a service account
   - Download the JSON key file

2. **Set Environment Variable**:
   ```bash
   export GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"..."}'
   ```

### Option 2: OAuth2 with Refresh Token

1. **Get OAuth2 Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth2 credentials
   - Get refresh token

2. **Set Environment Variables**:
   ```bash
   export GOOGLE_CLIENT_ID="your-client-id"
   export GOOGLE_CLIENT_SECRET="your-client-secret"
   export GOOGLE_REFRESH_TOKEN="your-refresh-token"
   ```

### Option 3: API Key (Limited)

1. **Create API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create API key
   - Restrict to Google Calendar API

2. **Set Environment Variable**:
   ```bash
   export GOOGLE_API_KEY="your-api-key"
   ```

## 📋 Environment Variables

Add these to your `.env` file:

```bash
# Google Calendar API Configuration
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/mentor-calendar/callback

# Option 1: Service Account (Recommended for production)
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

# Option 2: Refresh Token
GOOGLE_REFRESH_TOKEN=your-refresh-token

# Option 3: API Key (Limited functionality)
GOOGLE_API_KEY=your-api-key
```

## 🔄 How It Works

### Smart Booking Flow
1. Candidate books session via `/api/smart-booking/book-smart`
2. System finds best available mentor
3. Creates session with `status: 'scheduled'`
4. **Automatically creates Google Meet link**
5. Sends notifications to both mentor and candidate
6. Candidate receives Google Meet link in notification

### Manual Booking Flow
1. Candidate books session via `/api/sessions/book`
2. Session created with `status: 'pending'`
3. Mentor approves session via `/api/sessions/:id/approve`
4. **Google Meet link created upon approval**
5. Candidate receives notification with Google Meet link

### Fallback Mechanism
- If Google Calendar API is not configured → Generates fallback Google Meet link
- If API call fails → Falls back to manual Google Meet link
- System continues to work without interruption

## 🎨 Frontend Integration

### Candidate Dashboard
- **Next Session**: Shows Google Meet link if available
- **Upcoming Sessions**: Displays "Join Meeting" button with Google Meet link
- **Session Details**: Meeting link prominently displayed

### Mentor Dashboard
- **Session Management**: Can see Google Meet links for their sessions
- **Calendar Integration**: Sessions appear in Google Calendar (if API configured)

## 📧 Notifications

### Notification Types
- `session_confirmed`: Sent to candidate with Google Meet link
- `session_approved`: Sent to candidate when mentor approves session
- `session_booked`: Sent to mentor about new booking

### Notification Content
```json
{
  "type": "session_confirmed",
  "data": {
    "sessionId": "123",
    "mentorName": "John Doe",
    "type": "DSA",
    "scheduledDate": "2025-09-16T10:00:00Z",
    "meetingLink": "https://meet.google.com/meet-123-456789"
  }
}
```

## 🧪 Testing

### Test Google Meet Integration

1. **Start the servers**:
   ```bash
   npm run dev:watch
   ```

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

3. **Check the response** for `meetingLink` field

4. **Verify in database**:
   ```bash
   # Check if meetingLink is stored in session
   db.sessions.findOne({_id: "session_id"})
   ```

## 🚨 Troubleshooting

### Common Issues

**Error: "Invalid video call name"**
- **Cause**: Generated Google Meet links were using invalid format
- **Solution**: ✅ **FIXED** - System now uses proper fallback mechanism
- **Result**: Mentors receive instructions to create Google Meet rooms manually

**Error: "No access, refresh token, API key..."**
- **Solution**: This is expected in development mode
- **Result**: System will use fallback Google Meet setup
- **Fix**: Configure Google Calendar API for production use

**Google Meet link not showing in frontend**
- **Check**: Session has `meetingLink` field
- **Verify**: Frontend is reading `session.meetingLink`
- **Debug**: Check browser console for errors

**Session created but no Google Meet link**
- **Check**: Backend logs for Google Calendar errors
- **Verify**: Session model includes `meetingLink` field
- **Test**: Try booking another session

**"Mentor will share meeting link" message**
- **Cause**: Google Calendar API not configured (normal in development)
- **Solution**: Mentor needs to create Google Meet room and update the session
- **API Endpoint**: `PUT /api/sessions/:id/update-meeting-link`

### Debug Commands

```bash
# Check if Google Calendar service is working
curl -X GET http://localhost:5000/api/smart-booking/test

# Check session details
curl -X GET http://localhost:5000/api/sessions/my-sessions \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check backend logs
tail -f backend/logs/app.log
```

## 📈 Production Considerations

### Performance
- Google Meet links are generated synchronously during session creation
- Fallback mechanism ensures no delays
- Consider caching for high-volume scenarios

### Security
- Store Google credentials securely (environment variables)
- Use service accounts for production
- Implement proper error handling

### Monitoring
- Log Google Calendar API calls
- Monitor fallback usage
- Track Google Meet link generation success rate

## 🔮 Future Enhancements

1. **Email Integration**: Send Google Meet links via email
2. **SMS Notifications**: Send meeting links via SMS
3. **Calendar Sync**: Two-way sync with mentor calendars
4. **Meeting Recording**: Automatic recording of sessions
5. **Analytics**: Track meeting attendance and duration

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review backend logs for error messages
3. Verify environment variables are set correctly
4. Test with fallback mode first

The system is designed to work reliably even without Google Calendar API configuration!
