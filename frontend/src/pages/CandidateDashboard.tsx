import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Clock, 
  Code, 
  Database, 
  BarChart3, 
  User, 
  ChevronRight,
  Plus,
  HelpCircle,
  Star,
  Trophy,
  ExternalLink,
  BookOpen,
  Layers
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getApiUrl } from '../utils/env'
import { useTheme } from '../contexts/ThemeContext'

interface Session {
  _id: string
  type: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'rescheduled' | 'pending'
  scheduledDate?: string
  date?: string
  time?: string
  duration: number
  price: number
  meetingLink?: string
  googleEventId?: string
  feedback?: {
    communication: number
    problemSolving: number
    codeQuality: number
    domain: string
    comments?: string
    codeSnippet?: string
    codeLanguage?: string
    mentor: string
    createdAt: string
  }
  mentor?: {
    _id: string
    name: string
    email: string
    avatar?: string
    company?: string
    position?: string
  }
  assignedMentor?: {
    _id: string
    name: string
    email: string
    avatar?: string
    company?: string
    position?: string
  }
  candidate?: {
    _id: string
    name: string
    email: string
    avatar?: string
  }
  createdAt: string
  updatedAt: string
}

interface DashboardStats {
  completed: number
  upcoming: number
  total: number
  averageRating: number
}

interface Subscription {
  plan: 'basic' | 'standard' | 'premium' | null
  limit: number
  used: number
  remaining: number
  expiresAt?: string
  isExpired: boolean
  planDetails?: {
    name: string
    interviews: number
    price: number
    features: string[]
  }
}

const CandidateDashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [sessions, setSessions] = useState<Session[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    completed: 0,
    upcoming: 0,
    total: 0,
    averageRating: 0
  })
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user sessions
  const fetchSessions = async () => {
    try {
      console.log('Fetching candidate sessions...')
      const response = await fetch(getApiUrl('api/sessions/my-sessions'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      
      console.log('Candidate sessions API response:', data)
      
      if (data.success) {
        setSessions(data.sessions)
        calculateStats(data.sessions)
        console.log('Candidate sessions loaded:', data.sessions)
      } else {
        console.error('Failed to fetch candidate sessions:', data.message)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate dashboard statistics
  const calculateStats = (sessions: Session[]) => {
    const now = new Date()
    const completed = sessions.filter(session => session.status === 'completed').length
    const upcoming = sessions.filter(session => {
      // Include scheduled and pending sessions
      if (session.status !== 'scheduled' && session.status !== 'pending') return false
      
      // For pending sessions without date, consider them upcoming
      if (session.status === 'pending' && !session.scheduledDate && !session.date) return true
      
      // For sessions with date, check if they're in the future
      const sessionDate = session.scheduledDate ? new Date(session.scheduledDate) : 
        (session.date && session.time ? new Date(`${session.date}T${session.time}`) : null)
      return sessionDate && sessionDate > now
    }).length
    
    // Calculate average rating from completed sessions with feedback
    const completedWithFeedback = sessions.filter(session => 
      session.status === 'completed' && session.feedback
    )
    const averageRating = completedWithFeedback.length > 0 
      ? completedWithFeedback.reduce((sum, session) => {
          const avg = session.feedback ? 
            ((session.feedback.communication || 0) + (session.feedback.problemSolving || 0) + (session.feedback.codeQuality || 0)) / 3 : 0
          return sum + avg
        }, 0) / completedWithFeedback.length
      : 0
    
    setStats({
      completed,
      upcoming,
      total: sessions.length,
      averageRating: Math.round(averageRating * 10) / 10 // Round to 1 decimal place
    })
  }

  // Get next upcoming session (or most recent if none upcoming)
  const getNextSession = () => {
    const now = new Date()
    
    // First try to find upcoming sessions
    const upcomingSessions = sessions
      .filter(session => {
        if (session.status !== 'scheduled' && session.status !== 'pending') return false
        
        // For pending sessions without date, consider them upcoming
        if (session.status === 'pending' && !session.scheduledDate && !session.date) return true
        
        // For sessions with date, check if they're in the future
        const sessionDate = session.scheduledDate ? new Date(session.scheduledDate) : 
          (session.date && session.time ? new Date(`${session.date}T${session.time}`) : null)
        return sessionDate && sessionDate > now
      })
      .sort((a, b) => {
        // Pending sessions without date come first
        if (a.status === 'pending' && !a.scheduledDate && !a.date) return -1
        if (b.status === 'pending' && !b.scheduledDate && !b.date) return 1
        
        const dateA = a.scheduledDate ? new Date(a.scheduledDate) : 
          (a.date && a.time ? new Date(`${a.date}T${a.time}`) : new Date())
        const dateB = b.scheduledDate ? new Date(b.scheduledDate) : 
          (b.date && b.time ? new Date(`${b.date}T${b.time}`) : new Date())
        return dateA.getTime() - dateB.getTime()
      })
    
    // If there are upcoming sessions, return the first one
    if (upcomingSessions.length > 0) {
      return upcomingSessions[0]
    }
    
    // If no upcoming sessions, return the most recent scheduled session
    const recentSessions = sessions
      .filter(session => session.status === 'scheduled')
      .sort((a, b) => {
        const dateA = a.scheduledDate ? new Date(a.scheduledDate) : 
          (a.date && a.time ? new Date(`${a.date}T${a.time}`) : new Date(0))
        const dateB = b.scheduledDate ? new Date(b.scheduledDate) : 
          (b.date && b.time ? new Date(`${b.date}T${b.time}`) : new Date(0))
        return dateB.getTime() - dateA.getTime() // Most recent first
      })
    
    return recentSessions[0] || null
  }

  // Get upcoming sessions (excluding next one)
  const getUpcomingSessions = () => {
    const now = new Date()
    const nextSession = getNextSession()
    return sessions
      .filter(session => {
        if (session.status !== 'scheduled' && session.status !== 'pending') return false
        
        // For pending sessions without date, consider them upcoming
        if (session.status === 'pending' && !session.scheduledDate && !session.date) return true
        
        // For sessions with date, check if they're in the future
        const sessionDate = session.scheduledDate ? new Date(session.scheduledDate) : 
          (session.date && session.time ? new Date(`${session.date}T${session.time}`) : null)
        return sessionDate && sessionDate > now
      })
      .filter(session => session._id !== nextSession?._id) // Exclude next session
      .sort((a, b) => {
        // Pending sessions without date come first
        if (a.status === 'pending' && !a.scheduledDate && !a.date) return -1
        if (b.status === 'pending' && !b.scheduledDate && !b.date) return 1
        
        const dateA = a.scheduledDate ? new Date(a.scheduledDate) : 
          (a.date && a.time ? new Date(`${a.date}T${a.time}`) : new Date())
        const dateB = b.scheduledDate ? new Date(b.scheduledDate) : 
          (b.date && b.time ? new Date(`${b.date}T${b.time}`) : new Date())
        return dateA.getTime() - dateB.getTime()
      })
      .slice(0, 3) // Get next 3
  }

  // Format session date
  const formatSessionDate = (session: Session) => {
    const sessionDate = session.scheduledDate ? new Date(session.scheduledDate) : 
      (session.date && session.time ? new Date(`${session.date}T${session.time}`) : null)
    
    if (!sessionDate) return 'Not scheduled'
    
    return sessionDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get session icon based on type
  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'DSA': return <Code className="w-5 h-5 text-blue-600" />
      case 'Data Science': return <Database className="w-5 h-5 text-green-600" />
      case 'Analytics': return <BarChart3 className="w-5 h-5 text-purple-600" />
      case 'System Design': return <Code className="w-5 h-5 text-orange-600" />
      case 'Behavioral': return <User className="w-5 h-5 text-pink-600" />
      default: return <Calendar className="w-5 h-5 text-gray-600" />
    }
  }

  // Load sessions on component mount
  // Fetch subscription info
  const fetchSubscription = async () => {
    try {
      const response = await fetch(getApiUrl('api/subscriptions/my'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      
      if (data.success && data.data) {
        setSubscription(data.data.subscription)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    }
  }

  useEffect(() => {
    fetchSessions()
    fetchSubscription()
    
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchSessions()
      fetchSubscription()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const handleBookNewSession = () => {
    navigate('/book')
  }

  const handleViewProgress = () => {
    navigate('/progress')
  }

  const handleCompanySheetsDSA = () => {
    navigate('/company-sheets-dsa')
  }

  const handleCompanySheetsFrontend = () => {
    navigate('/company-sheets-frontend')
  }


  const handleJoinSession = (session: Session) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank')
    } else {
      console.log('No meeting link available for this session')
    }
  }

  const nextSession = getNextSession()
  const upcomingSessions = getUpcomingSessions()

  const resources = [
    {
      title: 'Frontend Companywise Sheets',
      description: 'Company-focused UI, performance, and architecture interview guides.',
      icon: <Code className="w-5 h-5 text-purple-600" />,
      actionLabel: 'Open Sheets',
      onClick: handleCompanySheetsFrontend
    },
    {
      title: 'DSA Company Sheets',
      description: 'Company-aligned DSA patterns and must-solve problems with explanations.',
      icon: <Layers className="w-5 h-5 text-indigo-600" />,
      actionLabel: 'Open Sheets',
      onClick: handleCompanySheetsDSA
    },
    {
      title: 'Data Science Sheets',
      description: 'ML algorithms & case studies',
      icon: <Database className="w-5 h-5 text-green-600" />,
      downloadUrl: '#'
    },
    {
      title: 'Analytics Worksheets',
      description: 'SQL queries & business cases',
      icon: <BarChart3 className="w-5 h-5 text-purple-600" />,
      downloadUrl: '#'
    }
  ]

  const primaryTextClass = theme === 'dark' ? 'text-slate-100' : 'text-gray-900'
  const secondaryTextClass = theme === 'dark' ? 'text-slate-300' : 'text-gray-600'

  return (
    <div className="candidate-dashboard-bg min-h-screen overflow-hidden">
      <div className="relative z-10 flex flex-col min-h-screen">
      <Header />

        <main className="flex-1">
      {/* Welcome Banner */}
          <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-8 shadow-lg shadow-primary-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-primary-100">
            {loading ? 'Loading your sessions...' : 
             stats.upcoming > 0 ? 
             `Ready for your next mock interview? You have ${stats.upcoming} upcoming session${stats.upcoming > 1 ? 's' : ''}.` :
             'Ready to book your first session?'
            }
          </p>
        </div>
          </section>

      {/* Main Content */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Subscription Info Banner */}
        {subscription && subscription.plan && (
          <div className={`mb-8 rounded-xl p-6 ${
            subscription.isExpired 
              ? 'bg-red-50 border-2 border-red-200' 
              : subscription.remaining > 0 
                ? 'bg-green-50 border-2 border-green-200' 
                : 'bg-yellow-50 border-2 border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  subscription.isExpired 
                    ? 'bg-red-100' 
                    : subscription.remaining > 0 
                      ? 'bg-green-100' 
                      : 'bg-yellow-100'
                }`}>
                  <Trophy className={`w-6 h-6 ${
                    subscription.isExpired 
                      ? 'text-red-600' 
                      : subscription.remaining > 0 
                        ? 'text-green-600' 
                        : 'text-yellow-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
                  </h3>
                  <p className="text-sm text-gray-600">
                    {subscription.isExpired 
                      ? 'Subscription Expired' 
                      : `${subscription.remaining} of ${subscription.limit} interviews remaining`
                    }
                  </p>
                  {subscription.expiresAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Expires: {new Date(subscription.expiresAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              {subscription.remaining === 0 && !subscription.isExpired && (
                <button 
                  onClick={() => navigate('/')}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  Upgrade Plan
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.completed}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.upcoming}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : (stats.averageRating > 0 ? stats.averageRating : 'N/A')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.total}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Session */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {(() => {
                  const session = getNextSession()
                  if (!session) return "Next Session"
                  const sessionDate = session.scheduledDate ? new Date(session.scheduledDate) : 
                    (session.date && session.time ? new Date(`${session.date}T${session.time}`) : null)
                  const now = new Date()
                  return sessionDate && sessionDate > now ? "Next Session" : "Recent Session"
                })()}
              </h2>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : nextSession ? (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-3" />
                      <span>{formatSessionDate(nextSession)}</span>
                      {(() => {
                        const sessionDate = nextSession.scheduledDate ? new Date(nextSession.scheduledDate) : 
                          (nextSession.date && nextSession.time ? new Date(`${nextSession.date}T${nextSession.time}`) : null)
                        const now = new Date()
                        return sessionDate && sessionDate < now ? (
                          <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            Past Due
                          </span>
                        ) : null
                      })()}
                    </div>
                    <div className="flex items-center text-gray-600">
                      {getSessionIcon(nextSession.type)}
                      <span className="ml-3">{nextSession.type} Session</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User className="w-5 h-5 mr-3" />
                      <span>Mentor: {(nextSession.mentor || nextSession.assignedMentor)?.name || 'TBD'}</span>
                    </div>
                    {(nextSession.mentor || nextSession.assignedMentor)?.company && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <span className="ml-8">{(nextSession.mentor || nextSession.assignedMentor)?.company}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-3 mt-6">
                    {(() => {
                      const sessionDate = nextSession.scheduledDate ? new Date(nextSession.scheduledDate) : 
                        (nextSession.date && nextSession.time ? new Date(`${nextSession.date}T${nextSession.time}`) : null)
                      const now = new Date()
                      const isPastDue = sessionDate && sessionDate < now
                      
                      if (isPastDue) {
                        return (
                          <>
                            {nextSession.meetingLink && !nextSession.meetingLink.includes('meet.google.com/new') ? (
                              <button 
                                onClick={() => handleJoinSession(nextSession)}
                                className="btn-primary flex items-center"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Session
                              </button>
                            ) : (
                              <button className="btn-primary" disabled>
                                Session Details
                              </button>
                            )}
                            <button className="btn-secondary">Book New Session</button>
                          </>
                        )
                      } else {
                        return (
                          <>
                            {nextSession.meetingLink && !nextSession.meetingLink.includes('meet.google.com/new') ? (
                              <button 
                                onClick={() => handleJoinSession(nextSession)}
                                className="btn-primary flex items-center"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Join Session
                              </button>
                            ) : nextSession.meetingLink && nextSession.meetingLink.includes('meet.google.com/new') ? (
                              <button className="btn-primary bg-orange-600 hover:bg-orange-700" disabled>
                                Mentor will share link
                              </button>
                            ) : (
                              <button className="btn-primary" disabled>
                                Meeting Link Pending
                              </button>
                            )}
                            <button className="btn-secondary">Reschedule</button>
                          </>
                        )
                      }
                    })()}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
                  <p className="text-gray-600 mb-4">Book your first session to get started!</p>
                  <div className="space-y-2">
                    <button 
                      onClick={handleBookNewSession}
                      className="btn-primary"
                    >
                      Book New Session
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(getApiUrl('api/sessions/test-create-candidate'), {
                            method: 'POST',
                            headers: {
                              'Authorization': `Bearer ${localStorage.getItem('token')}`,
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ type: 'DSA' })
                          })
                          const data = await response.json()
                          if (data.success) {
                            await fetchSessions() // Refresh sessions
                            console.log('Test session created for candidate!')
                          }
                        } catch (error) {
                          console.error('Error creating test session:', error)
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Create Test Session (Dev Only)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Feedback */}
            {(() => {
              const completedSessionsWithFeedback = sessions
                .filter(s => s.status === 'completed' && s.feedback)
                .sort((a, b) => {
                  const dateA = new Date(a.feedback?.createdAt || 0).getTime()
                  const dateB = new Date(b.feedback?.createdAt || 0).getTime()
                  return dateB - dateA // Most recent first
                })
                .slice(0, 3) // Show last 3 feedbacks

              return completedSessionsWithFeedback.length > 0 ? (
                <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Feedback</h2>
                  <div className="space-y-4">
                    {completedSessionsWithFeedback.map((session) => {
                      const feedbackDate = new Date(session.feedback?.createdAt || '')
                      const now = new Date()
                      const daysDiff = Math.floor((now.getTime() - feedbackDate.getTime()) / (1000 * 60 * 60 * 24))
                      const timeAgo = daysDiff === 0 ? 'Today' : daysDiff === 1 ? 'Yesterday' : `${daysDiff} days ago`

                      // Calculate average score
                      const avgScore = session.feedback ? 
                        ((session.feedback.communication || 0) + (session.feedback.problemSolving || 0) + (session.feedback.codeQuality || 0)) / 3 : 0

                      const feedbackSurface =
                        theme === 'dark'
                          ? 'bg-slate-900/80 border border-white/10 text-slate-100'
                          : 'bg-gradient-to-r from-blue-50 to-primary-50 border border-blue-200 text-gray-900'

                      const metricLabelColor = theme === 'dark' ? 'text-slate-300' : 'text-gray-600'

                      return (
                        <div key={session._id} className={`p-4 rounded-lg shadow-sm ${feedbackSurface}`}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                {getSessionIcon(session.type)}
                                <span className={`font-semibold ${primaryTextClass}`}>{session.type} Session</span>
                              </div>
                              <p className={`text-sm ${secondaryTextClass}`}>{timeAgo}</p>
                            </div>
                            <div className={`flex items-center space-x-1 ${primaryTextClass}`}>
                              <Star className="w-5 h-5 text-yellow-500 fill-current" />
                              <span className="text-lg font-bold">{avgScore.toFixed(1)}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3 mb-3">
                            <div className="text-center">
                              <p className={`text-xs mb-1 ${metricLabelColor}`}>Communication</p>
                              <p className="text-lg font-semibold text-primary-600">{session.feedback?.communication || 0}/10</p>
                            </div>
                            <div className="text-center">
                              <p className={`text-xs mb-1 ${metricLabelColor}`}>Problem Solving</p>
                              <p className="text-lg font-semibold text-green-600">{session.feedback?.problemSolving || 0}/10</p>
                            </div>
                            <div className="text-center">
                              <p className={`text-xs mb-1 ${metricLabelColor}`}>Code Quality</p>
                              <p className="text-lg font-semibold text-purple-600">{session.feedback?.codeQuality || 0}/10</p>
                            </div>
                          </div>
                          {session.feedback?.domain && (
                            <div className="mb-2">
                              <p className={`text-xs mb-1 ${metricLabelColor}`}>Strong in:</p>
                              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                                {session.feedback.domain}
                              </span>
                            </div>
                          )}
                          {session.feedback?.comments && (
                            <div className={`mt-2 pt-2 border-t ${theme === 'dark' ? 'border-white/10' : 'border-blue-200'}`}>
                              <p className={`text-sm ${secondaryTextClass}`}>{session.feedback.comments}</p>
                            </div>
                          )}
                          {session.feedback?.codeSnippet && (
                            <div className={`mt-4 rounded-lg p-4 border ${theme === 'dark' ? 'bg-slate-950/80 border-white/10' : 'bg-gray-900 text-gray-100 border-gray-800'}`}>
                              <div className={`flex items-center justify-between text-xs mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-400'}`}>
                                <span>Interview Code Snippet</span>
                                {session.feedback.codeLanguage && (
                                  <span className="px-2 py-1 bg-gray-800 rounded-full text-[10px] uppercase tracking-wide">
                                    {session.feedback.codeLanguage}
                                  </span>
                                )}
                              </div>
                              <pre className="text-sm leading-relaxed whitespace-pre-wrap font-mono">
                                {session.feedback.codeSnippet}
                              </pre>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : null
            })()}

            {/* Upcoming Sessions */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
                {upcomingSessions.length > 0 && (
                  <a href="#" className="text-primary-600 hover:text-primary-700 text-sm font-medium">View all</a>
                )}
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getSessionIcon(session.type)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">{session.type} Session</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              session.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {session.status === 'scheduled' ? 'Confirmed' : session.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{formatSessionDate(session)}</p>
                          <p className="text-sm text-gray-600">Mentor: {(session.mentor || session.assignedMentor)?.name || 'TBD'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {session.status === 'scheduled' && session.meetingLink && !session.meetingLink.includes('meet.google.com/new') && (
                          <button 
                            onClick={() => handleJoinSession(session)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
                            title="Join Session"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Join Meeting</span>
                          </button>
                        )}
                        {session.status === 'scheduled' && session.meetingLink && session.meetingLink.includes('meet.google.com/new') && (
                          <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded">
                            Mentor will share meeting link
                          </span>
                        )}
                        {session.status === 'scheduled' && !session.meetingLink && (
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Meeting link coming soon
                          </span>
                        )}
                        {session.status === 'pending' && (
                          <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                            Awaiting approval
                          </span>
                        )}
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
                  <p className="text-gray-600 mb-4">Book more sessions to see them here.</p>
                  <button 
                    onClick={handleBookNewSession}
                    className="btn-primary"
                  >
                    Book New Session
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button 
                  onClick={handleBookNewSession}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Book New Session
                </button>
                <button 
                  onClick={handleViewProgress}
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Progress
                </button>
                <button 
                  onClick={() => navigate('/leaderboard')}
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  View Leaderboard
                </button>
              </div>
            </div>

            {/* Paid Sections - Moved below Quick Actions */}
            <div className="card border-2 border-primary-200 bg-primary-50/50">
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-primary-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Paid Sections</h2>
              </div>
              <div className="space-y-3">
                <div className="bg-white dark:bg-slate-950/40 border border-primary-200 dark:border-white/10 rounded-xl px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-3 text-primary-600" />
                      <span className="font-medium text-gray-900 dark:text-slate-100">Explore Frontend Resources</span>
                    </div>
                    <span className="text-sm font-semibold text-primary-600">₹1,799</span>
                  </div>
                  <button
                    onClick={() => navigate('/frontend-resources')}
                    className="w-full mt-3 btn-outline flex items-center justify-center"
                  >
                    <ChevronRight className="w-4 h-4 mr-2" />
                    View Resource Library
                  </button>
                </div>
              </div>
            </div>

            {/* Free Resources */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Free Resources</h2>
              <div className="space-y-4">
                {resources.map((resource, index) => {
                  const resourceSurface =
                    theme === 'dark'
                      ? 'bg-slate-900/70 border border-white/10'
                      : 'bg-gray-50 border border-gray-200'

                  return (
                    <div key={index} className={`p-4 rounded-lg ${resourceSurface}`}>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">{resource.icon}</div>
                        <div className="flex-1">
                          <h3 className={`font-medium mb-1 ${primaryTextClass}`}>{resource.title}</h3>
                          <p className={`text-sm mb-2 ${secondaryTextClass}`}>{resource.description}</p>
                          {resource.onClick ? (
                            <button
                              onClick={resource.onClick}
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                            >
                              <ChevronRight className="w-4 h-4 mr-1" />
                              {resource.actionLabel || 'Open'}
                            </button>
                          ) : resource.downloadUrl ? (
                            <a 
                              href={resource.downloadUrl} 
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                            >
                              <ChevronRight className="w-4 h-4 mr-1" />
                              Coming Soon
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        </section>
        </main>

      {/* Floating Help Button */}
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-secondary-600 text-white rounded-full shadow-lg hover:bg-secondary-700 transition-colors duration-200 flex items-center justify-center z-20">
        <HelpCircle className="w-6 h-6" />
      </button>
      
      <Footer />
      </div>
    </div>
  )
}

export default CandidateDashboard 