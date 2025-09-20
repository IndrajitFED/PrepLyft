import React from 'react'
import { X, User, Calendar, Clock, Code, Mail, CheckCircle, XCircle } from 'lucide-react'

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
  meetingLink?: string
  googleEventId?: string
  autoAssigned?: boolean
  bookingStatus?: string
  createdAt: string
  updatedAt: string
}

interface SessionModalProps {
  session: Session | null
  isOpen: boolean
  onClose: () => void
  onApprove: (sessionId: string) => void
  onCancel: (sessionId: string) => void
  loading?: boolean
}

const SessionModal: React.FC<SessionModalProps> = ({
  session,
  isOpen,
  onClose,
  onApprove,
  onCancel,
  loading = false
}) => {
  if (!isOpen || !session) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getBookingStatusColor = (bookingStatus: string) => {
    switch (bookingStatus) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending_assignment':
        return 'bg-yellow-100 text-yellow-800'
      case 'assigned':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const canApprove = session.status === 'pending' || session.bookingStatus === 'pending_assignment'
  const canCancel = session.status === 'scheduled' || session.status === 'pending'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Session Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Session Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Type:</span>
                <span className="text-gray-700">{session.type}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Date:</span>
                <span className="text-gray-700">
                  {session.scheduledDate 
                    ? formatDate(session.scheduledDate)
                    : session.date 
                    ? formatDate(session.date)
                    : 'Not scheduled'
                  }
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Time:</span>
                <span className="text-gray-700">
                  {session.time ? formatTime(session.time) : 'Not specified'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="font-medium">Duration:</span>
                <span className="text-gray-700">{session.duration} minutes</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="font-medium">Price:</span>
                <span className="text-gray-700">₹{session.price}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                  {session.status}
                </span>
              </div>
              
              {session.bookingStatus && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Booking:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBookingStatusColor(session.bookingStatus)}`}>
                    {session.bookingStatus.replace('_', ' ')}
                  </span>
                </div>
              )}
              
              {session.autoAssigned && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    Auto Assigned
                  </span>
                </div>
              )}
              
              {session.meetingLink && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Meeting:</span>
                  <a 
                    href={session.meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Join Meeting
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Candidate Details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Candidate Information
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Name:</span>
                <span className="text-gray-700">{session.candidate.name}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Email:</span>
                <span className="text-gray-700">{session.candidate.email}</span>
              </div>
              
              <div className="text-sm text-gray-500">
                Session created: {new Date(session.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {canApprove || canCancel ? (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
              
              <div className="flex space-x-4">
                {canApprove && (
                  <button
                    onClick={() => onApprove(session._id)}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve Session</span>
                  </button>
                )}
                
                {canCancel && (
                  <button
                    onClick={() => onCancel(session._id)}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel Session</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="border-t pt-6">
              <div className="text-center text-gray-500">
                <p>No actions available for this session</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionModal
