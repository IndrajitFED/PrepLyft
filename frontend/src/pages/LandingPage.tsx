import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  Play, 
  Star, 
  Users, 
  Code,
  ChevronDown,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  X
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const LandingPage: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [activePlan, setActivePlan] = useState<'basic' | 'standard' | 'premium'>('standard')
  const [typedCode, setTypedCode] = useState('')
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const lastScrollPositionRef = React.useRef<number>(0)
  const isLoopingRef = React.useRef<boolean>(false)
  
  const codeSnippet = `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`

  useEffect(() => {
    let currentIndex = 0
    const timer = setInterval(() => {
      if (currentIndex < codeSnippet.length) {
        setTypedCode(codeSnippet.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(timer)
      }
    }, 30) // Adjust speed here (lower = faster)

    return () => clearInterval(timer)
  }, [codeSnippet])

  // Calculate card transform based on scroll position (Flutter PageView style)
  const getCardTransform = React.useCallback((index: number) => {
    if (!scrollContainerRef.current) return { scale: 1, opacity: 1, zIndex: 30 }
    
    const container = scrollContainerRef.current
    const containerWidth = container.clientWidth || window.innerWidth
    // Card width is 80vw, with 10vw margin on each side, so each card set is 100vw
    const cardSetWidth = containerWidth
    
    // Calculate current page index based on scroll position
    // When scrolled to show card 0: scrollLeft = 0
    // When scrolled to show card 1: scrollLeft = 100vw (one full width)
    // When scrolled to show card 2: scrollLeft = 200vw (two full widths)
    const currentPage = scrollPosition / cardSetWidth
    const distance = Math.abs(currentPage - index)
    
    // Flutter-style value calculation: value = (1 - (distance * 0.25)).clamp(0.0, 1.0)
    const value = Math.max(0, Math.min(1, 1 - (distance * 0.25)))
    
    // Use easeInOut curve for smooth scaling (similar to Curves.easeInOut)
    const easeInOut = (t: number) => {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
    }
    
    const scaledValue = easeInOut(value)
    
    return {
      scale: scaledValue,
      opacity: 0.4 + (scaledValue * 0.6), // Opacity from 0.4 to 1.0
      zIndex: Math.round(30 - distance * 10) // Higher z-index for closer cards
    }
  }, [scrollPosition])

  // Handle scroll to update position and active plan with infinite loop
  const handleScroll = React.useCallback(() => {
    if (!scrollContainerRef.current) return
    
    const container = scrollContainerRef.current
    const containerWidth = container.clientWidth || window.innerWidth
    const scrollLeft = container.scrollLeft
    const maxScroll = container.scrollWidth - containerWidth
    
    // If we just performed a programmatic loop jump, avoid re-triggering loop logic
    if (isLoopingRef.current) {
      lastScrollPositionRef.current = scrollLeft
      setScrollPosition(scrollLeft)
      // Still update active plan for UI consistency
      const cardWidth = containerWidth
      const currentPageDuringLoop = scrollLeft / cardWidth
      const planIndexDuringLoop = Math.round(currentPageDuringLoop)
      const plansDuringLoop: ('basic' | 'standard' | 'premium')[] = ['basic', 'standard', 'premium']
      const clampedIndexDuringLoop = Math.max(0, Math.min(2, planIndexDuringLoop))
      if (plansDuringLoop[clampedIndexDuringLoop] && plansDuringLoop[clampedIndexDuringLoop] !== activePlan) {
        setActivePlan(plansDuringLoop[clampedIndexDuringLoop])
      }
      return
    }

    // Detect scroll direction
    const scrollDirection = scrollLeft > lastScrollPositionRef.current ? 'right' : 'left'
    lastScrollPositionRef.current = scrollLeft
    
    // Calculate card positions (each card takes 100vw: 80vw card + 10vw margin each side)
    const cardWidth = containerWidth // 100vw per card
    const tolerance = 10 // Small tolerance for edge detection
    
    // Infinite loop: After Premium (card 2), loop to Basic (card 0)
    if (scrollLeft >= maxScroll - tolerance && maxScroll > 0 && scrollDirection === 'right') {
      // User scrolled past Premium card to the right, loop to Basic
      isLoopingRef.current = true
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = 0
          lastScrollPositionRef.current = 0
          setScrollPosition(0)
          setActivePlan('basic')
          setTimeout(() => { isLoopingRef.current = false }, 50)
        }
      })
      return
    }
    
    // Infinite loop: Before Basic (card 0), loop to Premium (card 2)
    if (scrollLeft <= tolerance && maxScroll > 0 && scrollDirection === 'left') {
      // User scrolled before Basic card to the left, loop to Premium
      isLoopingRef.current = true
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = maxScroll
          lastScrollPositionRef.current = maxScroll
          setScrollPosition(maxScroll)
          setActivePlan('premium')
          setTimeout(() => { isLoopingRef.current = false }, 50)
        }
      })
      return
    }
    
    setScrollPosition(scrollLeft)
    
    // Determine active card based on scroll position
    // Card 0: scrollLeft ~0
    // Card 1: scrollLeft ~cardWidth
    // Card 2: scrollLeft ~cardWidth * 2
    const currentPage = scrollLeft / cardWidth
    const planIndex = Math.round(currentPage)
    const plans: ('basic' | 'standard' | 'premium')[] = ['basic', 'standard', 'premium']
    
    // Clamp index to valid range
    const clampedIndex = Math.max(0, Math.min(2, planIndex))
    if (plans[clampedIndex] && plans[clampedIndex] !== activePlan) {
      setActivePlan(plans[clampedIndex])
    }
  }, [activePlan])

  // Initial scroll to center Standard plan (index 1)
  useEffect(() => {
    if (scrollContainerRef.current && window.innerWidth < 768) {
      const containerWidth = scrollContainerRef.current.clientWidth || window.innerWidth
      // Standard is at index 1, so scroll to show it centered
      // Card 0 ends at 100vw, so Card 1 starts at ~100vw - 10vw (to show 10% of Card 0)
      const scrollPosition = containerWidth - (containerWidth * 0.1)
      
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = scrollPosition
          setScrollPosition(scrollPosition)
        }
      }, 100)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mb-6">
                ⭐ 500+ Students Placed in Top Companies
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Ace Your <span className="text-primary-600">Technical</span> Interviews
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Practice with industry experts, get personalized feedback, and land your dream job in Software Engineer, Data Science, and Data Analytics.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/register" className="flex items-center btn-primary text-lg px-8 py-4">
                  Book Mock Interview →
                </Link>
                <button className="flex items-center btn-secondary text-lg px-8 py-4">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Money Back Guarantee
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Mock Interview Session</h3>
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">Live</span>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 mb-4 min-h-[292px]">
                  <pre className="text-green-400 text-sm font-mono">
                    {typedCode}
                    <span className="animate-pulse">|</span>
                  </pre>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Interviewer: Indrajit Shinde, SSE Publicis Sapient</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Problem Solving</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Communication</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Code Quality</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mouse Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-col items-center space-y-2"
          >
            <span className="text-xs text-gray-600 font-medium tracking-wider uppercase">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="flex flex-col items-center"
            >
              <ChevronDown className="w-5 h-5 text-gray-600" />
              <ChevronDown className="w-5 h-5 text-gray-400 -mt-3" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Hiring Partners Section - Card-Based Design */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <p className="text-sm font-medium text-primary-600 mb-3">Trusted by Leaders</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Clients We've Partnered With
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Their logos below represent the trust they've placed in us and the successful collaborations we've built together.
            </p>
          </motion.div>
          
          {/* Logo Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5 mt-12">
            {[
              { name: "Mastercard", logo: "https://img.logo.dev/mastercard.com?token=pk_IxSMy-xWRCy4XmcpK7n8cw&format=png&retina=true" },
              { name: "Marsh McLennan", logo: "https://img.logo.dev/marsh.com?token=pk_IxSMy-xWRCy4XmcpK7n8cw&format=png&retina=true" },
              { name: "Deloitte", logo: "https://img.logo.dev/deloitte.com?token=pk_IxSMy-xWRCy4XmcpK7n8cw&format=png&retina=true" },
              { name: "Publicis Sapient", logo: "https://img.logo.dev/publicissapient.com?token=pk_IxSMy-xWRCy4XmcpK7n8cw&format=png&retina=true" },
              { name: "Accenture", logo: "https://img.logo.dev/accenture.com?token=pk_IxSMy-xWRCy4XmcpK7n8cw&format=png&retina=true" },
              { name: "Wipro", logo: "https://img.logo.dev/wipro.com?token=pk_IxSMy-xWRCy4XmcpK7n8cw&format=png&retina=true" },
              { name: "TCS", logo: "https://img.logo.dev/tcs.com?token=pk_IxSMy-xWRCy4XmcpK7n8cw&format=png&retina=true" },
              { name: "Infosys", logo: "https://img.logo.dev/infosys.com?token=pk_IxSMy-xWRCy4XmcpK7n8cw&format=png&retina=true" },
              { name: "Cognizant", logo: "https://img.logo.dev/cognizant.com?token=pk_IxSMy-xWRCy4XmcpK7n8cw&format=png&retina=true" },
              { name: "Capgemini", logo: "https://img.logo.dev/capgemini.com?token=pk_IxSMy-xWRCy4XmcpK7n8cw&format=png&retina=true" },
              { name: "Amazon", logo: "https://img.logo.dev/amazon.com?token=pk_IxSMy-xWRCy4XmcpK7n8cw&format=png&retina=true" },
              { name: "HCL", logo: "https://img.logo.dev/hcl.com?token=pk_IxSMy-xWRCy4XmcpK7n8cw&format=png&retina=true" }
            ].map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.04,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                {/* White Card with Logo */}
                <div className="bg-white rounded-xl p-4 md:p-5 h-28 md:h-32
                  shadow-sm
                  flex items-center justify-center
                  border border-gray-100"
                >
                  <img 
                    src={company.logo} 
                    alt={company.name} 
                    className="h-10 md:h-12 w-auto object-contain"
                    loading="lazy"
                  />
              </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Choose Your Plan</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">Scalable pricing designed for your career growth</p>
          </motion.div>
          
          {/* Desktop: Table-based pricing */}
          <div className="hidden md:block overflow-x-auto -mx-4 px-4 py-6">
            <div className="min-w-[900px]">
              <motion.table
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-full border-collapse"
              >
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-6 sticky left-0 z-10 bg-white">
                      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Features</div>
                    </th>
                    <th className="text-center p-6 relative cursor-pointer transition-all duration-300 hover:bg-gray-50"
                        onClick={() => setActivePlan('basic')}
                        style={{
                          backgroundColor: activePlan === 'basic' ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
                        }}>
                      <div className={`flex flex-col items-center transition-all duration-300 ${
                        activePlan === 'basic' ? 'transform scale-105' : ''
                      }`}>
                        <div className="text-xl font-bold text-gray-900 mb-1">Basic</div>
                        <div className="text-3xl font-extrabold text-gray-900 mb-0.5">₹499</div>
                        <div className="text-xs text-gray-500">One-time</div>
                      </div>
                    </th>
                    <th className="text-center p-6 relative cursor-pointer transition-all duration-300 bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                        onClick={() => setActivePlan('standard')}
                        style={{
                          backgroundColor: activePlan !== 'standard' ? 'rgba(59, 130, 246, 0.05)' : undefined
                        }}>
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
                        <span className="bg-white text-primary-600 px-4 py-1.5 rounded-lg text-xs font-bold shadow-xl border border-gray-100">
                          Most Popular
                        </span>
                      </div>
                      <div className={`flex flex-col items-center pt-3 transition-all duration-300 ${
                        activePlan === 'standard' ? 'transform scale-105' : ''
                      }`}>
                        <div className="text-xl font-bold text-white mb-1">Standard</div>
                        <div className="text-3xl font-extrabold text-white mb-0.5">₹999</div>
                        <div className="text-xs text-primary-100">One-time</div>
                      </div>
                    </th>
                    <th className="text-center p-6 relative cursor-pointer transition-all duration-300 hover:bg-gray-50"
                        onClick={() => setActivePlan('premium')}
                        style={{
                          backgroundColor: activePlan === 'premium' ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
                        }}>
                      <div className={`flex flex-col items-center transition-all duration-300 ${
                        activePlan === 'premium' ? 'transform scale-105' : ''
                      }`}>
                        <div className="text-xl font-bold text-gray-900 mb-1">Premium</div>
                        <div className="text-3xl font-extrabold text-gray-900 mb-0.5">₹1999</div>
                        <div className="text-xs text-gray-500">One-time</div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="text-left p-4 sticky left-0 z-10 bg-white font-semibold text-gray-900">Mock Interviews</td>
                    <td className={`text-center p-4 transition-colors duration-300 ${
                      activePlan === 'basic' ? 'bg-primary-50' : ''
                    }`}>
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">1</div>
                    </td>
                    <td className={`text-center p-4 transition-colors duration-300 ${
                      activePlan === 'standard' ? 'bg-primary-50' : ''
                    }`}>
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-sm">
                        <CheckCircle className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="text-xs text-gray-700 mt-1">2</div>
                    </td>
                    <td className={`text-center p-4 transition-colors duration-300 ${
                      activePlan === 'premium' ? 'bg-primary-50' : ''
                    }`}>
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">3</div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="text-left p-4 sticky left-0 z-10 bg-white font-semibold text-gray-900">Feedback Type</td>
                    <td className={`text-center p-4 text-sm text-gray-600 transition-colors duration-300 ${
                      activePlan === 'basic' ? 'bg-primary-50' : ''
                    }`}>Basic</td>
                    <td className={`text-center p-4 text-sm font-medium transition-colors duration-300 ${
                      activePlan === 'standard' ? 'bg-primary-50' : ''
                    }`}>Detailed</td>
                    <td className={`text-center p-4 text-sm text-gray-600 transition-colors duration-300 ${
                      activePlan === 'premium' ? 'bg-primary-50' : ''
                    }`}>Detailed</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="text-left p-4 sticky left-0 z-10 bg-white font-semibold text-gray-900">Video Recordings</td>
                    <td className={`text-center p-4 transition-colors duration-300 ${
                      activePlan === 'basic' ? 'bg-primary-50' : ''
                    }`}>
                      <div className="inline-flex items-center justify-center w-7 h-7 bg-gray-100 rounded-full">
                        <X className="w-4 h-4 text-gray-400" />
                      </div>
                    </td>
                    <td className={`text-center p-4 transition-colors duration-300 ${
                      activePlan === 'standard' ? 'bg-primary-50' : ''
                    }`}>
                      <div className="inline-flex items-center justify-center w-7 h-7 bg-white rounded-full shadow-sm">
                        <CheckCircle className="w-4 h-4 text-primary-600" />
                      </div>
                    </td>
                    <td className={`text-center p-4 transition-colors duration-300 ${
                      activePlan === 'premium' ? 'bg-primary-50' : ''
                    }`}>
                      <div className="inline-flex items-center justify-center w-7 h-7 bg-green-100 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="text-left p-4 sticky left-0 z-10 bg-white font-semibold text-gray-900">Priority Booking</td>
                    <td className={`text-center p-4 transition-colors duration-300 ${
                      activePlan === 'basic' ? 'bg-primary-50' : ''
                    }`}>
                      <div className="inline-flex items-center justify-center w-7 h-7 bg-gray-100 rounded-full">
                        <X className="w-4 h-4 text-gray-400" />
                      </div>
                    </td>
                    <td className={`text-center p-4 transition-colors duration-300 ${
                      activePlan === 'standard' ? 'bg-primary-50' : ''
                    }`}>
                      <div className="inline-flex items-center justify-center w-7 h-7 bg-white rounded-full shadow-sm">
                        <CheckCircle className="w-4 h-4 text-primary-600" />
                      </div>
                    </td>
                    <td className={`text-center p-4 transition-colors duration-300 ${
                      activePlan === 'premium' ? 'bg-primary-50' : ''
                    }`}>
                      <div className="inline-flex items-center justify-center w-7 h-7 bg-green-100 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="text-left p-4 sticky left-0 z-10 bg-white font-semibold text-gray-900">Progress Tracking</td>
                    <td className={`text-center p-4 transition-colors duration-300 ${
                      activePlan === 'basic' ? 'bg-primary-50' : ''
                    }`}>
                      <div className="inline-flex items-center justify-center w-7 h-7 bg-gray-100 rounded-full">
                        <X className="w-4 h-4 text-gray-400" />
                      </div>
                    </td>
                    <td className={`text-center p-4 transition-colors duration-300 ${
                      activePlan === 'standard' ? 'bg-primary-50' : ''
                    }`}>
                      <div className="inline-flex items-center justify-center w-7 h-7 bg-white rounded-full shadow-sm">
                        <CheckCircle className="w-4 h-4 text-primary-600" />
                      </div>
                    </td>
                    <td className={`text-center p-4 transition-colors duration-300 ${
                      activePlan === 'premium' ? 'bg-primary-50' : ''
                    }`}>
                      <div className="inline-flex items-center justify-center w-7 h-7 bg-green-100 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="text-left p-4 sticky left-0 z-10 bg-white font-semibold text-gray-900">Community Access</td>
                    <td className={`text-center p-4 transition-colors duration-300 ${
                      activePlan === 'basic' ? 'bg-primary-50' : ''
                    }`}>
                      <div className="inline-flex items-center justify-center w-7 h-7 bg-green-100 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    </td>
                    <td className={`text-center p-4 transition-colors duration-300 ${
                      activePlan === 'standard' ? 'bg-primary-50' : ''
                    }`}>
                      <div className="inline-flex items-center justify-center w-7 h-7 bg-white rounded-full shadow-sm">
                        <CheckCircle className="w-4 h-4 text-primary-600" />
                      </div>
                    </td>
                    <td className={`text-center p-4 transition-colors duration-300 ${
                      activePlan === 'premium' ? 'bg-primary-50' : ''
                    }`}>
                      <div className="inline-flex items-center justify-center w-7 h-7 bg-green-100 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sticky left-0 z-10 bg-white"></td>
                    <td className={`text-center p-4 transition-colors duration-300 ${
                      activePlan === 'basic' ? 'bg-primary-50' : ''
                    }`}>
                      <Link 
                        to="/register" 
                        className="group relative inline-block w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold overflow-hidden">
                        <span className="relative z-10">Get Started</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </Link>
                    </td>
                    <td className={`text-center p-4 transition-colors duration-300 ${
                      activePlan === 'standard' ? 'bg-primary-50' : ''
                    }`}>
                      <Link 
                        to="/register" 
                        className="group relative inline-block w-full px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold overflow-hidden shadow-lg hover:shadow-xl">
                        <span className="relative z-10">Get Started</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 -translate-x-full animate-shine pointer-events-none"></div>
                      </Link>
                    </td>
                    <td className={`text-center p-4 transition-colors duration-300 ${
                      activePlan === 'premium' ? 'bg-primary-50' : ''
                    }`}>
                      <Link 
                        to="/register" 
                        className="group relative inline-block w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold overflow-hidden">
                        <span className="relative z-10">Get Started</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </motion.table>
            </div>
          </div>
          
          {/* Mobile: Flutter-style PageView Carousel */}
          <div className="md:hidden">
            <div className="relative">
              {/* Sticky Most Popular Badge for Standard Plan */}
              {activePlan === 'standard' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
                  <span className="bg-white text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              {/* Horizontal Scroll Container (PageView style) */}
              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory pb-6 scrollbar-hide"
                style={{ 
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  overflowY: 'visible' // Ensure vertical scroll is not blocked
                }}
                onScroll={handleScroll}
              >
                {/* Basic Plan Card (Index 0) */}
                <div
                  className="flex-shrink-0 snap-center rounded-2xl p-6 cursor-pointer bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 transition-all duration-300 ease-out relative"
                  style={{ 
                    width: '80vw',
                    marginLeft: '10vw',
                    marginRight: '10vw',
                    ...(() => {
                      const transform = getCardTransform(0)
                      return {
                        transform: `scale(${transform.scale})`,
                        opacity: transform.opacity,
                        zIndex: transform.zIndex
                      }
                    })()
                  }}
                  onClick={() => {
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({
                        left: 0,
                        behavior: 'smooth'
                      })
                    }
                  }}
                >
                  <div className="text-white">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-sm font-semibold opacity-90 mb-1">BASIC</div>
                        <div className="text-4xl font-extrabold">₹399</div>
                        <div className="text-xs opacity-80 mt-1">One-time</div>
                      </div>
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-3 mt-6">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span className="text-sm">1 Free DSA Interview</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span className="text-sm">Basic Feedback</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span className="text-sm">Free Resources</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span className="text-sm">Community Access</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <X className="w-5 h-5 text-white/60" />
                        <span className="text-sm text-white/60">Video Recordings</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <X className="w-5 h-5 text-white/60" />
                        <span className="text-sm text-white/60">Priority Booking</span>
                      </div>
                    </div>

                    <Link 
                      to="/register" 
                      onClick={(e) => e.stopPropagation()}
                      className="mt-6 block w-full bg-white text-pink-600 text-center py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>

                {/* Standard Plan Card (Index 1 - Most Popular) */}
                <div
                  className="flex-shrink-0 snap-center rounded-2xl p-6 cursor-pointer bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 transition-all duration-300 ease-out relative"
                  style={{ 
                    width: '80vw',
                    marginLeft: '10vw',
                    marginRight: '10vw',
                    ...(() => {
                      const transform = getCardTransform(1)
                      return {
                        transform: `scale(${transform.scale})`,
                        opacity: transform.opacity,
                        zIndex: transform.zIndex
                      }
                    })()
                  }}
                  onClick={() => {
                    if (scrollContainerRef.current) {
                      const containerWidth = scrollContainerRef.current.clientWidth || window.innerWidth
                      scrollContainerRef.current.scrollTo({
                        left: containerWidth - (containerWidth * 0.1), // Scroll to show this card centered
                        behavior: 'smooth'
                      })
                    }
                  }}
                >
                  <div className="text-white">
                    <div className="flex items-start justify-between mb-4 pt-2">
                      <div>
                        <div className="text-sm font-semibold opacity-90 mb-1">STANDARD</div>
                        <div className="text-4xl font-extrabold">₹999</div>
                        <div className="text-xs opacity-80 mt-1">One-time</div>
                      </div>
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-3 mt-6">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span className="text-sm">1 Free DSA Interview</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span className="text-sm">1 Random Subject Interview</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span className="text-sm">Detailed Feedback</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span className="text-sm">Priority Booking</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span className="text-sm">Community Access</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <X className="w-5 h-5 text-white/60" />
                        <span className="text-sm text-white/60">Video Recordings</span>
                      </div>
                    </div>

                    <Link 
                      to="/register" 
                      onClick={(e) => e.stopPropagation()}
                      className="mt-6 block w-full bg-white text-blue-600 text-center py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>

                {/* Premium Plan Card (Index 2) */}
                <div
                  className="flex-shrink-0 snap-center rounded-2xl p-6 cursor-pointer bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 transition-all duration-300 ease-out relative"
                  style={{ 
                    width: '80vw',
                    marginLeft: '10vw',
                    marginRight: '10vw',
                    ...(() => {
                      const transform = getCardTransform(2)
                      return {
                        transform: `scale(${transform.scale})`,
                        opacity: transform.opacity,
                        zIndex: transform.zIndex
                      }
                    })()
                  }}
                  onClick={() => {
                    if (scrollContainerRef.current) {
                      const containerWidth = scrollContainerRef.current.clientWidth || window.innerWidth
                      scrollContainerRef.current.scrollTo({
                        left: (containerWidth * 2) - (containerWidth * 0.2), // Scroll to show this card centered
                        behavior: 'smooth'
                      })
                    }
                  }}
                >
                  <div className="text-white">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-sm font-semibold opacity-90 mb-1">PREMIUM</div>
                        <div className="text-4xl font-extrabold">₹1999</div>
                        <div className="text-xs opacity-80 mt-1">One-time</div>
                      </div>
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-3 mt-6">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span className="text-sm">1 Free DSA Interview</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span className="text-sm">2 Random Subject Interviews</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span className="text-sm">Detailed Feedback</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span className="text-sm">Priority Booking</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span className="text-sm">Video Recordings</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span className="text-sm">Progress Tracking</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span className="text-sm">Leaderboard Access</span>
                      </div>
                    </div>

                    <Link 
                      to="/register" 
                      onClick={(e) => e.stopPropagation()}
                      className="mt-6 block w-full bg-white text-green-600 text-center py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>

              {/* Navigation dots */}
              <div className="flex justify-center mt-8 space-x-2 z-50 relative">
                {['basic', 'standard', 'premium'].map((plan, index) => (
                  <button
                    key={plan}
                    onClick={() => {
                      if (scrollContainerRef.current) {
                        const containerWidth = scrollContainerRef.current.clientWidth || window.innerWidth
                        const cardWidth = containerWidth // 100vw per card
                        const targetScroll = index * cardWidth
                        scrollContainerRef.current.scrollTo({
                          left: targetScroll,
                          behavior: 'smooth'
                        })
                      }
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ease-out ${
                      activePlan === plan ? 'bg-primary-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Select ${plan} plan`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Tabs */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              Everything you need to ace your technical interviews, all in one platform
            </p>
            </div>
            
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Tab List */}
            <div className="lg:col-span-5">
              <div className="space-y-1 bg-gray-100 rounded-2xl p-2">
                {[
                  {
                    title: "Mock Interview Sessions",
                    description: "Practice with industry experts from top companies. Get real-time feedback and detailed performance analysis.",
                    icon: <Users className="w-5 h-5" />
                  },
                  {
                    title: "DSA & Problem Solving",
                    description: "Master data structures and algorithms with 500+ curated problems. Practice coding in our integrated editor.",
                    icon: <Code className="w-5 h-5" />
                  },
                  {
                    title: "Technical Assessments",
                    description: "Take comprehensive mock assessments covering system design, frontend concepts, and behavioral questions.",
                    icon: <ClipboardCheck className="w-5 h-5" />
                  },
                  {
                    title: "Progress Tracking",
                    description: "Monitor your improvement with detailed analytics, strengths/weaknesses, and personalized study plans.",
                    icon: <TrendingUp className="w-5 h-5" />
                  },
                  {
                    title: "Interview Resources",
                    description: "Access company-specific guides, behavioral questions, and preparation materials for top tech firms.",
                    icon: <BookOpen className="w-5 h-5" />
                  }
                ].map((feature, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFeature(index)}
                    className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 ${
                      activeFeature === index
                        ? 'bg-white text-gray-900 shadow-lg'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`mt-1 ${activeFeature === index ? 'text-primary-600' : 'text-gray-400'}`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm sm:text-base mb-1">{feature.title}</h3>
                        <p className={`text-sm ${activeFeature === index ? 'text-gray-600' : 'text-gray-500'}`}>
                          {feature.description}
                        </p>
                      </div>
              </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Tab Panel - Visual Content */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {activeFeature === 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white p-8"
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center">
                      <Users className="w-24 h-24 text-primary-600" />
                    </div>
                  </motion.div>
                )}
                {activeFeature === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white p-8"
                  >
                    <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 font-mono text-sm text-green-400">
                      <div className="mb-2">// DSA Practice</div>
                      <div className="text-blue-400">function</div> <span className="text-yellow-400">binarySearch</span>
                      <span className="text-gray-500">(arr, target)</span> {"{"}
                      <div className="ml-4 mt-2">{"// Your solution here"}</div>
                      {"}"}
                    </div>
                  </motion.div>
                )}
                {activeFeature === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white p-8"
                  >
                    <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl flex items-center justify-center">
                      <ClipboardCheck className="w-24 h-24 text-green-600" />
                    </div>
                  </motion.div>
                )}
                {activeFeature === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white p-8"
                  >
                    <div className="aspect-video bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-24 h-24 text-purple-600" />
                    </div>
                  </motion.div>
                )}
                {activeFeature === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white p-8"
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-24 h-24 text-indigo-600" />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              Everything you need to know about MockAce
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                question: "What is MockAce?",
                answer: "MockAce is a comprehensive platform for technical interview preparation. We connect you with industry experts from top companies like Google, Microsoft, Amazon, and more for realistic mock interviews across software engineering, data science, and analytics roles."
              },
              {
                question: "How do mock interviews work?",
                answer: "Book a session with one of our expert mentors. During the interview, you'll solve problems, discuss system design, and handle questions just like in real interviews. Afterward, you receive detailed written feedback, a video recording of your session, and actionable improvement suggestions."
              },
              {
                question: "Who are the interviewers?",
                answer: "Our mentors are experienced professionals from FAANG and other top tech companies with 5+ years of experience. They're currently working in these companies and understand what recruiters are looking for."
              },
              {
                question: "What topics are covered?",
                answer: "We cover Software Engineering (DSA, System Design), Data Science (ML, Statistics, Case Studies), and Analytics (SQL, Business Cases). You can choose based on your target role and get specialized practice for that domain."
              },
              {
                question: "Can I reschedule my interview?",
                answer: "Yes, absolutely! We offer flexible scheduling. You can reschedule up to 24 hours before your session. We have mentors available across multiple time zones to accommodate your schedule."
              },
              {
                question: "What's the difference between Basic, Standard, and Premium plans?",
                answer: "Basic gives you 1 mock interview to get started. Standard includes 2 interviews with detailed feedback. Premium (most popular) offers 3 interviews per month with priority booking, video recordings, progress tracking, and leaderboard access. Premium subscribers also get priority support."
              },
              {
                question: "Do you provide interview preparation materials?",
                answer: "Yes! We offer comprehensive resources including company-specific question banks, behavioral interview guides, study plans (2 weeks to 6 months), and coding practice problems with solutions and unit tests."
              },
              {
                question: "Is there a refund policy?",
                answer: "Yes, we offer a money-back guarantee. If you're not satisfied with your first mock interview experience, you can request a full refund within 7 days of your first session."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full text-left bg-white rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-all duration-300 p-6 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 pr-8">{faq.question}</h3>
                    <ChevronDown className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
              </div>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-gray-600 font-light leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-6">Still have questions?</p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 rounded-xl font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Contact Support →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="reviews" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from students who landed their dream jobs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sanket Patil",
                role: "Software Engineer at Deloitte",
                quote: "MockAce helped me crack Deloitte interview! The DSA practice sessions were incredibly realistic and the feedback was spot-on.",
                rating: 4
              },
              {
                name: "Kaushik Sawant",
                role: "SDE1 at Mastercard",
                quote: "The data science mock interviews prepared me perfectly for real scenarios. Got offers from 3 top companies!",
                rating: 4
              },
              {
                name: "Ashutosh Tripathi",
                role: "Marsh McLennan",
                quote: "Amazing platform! The analytics case studies were exactly what I faced in my Marsh Mclennan interview. Highly recommended!",
                rating: 4
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-soft">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary-600 font-semibold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Ace Your Next Interview?</h2>
          <p className="text-xl text-primary-100 mb-8">Join thousands of students who have successfully landed their dream jobs with MockAce</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Start Free Trial - No Credit Card Required
            </Link>
            <button className="btn-secondary bg-white text-primary-600 hover:bg-gray-100">
              Book Demo Call
            </button>
          </div>
          
          <div className="flex justify-center items-center space-x-8 text-sm text-primary-100">
            <div className="flex items-center">
              <span className="mr-2">🔒</span> SSL Secured
            </div>
            <div className="flex items-center">
              <span className="mr-2">💰</span> Money Back Guarantee
            </div>
            <div className="flex items-center">
              <span className="mr-2">📞</span> 24/7 Support
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage 