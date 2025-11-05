export interface FrontendQuestion {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  topic: string
  category: string
  frequency: number
  description: string
  hints: string[]
  resources: string[]
  url: string
  companies: string[]
  interviewType: 'Technical' | 'Machine Coding' | 'System Design' | 'Behavioral'
}

export interface FrontendTopicSheet {
  id: string
  name: string
  logo: string
  description: string
  totalQuestions: number
  completedQuestions: number
  difficulty: string
  estimatedTime: string
  questions: FrontendQuestion[]
  color: string
  category: string
}

export const frontendTopicSheets: FrontendTopicSheet[] = [
  // JavaScript Fundamentals
  {
    id: 'javascript-fundamentals',
    name: 'JavaScript Fundamentals',
    logo: '⚡',
    description: 'Master core JavaScript concepts including closures, promises, async/await, and event loop',
    totalQuestions: 28,
    completedQuestions: 0,
    difficulty: 'Medium-Hard',
    estimatedTime: '3-4 weeks',
    color: 'from-yellow-500 to-orange-500',
    category: 'JavaScript',
    questions: [
      { 
        id: 'js1', 
        title: 'JavaScript Closures Deep Dive', 
        difficulty: 'Hard', 
        topic: 'Closures', 
        category: 'JavaScript',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple'],
        interviewType: 'Technical',
        frequency: 95, 
        description: 'Explain JavaScript closures with practical examples. Cover lexical scoping, closure creation, memory implications, and common use cases like module patterns and function factories.',
        hints: [
          'Understand lexical scoping and scope chain',
          'Explain how closures capture variables from outer scope',
          'Demonstrate closure with practical examples',
          'Discuss memory implications and potential leaks',
          'Show module pattern and function factory examples'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
          'https://javascript.info/closure',
          'https://www.freecodecamp.org/news/javascript-closures-explained/'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures'
      },
      { 
        id: 'js2', 
        title: 'Promise Implementation and Async Patterns', 
        difficulty: 'Hard', 
        topic: 'Promises', 
        category: 'JavaScript',
        companies: ['Google', 'Meta', 'Amazon', 'Netflix', 'Uber'],
        interviewType: 'Technical',
        frequency: 92, 
        description: 'Implement a custom Promise class from scratch. Cover Promise.all, Promise.race, Promise.allSettled, and async/await patterns. Handle error propagation and chaining.',
        hints: [
          'Implement Promise constructor with resolve/reject',
          'Handle then/catch/finally methods',
          'Implement Promise.all with proper error handling',
          'Create Promise.race and Promise.allSettled',
          'Show async/await implementation'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
          'https://javascript.info/promise-basics',
          'https://web.dev/promises/'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise'
      },
      { 
        id: 'js3', 
        title: 'Event Loop and Asynchronous JavaScript', 
        difficulty: 'Hard', 
        topic: 'Event Loop', 
        category: 'JavaScript',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'LinkedIn'],
        interviewType: 'Technical',
        frequency: 88, 
        description: 'Explain JavaScript event loop, call stack, task queue, and microtask queue. Provide code examples showing execution order and demonstrate macro vs micro tasks.',
        hints: [
          'Explain call stack, heap, and queue concepts',
          'Distinguish between macro and micro tasks',
          'Show execution order with setTimeout vs Promise',
          'Demonstrate blocking vs non-blocking operations',
          'Explain Web APIs and callback queue'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop',
          'https://javascript.info/event-loop',
          'https://blog.sessionstack.com/how-javascript-works-event-loop-and-the-rise-of-async-programming-5-ways-to-better-coding-with-2f077c4438b5'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop'
      },
      { 
        id: 'js4', 
        title: 'Advanced JavaScript Concepts', 
        difficulty: 'Hard', 
        topic: 'Advanced JS', 
        category: 'JavaScript',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple'],
        interviewType: 'Technical',
        frequency: 85, 
        description: 'Cover advanced JavaScript concepts including prototypal inheritance, this binding, hoisting, temporal dead zone, and ES6+ features like destructuring, modules, and generators.',
        hints: [
          'Explain prototypal inheritance vs classical inheritance',
          'Demonstrate this binding in different contexts',
          'Show hoisting behavior with var, let, const',
          'Explain temporal dead zone concept',
          'Cover ES6+ features and their benefits'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
          'https://javascript.info/',
          'https://www.freecodecamp.org/news/learn-javascript/'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide'
      },
      { 
        id: 'js5', 
        title: 'Promise Chaining and Error Handling', 
        difficulty: 'Hard', 
        topic: 'Promise Patterns', 
        category: 'JavaScript',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix'],
        interviewType: 'Technical',
        frequency: 90, 
        description: 'Master promise chaining patterns, error propagation, Promise.all vs Promise.allSettled, and implement robust error handling strategies for async operations.',
        hints: [
          'Implement proper promise chaining',
          'Handle errors in promise chains',
          'Use Promise.allSettled for partial failures',
          'Implement retry logic with exponential backoff',
          'Create promise-based utilities and helpers'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled',
          'https://javascript.info/promise-chaining',
          'https://web.dev/promises/'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled'
      },
      { 
        id: 'js6', 
        title: 'Async/Await vs Promises', 
        difficulty: 'Medium', 
        topic: 'Async Patterns', 
        category: 'JavaScript',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'LinkedIn'],
        interviewType: 'Technical',
        frequency: 88, 
        description: 'Compare async/await with promises, implement parallel vs sequential async operations, and handle complex async flows with proper error handling.',
        hints: [
          'Compare async/await with promise chains',
          'Implement parallel async operations',
          'Handle errors in async/await',
          'Use Promise.all with async/await',
          'Implement async generators and iterators'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
          'https://javascript.info/async-await',
          'https://web.dev/async-await/'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function'
      },
      { 
        id: 'js7', 
        title: 'Promise-based API Design', 
        difficulty: 'Hard', 
        topic: 'API Design', 
        category: 'JavaScript',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Stripe'],
        interviewType: 'Technical',
        frequency: 85, 
        description: 'Design promise-based APIs for complex operations like file uploads with progress, batch processing, and cancellation support.',
        hints: [
          'Design APIs that return promises',
          'Implement progress tracking for long operations',
          'Add cancellation support with AbortController',
          'Handle batch operations efficiently',
          'Create composable async utilities'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/API/AbortController',
          'https://web.dev/cancelable-promises/',
          'https://javascript.info/promise-api'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/AbortController'
      }
    ]
  },
  // Machine Coding Rounds
  {
    id: 'machine-coding',
    name: 'Machine Coding Rounds',
    logo: '🛠️',
    description: 'Build complete UI components from scratch in 30-45 minutes',
    totalQuestions: 30,
    completedQuestions: 0,
    difficulty: 'Medium-Hard',
    estimatedTime: '2-3 weeks',
    color: 'from-green-500 to-teal-500',
    category: 'Machine Coding',
    questions: [
      { 
        id: 'mc1', 
        title: 'Build a Carousel Component', 
        difficulty: 'Medium', 
        topic: 'Carousel', 
        category: 'Machine Coding',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix'],
        interviewType: 'Machine Coding',
        frequency: 90, 
        description: 'Create a responsive image carousel with autoplay, manual navigation, touch/swipe support, and infinite loop. Include indicators and smooth transitions.',
        hints: [
          'Implement touch/swipe gestures for mobile',
          'Add autoplay with pause on hover',
          'Create smooth CSS transitions',
          'Handle infinite loop logic',
          'Add keyboard navigation support'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/API/Touch_events',
          'https://css-tricks.com/css-animations/',
          'https://reactjs.org/docs/hooks-effect.html'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Touch_events'
      },
      { 
        id: 'mc2', 
        title: 'Create a Pagination Component', 
        difficulty: 'Medium', 
        topic: 'Pagination', 
        category: 'Machine Coding',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'LinkedIn'],
        interviewType: 'Machine Coding',
        frequency: 85, 
        description: 'Build a pagination component that handles large datasets efficiently. Include page numbers, previous/next buttons, page size selector, and jump to page functionality.',
        hints: [
          'Calculate total pages based on data length',
          'Implement ellipsis for large page counts',
          'Add page size selection dropdown',
          'Handle edge cases (first/last page)',
          'Optimize for performance with large datasets'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice',
          'https://reactjs.org/docs/hooks-state.html',
          'https://web.dev/pagination/'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice'
      },
      { 
        id: 'mc3', 
        title: 'Build a Header Component', 
        difficulty: 'Medium', 
        topic: 'Header', 
        category: 'Machine Coding',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple'],
        interviewType: 'Machine Coding',
        frequency: 88, 
        description: 'Create a responsive header with navigation menu, search bar, user profile dropdown, and mobile hamburger menu. Include sticky behavior and smooth animations.',
        hints: [
          'Implement responsive navigation with hamburger menu',
          'Add sticky header behavior on scroll',
          'Create dropdown menus with proper positioning',
          'Include search functionality with debouncing',
          'Add smooth animations and transitions'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/CSS/position',
          'https://web.dev/responsive-web-design-basics/',
          'https://reactjs.org/docs/hooks-callback.html'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/position'
      },
      { 
        id: 'mc4', 
        title: 'Create a Footer Component', 
        difficulty: 'Easy', 
        topic: 'Footer', 
        category: 'Machine Coding',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'LinkedIn'],
        interviewType: 'Machine Coding',
        frequency: 75, 
        description: 'Build a comprehensive footer with multiple columns, social media links, newsletter signup, and responsive design. Include proper semantic HTML.',
        hints: [
          'Use semantic HTML elements (footer, nav, section)',
          'Create responsive grid layout',
          'Add social media icons and links',
          'Implement newsletter signup form',
          'Include proper accessibility attributes'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer',
          'https://web.dev/accessibility/',
          'https://css-tricks.com/css-grid/'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer'
      },
      { 
        id: 'mc5', 
        title: 'Build a Modal/Dialog Component', 
        difficulty: 'Medium', 
        topic: 'Modal', 
        category: 'Machine Coding',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix'],
        interviewType: 'Machine Coding',
        frequency: 82, 
        description: 'Create a reusable modal component with backdrop, close button, escape key handling, focus management, and smooth animations.',
        hints: [
          'Implement focus trap for accessibility',
          'Handle escape key and backdrop click',
          'Add smooth enter/exit animations',
          'Prevent body scroll when modal is open',
          'Make it reusable with different content'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_dialog_role',
          'https://web.dev/focus-management/',
          'https://reactjs.org/docs/portals.html'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_dialog_role'
      },
      { 
        id: 'mc6', 
        title: 'Build a Dropdown/Select Component', 
        difficulty: 'Medium', 
        topic: 'Dropdown', 
        category: 'Machine Coding',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'LinkedIn'],
        interviewType: 'Machine Coding',
        frequency: 85, 
        description: 'Create a custom dropdown component with search, multi-select, keyboard navigation, and proper accessibility support.',
        hints: [
          'Implement keyboard navigation (arrow keys, enter, escape)',
          'Add search functionality with filtering',
          'Support multi-select with checkboxes',
          'Handle click outside to close',
          'Ensure proper ARIA attributes'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/combobox_role',
          'https://web.dev/keyboard-navigation/',
          'https://reactjs.org/docs/hooks-effect.html'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/combobox_role'
      },
      { 
        id: 'mc7', 
        title: 'Build a Toast Notification System', 
        difficulty: 'Easy', 
        topic: 'Notifications', 
        category: 'Machine Coding',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Slack'],
        interviewType: 'Machine Coding',
        frequency: 80, 
        description: 'Create a toast notification system with different types (success, error, warning), auto-dismiss, manual close, and queue management.',
        hints: [
          'Implement different notification types',
          'Add auto-dismiss with configurable timeout',
          'Handle notification queue and stacking',
          'Add smooth animations for enter/exit',
          'Support manual dismissal'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API',
          'https://web.dev/animations/',
          'https://reactjs.org/docs/hooks-state.html'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API'
      },
      { 
        id: 'mc8', 
        title: 'Build a Search Bar with Autocomplete', 
        difficulty: 'Hard', 
        topic: 'Search', 
        category: 'Machine Coding',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Spotify'],
        interviewType: 'Machine Coding',
        frequency: 88, 
        description: 'Create a search bar with autocomplete suggestions, debouncing, keyboard navigation, and recent searches functionality.',
        hints: [
          'Implement debouncing for search input',
          'Add keyboard navigation for suggestions',
          'Cache recent searches in localStorage',
          'Handle loading states and errors',
          'Support click and keyboard selection'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/API/Storage',
          'https://web.dev/debounce-your-javascript-function/',
          'https://reactjs.org/docs/hooks-callback.html'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Storage'
      },
      { 
        id: 'mc9', 
        title: 'Build a Progress Bar Component', 
        difficulty: 'Easy', 
        topic: 'Progress', 
        category: 'Machine Coding',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'GitHub'],
        interviewType: 'Machine Coding',
        frequency: 75, 
        description: 'Create a progress bar component with different styles, animations, indeterminate state, and customizable appearance.',
        hints: [
          'Support different progress bar styles',
          'Add smooth animations for progress changes',
          'Implement indeterminate/loading state',
          'Make it customizable with props',
          'Handle edge cases (0%, 100%)'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations',
          'https://web.dev/css-animations/',
          'https://reactjs.org/docs/components-and-props.html'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations'
      },
      { 
        id: 'mc10', 
        title: 'Build a Tabs Component', 
        difficulty: 'Medium', 
        topic: 'Tabs', 
        category: 'Machine Coding',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Twitter'],
        interviewType: 'Machine Coding',
        frequency: 83, 
        description: 'Create a tabs component with keyboard navigation, lazy loading, and smooth transitions between tab content.',
        hints: [
          'Implement keyboard navigation (arrow keys, home, end)',
          'Add lazy loading for tab content',
          'Support dynamic tab addition/removal',
          'Handle tab overflow with scrolling',
          'Add smooth transitions between tabs'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role',
          'https://web.dev/keyboard-navigation/',
          'https://reactjs.org/docs/hooks-effect.html'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role'
      }
    ]
  },
  // React Optimization
  {
    id: 'react-optimization',
    name: 'React Performance & Optimization',
    logo: '⚛️',
    description: 'Master React performance optimization, hooks, and advanced patterns',
    totalQuestions: 35,
    completedQuestions: 0,
    difficulty: 'Hard',
    estimatedTime: '4-5 weeks',
    color: 'from-blue-500 to-cyan-500',
    category: 'React',
    questions: [
      { 
        id: 'ro1', 
        title: 'Virtual Scrolling Implementation', 
        difficulty: 'Hard', 
        topic: 'Virtual Scrolling', 
        category: 'React',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'LinkedIn'],
        interviewType: 'Technical',
        frequency: 90, 
        description: 'Implement virtual scrolling for large lists (10k+ items) with dynamic item heights, smooth scrolling, and proper memory management.',
        hints: [
          'Calculate visible items based on scroll position',
          'Implement dynamic height calculation',
          'Use Intersection Observer for performance',
          'Handle scroll events efficiently',
          'Manage memory with proper cleanup'
        ],
        resources: [
          'https://reactjs.org/docs/hooks-reference.html#usememo',
          'https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API',
          'https://web.dev/virtualize-long-lists-react-window/'
        ],
        url: 'https://reactjs.org/docs/hooks-reference.html#usememo'
      },
      { 
        id: 'ro2', 
        title: 'Advanced React Hooks Patterns', 
        difficulty: 'Hard', 
        topic: 'Custom Hooks', 
        category: 'React',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple'],
        interviewType: 'Technical',
        frequency: 88, 
        description: 'Create custom hooks for complex state management, API calls, form handling, and performance optimization. Include proper error handling and cleanup.',
        hints: [
          'Create reusable custom hooks',
          'Implement proper cleanup in useEffect',
          'Handle loading and error states',
          'Use useCallback and useMemo appropriately',
          'Follow hooks rules and best practices'
        ],
        resources: [
          'https://reactjs.org/docs/hooks-custom.html',
          'https://reactjs.org/docs/hooks-rules.html',
          'https://kentcdodds.com/blog/useeffect-vs-uselayouteffect'
        ],
        url: 'https://reactjs.org/docs/hooks-custom.html'
      },
      { 
        id: 'ro3', 
        title: 'React Context Optimization', 
        difficulty: 'Hard', 
        topic: 'Context API', 
        category: 'React',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix'],
        interviewType: 'Technical',
        frequency: 85, 
        description: 'Optimize React Context to prevent unnecessary re-renders. Implement context splitting, memoization, and proper provider patterns.',
        hints: [
          'Split contexts to avoid unnecessary re-renders',
          'Use React.memo with context consumers',
          'Implement context value memoization',
          'Create context provider composition patterns',
          'Handle context updates efficiently'
        ],
        resources: [
          'https://reactjs.org/docs/context.html',
          'https://kentcdodds.com/blog/how-to-use-react-context-effectively',
          'https://reactjs.org/docs/hooks-reference.html#usecontext'
        ],
        url: 'https://reactjs.org/docs/context.html'
      },
      { 
        id: 'ro4', 
        title: 'React Bundle Optimization', 
        difficulty: 'Hard', 
        topic: 'Bundle Optimization', 
        category: 'React',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'LinkedIn'],
        interviewType: 'Technical',
        frequency: 87, 
        description: 'Implement code splitting, lazy loading, tree shaking, and bundle analysis. Optimize for Core Web Vitals and loading performance.',
        hints: [
          'Implement React.lazy and Suspense',
          'Use dynamic imports for code splitting',
          'Analyze bundle size with webpack-bundle-analyzer',
          'Optimize for Core Web Vitals',
          'Implement proper loading states'
        ],
        resources: [
          'https://reactjs.org/docs/code-splitting.html',
          'https://web.dev/code-splitting/',
          'https://web.dev/vitals/'
        ],
        url: 'https://reactjs.org/docs/code-splitting.html'
      },
      { 
        id: 'ro5', 
        title: 'React Performance Profiling', 
        difficulty: 'Hard', 
        topic: 'Performance Profiling', 
        category: 'React',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix'],
        interviewType: 'Technical',
        frequency: 85, 
        description: 'Use React DevTools Profiler, identify performance bottlenecks, implement React.memo, useMemo, and useCallback effectively.',
        hints: [
          'Use React DevTools Profiler to identify issues',
          'Implement React.memo for component memoization',
          'Use useMemo for expensive calculations',
          'Use useCallback for stable function references',
          'Identify unnecessary re-renders'
        ],
        resources: [
          'https://reactjs.org/docs/profiler.html',
          'https://reactjs.org/docs/hooks-reference.html#usememo',
          'https://reactjs.org/docs/hooks-reference.html#usecallback'
        ],
        url: 'https://reactjs.org/docs/profiler.html'
      },
      { 
        id: 'ro6', 
        title: 'React State Management Optimization', 
        difficulty: 'Hard', 
        topic: 'State Management', 
        category: 'React',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Redux'],
        interviewType: 'Technical',
        frequency: 90, 
        description: 'Optimize Redux/Context state management, implement selectors, normalize state shape, and prevent unnecessary re-renders.',
        hints: [
          'Implement proper state normalization',
          'Use selectors to prevent unnecessary re-renders',
          'Optimize Redux store structure',
          'Implement proper action creators',
          'Use middleware for side effects'
        ],
        resources: [
          'https://redux.js.org/usage/deriving-data-selectors',
          'https://redux.js.org/usage/structuring-reducers/normalizing-state-shape',
          'https://reactjs.org/docs/context.html'
        ],
        url: 'https://redux.js.org/usage/deriving-data-selectors'
      },
      { 
        id: 'ro7', 
        title: 'React Concurrent Features', 
        difficulty: 'Hard', 
        topic: 'Concurrent Features', 
        category: 'React',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple'],
        interviewType: 'Technical',
        frequency: 88, 
        description: 'Implement React 18 concurrent features including Suspense, startTransition, useDeferredValue, and concurrent rendering patterns.',
        hints: [
          'Use Suspense for data fetching',
          'Implement startTransition for non-urgent updates',
          'Use useDeferredValue for deferred state',
          'Handle concurrent rendering patterns',
          'Implement proper error boundaries'
        ],
        resources: [
          'https://reactjs.org/docs/concurrent-mode-intro.html',
          'https://reactjs.org/docs/hooks-reference.html#usedeferredvalue',
          'https://reactjs.org/docs/hooks-reference.html#usetransition'
        ],
        url: 'https://reactjs.org/docs/concurrent-mode-intro.html'
      },
      { 
        id: 'ro8', 
        title: 'React Server Components', 
        difficulty: 'Hard', 
        topic: 'Server Components', 
        category: 'React',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Vercel'],
        interviewType: 'Technical',
        frequency: 82, 
        description: 'Implement React Server Components, understand the difference between client and server components, and optimize for SSR.',
        hints: [
          'Understand client vs server components',
          'Implement proper data fetching patterns',
          'Handle hydration properly',
          'Optimize for server-side rendering',
          'Use proper component boundaries'
        ],
        resources: [
          'https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html',
          'https://nextjs.org/docs/advanced-features/react-18',
          'https://vercel.com/blog/understanding-react-server-components'
        ],
        url: 'https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html'
      }
    ]
  },
  // System Design
  {
    id: 'system-design',
    name: 'Frontend System Design',
    logo: '🏗️',
    description: 'Design scalable frontend architectures and systems',
    totalQuestions: 25,
    completedQuestions: 0,
    difficulty: 'Hard',
    estimatedTime: '5-6 weeks',
    color: 'from-purple-500 to-pink-500',
    category: 'System Design',
    questions: [
      { 
        id: 'sd1', 
        title: 'Design a Real-time Chat System', 
        difficulty: 'Hard', 
        topic: 'Real-time Systems', 
        category: 'System Design',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Slack'],
        interviewType: 'System Design',
        frequency: 92, 
        description: 'Design a scalable real-time chat system frontend. Handle WebSocket connections, message queuing, offline support, and message synchronization.',
        hints: [
          'Design WebSocket connection management',
          'Implement message queuing and retry logic',
          'Handle offline/online state transitions',
          'Design message synchronization strategy',
          'Consider scalability and performance'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket',
          'https://socket.io/docs/v4/client-api/',
          'https://web.dev/offline-storage/'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket'
      },
      { 
        id: 'sd2', 
        title: 'Design a Video Streaming Platform', 
        difficulty: 'Hard', 
        topic: 'Media Streaming', 
        category: 'System Design',
        companies: ['Netflix', 'YouTube', 'Amazon', 'Microsoft', 'Apple'],
        interviewType: 'System Design',
        frequency: 88, 
        description: 'Design frontend architecture for a video streaming platform with adaptive bitrate streaming, offline viewing, and recommendation system.',
        hints: [
          'Implement adaptive bitrate streaming',
          'Design offline viewing capabilities',
          'Create recommendation system UI',
          'Handle video player state management',
          'Optimize for different devices'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement',
          'https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API',
          'https://web.dev/video-and-source/'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement'
      },
      { 
        id: 'sd3', 
        title: 'Design a Social Media Feed', 
        difficulty: 'Hard', 
        topic: 'Social Media', 
        category: 'System Design',
        companies: ['Meta', 'Twitter', 'LinkedIn', 'TikTok', 'Instagram'],
        interviewType: 'System Design',
        frequency: 90, 
        description: 'Design an infinite scroll social media feed with real-time updates, content moderation, and engagement features.',
        hints: [
          'Implement infinite scroll with virtual scrolling',
          'Handle real-time content updates',
          'Design content moderation system',
          'Implement engagement features (likes, comments)',
          'Optimize for mobile performance'
        ],
        resources: [
          'https://web.dev/infinite-scroll/',
          'https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API',
          'https://reactjs.org/docs/hooks-effect.html'
        ],
        url: 'https://web.dev/infinite-scroll/'
      },
      { 
        id: 'sd4', 
        title: 'Design a E-commerce Platform', 
        difficulty: 'Hard', 
        topic: 'E-commerce', 
        category: 'System Design',
        companies: ['Amazon', 'eBay', 'Shopify', 'Walmart', 'Target'],
        interviewType: 'System Design',
        frequency: 85, 
        description: 'Design frontend for an e-commerce platform with product catalog, shopping cart, checkout flow, and payment integration.',
        hints: [
          'Design product catalog with filtering',
          'Implement shopping cart state management',
          'Create secure checkout flow',
          'Integrate payment processing',
          'Handle inventory and pricing updates'
        ],
        resources: [
          'https://web.dev/payment-request-api/',
          'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
          'https://reactjs.org/docs/hooks-reference.html#usereducer'
        ],
        url: 'https://web.dev/payment-request-api/'
      }
    ]
  },
  // Security
  {
    id: 'security',
    name: 'Frontend Security',
    logo: '🔒',
    description: 'Secure frontend applications and prevent common vulnerabilities',
    totalQuestions: 25,
    completedQuestions: 0,
    difficulty: 'Hard',
    estimatedTime: '3-4 weeks',
    color: 'from-red-500 to-orange-500',
    category: 'Security',
    questions: [
      { 
        id: 'sec1', 
        title: 'Prevent XSS Attacks', 
        difficulty: 'Hard', 
        topic: 'XSS Prevention', 
        category: 'Security',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'PayPal'],
        interviewType: 'Technical',
        frequency: 90, 
        description: 'Implement comprehensive XSS prevention including input sanitization, Content Security Policy, and safe DOM manipulation.',
        hints: [
          'Sanitize user input before rendering',
          'Implement Content Security Policy (CSP)',
          'Use proper DOM manipulation methods',
          'Validate and escape user data',
          'Implement proper error handling'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP',
          'https://owasp.org/www-community/attacks/xss/',
          'https://web.dev/trusted-types/'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP'
      },
      { 
        id: 'sec2', 
        title: 'Secure Authentication Flow', 
        difficulty: 'Hard', 
        topic: 'Authentication', 
        category: 'Security',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Auth0'],
        interviewType: 'Technical',
        frequency: 88, 
        description: 'Implement secure authentication with JWT tokens, refresh tokens, secure storage, and proper session management.',
        hints: [
          'Implement JWT token handling',
          'Use secure storage for tokens',
          'Handle token refresh logic',
          'Implement proper logout functionality',
          'Add CSRF protection'
        ],
        resources: [
          'https://jwt.io/introduction/',
          'https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API',
          'https://auth0.com/blog/refresh-tokens/'
        ],
        url: 'https://jwt.io/introduction/'
      },
      { 
        id: 'sec3', 
        title: 'Implement CSRF Protection', 
        difficulty: 'Medium', 
        topic: 'CSRF Protection', 
        category: 'Security',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'PayPal'],
        interviewType: 'Technical',
        frequency: 82, 
        description: 'Implement CSRF protection using tokens, SameSite cookies, and proper request validation.',
        hints: [
          'Generate and validate CSRF tokens',
          'Use SameSite cookie attribute',
          'Implement proper token rotation',
          'Validate origin and referer headers',
          'Handle token storage securely'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies',
          'https://owasp.org/www-community/attacks/csrf',
          'https://web.dev/samesite-cookies-explained/'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies'
      },
      { 
        id: 'sec4', 
        title: 'Secure Data Handling', 
        difficulty: 'Hard', 
        topic: 'Data Security', 
        category: 'Security',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Stripe'],
        interviewType: 'Technical',
        frequency: 85, 
        description: 'Implement secure data handling including encryption, secure transmission, and proper data validation.',
        hints: [
          'Encrypt sensitive data before storage',
          'Use HTTPS for all communications',
          'Implement proper data validation',
          'Handle sensitive data in memory',
          'Use secure random number generation'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API',
          'https://web.dev/secure/',
          'https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API'
      },
      { 
        id: 'sec5', 
        title: 'Content Security Policy (CSP)', 
        difficulty: 'Hard', 
        topic: 'CSP', 
        category: 'Security',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'PayPal'],
        interviewType: 'Technical',
        frequency: 80, 
        description: 'Implement comprehensive Content Security Policy to prevent XSS attacks, configure directives, and handle violations.',
        hints: [
          'Configure CSP directives properly',
          'Handle CSP violations and reporting',
          'Implement nonce and hash-based CSP',
          'Test CSP effectiveness',
          'Handle inline scripts and styles'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP',
          'https://web.dev/csp/',
          'https://content-security-policy.com/'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP'
      },
      { 
        id: 'sec6', 
        title: 'Secure File Upload Implementation', 
        difficulty: 'Hard', 
        topic: 'File Security', 
        category: 'Security',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Dropbox'],
        interviewType: 'Technical',
        frequency: 87, 
        description: 'Implement secure file upload with validation, virus scanning, file type restrictions, and secure storage.',
        hints: [
          'Validate file types and sizes',
          'Implement virus scanning',
          'Use secure file storage',
          'Handle file metadata securely',
          'Implement proper access controls'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/API/File',
          'https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload',
          'https://web.dev/file-upload-security/'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/File'
      },
      { 
        id: 'sec7', 
        title: 'Secure Session Management', 
        difficulty: 'Hard', 
        topic: 'Session Security', 
        category: 'Security',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Auth0'],
        interviewType: 'Technical',
        frequency: 83, 
        description: 'Implement secure session management with proper token handling, session timeout, and secure storage.',
        hints: [
          'Implement secure session tokens',
          'Handle session timeout properly',
          'Use secure storage mechanisms',
          'Implement session invalidation',
          'Handle concurrent sessions'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/API/Storage',
          'https://owasp.org/www-community/controls/Session_Management_Cheat_Sheet',
          'https://web.dev/secure-session-management/'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Storage'
      },
      { 
        id: 'sec8', 
        title: 'Frontend Security Headers', 
        difficulty: 'Medium', 
        topic: 'Security Headers', 
        category: 'Security',
        companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Cloudflare'],
        interviewType: 'Technical',
        frequency: 78, 
        description: 'Implement proper security headers including HSTS, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy.',
        hints: [
          'Configure HSTS for HTTPS enforcement',
          'Set X-Frame-Options to prevent clickjacking',
          'Use X-Content-Type-Options for MIME sniffing',
          'Configure Referrer-Policy properly',
          'Implement proper CORS headers'
        ],
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers',
          'https://web.dev/security-headers/',
          'https://owasp.org/www-project-secure-headers/'
        ],
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers'
      }
    ]
  }
]