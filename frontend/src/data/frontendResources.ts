export type FrontendResourceArticle = {
  id: string
  title: string
  whyItMatters: string
  summary: string
  codeExample: {
    description: string
    language: string
    snippet: string
  }
  explanation: string[]
  realWorldExample: string
  commonMistake: {
    description: string
    snippet?: string
    fix?: string
  }
  interviewQuestions: string[]
  keyTakeaways: string[]
}

export type FrontendResourceModule = {
  title: string
  focus: string
  highlights: string[]
}

export type FrontendResourceTrack = {
  id: 'junior' | 'mid' | 'senior'
  experienceRange: string
  price: string
  priceNumber?: number // Store numeric price for calculations
  ctaLabel: string
  description: string
  outcomes: string[]
  modules: FrontendResourceModule[]
  featuredArticles: FrontendResourceArticle[]
}

// Mapping between track IDs and backend pricing IDs
export const trackToPricingId: Record<'junior' | 'mid' | 'senior', string> = {
  junior: 'Frontend-Junior',
  mid: 'Frontend-Mid',
  senior: 'Frontend-Senior'
}

// Base track data (without pricing - pricing will be fetched from backend)
export const frontendResourceTracksBase: Omit<FrontendResourceTrack, 'price' | 'priceNumber'>[] = [
  {
    id: 'junior',
    experienceRange: '1 – 3 Years',
    ctaLabel: 'Start Junior Track',
    description:
      'Build a rock-solid foundation in HTML, CSS, and modern JavaScript.',
    outcomes: [
      'Explain semantic HTML & accessibility trade-offs in real interviews',
      'Master CSS layouts (Flexbox, Grid) and responsive design patterns',
      'Internalize JavaScript fundamentals used in every code pairing round'
    ],
    modules: [
      {
        title: 'Core Web Foundations',
        focus: 'HTML & CSS mastery for junior engineers',
        highlights: [
          'Semantic HTML (header, main, article, nav) & accessibility roles',
          'Forms, validation, SEO-ready metadata & heading hierarchies',
          'Box model, display differences, Flexbox vs Grid & responsive media queries',
          'Transitions, transforms, pseudo classes/elements & CSS variables'
        ]
      },
      {
        title: 'JavaScript Essentials',
        focus: 'Modern ES6+ patterns that power every interview',
        highlights: [
          'Variables & scope, hoisting, lexical environments & closures',
          'Promises, async/await, event loop, micro vs macrotasks',
          'Array helpers (map/filter/reduce), destructuring, spread/rest',
          'Modules, template literals, error handling & debugging workflows'
        ]
      },
      {
        title: 'React Fundamentals',
        focus: 'Hooks-first component architecture',
        highlights: [
          'Functional components vs classes, props/state basics',
          'useState, useEffect, conditional rendering & list keys',
          'Controlled forms, routing with React Router, lifting state',
          'Intro to Context API, memoization & lazy loading strategies'
        ]
      }
    ],
    featuredArticles: []
  },
  {
    id: 'mid',
    experienceRange: '3 – 5 Years',
    ctaLabel: 'Unlock 3-5Y Track',
    description:
      'Bridge the gap between strong fundamentals and production-grade frontend systems.',
    outcomes: [
      'Confidently navigate complex JavaScript, performance, and architecture questions',
      'Design maintainable component systems and state management strategies',
      'Demonstrate end-to-end knowledge of build tooling, security, and networking'
    ],
    modules: [
      {
        title: 'Advanced JavaScript & Browser Mechanics',
        focus: 'Deep dive into runtime behaviour and performance',
        highlights: [
          'Event delegation, capturing/bubbling, debouncing & throttling',
          'Deep vs shallow copy, functional programming & immutability patterns',
          'Memory leaks, garbage collection, profiling, and optimization techniques',
          'Web APIs: Fetch, Storage APIs, Canvas/SVG, Service Workers & PWAs'
        ]
      },
      {
        title: 'React Architecture & Ecosystem',
        focus: 'Scaling React apps beyond the basics',
        highlights: [
          'Hooks in depth (useMemo, useCallback, custom hooks) & Context patterns',
          'State management (Redux Toolkit, Zustand, Recoil) trade-offs',
          'Error boundaries, Suspense, concurrent rendering & lazy data fetching',
          'Forms (React Hook Form/Formik), routing strategies & code splitting'
        ]
      },
      {
        title: 'Build, Security & Performance',
        focus: 'Create production-ready experiences',
        highlights: [
          'Webpack/Vite configuration, environment variables & CI/CD pipelines',
          'Tree shaking, code splitting, critical path, Core Web Vitals tuning',
          'Security fundamentals: XSS, CSRF, CSP, sanitization & HTTPS',
          'Testing pyramid: Jest/Vitest unit tests, RTL component tests, Cypress E2E'
        ]
      }
    ],
    featuredArticles: []
  },
  {
    id: 'senior',
    experienceRange: '5+ Years',
    ctaLabel: 'Join Senior Track',
    description:
      'Tailored for staff/principal-level interviews focusing on system design, architecture, and cross-team leadership.',
    outcomes: [
      'Design scalable frontend architectures (micro-frontends, SSR, module federation)',
      'Reason about trade-offs in performance, security, and product velocity',
      'Lead discussions on team processes, debugging strategy, and stakeholder communication'
    ],
    modules: [
      {
        title: 'System Design & Architecture',
        focus: 'Large scale application design',
        highlights: [
          'SPA vs MPA trade-offs, hybrid rendering, SSR/SSG with Next.js & Remix',
          'Micro-frontends, module federation & shared component libraries',
          'Folder structures, modular architecture, design systems & accessibility at scale',
          'CI/CD pipelines, blue-green deployments, feature flags & observability'
        ]
      },
      {
        title: 'Performance & Reliability',
        focus: 'Enterprise-grade optimizations',
        highlights: [
          'Critical rendering path, prefetching, resource hints & HTTP/2+ strategies',
          'Service workers, caching layers, offline-first patterns & PWAs',
          'Core Web Vitals deep dive (FCP, LCP, CLS) and Lighthouse optimization',
          'Security audits, threat modeling, CSP hardening & regulatory compliance'
        ]
      },
      {
        title: 'Leadership & Soft Skills',
        focus: 'Communicating trade-offs & mentoring teams',
        highlights: [
          'Explaining technical decisions to non-technical stakeholders',
          'Debugging frameworks, post-mortem culture & knowledge sharing',
          'Guiding live coding interviews and whiteboard sessions',
          'Hiring rubrics, leveling frameworks, and leading architecture reviews'
        ]
      }
    ],
    featuredArticles: []
  }
]

/**
 * Format price number to string with currency symbol
 */
const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`
}

/**
 * Fetch pricing from backend and populate tracks
 */
export const getFrontendResourceTracks = async (apiUrl: string = ''): Promise<FrontendResourceTrack[]> => {
  try {
    // Fetch all pricing from backend
    const response = await fetch(`${apiUrl}/api/pricing/sessions`)
    const data = await response.json()
    
    if (data.success && data.data.sessionTypes) {
      const pricingMap = new Map<string, number>()
      
      // Create a map of pricing ID to price
      data.data.sessionTypes.forEach((session: any) => {
        pricingMap.set(session.id, session.price)
      })
      
      // Populate tracks with pricing from backend
      return frontendResourceTracksBase.map(track => {
        const pricingId = trackToPricingId[track.id]
        const priceNumber = pricingMap.get(pricingId) || 999 // Fallback price
        const price = formatPrice(priceNumber)
        
        return {
          ...track,
          price,
          priceNumber
        }
      })
    }
  } catch (error) {
    console.error('Error fetching frontend resource pricing:', error)
  }
  
  // Fallback: return tracks with default pricing if API fails
  const defaultPricing: Record<'junior' | 'mid' | 'senior', number> = {
    junior: 799,
    mid: 1199,
    senior: 1799
  }
  
  return frontendResourceTracksBase.map(track => {
    const priceNumber = defaultPricing[track.id]
    return {
      ...track,
      price: formatPrice(priceNumber),
      priceNumber
    }
  })
}

// Export default tracks for backward compatibility (will be populated with pricing when fetched)
export const frontendResourceTracks: FrontendResourceTrack[] = frontendResourceTracksBase.map(track => {
  const defaultPricing: Record<'junior' | 'mid' | 'senior', number> = {
    junior: 799,
    mid: 1199,
    senior: 1799
  }
  const priceNumber = defaultPricing[track.id]
  return {
    ...track,
    price: formatPrice(priceNumber),
    priceNumber
  }
})

