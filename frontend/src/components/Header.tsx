import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Code, User, LogOut, Settings, Calendar, Users, ChevronDown, FileText, Shield, Mail, RotateCcw, Package, Moon, Sun, Menu, X } from 'lucide-react'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

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
            <div className="absolute top-full left-0 mt-2 w-64 rounded-xl border border-white/10 bg-[#05071a]/95 backdrop-blur-2xl py-2 z-[200] pointer-events-auto shadow-[0_20px_45px_rgba(14,15,45,0.45)]">
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
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#05071a]/95 backdrop-blur-2xl py-1 z-[200] pointer-events-auto shadow-[0_20px_45px_rgba(14,15,45,0.45)]">
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

  const renderMobileNavigation = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm text-gray-300">Theme</span>
          {renderThemeToggle('mobile')}
        </div>

        <div className="space-y-1">
          {!user ? (
            <>
              <Link to="#pricing" onClick={(e) => { handleSectionClick(e); setIsMobileMenuOpen(false) }} className="block px-3 py-2 text-gray-300 hover:text-white">Pricing</Link>
              <Link to="#features" onClick={(e) => { handleSectionClick(e); setIsMobileMenuOpen(false) }} className="block px-3 py-2 text-gray-300 hover:text-white">Features</Link>
              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 ${isActive('/blog') ? 'text-purple-400 font-medium' : 'text-gray-300 hover:text-white'}`}>Blog</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 ${isActive('/about') ? 'text-purple-400 font-medium' : 'text-gray-300 hover:text-white'}`}>About</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 ${isActive('/contact') ? 'text-purple-400 font-medium' : 'text-gray-300 hover:text-white'}`}>Contact</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:text-white">Dashboard</Link>
              {user.role === 'candidate' && (
                <Link to="/booking" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:text-white">Book Session</Link>
              )}
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:text-white">Profile Settings</Link>
              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 ${isActive('/blog') ? 'text-purple-400 font-medium' : 'text-gray-300 hover:text-white'}`}>Blog</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 ${isActive('/about') ? 'text-purple-400 font-medium' : 'text-gray-300 hover:text-white'}`}>About</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 ${isActive('/contact') ? 'text-purple-400 font-medium' : 'text-gray-300 hover:text-white'}`}>Contact</Link>
            </>
          )}
        </div>

        <div className="px-3 py-2">
          <div className="font-medium text-gray-300 mb-2">Legal</div>
          <div className="ml-2 space-y-1">
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md ${isActive('/contact') ? 'bg-white/10 text-purple-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>Contact Us</Link>
            <Link to="/terms" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md ${isActive('/terms') ? 'bg-white/10 text-purple-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>Terms & Conditions</Link>
            <Link to="/privacy" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md ${isActive('/privacy') ? 'bg-white/10 text-purple-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>Privacy Policy</Link>
            <Link to="/shipping" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md ${isActive('/shipping') ? 'bg-white/10 text-purple-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>Shipping Policy</Link>
            <Link to="/cancellation" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md ${isActive('/cancellation') ? 'bg-white/10 text-purple-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>Cancellation & Refunds</Link>
          </div>
        </div>

        {!user ? (
          <div className="flex flex-col space-y-3 px-3 pb-4">
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white transition-colors text-center">Login</Link>
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="glowing-box-button text-white text-center">
              Register
            </Link>
          </div>
        ) : (
          <div className="px-3 pb-4">
            <button
              onClick={() => {
                handleLogout()
                setIsMobileMenuOpen(false)
              }}
              className="w-full flex items-center justify-center space-x-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200 transition hover:bg-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <header className="glass backdrop-blur-xl border-b border-white/10 relative z-50">
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
          
          <div className="flex items-center space-x-3">
            {renderThemeToggle('desktop')}
            {showUserMenu && (
              <>
                <div className="hidden md:block">
                  {getAuthButtons()}
                </div>
                <button
                  type="button"
                  className="md:hidden inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                  onClick={() => setIsMobileMenuOpen(prev => !prev)}
                  aria-expanded={isMobileMenuOpen}
                  aria-label="Toggle navigation menu"
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile / tablet navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 px-2 pt-4 pb-6 sm:px-3 bg-[#05071a]/95 backdrop-blur-2xl shadow-[0_20px_45px_rgba(14,15,45,0.45)]">
          {renderMobileNavigation()}
        </div>
      )}
    </header>
  )
}

export default Header
