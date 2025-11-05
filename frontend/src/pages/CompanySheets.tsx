import React, { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Search, 
  TrendingUp,
  Clock,
  Target,
  ExternalLink
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { companySheets, CompanySheet } from '../data/companyQuestions'

const CompanySheets: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<CompanySheet | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All')
  const [topicFilter, setTopicFilter] = useState<string>('All')
  const [progress, setProgress] = useState<Record<string, boolean>>({})

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('coding-sheets-progress')
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    }
  }, [])

  // Save progress to localStorage
  const saveProgress = (questionId: string, completed: boolean) => {
    const newProgress = { ...progress, [questionId]: completed }
    setProgress(newProgress)
    localStorage.setItem('coding-sheets-progress', JSON.stringify(newProgress))
  }

  // Toggle question completion
  const toggleQuestionCompletion = (questionId: string) => {
    const isCompleted = progress[questionId] || false
    saveProgress(questionId, !isCompleted)
  }

  // Filter questions based on search, difficulty, and topic
  const filteredQuestions = selectedCompany?.questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.topic.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = difficultyFilter === 'All' || question.difficulty === difficultyFilter
    const matchesTopic = topicFilter === 'All' || question.topic === topicFilter
    return matchesSearch && matchesDifficulty && matchesTopic
  }) || []

  // Calculate completion percentage
  const getCompletionPercentage = (company: CompanySheet) => {
    const completedCount = company.questions.filter(q => progress[q.id]).length
    return Math.round((completedCount / company.questions.length) * 100)
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

  if (selectedCompany) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Sheets
                </button>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{selectedCompany.logo}</span>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{selectedCompany.name}</h1>
                    <p className="text-gray-600">{selectedCompany.description}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {selectedCompany.questions.filter(q => progress[q.id]).length} of {selectedCompany.questions.length} completed
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getCompletionPercentage(selectedCompany)}%` }}
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
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Topics</option>
                <option value="Array">Array</option>
                <option value="String">String</option>
                <option value="Two Pointers">Two Pointers</option>
                <option value="Sliding Window">Sliding Window</option>
                <option value="Stack">Stack</option>
                <option value="Binary Search">Binary Search</option>
                <option value="DP">Dynamic Programming</option>
                <option value="Tree">Tree</option>
                <option value="Graph">Graph</option>
                <option value="LinkedList">LinkedList</option>
                <option value="Heap">Heap</option>
                <option value="Design">Design</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-3">
            {filteredQuestions.map((question) => {
              const isCompleted = progress[question.id] || false
              return (
                <div
                  key={question.id}
                  className={`bg-white rounded-lg border p-4 transition-all duration-200 ${
                    isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <button
                        onClick={() => toggleQuestionCompletion(question.id)}
                        className="flex-shrink-0"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {question.title}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                          <span className="text-sm text-gray-600">{question.topic}</span>
                          <div className="flex items-center text-sm text-gray-500">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {question.frequency}% frequency
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a 
                        href={question.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Solve on LeetCode"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Company-Wise Coding Sheets</h1>
            <p className="text-xl text-blue-100 mb-8">
              Master coding interviews with curated problem sets from top tech companies
            </p>
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-blue-100">Problems</div>
              </div>
              <div>
                <div className="text-3xl font-bold">6+</div>
                <div className="text-blue-100">Companies</div>
              </div>
              <div>
                <div className="text-3xl font-bold">95%</div>
                <div className="text-blue-100">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Sheets Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Target Company</h2>
          <p className="text-gray-600">Select a company to start your coding interview preparation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companySheets.map((company) => {
            const completionPercentage = getCompletionPercentage(company)
            return (
              <div
                key={company.id}
                onClick={() => setSelectedCompany(company)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-gray-300"
              >
                {/* Progress Bar */}
                <div className="relative">
                  <div className="h-2 bg-gray-200 rounded-t-xl">
                    <div 
                      className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-xl transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <div className="absolute top-2 right-4 text-xs font-medium text-gray-600">
                    {completionPercentage}%
                  </div>
                </div>

                <div className="p-6">
                  {/* Company Header */}
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-4xl">{company.logo}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {company.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{company.totalQuestions} problems</span>
                        <span>•</span>
                        <span>{company.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {company.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {company.estimatedTime}
                    </div>
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      {company.questions.filter(q => progress[q.id]).length}/{company.totalQuestions}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium">
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

export default CompanySheets