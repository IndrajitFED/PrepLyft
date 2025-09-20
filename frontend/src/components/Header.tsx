import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Code, User, LogOut, Settings, Calendar, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface HeaderProps {
  showUserMenu?: boolean
}

const Header: React.FC<HeaderProps> = ({ showUserMenu = true }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsDropdownOpen(false)
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const getNavigationItems = () => {
    if (!user) {
      return (
        <>
          <Link to="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
          <Link to="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
          <Link to="#reviews" className="text-gray-600 hover:text-gray-900">Reviews</Link>
        </>
      )
    }

    // User-specific navigation based on role
    if (user.role === 'mentor') {
      return (
        <>
          <Link 
            to="/mentor" 
            className={`text-gray-600 hover:text-gray-900 ${isActive('/mentor') ? 'text-primary-600 font-medium' : ''}`}
          >
            Dashboard
          </Link>
          <Link to="#calendar" className="text-gray-600 hover:text-gray-900">Calendar</Link>
        </>
      )
    } else if (user.role === 'candidate') {
      return (
        <>
          <Link 
            to="/candidate" 
            className={`text-gray-600 hover:text-gray-900 ${isActive('/candidate') ? 'text-primary-600 font-medium' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/booking" 
            className={`text-gray-600 hover:text-gray-900 ${isActive('/booking') ? 'text-primary-600 font-medium' : ''}`}
          >
            Book Session
          </Link>
        </>
      )
    }

    return (
      <>
        <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
      </>
    )
  }

  const getAuthButtons = () => {
    if (!user) {
      return (
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
          <Link to="/register" className="btn-primary">Start Free Trial</Link>
        </div>
      )
    }

    return (
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium">{user.name}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                <p className="text-xs text-primary-600 capitalize">{user.role}</p>
              </div>
              
              <Link
                to={user.role === 'mentor' ? '/mentor' : user.role === 'candidate' ? '/candidate' : '/dashboard'}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Calendar className="w-4 h-4 mr-3" />
                Dashboard
              </Link>

              {user.role === 'candidate' && (
                <Link
                  to="/booking"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Users className="w-4 h-4 mr-3" />
                  Book Session
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Settings className="w-4 h-4 mr-3" />
                Profile Settings
              </Link>

              <div className="border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MockAce</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {getNavigationItems()}
          </nav>
          
          {showUserMenu && getAuthButtons()}
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {getNavigationItems()}
        </div>
      </div>
    </header>
  )
}

export default Header
