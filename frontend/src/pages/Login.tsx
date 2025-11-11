import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { authAPI } from '../services/api'
import Header from '../components/Header'
import Footer from '../components/Footer'

declare global {
  interface Window {
    google: any;
  }
}

const STARRY_BACKGROUND =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160" fill="none"%3E%3Ccircle cx="6" cy="10" r="1.2" fill="%23FFFFFF" opacity="0.7"/%3E%3Ccircle cx="120" cy="34" r="0.9" fill="%23FFFFFF" opacity="0.5"/%3E%3Ccircle cx="48" cy="120" r="1.6" fill="%23FFFFFF" opacity="0.65"/%3E%3Ccircle cx="150" cy="90" r="1" fill="%23FFFFFF" opacity="0.45"/%3E%3Ccircle cx="90" cy="60" r="0.8" fill="%23FFFFFF" opacity="0.6"/%3E%3Ccircle cx="20" cy="140" r="0.8" fill="%23FFFFFF" opacity="0.4"/%3E%3C/svg%3E'

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  })
  
  const navigate = useNavigate()
  const { login } = useAuth()

  // Load Google Identity Services
  useEffect(() => {
    const loadGoogleAuth = async () => {
      try {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
        if (!clientId) {
          console.log('Google Client ID not configured')
          return
        }

        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        document.head.appendChild(script)

        script.onload = () => {
          if (window.google) {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: async (response: any) => {
                try {
                  setLoading(true)
                  const result = await authAPI.googleLogin(response.credential)
                  localStorage.setItem('token', result.token)
                  
                  const role = result.user.role
                  if (role === 'mentor') navigate('/mentor')
                  else if (role === 'admin') navigate('/admin')
                  else navigate('/dashboard')
                } catch (err: any) {
                  setError(err.response?.data?.message || 'Google Sign-In failed')
                }
              }
            })

            // Render the Google button
            setTimeout(() => {
              window.google.accounts.id.renderButton(
                document.getElementById('google-signin-login'),
                { theme: 'outline', size: 'large', width: '100%', text: 'signin_with' }
              )
            }, 100)
          }
        }
      } catch (error) {
        console.error('Failed to load Google Auth:', error)
      }
    }

    loadGoogleAuth()
  }, [])

  const validateForm = () => {
    const errors = { email: '', password: '' }
    let isValid = true

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
      isValid = false
    }

    if (!formData.password) {
      errors.password = 'Password is required'
      isValid = false
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      await login(formData.email, formData.password)
      
      // Get user data to determine role-based redirect
      try {
        const userData = await authAPI.getCurrentUser()
        const role = userData.user.role
        
        // Redirect based on user role
        switch (role) {
          case 'admin':
            navigate('/admin')
            break
          case 'mentor':
            navigate('/mentor')
            break
          case 'candidate':
          default:
            navigate('/dashboard')
            break
        }
      } catch (roleError) {
        // Fallback to dashboard if role fetch fails
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // Clear general error
    if (error) {
      setError('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#06020f] text-white relative overflow-hidden">
      <Header showUserMenu={false} />
      <main className="flex-1 flex items-center justify-center px-4 py-16 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0420] via-[#070114] to-[#03000a]" />
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.35),transparent_55%)]" />
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_75%_120%,rgba(59,130,246,0.35),transparent_60%)]" />
          <div
            className="absolute inset-0 opacity-35"
            style={{ backgroundImage: `url(${STARRY_BACKGROUND})`, backgroundSize: '220px 220px' }}
          />
        </div>

        <div className="relative w-full max-w-xl">
          <div className="absolute -inset-10 bg-gradient-to-r from-purple-500/20 via-indigo-500/10 to-blue-500/20 blur-3xl" />
          <div className="relative rounded-3xl border border-white/10 bg-white/10 backdrop-blur-[28px] shadow-[0_25px_80px_rgba(59,7,126,0.45)] px-8 py-10 sm:px-12 sm:py-12">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">Welcome Back</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Sign in</h1>
              <p className="mt-2 text-sm text-white/60">
                Access your dashboard, resume mock interviews, and track your progress.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80">
                  Email address
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-white/40" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 text-sm text-white placeholder:text-white/40 transition focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400 ${
                      formErrors.email ? 'border-red-400/60 focus:border-red-400 focus:ring-red-500/40' : ''
                    }`}
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-300">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80">
                  Password
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/40" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 pr-12 text-sm text-white placeholder:text-white/40 transition focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400 ${
                      formErrors.password ? 'border-red-400/60 focus:border-red-400 focus:ring-red-500/40' : ''
                    }`}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white/70 transition"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-300">{formErrors.password}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-white/60">
                <label className="inline-flex items-center space-x-2">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="form-checkbox h-4 w-4 rounded border-white/30 bg-white/10 text-purple-400 focus:ring-purple-500/60"
                    disabled={loading}
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-purple-300 hover:text-purple-200 transition">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className={`w-full rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 py-3 text-sm font-semibold tracking-wide shadow-lg shadow-purple-500/30 transition hover:shadow-purple-500/50 ${
                  loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Signing in…</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center">
                <span className="flex-1 h-px bg-white/10" />
                <span className="px-4 text-xs uppercase tracking-[0.4em] text-white/40">or</span>
                <span className="flex-1 h-px bg-white/10" />
              </div>
              <div className="mt-6">
                <div
                  id="google-signin-login"
                  className="w-full [&_div]:w-full [&_div]:justify-center [&_div]:rounded-xl [&_div]:bg-white [&_div]:py-2.5 [&_div]:shadow-lg [&_div]:hover:shadow-xl"
                />
              </div>
            </div>

            <p className="mt-10 text-center text-sm text-white/60">
              Don’t have an account?{' '}
              <Link to="/register" className="font-semibold text-purple-300 hover:text-purple-200 transition">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Login
