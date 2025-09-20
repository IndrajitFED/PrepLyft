import React, { useState } from 'react'
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Phone, 
  PhoneOff, 
  MessageSquare, 
  Share, 
  MoreVertical,
  Clock,
  User,
  Star,
  Send,
  Paperclip,
  Smile
} from 'lucide-react'

const SessionPage: React.FC = () => {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCallActive, setIsCallActive] = useState(true)
  const [chatMessage, setChatMessage] = useState('')
  const [showChat, setShowChat] = useState(false)

  const sessionData = {
    id: '12345',
    type: 'DSA Mock Interview',
    mentor: 'Sarah Chen',
    company: 'Google',
    duration: '60 min',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    date: 'January 25, 2024'
  }

  const chatMessages = [
    {
      id: 1,
      sender: 'mentor',
      message: 'Hi Alex! Ready to start the DSA interview?',
      time: '10:00 AM'
    },
    {
      id: 2,
      sender: 'candidate',
      message: 'Yes, I\'m ready!',
      time: '10:01 AM'
    },
    {
      id: 3,
      sender: 'mentor',
      message: 'Great! Let\'s start with a warm-up question. Can you explain what a binary search tree is?',
      time: '10:02 AM'
    }
  ]

  const questions = [
    {
      id: 1,
      title: 'Binary Search Tree Implementation',
      difficulty: 'Medium',
      category: 'Trees',
      status: 'current'
    },
    {
      id: 2,
      title: 'Two Sum Problem',
      difficulty: 'Easy',
      category: 'Arrays',
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'LRU Cache Design',
      difficulty: 'Hard',
      category: 'Design',
      status: 'upcoming'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5 text-red-500" />
                <span className="text-white font-medium">LIVE</span>
              </div>
              <div className="text-white">
                <h1 className="font-medium">{sessionData.type}</h1>
                <p className="text-sm text-gray-300">with {sessionData.mentor} • {sessionData.company}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-white text-sm">
                <Clock className="w-4 h-4 inline mr-1" />
                {sessionData.startTime} - {sessionData.endTime}
              </div>
              <button className="text-gray-300 hover:text-white">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Display */}
          <div className="flex-1 bg-gray-800 relative">
            {/* Main Video (Mentor) */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
                <p className="text-lg font-medium">{sessionData.mentor}</p>
                <p className="text-gray-400">{sessionData.company}</p>
                <p className="text-sm text-gray-500 mt-2">Your video is off</p>
              </div>
            </div>

            {/* Self Video (Small) */}
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg border-2 border-gray-600">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm">You</p>
                </div>
              </div>
            </div>

            {/* Session Timer */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              <Clock className="w-4 h-4 inline mr-1" />
              00:15:32
            </div>

            {/* Question Display */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg max-w-md">
              <h3 className="font-medium mb-2">Current Question</h3>
              <p className="text-sm text-gray-300">Implement a Binary Search Tree with insert, search, and delete operations.</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="px-2 py-1 bg-yellow-600 text-xs rounded">Medium</span>
                <span className="px-2 py-1 bg-blue-600 text-xs rounded">Trees</span>
              </div>
            </div>
          </div>

          {/* Control Bar */}
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-full ${
                  isMicOn ? 'bg-gray-600 text-white' : 'bg-red-600 text-white'
                } hover:opacity-80 transition-opacity`}
              >
                {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-full ${
                  isVideoOn ? 'bg-gray-600 text-white' : 'bg-red-600 text-white'
                } hover:opacity-80 transition-opacity`}
              >
                {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </button>

              <button
                onClick={() => setIsCallActive(!isCallActive)}
                className={`p-4 rounded-full ${
                  isCallActive ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                } hover:opacity-80 transition-opacity`}
              >
                {isCallActive ? <PhoneOff className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
              </button>

              <button
                onClick={() => setShowChat(!showChat)}
                className={`p-3 rounded-full ${
                  showChat ? 'bg-primary-600 text-white' : 'bg-gray-600 text-white'
                } hover:opacity-80 transition-opacity`}
              >
                <MessageSquare className="w-6 h-6" />
              </button>

              <button className="p-3 rounded-full bg-gray-600 text-white hover:opacity-80 transition-opacity">
                <Share className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className={`w-80 bg-gray-800 border-l border-gray-700 transition-all duration-300 ${
          showChat ? 'block' : 'hidden'
        }`}>
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-medium">Session Chat</h3>
            <p className="text-sm text-gray-400">Real-time communication</p>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 space-y-4 max-h-96 overflow-y-auto">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'candidate' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    msg.sender === 'candidate'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-white">
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="text-gray-400 hover:text-white">
                <Smile className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (chatMessage.trim()) {
                    // Handle send message
                    setChatMessage('')
                  }
                }}
                className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Panel (Overlay) */}
      <div className="fixed top-20 right-4 w-80 bg-white rounded-lg shadow-xl border">
        <div className="p-4 border-b">
          <h3 className="font-medium text-gray-900">Interview Questions</h3>
          <p className="text-sm text-gray-600">Progress through the session</p>
        </div>
        
        <div className="p-4 space-y-3">
          {questions.map((question) => (
            <div
              key={question.id}
              className={`p-3 rounded-lg border-2 ${
                question.status === 'current'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{question.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {question.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {question.category}
                    </span>
                  </div>
                </div>
                {question.status === 'current' && (
                  <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Info Panel (Overlay) */}
      <div className="fixed top-20 left-4 w-80 bg-white rounded-lg shadow-xl border">
        <div className="p-4 border-b">
          <h3 className="font-medium text-gray-900">Session Information</h3>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{sessionData.mentor}</p>
              <p className="text-sm text-gray-600">{sessionData.company}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium">{sessionData.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{sessionData.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{sessionData.date}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">4.9/5.0</span>
              <span className="text-sm text-gray-600">(156 sessions)</span>
            </div>
            <p className="text-sm text-gray-600">Expert in DSA and System Design</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionPage
