import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Code, User, LogOut, Settings, Calendar, Users, ChevronDown, FileText, Shield, Mail, RotateCcw, Package, Moon, Sun } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

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
  const { theme, toggleTheme } = useTheme()

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
      // If we're not on the landing page, navigate there first with hash
      if (location.pathname !== '/') {
        navigate(`/${href}`)
      } else {
        // We're already on the landing page, just scroll
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
  }

  const getNavigationItems = () => {
    if (!user) {
      return (
        <>
          <Link to="#pricing" onClick={handleSectionClick} className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
          <Link to="#features" onClick={handleSectionClick} className="text-gray-300 hover:text-white transition-colors">Features</Link>
          <Link to="/blog" className={`transition-colors ${isActive('/blog') ? 'text-purple-400 font-medium' : 'text-gray-300 hover:text-white'}`}>Blog</Link>
          <Link to="/about" className={`transition-colors ${isActive('/about') ? 'text-purple-400 font-medium' : 'text-gray-300 hover:text-white'}`}>About</Link>
          <Link to="/contact" className={`transition-colors ${isActive('/contact') ? 'text-purple-400 font-medium' : 'text-gray-300 hover:text-white'}`}>Contact</Link>
          
          {/* Legal/Resources Mega Menu */}
          {/* <div className="relative" ref={legalDropdownRef}>
            <button
              onClick={() => setIsLegalDropdownOpen(!isLegalDropdownOpen)}
              className={`flex items-center space-x-1 text-gray-300 hover:text-white transition-colors ${
                ['/terms', '/privacy', '/shipping', '/cancellation'].includes(location.pathname) 
                  ? 'text-purple-400 font-medium' 
                  : ''
              }`}
            >
              <span>Legal</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isLegalDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isLegalDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 glass-dark backdrop-blur-xl rounded-lg border border-white/10 py-2 z-50">
                <Link
                  to="/terms"
                  onClick={() => setIsLegalDropdownOpen(false)}
                  className={`flex items-center px-4 py-3 hover:bg-white/10 transition-colors ${
                    isActive('/terms') ? 'bg-white/10 text-purple-400' : 'text-gray-300'
                  }`}
                >
                  <FileText className="w-4 h-4 mr-3" />
                  <span>Terms & Conditions</span>
                </Link>
                <Link
                  to="/privacy"
                  onClick={() => setIsLegalDropdownOpen(false)}
                  className={`flex items-center px-4 py-3 hover:bg-white/10 transition-colors ${
                    isActive('/privacy') ? 'bg-white/10 text-purple-400' : 'text-gray-300'
                  }`}
                >
                  <Shield className="w-4 h-4 mr-3" />
                  <span>Privacy Policy</span>
                </Link>
                <Link
                  to="/shipping"
                  onClick={() => setIsLegalDropdownOpen(false)}
                  className={`flex items-center px-4 py-3 hover:bg-white/10 transition-colors ${
                    isActive('/shipping') ? 'bg-white/10 text-purple-400' : 'text-gray-300'
                  }`}
                >
                  <Package className="w-4 h-4 mr-3" />
                  <span>Shipping Policy</span>
                </Link>
                <Link
                  to="/cancellation"
                  onClick={() => setIsLegalDropdownOpen(false)}
                  className={`flex items-center px-4 py-3 hover:bg-white/10 transition-colors ${
                    isActive('/cancellation') ? 'bg-white/10 text-purple-400' : 'text-gray-300'
                  }`}
                >
                  <RotateCcw className="w-4 h-4 mr-3" />
                  <span>Cancellation & Refunds</span>
                </Link>
              </div>
            )}
          </div> */}
        </>
      )
    }

    // User-specific navigation when logged in
    return (
      <>
        <Link to="/blog" className={`transition-colors ${isActive('/blog') ? 'text-purple-400 font-medium' : 'text-gray-300 hover:text-white'}`}>Blog</Link>
        <Link to="/about" className={`transition-colors ${isActive('/about') ? 'text-purple-400 font-medium' : 'text-gray-300 hover:text-white'}`}>About</Link>
        <Link to="/contact" className={`transition-colors ${isActive('/contact') ? 'text-purple-400 font-medium' : 'text-gray-300 hover:text-white'}`}>Contact</Link>
        
        {/* Legal/Resources Mega Menu */}
        <div className="relative" ref={legalDropdownRef}>
          <button
            onClick={() => setIsLegalDropdownOpen(!isLegalDropdownOpen)}
            className={`flex items-center space-x-1 text-gray-300 hover:text-white transition-colors ${
              ['/terms', '/privacy', '/shipping', '/cancellation'].includes(location.pathname) 
                ? 'text-purple-400 font-medium' 
                : ''
            }`}
          >
            <span>Legal</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isLegalDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isLegalDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 glass-dark backdrop-blur-xl rounded-lg border border-white/10 py-2 z-[200] pointer-events-auto shadow-xl">
              <Link
                to="/contact"
                onClick={() => setIsLegalDropdownOpen(false)}
                className={`flex items-center px-4 py-3 hover:bg-white/10 transition-colors ${
                  isActive('/contact') ? 'bg-white/10 text-purple-400' : 'text-gray-300'
                }`}
              >
                <Mail className="w-4 h-4 mr-3" />
                <span>Contact Us</span>
              </Link>
              <Link
                to="/terms"
                onClick={() => setIsLegalDropdownOpen(false)}
                className={`flex items-center px-4 py-3 hover:bg-white/10 transition-colors ${
                  isActive('/terms') ? 'bg-white/10 text-purple-400' : 'text-gray-300'
                }`}
              >
                <FileText className="w-4 h-4 mr-3" />
                <span>Terms & Conditions</span>
              </Link>
              <Link
                to="/privacy"
                onClick={() => setIsLegalDropdownOpen(false)}
                className={`flex items-center px-4 py-3 hover:bg-white/10 transition-colors ${
                  isActive('/privacy') ? 'bg-white/10 text-purple-400' : 'text-gray-300'
                }`}
              >
                <Shield className="w-4 h-4 mr-3" />
                <span>Privacy Policy</span>
              </Link>
              <Link
                to="/shipping"
                onClick={() => setIsLegalDropdownOpen(false)}
                className={`flex items-center px-4 py-3 hover:bg-white/10 transition-colors ${
                  isActive('/shipping') ? 'bg-white/10 text-purple-400' : 'text-gray-300'
                }`}
              >
                <Package className="w-4 h-4 mr-3" />
                <span>Shipping Policy</span>
              </Link>
              <Link
                to="/cancellation"
                onClick={() => setIsLegalDropdownOpen(false)}
                className={`flex items-center px-4 py-3 hover:bg-white/10 transition-colors ${
                  isActive('/cancellation') ? 'bg-white/10 text-purple-400' : 'text-gray-300'
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
          <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="glowing-box-button text-white">
            Register
          </Link>
        </div>
      )
    }

    return (
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-white">{user.name}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 glass-dark backdrop-blur-xl rounded-lg py-1 z-[200] border border-white/10 pointer-events-auto shadow-xl">
              <div className="px-4 py-2 border-b border-white/10">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
                <p className="text-xs text-purple-400 capitalize">{user.role}</p>
              </div>
              
              <Link
                to='/dashboard'
                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Calendar className="w-4 h-4 mr-3" />
                Dashboard
              </Link>

              {user.role === 'candidate' && (
                <Link
                  to="/booking"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Users className="w-4 h-4 mr-3" />
                  Book Session
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Settings className="w-4 h-4 mr-3" />
                Profile Settings
              </Link>

              <div className="border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
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

  const renderThemeToggle = (variant: 'desktop' | 'mobile') => {
    const isDark = theme === 'dark'
    const baseClasses = 'inline-flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 h-10 w-10'

    const variantClasses = variant === 'desktop'
      ? isDark
        ? 'border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white'
        : 'border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700'
      : isDark
        ? 'border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white'
        : 'border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700'

    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`${baseClasses} ${variantClasses}`}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    )
  }

  return (
    <header className="glass backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MockAce</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {getNavigationItems()}
          </nav>
          
          <div className="flex items-center space-x-4">
            {renderThemeToggle('desktop')}
          {showUserMenu && getAuthButtons()}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden glass-dark backdrop-blur-xl border-t border-white/10">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm text-gray-300">Theme</span>
            {renderThemeToggle('mobile')}
          </div>
          <Link to="#pricing" onClick={handleSectionClick} className="block px-3 py-2 text-gray-300 hover:text-white">Pricing</Link>
          <Link to="#features" onClick={handleSectionClick} className="block px-3 py-2 text-gray-300 hover:text-white">Features</Link>
          <Link to="/blog" className={`block px-3 py-2 ${isActive('/blog') ? 'text-purple-400 font-medium' : 'text-gray-300 hover:text-white'}`}>Blog</Link>
          <Link to="/about" className={`block px-3 py-2 ${isActive('/about') ? 'text-purple-400 font-medium' : 'text-gray-300 hover:text-white'}`}>About</Link>
          <Link to="/careers" className={`block px-3 py-2 ${isActive('/careers') ? 'text-purple-400 font-medium' : 'text-gray-300 hover:text-white'}`}>Careers</Link>
          <Link to="/contact" className={`block px-3 py-2 ${isActive('/contact') ? 'text-purple-400 font-medium' : 'text-gray-300 hover:text-white'}`}>Contact</Link>
          <div className="px-3 py-2">
            <div className="font-medium text-gray-300 mb-2">Legal</div>
            <div className="ml-4 space-y-1">
              <Link to="/contact" className={`block px-3 py-2 rounded-md ${isActive('/contact') ? 'bg-white/10 text-purple-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>Contact Us</Link>
              <Link to="/terms" className={`block px-3 py-2 rounded-md ${isActive('/terms') ? 'bg-white/10 text-purple-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>Terms & Conditions</Link>
              <Link to="/privacy" className={`block px-3 py-2 rounded-md ${isActive('/privacy') ? 'bg-white/10 text-purple-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>Privacy Policy</Link>
              <Link to="/shipping" className={`block px-3 py-2 rounded-md ${isActive('/shipping') ? 'bg-white/10 text-purple-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>Shipping Policy</Link>
              <Link to="/cancellation" className={`block px-3 py-2 rounded-md ${isActive('/cancellation') ? 'bg-white/10 text-purple-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>Cancellation & Refunds</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
