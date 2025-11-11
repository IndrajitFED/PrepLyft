import type { FrontendResourceTopic } from './frontendResourceContent'

export const seniorResourceTopics: FrontendResourceTopic[] = [
  {
    id: 'system-design-architecture',
    trackId: 'senior',
    title: 'System Design & Architecture',
    summary:
      'Architect large-scale frontends with hybrid rendering, micro-frontends, and resilient delivery pipelines while preserving accessibility and design consistency.',
    subtopics: [
      {
        id: 'spa-mpa-hybrid-rendering',
        title: 'SPA vs MPA & Hybrid Rendering',
        seoTitle: 'Choosing SPA, MPA, SSR, and SSG Strategies with Next.js and Remix',
        oneLiner: 'Balance interactivity, SEO, and performance with hybrid rendering patterns.',
        importance:
          'Senior engineers must pick the right rendering model for business goals—affecting SEO, TTFB, caching, and infrastructure.',
        commonQuestions: [
          'When is a Multi-Page Application preferable to an SPA?',
          'How does SSR/SSG improve Core Web Vitals and SEO?',
          'Compare Next.js and Remix for hybrid rendering.'
        ],
        conceptDescription: [
          'SPAs excel in interactivity but can suffer initial load and SEO challenges without SSR/SSG.',
          'MPAs provide quick first byte and simple caching but lose client-side transitions.',
          'SSR renders on the server per request; SSG pre-builds pages for fast delivery; ISR (Incremental Static Regeneration) updates stale pages on demand.',
          'Next.js provides file-based routing, ISR, API routes; Remix focuses on nested routes, streaming, and loader/action APIs.'
        ],
        codeExample: {
          language: 'tsx',
          caption: 'Next.js hybrid page with ISR and dynamic routing',
          snippet: `// pages/sessions/[id].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchSessions, fetchSession } from '@/services/sessions';

export default function SessionPage({ session }) {
  return (
    <main>
      <h1>{session.title}</h1>
      <p>{session.description}</p>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const sessions = await fetchSessions();
  return {
    paths: sessions.map((session) => ({ params: { id: session.id } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const session = await fetchSession(params?.id as string);
  if (!session) {
    return { notFound: true };
  }
  return {
    props: { session },
    revalidate: 60, // ISR
  };
};`
        },
        stepByStep: [
          'Evaluate audience, SEO needs, and infrastructure before choosing SPA/MPA/SSR/SSG.',
          'Leverage Next.js/Remix to combine static generation with dynamic data fetching.',
          'Use ISR/streaming SSR for large catalogs with frequent updates.',
          'Design caching and CDN strategies aligned with rendering choices.'
        ],
        realWorldUseCase:
          'Interview marketplaces deliver static marketing content with SSG, dynamic dashboards via SPA, and SEO-critical pages through SSR for better discovery.',
        commonMistakes: [
          'Assuming SSR solves all performance issues without caching and CDN tuning.',
          'Overcomplicating architecture by mixing multiple frameworks without clear ownership.',
          'Ignoring edge rendering and CDN capabilities that could simplify architecture.'
        ],
        interviewQuestions: [
          'How do you implement incremental static regeneration for thousands of pages?',
          'Explain trade-offs between Next.js and Remix for ecommerce.',
          'How do you secure API routes when using SSR frameworks?'
        ],
        keyTakeaways: [
          'Match rendering models to product requirements—no one-size-fits-all.',
          'Hybrid frameworks provide SSR, SSG, ISR, and streaming for flexibility.',
          'Infrastructure (CDN, caching, edge functions) completes the rendering strategy.'
        ],
        quickLinks: [
          { label: 'Next.js Rendering Patterns', url: 'https://nextjs.org/learn/foundations/how-nextjs-works/rendering' },
          { label: 'Remix Architecture Guide', url: 'https://remix.run/docs/en/main/guides/architecture' }
        ]
      },
      {
        id: 'micro-frontends-design-systems',
        title: 'Micro-Frontends & Design Systems',
        seoTitle: 'Scaling Frontends with Micro-Frontends, Module Federation, and Shared Libraries',
        oneLiner: 'Partition large apps, share UI libraries, and enforce accessibility at enterprise scale.',
        importance:
          'Senior engineers orchestrate multi-team delivery—micro-frontends and design systems keep codebases modular and consistent.',
        commonQuestions: [
          'What are pros/cons of micro-frontends?',
          'How does Module Federation share components between apps?',
          'How do you enforce accessibility and design tokens across teams?'
        ],
        conceptDescription: [
          'Micro-frontends split the UI by domain, enabling independent deployment but requiring consistent UX.',
          'Webpack Module Federation dynamically loads remote components at runtime, sharing runtime dependencies.',
          'Design systems codify tokens (color, spacing, typography) with component libraries (Storybook, Chromatic).',
          'Accessibility at scale requires linting, automated audits, and training to avoid regressions.'
        ],
        codeExample: {
          language: 'js',
          caption: 'Module Federation configuration for shared components',
          snippet: `// host webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'dashboard',
      remotes: {
        billing: 'billing@https://billing.example.com/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '18.2.0' },
      },
    }),
  ],
};

// consuming remote component
const BillingWidget = React.lazy(() => import('billing/BillingWidget'));

export function Dashboard() {
  return (
    <React.Suspense fallback={<p>Loading billing…</p>}>
      <BillingWidget />
    </React.Suspense>
  );
}`
        },
        stepByStep: [
          'Define clear domain boundaries and ownership for micro-frontends.',
          'Use Module Federation or runtime manifest loading to share bundles.',
          'Centralize design tokens and visual regression testing across libraries.',
          'Automate accessibility checks (axe-core, pa11y) in CI/CD pipelines.'
        ],
        realWorldUseCase:
          'Large interview platforms have separate mentor, admin, and candidate portals—micro-frontends enable independent releases with a shared design system.',
        commonMistakes: [
          'Fragmented UX due to inconsistent design tokens or navigation.',
          'Version conflicts from shared dependencies when Module Federation is misconfigured.',
          'Neglecting performance impact of multiple micro-frontends loading simultaneously.'
        ],
        interviewQuestions: [
          'How do you enforce consistent routing and analytics across micro-frontends?',
          'Explain the difference between build-time vs runtime integration.',
          'How do you track accessibility compliance across teams?'
        ],
        keyTakeaways: [
          'Micro-frontends unlock parallel delivery but require strong governance.',
          'Shared design systems and accessibility tooling maintain coherence.',
          'Module Federation provides runtime composition with shared dependencies.'
        ],
        quickLinks: [
          { label: 'Module Federation Docs', url: 'https://webpack.js.org/concepts/module-federation/' },
          { label: 'Storybook Design Systems', url: 'https://storybook.js.org/docs/react/writing-stories/design-system' }
        ]
      },
      {
        id: 'architecture-ci-observability',
        title: 'Architecture Governance & Observability',
        seoTitle: 'CI/CD, Feature Flags, and Observability for Frontend Architecture',
        oneLiner: 'Ensure reliable delivery with advanced pipelines, feature controls, and monitoring.',
        importance:
          'Senior engineers align release processes with business risk tolerance, using feature flags, progressive delivery, and observability.',
        commonQuestions: [
          'How do blue-green or canary deployments work for frontend assets?',
          'What tools manage feature flags in SPAs?',
          'How do you set up observability (logs, metrics, traces) for client applications?'
        ],
        conceptDescription: [
          'CI/CD pipelines incorporate quality gates, dependency scanning, and artifact promotion.',
          'Feature flag platforms (LaunchDarkly, ConfigCat) enable gradual rollouts and A/B testing.',
          'Observability integrates client logging (Sentry), RUM metrics (Datadog), and tracing (OpenTelemetry).',
          'Blue-green deployments swap production environments; canary releases gradually increase traffic.'
        ],
        codeExample: {
          language: 'yaml',
          caption: 'GitHub Actions pipeline with feature flag integration',
          snippet: `name: Deploy Production
on:
  push:
    branches: [main]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run test -- --coverage
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: web-build
          path: dist

  deploy:
    needs: build-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: web-build
      - name: Invalidate CDN cache
        run: node scripts/invalidate-cdn.js
      - name: Enable feature flag
        run: node scripts/enable-flag.js --flag onboarding_v2 --percentage 10`
        },
        stepByStep: [
          'Automate build/test/deploy with environment-specific approvals.',
          'Integrate feature flags for progressive rollout and quick rollback.',
          'Instrument client apps with logging, RUM, and error tracking.',
          'Define alerting thresholds and dashboards for frontend health.'
        ],
        realWorldUseCase:
          'Feature flags allow testing new interview flows on small cohorts before full rollout, with metrics guiding enablement.',
        commonMistakes: [
          'Leaving feature flags enabled permanently without cleanup.',
          'Relying solely on server observability while ignoring client metrics.',
          'Deploying without CDN invalidation, leading to stale assets.'
        ],
        interviewQuestions: [
          'How do you roll back a faulty deploy without impacting users?',
          'Explain the difference between blue-green and canary releases.',
          'What metrics do you track to evaluate frontend health post-release?'
        ],
        keyTakeaways: [
          'Progressive delivery reduces risk in large deployments.',
          'Observability ties frontend performance to business outcomes.',
          'Governance ensures consistent architecture decisions across teams.'
        ],
        quickLinks: [
          { label: 'LaunchDarkly Feature Flags', url: 'https://launchdarkly.com/' },
          { label: 'OpenTelemetry for Web', url: 'https://opentelemetry.io/docs/instrumentation/js/browser/' }
        ]
      }
    ]
  },
  {
    id: 'performance-reliability',
    trackId: 'senior',
    title: 'Performance & Reliability',
    summary:
      'Deliver enterprise-grade reliability through critical path optimization, advanced caching, Core Web Vitals excellence, and rigorous security practices.',
    subtopics: [
      {
        id: 'critical-rendering-path',
        title: 'Critical Rendering Path & Resource Strategies',
        seoTitle: 'Optimize Critical Rendering Path with Prefetching and HTTP/2',
        oneLiner: 'Reduce time-to-interactive by orchestrating resource loading and network hints.',
        importance:
          'Senior engineers must diagnose bottlenecks and orchestrate network layers for global audiences.',
        commonQuestions: [
          'How do you measure and optimize the critical rendering path?',
          'When should you use prefetch vs preload vs preconnect?',
          'How does HTTP/2 multiplexing affect resource strategy?'
        ],
        conceptDescription: [
          'Critical rendering path covers HTML, CSS, JS parsing before first paint and interactivity.',
          'Resource hints: preload (needed ASAP), prefetch (next navigation), preconnect (warm connections).',
          'HTTP/2 multiplexing allows parallel requests over single connection; HTTP/3 adds QUIC improvements.',
          'Prioritize CSS over JS, defer non-critical scripts, inline critical CSS for above-the-fold.'
        ],
        codeExample: {
          language: 'html',
          caption: 'Resource hints in HTML head',
          snippet: `<link rel="preload" href="/assets/dashboard.css" as="style">
<link rel="preload" href="/assets/vendor.bundle.js" as="script">
<link rel="preconnect" href="https://cdn.example.com" crossorigin>
<link rel="dns-prefetch" href="//analytics.example.com">
<link rel="prefetch" href="/sessions/upcoming">

<script defer src="/assets/main.bundle.js"></script>
<script src="/assets/analytics.js" async></script>`
        },
        stepByStep: [
          'Audit critical path with Lighthouse, WebPageTest, or Chrome DevTools Performance.',
          'Inline minimal critical CSS and defer large JS bundles.',
          'Use resource hints to warm up connections and load future routes.',
          'Adopt HTTP/2 server push carefully; monitor impact of multiplexing and prioritization.'
        ],
        realWorldUseCase:
          'Global interview scheduling tools rely on optimized critical path to keep conversions high even on slow networks.',
        commonMistakes: [
          'Overusing preload, causing contention for bandwidth.',
          'Neglecting to remove unused CSS/JS, impacting TTI.',
          'Ignoring transport-layer capabilities when designing resource loading strategies.'
        ],
        interviewQuestions: [
          'How do you debug render-blocking resources?',
          'Explain the difference between async and defer for scripts.',
          'How do you simulate slow networks to test critical path?'
        ],
        keyTakeaways: [
          'Critical path optimization lowers TTFB, FCP, and TTI for better UX.',
          'Leverage resource hints and HTTP/2 features judiciously.',
          'Measure continuously to avoid regressions.'
        ],
        quickLinks: [
          { label: 'Google Web Fundamentals: Critical Rendering Path', url: 'https://developers.google.com/web/fundamentals/performance/critical-rendering-path' },
          { label: 'MDN: Resource Hints', url: 'https://developer.mozilla.org/en-US/docs/Web/Performance/Resource_Hints' }
        ]
      },
      {
        id: 'service-workers-caching',
        title: 'Service Workers & Offline Reliability',
        seoTitle: 'Build Offline-First PWAs with Service Worker Caching',
        oneLiner: 'Harness service workers for resilience, offline support, and intelligent caching.',
        importance:
          'Enterprise apps need offline resilience for field teams and global availability—service workers provide control.',
        commonQuestions: [
          'How do you design caching strategies (cache-first, network-first, stale-while-revalidate)?',
          'What are pitfalls when deploying service workers?',
          'How do you synchronize offline actions with the server?'
        ],
        conceptDescription: [
          'Service workers intercept requests to serve cached responses or fallback offline pages.',
          'Use Workbox to declaratively define caching strategies and precaching manifests.',
          'Implement background sync to replay offline actions; handle merge conflicts gracefully.',
          'PWAs require manifest files, HTTPS, and user prompts for installability.'
        ],
        codeExample: {
          language: 'js',
          caption: 'Workbox service worker with stale-while-revalidate strategy',
          snippet: `import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) => request.destination === 'document',
  new StaleWhileRevalidate({
    cacheName: 'pages-cache',
  })
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/mentors'),
  new StaleWhileRevalidate({
    cacheName: 'mentor-api-cache',
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          return response.status === 200 ? response : null;
        },
      },
    ],
  })
);`
        },
        stepByStep: [
          'Set up service worker registration with Workbox or manual lifecycle management.',
          'Define caching strategies per asset type (HTML, API, images).',
          'Handle updates by prompting users or auto-refreshing when a new worker activates.',
          'Implement background sync or queueing for offline interactions.'
        ],
        realWorldUseCase:
          'Mentors capturing interview feedback offline syncs to the server when connectivity returns.',
        commonMistakes: [
          'Failing to version caches, leading to stale assets.',
          'Neglecting to handle service worker updates, causing double cached versions.',
          'Caching sensitive API responses without encryption or expiration.'
        ],
        interviewQuestions: [
          'How do you force-refresh users after a new service worker deploy?',
          'Explain stale-while-revalidate vs network-first trade-offs.',
          'How do you debug service worker caching issues?'
        ],
        keyTakeaways: [
          'Service workers enhance reliability with caching and offline features.',
          'Define strategies carefully for each asset type to balance freshness and performance.',
          'Monitor service worker lifecycle to avoid user confusion.'
        ],
        quickLinks: [
          { label: 'Workbox Guides', url: 'https://developer.chrome.com/docs/workbox/' },
          { label: 'MDN: Service Worker Lifecycle', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers' }
        ]
      },
      {
        id: 'core-web-vitals-security',
        title: 'Core Web Vitals & Security Audits',
        seoTitle: 'Deep-Dive into Core Web Vitals and Frontend Security Compliance',
        oneLiner: 'Maintain top-tier performance scores while upholding strict security and compliance.',
        importance:
          'Enterprises demand quantifiable performance and verifiable security; seniors drive these programs end-to-end.',
        commonQuestions: [
          'How do you improve LCP, FID, CLS metrics programmatically?',
          'What tools support security audits and threat modeling for frontends?',
          'How does CSP hardening interact with modern frameworks?'
        ],
        conceptDescription: [
          'LCP improvements: optimize hero images, server-side rendering, prioritize main content.',
          'FID (now replaced by INP in 2024) improvements: reduce JS execution, offload heavy work to Web Workers.',
          'CLS fixes: reserve layout space, avoid lazy-loaded content jumps.',
          'Security: perform threat modeling, run dependency audits (npm audit, Snyk), enforce CSP and security headers, ensure regulatory compliance (GDPR, SOC2).'
        ],
        codeExample: {
          language: 'ts',
          caption: 'Capturing Web Vitals and enforcing strict CSP',
          snippet: `import { onCLS, onLCP, onINP } from 'web-vitals';

function sendToAnalytics(metric: any) {
  fetch('/analytics/vitals', {
    method: 'POST',
    body: JSON.stringify(metric),
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
  });
}

onLCP(sendToAnalytics);
onCLS(sendToAnalytics);
onINP(sendToAnalytics);

// Example strict CSP headers (Express)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://cdn.example.com'],
      styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https://images.example.com'],
      connectSrc: ["'self'", 'https://api.example.com'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    },
  })
);`
        },
        stepByStep: [
          'Instrument web-vitals reporting to monitor real-user metrics.',
          'Prioritize fixes for worst-performing pages and devices.',
          'Conduct security audits: dependency scanning, penetration tests, threat modeling workshops.',
          'Harden CSP, enforce HTTPS/HSTS, and document compliance with legal/regulatory teams.'
        ],
        realWorldUseCase:
          'Tracking Web Vitals in production ensures interview candidates experience fast pages while security posture meets enterprise client demands.',
        commonMistakes: [
          'Chasing synthetic Lighthouse scores without real-user monitoring.',
          'Overly restrictive CSP breaking third-party integrations without monitoring.',
          'Ignoring updates to web vital metrics (e.g., INP replacing FID).'
        ],
        interviewQuestions: [
          'How do you balance performance optimization with security policies?',
          'Explain how you’d respond to a Core Web Vital regression in production.',
          'What’s your approach to threat modeling for new features?'
        ],
        keyTakeaways: [
          'Real-user monitoring complements synthetic performance tests.',
          'Security and performance must evolve with framework changes and regulatory updates.',
          'Collaborate across teams (security, SRE, product) to maintain standards.'
        ],
        quickLinks: [
          { label: 'Web Vitals (web.dev)', url: 'https://web.dev/vitals/' },
          { label: 'OWASP Threat Modeling Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html' }
        ]
      }
    ]
  },
  {
    id: 'leadership-soft-skills',
    trackId: 'senior',
    title: 'Leadership & Soft Skills',
    summary:
      'Lead teams with strong communication, mentoring, and hiring practices while fostering debugging excellence and shared ownership.',
    subtopics: [
      {
        id: 'communicating-tradeoffs',
        title: 'Communicating Trade-offs & Mentoring',
        seoTitle: 'Explain Technical Trade-offs and Mentor Engineering Teams',
        oneLiner: 'Translate complex decisions for diverse audiences and grow team capabilities.',
        importance:
          'Senior roles hinge on clear communication—aligning stakeholders, mentoring, and resolving conflicts.',
        commonQuestions: [
          'How do you present technical options to non-technical stakeholders?',
          'What frameworks help prioritize engineering work?',
          'How do you mentor junior engineers effectively?'
        ],
        conceptDescription: [
          'Use decision documents (ADR, RFC) to articulate context, options, trade-offs, and recommendations.',
          'Leverage frameworks like RICE (Reach, Impact, Confidence, Effort) or MoSCoW for prioritization.',
          'Mentoring involves pairing, code reviews, goal setting, and providing actionable feedback.',
          'Foster a culture of written documentation and shared ownership.'
        ],
        codeExample: {
          language: 'md',
          caption: 'Architecture Decision Record (ADR) template',
          snippet: `# ADR 012: Adopt Next.js for Hybrid Rendering

- **Status:** Accepted
- **Context:** Marketing pages need SEO + personalization, dashboards need SPA interactivity.
- **Options:**
  1. Continue SPA-only approach with client-side rendering.
  2. Adopt Next.js for SSR/SSG hybrid model.
  3. Build custom SSR layer.
- **Decision:** Adopt Next.js to leverage ISR, built-in routing, and API routes.
- **Consequences:**
  - Pros: Improved SEO, shared rendering infrastructure, developer familiarity.
  - Cons: Requires Node hosting, additional build complexity, training for team.
- **Follow-up:** Train team on Next.js conventions; update CI/CD pipeline for SSR deploys.`
        },
        stepByStep: [
          'Gather requirements and constraints before proposing solutions.',
          'Outline options with pros/cons, impact, and risks in written form.',
          'Facilitate discussions that empower teams to challenge assumptions.',
          'Provide mentorship plans aligning individual growth with business goals.'
        ],
        realWorldUseCase:
          'Introducing Next.js required buy-in from product, marketing, and engineering; ADRs and workshops aligned all stakeholders.',
        commonMistakes: [
          'Relying solely on verbal communication—lack of written traceability.',
          'Ignoring stakeholder concerns leading to resistance later.',
          'Mentoring sporadically instead of establishing consistent feedback loops.'
        ],
        interviewQuestions: [
          'Describe a time you communicated a controversial technical decision.',
          'How do you mentor engineers struggling with performance issues?',
          'What artifacts help maintain alignment across distributed teams?'
        ],
        keyTakeaways: [
          'Senior engineers write clearly, communicate trade-offs, and document decisions.',
          'Mentorship is proactive and tailored to individual goals.',
          'Decision records create institutional memory and transparency.'
        ],
        quickLinks: [
          { label: 'Lightweight Architecture Decision Records', url: 'https://adr.github.io/' },
          { label: 'RICE Prioritization', url: 'https://www.productplan.com/glossary/rice-scoring-model/' }
        ]
      },
      {
        id: 'debugging-postmortems',
        title: 'Debugging Frameworks & Post-Mortem Culture',
        seoTitle: 'Build Robust Debugging Practices and Blameless Post-Mortems',
        oneLiner: 'Enable rapid incident response and organizational learning.',
        importance:
          'Senior engineers set the tone for how teams handle outages, debugging, and knowledge sharing.',
        commonQuestions: [
          'What is your approach to high-severity incident response?',
          'How do you run blameless post-mortems?',
          'How do you ensure corrective actions are implemented?'
        ],
        conceptDescription: [
          'Adopt incident response playbooks with clear roles (incident commander, scribe, comms).',
          'Use observability tools (Sentry, Datadog, Grafana) to triage client and server issues.',
          'Post-mortems focus on system improvements, not individual blame—document timeline, root cause, corrective actions.',
          'Share learnings via knowledge bases, lunch-and-learns, or runbooks.'
        ],
        codeExample: {
          language: 'md',
          caption: 'Post-mortem template snippet',
          snippet: `# Post-Mortem: Frontend Cache Incident
- **Date:** 2025-02-14
- **Impact:** Users saw stale mentor availability for 4 hours.
- **Timeline:**
  - 09:10 UTC – Incident detected via RUM alert (LCP regression).
  - 09:20 UTC – Incident commander assigned, Slack bridge opened.
  - 09:35 UTC – Root cause identified: CDN cache invalidation script failure.
  - 10:10 UTC – Fix applied, caches purged.
- **Root Cause:** Missing error handling in invalidate-cdn.js script.
- **Corrective Actions:**
  1. Add retries and alerts to CDN invalidation script.
  2. Implement feature flag to bypass stale cache.
  3. Update CI pipeline to validate purge success.
- **Lessons Learned:** Ensure alert coverage for cache latency; expand runbook.`
        },
        stepByStep: [
          'Establish incident response roles and communication channels.',
          'Leverage logs, metrics, and traces to expedite root-cause analysis.',
          'Conduct blameless post-mortems with actionable follow-ups.',
          'Track remediation tasks to completion and disseminate findings.'
        ],
        realWorldUseCase:
          'A CDN issue once served stale content; post-mortem reforms introduced automated cache verification and improved runbooks.',
        commonMistakes: [
          'Blaming individuals instead of addressing systemic gaps.',
          'Skipping post-mortems for “small” incidents, losing learning opportunities.',
          'Failing to track remediation tasks, leading to repeat incidents.'
        ],
        interviewQuestions: [
          'Describe a time you led an incident response.',
          'How do you differentiate symptoms from root cause?',
          'What techniques turn incidents into learning opportunities?'
        ],
        keyTakeaways: [
          'Structured incident response reduces MTTR (mean time to resolve).',
          'Blameless culture encourages transparency and continuous improvement.',
          'Documentation and follow-through prevent recurrence.'
        ],
        quickLinks: [
          { label: 'Google SRE Postmortem Guide', url: 'https://sre.google/sre-book/postmortem-culture/' },
          { label: 'PagerDuty Incident Response', url: 'https://response.pagerduty.com/' }
        ]
      },
      {
        id: 'hiring-architecture-reviews',
        title: 'Hiring, Leveling, and Architecture Reviews',
        seoTitle: 'Lead Hiring Rubrics and Architecture Reviews for Frontend Teams',
        oneLiner: 'Evaluate candidates, standardize leveling, and run architecture reviews effectively.',
        importance:
          'Senior leaders influence team composition and ensure architectural decisions meet long-term objectives.',
        commonQuestions: [
          'How do you design fair hiring rubrics for frontend roles?',
          'What is your process for architecture reviews?',
          'How do you mentor engineers through live coding interviews?'
        ],
        conceptDescription: [
          'Define hiring rubrics by skill areas (JS fundamentals, architecture, leadership) with observable behaviors.',
          'Leveling frameworks align expectations for IC vs EM tracks, providing clear promotion paths.',
          'Architecture reviews evaluate proposals on scalability, maintainability, security, and alignment with principles.',
          'Guiding interviews involves setting expectations, offering hints, and assessing problem-solving, not just code.'
        ],
        codeExample: {
          language: 'md',
          caption: 'Sample frontend senior hiring rubric snippet',
          snippet: `## Senior Frontend Engineer Rubric

### Technical Expertise
- **JavaScript/TypeScript:** Proficient with async patterns, performance profiling, language internals.
- **Architecture:** Can design modular frontends, evaluate rendering strategies, and integrate with backend APIs.
- **Tooling:** Experience with bundlers/build pipelines, CI/CD, feature flags.

### Leadership
- **Mentorship:** Coaches engineers, leads design sessions, provides actionable feedback.
- **Communication:** Explains trade-offs to diverse stakeholders, writes RFCs/ADRs.
- **Execution:** Drives cross-team initiatives, manages ambiguity, improves processes.

### Evaluation Signals
- Uses structured approach to system design problems.
- Articulates performance/security considerations without prompting.
- Demonstrates empathy and clear communication during pair exercises.`
        },
        stepByStep: [
          'Document competencies and behaviors for each level before interviewing.',
          'Train interviewers and calibrate with shadow sessions.',
          'Run architecture reviews with structured templates and time-boxed discussions.',
          'Provide feedback loops for candidates and team members to improve the process.'
        ],
        realWorldUseCase:
          'Scaling the interview prep product required hiring multiple senior engineers—rubrics and architecture review boards ensured consistency.',
        commonMistakes: [
          'Allowing ad-hoc interviews without rubric alignment.',
          'Architecture reviews devolving into opinion debates without clear criteria.',
          'Letting data remain siloed—no feedback to improve hiring/interview processes.'
        ],
        interviewQuestions: [
          'How do you avoid bias in hiring decisions?',
          'Describe a challenging architecture review you led.',
          'How do you evaluate leadership potential in interviews?'
        ],
        keyTakeaways: [
          'Standardized rubrics and leveling frameworks create fair, transparent hiring.',
          'Architecture reviews need structure, documentation, and accountability.',
          'Senior leaders mentor through interviews, ensuring positive candidate experience.'
        ],
        quickLinks: [
          { label: 'Guide to Technical Hiring', url: 'https://lethain.com/technical-hiring/#rubrics' },
          { label: 'Architecture Review Playbook', url: 'https://martinfowler.com/articles/architecture-review.html' }
        ]
      }
    ]
  },
  {
    id: 'machine-coding',
    trackId: 'senior',
    title: 'Machine Coding Challenge',
    summary:
      'Practice a senior-level machine coding exercise that assesses architecture choices, state management, performance, and testing rigor within tight timeframes.',
    subtopics: [
      {
        id: 'machine-coding-question',
        title: 'Session Scheduling Dashboard — Machine Coding',
        seoTitle: 'Machine Coding: Build a Real-Time Session Scheduling Dashboard',
        oneLiner: 'Implement a feature-complete dashboard under interview constraints showcasing architecture and trade-offs.',
        importance:
          'Senior interviews often include machine coding to evaluate practical architecture, code quality, and decision-making speed.',
        commonQuestions: [
          'How do you structure the application for scalability under time pressure?',
          'How do you incorporate tests and accessibility considerations within the session?',
          'What trade-offs do you make when time is limited?'
        ],
        conceptDescription: [
          'Requirements: list interview sessions, filter by mentor, apply real-time updates (WebSocket/polling), support offline notes.',
          'Expectations: clean component architecture, sensible state management, optimistic updates, error handling, tests for critical logic.',
          'Evaluation: modularity, readability, performance considerations, accessibility (ARIA labels, keyboard navigation).',
          'Deliverables: running app, README explaining architecture decisions, limited test coverage focusing on key flows.'
        ],
        codeExample: {
          language: 'md',
          caption: 'Machine coding requirements excerpt',
          snippet: `## Senior Machine Coding — Session Dashboard

### Requirements
1. Display a grid of upcoming sessions with mentor, candidate, status, and start time.
2. Filters: by mentor, status; search by candidate name.
3. Real-time updates: simulate WebSocket feed or use polling every 15s.
4. Offline notes: allow adding notes per session stored locally (persist across refresh).
5. Error states: show banner when API fails; retry manually.

### Expectations
- Preferred stack: React + TypeScript + Vite (or Next.js).
- State management: Context/Zustand/Redux Toolkit — justify your choice.
- Tests: unit test session reducer/hook + component test for filters.
- Accessibility: keyboard navigation, ARIA labels for status badges.
- Documentation: short README capturing architecture, trade-offs, improvements.

### Bonus
- Implement optimistic updates when updating session status.
- Provide dark/light theme toggle with persisted preference.`
        },
        stepByStep: [
          'Plan architecture (component tree, state management, services) before coding.',
          'Stub API layer (mock adapters) and WebSocket/poll simulation for real-time updates.',
          'Implement core UI with accessibility hooks and responsive layout.',
          'Add tests for reducers/hooks, ensure lint/test pass, and write README summarizing decisions.'
        ],
        realWorldUseCase:
          'Senior machine coding interviews simulate building dashboards or admin tools needing real-time updates and resilient UX.',
        commonMistakes: [
          'Diving into coding without noting architecture leading to messy components.',
          'Skipping error states and accessibility despite being part of evaluation.',
          'Neglecting to explain trade-offs in README or final discussion.'
        ],
        interviewQuestions: [
          'How would you evolve this prototype into production-ready architecture?',
          'What trade-offs did you make due to time constraints?',
          'How would you ensure consistency when multiple teams extend this dashboard?'
        ],
        keyTakeaways: [
          'Structured approach and clear communication matter more than feature count.',
          'Tests, accessibility, and documentation differentiate senior-level solutions.',
          'Always explain trade-offs and future improvements in retrospection.'
        ],
        quickLinks: [
          { label: 'React Testing Library Patterns', url: 'https://testing-library.com/docs/react-testing-library/example-intro/' },
          { label: 'ARIA Authoring Practices', url: 'https://www.w3.org/WAI/ARIA/apg/' }
        ]
      }
    ]
  }
]

