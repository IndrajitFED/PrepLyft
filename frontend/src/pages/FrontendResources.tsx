import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Lightbulb, BookOpen, Star, Zap, Code, Layers, ChevronRight } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { frontendResourceTracks, getFrontendResourceTracks, FrontendResourceTrack } from '../data/frontendResources'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { getApiUrl, getApiBaseUrl } from '../utils/env'

type TrackId = 'junior' | 'mid' | 'senior'

const FrontendResources: React.FC = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { user } = useAuth()
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [activeTrack, setActiveTrack] = useState<TrackId | null>(null)
  const [tracks, setTracks] = useState<FrontendResourceTrack[]>(frontendResourceTracks)
  const [accessState, setAccessState] = useState<Record<TrackId, { unlocked: boolean; via: 'self' | 'bundle' | null }>>({
    junior: { unlocked: false, via: null },
    mid: { unlocked: false, via: null },
    senior: { unlocked: false, via: null }
  })

  const surfaceClass =
    theme === 'dark'
      ? 'bg-slate-900/70 border border-white/10'
      : 'bg-white border border-gray-200'

  const subtleSurfaceClass =
    theme === 'dark'
      ? 'bg-slate-950/60 border border-white/5'
      : 'bg-gray-50 border border-gray-200'

  const computeAccessState = useCallback(() => {
    const seniorAccess = localStorage.getItem('frontend-track-access-senior') === 'true'
    const midAccessDirect = localStorage.getItem('frontend-track-access-mid') === 'true'
    const juniorAccessDirect = localStorage.getItem('frontend-track-access-junior') === 'true'

    let unlockedMid = midAccessDirect
    let unlockedJunior = juniorAccessDirect
    if (seniorAccess) {
      if (!unlockedMid) {
        localStorage.setItem('frontend-track-access-mid', 'true')
        unlockedMid = true
      }
      if (!unlockedJunior) {
        localStorage.setItem('frontend-track-access-junior', 'true')
        unlockedJunior = true
      }
    }

    const juniorVia: 'self' | 'bundle' | null = juniorAccessDirect ? 'self' : seniorAccess ? 'bundle' : null
    const midVia: 'self' | 'bundle' | null = midAccessDirect ? 'self' : seniorAccess ? 'bundle' : null
    const seniorVia: 'self' | 'bundle' | null = seniorAccess ? 'self' : null

    return {
      junior: {
        unlocked: unlockedJunior || seniorAccess,
        via: juniorVia
      },
      mid: {
        unlocked: unlockedMid || seniorAccess,
        via: midVia
      },
      senior: {
        unlocked: seniorAccess,
        via: seniorVia
      }
    }
  }, [])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setRazorpayLoaded(true)
    script.onerror = () => console.error('Failed to load Razorpay script')
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    const refreshAccess = () => setAccessState(computeAccessState())
    refreshAccess()
    const onStorage = () => refreshAccess()
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [computeAccessState])

  // Fetch pricing from backend on component mount
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const apiBaseUrl = getApiBaseUrl()
        const tracksWithPricing = await getFrontendResourceTracks(apiBaseUrl)
        setTracks(tracksWithPricing)
      } catch (error) {
        console.error('Error fetching frontend resource pricing:', error)
        // Keep default tracks if fetch fails
      }
    }
    fetchPricing()
  }, [])

  const ensureLoggedIn = () => {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/frontend-resources' } })
      return false
    }
    return true
  }

  const verifyPayment = async (payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }, trackId: TrackId) => {
    const response = await fetch(getApiUrl('api/payments/verify'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify(payload)
    })
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message || 'Payment verification failed')
    }
    localStorage.setItem(`frontend-track-access-${trackId}`, 'true')
    if (trackId === 'senior') {
      localStorage.setItem('frontend-track-access-mid', 'true')
      localStorage.setItem('frontend-track-access-junior', 'true')
    }
    setAccessState(computeAccessState())
    navigate(`/frontend-resources/${trackId}/topics`)
  }

  const createOrder = async (field: string) => {
    const response = await fetch(getApiUrl('api/payments/create-order'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify({
        currency: 'INR',
        field
      })
    })
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message || 'Failed to create payment order')
    }
    return data.data as {
      orderId: string
      amount: number
      currency: string
      key: string
      sessionConfig: {
        name: string
        description: string
        price: number
      }
    }
  }

  const handleStartTrack = async (trackId: TrackId) => {
    if (accessState[trackId]?.unlocked) {
      navigate(`/frontend-resources/${trackId}/topics`)
      return
    }
    if (!ensureLoggedIn()) return
    if (!razorpayLoaded || !(window as any).Razorpay) {
      alert('Payment system is still loading. Please try again in a moment.')
      return
    }
    try {
      setPaymentLoading(true)
      setActiveTrack(trackId)
      const fieldMap = {
        junior: 'Frontend-Junior',
        mid: 'Frontend-Mid',
        senior: 'Frontend-Senior'
      } as const
      const order = await createOrder(fieldMap[trackId])

      const options = {
        key: order.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'MockAce Frontend Resources',
        description: order.sessionConfig?.name || 'Frontend resources track',
        order_id: order.orderId,
        handler: async (response: any) => {
          try {
            await verifyPayment(
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              trackId
            )
          } catch (err: any) {
            console.error(err)
            alert(err.message || 'Payment verification failed. Please contact support.')
          } finally {
            setPaymentLoading(false)
            setActiveTrack(null)
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: ''
        },
        theme: {
          color: '#7C3AED'
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false)
            setActiveTrack(null)
          }
        }
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      console.error('Payment initiation failed', error)
      alert(error.message || 'Unable to start payment. Please try again.')
      setPaymentLoading(false)
      setActiveTrack(null)
    }
  }

  const handleOpenCompanySheets = (type: 'frontend' | 'dsa') => {
    if (!ensureLoggedIn()) return
    if (type === 'frontend') {
      navigate('/company-sheets-frontend')
    } else {
      navigate('/company-sheets-dsa')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />

      <main className="relative z-10">
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white py-16 shadow-lg shadow-purple-900/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-4">
                <p className="text-sm tracking-widest uppercase font-semibold text-white/80">Frontend Interview Playbook</p>
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                  Curated Interview Resources by Experience Level
                </h1>
                <p className="text-lg text-white/90 max-w-2xl">
                  Choose the track that matches your experience band. Each plan bundles practice modules, live mock focus areas,
                  and deep-dive articles crafted for the exact questions companies ask today.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-white/80">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    <span>Interview-ready modules</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    <span>Real-world examples & code walkthroughs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    <span>Dedicated mock interview focus per level</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 space-y-4 w-full max-w-sm">
                <h2 className="text-xl font-semibold">What’s inside each track?</h2>
                <ul className="space-y-3 text-sm text-white/90">
                  <li className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-yellow-300 mt-0.5" />
                    <span>Module coverage aligned to the latest company interview rubrics.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-yellow-300 mt-0.5" />
                    <span>Pricing that reflects mock interview prep hours and downloadable notes.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-yellow-300 mt-0.5" />
                    <span>Featured articles with the exact structure shown in our sample blog format.</span>
                  </li>
                </ul>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-white text-purple-700 font-semibold py-3 rounded-xl shadow-sm hover:shadow-lg transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tracks */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {tracks.map((track) => {
            const trackAccess = accessState[track.id]
            const isUnlocked = trackAccess?.unlocked
            const includedViaSenior = trackAccess?.via === 'bundle'
            const buttonLabel = isUnlocked ? 'Resume Track' : track.ctaLabel

            return (
              <div key={track.id} className={`rounded-3xl px-6 sm:px-8 py-8 shadow-xl ${surfaceClass}`}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-wide text-purple-500 font-semibold mb-2">
                    <span className="px-3 py-1 bg-purple-100/80 text-purple-700 rounded-full">
                      {track.experienceRange} Experience
                    </span>
                    {!isUnlocked ? (
                      <span className="px-3 py-1 bg-emerald-100/80 text-emerald-700 rounded-full">
                        {track.price}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-100/80 text-emerald-700 rounded-full">
                        Access Unlocked
                      </span>
                    )}
                    {includedViaSenior && (
                      <span className="px-3 py-1 bg-blue-100/80 text-blue-700 rounded-full">
                        Included with Senior Plan
                      </span>
                    )}
                    {track.id === 'senior' && (
                      <span className="px-3 py-1 bg-pink-100/80 text-pink-700 rounded-full">
                        Unlocks Junior & 3-5Y Tracks
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                    {track.description}
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-slate-300 mt-4">
                    {track.outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleStartTrack(track.id)}
                  disabled={paymentLoading && activeTrack === track.id}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {paymentLoading && activeTrack === track.id ? 'Processing...' : buttonLabel}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                {track.modules.map((module) => (
                  <div key={module.title} className={`rounded-2xl p-5 ${subtleSurfaceClass}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{module.title}</h3>
                      <Zap className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-300 mb-4">{module.focus}</p>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-300">
                      {module.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <BookOpen className="w-4 h-4 text-purple-500 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Featured Articles */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Featured Deep-Dive Articles</span>
                </h3>
                {track.featuredArticles.map((article) => (
                  <article key={article.id} className={`rounded-3xl p-6 sm:p-8 space-y-5 ${subtleSurfaceClass}`}>
                    <header>
                      <p className="text-sm uppercase tracking-wide text-purple-500 font-semibold">Interview Story</p>
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-2">{article.title}</h4>
                    </header>
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-900 dark:text-slate-100">Why it matters</h5>
                        <p className="text-sm text-gray-600 dark:text-slate-300">{article.whyItMatters}</p>
                      </div>
                      <div className="md:col-span-2 space-y-3">
                        <h5 className="font-semibold text-gray-900 dark:text-slate-100">Summary</h5>
                        <p className="text-sm text-gray-600 dark:text-slate-300">{article.summary}</p>
                      </div>
                    </section>
                    <section className={`rounded-2xl border p-5 font-mono text-sm overflow-x-auto ${theme === 'dark' ? 'bg-slate-950/80 border-white/10 text-slate-100' : 'bg-gray-900 text-gray-100 border-gray-800'}`}>
                      <div className="flex items-center justify-between text-xs uppercase tracking-wide mb-3">
                        <span className="text-gray-400">Interview Code Snippet</span>
                        <span className={`${theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-gray-800 text-gray-100'} px-3 py-1 rounded-full`}>
                          {article.codeExample.language}
                        </span>
                      </div>
                      <pre>{article.codeExample.snippet}</pre>
                    </section>
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Explanation</h5>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-300">
                          {article.explanation.map((point, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Real-world example</h5>
                          <p className="text-sm text-gray-600 dark:text-slate-300">{article.realWorldExample}</p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Common mistake</h5>
                          <p className="text-sm text-gray-600 dark:text-slate-300 mb-2">{article.commonMistake.description}</p>
                          {article.commonMistake.snippet && (
                            <pre className="text-xs font-mono bg-black/70 text-gray-100 rounded-lg p-3 overflow-x-auto">
                              {article.commonMistake.snippet}
                            </pre>
                          )}
                          {article.commonMistake.fix && (
                            <p className="text-xs text-emerald-500 mt-1">✅ Fix: {article.commonMistake.fix}</p>
                          )}
                        </div>
                      </div>
                    </section>
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Interview questions to expect</h5>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-300">
                          {article.interviewQuestions.map((question, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-purple-500 font-semibold">Q{index + 1}.</span>
                              <span>{question}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Key takeaways</h5>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-300">
                          {article.keyTakeaways.map((takeaway, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                              <span>{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </section>
                  </article>
                ))}
              </div>
            </div>
            )
          })}
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className={`rounded-3xl px-6 sm:px-8 py-8 shadow-xl ${surfaceClass}`}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm uppercase tracking-wide text-emerald-500 font-semibold">Free Resource Library</p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Company-wise Interview Sheets</h2>
                <p className="text-sm text-gray-600 dark:text-slate-300 mt-2 max-w-3xl">
                  Access curated company-specific question banks for both DSA and Frontend interviews at no additional cost. Perfect for last-mile preparation once you&apos;ve mastered the core tracks.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <button
                onClick={() => handleOpenCompanySheets('frontend')}
                className="w-full bg-white dark:bg-slate-950/40 border border-emerald-200 dark:border-white/10 px-5 py-4 rounded-2xl flex items-center justify-between hover:border-emerald-400 hover:shadow-lg transition"
              >
                <div className="flex items-center space-x-3">
                  <Code className="w-6 h-6 text-emerald-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-slate-100">Frontend Companywise Sheets</p>
                    <p className="text-sm text-gray-600 dark:text-slate-300">
                      Curated UI, performance, and system design questions the top product companies rely on.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-semibold uppercase tracking-wide bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full">
                    Free
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
              <button
                onClick={() => handleOpenCompanySheets('dsa')}
                className="w-full bg-white dark:bg-slate-950/40 border border-emerald-200 dark:border-white/10 px-5 py-4 rounded-2xl flex items-center justify-between hover:border-emerald-400 hover:shadow-lg transition"
              >
                <div className="flex items-center space-x-3">
                  <Layers className="w-6 h-6 text-emerald-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-slate-100">DSA Company Sheets</p>
                    <p className="text-sm text-gray-600 dark:text-slate-300">
                      Problem sets mapped to the exact patterns and difficulty companies expect.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-semibold uppercase tracking-wide bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full">
                    Free
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default FrontendResources

