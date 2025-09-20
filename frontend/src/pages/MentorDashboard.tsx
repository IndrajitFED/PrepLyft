import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Users, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import Header from '../components/Header'
import SessionModal from '../components/SessionModal'

interface CalendarStatus {
  isConnected: boolean
  calendarId: string
}

interface Session {
  _id: string
  candidate: {
    _id: string
    name: string
    email: string
  }
  type: string
  status: string
  scheduledDate?: string
  date?: string
  time?: string
  duration: number
  price: number
  googleEventId?: string
  meetingLink?: string
  autoAssigned?: boolean
  bookingStatus?: string
  createdAt: string
  updatedAt: string
}

const MentorDashboard: React.FC = () => {
  const [calendarStatus, setCalendarStatus] = useState<CalendarStatus | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const navigate = useNavigate()

  // Fetch calendar status
  const fetchCalendarStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/mentor-calendar/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setCalendarStatus(data.data)
      }
    } catch (error) {
      console.error('Error fetching calendar status:', error)
    }
  }

  // Check for calendar connection status from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const calendarStatus = urlParams.get('calendar')
    
    if (calendarStatus === 'connected') {
      // Refresh calendar status and show success message
      fetchCalendarStatus()
      // You can add a toast notification here
      console.log('Calendar connected successfully!')
    } else if (calendarStatus === 'error') {
      // Show error message
      console.error('Calendar connection failed!')
    }
  }, [])

  // Fetch mentor's sessions
  const fetchSessions = async () => {
    try {
      console.log('Fetching sessions for mentor...')
      const response = await fetch('http://localhost:5000/api/sessions/mentor', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      
      console.log('Sessions API response:', data)
      
      if (data.success) {
        setSessions(data.data.sessions)
        console.log('Sessions loaded:', data.data.sessions)
      } else {
        console.error('Failed to fetch sessions:', data.message)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    }
  }

  // Connect Google Calendar
  const connectCalendar = async () => {
    try {
      setConnecting(true)
      const response = await fetch('http://localhost:5000/api/mentor-calendar/connect', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        // Open Google OAuth in same window (will redirect back after auth)
        window.location.href = data.data.authUrl
      }
    } catch (error) {
      console.error('Error connecting calendar:', error)
      setConnecting(false)
    }
  }

  // Disconnect Google Calendar
  const disconnectCalendar = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/mentor-calendar/disconnect', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setCalendarStatus({ isConnected: false, calendarId: 'primary' })
      }
    } catch (error) {
      console.error('Error disconnecting calendar:', error)
    }
  }


  // Handle session click to open modal
  const handleSessionClick = (session: Session) => {
    setSelectedSession(session)
    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedSession(null)
  }

  // Approve a session
  const handleApproveSession = async (sessionId: string) => {
    setActionLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          date: selectedSession?.date || new Date().toISOString().split('T')[0],
          time: selectedSession?.time || '14:00'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Refresh sessions
        await fetchSessions()
        closeModal()
        alert('Session approved successfully!')
      } else {
        alert('Failed to approve session: ' + data.message)
      }
    } catch (error) {
      console.error('Error approving session:', error)
      alert('Error approving session')
    } finally {
      setActionLoading(false)
    }
  }

  // Cancel a session
  const handleCancelSession = async (sessionId: string) => {
    setActionLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        // Refresh sessions
        await fetchSessions()
        closeModal()
        alert('Session cancelled successfully!')
      } else {
        alert('Failed to cancel session: ' + data.message)
      }
    } catch (error) {
      console.error('Error cancelling session:', error)
      alert('Error cancelling session')
    } finally {
      setActionLoading(false)
    }
  }

  // Approve a pending session (legacy function)
  const approveSession = async (sessionId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
          time: '14:00' // 2 PM
        })
      })
      const data = await response.json()
      
      if (data.success) {
        await fetchSessions()
        console.log('Session approved successfully')
      } else {
        console.error('Failed to approve session:', data.message)
      }
    } catch (error) {
      console.error('Error approving session:', error)
    }
  }

  // Cancel a session
  const cancelSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to cancel this session?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        await fetchSessions()
        console.log('Session cancelled successfully')
      } else {
        console.error('Failed to cancel session:', data.message)
      }
    } catch (error) {
      console.error('Error cancelling session:', error)
    }
  }

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session => {
      // If session has scheduledDate or date, check if it matches the calendar date
      if (session.scheduledDate || session.date) {
        const sessionDate = session.scheduledDate ? new Date(session.scheduledDate) : 
          (session.date ? new Date(session.date) : null)
        
        if (sessionDate) {
          return sessionDate.toDateString() === date.toDateString()
        }
      }
      
      // For pending sessions without scheduledDate, show them on today's date
      if (session.status === 'pending' && !session.scheduledDate && !session.date) {
        const today = new Date()
        return date.toDateString() === today.toDateString()
      }
      
      return false
    })
  }


  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        if (viewMode === 'week') {
          newDate.setDate(newDate.getDate() - 7)
        } else if (viewMode === 'day') {
          newDate.setDate(newDate.getDate() - 1)
        } else {
          newDate.setMonth(newDate.getMonth() - 1)
        }
      } else {
        if (viewMode === 'week') {
          newDate.setDate(newDate.getDate() + 7)
        } else if (viewMode === 'day') {
          newDate.setDate(newDate.getDate() + 1)
        } else {
          newDate.setMonth(newDate.getMonth() + 1)
        }
      }
      return newDate
    })
  }

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    return days
  }

  const getDaySessions = (date: Date) => {
    return getSessionsForDate(date)
  }


  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchCalendarStatus(),
        fetchSessions()
      ])
      setLoading(false)
    }
    
    loadData()
    
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchSessions()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
              <p className="text-gray-600">Manage your sessions and calendar</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Calendar Connection Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Google Calendar</h2>
                <p className="text-gray-600">
                  {calendarStatus?.isConnected 
                    ? `Connected to ${calendarStatus.calendarId}` 
                    : 'Not connected to Google Calendar'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {calendarStatus?.isConnected ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <button
                    onClick={disconnectCalendar}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectCalendar}
                  disabled={connecting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {connecting ? 'Connecting...' : 'Connect Calendar'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Session Calendar</h2>
                <p className="text-gray-600">Manage your sessions in calendar view</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1 rounded text-sm ${viewMode === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1 rounded text-sm ${viewMode === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-1 rounded text-sm ${viewMode === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Day
                </button>
                <button
                  onClick={fetchSessions}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold">
                {viewMode === 'day' 
                  ? currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
                  : viewMode === 'week'
                  ? `Week of ${getWeekDays(currentDate)[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${getWeekDays(currentDate)[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                }
              </h3>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {viewMode === 'month' && (
              <>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 min-h-[400px]">
                  {getDaysInMonth(currentDate).map((day, index) => (
                    <div
                      key={index}
                      className={`border border-gray-200 p-2 min-h-[80px] ${
                        day ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      {day && (
                        <>
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {day.getDate()}
                          </div>
                          <div className="space-y-1">
                            {getSessionsForDate(day).map(session => (
                              <div
                                key={session._id}
                                className={`text-xs p-1 rounded truncate cursor-pointer ${
                                  session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                  session.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }`}
                                title={`${session.type} - ${session.candidate?.name}`}
                                onClick={() => handleSessionClick(session)}
                              >
                                {session.time ? `${session.time} - ` : 'Unscheduled - '}{session.type}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {viewMode === 'week' && (
              <>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 min-h-[400px]">
                  {getWeekDays(currentDate).map((day, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 p-2 min-h-[80px] bg-white"
                    >
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {getSessionsForDate(day).map(session => (
                          <div
                            key={session._id}
                            className={`text-xs p-1 rounded truncate cursor-pointer ${
                              session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              session.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}
                            title={`${session.type} - ${session.candidate?.name}`}
                            onClick={() => handleSessionClick(session)}
                          >
                            {session.time ? `${session.time} - ` : 'Unscheduled - '}{session.type}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {viewMode === 'day' && (
              <div className="min-h-[400px]">
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="text-lg font-medium text-gray-900 mb-4">
                    {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="space-y-3">
                    {getDaySessions(currentDate).map(session => (
                      <div
                        key={session._id}
                        className={`p-3 rounded-lg border ${
                          session.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                          session.status === 'scheduled' ? 'bg-blue-50 border-blue-200' :
                          session.status === 'completed' ? 'bg-green-50 border-green-200' :
                          'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-900">{session.type} Session</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                session.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                session.status === 'scheduled' ? 'bg-blue-200 text-blue-800' :
                                session.status === 'completed' ? 'bg-green-200 text-green-800' :
                                'bg-red-200 text-red-800'
                              }`}>
                                {session.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">Candidate: {session.candidate?.name}</p>
                            <p className="text-sm text-gray-600">Time: {session.time || 'TBD'}</p>
                            <p className="text-sm text-gray-600">Duration: {session.duration} minutes</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {session.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => approveSession(session._id)}
                                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => cancelSession(session._id)}
                                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center space-x-1"
                                >
                                  <XCircle className="w-4 h-4" />
                                  <span>Cancel</span>
                                </button>
                              </>
                            )}
                            {session.status === 'scheduled' && (
                              <button
                                onClick={() => cancelSession(session._id)}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center space-x-1"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>Cancel</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {getDaySessions(currentDate).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No sessions scheduled for this day
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pending Sessions */}
        {sessions.filter(s => s.status === 'pending').length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Pending Approval</h2>
              <p className="text-gray-600">Sessions waiting for your approval</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {sessions.filter(s => s.status === 'pending').map((session) => (
                  <div key={session._id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">
                            {session.type} Session
                          </h3>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-200 text-yellow-800">
                            Pending
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Candidate:</strong> {session.candidate?.name} ({session.candidate?.email})</p>
                          <p><strong>Duration:</strong> {session.duration} minutes</p>
                          <p><strong>Price:</strong> ₹{session.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => approveSession(session._id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => cancelSession(session._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center space-x-2"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Test Session Creation */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Development Tools</h2>
            <p className="text-gray-600">Create test sessions for development</p>
          </div>
          
          <div className="p-6 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Create Test Session</h3>
            <p className="text-gray-600 mb-4">For development and testing purposes</p>
            <button
              onClick={async () => {
                try {
                  const response = await fetch('http://localhost:5000/api/sessions/test-create', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ type: 'DSA' })
                  })
                  const data = await response.json()
                  if (data.success) {
                    await fetchSessions()
                    console.log('Test session created!')
                  }
                } catch (error) {
                  console.error('Error creating test session:', error)
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Create Test Session (Dev Only)
            </button>
          </div>
        </div>
      </div>

      {/* Session Modal */}
      <SessionModal
        session={selectedSession}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApprove={handleApproveSession}
        onCancel={handleCancelSession}
        loading={actionLoading}
      />
    </div>
  )
}

export default MentorDashboard