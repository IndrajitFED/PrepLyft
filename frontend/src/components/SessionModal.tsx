import React, { useEffect, useMemo, useState } from 'react'
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
  feedback?: {
    communication: number
    problemSolving: number
    codeQuality: number
    domain: string
    comments?: string
    codeSnippet?: string
    codeLanguage?: string
    mentor?: string
    createdAt?: string
  }
  createdAt: string
  updatedAt: string
}

interface FeedbackFormValues {
  communication: number
  problemSolving: number
  codeQuality: number
  domain: string
  comments?: string
  codeSnippet?: string
  codeLanguage?: string
}

interface SessionModalProps {
  session: Session | null
  isOpen: boolean
  onClose: () => void
  onApprove: (sessionId: string) => void
  onCancel: (sessionId: string) => void
  loading?: boolean
  feedbackLoading?: boolean
  onSubmitFeedback?: (sessionId: string, feedback: FeedbackFormValues) => void
}

const SessionModal: React.FC<SessionModalProps> = ({
  session,
  isOpen,
  onClose,
  onApprove,
  onCancel,
  loading = false,
  feedbackLoading = false,
  onSubmitFeedback
}) => {
  if (!isOpen || !session) return null

  const initialFeedbackValues: FeedbackFormValues = useMemo(() => ({
    communication: session.feedback?.communication || 7,
    problemSolving: session.feedback?.problemSolving || 7,
    codeQuality: session.feedback?.codeQuality || 7,
    domain: session.feedback?.domain || '',
    comments: session.feedback?.comments || '',
    codeSnippet: session.feedback?.codeSnippet || '',
    codeLanguage: session.feedback?.codeLanguage || 'JavaScript'
  }), [session])

  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [feedbackForm, setFeedbackForm] = useState<FeedbackFormValues>(initialFeedbackValues)

  useEffect(() => {
    setShowFeedbackForm(false)
    setFeedbackForm(initialFeedbackValues)
  }, [initialFeedbackValues, isOpen])

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
  const canSubmitFeedback = ['scheduled', 'in-progress', 'completed'].includes(session.status) && !!onSubmitFeedback

  const handleFeedbackChange = (field: keyof FeedbackFormValues, value: string | number) => {
    setFeedbackForm(prev => ({
      ...prev,
      [field]: typeof value === 'string' && ['communication', 'problemSolving', 'codeQuality'].includes(field)
        ? Number(value)
        : value
    }))
  }

  const handleFeedbackSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!onSubmitFeedback || !session) return

    if (!feedbackForm.domain || !feedbackForm.domain.trim()) {
      alert('Please specify the domain the candidate excelled at.')
      return
    }

    onSubmitFeedback(session._id, {
      ...feedbackForm,
      communication: Number(feedbackForm.communication),
      problemSolving: Number(feedbackForm.problemSolving),
      codeQuality: Number(feedbackForm.codeQuality),
      domain: feedbackForm.domain.trim(),
      comments: feedbackForm.comments?.trim(),
      codeSnippet: feedbackForm.codeSnippet?.trim(),
      codeLanguage: feedbackForm.codeLanguage?.trim()
    })
  }

  const codeLanguages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'Other']

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

          {/* Existing Feedback */}
          {session.feedback && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Feedback Submitted</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Communication</p>
                  <p className="text-2xl font-semibold text-blue-600">{session.feedback.communication}/10</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Problem Solving</p>
                  <p className="text-2xl font-semibold text-green-600">{session.feedback.problemSolving}/10</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Code Quality</p>
                  <p className="text-2xl font-semibold text-purple-600">{session.feedback.codeQuality}/10</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-xs text-blue-600 uppercase tracking-wide mb-2">Strength Domain</p>
                <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold">
                  {session.feedback.domain}
                </span>
              </div>
              {session.feedback.comments && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Mentor Comments</p>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{session.feedback.comments}</p>
                </div>
              )}
              {session.feedback.codeSnippet && (
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-auto border border-gray-800">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>Candidate Code Snippet</span>
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
          )}

          {/* Feedback Form */}
          {canSubmitFeedback && (
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {session.feedback ? 'Update Feedback' : 'Submit Feedback'}
                </h3>
                <button
                  onClick={() => setShowFeedbackForm(prev => !prev)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {showFeedbackForm ? 'Hide Form' : session.feedback ? 'Edit Feedback' : 'Add Feedback'}
                </button>
              </div>

              {showFeedbackForm && (
                <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Communication</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={feedbackForm.communication}
                        onChange={(e) => handleFeedbackChange('communication', Number(e.target.value))}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Problem Solving</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={feedbackForm.problemSolving}
                        onChange={(e) => handleFeedbackChange('problemSolving', Number(e.target.value))}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Code Quality</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={feedbackForm.codeQuality}
                        onChange={(e) => handleFeedbackChange('codeQuality', Number(e.target.value))}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Candidate excels in</label>
                    <input
                      type="text"
                      value={feedbackForm.domain}
                      onChange={(e) => handleFeedbackChange('domain', e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Dynamic Programming, System Design"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Detailed Comments (optional)</label>
                    <textarea
                      value={feedbackForm.comments}
                      onChange={(e) => handleFeedbackChange('comments', e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Share actionable feedback and tips for improvement..."
                    />
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Candidate Code Snippet (optional)
                      </label>
                      <select
                        value={feedbackForm.codeLanguage}
                        onChange={(e) => handleFeedbackChange('codeLanguage', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {codeLanguages.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      value={feedbackForm.codeSnippet}
                      onChange={(e) => handleFeedbackChange('codeSnippet', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={8}
                      placeholder="// Paste the candidate's solution or important snippets here"
                    />
                    <p className="text-xs text-gray-500">
                      This helps the candidate review their solution along with your comments.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowFeedbackForm(false)
                        setFeedbackForm(initialFeedbackValues)
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      disabled={feedbackLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={feedbackLoading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {feedbackLoading ? 'Submitting...' : session.feedback ? 'Update Feedback' : 'Submit Feedback'}
                    </button>
                  </div>
                </form>
              )}
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
