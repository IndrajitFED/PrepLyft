import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    console.log('API Request Interceptor - Token:', token)
    console.log('API Request Interceptor - URL:', config.url)
    
    if (token && token !== 'undefined' && token !== 'null' && token.trim() !== '') {
      config.headers.Authorization = `Bearer ${token}`
      console.log('API Request Interceptor - Authorization header set:', config.headers.Authorization)
    } else {
      console.log('API Request Interceptor - No valid token found in localStorage')
      // Remove any existing Authorization header if no valid token
      delete config.headers.Authorization
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Authentication API functions
export const authAPI = {
  // Register a new user
  register: async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    role: 'candidate' | 'mentor'
  }) => {
    const response = await api.post('/auth/register', {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      password: userData.password,
      role: userData.role
    })
    return response.data.data // Extract from nested data structure
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials)
    return response.data.data // Extract from nested data structure
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data.data // Extract from nested data structure
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh')
    return response.data.data // Extract from nested data structure
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data.data // Extract from nested data structure
  }
}

// User management API functions
export const userAPI = {
  // Get user profile
  getProfile: async (userId?: string) => {
    const url = userId ? `/users/${userId}` : '/users/profile'
    const response = await api.get(url)
    return response.data
  },

  // Update user profile
  updateProfile: async (userData: Partial<{
    name: string
    bio: string
    skills: string[]
    experience: number
    company: string
    position: string
    phone: string
    avatar: string
  }>) => {
    const response = await api.put('/users/profile', userData)
    return response.data
  },

  // Get all users (admin only)
  getAllUsers: async (params?: {
    page?: number
    limit?: number
    role?: string
    search?: string
  }) => {
    const response = await api.get('/users', { params })
    return response.data
  }
}

// Session management API functions
export const sessionAPI = {
  // Get available sessions
  getAvailableSessions: async (params?: {
    page?: number
    limit?: number
    mentorId?: string
    date?: string
    skills?: string[]
  }) => {
    const response = await api.get('/sessions/available', { params })
    return response.data
  },

  // Book a session
  bookSession: async (sessionData: {
    mentorId: string
    date: string
    time: string
    duration: number
    type: string
    notes?: string
  }) => {
    const response = await api.post('/sessions/book', sessionData)
    return response.data
  },

  // Get user sessions
  getUserSessions: async (params?: {
    page?: number
    limit?: number
    status?: string
    type?: 'upcoming' | 'past' | 'all'
  }) => {
    const response = await api.get('/sessions/user', { params })
    return response.data
  },

  // Get mentor availability for a date range
  getMentorAvailability: async (mentorId: string, params: {
    startDate: string
    endDate: string
  }) => {
    const response = await api.get(`/mentors/${mentorId}/availability`, { params })
    return response.data
  },

  // Get available time slots for a specific date
  getAvailableTimeSlots: async (mentorId: string, date: string) => {
    const response = await api.get(`/mentors/${mentorId}/availability/${date}`)
    return response.data
  }
}

// Mentor management API functions
export const mentorAPI = {
  // Get all mentors
  getAllMentors: async (params?: {
    page?: number
    limit?: number
    skills?: string[]
    rating?: number
    experience?: number
    search?: string
  }) => {
    const response = await api.get('/mentors', { params })
    return response.data
  },

  // Get mentor profile
  getMentorProfile: async (mentorId: string) => {
    const response = await api.get(`/mentors/${mentorId}`)
    return response.data
  },

  // Get mentor availability
  getMentorAvailability: async (mentorId: string, date?: string) => {
    const response = await api.get(`/mentors/${mentorId}/availability`, {
      params: { date }
    })
    return response.data
  }
}

// Notification API functions
export const notificationAPI = {
  // Get user notifications
  getUserNotifications: async (params?: {
    page?: number
    limit?: number
    read?: boolean
  }) => {
    const response = await api.get('/notifications', { params })
    return response.data
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    const response = await api.put(`/notifications/${notificationId}/read`)
    return response.data
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all')
    return response.data
  }
} 