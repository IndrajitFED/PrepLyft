import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Search, 
  TrendingUp,
  Clock,
  Target,
  BookOpen
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { frontendTopicSheets, FrontendTopicSheet } from '../data/frontendCompanyQuestions'

const FrontendSheets: React.FC = () => {
  const { topicId } = useParams<{ topicId?: string }>()
  const navigate = useNavigate()
  const [selectedTopic, setSelectedTopic] = useState<FrontendTopicSheet | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [interviewTypeFilter, setInterviewTypeFilter] = useState<string>('All')
  const [progress, setProgress] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('frontend-sheets-progress')
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    }
  }, [])

  // Set selected company based on URL parameter
  useEffect(() => {
    setIsLoading(true)
    
    // Small delay to prevent flash
    const timer = setTimeout(() => {
      if (topicId) {
        const topic = frontendTopicSheets.find(t => t.id === topicId)
        if (topic) {
          setSelectedTopic(topic)
        } else {
          // If topic not found, redirect to main page
          navigate('/company-sheets-frontend', { replace: true })
        }
      } else {
        setSelectedTopic(null)
      }
      setIsLoading(false)
    }, 50)

    return () => clearTimeout(timer)
  }, [topicId, navigate])


  // Navigate to question solution
  const navigateToQuestion = useCallback((questionId: string) => {
    navigate(`/company-sheets-frontend/${topicId}/${questionId}`)
  }, [navigate, topicId])

  // Navigate back to company list
  const navigateBack = useCallback(() => {
    navigate('/company-sheets-frontend')
  }, [navigate])

  // Filter questions based on search, difficulty, category, and interview type
  const filteredQuestions = useMemo(() => {
    if (!selectedTopic) return []
    
    return selectedTopic.questions.filter(question => {
      const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           question.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           question.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           question.companies.some(company => company.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesDifficulty = difficultyFilter === 'All' || question.difficulty === difficultyFilter
      const matchesCategory = categoryFilter === 'All' || question.category === categoryFilter
      const matchesInterviewType = interviewTypeFilter === 'All' || question.interviewType === interviewTypeFilter
      return matchesSearch && matchesDifficulty && matchesCategory && matchesInterviewType
    })
  }, [selectedTopic, searchTerm, difficultyFilter, categoryFilter, interviewTypeFilter])

  // Calculate completion percentage
  const getCompletionPercentage = (topic: FrontendTopicSheet) => {
    const completedCount = topic.questions.filter(q => progress[q.id]).length
    return Math.round((completedCount / topic.questions.length) * 100)
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'JavaScript': 'bg-yellow-100 text-yellow-800',
      'Machine Coding': 'bg-green-100 text-green-800',
      'React': 'bg-blue-100 text-blue-800',
      'System Design': 'bg-purple-100 text-purple-800',
      'Security': 'bg-red-100 text-red-800',
      'CSS': 'bg-teal-100 text-teal-800',
      'Performance': 'bg-orange-100 text-orange-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  // Get interview type color
  const getInterviewTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Technical': 'bg-blue-100 text-blue-800',
      'Machine Coding': 'bg-green-100 text-green-800',
      'System Design': 'bg-purple-100 text-purple-800',
      'Behavioral': 'bg-pink-100 text-pink-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  if (selectedTopic) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Header />
        
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={navigateBack}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Topics
                </button>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{selectedTopic.logo}</span>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{selectedTopic.name}</h1>
                    <p className="text-gray-600">{selectedTopic.description}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {selectedTopic.questions.filter(q => progress[q.id]).length} of {selectedTopic.questions.length} completed
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getCompletionPercentage(selectedTopic)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Categories</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Machine Coding">Machine Coding</option>
                <option value="React">React</option>
                <option value="System Design">System Design</option>
                <option value="Security">Security</option>
              </select>
              <select
                value={interviewTypeFilter}
                onChange={(e) => setInterviewTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Interview Types</option>
                <option value="Technical">Technical</option>
                <option value="Machine Coding">Machine Coding</option>
                <option value="System Design">System Design</option>
                <option value="Behavioral">Behavioral</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            {filteredQuestions.map((question) => {
              const isCompleted = progress[question.id] || false
              
              return (
                <div
                  key={question.id}
                  className={`bg-white rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                    isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => navigateToQuestion(question.id)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {question.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {question.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                              {question.difficulty}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(question.category)}`}>
                              {question.category}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInterviewTypeColor(question.interviewType)}`}>
                              {question.interviewType}
                            </span>
                            <div className="flex items-center text-sm text-gray-500">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              {question.frequency}% frequency
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-500">
                          {question.hints?.length || 0} hints
                        </div>
                        <div className="text-sm text-gray-500">
                          {question.resources?.length || 0} resources
                        </div>
                        <BookOpen className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Topic-Wise Frontend Sheets</h1>
            <p className="text-xl text-purple-100 mb-8">
              Master frontend interviews with curated challenges organized by topic
            </p>
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-3xl font-bold">300+</div>
                <div className="text-purple-100">Frontend Problems</div>
              </div>
              <div>
                <div className="text-3xl font-bold">5+</div>
                <div className="text-purple-100">Topics</div>
              </div>
              <div>
                <div className="text-3xl font-bold">95%</div>
                <div className="text-purple-100">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Sheets Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Topic</h2>
          <p className="text-gray-600">Select a topic to start your frontend interview preparation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {frontendTopicSheets.map((topic) => {
            const completionPercentage = getCompletionPercentage(topic)
            return (
              <div
                key={topic.id}
                onClick={() => navigate(`/company-sheets-frontend/${topic.id}`)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-gray-300"
              >
                {/* Progress Bar */}
                <div className="relative">
                  <div className="h-2 bg-gray-200 rounded-t-xl">
                    <div 
                      className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-xl transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <div className="absolute top-2 right-4 text-xs font-medium text-gray-600">
                    {completionPercentage}%
                  </div>
                </div>

                <div className="p-6">
                  {/* Topic Header */}
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-4xl">{topic.logo}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {topic.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{topic.totalQuestions} problems</span>
                        <span>•</span>
                        <span>{topic.difficulty}</span>
                        <span>•</span>
                        <span>{topic.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {topic.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {topic.estimatedTime}
                    </div>
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      {topic.questions.filter(q => progress[q.id]).length}/{topic.totalQuestions}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/company-sheets-frontend/${topic.id}`)
                    }}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium"
                  >
                    Start Practice
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default FrontendSheets
