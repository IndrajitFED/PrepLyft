# Interview Booking Web Application

A complete interview preparation platform built with React.js frontend and Node.js backend, featuring session booking, mentor management, and real-time notifications.

## 🚀 Features

### Core Functionality
- **User Authentication**: JWT-based authentication for candidates, mentors, and admins
- **Session Booking**: Book mock interview sessions with industry experts
- **Real-time Notifications**: Get notified about session updates, reminders, and confirmations
- **Video Integration**: Google Meet integration for interview sessions
- **Feedback System**: Comprehensive feedback and rating system
- **Progress Tracking**: Monitor your interview preparation journey

### User Roles
- **Candidates**: Book sessions, track progress, receive feedback
- **Mentors**: Manage sessions, provide feedback, view analytics
- **Admins**: Platform management, user oversight, analytics

### Interview Types
- DSA (Data Structures & Algorithms)
- Data Science
- Analytics
- System Design
- Behavioral

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **React Router** for navigation
- **Zustand** for state management
- **Axios** for API calls
- **React Hook Form** for forms
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Socket.io** for real-time features
- **Express Validator** for input validation
- **Bcrypt** for password hashing

## 📁 Project Structure

```
interview-booking-app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript type definitions
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic services
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   └── tsconfig.json
└── package.json             # Root package.json for workspaces
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd interview-booking-app
```

### 2. Install Dependencies
```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Or install individually
npm install                    # Root dependencies
cd frontend && npm install    # Frontend dependencies
cd ../backend && npm install  # Backend dependencies
```

### 3. Environment Setup

#### Backend Environment
```bash
cd backend
cp env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/interview-booking
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

#### Frontend Environment
The frontend is configured to proxy API calls to the backend automatically.

### 4. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

### 5. Run the Application

#### Development Mode (Both Frontend & Backend)
```bash
# From root directory
npm run dev
```

#### Individual Services
```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🔧 Development

### Available Scripts

#### Root Level
```bash
npm run dev              # Start both frontend and backend
npm run build            # Build both applications
npm run install:all      # Install all dependencies
```

#### Frontend
```bash
cd frontend
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

#### Backend
```bash
cd backend
npm run dev              # Start development server
npm run build            # Build TypeScript
npm start                # Start production server
```

### Code Structure

#### Frontend Components
- **LandingPage**: Marketing page with features and pricing
- **CandidateDashboard**: Main dashboard for interview candidates
- **MentorDashboard**: Dashboard for interview mentors
- **AdminDashboard**: Administrative panel
- **Auth Components**: Login, Register, Protected Routes

#### Backend API Endpoints
- **Authentication**: `/api/auth/*` - Login, register, profile
- **Sessions**: `/api/sessions/*` - Book, manage, join sessions
- **Users**: `/api/users/*` - User management, profiles
- **Mentors**: `/api/mentors/*` - Mentor-specific functionality
- **Admin**: `/api/admin/*` - Administrative functions
- **Notifications**: `/api/notifications/*` - User notifications

## 🚀 Deployment

### Frontend Deployment

#### Vercel (Recommended)
```bash
cd frontend
npm run build
vercel --prod
```

#### Netlify
```bash
cd frontend
npm run build
# Drag dist folder to Netlify
```

#### AWS S3 + CloudFront
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://your-bucket-name
```

### Backend Deployment

#### Railway
```bash
cd backend
railway login
railway init
railway up
```

#### Heroku
```bash
cd backend
heroku create your-app-name
git push heroku main
```

#### AWS EC2
```bash
# Build the application
cd backend
npm run build

# Deploy to EC2 instance
# Set up PM2 for process management
pm2 start dist/index.js --name "interview-booking-api"
```

#### DigitalOcean App Platform
```bash
cd backend
# Connect your GitHub repository
# DigitalOcean will auto-deploy on push
```

### Environment Variables for Production

#### Frontend
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_APP_NAME=MockAce
```

#### Backend
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-booking
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
```

## 🔐 Security Features

- **JWT Authentication** with secure token storage
- **Password Hashing** using bcrypt
- **Input Validation** with express-validator
- **CORS Protection** with configurable origins
- **Rate Limiting** to prevent abuse
- **Helmet.js** for security headers
- **Environment Variables** for sensitive data

## 📊 Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  password: string (hashed),
  role: 'candidate' | 'mentor' | 'admin',
  avatar?: string,
  skills: string[],
  experience?: number,
  company?: string,
  position?: string,
  credits: number,
  rating: number,
  totalSessions: number,
  completedSessions: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Sessions Collection
```typescript
{
  _id: ObjectId,
  candidate: ObjectId (ref: User),
  mentor: ObjectId (ref: User),
  type: 'DSA' | 'Data Science' | 'Analytics' | 'System Design' | 'Behavioral',
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'rescheduled',
  scheduledDate: Date,
  duration: number,
  meetingLink?: string,
  meetingPlatform: 'google-meet' | 'zoom' | 'teams',
  feedback?: {
    technical: number,
    communication: number,
    problemSolving: number,
    overall: number,
    comments: string,
    mentor: ObjectId,
    createdAt: Date
  },
  price: number,
  isPaid: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Integration

### Google Meet Integration
For production, integrate with Google Calendar API:
```typescript
// Example Google Meet creation
const createGoogleMeet = async (session: Session) => {
  const calendar = google.calendar({ version: 'v3', auth });
  const event = {
    summary: `${session.type} Interview Session`,
    start: { dateTime: session.scheduledDate },
    end: { dateTime: new Date(session.scheduledDate.getTime() + session.duration * 60000) },
    conferenceData: {
      createRequest: { requestId: session._id.toString() }
    }
  };
  
  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1
  });
  
  return response.data.conferenceData?.entryPoints?.[0]?.uri;
};
```

### Payment Integration
Integrate with Stripe for credit purchases:
```typescript
// Example Stripe payment
const createPaymentIntent = async (amount: number, currency: string = 'usd') => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true }
  });
  
  return paymentIntent;
};
```

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test
```

### Backend Testing
```bash
cd backend
npm run test
```

## 📈 Performance Optimization

- **Code Splitting** with React.lazy()
- **Image Optimization** with next/image
- **Bundle Analysis** with webpack-bundle-analyzer
- **Database Indexing** for faster queries
- **Caching** with Redis (production)
- **CDN** for static assets

## 🔍 Monitoring & Analytics

### Backend Monitoring
- **Health Checks**: `/api/health`
- **Error Logging**: Comprehensive error handling
- **Performance Metrics**: Response time tracking
- **Database Monitoring**: Connection status

### Frontend Analytics
- **User Behavior**: Page views, session duration
- **Performance**: Core Web Vitals
- **Error Tracking**: JavaScript error monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions

## 🚀 Future Enhancements

- **AI-Powered Feedback**: Automated interview feedback
- **Video Recording**: Session recording and playback
- **Advanced Analytics**: Detailed performance insights
- **Mobile App**: React Native mobile application
- **Multi-language Support**: Internationalization
- **Advanced Scheduling**: Calendar integration
- **Payment Processing**: Credit card payments
- **Email Notifications**: Automated email reminders

---

**Built with ❤️ for the developer community** 