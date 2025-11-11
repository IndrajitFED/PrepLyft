import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { frontendResourceTopics as juniorTopics } from '../data/frontendResourceContent'
import { midLevelResourceTopics } from '../data/frontendResourceMidLevel'
import { seniorResourceTopics } from '../data/frontendResourceSenior'
import { useTheme } from '../contexts/ThemeContext'
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react'

const FrontendResourceTopics: React.FC = () => {
  const { trackId } = useParams<{ trackId: 'junior' | 'mid' | 'senior' }>()
  const navigate = useNavigate()
  const { theme } = useTheme()

  useEffect(() => {
    if (!trackId) return
    const key = `frontend-track-access-${trackId}`
    const hasDirectAccess = localStorage.getItem(key)
    const hasSeniorAccess = localStorage.getItem('frontend-track-access-senior')
    const isBundled = trackId !== 'senior' && hasSeniorAccess
    if (!hasDirectAccess && !isBundled) {
      navigate('/frontend-resources', { replace: true })
    }
  }, [trackId, navigate])

  if (!trackId) {
    return null
  }

  const allTopics = React.useMemo(() => [...juniorTopics, ...midLevelResourceTopics, ...seniorResourceTopics], [])
  const trackTopics = allTopics.filter((topic) => topic.trackId === trackId)

  const titleMap: Record<'junior' | 'mid' | 'senior', { title: string; subtitle: string }> = {
    junior: {
      title: 'Core Web Foundations Track',
      subtitle: 'Lay the groundwork for HTML, CSS, and JavaScript interview questions.'
    },
    mid: {
      title: 'Advanced Frontend Track',
      subtitle: 'Dive into architecture, performance, and large-scale application concerns.'
    },
    senior: {
      title: 'Leadership & System Design Track',
      subtitle: 'Prepare for staff-level conversations around architecture, reliability, and team leadership.'
    }
  }

  const surfaceClass =
    theme === 'dark'
      ? 'bg-slate-900/70 border border-white/10'
      : 'bg-white border border-gray-200'

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />

      <main className="relative z-10">
        <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-14 shadow-lg shadow-purple-900/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
            <button
              onClick={() => navigate('/frontend-resources')}
              className="inline-flex items-center text-white/80 hover:text-white transition text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to tracks
            </button>
            <div>
              <p className="text-sm uppercase tracking-widest font-semibold text-white/80">
                Track Library
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold">{titleMap[trackId].title}</h1>
              <p className="text-white/90 mt-2 max-w-2xl">{titleMap[trackId].subtitle}</p>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          {trackTopics.map((topic) => (
            <div key={topic.id} className={`rounded-3xl px-6 py-8 shadow-xl ${surfaceClass}`}>
              <div className="flex items-start justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">
                    {topic.title}
                  </h2>
                  <p className="text-gray-600 dark:text-slate-300 mt-2 max-w-3xl">{topic.summary}</p>
                </div>
              </div>
              <div className="space-y-4">
                {topic.subtopics.map((subtopic) => (
                  <button
                    key={subtopic.id}
                    onClick={() =>
                      navigate(`/frontend-resources/${trackId}/topics/${topic.id}/${subtopic.id}`)
                    }
                    className="w-full text-left bg-gradient-to-r from-gray-50 to-white dark:from-slate-950/40 dark:to-slate-900/60 border border-gray-200 dark:border-white/10 rounded-2xl px-4 sm:px-6 py-4 hover:border-purple-400 hover:shadow-lg transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                            {subtopic.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
                            {subtopic.oneLiner}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default FrontendResourceTopics

