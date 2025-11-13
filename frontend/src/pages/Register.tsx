import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { authAPI } from '../services/api'
import Header from '../components/Header'
import Footer from '../components/Footer'

declare global {
  interface Window {
    google: any;
  }
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  role: 'candidate' | 'mentor'
  agreeToTerms: boolean
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

const STARRY_BACKGROUND =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160" fill="none"%3E%3Ccircle cx="6" cy="10" r="1.2" fill="%23FFFFFF" opacity="0.7"/%3E%3Ccircle cx="120" cy="34" r="0.9" fill="%23FFFFFF" opacity="0.5"/%3E%3Ccircle cx="48" cy="120" r="1.6" fill="%23FFFFFF" opacity="0.65"/%3E%3Ccircle cx="150" cy="90" r="1" fill="%23FFFFFF" opacity="0.45"/%3E%3Ccircle cx="90" cy="60" r="0.8" fill="%23FFFFFF" opacity="0.6"/%3E%3Ccircle cx="20" cy="140" r="0.8" fill="%23FFFFFF" opacity="0.4"/%3E%3C/svg%3E'

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate',
    agreeToTerms: false
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()
  const { register, setAuthData } = useAuth()

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
                  setIsLoading(true)
                  const result = await authAPI.googleLogin(response.credential)
                  setAuthData(result.token, result.user)

                  setSuccessMessage('Registration successful! Redirecting...')

                  setTimeout(() => {
                    const role = result.user.role
                    if (role === 'mentor') navigate('/mentor')
                    else navigate('/dashboard')
                  }, 1500)
                } catch (err: any) {
                  setErrors({ general: err.response?.data?.message || 'Google Sign-In failed' })
                } finally {
                  setIsLoading(false)
                }
              }
            })

            // Render the Google button
            setTimeout(() => {
              window.google.accounts.id.renderButton(
                document.getElementById('google-signin-button'),
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

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.agreeToTerms) {
      newErrors.general = 'You must agree to the Terms of Service and Privacy Policy'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous messages
    setErrors({})
    setSuccessMessage('')

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: formData.role
      })

      setSuccessMessage('Registration successful! Redirecting to dashboard...')
      
              // Redirect after a short delay
        setTimeout(() => {
          // Redirect based on user role
          const role = formData.role
          switch (role) {
            case 'mentor':
              navigate('/mentor')
              break
            case 'candidate':
            default:
              navigate('/dashboard')
              break
          }
        }, 1500)
    } catch (error: any) {
      console.error('Registration error:', error)
      
      if (error.message) {
        setErrors({ general: error.message })
      } else {
        setErrors({ general: 'Registration failed. Please try again.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#06020f] text-white relative overflow-hidden">
      <Header showUserMenu={false} />
      <main className="flex-1 flex items-center justify-center px-4 py-16 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0420] via-[#070114] to-[#03000a]" />
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.35),transparent_55%)]" />
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_25%_130%,rgba(59,130,246,0.35),transparent_60%)]" />
          <div
            className="absolute inset-0 opacity-35"
            style={{ backgroundImage: `url(${STARRY_BACKGROUND})`, backgroundSize: '220px 220px' }}
          />
        </div>

        <div className="relative w-full max-w-3xl">
          <div className="absolute -inset-12 bg-gradient-to-r from-purple-500/25 via-indigo-500/10 to-blue-500/25 blur-3xl" />
          <div className="relative rounded-3xl border border-white/10 bg-white/10 backdrop-blur-[28px] shadow-[0_25px_80px_rgba(59,7,126,0.45)] px-8 py-10 sm:px-12 sm:py-12">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">Join MockAce</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Create your account</h1>
              <p className="mt-2 text-sm text-white/60">
                Start your 7-day free trial. Unlock interview roadmaps, mentor feedback, and curated question banks.
              </p>
            </div>

            {successMessage && (
              <div className="mb-6 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              </div>
            )}

            {errors.general && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <span>{errors.general}</span>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-white/80">
                    First name
                  </label>
                  <div className="mt-2 relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-white/40" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400 ${
                        errors.firstName ? 'border-red-400/60 focus:border-red-400 focus:ring-red-500/40' : ''
                      }`}
                      placeholder="Enter your first name"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-300">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-white/80">
                    Last name
                  </label>
                  <div className="mt-2 relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-white/40" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400 ${
                        errors.lastName ? 'border-red-400/60 focus:border-red-400 focus:ring-red-500/40' : ''
                      }`}
                      placeholder="Enter your last name"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-300">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80">
                  Email address
                </label>
                <div className="mt-2 relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
                    className={`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400 ${
                      errors.email ? 'border-red-400/60 focus:border-red-400 focus:ring-red-500/40' : ''
                    }`}
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-300">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-white/80">
                  I want to
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400"
                  disabled={isLoading}
                >
                  <option className="text-gray-900" value="candidate">
                    Practice interviews as a candidate
                  </option>
                  <option className="text-gray-900" value="mentor">
                    Become a mentor
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white/80">
                    Password
                  </label>
                  <div className="mt-2 relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-white/40" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 pr-12 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400 ${
                        errors.password ? 'border-red-400/60 focus:border-red-400 focus:ring-red-500/40' : ''
                      }`}
                      placeholder="Create a password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white/70 transition"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-white/40">Must be at least 8 characters long</p>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-300">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80">
                    Confirm password
                  </label>
                  <div className="mt-2 relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-white/40" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 pr-12 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400 ${
                        errors.confirmPassword ? 'border-red-400/60 focus:border-red-400 focus:ring-red-500/40' : ''
                      }`}
                      placeholder="Re-enter your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white/70 transition"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-300">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start text-sm text-white/60">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-white/40 bg-white/10 text-purple-400 focus:ring-purple-500/60"
                  disabled={isLoading}
                />
                <label htmlFor="agreeToTerms" className="ml-3 leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-purple-300 hover:text-purple-200 transition">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-purple-300 hover:text-purple-200 transition">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 py-3 text-sm font-semibold tracking-wide shadow-lg shadow-purple-500/30 transition hover:shadow-purple-500/50 ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Creating account…</span>
                  </div>
                ) : (
                  'Create account'
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
                  id="google-signin-button"
                  className="w-full [&_div]:w-full [&_div]:justify-center [&_div]:rounded-xl [&_div]:bg-white [&_div]:py-2.5 [&_div]:shadow-lg [&_div]:hover:shadow-xl"
                />
              </div>
            </div>

            <p className="mt-10 text-center text-sm text-white/60">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-purple-300 hover:text-purple-200 transition">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Register
