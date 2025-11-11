import type { FrontendResourceTopic } from './frontendResourceContent'

export const midLevelResourceTopics: FrontendResourceTopic[] = [
  {
    id: 'build-security-performance',
    trackId: 'mid',
    title: 'Build, Security & Performance',
    summary:
      'Master the production toolchain—bundling, security hardening, performance budgets, and testing strategies that keep apps stable at scale.',
    subtopics: [
      {
        id: 'build-prod-experiences',
        title: 'Production-Ready Builds & CI/CD Pipelines',
        seoTitle: 'Create Production-Ready Experiences with Modern Build Tools',
        oneLiner: 'Ship reliable builds by configuring bundlers, environment variables, and automated pipelines.',
        importance:
          'Mid-level engineers are expected to own build tooling, automate deployments, and ensure safe rollouts.',
        commonQuestions: [
          'How do you configure environment variables securely for multiple environments?',
          'Compare Webpack and Vite for large applications.',
          'What steps are involved in setting up a CI/CD pipeline?'
        ],
        conceptDescription: [
          'Webpack offers fine-grained control, code splitting, and loaders but needs more configuration.',
          'Vite provides fast dev servers using ESBuild and Rollup for production bundles.',
          'Use dotenv or environment-specific files; never expose secrets in client bundles.',
          'CI/CD pipelines (GitHub Actions, GitLab CI, CircleCI) automate testing, building, and deployment with gates.'
        ],
        codeExample: {
          language: 'js',
          caption: 'Sample Vite config and GitHub Actions workflow',
          snippet: `// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: process.env.VITE_ENABLE_SOURCEMAPS === 'true',
    chunkSizeWarningLimit: 600,
  },
});

# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run test -- --coverage
      - run: npm run build`
        },
        stepByStep: [
          'Define build configuration (Webpack/Vite) with environment-based toggles.',
          'Inject environment variables using .env files or build-time replacements.',
          'Configure CI workflow to install dependencies, run tests, and build artifacts.',
          'Deploy to staging/production with approvals and logging.'
        ],
        realWorldUseCase:
          'Interview portals require consistent builds with strict checks before deploying new features for candidates and mentors.',
        commonMistakes: [
          'Committing .env files with secrets to version control.',
          'Skipping sourcemaps in production, making debugging impossible.',
          'Ignoring build warnings related to large bundles or duplicated dependencies.'
        ],
        interviewQuestions: [
          'Explain the difference between devDependencies and dependencies in package.json.',
          'How do you manage environment-specific configuration in CI pipelines?',
          'What strategies ensure zero-downtime deployments?'
        ],
        keyTakeaways: [
          'Automate the full build/test/deploy cycle for confidence in releases.',
          'Leverage environment variables responsibly; secrets belong server-side.',
          'Choose the right bundler for project needs—optimize rebuild times and bundle sizes.'
        ],
        quickLinks: [
          { label: 'Vite Docs: Configuration', url: 'https://vitejs.dev/config/' },
          { label: 'GitHub Actions: Workflow syntax', url: 'https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions' }
        ]
      },
      {
        id: 'performance-core-web-vitals',
        title: 'Performance Budgets & Core Web Vitals',
        seoTitle: 'Optimize Performance with Tree Shaking, Code Splitting, and Core Web Vitals',
        oneLiner: 'Deliver fast experiences by controlling bundle size and critical rendering paths.',
        importance:
          'Organizations rely on mid-level engineers to hit SLAs for performance—and know how to diagnose regressions.',
        commonQuestions: [
          'What is tree shaking and how do bundlers implement it?',
          'Which metrics make up Core Web Vitals and how do you improve them?',
          'How do you implement dynamic imports for code splitting?'
        ],
        conceptDescription: [
          'Tree shaking removes unused exports from ES modules during bundling.',
          'Code splitting loads chunks on demand via dynamic import() or React.lazy.',
          'Critical rendering path optimization includes preloading key assets and minimizing render-blocking resources.',
          'Core Web Vitals: LCP (render speed), FID (input delay), CLS (layout stability).'
        ],
        codeExample: {
          language: 'tsx',
          caption: 'Dynamic import with preloading hints',
          snippet: `// lazy load a heavy component
const ReportsPanel = React.lazy(() => import('./ReportsPanel'));

// preload chunk when hovering link
const preloadReports = () => import('./ReportsPanel');

export function Dashboard() {
  return (
    <React.Suspense fallback={<p>Loading reports…</p>}>
      <button onMouseEnter={preloadReports}>
        Open Reports
      </button>
      {/* ... */}
      <ReportsPanel />
    </React.Suspense>
  );
}

// webpack.config.js snippet
optimization: {
  splitChunks: {
    chunks: 'all',
  },
  concatenateModules: true,
  usedExports: true,
},`
        },
        stepByStep: [
          'Enable usedExports/concatenateModules (Webpack) or rely on Vite/Rollup defaults for tree shaking.',
          'Implement dynamic imports for non-critical routes or admin features.',
          'Measure Core Web Vitals using Lighthouse, WebPageTest, or real-user monitoring.',
          'Optimize LCP with optimized images and server hints; reduce CLS via consistent layout placeholders.'
        ],
        realWorldUseCase:
          'Customer-facing dashboards must stay responsive even as features grow; bundling and metrics tracking keep performance in check.',
        commonMistakes: [
          'Importing entire libraries when only specific functions are needed (e.g., lodash vs lodash-es).',
          'Ignoring Core Web Vitals until after launch, resulting in SEO penalties.',
          'Lazy loading too aggressively, causing noticeable delays in core workflows.'
        ],
        interviewQuestions: [
          'How do you monitor performance after deployment?',
          'Explain the difference between RUM and synthetic performance testing.',
          'What strategies improve CLS in React apps?'
        ],
        keyTakeaways: [
          'Tree shaking and code splitting keep bundle sizes manageable.',
          'Core Web Vitals are essential KPIs for modern web performance.',
          'Balance lazy loading with perceived performance—prioritize above-the-fold content.'
        ],
        quickLinks: [
          { label: 'Web.dev: Core Web Vitals', url: 'https://web.dev/vitals/' },
          { label: 'Webpack Docs: Tree shaking', url: 'https://webpack.js.org/guides/tree-shaking/' }
        ]
      },
      {
        id: 'security-fundamentals',
        title: 'Security Essentials: XSS, CSRF, CSP & HTTPS',
        seoTitle: 'Secure Frontend Apps Against XSS, CSRF, and Related Threats',
        oneLiner: 'Protect users by integrating security safeguards into UI and network layers.',
        importance:
          'Mid-level engineers must recognize common attacks, implement mitigations, and collaborate on secure architectures.',
        commonQuestions: [
          'Differentiate stored, reflected, and DOM XSS.',
          'How does CSRF protection work on the frontend?',
          'What headers and policies harden a SPA against attacks?'
        ],
        conceptDescription: [
          'XSS prevention: sanitize user input, escape output, use React’s default escaping, avoid dangerouslySetInnerHTML.',
          'CSRF mitigation: same-site cookies, CSRF tokens, double-submit patterns.',
          'Content Security Policy (CSP) restricts allowable sources of scripts/styles.',
          'Always serve via HTTPS and enforce HSTS, secure cookies, and modern TLS.'
        ],
        codeExample: {
          language: 'tsx',
          caption: 'Escaping HTML and setting security headers',
          snippet: `// Avoid directly injecting HTML
function Comment({ content }: { content: string }) {
  return <p>{content}</p>; // React escapes by default
}

// If HTML needed, sanitize before using
import DOMPurify from 'dompurify';
function CommentHTML({ content }: { content: string }) {
  const sanitized = DOMPurify.sanitize(content, { USE_PROFILES: { html: true } });
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// Example express security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://cdn.example.com'],
      upgradeInsecureRequests: [],
    },
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));`
        },
        stepByStep: [
          'Escape or sanitize user-generated content before rendering.',
          'Rely on same-site cookies or CSRF tokens to authenticate requests.',
          'Apply CSP headers on the server to limit allowed sources.',
          'Enforce HTTPS and secure cookies for all environments.'
        ],
        realWorldUseCase:
          'Interview booking platforms handle personal data; preventing XSS/CSRF attacks protects candidate privacy and trust.',
        commonMistakes: [
          'Using dangerouslySetInnerHTML without proper sanitization.',
          'Ignoring third-party script vulnerabilities (e.g., compromised analytics).',
          'Failing to set secure headers, leaving applications exposed.'
        ],
        interviewQuestions: [
          'How do you audit a React app for XSS vulnerabilities?',
          'Explain how SameSite cookies mitigate CSRF.',
          'What challenges arise when enforcing strict CSP with modern frameworks?'
        ],
        keyTakeaways: [
          'Security is defense-in-depth—combine React safety with server-side policies.',
          'Sanitize user content and avoid inline HTML when possible.',
          'Work with backend teams to configure secure headers and cookies.'
        ],
        quickLinks: [
          { label: 'OWASP XSS Prevention', url: 'https://owasp.org/www-community/xss-prevention' },
          { label: 'Mozilla Developer Network: CSP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP' }
        ]
      },
      {
        id: 'testing-pyramid',
        title: 'Testing Pyramid for Frontend',
        seoTitle: 'Unit, Integration, and E2E Testing Strategy for React Apps',
        oneLiner: 'Balance fast unit tests with realistic component and end-to-end coverage.',
        importance:
          'Mid-level engineers must design maintainable test suites that catch regressions without slowing delivery.',
        commonQuestions: [
          'How do Jest/Vitest tests differ from RTL component tests?',
          'When do you reach for Cypress E2E tests?',
          'How do you structure a testing pyramid?'
        ],
        conceptDescription: [
          'Unit tests (Jest/Vitest) cover pure functions, hooks, and simple components quickly.',
          'Component tests (React Testing Library) simulate user interactions and assert DOM output.',
          'E2E tests (Cypress/Playwright) cover critical flows; keep them focused to avoid flakiness.',
          'Testing pyramid: many unit tests, fewer integration, minimal E2E—optimized for speed and confidence.'
        ],
        codeExample: {
          language: 'tsx',
          caption: 'Sample Jest unit test and Cypress E2E spec',
          snippet: `// Counter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Counter } from './Counter';

test('increments counter on click', () => {
  render(<Counter label="Mentor sessions" />);
  fireEvent.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText(/Mentor sessions: 1/)).toBeInTheDocument();
});

// cypress/e2e/booking.cy.ts
describe('Booking flow', () => {
  it('allows a user to book a session', () => {
    cy.visit('/login');
    cy.login('candidate@example.com', 'password');
    cy.visit('/sessions');
    cy.contains('Book Session').click();
    cy.get('form').within(() => {
      cy.get('input[name="notes"]').type('Focus on system design');
      cy.contains('Submit').click();
    });
    cy.contains('Booking confirmed').should('be.visible');
  });
});`
        },
        stepByStep: [
          'Write fast unit tests for pure logic and hooks.',
          'Use RTL for components to test user-visible behavior.',
          'Automate critical journeys with Cypress in CI to catch regressions.',
          'Monitor test runtime; parallelize where possible and maintain flake discipline.'
        ],
        realWorldUseCase:
          'Booking pipelines require coverage for login, scheduling, and payment flows to avoid production incidents.',
        commonMistakes: [
          'Over-mocking components, leading to brittle tests that don’t reflect real usage.',
          'Writing too many E2E tests that slow CI and fail intermittently.',
          'Neglecting to test hooks/components in isolation, resulting in poor coverage.'
        ],
        interviewQuestions: [
          'Explain how you’d test a custom React hook.',
          'How do you stabilize flaky E2E tests?',
          'What is the trade-off between integration and unit tests?'
        ],
        keyTakeaways: [
          'Aim for a balanced test pyramid to maximize confidence and speed.',
          'Use realistic user interactions in RTL tests to avoid implementation details.',
          'Keep E2E suites focused on high-value paths to reduce flakiness.'
        ],
        quickLinks: [
          { label: 'Testing Library Docs', url: 'https://testing-library.com/docs/react-testing-library/intro/' },
          { label: 'Cypress Best Practices', url: 'https://docs.cypress.io/guides/references/best-practices' }
        ]
      }
    ]
  },
  {
    id: 'react-architecture-ecosystem',
    trackId: 'mid',
    title: 'React Architecture & Ecosystem',
    summary:
      'Scale React applications with advanced hooks, state management trade-offs, resilient error handling, and smart routing/form strategies.',
    subtopics: [
      {
        id: 'react-hooks-advanced',
        title: 'Hooks in Depth & Context Patterns',
        seoTitle: 'Deep Dive into useMemo, useCallback, and Custom Hooks',
        oneLiner: 'Compose reusable logic and avoid re-render pitfalls with advanced hooks.',
        importance:
          'Mid-level developers must design hooks that balance performance and readability across complex components.',
        commonQuestions: [
          'When should you memoize values or callbacks?',
          'How do you build a custom hook and share it across components?',
          'What are the downsides of overusing context?'
        ],
        conceptDescription: [
          'useMemo caches expensive computations; useCallback memoizes function references.',
          'Custom hooks encapsulate logic (fetching, subscriptions) and reuse stateful behavior.',
          'Context propagates values across component trees but can trigger re-renders—split contexts or use selectors.',
          'Use stable dependencies and careful memoization to avoid stale closures or unnecessary work.'
        ],
        codeExample: {
          language: 'tsx',
          caption: 'Custom hook with memoized selectors',
          snippet: `type Session = { id: string; status: 'scheduled' | 'completed'; date: string };

function useSessions() {
  const [sessions, setSessions] = React.useState<Session[]>([]);

  React.useEffect(() => {
    let active = true;
    fetch('/api/sessions')
      .then((res) => res.json())
      .then((data) => active && setSessions(data.sessions));
    return () => {
      active = false;
    };
  }, []);

  const upcomingSessions = React.useMemo(
    () => sessions.filter((session) => session.status === 'scheduled'),
    [sessions]
  );

  return { sessions, upcomingSessions };
}

const SessionContext = React.createContext<ReturnType<typeof useSessions> | null>(null);

export function SessionProvider({ children }: React.PropsWithChildren) {
  const value = useSessions();
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSessionContext() {
  const ctx = React.useContext(SessionContext);
  if (!ctx) throw new Error('Must be used within SessionProvider');
  return ctx;
}`
        },
        stepByStep: [
          'Encapsulate shared logic inside custom hooks—manage data fetching, state, or subscriptions.',
          'Memoize derived data with useMemo to avoid recomputing on every render.',
          'Expose context providers/selectors to limit re-render scope.',
          'Document hook invariants and dependency requirements to avoid misuse.'
        ],
        realWorldUseCase:
          'Large dashboards share session data across widgets; custom hooks and context provide efficient data caching.',
        commonMistakes: [
          'Wrapping everything in useMemo/useCallback resulting in unreadable code with minimal benefit.',
          'Forgetting to include dependencies, causing stale data.',
          'Using context for frequently changing values without memoization, causing performance issues.'
        ],
        interviewQuestions: [
          'How do you prevent excessive re-renders when using context?',
          'Explain the trade-offs between custom hooks and higher-order components.',
          'How would you test a custom hook?'
        ],
        keyTakeaways: [
          'Custom hooks consolidate reusable stateful logic.',
          'Memoization must be intentional—measure before optimizing.',
          'Context is powerful but requires structure to avoid large re-render cascades.'
        ],
        quickLinks: [
          { label: 'React Docs: Reusing Logic with Custom Hooks', url: 'https://react.dev/learn/reusing-logic-with-custom-hooks' },
          { label: 'Kent C. Dodds: When to useMemo & useCallback', url: 'https://kentcdodds.com/blog/usememo-and-usecallback' }
        ]
      },
      {
        id: 'state-management-options',
        title: 'State Management Trade-offs',
        seoTitle: 'Choosing Between Redux Toolkit, Zustand, Recoil, and Context',
        oneLiner: 'Select the right state solution for app complexity and team workflows.',
        importance:
          'Mid-level engineers are expected to evaluate and maintain state management architecture across teams.',
        commonQuestions: [
          'When do you choose Redux Toolkit over Zustand?',
          'How do selectors and memoization help performance?',
          'What are the pros/cons of using Context API for global state?'
        ],
        conceptDescription: [
          'Redux Toolkit simplifies Redux with createSlice, Immer, RTK Query—ideal for complex, serializable global state.',
          'Zustand provides lightweight stores with minimal boilerplate; ideal for microstate.',
          'Recoil handles derived state and concurrent rendering; integrates well with React’s Suspense.',
          'Context works for small shared state but lacks tooling and can trigger tree-wide re-renders.'
        ],
        codeExample: {
          language: 'ts',
          caption: 'Redux Toolkit slice vs Zustand store',
          snippet: `// Redux Toolkit slice
import { createSlice, configureStore } from '@reduxjs/toolkit';

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState: { items: [] as Session[] },
  reducers: {
    setSessions(state, action) {
      state.items = action.payload;
    },
  },
});

export const store = configureStore({
  reducer: {
    sessions: sessionsSlice.reducer,
  },
});

// Zustand store
import create from 'zustand';

type DashboardState = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));`
        },
        stepByStep: [
          'Assess app requirements—data shape, team size, need for tooling/devtools.',
          'For complex global state with middleware, prefer Redux Toolkit or RTK Query.',
          'For simple cross-component state, use Zustand or context with reducers.',
          'Document patterns and enforce consistency to avoid state sprawl.'
        ],
        realWorldUseCase:
          'Interview platforms maintain scheduling data (Redux Toolkit) while local UI preferences live in Zustand/context.',
        commonMistakes: [
          'Over-engineering state management—introducing Redux for small apps.',
          'Global state storing UI-only data causing unnecessary complexity.',
          'Neglecting to normalize data in stores, leading to duplication and inconsistent updates.'
        ],
        interviewQuestions: [
          'How do you migrate from context to Redux Toolkit as the app grows?',
          'Explain how RTK Query simplifies data fetching state.',
          'What issues arise when mixing multiple global state solutions?'
        ],
        keyTakeaways: [
          'Match state management tools to problem complexity.',
          'Favor Redux Toolkit for enterprise-scale apps; use lighter stores for modular features.',
          'Provide guidelines to keep state organized and debuggable.'
        ],
        quickLinks: [
          { label: 'Redux Toolkit Docs', url: 'https://redux-toolkit.js.org/' },
          { label: 'Zustand Docs', url: 'https://docs.pmnd.rs/zustand/getting-started/introduction' }
        ]
      },
      {
        id: 'react-error-suspense',
        title: 'Error Boundaries, Suspense & Concurrent Rendering',
        seoTitle: 'Build Resilient UI with Error Boundaries and Suspense',
        oneLiner: 'Handle rendering failures and asynchronous UI using modern React features.',
        importance:
          'Reliability at scale requires resilient error handling and smooth async experiences.',
        commonQuestions: [
          'What problems do Error Boundaries solve?',
          'How does Suspense simplify async data loading?',
          'What’s new in concurrent rendering and how do you adopt it?'
        ],
        conceptDescription: [
          'Error boundaries catch exceptions during rendering, lifecycle methods, and constructors of their children.',
          'Suspense defers rendering while async resources load; paired with concurrent rendering for smoother UX.',
          'React.lazy dynamically loads components; data libraries (React Query, Relay) integrate with Suspense.',
          'Concurrent rendering (React 18) allows interruptible renders, transitions, and better responsiveness.'
        ],
        codeExample: {
          language: 'tsx',
          caption: 'Error boundary and Suspense for lazy data',
          snippet: `class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(error, info);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const MentorsPanel = React.lazy(() => import('./MentorsPanel'));

export function Dashboard() {
  return (
    <ErrorBoundary fallback={<p>Something went wrong.</p>}>
      <React.Suspense fallback={<p>Loading mentors…</p>}>
        <MentorsPanel />
      </React.Suspense>
    </ErrorBoundary>
  );
}`
        },
        stepByStep: [
          'Wrap feature areas with error boundaries to display graceful fallbacks.',
          'Use Suspense for lazy components or data fetching libraries that support it.',
          'Leverage startTransition/useTransition to mark non-urgent updates.',
          'Monitor logs to detect repeated boundary trips and fix root causes.'
        ],
        realWorldUseCase:
          'Mentor dashboards load data lazily and handle partial failures (API downtime) without crashing the entire app.',
        commonMistakes: [
          'Assuming error boundaries catch async errors or event handlers (they don’t).',
          'Overusing Suspense fallback causing loaders to flash on minor updates.',
          'Ignoring server errors when using Suspense for data fetching (needs integration with libraries).'
        ],
        interviewQuestions: [
          'How do you implement retry logic with Suspense?',
          'What’s the difference between legacy React rendering and concurrent rendering?',
          'When should you use Error Boundaries vs try/catch?'
        ],
        keyTakeaways: [
          'Error boundaries isolate failures and preserve UX.',
          'Suspense + concurrent rendering improve perceived performance when loading data.',
          'Plan fallbacks thoughtfully to avoid jarring loading experiences.'
        ],
        quickLinks: [
          { label: 'React Docs: Error Boundaries', url: 'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary' },
          { label: 'React Docs: Suspense for Data Fetching', url: 'https://react.dev/reference/react/Suspense' }
        ]
      },
      {
        id: 'forms-routing-advanced',
        title: 'Forms, Routing Strategies & Code Splitting',
        seoTitle: 'Advanced Forms, Routing Patterns, and Route-Based Splitting',
        oneLiner: 'Improve UX with robust forms and routing architectures in large React apps.',
        importance:
          'Mid-level engineers design form flows and navigation that scale with product complexity.',
        commonQuestions: [
          'When do you choose React Hook Form vs Formik?',
          'How do you structure routes for nested layouts?',
          'How do you split code by route effectively?'
        ],
        conceptDescription: [
          'React Hook Form leverages uncontrolled inputs with refs for performance; Formik offers controlled pattern with strong validation ecosystem.',
          'Advanced routing uses nested routes, route guards, and dynamic loading of child modules.',
          'Combine route-based code splitting with Suspense to load heavy sections on demand.',
          'Handle form validation with schema libraries (Zod/Yup) for consistent error messaging.'
        ],
        codeExample: {
          language: 'tsx',
          caption: 'React Hook Form with nested routes and lazy components',
          snippet: `import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { lazy } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

const schema = yup.object({
  name: yup.string().required().min(2),
  email: yup.string().email().required(),
});

function ProfileForm() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
  });
  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('name')} />
      {formState.errors.name && <span>{formState.errors.name.message}</span>}
      <button type="submit">Save</button>
    </form>
  );
}

const BillingPage = lazy(() => import('./BillingPage'));

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ProfileForm />} />
        <Route
          path="billing/*"
          element={
            <React.Suspense fallback={<p>Loading billing…</p>}>
              <BillingPage />
            </React.Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <main>
      <Outlet />
    </main>
  );
}`
        },
        stepByStep: [
          'Select form library based on complexity; React Hook Form for performance, Formik for controlled patterns.',
          'Define nested routes with layouts using <Outlet> for shared UI scaffolding.',
          'Wrap heavy route components with Suspense for route-based code splitting.',
          'Validate forms with declarative schemas and display consistent error messages.'
        ],
        realWorldUseCase:
          'Multi-step onboarding (profile, billing, preferences) uses nested routes and lazy-loaded sections for modularity.',
        commonMistakes: [
          'Triggering re-renders on every keystroke with large forms and controlled components.',
          'Not providing fallback UI for lazily loaded routes.',
          'Hardcoding validation logic instead of using schemas, increasing maintenance costs.'
        ],
        interviewQuestions: [
          'Explain the benefits of uncontrolled inputs in React Hook Form.',
          'How do you protect certain routes behind authentication?',
          'What’s the impact of route-based code splitting on SEO and analytics?'
        ],
        keyTakeaways: [
          'Choose form libraries based on complexity and performance needs.',
          'Structure routes with nested layouts and guard logic.',
          'Route-based code splitting keeps bundles lean while delivering modular UX.'
        ],
        quickLinks: [
          { label: 'React Hook Form Docs', url: 'https://react-hook-form.com/' },
          { label: 'React Router Advanced Guides', url: 'https://reactrouter.com/en/main' }
        ]
      }
    ]
  },
  {
    id: 'advanced-js-browser-mechanics',
    trackId: 'mid',
    title: 'Advanced JavaScript & Browser Mechanics',
    summary:
      'Deepen your understanding of JavaScript runtime behavior, browser APIs, and performance profiling to build robust, efficient frontends.',
    subtopics: [
      {
        id: 'events-delegation-performance',
        title: 'Event Delegation, Capturing, Debounce & Throttle',
        seoTitle: 'Optimize Event Handling with Delegation and Rate-Limiting',
        oneLiner: 'Control event flow and performance for complex UIs.',
        importance:
          'Mid-level engineers must prevent UI lag by managing events efficiently in dynamic interfaces.',
        commonQuestions: [
          'Explain event capturing vs bubbling and how to stop propagation.',
          'How does event delegation work and why is it useful?',
          'Implement debouncing and throttling for scroll handlers.'
        ],
        conceptDescription: [
          'Event capturing (`useCapture=true`) runs handlers from root to target; bubbling runs from target back to root.',
          'Event delegation attaches a single handler high in the DOM to manage many child elements dynamically.',
          'Debouncing delays execution until events pause; throttling limits how often a handler runs.',
          'requestAnimationFrame-based throttling aligns updates with the browser’s paint cycle.'
        ],
        codeExample: {
          language: 'ts',
          caption: 'Delegated events with debounced handler',
          snippet: `const list = document.querySelector('#mentor-list');

list?.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest('button[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  console.log('Perform action:', action);
});

function debounce<T extends (...args: any[]) => void>(fn: T, wait = 200) {
  let timeout: number | undefined;
  return (...args: Parameters<T>) => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => fn(...args), wait);
  };
}

const handleResize = debounce(() => {
  console.log('Resize handled once after user stops resizing.');
}, 300);

window.addEventListener('resize', handleResize, { passive: true });`
        },
        stepByStep: [
          'Use delegation for dynamic lists to avoid binding multiple listeners.',
          'Understand event phases to stop propagation intentionally.',
          'Implement debouncing for input/search and throttling for scroll/resize.',
          'Favor passive listeners for scroll/touch to improve performance.'
        ],
        realWorldUseCase:
          'Large tables or infinite lists rely on delegation to keep event handlers efficient.',
        commonMistakes: [
          'Binding listeners to every child node causing memory and CPU overhead.',
          'Misusing debounce when throttle is required (or vice versa).',
          'Not cleaning up delegated listeners when tearing down dynamically created DOM.'
        ],
        interviewQuestions: [
          'How do you prevent an event handler from firing too often?',
          'Explain the impact of passive listeners on scroll performance.',
          'What are the trade-offs between capturing and bubbling listeners?'
        ],
        keyTakeaways: [
          'Event delegation reduces listeners and handles dynamic content gracefully.',
          'Debounce/throttle keep UIs responsive during rapid event firing.',
          'Understand propagation phases to control event flow precisely.'
        ],
        quickLinks: [
          { label: 'MDN: Event bubbling and capture', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_bubbling_and_capture' },
          { label: 'CSS-Tricks: Debouncing/Throttling', url: 'https://css-tricks.com/debouncing-throttling-explained-examples/' }
        ]
      },
      {
        id: 'functional-immutability-patterns',
        title: 'Immutability, Deep Copy, and Functional Patterns',
        seoTitle: 'Master Immutability and Functional Programming in JavaScript',
        oneLiner: 'Prevent bugs by understanding reference semantics and functional utilities.',
        importance:
          'As applications grow, mid-level engineers must ensure predictable state updates and memory safety.',
        commonQuestions: [
          'Why is immutability important in React state updates?',
          'How do you perform deep copies safely?',
          'Show how to use map/filter/reduce to transform data immutably.'
        ],
        conceptDescription: [
          'Shallow copies preserve references; deep copies clone nested objects to avoid shared mutation.',
          'Functional programming (map/filter/reduce) produces new collections without mutating originals.',
          'Immer (used in Redux Toolkit) abstracts immutable updates with proxy-based drafts.',
          'Use structuredClone or libraries for deep copy; be mindful of custom types (Dates, Maps).'
        ],
        codeExample: {
          language: 'ts',
          caption: 'Immutable updates with Immer and structuredClone',
          snippet: `import { produce } from 'immer';

type Mentor = { id: string; tags: string[] };

const mentors: Mentor[] = [
  { id: '1', tags: ['react'] },
  { id: '2', tags: ['node'] },
];

// Immutable update with Immer
const updated = produce(mentors, (draft) => {
  const mentor = draft.find((m) => m.id === '1');
  if (mentor) {
    mentor.tags.push('typescript');
  }
});

// Deep copy using structuredClone
const clone = structuredClone(mentors);
clone[0].tags.push('testing');
console.log(mentors[0].tags); // original remains unchanged`
        },
        stepByStep: [
          'Identify when shallow vs deep copy is required.',
          'Use functional helpers to transform arrays/objects immutably.',
          'Introduce Immer for complex nested updates without manual cloning.',
          'Be cautious with structuredClone limitations (functions, DOM nodes).'
        ],
        realWorldUseCase:
          'State updates in dashboards must avoid accidental mutation that causes stale re-renders or inconsistent UI.',
        commonMistakes: [
          'Mutating nested arrays/objects leading to undetected changes.',
          'Overusing deep clones leading to performance issues.',
          'Misunderstanding that const only prevents reassignment, not mutation.'
        ],
        interviewQuestions: [
          'Explain how Immer works under the hood.',
          'When would you use deep copy vs shallow copy?',
          'How do you detect accidental mutations during development?'
        ],
        keyTakeaways: [
          'Immutability ensures predictable rendering in React.',
          'Choose appropriate cloning strategies based on data complexity.',
          'Functional patterns simplify transformations and reduce mutation bugs.'
        ],
        quickLinks: [
          { label: 'Immer Docs', url: 'https://immerjs.github.io/immer/' },
          { label: 'MDN: structuredClone', url: 'https://developer.mozilla.org/en-US/docs/Web/API/structuredClone' }
        ]
      },
      {
        id: 'memory-profiling-optimization',
        title: 'Memory Leaks, Garbage Collection & Profiling',
        seoTitle: 'Detect Memory Leaks and Optimize JavaScript Performance',
        oneLiner: 'Keep apps stable by understanding memory management and profiling tools.',
        importance:
          'Memory leaks degrade performance over long sessions; mid-level engineers must diagnose and prevent them.',
        commonQuestions: [
          'How does garbage collection determine when to free memory?',
          'What causes memory leaks in React applications?',
          'How do you use Chrome DevTools to profile memory usage?'
        ],
        conceptDescription: [
          'Garbage collection frees objects no longer reachable from the root set.',
          'Leaks emerge from lingering references—event listeners, timers, closures, caches.',
          'Chrome DevTools offers heap snapshots, allocation timelines, and performance profiles to analyze retention.',
          'Use WeakMap, WeakRef, and proper cleanup to avoid retaining unnecessary references.'
        ],
        codeExample: {
          language: 'ts',
          caption: 'Cleaning up listeners and using WeakMap',
          snippet: `function attachResizeHandler(element: HTMLElement, handler: () => void) {
  const listener = () => handler();
  window.addEventListener('resize', listener);
  return () => window.removeEventListener('resize', listener);
}

const detach = attachResizeHandler(document.body, () => {
  console.log('Resized');
});

// Later when component unmounts
detach();

// WeakMap cache that allows GC when keys go out of scope
const userDetailsCache = new WeakMap<object, { lastFetched: number }>();

function cacheUserDetails(user: object, details: { lastFetched: number }) {
  userDetailsCache.set(user, details);
}`
        },
        stepByStep: [
          'Track down leaks by taking heap snapshots before and after interactions.',
          'Clean up event listeners, timers, and subscriptions in useEffect cleanups.',
          'Use WeakMap/WeakSet for caches tied to object lifetimes.',
          'Profile CPU and memory usage regularly in performance-critical flows.'
        ],
        realWorldUseCase:
          'SPAs open for hours (support dashboards, analytics) must stay responsive—memory leaks would degrade usability.',
        commonMistakes: [
          'Neglecting cleanups in useEffect, causing detached DOM nodes to linger.',
          'Caching huge datasets without eviction policies.',
          'Relying solely on garbage collection without understanding reachable references.'
        ],
        interviewQuestions: [
          'Describe how you’d investigate a memory leak in production.',
          'How does Chrome DevTools help identify detached DOM nodes?',
          'When would you use WeakRef or FinalizationRegistry?'
        ],
        keyTakeaways: [
          'Memory leaks stem from lingering references—proactively clean up resources.',
          'Use profiling tools to observe memory trends and identify leaks.',
          'Weak references help caches release memory automatically.'
        ],
        quickLinks: [
          { label: 'Chrome DevTools: Memory', url: 'https://developer.chrome.com/docs/devtools/memory-problems/' },
          { label: 'MDN: WeakMap', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap' }
        ]
      },
      {
        id: 'web-apis-advanced',
        title: 'Web APIs & Progressive Enhancement',
        seoTitle: 'Leverage Fetch, Storage, Canvas/SVG, Service Workers & PWAs',
        oneLiner: 'Use platform APIs to build rich, resilient web applications.',
        importance:
          'Mid-level engineers must integrate browser APIs cleverly while maintaining compatibility and performance.',
        commonQuestions: [
          'How do you cache API responses with Service Workers?',
          'When would you use Canvas or SVG for graphics?',
          'Explain the storage options available in browsers and their limitations.'
        ],
        conceptDescription: [
          'Fetch API supports streaming, cancellation (AbortController), and credentials.',
          'Web Storage (localStorage/sessionStorage) for small key-value data; IndexedDB for larger datasets.',
          'Canvas handles pixel-based graphics; SVG for vector, accessible graphics.',
          'Service Workers enable offline caching, push notifications, background sync; PWAs combine these for installable experiences.'
        ],
        codeExample: {
          language: 'ts',
          caption: 'Service Worker caching strategy and AbortController',
          snippet: `// service-worker.ts
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('static-v1').then((cache) => cache.addAll([
      '/',
      '/index.html',
      '/assets/main.css',
    ]))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request);
    })
  );
});

// AbortController usage
const controller = new AbortController();
fetch('/api/mentors', { signal: controller.signal })
  .then((res) => res.json())
  .then(console.log)
  .catch((error) => {
    if (error.name === 'AbortError') {
      console.log('Request aborted');
    }
  });

// Cancel request on unmount
controller.abort();`
        },
        stepByStep: [
          'Use AbortController to cancel in-flight fetches during component unmount.',
          'Choose storage APIs based on data size and lifetime requirements.',
          'Implement Service Workers for offline caching and background tasks.',
          'Decide between Canvas and SVG based on graphics needs—Canvas for highly dynamic pixel operations, SVG for accessible vector graphics.'
        ],
        realWorldUseCase:
          'Interview prep apps cache frequently accessed resources and provide offline readiness using Service Workers.',
        commonMistakes: [
          'Storing sensitive tokens in localStorage without considering XSS risks.',
          'Implementing aggressive caching without cache-busting strategies.',
          'Using Canvas when semantics and accessibility demand SVG.'
        ],
        interviewQuestions: [
          'How do you implement stale-while-revalidate caching?',
          'Explain IndexedDB vs localStorage trade-offs.',
          'What makes a web app a Progressive Web App (PWA)?'
        ],
        keyTakeaways: [
          'Browser APIs empower rich experiences—choose the right tool for each job.',
          'Service Workers enable offline capabilities and smarter caching strategies.',
          'Manage storage security and size limitations carefully.'
        ],
        quickLinks: [
          { label: 'MDN: Service Worker API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API' },
          { label: 'Google Developers: Workbox', url: 'https://developer.chrome.com/docs/workbox/' }
        ]
      }
    ]
  }
]

