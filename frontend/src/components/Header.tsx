import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Code, User, LogOut, Settings, Calendar, Users, ChevronDown, FileText, Shield, Mail, RotateCcw, Package } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface HeaderProps {
  showUserMenu?: boolean
}

const Header: React.FC<HeaderProps> = ({ showUserMenu = true }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLegalDropdownOpen, setIsLegalDropdownOpen] = useState(false)
  const legalDropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsDropdownOpen(false)
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (legalDropdownRef.current && !legalDropdownRef.current.contains(event.target as Node)) {
        setIsLegalDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const href = e.currentTarget.getAttribute('href')
    if (href && href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        const headerOffset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }
  }

  const getNavigationItems = () => {
    if (!user) {
      return (
        <>
          <Link to="#pricing" onClick={handleSectionClick} className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
          <Link to="#features" onClick={handleSectionClick} className="text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
          <Link to="#faq" onClick={handleSectionClick} className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</Link>
          <Link to="/contact" className={`transition-colors ${isActive('/contact') ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}>Contact</Link>
          
          {/* Legal/Resources Mega Menu */}
          <div className="relative" ref={legalDropdownRef}>
            <button
              onClick={() => setIsLegalDropdownOpen(!isLegalDropdownOpen)}
              className={`flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors ${
                ['/terms', '/privacy', '/shipping', '/cancellation'].includes(location.pathname) 
                  ? 'text-primary-600 font-medium' 
                  : ''
              }`}
            >
              <span>Legal</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isLegalDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isLegalDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <Link
                  to="/contact"
                  onClick={() => setIsLegalDropdownOpen(false)}
                  className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
                    isActive('/contact') ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                  }`}
                >
                  <Mail className="w-4 h-4 mr-3" />
                  <span>Contact Us</span>
                </Link>
                <Link
                  to="/terms"
                  onClick={() => setIsLegalDropdownOpen(false)}
                  className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
                    isActive('/terms') ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                  }`}
                >
                  <FileText className="w-4 h-4 mr-3" />
                  <span>Terms & Conditions</span>
                </Link>
                <Link
                  to="/privacy"
                  onClick={() => setIsLegalDropdownOpen(false)}
                  className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
                    isActive('/privacy') ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                  }`}
                >
                  <Shield className="w-4 h-4 mr-3" />
                  <span>Privacy Policy</span>
                </Link>
                <Link
                  to="/shipping"
                  onClick={() => setIsLegalDropdownOpen(false)}
                  className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
                    isActive('/shipping') ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                  }`}
                >
                  <Package className="w-4 h-4 mr-3" />
                  <span>Shipping Policy</span>
                </Link>
                <Link
                  to="/cancellation"
                  onClick={() => setIsLegalDropdownOpen(false)}
                  className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
                    isActive('/cancellation') ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                  }`}
                >
                  <RotateCcw className="w-4 h-4 mr-3" />
                  <span>Cancellation & Refunds</span>
                </Link>
              </div>
            )}
          </div>
        </>
      )
    }

    // User-specific navigation when logged in
    return (
      <>
        <Link to="/contact" className={`transition-colors ${isActive('/contact') ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}>Contact</Link>
        
        {/* Legal/Resources Mega Menu */}
        <div className="relative" ref={legalDropdownRef}>
          <button
            onClick={() => setIsLegalDropdownOpen(!isLegalDropdownOpen)}
            className={`flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors ${
              ['/terms', '/privacy', '/shipping', '/cancellation'].includes(location.pathname) 
                ? 'text-primary-600 font-medium' 
                : ''
            }`}
          >
            <span>Legal</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isLegalDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isLegalDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
              <Link
                to="/contact"
                onClick={() => setIsLegalDropdownOpen(false)}
                className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
                  isActive('/contact') ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                }`}
              >
                <Mail className="w-4 h-4 mr-3" />
                <span>Contact Us</span>
              </Link>
              <Link
                to="/terms"
                onClick={() => setIsLegalDropdownOpen(false)}
                className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
                  isActive('/terms') ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                }`}
              >
                <FileText className="w-4 h-4 mr-3" />
                <span>Terms & Conditions</span>
              </Link>
              <Link
                to="/privacy"
                onClick={() => setIsLegalDropdownOpen(false)}
                className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
                  isActive('/privacy') ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                }`}
              >
                <Shield className="w-4 h-4 mr-3" />
                <span>Privacy Policy</span>
              </Link>
              <Link
                to="/shipping"
                onClick={() => setIsLegalDropdownOpen(false)}
                className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
                  isActive('/shipping') ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                }`}
              >
                <Package className="w-4 h-4 mr-3" />
                <span>Shipping Policy</span>
              </Link>
              <Link
                to="/cancellation"
                onClick={() => setIsLegalDropdownOpen(false)}
                className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
                  isActive('/cancellation') ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                }`}
              >
                <RotateCcw className="w-4 h-4 mr-3" />
                <span>Cancellation & Refunds</span>
              </Link>
            </div>
          )}
        </div>
      </>
    )
  }

  const getAuthButtons = () => {
    if (!user) {
      return (
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
          <Link to="/register" className="btn-primary">Register</Link>
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
                to='/dashboard'
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

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="#pricing" onClick={handleSectionClick} className="block px-3 py-2 text-gray-600 hover:text-gray-900">Pricing</Link>
          <Link to="#features" onClick={handleSectionClick} className="block px-3 py-2 text-gray-600 hover:text-gray-900">Features</Link>
          <Link to="#faq" onClick={handleSectionClick} className="block px-3 py-2 text-gray-600 hover:text-gray-900">FAQ</Link>
          <Link to="/contact" className={`block px-3 py-2 ${isActive('/contact') ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}>Contact</Link>
          <div className="px-3 py-2">
            <div className="font-medium text-gray-700 mb-2">Legal</div>
            <div className="ml-4 space-y-1">
              <Link to="/contact" className={`block px-3 py-2 rounded-md ${isActive('/contact') ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}>Contact Us</Link>
              <Link to="/terms" className={`block px-3 py-2 rounded-md ${isActive('/terms') ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}>Terms & Conditions</Link>
              <Link to="/privacy" className={`block px-3 py-2 rounded-md ${isActive('/privacy') ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}>Privacy Policy</Link>
              <Link to="/shipping" className={`block px-3 py-2 rounded-md ${isActive('/shipping') ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}>Shipping Policy</Link>
              <Link to="/cancellation" className={`block px-3 py-2 rounded-md ${isActive('/cancellation') ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}>Cancellation & Refunds</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
