import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from '../services/api'

interface User {
  id: string
  name: string
  email: string
  role: 'candidate' | 'mentor' | 'admin'
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  setAuthData: (token: string, userData: User) => void
}

interface RegisterData {
  name: string
  email: string
  password: string
  role: 'candidate' | 'mentor'
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Clean up any invalid tokens
    const token = localStorage.getItem('token')
    if (token === 'undefined' || token === 'null' || !token) {
      localStorage.removeItem('token')
      setLoading(false)
      return
    }
    
    if (token) {
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('AuthContext - checkAuth - Token from localStorage:', token)
      
      if (!token || token === 'undefined' || token === 'null') {
        console.log('AuthContext - checkAuth - No valid token, skipping API call')
        localStorage.removeItem('token')
        setLoading(false)
        return
      }
      
      console.log('AuthContext - checkAuth - Making API call to get current user')
      const response = await authAPI.getCurrentUser()
      console.log('AuthContext - checkAuth - API response:', response)
      
      setUser(response.user)
    } catch (error) {
      console.error('AuthContext - checkAuth - Error:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const setAuthData = (token: string, userData: User) => {
    if (token && token !== 'undefined' && token !== 'null') {
      localStorage.setItem('token', token)
      setUser(userData)
    } else {
      localStorage.removeItem('token')
      setUser(null)
      throw new Error('Invalid token received from server')
    }
  }

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext - Login attempt for:', email)
      const response = await authAPI.login({ email, password })
      console.log('AuthContext - Login response:', response)
      
      const { token, user } = response
      console.log('AuthContext - Extracted token:', token)
      console.log('AuthContext - Extracted user:', user)
      setAuthData(token, user)
      console.log('AuthContext - Token stored in localStorage')
    } catch (error: any) {
      console.error('AuthContext - Login error:', error)
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      console.log('AuthContext - Register attempt for:', userData.email)
      const response = await authAPI.register({
        firstName: userData.name.split(' ')[0],
        lastName: userData.name.split(' ')[1] || '',
        email: userData.email,
        password: userData.password,
        role: userData.role
      })
      console.log('AuthContext - Register response:', response)
      
      const { token, user } = response;
      console.log('AuthContext - Extracted token:', token)
      console.log('AuthContext - Extracted user:', user)
      setAuthData(token, user)
      console.log('AuthContext - Token stored in localStorage')
    } catch (error: any) {
      console.error('AuthContext - Register error:', error)
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    setAuthData,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 