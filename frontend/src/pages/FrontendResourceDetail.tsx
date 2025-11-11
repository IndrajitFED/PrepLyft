import React, { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { frontendResourceTopics as juniorTopics } from '../data/frontendResourceContent'
import { midLevelResourceTopics } from '../data/frontendResourceMidLevel'
import { seniorResourceTopics } from '../data/frontendResourceSenior'
import { useTheme } from '../contexts/ThemeContext'
import { ArrowLeft, CheckCircle2, Link2 } from 'lucide-react'

const FrontendResourceDetail: React.FC = () => {
  const { trackId, topicId, subtopicId } = useParams<{
    trackId: 'junior' | 'mid' | 'senior'
    topicId: string
    subtopicId: string
  }>()
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

  const subtopic = useMemo(() => {
    if (!trackId || !topicId || !subtopicId) return null
    const allTopics = [...juniorTopics, ...midLevelResourceTopics, ...seniorResourceTopics]
    const topic = allTopics.find((t) => t.trackId === trackId && t.id === topicId)
    if (!topic) return null
    return topic.subtopics.find((s) => s.id === subtopicId) || null
  }, [trackId, topicId, subtopicId])

  if (!trackId || !subtopic) {
    return null
  }

  const surfaceClass =
    theme === 'dark'
      ? 'bg-slate-900/70 border border-white/10'
      : 'bg-white border border-gray-200'

  const subtleClass =
    theme === 'dark'
      ? 'bg-slate-950/60 border border-white/10'
      : 'bg-gray-50 border border-gray-200'

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />

      <main className="relative z-10">
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white py-14 shadow-lg shadow-purple-900/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
            <button
              onClick={() => navigate(`/frontend-resources/${trackId}/topics`)}
              className="inline-flex items-center text-white/80 hover:text-white transition text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to track
            </button>
            <div>
              <p className="text-sm uppercase tracking-widest font-semibold text-white/80">
                {subtopic.title}
              </p>
              <h1 className="text-3xl font-bold leading-tight">{subtopic.seoTitle}</h1>
              <p className="text-white/90 max-w-2xl mt-2">{subtopic.oneLiner}</p>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          <div className={`rounded-3xl px-6 py-8 shadow-xl ${surfaceClass}`}>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Why this matters</h2>
              <p className="text-gray-600 dark:text-slate-300">{subtopic.importance}</p>
              <div className={subtleClass + ' rounded-2xl px-4 py-4'}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
                  Common interview questions
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-slate-300">
                  {subtopic.commonQuestions.map((question, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className={`rounded-3xl px-6 py-8 shadow-xl space-y-4 ${surfaceClass}`}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Concept breakdown</h2>
            <div className="space-y-3 text-gray-600 dark:text-slate-300">
              {subtopic.conceptDescription.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className={`rounded-3xl px-6 py-8 shadow-xl space-y-4 ${surfaceClass}`}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">
              {subtopic.codeExample.caption}
            </h2>
            <pre
              className={`rounded-2xl border p-5 overflow-x-auto font-mono text-sm ${
                theme === 'dark'
                  ? 'bg-slate-950/80 border-white/10 text-slate-100'
                  : 'bg-gray-900 text-gray-100 border-gray-800'
              }`}
            >
              {subtopic.codeExample.snippet}
            </pre>
            <div className="space-y-2 text-sm text-gray-600 dark:text-slate-300">
              <h3 className="font-semibold text-gray-900 dark:text-slate-100">Step-by-step explanation</h3>
              <ul className="space-y-2">
                {subtopic.stepByStep.map((step, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`rounded-3xl px-6 py-8 shadow-xl space-y-4 ${surfaceClass}`}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Real-world application</h2>
            <p className="text-gray-600 dark:text-slate-300">{subtopic.realWorldUseCase}</p>
            {subtopic.diagramHint && (
              <p className="text-sm text-purple-500">Diagram idea: {subtopic.diagramHint}</p>
            )}
          </div>

          <div className={`rounded-3xl px-6 py-8 shadow-xl space-y-4 ${surfaceClass}`}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Common mistakes & gotchas</h2>
            <ul className="space-y-2 text-gray-600 dark:text-slate-300">
              {subtopic.commonMistakes.map((mistake, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-500 mt-0.5" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

  <div className={`rounded-3xl px-6 py-8 shadow-xl space-y-4 ${surfaceClass}`}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">
              Interview questions to expect
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-slate-300">
              {subtopic.interviewQuestions.map((question, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-purple-500 font-semibold">Q{index + 1}.</span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`rounded-3xl px-6 py-8 shadow-xl space-y-4 ${surfaceClass}`}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Key takeaways</h2>
            <ul className="space-y-2 text-gray-600 dark:text-slate-300">
              {subtopic.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`rounded-3xl px-6 py-8 shadow-xl space-y-4 ${surfaceClass}`}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Quick references</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subtopic.quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 hover:border-purple-400 transition"
                >
                  <Link2 className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-purple-600 dark:text-purple-300">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default FrontendResourceDetail

