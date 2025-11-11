import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  ExternalLink,
  Code,
  Lightbulb,
  BookOpen,
  Play,
  Copy,
  Check
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { frontendTopicSheets, FrontendQuestion } from '../data/frontendCompanyQuestions'

const FrontendSolutionPage: React.FC = () => {
  const { topicId, questionId } = useParams<{ topicId: string; questionId: string }>()
  const navigate = useNavigate()
  const [progress, setProgress] = useState<Record<string, boolean>>({})
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('frontend-sheets-progress')
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    }
  }, [])

  // Find the question
  const topic = frontendTopicSheets.find(t => t.id === topicId)
  const question = topic?.questions.find(q => q.id === questionId)

  if (!question || !topic) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Question Not Found</h1>
            <button
              onClick={() => navigate('/company-sheets-frontend')}
              className="btn-primary"
            >
              Back to Frontend Sheets
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isCompleted = progress[question.id] || false

  // Toggle question completion
  const toggleQuestionCompletion = () => {
    const newProgress = { ...progress, [question.id]: !isCompleted }
    setProgress(newProgress)
    localStorage.setItem('frontend-sheets-progress', JSON.stringify(newProgress))
  }

  // Copy code to clipboard
  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
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

  // Get topic color
  const getTopicColor = (topic: string) => {
    const colors: Record<string, string> = {
      'React': 'bg-blue-100 text-blue-800',
      'JavaScript': 'bg-yellow-100 text-yellow-800',
      'TypeScript': 'bg-indigo-100 text-indigo-800',
      'Performance': 'bg-purple-100 text-purple-800',
      'State Management': 'bg-green-100 text-green-800',
      'File Handling': 'bg-orange-100 text-orange-800',
      'E-commerce': 'bg-pink-100 text-pink-800',
      'Animations': 'bg-cyan-100 text-cyan-800',
      'Media': 'bg-red-100 text-red-800',
      'CSS': 'bg-teal-100 text-teal-800',
      'Testing': 'bg-gray-100 text-gray-800',
      'PWA': 'bg-violet-100 text-violet-800',
      'System Design': 'bg-amber-100 text-amber-800',
      'Search': 'bg-emerald-100 text-emerald-800',
      'Machine Learning': 'bg-rose-100 text-rose-800',
      'Payment': 'bg-sky-100 text-sky-800',
      'Analytics': 'bg-lime-100 text-lime-800',
      'Accessibility': 'bg-fuchsia-100 text-fuchsia-800',
      'Internationalization': 'bg-stone-100 text-stone-800'
    }
    return colors[topic] || 'bg-gray-100 text-gray-800'
  }

  // Get solution code based on question
  const getSolutionCode = (question: FrontendQuestion) => {
    switch (question.id) {
      case '1': // Real-time Chat Application
        return {
          react: `import React, { useState, useEffect, useCallback, useMemo } from 'react'

const ChatApp = () => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [ws, setWs] = useState(null)

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8080')
    
    websocket.onopen = () => {
      setIsConnected(true)
      setWs(websocket)
    }
    
    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      setMessages(prev => [...prev, message])
    }
    
    websocket.onclose = () => {
      setIsConnected(false)
      setWs(null)
    }
    
    return () => {
      websocket.close()
    }
  }, [])

  const sendMessage = useCallback(() => {
    if (ws && newMessage.trim()) {
      ws.send(JSON.stringify({
        text: newMessage,
        timestamp: Date.now(),
        user: 'current-user'
      }))
      setNewMessage('')
    }
  }, [ws, newMessage])

  const MemoizedMessage = useMemo(() => 
    React.memo(({ message }) => (
      <div className="message">
        <strong>{message.user}:</strong> {message.text}
        <span className="timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
      </div>
    )), []
  )

  return (
    <div className="chat-app">
      <div className="status">
        Status: {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      <div className="messages">
        {messages.map((message, index) => (
          <MemoizedMessage key={index} message={message} />
        ))}
      </div>
      <div className="input-area">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default ChatApp`,
          javascript: `// WebSocket connection management
class ChatConnection {
  constructor(url) {
    this.url = url
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
  }

  connect() {
    this.ws = new WebSocket(this.url)
    
    this.ws.onopen = () => {
      console.log('Connected to chat server')
      this.reconnectAttempts = 0
    }
    
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      this.handleMessage(message)
    }
    
    this.ws.onclose = () => {
      this.handleReconnect()
    }
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => this.connect(), 1000 * this.reconnectAttempts)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
    }
  }
}`
        }
      case '2': // Virtual Scrolling
        return {
          react: `import React, { useState, useEffect, useMemo, useCallback } from 'react'

const VirtualScrollList = ({ items, itemHeight = 50, containerHeight = 400 }) => {
  const [scrollTop, setScrollTop] = useState(0)
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    )
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index
    }))
  }, [items, scrollTop, itemHeight, containerHeight])

  const totalHeight = items.length * itemHeight
  const offsetY = Math.floor(scrollTop / itemHeight) * itemHeight

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop)
  }, [])

  return (
    <div 
      className="virtual-scroll-container"
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div 
          style={{ 
            transform: \`translateY(\${offsetY}px)\`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item) => (
            <div 
              key={item.index}
              style={{ height: itemHeight }}
              className="virtual-item"
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VirtualScrollList`,
          javascript: `// Virtual scrolling implementation
class VirtualScroll {
  constructor(container, items, itemHeight) {
    this.container = container
    this.items = items
    this.itemHeight = itemHeight
    this.visibleItems = []
    this.scrollTop = 0
    
    this.init()
  }

  init() {
    this.container.style.overflow = 'auto'
    this.container.style.height = '400px'
    
    // Create virtual container
    this.virtualContainer = document.createElement('div')
    this.virtualContainer.style.height = \`\${this.items.length * this.itemHeight}px\`
    this.virtualContainer.style.position = 'relative'
    
    // Create visible items container
    this.visibleContainer = document.createElement('div')
    this.visibleContainer.style.position = 'absolute'
    this.visibleContainer.style.top = '0'
    this.visibleContainer.style.left = '0'
    this.visibleContainer.style.right = '0'
    
    this.virtualContainer.appendChild(this.visibleContainer)
    this.container.appendChild(this.virtualContainer)
    
    this.container.addEventListener('scroll', this.handleScroll.bind(this))
    this.updateVisibleItems()
  }

  handleScroll(e) {
    this.scrollTop = e.target.scrollTop
    this.updateVisibleItems()
  }

  updateVisibleItems() {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(this.container.clientHeight / this.itemHeight) + 1,
      this.items.length
    )

    // Clear existing items
    this.visibleContainer.innerHTML = ''

    // Render visible items
    for (let i = startIndex; i < endIndex; i++) {
      const item = document.createElement('div')
      item.style.height = \`\${this.itemHeight}px\`
      item.style.position = 'absolute'
      item.style.top = \`\${i * this.itemHeight}px\`
      item.style.left = '0'
      item.style.right = '0'
      item.textContent = this.items[i].content
      
      this.visibleContainer.appendChild(item)
    }
  }
}`
        }
      case '3': // Drag and Drop File Uploader
        return {
          react: `import React, { useState, useCallback, useRef } from 'react'

const FileUploader = ({ onUpload, maxSize = 10 * 1024 * 1024, acceptedTypes = [] }) => {
  const [files, setFiles] = useState([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const fileInputRef = useRef(null)

  const validateFile = useCallback((file) => {
    if (file.size > maxSize) {
      throw new Error(\`File \${file.name} is too large. Maximum size is \${maxSize / 1024 / 1024}MB\`)
    }
    
    if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
      throw new Error(\`File \${file.name} is not a supported type\`)
    }
    
    return true
  }, [maxSize, acceptedTypes])

  const handleFiles = useCallback((fileList) => {
    const newFiles = Array.from(fileList).map(file => {
      try {
        validateFile(file)
        return {
          file,
          id: Math.random().toString(36).substr(2, 9),
          status: 'pending',
          progress: 0
        }
      } catch (error) {
        console.error('File validation error:', error.message)
        return null
      }
    }).filter(Boolean)

    setFiles(prev => [...prev, ...newFiles])
  }, [validateFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const uploadFile = useCallback(async (fileData) => {
    const formData = new FormData()
    formData.append('file', fileData.file)

    try {
      setUploadProgress(prev => ({ ...prev, [fileData.id]: 0 }))
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(prev => ({ ...prev, [fileData.id]: progress }))
        }
      })

      if (response.ok) {
        setFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, status: 'completed' } : f
        ))
        onUpload?.(fileData.file)
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileData.id ? { ...f, status: 'error' } : f
      ))
    }
  }, [onUpload])

  return (
    <div className="file-uploader">
      <div
        className={\`drop-zone \${isDragOver ? 'drag-over' : ''}\`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <p>Drag and drop files here or click to select</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>
      
      <div className="file-list">
        {files.map(fileData => (
          <div key={fileData.id} className="file-item">
            <span>{fileData.file.name}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: \`\${uploadProgress[fileData.id] || 0}%\` }}
              />
            </div>
            <button onClick={() => uploadFile(fileData)}>
              Upload
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FileUploader`,
          javascript: `// File upload with progress tracking
class FileUploader {
  constructor(options = {}) {
    this.maxSize = options.maxSize || 10 * 1024 * 1024
    this.acceptedTypes = options.acceptedTypes || []
    this.onProgress = options.onProgress || (() => {})
    this.onComplete = options.onComplete || (() => {})
    this.onError = options.onError || (() => {})
  }

  validateFile(file) {
    if (file.size > this.maxSize) {
      throw new Error(\`File \${file.name} is too large\`)
    }
    
    if (this.acceptedTypes.length > 0 && !this.acceptedTypes.includes(file.type)) {
      throw new Error(\`File \${file.name} is not a supported type\`)
    }
    
    return true
  }

  async uploadFile(file) {
    try {
      this.validateFile(file)
      
      const formData = new FormData()
      formData.append('file', file)
      
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          this.onProgress(progress)
        }
      })
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          this.onComplete(JSON.parse(xhr.responseText))
        } else {
          this.onError(new Error('Upload failed'))
        }
      })
      
      xhr.addEventListener('error', () => {
        this.onError(new Error('Upload failed'))
      })
      
      xhr.open('POST', '/api/upload')
      xhr.send(formData)
      
    } catch (error) {
      this.onError(error)
    }
  }
}`
        }
      case '4': // Custom Hook for API Calls
        return {
          react: `import { useState, useEffect, useCallback, useRef } from 'react'

const useApi = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  
  const abortControllerRef = useRef(null)
  const cacheRef = useRef(new Map())
  
  const {
    method = 'GET',
    body = null,
    headers = {},
    retries = 3,
    retryDelay = 1000,
    cache = true,
    cacheTime = 5 * 60 * 1000 // 5 minutes
  } = options

  const executeRequest = useCallback(async (retryAttempt = 0) => {
    // Check cache first
    if (cache && method === 'GET' && cacheRef.current.has(url)) {
      const cached = cacheRef.current.get(url)
      if (Date.now() - cached.timestamp < cacheTime) {
        setData(cached.data)
        return cached.data
      }
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        method,
        body: body ? JSON.stringify(body) : null,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`)
      }

      const result = await response.json()
      
      // Cache successful GET requests
      if (cache && method === 'GET') {
        cacheRef.current.set(url, {
          data: result,
          timestamp: Date.now()
        })
      }

      setData(result)
      setRetryCount(0)
      return result

    } catch (err) {
      if (err.name === 'AbortError') {
        return
      }

      setError(err)
      
      // Retry logic with exponential backoff
      if (retryAttempt < retries) {
        const delay = retryDelay * Math.pow(2, retryAttempt)
        setTimeout(() => {
          setRetryCount(retryAttempt + 1)
          executeRequest(retryAttempt + 1)
        }, delay)
      }
      
      throw err
    } finally {
      setLoading(false)
    }
  }, [url, method, body, headers, retries, retryDelay, cache, cacheTime])

  const refetch = useCallback(() => {
    // Clear cache for this URL
    if (cacheRef.current.has(url)) {
      cacheRef.current.delete(url)
    }
    return executeRequest()
  }, [executeRequest, url])

  const clearCache = useCallback(() => {
    cacheRef.current.clear()
  }, [])

  useEffect(() => {
    if (method === 'GET') {
      executeRequest()
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [executeRequest, method])

  return {
    data,
    loading,
    error,
    retryCount,
    refetch,
    clearCache,
    execute: executeRequest
  }
}

export default useApi`,
          javascript: `// Custom API hook implementation
class ApiClient {
  constructor(options = {}) {
    this.baseURL = options.baseURL || ''
    this.defaultHeaders = options.headers || {}
    this.retries = options.retries || 3
    this.retryDelay = options.retryDelay || 1000
    this.cache = new Map()
    this.cacheTime = options.cacheTime || 5 * 60 * 1000
  }

  async request(url, options = {}) {
    const {
      method = 'GET',
      body = null,
      headers = {},
      retries = this.retries,
      useCache = true
    } = options

    const fullUrl = this.baseURL + url
    const cacheKey = \`\${method}:\${fullUrl}\`

    // Check cache for GET requests
    if (useCache && method === 'GET' && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.cacheTime) {
        return cached.data
      }
    }

    let lastError
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(fullUrl, {
          method,
          body: body ? JSON.stringify(body) : null,
          headers: {
            'Content-Type': 'application/json',
            ...this.defaultHeaders,
            ...headers
          }
        })

        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`)
        }

        const data = await response.json()

        // Cache successful GET requests
        if (useCache && method === 'GET') {
          this.cache.set(cacheKey, {
            data,
            timestamp: Date.now()
          })
        }

        return data

      } catch (error) {
        lastError = error
        
        if (attempt < retries) {
          const delay = this.retryDelay * Math.pow(2, attempt)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }

    throw lastError
  }

  get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' })
  }

  post(url, body, options = {}) {
    return this.request(url, { ...options, method: 'POST', body })
  }

  put(url, body, options = {}) {
    return this.request(url, { ...options, method: 'PUT', body })
  }

  delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' })
  }

  clearCache() {
    this.cache.clear()
  }
}`
        }
      case '5': // Infinite Scroll with Intersection Observer
        return {
          react: `import React, { useState, useEffect, useCallback, useRef } from 'react'

const InfiniteScroll = ({ 
  fetchData, 
  renderItem, 
  threshold = 0.1,
  rootMargin = '100px'
}) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  
  const observerRef = useRef(null)
  const loadingRef = useRef(null)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const newData = await fetchData(page)
      
      if (newData.length === 0) {
        setHasMore(false)
      } else {
        setItems(prev => [...prev, ...newData])
        setPage(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error loading more data:', error)
    } finally {
      setLoading(false)
    }
  }, [fetchData, page, loading, hasMore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observerRef.current = observer

    if (loadingRef.current) {
      observer.observe(loadingRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadMore, hasMore, loading, threshold, rootMargin])

  useEffect(() => {
    loadMore()
  }, [])

  return (
    <div className="infinite-scroll">
      {items.map((item, index) => (
        <div key={index} className="item">
          {renderItem(item, index)}
        </div>
      ))}
      
      {loading && (
        <div className="loading" ref={loadingRef}>
          <div className="spinner">Loading...</div>
        </div>
      )}
      
      {!hasMore && items.length > 0 && (
        <div className="end-message">
          No more items to load
        </div>
      )}
    </div>
  )
}

export default InfiniteScroll`,
          javascript: `// Intersection Observer implementation
class InfiniteScroll {
  constructor(options = {}) {
    this.container = options.container || document.body
    this.fetchData = options.fetchData
    this.renderItem = options.renderItem
    this.threshold = options.threshold || 0.1
    this.rootMargin = options.rootMargin || '100px'
    
    this.items = []
    this.loading = false
    this.hasMore = true
    this.page = 1
    
    this.observer = null
    this.loadingElement = null
    
    this.init()
  }

  init() {
    this.createLoadingElement()
    this.setupObserver()
    this.loadMore()
  }

  createLoadingElement() {
    this.loadingElement = document.createElement('div')
    this.loadingElement.className = 'loading-indicator'
    this.loadingElement.textContent = 'Loading...'
    this.loadingElement.style.display = 'none'
    
    this.container.appendChild(this.loadingElement)
  }

  setupObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && this.hasMore && !this.loading) {
          this.loadMore()
        }
      },
      {
        threshold: this.threshold,
        rootMargin: this.rootMargin
      }
    )

    this.observer.observe(this.loadingElement)
  }

  async loadMore() {
    if (this.loading || !this.hasMore) return

    this.loading = true
    this.loadingElement.style.display = 'block'

    try {
      const newData = await this.fetchData(this.page)
      
      if (newData.length === 0) {
        this.hasMore = false
        this.loadingElement.textContent = 'No more items'
      } else {
        this.items.push(...newData)
        this.renderItems(newData)
        this.page++
      }
    } catch (error) {
      console.error('Error loading more data:', error)
      this.loadingElement.textContent = 'Error loading data'
    } finally {
      this.loading = false
      if (this.hasMore) {
        this.loadingElement.style.display = 'none'
      }
    }
  }

  renderItems(newItems) {
    newItems.forEach(item => {
      const itemElement = this.renderItem(item)
      this.container.insertBefore(itemElement, this.loadingElement)
    })
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
    if (this.loadingElement) {
      this.loadingElement.remove()
    }
  }
}`
        }
      // System Design Questions
      case 'sd1': // Responsive Web Design
        return {
          react: `// Responsive Web Design Implementation
import React from 'react'

const ResponsiveDesign: React.FC = () => {
  return (
    <div className="responsive-container">
      {/* Mobile-first approach */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card">
          <h3>Fluid Grids</h3>
          <p>Use CSS Grid and Flexbox for flexible layouts</p>
        </div>
        <div className="card">
          <h3>Flexible Images</h3>
          <p>Images that scale with container width</p>
        </div>
        <div className="card">
          <h3>Media Queries</h3>
          <p>Breakpoints for different screen sizes</p>
        </div>
      </div>
      
      <style jsx>{\`
        .responsive-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
        }
        
        .card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        /* Mobile-first media queries */
        @media (min-width: 768px) {
          .responsive-container {
            padding: 2rem;
          }
        }
        
        @media (min-width: 1024px) {
          .responsive-container {
            padding: 3rem;
          }
        }
      \`}</style>
    </div>
  )
}

export default ResponsiveDesign`,
          javascript: `// Responsive Web Design with Vanilla JavaScript
class ResponsiveDesign {
  constructor() {
    this.breakpoints = {
      mobile: 768,
      tablet: 1024,
      desktop: 1200
    }
    
    this.init()
  }

  init() {
    this.createResponsiveLayout()
    this.handleResize()
    this.setupMediaQueries()
  }

  createResponsiveLayout() {
    document.body.innerHTML = \`
      <div class="responsive-container">
        <header class="header">
          <h1>Responsive Web Design</h1>
          <div class="device-indicator" id="deviceIndicator">Mobile</div>
        </header>
        
        <main class="main-content">
          <div class="grid-container" id="gridContainer">
            <div class="card">
              <h3>Fluid Grids</h3>
              <p>Use CSS Grid and Flexbox for flexible layouts that adapt to different screen sizes.</p>
            </div>
            <div class="card">
              <h3>Flexible Images</h3>
              <p>Images that scale proportionally with their container width using max-width: 100%.</p>
            </div>
            <div class="card">
              <h3>Media Queries</h3>
              <p>CSS breakpoints for different screen sizes using @media rules.</p>
            </div>
            <div class="card">
              <h3>Mobile-First</h3>
              <p>Design for mobile devices first, then enhance for larger screens.</p>
            </div>
          </div>
        </main>
      </div>
      
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .responsive-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .header {
          text-align: center;
          margin-bottom: 2rem;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
        }
        
        .device-indicator {
          margin-top: 0.5rem;
          padding: 0.25rem 0.75rem;
          background: rgba(255,255,255,0.2);
          border-radius: 20px;
          font-size: 0.875rem;
          display: inline-block;
        }
        
        .grid-container {
          display: grid;
          gap: 1rem;
          grid-template-columns: 1fr;
        }
        
        .card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        
        .card h3 {
          color: #333;
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
        }
        
        .card p {
          color: #666;
          line-height: 1.6;
        }
        
        /* Tablet styles */
        @media (min-width: 768px) {
          .responsive-container {
            padding: 2rem;
          }
          
          .grid-container {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .header h1 {
            font-size: 2.5rem;
          }
        }
        
        /* Desktop styles */
        @media (min-width: 1024px) {
          .responsive-container {
            padding: 3rem;
          }
          
          .grid-container {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .card {
            padding: 2rem;
          }
        }
        
        /* Large desktop styles */
        @media (min-width: 1200px) {
          .grid-container {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      </style>
    \`
  }

  handleResize() {
    window.addEventListener('resize', () => {
      this.updateDeviceIndicator()
      this.adjustLayout()
    })
  }

  updateDeviceIndicator() {
    const indicator = document.getElementById('deviceIndicator')
    const width = window.innerWidth
    
    if (width < this.breakpoints.mobile) {
      indicator.textContent = 'Mobile'
    } else if (width < this.breakpoints.tablet) {
      indicator.textContent = 'Tablet'
    } else if (width < this.breakpoints.desktop) {
      indicator.textContent = 'Desktop'
    } else {
      indicator.textContent = 'Large Desktop'
    }
  }

  adjustLayout() {
    const gridContainer = document.getElementById('gridContainer')
    const width = window.innerWidth
    
    // Dynamic grid adjustments based on screen size
    if (width < this.breakpoints.mobile) {
      gridContainer.style.gridTemplateColumns = '1fr'
    } else if (width < this.breakpoints.tablet) {
      gridContainer.style.gridTemplateColumns = 'repeat(2, 1fr)'
    } else if (width < this.breakpoints.desktop) {
      gridContainer.style.gridTemplateColumns = 'repeat(3, 1fr)'
    } else {
      gridContainer.style.gridTemplateColumns = 'repeat(4, 1fr)'
    }
  }

  setupMediaQueries() {
    // Create responsive images
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      img.style.maxWidth = '100%'
      img.style.height = 'auto'
    })
    
    // Setup responsive navigation if needed
    this.createResponsiveNavigation()
  }

  createResponsiveNavigation() {
    // Example of responsive navigation
    const nav = document.createElement('nav')
    nav.innerHTML = \`
      <div class="nav-container">
        <div class="nav-brand">Logo</div>
        <div class="nav-menu" id="navMenu">
          <a href="#" class="nav-link">Home</a>
          <a href="#" class="nav-link">About</a>
          <a href="#" class="nav-link">Services</a>
          <a href="#" class="nav-link">Contact</a>
        </div>
        <button class="nav-toggle" id="navToggle">☰</button>
      </div>
      
      <style>
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .nav-menu {
          display: flex;
          gap: 2rem;
        }
        
        .nav-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
        
        @media (max-width: 768px) {
          .nav-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 1rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .nav-menu.active {
            display: flex;
          }
          
          .nav-toggle {
            display: block;
          }
        }
      </style>
    \`
    
    document.body.insertBefore(nav, document.body.firstChild)
    
    // Toggle mobile menu
    const toggle = document.getElementById('navToggle')
    const menu = document.getElementById('navMenu')
    
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active')
    })
  }
}

// Initialize responsive design
const responsiveDesign = new ResponsiveDesign()`
        }
      case 'sd2': // Performance Optimization
        return {
          react: `// Performance Optimization Component
import React, { useState, useEffect, useMemo, useCallback } from 'react'

const PerformanceOptimizedApp: React.FC = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Memoized expensive calculations
  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  // Optimized API call with caching
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // Check cache first
      const cached = localStorage.getItem('api-cache')
      const cacheTime = localStorage.getItem('api-cache-time')
      
      if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 300000) {
        setData(JSON.parse(cached))
        setLoading(false)
        return
      }
      
      const response = await fetch('/api/data')
      const result = await response.json()
      
      setData(result)
      
      // Cache the result
      localStorage.setItem('api-cache', JSON.stringify(result))
      localStorage.setItem('api-cache-time', Date.now().toString())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="performance-app">
      <h1>Performance Optimized App</h1>
      
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="search-input"
        />
      </div>
      
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="data-list">
          {filteredData.map((item) => (
            <DataItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

// Memoized component to prevent unnecessary re-renders
const DataItem = React.memo<{ item: any }>(({ item }) => {
  return (
    <div className="data-item">
      <h3>{item.name}</h3>
      <p>{item.description}</p>
    </div>
  )
})

export default PerformanceOptimizedApp`,
          javascript: `// Performance Optimization with Vanilla JavaScript
class PerformanceOptimizer {
  constructor() {
    this.cache = new Map()
    this.debounceTimer = null
    this.intersectionObserver = null
    this.init()
  }

  init() {
    this.setupLazyLoading()
    this.setupImageOptimization()
    this.setupCaching()
    this.setupDebouncing()
    this.setupVirtualScrolling()
  }

  // Lazy Loading Implementation
  setupLazyLoading() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target
            const src = img.dataset.src
            
            if (src) {
              img.src = src
              img.classList.remove('lazy')
              this.intersectionObserver.unobserve(img)
            }
          }
        })
      },
      { rootMargin: '50px' }
    )

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      this.intersectionObserver.observe(img)
    })
  }

  // Image Optimization
  setupImageOptimization() {
    // Convert images to WebP format
    this.convertToWebP()
    
    // Implement responsive images
    this.setupResponsiveImages()
  }

  convertToWebP() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    document.querySelectorAll('img').forEach(img => {
      if (!img.src.includes('.webp')) {
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        
        ctx.drawImage(img, 0, 0)
        
        canvas.toBlob((blob) => {
          const webpUrl = URL.createObjectURL(blob)
          img.src = webpUrl
        }, 'image/webp', 0.8)
      }
    })
  }

  setupResponsiveImages() {
    document.querySelectorAll('img').forEach(img => {
      img.style.maxWidth = '100%'
      img.style.height = 'auto'
      img.loading = 'lazy'
    })
  }

  // Caching Implementation
  setupCaching() {
    // Service Worker for caching
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration)
        })
        .catch(error => {
          console.log('SW registration failed:', error)
        })
    }

    // Memory caching for API calls
    this.cacheApiCalls()
  }

  cacheApiCalls() {
    const originalFetch = window.fetch
    
    window.fetch = async (url, options) => {
      const cacheKey = \`\${url}-\${JSON.stringify(options)}\`
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey)
        if (Date.now() - cached.timestamp < 300000) { // 5 minutes
          return Promise.resolve(new Response(JSON.stringify(cached.data)))
        }
      }
      
      // Make actual request
      const response = await originalFetch(url, options)
      const data = await response.clone().json()
      
      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      })
      
      return response
    }
  }

  // Debouncing for Search
  setupDebouncing() {
    const searchInput = document.getElementById('searchInput')
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.debounce(() => {
          this.performSearch(e.target.value)
        }, 300)
      })
    }
  }

  debounce(func, wait) {
    clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(func, wait)
  }

  performSearch(query) {
    console.log('Searching for:', query)
    // Implement search logic
  }

  // Virtual Scrolling for Large Lists
  setupVirtualScrolling() {
    const container = document.getElementById('virtualScrollContainer')
    if (!container) return

    const itemHeight = 50
    const containerHeight = container.clientHeight
    const visibleItems = Math.ceil(containerHeight / itemHeight)
    
    let scrollTop = 0
    let startIndex = 0
    let endIndex = visibleItems

    container.addEventListener('scroll', () => {
      scrollTop = container.scrollTop
      startIndex = Math.floor(scrollTop / itemHeight)
      endIndex = Math.min(startIndex + visibleItems, this.data.length)
      
      this.renderVirtualItems(startIndex, endIndex)
    })

    this.renderVirtualItems(startIndex, endIndex)
  }

  renderVirtualItems(startIndex, endIndex) {
    const container = document.getElementById('virtualScrollContainer')
    const fragment = document.createDocumentFragment()
    
    for (let i = startIndex; i < endIndex; i++) {
      const item = document.createElement('div')
      item.className = 'virtual-item'
      item.style.height = '50px'
      item.style.position = 'absolute'
      item.style.top = \`\${i * 50}px\`
      item.style.width = '100%'
      item.textContent = \`Item \${i + 1}\`
      fragment.appendChild(item)
    }
    
    container.innerHTML = ''
    container.appendChild(fragment)
  }

  // Performance Monitoring
  measurePerformance() {
    // Core Web Vitals
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log(\`Performance metric: \${entry.name} - \${entry.value}\`)
        })
      })
      
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
    }

    // Resource timing
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource')
      resources.forEach(resource => {
        console.log(\`Resource: \${resource.name}, Load time: \${resource.duration}ms\`)
      })
    })
  }

  // Bundle Optimization
  optimizeBundle() {
    // Code splitting
    this.loadModuleOnDemand()
    
    // Tree shaking simulation
    this.removeUnusedCode()
  }

  loadModuleOnDemand() {
    const buttons = document.querySelectorAll('[data-module]')
    buttons.forEach(button => {
      button.addEventListener('click', async (e) => {
        const moduleName = e.target.dataset.module
        try {
          const module = await import(\`./modules/\${moduleName}.js\`)
          module.default()
        } catch (error) {
          console.error('Failed to load module:', error)
        }
      })
    })
  }

  removeUnusedCode() {
    // Remove unused CSS
    const usedClasses = new Set()
    document.querySelectorAll('*').forEach(element => {
      element.classList.forEach(cls => usedClasses.add(cls))
    })
    
    // Remove unused JavaScript functions
    const usedFunctions = this.findUsedFunctions()
    console.log('Used functions:', usedFunctions)
  }

  findUsedFunctions() {
    // This would analyze the code to find used functions
    return ['init', 'setupLazyLoading', 'setupCaching']
  }
}

// Initialize performance optimizer
const performanceOptimizer = new PerformanceOptimizer()`
        }
      case 'sd3': // Lazy Loading Images
        return {
          react: `// Lazy Loading Images Component
import React, { useState, useRef, useEffect } from 'react'

interface LazyImageProps {
  src: string
  alt: string
  placeholder?: string
  className?: string
}

const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+',
  className = ''
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current)
      }
    }
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
  }

  return (
    <div ref={imgRef} className={\`lazy-image-container \${className}\`}>
      {!isInView ? (
        <img
          src={placeholder}
          alt=""
          className="lazy-placeholder"
        />
      ) : (
        <>
          {!isLoaded && (
            <img
              src={placeholder}
              alt=""
              className="lazy-placeholder"
            />
          )}
          <img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={\`lazy-image \${isLoaded ? 'loaded' : 'loading'}\`}
            style={{ opacity: isLoaded ? 1 : 0 }}
          />
          {hasError && (
            <div className="lazy-error">
              Failed to load image
            </div>
          )}
        </>
      )}
      
      <style jsx>{\`
        .lazy-image-container {
          position: relative;
          overflow: hidden;
          background-color: #f0f0f0;
        }
        
        .lazy-placeholder {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: blur(5px);
          transition: filter 0.3s ease;
        }
        
        .lazy-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.3s ease;
        }
        
        .lazy-image.loaded {
          filter: none;
        }
        
        .lazy-error {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #666;
          text-align: center;
        }
      \`}</style>
    </div>
  )
}

// Usage Example
const ImageGallery: React.FC = () => {
  const images = [
    { src: '/images/image1.jpg', alt: 'Image 1' },
    { src: '/images/image2.jpg', alt: 'Image 2' },
    { src: '/images/image3.jpg', alt: 'Image 3' },
    // ... more images
  ]

  return (
    <div className="image-gallery">
      <h2>Lazy Loading Image Gallery</h2>
      <div className="gallery-grid">
        {images.map((image, index) => (
          <LazyImage
            key={index}
            src={image.src}
            alt={image.alt}
            className="gallery-item"
          />
        ))}
      </div>
    </div>
  )
}

export default ImageGallery`,
          javascript: `// Lazy Loading Images with Vanilla JavaScript
class LazyImageLoader {
  constructor() {
    this.observer = null
    this.imageCache = new Map()
    this.init()
  }

  init() {
    this.setupIntersectionObserver()
    this.setupImageElements()
    this.setupFallbackForOldBrowsers()
  }

  setupIntersectionObserver() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.loadImage(entry.target)
              this.observer.unobserve(entry.target)
            }
          })
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.1
        }
      )
    }
  }

  setupImageElements() {
    // Find all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]')
    
    if (this.observer) {
      lazyImages.forEach(img => {
        this.setupImagePlaceholder(img)
        this.observer.observe(img)
      })
    } else {
      // Fallback for browsers without IntersectionObserver
      lazyImages.forEach(img => this.loadImage(img))
    }
  }

  setupImagePlaceholder(img) {
    // Add loading class
    img.classList.add('lazy-loading')
    
    // Set placeholder if not already set
    if (!img.src || img.src === '') {
      img.src = this.createPlaceholder(img.dataset.width || 300, img.dataset.height || 200)
    }
    
    // Add loading animation
    img.style.filter = 'blur(5px)'
    img.style.transition = 'filter 0.3s ease'
  }

  createPlaceholder(width, height) {
    // Create a simple placeholder SVG
    const svg = \`
      <svg width="\${width}" height="\${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="Arial, sans-serif" font-size="14">
          Loading...
        </text>
      </svg>
    \`
    return \`data:image/svg+xml;base64,\${btoa(svg)}\`
  }

  async loadImage(img) {
    const src = img.dataset.src
    
    if (!src) return
    
    try {
      // Check if image is already cached
      if (this.imageCache.has(src)) {
        this.setImageSrc(img, this.imageCache.get(src))
        return
      }
      
      // Show loading state
      img.classList.add('lazy-loading')
      
      // Create a new image to preload
      const imageLoader = new Image()
      
      imageLoader.onload = () => {
        this.imageCache.set(src, src)
        this.setImageSrc(img, src)
        img.classList.remove('lazy-loading')
        img.classList.add('lazy-loaded')
      }
      
      imageLoader.onerror = () => {
        this.handleImageError(img)
      }
      
      // Start loading
      imageLoader.src = src
      
    } catch (error) {
      console.error('Error loading image:', error)
      this.handleImageError(img)
    }
  }

  setImageSrc(img, src) {
    // Smooth transition to actual image
    img.style.opacity = '0'
    
    setTimeout(() => {
      img.src = src
      img.style.opacity = '1'
      img.style.filter = 'none'
    }, 100)
  }

  handleImageError(img) {
    img.classList.add('lazy-error')
    img.src = this.createErrorPlaceholder()
    
    // Add error message
    const errorDiv = document.createElement('div')
    errorDiv.className = 'lazy-error-message'
    errorDiv.textContent = 'Failed to load image'
    errorDiv.style.cssText = \`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #666;
      font-size: 12px;
      text-align: center;
    \`
    
    img.parentNode.style.position = 'relative'
    img.parentNode.appendChild(errorDiv)
  }

  createErrorPlaceholder() {
    const svg = \`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f5f5f5" stroke="#ddd" stroke-width="1"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="Arial, sans-serif" font-size="14">
          Image not available
        </text>
      </svg>
    \`
    return \`data:image/svg+xml;base64,\${btoa(svg)}\`
  }

  setupFallbackForOldBrowsers() {
    // For browsers without IntersectionObserver support
    if (!this.observer) {
      window.addEventListener('scroll', this.throttle(() => {
        this.checkImagesInViewport()
      }, 100))
      
      window.addEventListener('resize', this.throttle(() => {
        this.checkImagesInViewport()
      }, 100))
    }
  }

  checkImagesInViewport() {
    const lazyImages = document.querySelectorAll('img[data-src].lazy-loading')
    
    lazyImages.forEach(img => {
      if (this.isInViewport(img)) {
        this.loadImage(img)
      }
    })
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  throttle(func, limit) {
    let inThrottle
    return function() {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  // Preload critical images
  preloadCriticalImages(urls) {
    urls.forEach(url => {
      const img = new Image()
      img.src = url
    })
  }

  // Cleanup
  destroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
    this.imageCache.clear()
  }
}

// CSS for lazy loading
const lazyLoadingCSS = \`
  .lazy-loading {
    opacity: 0.7;
    filter: blur(5px);
    transition: all 0.3s ease;
  }
  
  .lazy-loaded {
    opacity: 1;
    filter: none;
  }
  
  .lazy-error {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
  }
  
  .lazy-error-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #666;
    font-size: 12px;
    text-align: center;
  }
\`

// Inject CSS
const style = document.createElement('style')
style.textContent = lazyLoadingCSS
document.head.appendChild(style)

// Initialize lazy loading
const lazyLoader = new LazyImageLoader()

// Example usage
document.addEventListener('DOMContentLoaded', () => {
  // Add lazy loading to existing images
  const images = document.querySelectorAll('img')
  images.forEach((img, index) => {
    if (index > 2) { // Skip first 3 images (above the fold)
      img.setAttribute('data-src', img.src)
      img.src = ''
      img.classList.add('lazy-loading')
    }
  })
})`
        }
      // JavaScript-focused questions (no React code needed)
      case 'th1': // JavaScript Closures and Event Loop
        return {
          react: `// This question focuses on JavaScript fundamentals - React code not needed`,
          javascript: `// JavaScript Closures and Event Loop Deep Dive
class JavaScriptFundamentals {
  constructor() {
    this.init()
  }

  init() {
    this.demonstrateClosures()
    this.explainEventLoop()
    this.showMacroMicroTasks()
    this.practicalClosureExamples()
  }

  // Closure Examples
  demonstrateClosures() {
    console.log('=== CLOSURE EXAMPLES ===')
    
    // Basic Closure
    function outerFunction(x) {
      // Outer function's variable
      return function innerFunction(y) {
        // Inner function has access to outer function's variable
        console.log(\`x: \${x}, y: \${y}, sum: \${x + y}\`)
        return x + y
      }
    }
    
    const closure1 = outerFunction(10)
    const closure2 = outerFunction(20)
    
    console.log('Closure 1:', closure1(5)) // x: 10, y: 5, sum: 15
    console.log('Closure 2:', closure2(5)) // x: 20, y: 5, sum: 25
    
    // Module Pattern with Closures
    const counterModule = (function() {
      let count = 0
      
      return {
        increment: function() {
          count++
          return count
        },
        decrement: function() {
          count--
          return count
        },
        getCount: function() {
          return count
        }
      }
    })()
    
    console.log('Counter module:', counterModule.increment()) // 1
    console.log('Counter module:', counterModule.increment()) // 2
    console.log('Counter module:', counterModule.getCount()) // 2
    
    // Closure with Private Variables
    function createBankAccount(initialBalance) {
      let balance = initialBalance
      
      return {
        deposit: function(amount) {
          balance += amount
          return balance
        },
        withdraw: function(amount) {
          if (amount <= balance) {
            balance -= amount
            return balance
          } else {
            throw new Error('Insufficient funds')
          }
        },
        getBalance: function() {
          return balance
        }
      }
    }
    
    const account = createBankAccount(1000)
    console.log('Bank account balance:', account.getBalance()) // 1000
    console.log('After deposit:', account.deposit(500)) // 1500
    console.log('After withdrawal:', account.withdraw(200)) // 1300
  }

  // Event Loop Explanation
  explainEventLoop() {
    console.log('=== EVENT LOOP EXPLANATION ===')
    
    console.log('1. Synchronous code execution')
    
    // Microtask (Promise)
    Promise.resolve().then(() => {
      console.log('3. Microtask (Promise) executed')
    })
    
    // Macrotask (setTimeout)
    setTimeout(() => {
      console.log('4. Macrotask (setTimeout) executed')
    }, 0)
    
    // Another microtask
    queueMicrotask(() => {
      console.log('2. Microtask (queueMicrotask) executed')
    })
    
    console.log('5. End of synchronous code')
    
    // Execution order:
    // 1. Synchronous code execution
    // 5. End of synchronous code
    // 2. Microtask (queueMicrotask) executed
    // 3. Microtask (Promise) executed
    // 4. Macrotask (setTimeout) executed
  }

  // Macro vs Micro Tasks
  showMacroMicroTasks() {
    console.log('=== MACRO vs MICRO TASKS ===')
    
    // Macrotasks
    setTimeout(() => console.log('Macrotask 1: setTimeout'), 0)
    setInterval(() => console.log('Macrotask 2: setInterval'), 1000)
    
    // Microtasks
    Promise.resolve().then(() => console.log('Microtask 1: Promise'))
    queueMicrotask(() => console.log('Microtask 2: queueMicrotask'))
    
    // Microtasks are executed before macrotasks
    // Even if macrotask has 0 delay
  }

  // Practical Closure Examples
  practicalClosureExamples() {
    console.log('=== PRACTICAL CLOSURE EXAMPLES ===')
    
    // 1. Function Factory
    function createMultiplier(factor) {
      return function(number) {
        return number * factor
      }
    }
    
    const double = createMultiplier(2)
    const triple = createMultiplier(3)
    
    console.log('Double 5:', double(5)) // 10
    console.log('Triple 5:', triple(5)) // 15
    
    // 2. Memoization with Closures
    function memoize(fn) {
      const cache = {}
      
      return function(...args) {
        const key = JSON.stringify(args)
        
        if (cache[key]) {
          console.log('Cache hit for:', key)
          return cache[key]
        }
        
        console.log('Cache miss for:', key)
        const result = fn.apply(this, args)
        cache[key] = result
        return result
      }
    }
    
    const expensiveFunction = memoize(function(n) {
      console.log('Computing for:', n)
      return n * n
    })
    
    console.log('First call:', expensiveFunction(5)) // Computing for: 5, 25
    console.log('Second call:', expensiveFunction(5)) // Cache hit for: [5], 25
    
    // 3. Event Handler with Closures
    function createButtonHandler(buttonId) {
      let clickCount = 0
      
      return function() {
        clickCount++
        console.log(\`Button \${buttonId} clicked \${clickCount} times\`)
      }
    }
    
    const button1Handler = createButtonHandler('btn1')
    const button2Handler = createButtonHandler('btn2')
    
    // Simulate button clicks
    button1Handler() // Button btn1 clicked 1 times
    button1Handler() // Button btn1 clicked 2 times
    button2Handler() // Button btn2 clicked 1 times
    
    // 4. Partial Application with Closures
    function partial(fn, ...presetArgs) {
      return function(...laterArgs) {
        return fn(...presetArgs, ...laterArgs)
      }
    }
    
    function add(a, b, c) {
      return a + b + c
    }
    
    const add5And10 = partial(add, 5, 10)
    console.log('Partial application:', add5And10(3)) // 18
    
    // 5. Currying with Closures
    function curry(fn) {
      return function curried(...args) {
        if (args.length >= fn.length) {
          return fn.apply(this, args)
        } else {
          return function(...nextArgs) {
            return curried(...args, ...nextArgs)
          }
        }
      }
    }
    
    const curriedAdd = curry(add)
    console.log('Curried add:', curriedAdd(1)(2)(3)) // 6
    console.log('Curried add:', curriedAdd(1, 2)(3)) // 6
  }

  // Memory Management and Closures
  demonstrateMemoryImplications() {
    console.log('=== MEMORY IMPLICATIONS ===')
    
    // Potential memory leak with closures
    function createLeakyClosure() {
      const largeArray = new Array(1000000).fill('data')
      
      return function() {
        // This closure keeps reference to largeArray
        // even if we don't use it
        console.log('Leaky closure executed')
      }
    }
    
    const leakyFunction = createLeakyClosure()
    
    // Proper cleanup
    function createCleanClosure() {
      const largeArray = new Array(1000000).fill('data')
      
      return function() {
        console.log('Clean closure executed')
        // Explicitly nullify reference
        largeArray.length = 0
      }
    }
    
    const cleanFunction = createCleanClosure()
    
    // WeakMap for better memory management
    const weakMap = new WeakMap()
    
    function createWeakClosure(obj) {
      weakMap.set(obj, new Array(1000000).fill('data'))
      
      return function() {
        console.log('Weak closure executed')
        // WeakMap allows garbage collection
        // when obj is no longer referenced
      }
    }
  }

  // Advanced Event Loop Scenarios
  advancedEventLoopScenarios() {
    console.log('=== ADVANCED EVENT LOOP SCENARIOS ===')
    
    // Scenario 1: Nested Promises and setTimeout
    console.log('Start')
    
    setTimeout(() => console.log('Timeout 1'), 0)
    
    Promise.resolve().then(() => {
      console.log('Promise 1')
      setTimeout(() => console.log('Timeout 2'), 0)
    })
    
    Promise.resolve().then(() => {
      console.log('Promise 2')
      Promise.resolve().then(() => console.log('Promise 3'))
    })
    
    setTimeout(() => console.log('Timeout 3'), 0)
    
    console.log('End')
    
    // Execution order:
    // Start
    // End
    // Promise 1
    // Promise 2
    // Promise 3
    // Timeout 1
    // Timeout 2
    // Timeout 3
  }
}

// Initialize JavaScript fundamentals demonstration
const jsFundamentals = new JavaScriptFundamentals()

// Additional utility functions
function createDebouncedFunction(func, delay) {
  let timeoutId
  
  return function(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

function createThrottledFunction(func, limit) {
  let inThrottle
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Example usage
const debouncedSearch = createDebouncedFunction((query) => {
  console.log('Searching for:', query)
}, 300)

const throttledScroll = createThrottledFunction(() => {
  console.log('Scroll event')
}, 100)

// Test the functions
debouncedSearch('test')
debouncedSearch('test')
debouncedSearch('test') // Only this will execute after 300ms

// Simulate scroll events
for (let i = 0; i < 10; i++) {
  throttledScroll() // Only first call will execute immediately
}`
        }
      case 'th6': // Design Chess Game UI
        return {
          react: `// This question focuses on JavaScript implementation - React code not needed`,
          javascript: `// Chess Game UI with Drag and Drop
class ChessGame {
  constructor() {
    this.board = this.initializeBoard()
    this.currentPlayer = 'white'
    this.selectedPiece = null
    this.selectedPosition = null
    this.gameHistory = []
    this.init()
  }

  init() {
    this.createChessBoard()
    this.setupEventListeners()
    this.renderBoard()
  }

  initializeBoard() {
    // Standard chess starting position
    return [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'], // Black pieces
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // White pieces
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ]
  }

  createChessBoard() {
    document.body.innerHTML = \`
      <div class="chess-game">
        <div class="game-header">
          <h1>Chess Game</h1>
          <div class="game-info">
            <div class="current-player">
              Current Player: <span id="currentPlayer">White</span>
            </div>
            <div class="game-controls">
              <button id="resetGame">Reset Game</button>
              <button id="undoMove">Undo Move</button>
            </div>
          </div>
        </div>
        
        <div class="chess-board" id="chessBoard">
          <!-- Board squares will be generated here -->
        </div>
        
        <div class="game-status" id="gameStatus">
          Game in progress
        </div>
      </div>
      
      <style>
        .chess-game {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .game-header {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .game-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          gap: 20px;
        }
        
        .current-player {
          font-weight: bold;
          font-size: 18px;
        }
        
        .game-controls button {
          padding: 8px 16px;
          margin: 0 5px;
          border: none;
          border-radius: 4px;
          background-color: #007bff;
          color: white;
          cursor: pointer;
        }
        
        .game-controls button:hover {
          background-color: #0056b3;
        }
        
        .chess-board {
          display: grid;
          grid-template-columns: repeat(8, 60px);
          grid-template-rows: repeat(8, 60px);
          border: 3px solid #333;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        .chess-square {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          cursor: pointer;
          position: relative;
          user-select: none;
        }
        
        .chess-square.light {
          background-color: #f0d9b5;
        }
        
        .chess-square.dark {
          background-color: #b58863;
        }
        
        .chess-square.selected {
          background-color: #ffeb3b !important;
          box-shadow: inset 0 0 0 3px #ff9800;
        }
        
        .chess-square.possible-move {
          background-color: #4caf50 !important;
          opacity: 0.7;
        }
        
        .chess-square.possible-move::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          background-color: rgba(0,0,0,0.3);
          border-radius: 50%;
        }
        
        .chess-square.last-move {
          background-color: #ffc107 !important;
        }
        
        .chess-piece {
          transition: transform 0.2s ease;
        }
        
        .chess-piece:hover {
          transform: scale(1.1);
        }
        
        .chess-piece.dragging {
          transform: scale(1.2);
          z-index: 1000;
        }
        
        .game-status {
          margin-top: 20px;
          padding: 10px;
          background-color: #f8f9fa;
          border-radius: 4px;
          font-weight: bold;
        }
        
        .coordinates {
          position: absolute;
          font-size: 10px;
          font-weight: bold;
          color: #666;
        }
        
        .coordinates.file {
          bottom: 2px;
          right: 4px;
        }
        
        .coordinates.rank {
          top: 2px;
          left: 4px;
        }
      </style>
    \`
  }

  renderBoard() {
    const boardElement = document.getElementById('chessBoard')
    boardElement.innerHTML = ''
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement('div')
        square.className = \`chess-square \${(row + col) % 2 === 0 ? 'light' : 'dark'}\`
        square.dataset.row = row
        square.dataset.col = col
        
        // Add coordinates
        if (row === 7) {
          const fileLabel = document.createElement('div')
          fileLabel.className = 'coordinates file'
          fileLabel.textContent = String.fromCharCode(97 + col) // a-h
          square.appendChild(fileLabel)
        }
        
        if (col === 0) {
          const rankLabel = document.createElement('div')
          rankLabel.className = 'coordinates rank'
          rankLabel.textContent = 8 - row
          square.appendChild(rankLabel)
        }
        
        // Add piece if exists
        const piece = this.board[row][col]
        if (piece) {
          const pieceElement = document.createElement('div')
          pieceElement.className = 'chess-piece'
          pieceElement.textContent = this.getPieceSymbol(piece)
          pieceElement.draggable = true
          square.appendChild(pieceElement)
        }
        
        boardElement.appendChild(square)
      }
    }
  }

  getPieceSymbol(piece) {
    const symbols = {
      'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
      'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
    }
    return symbols[piece] || piece
  }

  setupEventListeners() {
    const boardElement = document.getElementById('chessBoard')
    
    // Click events for piece selection and movement
    boardElement.addEventListener('click', (e) => {
      const square = e.target.closest('.chess-square')
      if (!square) return
      
      const row = parseInt(square.dataset.row)
      const col = parseInt(square.dataset.col)
      
      this.handleSquareClick(row, col)
    })
    
    // Drag and drop events
    boardElement.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('chess-piece')) {
        const square = e.target.closest('.chess-square')
        const row = parseInt(square.dataset.row)
        const col = parseInt(square.dataset.col)
        
        this.handleDragStart(row, col, e)
      }
    })
    
    boardElement.addEventListener('dragover', (e) => {
      e.preventDefault()
    })
    
    boardElement.addEventListener('drop', (e) => {
      e.preventDefault()
      const square = e.target.closest('.chess-square')
      if (!square) return
      
      const row = parseInt(square.dataset.row)
      const col = parseInt(square.dataset.col)
      
      this.handleDrop(row, col)
    })
    
    // Game control buttons
    document.getElementById('resetGame').addEventListener('click', () => {
      this.resetGame()
    })
    
    document.getElementById('undoMove').addEventListener('click', () => {
      this.undoMove()
    })
  }

  handleSquareClick(row, col) {
    const piece = this.board[row][col]
    
    if (this.selectedPiece && this.selectedPosition) {
      // Attempt to move piece
      if (this.isValidMove(this.selectedPosition.row, this.selectedPosition.col, row, col)) {
        this.makeMove(this.selectedPosition.row, this.selectedPosition.col, row, col)
        this.clearSelection()
        this.switchPlayer()
      } else {
        this.clearSelection()
        if (piece && this.isPlayerPiece(piece)) {
          this.selectPiece(row, col)
        }
      }
    } else if (piece && this.isPlayerPiece(piece)) {
      this.selectPiece(row, col)
    }
  }

  handleDragStart(row, col, e) {
    const piece = this.board[row][col]
    if (piece && this.isPlayerPiece(piece)) {
      this.selectPiece(row, col)
      e.target.classList.add('dragging')
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/html', e.target.outerHTML)
    }
  }

  handleDrop(row, col) {
    if (this.selectedPiece && this.selectedPosition) {
      if (this.isValidMove(this.selectedPosition.row, this.selectedPosition.col, row, col)) {
        this.makeMove(this.selectedPosition.row, this.selectedPosition.col, row, col)
        this.switchPlayer()
      }
      this.clearSelection()
    }
    
    // Remove dragging class from all pieces
    document.querySelectorAll('.chess-piece').forEach(piece => {
      piece.classList.remove('dragging')
    })
  }

  selectPiece(row, col) {
    this.clearSelection()
    this.selectedPiece = this.board[row][col]
    this.selectedPosition = { row, col }
    
    const square = document.querySelector(\`[data-row="\${row}"][data-col="\${col}"]\`)
    square.classList.add('selected')
    
    // Highlight possible moves
    this.highlightPossibleMoves(row, col)
  }

  clearSelection() {
    this.selectedPiece = null
    this.selectedPosition = null
    
    document.querySelectorAll('.chess-square').forEach(square => {
      square.classList.remove('selected', 'possible-move')
    })
  }

  highlightPossibleMoves(row, col) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.isValidMove(row, col, r, c)) {
          const square = document.querySelector(\`[data-row="\${r}"][data-col="\${c}"]\`)
          square.classList.add('possible-move')
        }
      }
    }
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol]
    const targetPiece = this.board[toRow][toCol]
    
    // Can't move to same position
    if (fromRow === toRow && fromCol === toCol) return false
    
    // Can't capture own piece
    if (targetPiece && this.isPlayerPiece(targetPiece)) return false
    
    // Basic move validation (simplified)
    return this.isValidPieceMove(piece, fromRow, fromCol, toRow, toCol)
  }

  isValidPieceMove(piece, fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(toRow - fromRow)
    const colDiff = Math.abs(toCol - fromCol)
    
    switch (piece.toLowerCase()) {
      case 'p': // Pawn
        return this.isValidPawnMove(piece, fromRow, fromCol, toRow, toCol)
      case 'r': // Rook
        return (rowDiff === 0 || colDiff === 0) && this.isPathClear(fromRow, fromCol, toRow, toCol)
      case 'n': // Knight
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)
      case 'b': // Bishop
        return rowDiff === colDiff && this.isPathClear(fromRow, fromCol, toRow, toCol)
      case 'q': // Queen
        return (rowDiff === colDiff || rowDiff === 0 || colDiff === 0) && this.isPathClear(fromRow, fromCol, toRow, toCol)
      case 'k': // King
        return rowDiff <= 1 && colDiff <= 1
      default:
        return false
    }
  }

  isValidPawnMove(piece, fromRow, fromCol, toRow, toCol) {
    const isWhite = piece === piece.toUpperCase()
    const direction = isWhite ? -1 : 1
    const startRow = isWhite ? 6 : 1
    const rowDiff = toRow - fromRow
    const colDiff = Math.abs(toCol - fromCol)
    
    // Forward move
    if (colDiff === 0 && this.board[toRow][toCol] === null) {
      if (rowDiff === direction) return true
      if (fromRow === startRow && rowDiff === 2 * direction) return true
    }
    
    // Diagonal capture
    if (colDiff === 1 && rowDiff === direction && this.board[toRow][toCol] !== null) {
      return true
    }
    
    return false
  }

  isPathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0
    
    let currentRow = fromRow + rowStep
    let currentCol = fromCol + colStep
    
    while (currentRow !== toRow || currentCol !== toCol) {
      if (this.board[currentRow][currentCol] !== null) {
        return false
      }
      currentRow += rowStep
      currentCol += colStep
    }
    
    return true
  }

  isPlayerPiece(piece) {
    const isWhite = piece === piece.toUpperCase()
    return (this.currentPlayer === 'white' && isWhite) || (this.currentPlayer === 'black' && !isWhite)
  }

  makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol]
    const capturedPiece = this.board[toRow][toCol]
    
    // Save move for undo
    this.gameHistory.push({
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      piece: piece,
      capturedPiece: capturedPiece
    })
    
    // Make the move
    this.board[toRow][toCol] = piece
    this.board[fromRow][fromCol] = null
    
    // Highlight last move
    this.highlightLastMove(fromRow, fromCol, toRow, toCol)
    
    // Check for game end conditions
    this.checkGameEnd()
    
    this.renderBoard()
  }

  highlightLastMove(fromRow, fromCol, toRow, toCol) {
    // Remove previous highlights
    document.querySelectorAll('.chess-square').forEach(square => {
      square.classList.remove('last-move')
    })
    
    // Highlight new move
    const fromSquare = document.querySelector(\`[data-row="\${fromRow}"][data-col="\${fromCol}"]\`)
    const toSquare = document.querySelector(\`[data-row="\${toRow}"][data-col="\${toCol}"]\`)
    
    if (fromSquare) fromSquare.classList.add('last-move')
    if (toSquare) toSquare.classList.add('last-move')
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white'
    document.getElementById('currentPlayer').textContent = this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)
  }

  checkGameEnd() {
    // Simplified game end check
    const whiteKing = this.findKing('K')
    const blackKing = this.findKing('k')
    
    if (!whiteKing) {
      this.endGame('Black wins!')
    } else if (!blackKing) {
      this.endGame('White wins!')
    }
  }

  findKing(kingPiece) {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col] === kingPiece) {
          return { row, col }
        }
      }
    }
    return null
  }

  endGame(message) {
    document.getElementById('gameStatus').textContent = message
    document.getElementById('gameStatus').style.backgroundColor = '#d4edda'
    document.getElementById('gameStatus').style.color = '#155724'
  }

  resetGame() {
    this.board = this.initializeBoard()
    this.currentPlayer = 'white'
    this.selectedPiece = null
    this.selectedPosition = null
    this.gameHistory = []
    
    document.getElementById('currentPlayer').textContent = 'White'
    document.getElementById('gameStatus').textContent = 'Game in progress'
    document.getElementById('gameStatus').style.backgroundColor = '#f8f9fa'
    document.getElementById('gameStatus').style.color = '#000'
    
    this.renderBoard()
  }

  undoMove() {
    if (this.gameHistory.length === 0) return
    
    const lastMove = this.gameHistory.pop()
    const { from, to, piece, capturedPiece } = lastMove
    
    // Restore the move
    this.board[from.row][from.col] = piece
    this.board[to.row][to.col] = capturedPiece
    
    this.switchPlayer()
    this.renderBoard()
  }
}

// Initialize the chess game
const chessGame = new ChessGame()`
        }
      default:
        return {
          react: `// Solution for ${question.title}
import React from 'react'

const Solution = () => {
  return (
    <div>
      <h2>${question.title}</h2>
      <p>This is a placeholder solution. The actual implementation would depend on the specific requirements.</p>
    </div>
  )
}

export default Solution`,
          javascript: `// Solution for ${question.title}
function solution() {
  // Implementation would go here
  console.log('Solution for ${question.title}')
}

// Example usage
solution()`
        }
    }
  }

  const solutionCode = getSolutionCode(question)

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />
      
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/company-sheets-frontend/${topicId}`)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to {topic.name}
              </button>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{topic.logo}</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{question.title}</h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTopicColor(question.category)}`}>
                      {question.category}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{question.frequency}% frequency</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={toggleQuestionCompletion}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
              <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Problem Description */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Problem Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {question.description}
              </p>
            </div>

            {/* Solution */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Solution
              </h2>
              
              {/* React Solution */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">React Implementation</h3>
                  <button
                    onClick={() => copyCode(solutionCode.react, 'react')}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    {copiedCode === 'react' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copiedCode === 'react' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code>{solutionCode.react}</code>
                </pre>
              </div>

              {/* JavaScript Solution */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">JavaScript Implementation</h3>
                  <button
                    onClick={() => copyCode(solutionCode.javascript, 'javascript')}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    {copiedCode === 'javascript' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copiedCode === 'javascript' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code>{solutionCode.javascript}</code>
                </pre>
              </div>
            </div>

            {/* Working Example */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Working Example
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-4">
                  Here's a simple example demonstrating the core concept:
                </p>
                <div className="bg-white p-4 rounded border">
                  <p className="text-sm text-gray-500 mb-2">Example Output:</p>
                  <div className="font-mono text-sm">
                    {question.id === '1' && (
                      <div>
                        <div>✅ WebSocket connection established</div>
                        <div>📨 Message sent: "Hello World"</div>
                        <div>📥 Message received: "Hello World"</div>
                      </div>
                    )}
                    {question.id === '2' && (
                      <div>
                        <div>📊 Rendering 1000 items</div>
                        <div>⚡ Only 20 DOM elements created</div>
                        <div>🎯 Smooth scrolling at 60fps</div>
                      </div>
                    )}
                    {question.id === '3' && (
                      <div>
                        <div>📁 File selected: document.pdf</div>
                        <div>✅ File validation passed</div>
                        <div>📤 Upload progress: 100%</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hints */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Hints
              </h3>
              <ul className="space-y-2">
                {question.hints.map((hint, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    {hint}
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ExternalLink className="w-5 h-5 mr-2" />
                Resources & References
              </h3>
              <div className="space-y-2">
                {question.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 inline mr-2" />
                    {resource}
                  </a>
                ))}
              </div>
            </div>

            {/* Problem Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Problem Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Companies:</span>
                  <p className="text-sm text-gray-900">{question.companies.join(', ')}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Category:</span>
                  <p className="text-sm text-gray-900">{question.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Interview Type:</span>
                  <p className="text-sm text-gray-900">{question.interviewType}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Difficulty:</span>
                  <p className="text-sm text-gray-900">{question.difficulty}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Frequency:</span>
                  <p className="text-sm text-gray-900">{question.frequency}% of interviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default FrontendSolutionPage
